import { describe, expect, it } from "vitest";
import { demoCase } from "../src/data/demoCase";
import { classifySourceRecords, reconcile } from "../src/domain/reconcile";
import type { DemoCase, DemoId } from "../src/domain/types";

describe("reconcile", () => {
  it("proves the approved ₹30,00,000 aggregate mismatch", () => {
    const result = reconcile(demoCase);

    expect(result.claimedItc).toBe(15_000_000);
    expect(result.availableItc).toBe(12_000_000);
    expect(result.mismatchAmount).toBe(3_000_000);
    expect(result.findings.map((finding) => finding.amount)).toEqual([
      1_840_000, 1_160_000,
    ]);
    expect(
      result.findings.reduce((total, finding) => total + finding.amount, 0),
    ).toBe(3_000_000);
  });

  it("returns neutral later-period evidence with its purchase and later-2B IDs", () => {
    const finding = reconcile(demoCase).findings.find(
      (item) => item.category === "later_period_match",
    );

    expect(finding).toMatchObject({
      id: "DEMO-FINDING-LATER-01",
      category: "later_period_match",
      type: "later_period_supplier_filing",
      amount: 1_840_000,
      sourceRowIds: ["DEMO-WP-1042", "DEMO-2B-MAY-1042"],
      matchRule:
        "No current-period match; the same normalized key and tax amount appear in a later-period GSTR-2B row.",
      comparedFields: [
        "demoSupplierId",
        "invoiceNo",
        "invoiceDate",
        "taxAmount",
      ],
      confidenceLabel: "strong_evidence",
    });
    expect(finding?.evidence).toMatch(/appears in the synthetic 2026-05/);
    expect(finding?.evidence).not.toMatch(/paid|eligible|reverse|liability/i);
  });

  it("returns possible-duplicate evidence with both workpaper IDs and current-2B support", () => {
    const finding = reconcile(demoCase).findings.find(
      (item) => item.category === "possible_duplicate",
    );

    expect(finding).toMatchObject({
      id: "DEMO-FINDING-DUPLICATE-01",
      category: "possible_duplicate",
      type: "probable_duplicate",
      amount: 1_160_000,
      sourceRowIds: [
        "DEMO-WP-1077-A",
        "DEMO-WP-1077-B",
        "DEMO-2B-APR-1077",
      ],
      matchRule:
        "Two workpaper rows share the same normalized key and tax amount, with one supporting current-period GSTR-2B row.",
      confidenceLabel: "needs_verification",
    });
    expect(finding?.evidence).toMatch(/possible duplicate/i);
    expect(finding?.evidence).not.toMatch(/double.claimed|liability|reverse/i);
  });

  it("assigns every purchase and GSTR-2B source row exactly one category", () => {
    const result = reconcile(demoCase);
    const sourceIds = [
      ...demoCase.purchaseClaimRows.map((row) => row.id),
      ...demoCase.gstr2bRows.map((row) => row.id),
    ].sort();
    const classifiedIds = result.recordClassifications
      .map((classification) => classification.sourceRowId)
      .sort();

    expect(classifiedIds).toEqual(sourceIds);
    expect(new Set(classifiedIds).size).toBe(sourceIds.length);
    expect(
      result.recordClassifications.every((classification) =>
        [
          "exact_match",
          "missing_in_2b",
          "possible_duplicate",
          "later_period_match",
        ].includes(classification.category),
      ),
    ).toBe(true);
  });

  it("keeps exact matches out of findings and the exception total", () => {
    const result = reconcile(demoCase);
    const exactPurchaseIds = result.recordClassifications
      .filter(
        (classification) =>
          classification.sourceKind === "purchase_workpaper" &&
          classification.category === "exact_match",
      )
      .map((classification) => classification.sourceRowId);

    expect(exactPurchaseIds).toEqual([
      "DEMO-WP-1001",
      "DEMO-WP-1002",
      "DEMO-WP-1003",
    ]);
    expect(result.matchedPurchaseRowIds).toEqual(exactPurchaseIds);
    const findingSourceIds = result.findings.flatMap(
      (finding) => finding.sourceRowIds,
    );
    expect(
      exactPurchaseIds.every((sourceId) => !findingSourceIds.includes(sourceId)),
    ).toBe(true);
  });

  it("normalizes invoice punctuation before matching", () => {
    const normalizedCase = structuredClone(demoCase) as DemoCase;
    normalizedCase.gstr2bRows[0].invoiceNo = "DEMO-INV 1001";

    const classification = reconcile(normalizedCase).recordClassifications.find(
      (item) => item.sourceRowId === "DEMO-WP-1001",
    );

    expect(classification?.category).toBe("exact_match");
  });

  it("classifies a purchase row with no current or later candidate as missing_in_2b", () => {
    const missingCase = structuredClone(demoCase) as DemoCase;
    missingCase.gstr2bRows = missingCase.gstr2bRows.filter(
      (row) => row.id !== "DEMO-2B-MAY-1042",
    );

    const classification = classifySourceRecords(missingCase).find(
      (item) => item.sourceRowId === "DEMO-WP-1042",
    );

    expect(classification).toMatchObject({
      sourceKind: "purchase_workpaper",
      category: "missing_in_2b",
    });
  });

  it("uses DEMO- for every visible synthetic identifier", () => {
    const result = reconcile(demoCase);
    const identifiers = [
      demoCase.id,
      ...demoCase.purchaseClaimRows.flatMap((row) => [
        row.id,
        row.demoSupplierId,
        row.invoiceNo,
      ]),
      ...demoCase.gstr2bRows.flatMap((row) => [
        row.id,
        row.demoSupplierId,
        row.invoiceNo,
      ]),
      ...result.findings.flatMap((finding) => [
        finding.id,
        ...finding.sourceRowIds,
      ]),
      ...result.recordClassifications.map(
        (classification) => classification.sourceRowId,
      ),
    ];

    expect(identifiers.every((identifier) => identifier.startsWith("DEMO-"))).toBe(
      true,
    );
  });

  it("rejects identifiers that do not begin with DEMO-", () => {
    const invalidCase = structuredClone(demoCase) as DemoCase;
    invalidCase.purchaseClaimRows[0].id = "WP-1001" as DemoId;

    expect(() => reconcile(invalidCase)).toThrow(/must begin with DEMO-/);
  });

  it("rejects duplicate visible source-row IDs", () => {
    const invalidCase = structuredClone(demoCase) as DemoCase;
    invalidCase.purchaseClaimRows[1].id = invalidCase.purchaseClaimRows[0].id;

    expect(() => reconcile(invalidCase)).toThrow(/duplicate source row ID/i);
  });

  it.each([
    ["claimed ITC", (value: DemoCase) => (value.claimedItc += 1)],
    ["available ITC", (value: DemoCase) => (value.availableItc += 1)],
  ])("rejects an invalid %s total", (_label, mutate) => {
    const invalidCase = structuredClone(demoCase) as DemoCase;
    mutate(invalidCase);

    expect(() => reconcile(invalidCase)).toThrow(/total .* does not equal/i);
  });

  it.each([
    [
      "invoice date",
      (value: DemoCase) =>
        (value.purchaseClaimRows[0].invoiceDate = "2026-02-30"),
    ],
    ["notice date", (value: DemoCase) => (value.noticeDate = "28-04-2026")],
    ["tax period", (value: DemoCase) => (value.period = "April 2026")],
  ])("rejects an invalid %s", (_label, mutate) => {
    const invalidCase = structuredClone(demoCase) as DemoCase;
    mutate(invalidCase);

    expect(() => reconcile(invalidCase)).toThrow(/valid ISO|YYYY-MM/);
  });

  it("rejects a normalized key present in both current and later GSTR-2B", () => {
    const ambiguousCase = structuredClone(demoCase) as DemoCase;
    ambiguousCase.gstr2bRows.push({
      ...structuredClone(ambiguousCase.gstr2bRows[0]),
      id: "DEMO-2B-MAY-1001",
      period: "2026-05",
    });

    expect(() => reconcile(ambiguousCase)).toThrow(
      /both current and later-period GSTR-2B/i,
    );
  });

  it("fails closed when a source row leaves an unexplained residual", () => {
    const residualCase = structuredClone(demoCase) as DemoCase;
    residualCase.gstr2bRows.push({
      id: "DEMO-2B-APR-ORPHAN",
      period: "2026-04",
      demoSupplierId: "DEMO-SUPPLIER-ORPHAN",
      invoiceNo: "DEMO-INV-ORPHAN",
      invoiceDate: "2026-04-25",
      taxAmount: 100_000,
    });
    residualCase.availableItc += 100_000;

    expect(() => reconcile(residualCase)).toThrow(/unexplained residual/i);
  });
});
