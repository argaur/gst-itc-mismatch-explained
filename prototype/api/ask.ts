import { riskCase } from "../src/data/riskCase.js";
import { assessRisk } from "../src/domain/assessRisk.js";
import {
  assertQuestionAcceptable,
  buildAnswerModelInput,
  createAnswerJsonSchema,
  validateModelAnswer,
  type ValidatedAnswer,
} from "../src/services/answerValidator.js";

declare const process: {
  env: Record<string, string | undefined>;
};

const ALLOWED_CASE_ID = "DEMO-RISK-CASE-01";
const MAX_REQUEST_BYTES = 2_048;
const MAX_UPSTREAM_RESPONSE_BYTES = 32_000;
const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_MODEL = "gpt-5.6-terra";
const MAX_OUTPUT_TOKENS = 400;

export type AskErrorCode =
  | "invalid_request"
  | "unknown_case"
  | "service_not_configured"
  | "model_timeout"
  | "model_refusal"
  | "invalid_model_output"
  | "rate_limited"
  | "upstream_failure";

export interface AskError {
  code: AskErrorCode;
  message: string;
  retryable: boolean;
}

export type AskResponse =
  | { ok: true; data: ValidatedAnswer }
  | { ok: false; error: AskError };

type Language = "hi" | "en";

interface ApprovedRequest {
  question: string;
  language: Language;
}

type SafeLogEvent = {
  event: "answer_succeeded" | "answer_failed";
  caseId: typeof ALLOWED_CASE_ID;
  latencyMs: number;
  errorCode?: AskErrorCode;
};

export interface RateLimiter {
  allow(key: string, nowMs: number): boolean;
}

export interface AskHandlerDependencies {
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

const ERROR_DETAILS: Record<
  AskErrorCode,
  { status: number; message: string; retryable: boolean }
> = {
  invalid_request: {
    status: 400,
    message:
      "Send the approved synthetic case ID, a question of 300 characters or fewer, and a supported language.",
    retryable: false,
  },
  unknown_case: {
    status: 404,
    message: "That synthetic risk case is not available.",
    retryable: false,
  },
  service_not_configured: {
    status: 503,
    message:
      "The answer service is not configured. The deterministic risk list is still available.",
    retryable: false,
  },
  model_timeout: {
    status: 504,
    message:
      "The answer took too long. The deterministic risk list is still available.",
    retryable: true,
  },
  model_refusal: {
    status: 422,
    message:
      "The model did not produce an answer. The deterministic risk list is still available.",
    retryable: true,
  },
  invalid_model_output: {
    status: 502,
    message:
      "The answer could not be verified and was not shown. The deterministic risk list is still available.",
    retryable: true,
  },
  rate_limited: {
    status: 429,
    message:
      "Too many questions were sent. Wait briefly; the deterministic risk list remains available.",
    retryable: true,
  },
  upstream_failure: {
    status: 502,
    message:
      "The answer service is unavailable. The deterministic risk list is still available.",
    retryable: true,
  },
};

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

function jsonResponse(body: AskResponse, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function errorResponse(code: AskErrorCode): Response {
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
): Promise<ApprovedRequest | AskErrorCode> {
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

  const keys = Object.keys(parsed).sort();
  if (
    keys.length !== 3 ||
    keys[0] !== "caseId" ||
    keys[1] !== "language" ||
    keys[2] !== "question"
  ) {
    return "invalid_request";
  }

  if (typeof parsed.caseId !== "string") return "invalid_request";
  if (parsed.caseId !== ALLOWED_CASE_ID) return "unknown_case";
  if (parsed.language !== "hi" && parsed.language !== "en") {
    return "invalid_request";
  }

  let question: string;
  try {
    question = assertQuestionAcceptable(parsed.question);
  } catch {
    return "invalid_request";
  }

  return {
    question,
    language: parsed.language,
  };
}

function createOpenAiRequestBody(
  question: string,
  language: Language,
): Record<string, unknown> {
  // Risk is reassessed for every call. Browser state can never become evidence.
  const result = assessRisk(riskCase);

  return {
    model: DEFAULT_MODEL,
    store: false,
    reasoning: { effort: "low" },
    max_output_tokens: MAX_OUTPUT_TOKENS,
    tools: [],
    instructions: [
      "Answer only from the supplied deterministic findings.",
      "Reply in the requested language using short plain sentences a person with no tax training can read.",
      "Never give tax advice or decide eligibility.",
      "Never state a number that is not present in the supplied findings.",
      "Cite every finding used by its exact rowId.",
      "If the question cannot be answered from the findings, set answerable to false, cite no rows, and direct the person to a qualified GST professional.",
    ].join(" "),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify(
              buildAnswerModelInput(result, question, language),
            ),
          },
        ],
      },
    ],
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "grounded_risk_answer",
        strict: true,
        schema: createAnswerJsonSchema(),
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

function logFailure(
  dependencies: AskHandlerDependencies,
  startedAt: number,
  code: AskErrorCode,
): void {
  dependencies.logger({
    event: "answer_failed",
    caseId: ALLOWED_CASE_ID,
    latencyMs: dependencies.now().getTime() - startedAt,
    errorCode: code,
  });
}

export function createAskHandler(
  dependencies: AskHandlerDependencies,
): (request: Request) => Promise<Response> {
  return async (request) => {
    const startedAt = dependencies.now().getTime();
    const approved = await readApprovedRequest(request);

    if (typeof approved === "string") {
      return errorResponse(approved);
    }

    const apiKey = dependencies.env.OPENAI_API_KEY?.trim();
    if (!apiKey) return errorResponse("service_not_configured");

    const rateKey = `${ALLOWED_CASE_ID}:${requestClientKey(request)}`;
    if (!dependencies.rateLimiter.allow(rateKey, startedAt)) {
      return errorResponse("rate_limited");
    }

    const requestBody = createOpenAiRequestBody(
      approved.question,
      approved.language,
    );
    requestBody.model =
      dependencies.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      dependencies.timeoutMs,
    );

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
      const code: AskErrorCode = isAbortError(error)
        ? "model_timeout"
        : "upstream_failure";
      logFailure(dependencies, startedAt, code);
      return errorResponse(code);
    } finally {
      clearTimeout(timeout);
    }

    if (!upstream.ok) {
      const code: AskErrorCode =
        upstream.status === 429
          ? "rate_limited"
          : upstream.status === 408 || upstream.status === 504
            ? "model_timeout"
            : "upstream_failure";
      logFailure(dependencies, startedAt, code);
      return errorResponse(code);
    }

    let upstreamText: string;
    try {
      upstreamText = await upstream.text();
    } catch {
      logFailure(dependencies, startedAt, "upstream_failure");
      return errorResponse("upstream_failure");
    }

    if (
      new TextEncoder().encode(upstreamText).byteLength >
      MAX_UPSTREAM_RESPONSE_BYTES
    ) {
      logFailure(dependencies, startedAt, "invalid_model_output");
      return errorResponse("invalid_model_output");
    }

    let upstreamPayload: unknown;
    try {
      upstreamPayload = JSON.parse(upstreamText);
    } catch {
      logFailure(dependencies, startedAt, "invalid_model_output");
      return errorResponse("invalid_model_output");
    }

    const extracted = extractStructuredText(upstreamPayload);
    if (extracted.kind === "refusal") {
      logFailure(dependencies, startedAt, "model_refusal");
      return errorResponse("model_refusal");
    }
    if (extracted.kind === "invalid") {
      logFailure(dependencies, startedAt, "invalid_model_output");
      return errorResponse("invalid_model_output");
    }

    let modelPayload: unknown;
    try {
      modelPayload = JSON.parse(extracted.text);
    } catch {
      logFailure(dependencies, startedAt, "invalid_model_output");
      return errorResponse("invalid_model_output");
    }

    try {
      const result = assessRisk(riskCase);
      const validated = validateModelAnswer(modelPayload, result);

      dependencies.logger({
        event: "answer_succeeded",
        caseId: ALLOWED_CASE_ID,
        latencyMs: dependencies.now().getTime() - startedAt,
      });

      return jsonResponse({ ok: true, data: validated }, 200);
    } catch {
      logFailure(dependencies, startedAt, "invalid_model_output");
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
      : `/${request.url ?? "api/ask"}`;
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
    webResponse.headers.forEach((value, name) =>
      response.setHeader(name, value),
    );
    response.end(await webResponse.text());
  };
}

const productionDependencies: AskHandlerDependencies = {
  fetchImpl: fetch,
  env: typeof process === "undefined" ? {} : process.env,
  now: () => new Date(),
  logger: (event) => console.info(JSON.stringify(event)),
  rateLimiter: sharedRateLimiter,
  timeoutMs: DEFAULT_TIMEOUT_MS,
};

const productionWebHandler = createAskHandler(productionDependencies);

export default createNodeHandler(productionWebHandler);
