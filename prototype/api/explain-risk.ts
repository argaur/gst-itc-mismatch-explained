import type {
  ResponsibleParty,
  RiskItem,
} from "../src/contracts/riskAssessment.js";
import { riskCase } from "../src/data/riskCase.js";
import { assessRisk } from "../src/domain/assessRisk.js";

declare const process: {
  env: Record<string, string | undefined>;
};

const ALLOWED_CASE_ID = "DEMO-RISK-CASE-01";
const DEFAULT_MODEL = "gpt-5.6-terra";
const DEFAULT_TIMEOUT_MS = 12_000;
const MAX_OUTPUT_TOKENS = 500;
const MAX_REQUEST_BYTES = 512;
const MAX_UPSTREAM_RESPONSE_BYTES = 64_000;

type Language = "en" | "hi";

type ExplainRiskErrorCode =
  | "invalid_request"
  | "unknown_case"
  | "service_not_configured"
  | "model_timeout"
  | "model_refusal"
  | "invalid_model_output"
  | "rate_limited"
  | "upstream_failure";

interface ModelSentence {
  rowId: string;
  sentence: string;
}

interface ExplainRiskSuccess {
  ok: true;
  data: {
    caseId: string;
    language: Language;
    generatedAt: string;
    sentences: ModelSentence[];
  };
}

interface ExplainRiskFailure {
  ok: false;
  error: {
    code: ExplainRiskErrorCode;
    message: string;
    retryable: boolean;
  };
}

type ExplainRiskResponse = ExplainRiskSuccess | ExplainRiskFailure;

interface ApprovedRequest {
  caseId: typeof ALLOWED_CASE_ID;
  language: Language;
}

type SafeLogEvent = {
  event: "risk_explanation_succeeded" | "risk_explanation_failed";
  caseId: typeof ALLOWED_CASE_ID;
  latencyMs: number;
  errorCode?: ExplainRiskErrorCode;
};

export interface RateLimiter {
  allow(key: string, nowMs: number): boolean;
}

export interface ExplainRiskHandlerDependencies {
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
  ExplainRiskErrorCode,
  { status: number; message: string; retryable: boolean }
> = {
  invalid_request: {
    status: 400,
    message: "Send only the approved synthetic case ID and language.",
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
      "The plain-language service is not configured. The deterministic evidence is still available.",
    retryable: false,
  },
  model_timeout: {
    status: 504,
    message:
      "The plain-language summary took too long. The deterministic evidence is still available.",
    retryable: true,
  },
  model_refusal: {
    status: 422,
    message:
      "The model did not produce a summary. The deterministic evidence is still available.",
    retryable: true,
  },
  invalid_model_output: {
    status: 502,
    message:
      "The plain-language summary could not be verified. The deterministic evidence is still available.",
    retryable: true,
  },
  rate_limited: {
    status: 429,
    message:
      "Too many summary requests. Wait briefly; the deterministic evidence is still available.",
    retryable: true,
  },
  upstream_failure: {
    status: 502,
    message:
      "The plain-language service is unavailable. The deterministic evidence is still available.",
    retryable: true,
  },
};

function jsonResponse(body: ExplainRiskResponse, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

function errorResponse(code: ExplainRiskErrorCode): Response {
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

function requestClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0].trim();
  const direct = request.headers.get("x-real-ip")?.trim();
  return (forwarded || direct || "anonymous").slice(0, 64);
}

async function readApprovedRequest(
  request: Request,
): Promise<ApprovedRequest | ExplainRiskErrorCode> {
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
    keys.length !== 2 ||
    keys[0] !== "caseId" ||
    keys[1] !== "language"
  ) {
    return "invalid_request";
  }

  if (typeof parsed.caseId !== "string") return "invalid_request";
  if (parsed.caseId !== ALLOWED_CASE_ID) return "unknown_case";
  if (parsed.language !== "en" && parsed.language !== "hi") {
    return "invalid_request";
  }

  return {
    caseId: ALLOWED_CASE_ID,
    language: parsed.language,
  };
}

function partyLabel(
  party: ResponsibleParty,
  language: Language,
): string {
  const labels: Record<Language, Record<ResponsibleParty, string>> = {
    en: {
      supplier: "supplier",
      you: "you",
      rules: "rules",
      nobody: "nobody",
    },
    hi: {
      supplier: "सप्लायर",
      you: "आप",
      rules: "नियम",
      nobody: "किसी की गलती नहीं",
    },
  };

  return labels[language][party];
}

function createRiskExplanationSchema(items: RiskItem[]): Record<string, unknown> {
  return {
    type: "object",
    additionalProperties: false,
    required: ["sentences"],
    properties: {
      sentences: {
        type: "array",
        minItems: items.length,
        maxItems: items.length,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["rowId", "sentence"],
          properties: {
            rowId: {
              type: "string",
              enum: items.map((item) => item.rowId),
            },
            sentence: {
              type: "string",
              minLength: 1,
              maxLength: 500,
            },
          },
        },
      },
    },
  };
}

function createOpenAiRequestBody(language: Language): Record<string, unknown> {
  // Risk assessment is rerun for every call so browser data can never become evidence.
  const result = assessRisk(riskCase);
  const items = result.items.filter((item) => item.amountAtRisk > 0);

  const trustedFindings = items.map((item) => ({
    rowId: item.rowId,
    supplierName: item.supplierName,
    amountAtRisk: item.amountAtRisk,
    whoCausedIt: item.whoCausedIt,
    whyItMatters: item.whyItMatters,
    evidenceFields: item.evidenceFields,
    requiredText: {
      supplierName: item.supplierName,
      amount: `₹${item.amountAtRisk}`,
      responsibleParty: partyLabel(item.whoCausedIt, language),
      actionDeadline: result.actionDeadline,
    },
  }));

  return {
    model: DEFAULT_MODEL,
    store: false,
    reasoning: { effort: "low" },
    max_output_tokens: MAX_OUTPUT_TOKENS,
    tools: [],
    instructions: [
      "Write one short plain-language sentence for every supplied finding.",
      language === "hi"
        ? "Write in simple Hindi."
        : "Write in simple English.",
      "Use only the supplied findings.",
      "Each sentence must contain the four requiredText values exactly as supplied: supplierName, amount, responsibleParty, and actionDeadline.",
      "Do not calculate an amount, add a number, invent a finding, decide eligibility, give tax advice, or mention an invoice number.",
      "Return each supplied rowId exactly once.",
    ].join(" "),
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: JSON.stringify({
              task: "Explain the deterministic at-risk findings in plain language.",
              language,
              trustedSyntheticFindings: trustedFindings,
            }),
          },
        ],
      },
    ],
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name: "grounded_risk_explanation",
        strict: true,
        schema: createRiskExplanationSchema(items),
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

function normalizeDigits(value: string): string {
  const devanagariDigits = "०१२३४५६७८९";

  return value
    .replace(/[०-९]/g, (digit) =>
      String(devanagariDigits.indexOf(digit)),
    )
    .replace(/,/g, "");
}

function validateModelSentences(
  value: unknown,
  language: Language,
): ModelSentence[] {
  if (!isRecord(value) || !Array.isArray(value.sentences)) {
    throw new Error("Model output must contain sentences.");
  }

  const result = assessRisk(riskCase);
  const items = result.items.filter((item) => item.amountAtRisk > 0);
  const itemById = new Map(items.map((item) => [item.rowId, item]));
  const seen = new Set<string>();
  const validated: ModelSentence[] = [];

  if (value.sentences.length !== items.length) {
    throw new Error("Model output must explain every at-risk finding once.");
  }

  for (const candidate of value.sentences) {
    if (
      !isRecord(candidate) ||
      typeof candidate.rowId !== "string" ||
      typeof candidate.sentence !== "string"
    ) {
      throw new Error("Each model sentence must have a rowId and sentence.");
    }

    const item = itemById.get(candidate.rowId);
    if (!item || seen.has(candidate.rowId)) {
      throw new Error("Model output contains an unknown or duplicate rowId.");
    }

    const sentence = candidate.sentence.trim();
    const normalizedSentence = normalizeDigits(sentence);
    const requiredAmount = `₹${item.amountAtRisk}`;
    const requiredParty = partyLabel(item.whoCausedIt, language);

    if (
      sentence.length === 0 ||
      sentence.length > 500 ||
      !sentence.includes(item.supplierName) ||
      !normalizedSentence.includes(requiredAmount) ||
      !sentence.includes(requiredParty) ||
      !normalizedSentence.includes(result.actionDeadline)
    ) {
      throw new Error("A model sentence is not grounded in its finding.");
    }

    const allowedNumbers = new Set([
      String(item.amountAtRisk),
      ...result.actionDeadline.split("-"),
    ]);
    const numbers = normalizedSentence.match(/\d+/g) ?? [];
    if (numbers.some((number) => !allowedNumbers.has(number))) {
      throw new Error("A model sentence contains an unsupported number.");
    }

    seen.add(candidate.rowId);
    validated.push({
      rowId: candidate.rowId,
      sentence,
    });
  }

  return validated;
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "AbortError" || /abort/i.test(error.message))
  );
}

export function createExplainRiskHandler(
  dependencies: ExplainRiskHandlerDependencies,
): (request: Request) => Promise<Response> {
  return async (request) => {
    const startedAt = dependencies.now().getTime();
    const approved = await readApprovedRequest(request);
    if (typeof approved === "string") return errorResponse(approved);

    const apiKey = dependencies.env.OPENAI_API_KEY?.trim();
    if (!apiKey) return errorResponse("service_not_configured");

    const rateKey =
      `${ALLOWED_CASE_ID}:${requestClientKey(request)}:${approved.language}`;
    if (!dependencies.rateLimiter.allow(rateKey, startedAt)) {
      return errorResponse("rate_limited");
    }

    const requestBody = createOpenAiRequestBody(approved.language);
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
      const code: ExplainRiskErrorCode = isAbortError(error)
        ? "model_timeout"
        : "upstream_failure";

      dependencies.logger({
        event: "risk_explanation_failed",
        caseId: ALLOWED_CASE_ID,
        latencyMs: dependencies.now().getTime() - startedAt,
        errorCode: code,
      });
      return errorResponse(code);
    } finally {
      clearTimeout(timeout);
    }

    if (!upstream.ok) {
      const code: ExplainRiskErrorCode =
        upstream.status === 429
          ? "rate_limited"
          : upstream.status === 408 || upstream.status === 504
            ? "model_timeout"
            : "upstream_failure";

      dependencies.logger({
        event: "risk_explanation_failed",
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
      const sentences = validateModelSentences(
        modelPayload,
        approved.language,
      );

      dependencies.logger({
        event: "risk_explanation_succeeded",
        caseId: ALLOWED_CASE_ID,
        latencyMs: dependencies.now().getTime() - startedAt,
      });

      return jsonResponse(
        {
          ok: true,
          data: {
            caseId: ALLOWED_CASE_ID,
            language: approved.language,
            generatedAt: dependencies.now().toISOString(),
            sentences,
          },
        },
        200,
      );
    } catch {
      dependencies.logger({
        event: "risk_explanation_failed",
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
      : `/${request.url ?? "api/explain-risk"}`;
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

const productionDependencies: ExplainRiskHandlerDependencies = {
  fetchImpl: fetch,
  env: typeof process === "undefined" ? {} : process.env,
  now: () => new Date(),
  logger: (event) => console.info(JSON.stringify(event)),
  rateLimiter: sharedRateLimiter,
  timeoutMs: DEFAULT_TIMEOUT_MS,
};

const productionWebHandler = createExplainRiskHandler(
  productionDependencies,
);

export default createNodeHandler(productionWebHandler);
