import { describe, expect, it } from "vitest";

import type { RiskCase, RiskCategory } from "../src/contracts/riskAssessment";
import { riskCase } from "../src/data/riskCase";
import {
  assessRisk,
  classifyRiskRow,
  sortItemsForDisplay,
} from "../src/domain/assessRisk";

/**
 * Ground truth from `fixtures/answer-key.json`, produced by the generator.
 * Two rows are deliberately NOT at risk: an engine that flags everything fails
 * this key, which is the point.
 */
const ANSWER_KEY: ReadonlyArray<{
  rowId: string;
  expectedCategory: RiskCategory;
  expectedAmountAtRisk: number;
}> = [
  { rowId: "DEMO-ROW-0001", expectedCategory: "no_action_needed", expectedAmountAtRisk: 0 },
  { rowId: "DEMO-ROW-0002", expectedCategory: "no_action_needed", expectedAmountAtRisk: 0 },
  { rowId: "DEMO-ROW-0003", expectedCategory: "credit_note_reducing_itc", expectedAmountAtRisk: 86_400 },
  { rowId: "DEMO-ROW-0004", expectedCategory: "supplier_not_filed", expectedAmountAtRisk: 152_000 },
  { rowId: "DEMO-ROW-0005", expectedCategory: "deemed_accept_harmless", expectedAmountAtRisk: 0 },
  { rowId: "DEMO-ROW-0006", expectedCategory: "itc_not_available", expectedAmountAtRisk: 22_000 },
  { rowId: "DEMO-ROW-0007", expectedCategory: "wrongly_rejected", expectedAmountAtRisk: 64_000 },
];

const EXPECTED_TOTAL_AT_RISK = 324_400;
const EXPECTED_SILENT_LOSS = 86_400;

describe("assessRisk scored against the answer key", () => {
  const result = assessRisk(riskCase, "2026-09-15");

  it("classifies every row exactly as the answer key expects", () => {
    for (const expected of ANSWER_KEY) {
      const item = result.items.find((candidate) => candidate.rowId === expected.rowId);
      expect(item, `missing row ${expected.rowId}`).toBeDefined();
      expect(item!.category).toBe(expected.expectedCategory);
      expect(item!.amountAtRisk).toBe(expected.expectedAmountAtRisk);
    }
  });

  it("produces one item per source row and no extras", () => {
    expect(result.items).toHaveLength(riskCase.rows.length);
    expect(new Set(result.items.map((item) => item.rowId)).size).toBe(
      riskCase.rows.length,
    );
  });

  it("totals the amount at risk exactly", () => {
    expect(result.totalAmountAtRisk).toBe(EXPECTED_TOTAL_AT_RISK);
  });

  it("isolates the amount lost with no further human involvement", () => {
    expect(result.amountLostIfNothingDone).toBe(EXPECTED_SILENT_LOSS);
  });

  it("does not flag rows that need no action", () => {
    const harmless = result.items.filter(
      (item) => item.severity === "ok" || item.severity === "info",
    );
    expect(harmless).toHaveLength(3);
    for (const item of harmless) {
      expect(item.amountAtRisk).toBe(0);
    }
  });

  it("counts the days remaining to the action deadline", () => {
    expect(result.daysRemaining).toBe(35);
  });

  it("attributes each at-risk item to a responsible party", () => {
    const creditNote = result.items.find((item) => item.rowId === "DEMO-ROW-0003");
    expect(creditNote!.whoCausedIt).toBe("supplier");
    const rejected = result.items.find((item) => item.rowId === "DEMO-ROW-0007");
    expect(rejected!.whoCausedIt).toBe("you");
  });

  it("carries the evidence fields that produced each verdict", () => {
    const notFiled = result.items.find((item) => item.rowId === "DEMO-ROW-0004");
    expect(notFiled!.evidenceFields.supplierFiledDate).toBeNull();
    expect(notFiled!.evidenceFields.inPurchaseRegister).toBe(true);
  });

  it("surfaces the reason when the statement blocks the credit", () => {
    const blocked = result.items.find((item) => item.rowId === "DEMO-ROW-0006");
    expect(blocked!.evidenceFields.unavailableReason).toContain("POS");
  });
});

describe("display ordering", () => {
  it("puts the items that expire first at the top, largest first", () => {
    const result = assessRisk(riskCase, "2026-09-15");
    const sorted = sortItemsForDisplay(result.items);
    expect(sorted[0].severity).toBe("act_now");
    expect(sorted[0].amountAtRisk).toBe(152_000);
    expect(sorted[sorted.length - 1].severity).toBe("ok");
  });
});

describe("classification rules in isolation", () => {
  const base = riskCase.rows[0];

  it("treats an unactioned credit note as a silent loss", () => {
    expect(
      classifyRiskRow({ ...base, docType: "credit_note", imsStatus: "N" }),
    ).toBe("credit_note_reducing_itc");
  });

  it("treats an accepted credit note as already decided", () => {
    expect(
      classifyRiskRow({ ...base, docType: "credit_note", imsStatus: "A" }),
    ).toBe("no_action_needed");
  });

  it("does not call an unactioned invoice a loss when the books agree", () => {
    expect(classifyRiskRow({ ...base, imsStatus: "N" })).toBe(
      "deemed_accept_harmless",
    );
  });

  it("ignores a rejection for something we never bought", () => {
    expect(
      classifyRiskRow({ ...base, imsStatus: "R", inPurchaseRegister: false }),
    ).toBe("no_action_needed");
  });
});

describe("input validation", () => {
  it("rejects a case whose identifiers are not synthetic", () => {
    const bad = {
      ...riskCase,
      id: "REAL-CASE-01",
    } as unknown as RiskCase;
    expect(() => assessRisk(bad)).toThrow(/must begin with DEMO-/);
  });

  it("rejects a deadline that falls before the statement date", () => {
    const bad: RiskCase = {
      ...riskCase,
      actionDeadline: "2026-09-01",
    };
    expect(() => assessRisk(bad)).toThrow(/must not be before/);
  });

  it("rejects a row that has a status but never reached the statement", () => {
    const bad: RiskCase = {
      ...riskCase,
      rows: [{ ...riskCase.rows[0], supplierFiledDate: null, imsStatus: "A" }],
    };
    expect(() => assessRisk(bad)).toThrow(/imsStatus must be null/);
  });
});
