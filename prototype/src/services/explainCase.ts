import type {
  ExplainCaseRequest,
  ExplainCaseResponse,
  ExplainErrorCode,
} from "../contracts/explanation.js";

const KNOWN_ERROR_CODES: ReadonlySet<string> = new Set<ExplainErrorCode>([
  "invalid_request",
  "unknown_case",
  "service_not_configured",
  "model_timeout",
  "model_refusal",
  "invalid_model_output",
  "rate_limited",
  "upstream_failure",
]);

function clientFailure(
  code: ExplainErrorCode,
  message: string,
  retryable: boolean,
): ExplainCaseResponse {
  return { ok: false, error: { code, message, retryable } };
}

function isSafeEnvelope(value: unknown): value is ExplainCaseResponse {
  if (typeof value !== "object" || value === null || !("ok" in value)) {
    return false;
  }
  const envelope = value as Record<string, unknown>;
  if (envelope.ok === true) {
    return typeof envelope.data === "object" && envelope.data !== null;
  }
  if (envelope.ok !== false || typeof envelope.error !== "object") {
    return false;
  }
  const error = envelope.error as Record<string, unknown>;
  return (
    typeof error.code === "string" &&
    KNOWN_ERROR_CODES.has(error.code) &&
    typeof error.message === "string" &&
    typeof error.retryable === "boolean"
  );
}

export async function requestCaseExplanation(
  request: ExplainCaseRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<ExplainCaseResponse> {
  try {
    const response = await fetchImpl("/api/explain", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ caseId: request.caseId }),
    });
    const payload: unknown = await response.json();
    if (!isSafeEnvelope(payload)) {
      return clientFailure(
        "invalid_model_output",
        "The explanation could not be verified. The deterministic evidence is still available.",
        true,
      );
    }
    return payload;
  } catch {
    return clientFailure(
      "upstream_failure",
      "The explanation service is unavailable. The deterministic evidence is still available.",
      true,
    );
  }
}
