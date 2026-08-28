import type { DemoId } from "./reconciliation";

export interface ExplainCaseRequest {
  caseId: DemoId;
}

export interface FindingExplanation {
  findingId: DemoId;
  evidenceIds: DemoId[];
  explanation: string;
  whatToVerify: string;
}

export interface ExplanationPayload {
  caseId: DemoId;
  summary: string;
  findingExplanations: FindingExplanation[];
  verificationChecklist: string[];
  draftPartBText: string;
  limitations: string[];
  generatedAt: string;
}

export const EXPLAIN_ERROR_CODES = [
  "invalid_request",
  "unknown_case",
  "service_not_configured",
  "model_timeout",
  "model_refusal",
  "invalid_model_output",
  "rate_limited",
  "upstream_failure",
] as const;

export type ExplainErrorCode = (typeof EXPLAIN_ERROR_CODES)[number];

export interface ExplainError {
  code: ExplainErrorCode;
  message: string;
  retryable: boolean;
}

export type ExplainCaseResponse =
  | { ok: true; data: ExplanationPayload }
  | { ok: false; error: ExplainError };
