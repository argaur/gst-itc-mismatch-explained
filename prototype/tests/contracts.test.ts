import { describe, expect, it } from "vitest";
import {
  EXPLAIN_ERROR_CODES,
  type ExplainCaseRequest,
  type ExplainCaseResponse,
} from "../src/contracts/explanation";
import {
  RECONCILIATION_CATEGORIES,
  type DemoId,
} from "../src/contracts/reconciliation";

describe("shared contracts", () => {
  it("freezes the four reconciliation categories", () => {
    expect(RECONCILIATION_CATEGORIES).toEqual([
      "exact_match",
      "missing_in_2b",
      "possible_duplicate",
      "later_period_match",
    ]);
  });

  it("freezes typed explanation success and failure envelopes", () => {
    const request: ExplainCaseRequest = { caseId: "DEMO-CASE-01" };
    const success: ExplainCaseResponse = {
      ok: true,
      data: {
        caseId: request.caseId,
        summary: "Synthetic grounded summary.",
        findingExplanations: [
          {
            findingId: "DEMO-FINDING-LATER-01",
            evidenceIds: ["DEMO-WP-1042", "DEMO-2B-MAY-1042"],
            explanation: "The records appear in different synthetic periods.",
            whatToVerify: "Check the source records with a qualified professional.",
          },
        ],
        verificationChecklist: ["Check the synthetic source rows."],
        draftPartBText: "Prototype draft for professional review.",
        limitations: ["Not tax advice."],
        generatedAt: "2026-08-28T03:30:00.000Z",
      },
    };
    const failure: ExplainCaseResponse = {
      ok: false,
      error: {
        code: "model_timeout",
        message: "The explanation took too long. The evidence is still available.",
        retryable: true,
      },
    };

    expect(success.ok && success.data.caseId).toBe("DEMO-CASE-01");
    expect(!failure.ok && failure.error.code).toBe("model_timeout");
  });

  it("keeps all contract IDs synthetic and exposes stable failure codes", () => {
    const ids: DemoId[] = [
      "DEMO-CASE-01",
      "DEMO-FINDING-LATER-01",
      "DEMO-WP-1042",
    ];

    expect(ids.every((id) => id.startsWith("DEMO-"))).toBe(true);
    expect(EXPLAIN_ERROR_CODES).toEqual([
      "invalid_request",
      "unknown_case",
      "service_not_configured",
      "model_timeout",
      "model_refusal",
      "invalid_model_output",
      "rate_limited",
      "upstream_failure",
    ]);
  });
});
