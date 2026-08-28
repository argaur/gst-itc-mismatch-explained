import type {
  ExplainCaseResponse,
  ExplainErrorCode,
} from "../src/contracts/explanation.js";
import { demoCase } from "../src/data/demoCase.js";
import { reconcile } from "../src/domain/reconcile.js";
import {
  buildTrustedModelInput,
  createExplanationJsonSchema,
  validateModelExplanation,
} from "../src/services/explanationValidator.js";

declare const process: {
  env: Record<string, string | undefined>;
};

const ALLOWED_CASE_ID = "DEMO-CASE-01";
const MAX_REQUEST_BYTES = 256;
const MAX_UPSTREAM_RESPONSE_BYTES = 64_000;
const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_MODEL = "gpt-5.6-terra";
const MAX_OUTPUT_TOKENS = 1_800;

type SafeLogEvent = {
  event: "explanation_succeeded" | "explanation_failed";
  caseId: typeof ALLOWED_CASE_ID;
  latencyMs: number;
  errorCode?: ExplainErrorCode;
};

export interface RateLimiter {
  allow(key: string, nowMs: number): boolean;
}

export interface ExplainHandlerDependencies {
  fetchImpl: typeof fetch;
  env: Record<string, string | undefined>;
  now: () => Date;
  logger: (event: SafeLogEvent) => void;
  rateLimiter: RateLimiter;
  timeoutMs: number;
}

export interface VercelRequestLike {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface VercelResponseLike {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
}

export function createSlidingWindowRateLimiter(
  maxRequests: number,
  windowMs: number,
): RateLimiter {
  const requestsByClient = new Map<string, number[]>();

  return {
    allow(key, nowMs) {
      const windowStart = nowMs - windowMs;
      const recent = (requestsByClient.get(key) ?? []).filter(
        (timestamp) => timestamp > windowStart,
      );
      if (recent.length >= maxRequests) {
        requestsByClient.set(key, recent);
        return false;
      }
      recent.push(nowMs);
      requestsByClient.set(key, recent);

      if (requestsByClient.size > 500) {
        for (const [client, timestamps] of requestsByClient) {
          if (timestamps.every((timestamp) => timestamp <= windowStart)) {
            requestsByClient.delete(client);
          }
          if (requestsByClient.size <= 500) break;
        }
      }
      return true;
    },
  };
}

const sharedRateLimiter = createSlidingWindowRateLimiter(6, 60_000);

const ERROR_DETAILS: Record<
  ExplainErrorCode,
  { status: number; message: string; retryable: boolean }
> = {
  invalid_request: {
    status: 400,
    message: "Send only the approved synthetic case ID.",
    retryable: false,
  },
  unknown_case: {
    status: 404,
    message: "That synthetic demo case is not available.",
    retryable: false,
  },
  service_not_configured: {
    status: 503,
    message:
      "The explanation service is not configured. The deterministic evidence is still available.",
    retryable: false,
  },
  model_timeout: {
    status: 504,
    message:
      "The explanation took too long. The deterministic evidence is still available.",
    retryable: true,
  },
  model_refusal: {
    status: 422,
    message:
      "The model did not produce an explanation. The deterministic evidence is still available.",
    retryable: true,
  },
  invalid_model_output: {
    status: 502,
    message:
      "The explanation could not be verified. The deterministic evidence is still available.",
    retryable: true,
  },
  rate_limited: {
    status: 429,
    message:
      "Too many explanation requests. Wait briefly; the deterministic evidence remains available.",
    retryable: true,
  },
  upstream_failure: {
    status: 502,
    message:
      "The explanation service is unavailable. The deterministic evidence is still available.",
    retryable: true,
  },
};

function jsonResponse(body: ExplainCaseResponse, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function errorResponse(code: ExplainErrorCode): Response {
  const detail = ERROR_DETAILS[code];
  return jsonResponse(
    {
      ok: false,
      error: {
        code,
        message: detail.message,
        retryable: detail.retryable,
      },
    },
    detail.status,
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requestClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  const direct = request.headers.get("x-real-ip")?.trim();
  return (forwarded || direct || "anonymous").slice(0, 64);
}

async function readApprovedRequest(
  request: Request,
): Promise<"approved" | ExplainErrorCode> {
  if (request.method !== "POST") return "invalid_request";
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return "invalid_request";
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return "invalid_request";
  }

  let bodyText: string;
  try {
    bodyText = await request.text();
  } catch {
    return "invalid_request";
  }
  if (
    bodyText.length === 0 ||
    new TextEncoder().encode(bodyText).byteLength > MAX_REQUEST_BYTES
  ) {
    return "invalid_request";
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return "invalid_request";
  }
  if (!isRecord(parsed)) return "invalid_request";
  const keys = Object.keys(parsed);
  if (keys.length !== 1 || keys[0] !== "caseId") {
    return "invalid_request";
  }
  if (typeof parsed.caseId !== "string") return "invalid_request";
  if (parsed.caseId !== ALLOWED_CASE_ID) return "unknown_case";
  return "approved";
}

function createOpenAiRequestBody(): Record<string, unknown> {
  // Reconciliation is rerun for every call so browser data can never become evidence.
  const result = reconcile(demoCase);
  return {
    model: DEFAULT_MODEL,
    store: false,
    reasoning: { effort: "medium" },
    max_output_tokens: MAX_OUTPUT_TOKENS,
    tools: [],
    instructions: [
      "Explain only the trusted synthetic reconciliation evidence supplied by the server.",
      "Do not calculate, add facts, repeat monetary amounts in prose, give tax advice, determine eligibility or liability, or recommend filing, payment, reversal, or contesting.",
      "Use every finding exactly once with its exact finding and evidence IDs.",
      "Return the required limitation strings exactly and keep the Part B text neutral for professional review.",
    ].join(" "),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              task: "Produce a plain-language explanation and neutral prototype Part B draft.",
              trustedSyntheticEvidence: buildTrustedModelInput(result),
            }),
          },
        ],
      },
    ],
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "grounded_gst_explanation",
        strict: true,
        schema: createExplanationJsonSchema(result),
      },
    },
  };
}

function extractStructuredText(value: unknown):
  | { kind: "text"; text: string }
  | { kind: "refusal" }
  | { kind: "invalid" } {
  if (!isRecord(value)) return { kind: "invalid" };
  if (value.status !== "completed") return { kind: "invalid" };
  if (!Array.isArray(value.output)) return { kind: "invalid" };

  const textParts: string[] = [];
  for (const item of value.output) {
    if (!isRecord(item) || !Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (!isRecord(content)) continue;
      if (content.type === "refusal") return { kind: "refusal" };
      if (content.type === "output_text" && typeof content.text === "string") {
        textParts.push(content.text);
      }
    }
  }
  if (textParts.length !== 1) return { kind: "invalid" };
  return { kind: "text", text: textParts[0] };
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "AbortError" || /abort/i.test(error.message))
  );
}

export function createExplainHandler(
  dependencies: ExplainHandlerDependencies,
): (request: Request) => Promise<Response> {
  return async (request) => {
    const startedAt = dependencies.now().getTime();
    const approved = await readApprovedRequest(request);
    if (approved !== "approved") return errorResponse(approved);

    const apiKey = dependencies.env.OPENAI_API_KEY?.trim();
    if (!apiKey) return errorResponse("service_not_configured");

    const rateKey = `${ALLOWED_CASE_ID}:${requestClientKey(request)}`;
    if (!dependencies.rateLimiter.allow(rateKey, startedAt)) {
      return errorResponse("rate_limited");
    }

    const requestBody = createOpenAiRequestBody();
    requestBody.model = dependencies.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), dependencies.timeoutMs);

    let upstream: Response;
    try {
      upstream = await dependencies.fetchImpl(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        },
      );
    } catch (error) {
      clearTimeout(timeout);
      const code: ExplainErrorCode = isAbortError(error)
        ? "model_timeout"
        : "upstream_failure";
      dependencies.logger({
        event: "explanation_failed",
        caseId: ALLOWED_CASE_ID,
        latencyMs: dependencies.now().getTime() - startedAt,
        errorCode: code,
      });
      return errorResponse(code);
    } finally {
      clearTimeout(timeout);
    }

    if (!upstream.ok) {
      const code: ExplainErrorCode =
        upstream.status === 429
          ? "rate_limited"
          : upstream.status === 408 || upstream.status === 504
            ? "model_timeout"
            : "upstream_failure";
      dependencies.logger({
        event: "explanation_failed",
        caseId: ALLOWED_CASE_ID,
        latencyMs: dependencies.now().getTime() - startedAt,
        errorCode: code,
      });
      return errorResponse(code);
    }

    let upstreamText: string;
    try {
      upstreamText = await upstream.text();
    } catch {
      return errorResponse("upstream_failure");
    }
    if (
      new TextEncoder().encode(upstreamText).byteLength >
      MAX_UPSTREAM_RESPONSE_BYTES
    ) {
      return errorResponse("invalid_model_output");
    }

    let upstreamPayload: unknown;
    try {
      upstreamPayload = JSON.parse(upstreamText);
    } catch {
      return errorResponse("invalid_model_output");
    }
    const extracted = extractStructuredText(upstreamPayload);
    if (extracted.kind === "refusal") {
      return errorResponse("model_refusal");
    }
    if (extracted.kind === "invalid") {
      return errorResponse("invalid_model_output");
    }

    let modelPayload: unknown;
    try {
      modelPayload = JSON.parse(extracted.text);
    } catch {
      return errorResponse("invalid_model_output");
    }

    try {
      const result = reconcile(demoCase);
      const validated = validateModelExplanation(
        modelPayload,
        result,
        dependencies.now().toISOString(),
      );
      dependencies.logger({
        event: "explanation_succeeded",
        caseId: ALLOWED_CASE_ID,
        latencyMs: dependencies.now().getTime() - startedAt,
      });
      return jsonResponse({ ok: true, data: validated }, 200);
    } catch {
      dependencies.logger({
        event: "explanation_failed",
        caseId: ALLOWED_CASE_ID,
        latencyMs: dependencies.now().getTime() - startedAt,
        errorCode: "invalid_model_output",
      });
      return errorResponse("invalid_model_output");
    }
  };
}

function firstHeaderValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function nodeRequestBody(body: unknown): string | undefined {
  if (body === undefined) return undefined;
  if (typeof body === "string") return body;
  if (body instanceof Uint8Array) return new TextDecoder().decode(body);
  return JSON.stringify(body);
}

export function createNodeHandler(
  webHandler: (request: Request) => Promise<Response>,
): (request: VercelRequestLike, response: VercelResponseLike) => Promise<void> {
  return async (request, response) => {
    const headers = new Headers();
    for (const [name, value] of Object.entries(request.headers)) {
      if (value === undefined) continue;
      headers.set(name, Array.isArray(value) ? value.join(", ") : value);
    }

    const protocol =
      firstHeaderValue(request.headers["x-forwarded-proto"]) || "https";
    const host = firstHeaderValue(request.headers.host) || "localhost";
    const path = request.url?.startsWith("/")
      ? request.url
      : `/${request.url ?? "api/explain"}`;
    const method = request.method?.toUpperCase() || "GET";
    const body =
      method === "GET" || method === "HEAD"
        ? undefined
        : nodeRequestBody(request.body);
    const webRequest = new Request(`${protocol}://${host}${path}`, {
      method,
      headers,
      body,
    });
    const webResponse = await webHandler(webRequest);

    response.statusCode = webResponse.status;
    webResponse.headers.forEach((value, name) => response.setHeader(name, value));
    response.end(await webResponse.text());
  };
}

const productionDependencies: ExplainHandlerDependencies = {
  fetchImpl: fetch,
  env: typeof process === "undefined" ? {} : process.env,
  now: () => new Date(),
  logger: (event) => console.info(JSON.stringify(event)),
  rateLimiter: sharedRateLimiter,
  timeoutMs: DEFAULT_TIMEOUT_MS,
};

const productionWebHandler = createExplainHandler(productionDependencies);

export default createNodeHandler(productionWebHandler);
