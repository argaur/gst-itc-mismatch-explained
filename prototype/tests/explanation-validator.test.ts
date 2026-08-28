import { describe, expect, it } from "vitest";
import { demoCase } from "../src/data/demoCase";
import { reconcile } from "../src/domain/reconcile";
import {
  REQUIRED_LIMITATIONS,
  validateModelExplanation,
} from "../src/services/explanationValidator";

const reconciliation = reconcile(demoCase);

function validModelPayload(): Record<string, unknown> {
  return {
    summary:
      "Two synthetic reconciliation findings explain the complete difference. Review the linked evidence with a qualified GST professional.",
    findingExplanations: reconciliation.findings.map((finding) => ({
      findingId: finding.id,
      evidenceIds: finding.sourceRowIds,
      explanation:
        finding.category === "later_period_match"
          ? "The linked synthetic record appears in a later GSTR-2B period. This is timing evidence only."
          : "The same synthetic workpaper key appears more than once with one supporting GSTR-2B record. This needs verification.",
      whatToVerify:
        "Compare the linked synthetic source records with a qualified GST professional.",
    })),
    verificationChecklist: [
      "Compare each linked synthetic source record.",
      "Ask a qualified GST professional to review the evidence labels and draft.",
    ],
    draftPartBText:
      "Prototype draft for professional review: the synthetic records show a later-period match and a possible duplicate. Please verify both findings before deciding any response.",
    limitations: [...REQUIRED_LIMITATIONS],
  };
}

describe("grounded model-output validator", () => {
  it("accepts only a complete payload grounded to every trusted finding", () => {
    const result = validateModelExplanation(
      validModelPayload(),
      reconciliation,
      "2026-08-28T04:00:00.000Z",
    );

    expect(result.caseId).toBe("DEMO-CASE-01");
    expect(result.findingExplanations).toHaveLength(2);
    expect(result.limitations).toEqual(REQUIRED_LIMITATIONS);
    expect(result.generatedAt).toBe("2026-08-28T04:00:00.000Z");
  });

  it("rejects unknown finding and evidence IDs", () => {
    const unknownFinding = validModelPayload();
    const findingRows = unknownFinding.findingExplanations as Array<
      Record<string, unknown>
    >;
    findingRows[0].findingId = "DEMO-FINDING-UNKNOWN-99";

    expect(() =>
      validateModelExplanation(unknownFinding, reconciliation, new Date().toISOString()),
    ).toThrow(/finding/i);

    const unknownEvidence = validModelPayload();
    const evidenceRows = unknownEvidence.findingExplanations as Array<
      Record<string, unknown>
    >;
    evidenceRows[0].evidenceIds = ["DEMO-EVIDENCE-UNKNOWN-99"];

    expect(() =>
      validateModelExplanation(unknownEvidence, reconciliation, new Date().toISOString()),
    ).toThrow(/evidence/i);
  });

  it("rejects malformed shapes, extra keys, and missing mandatory limitations", () => {
    const malformed = validModelPayload();
    malformed.untrustedAdvice = "Pay now";
    expect(() =>
      validateModelExplanation(malformed, reconciliation, new Date().toISOString()),
    ).toThrow(/property|key/i);

    const missingLimitation = validModelPayload();
    missingLimitation.limitations = REQUIRED_LIMITATIONS.slice(0, -1);
    expect(() =>
      validateModelExplanation(
        missingLimitation,
        reconciliation,
        new Date().toISOString(),
      ),
    ).toThrow(/limitation/i);
  });

  it("rejects monetary claims and prescriptive tax or filing instructions", () => {
    const inventedAmount = validModelPayload();
    inventedAmount.summary = "The unsupported amount is ₹99,99,999.";
    expect(() =>
      validateModelExplanation(
        inventedAmount,
        reconciliation,
        new Date().toISOString(),
      ),
    ).toThrow(/monetary/i);

    const unsupportedInstruction = validModelPayload();
    unsupportedInstruction.draftPartBText =
      "Prototype draft: you should reverse the ITC and submit the response.";
    expect(() =>
      validateModelExplanation(
        unsupportedInstruction,
        reconciliation,
        new Date().toISOString(),
      ),
    ).toThrow(/instruction|advice/i);
  });
});
