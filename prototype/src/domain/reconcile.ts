import type {
  ComparedField,
  DemoCase,
  DemoId,
  Finding,
  Gstr2bRow,
  PurchaseClaimRow,
  ReconciliationCategory,
  ReconciliationResult,
  RecordClassification,
  SourceKind,
} from "./types";

const COMPARED_FIELDS: ComparedField[] = [
  "demoSupplierId",
  "invoiceNo",
  "invoiceDate",
  "taxAmount",
];

const MATCH_RULES: Record<ReconciliationCategory, string> = {
  exact_match:
    "The normalized key and tax amount match one current-period GSTR-2B row.",
  missing_in_2b:
    "No current- or later-period GSTR-2B row matches the normalized key and tax amount.",
  possible_duplicate:
    "Two workpaper rows share the same normalized key and tax amount, with one supporting current-period GSTR-2B row.",
  later_period_match:
    "No current-period match; the same normalized key and tax amount appear in a later-period GSTR-2B row.",
};

type MatchableRow = PurchaseClaimRow | Gstr2bRow;

interface MatchGroup {
  purchaseRows: PurchaseClaimRow[];
  currentRows: Gstr2bRow[];
  laterRows: Gstr2bRow[];
}

function sumAmounts(rows: ReadonlyArray<{ taxAmount: number }>): number {
  return rows.reduce((total, row) => total + row.taxAmount, 0);
}

function normalizeInvoiceNumber(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function normalizedKey(row: MatchableRow): string {
  return [
    row.demoSupplierId.toUpperCase(),
    normalizeInvoiceNumber(row.invoiceNo),
    row.invoiceDate,
    row.taxAmount,
  ].join("|");
}

function assertDemoId(value: string, field: string): asserts value is DemoId {
  if (!value.startsWith("DEMO-")) {
    throw new Error(`${field} must begin with DEMO-. Received: ${value}`);
  }
}

function assertPositiveInteger(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive integer number of rupees.`);
  }
}

function assertIsoDate(value: string, field: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${field} must be a valid ISO date (YYYY-MM-DD).`);
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    throw new Error(`${field} must be a valid ISO date (YYYY-MM-DD).`);
  }
}

function assertTaxPeriod(value: string, field: string): void {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) {
    throw new Error(`${field} must use YYYY-MM with a valid month.`);
  }
}

function validateCase(caseData: DemoCase): void {
  assertDemoId(caseData.id, "case id");
  assertTaxPeriod(caseData.period, "case period");
  assertIsoDate(caseData.noticeDate, "notice date");
  assertIsoDate(caseData.reviewByDate, "review-by date");
  if (caseData.reviewByDate < caseData.noticeDate) {
    throw new Error("review-by date must not be before the notice date.");
  }
  assertPositiveInteger(caseData.claimedItc, "claimed ITC");
  assertPositiveInteger(caseData.availableItc, "available ITC");

  const sourceRowIds = new Set<DemoId>();
  const validateSourceId = (id: DemoId, field: string) => {
    assertDemoId(id, field);
    if (sourceRowIds.has(id)) {
      throw new Error(`Duplicate source row ID: ${id}.`);
    }
    sourceRowIds.add(id);
  };

  for (const row of caseData.purchaseClaimRows) {
    validateSourceId(row.id, "purchase row id");
    assertDemoId(row.demoSupplierId, "purchase supplier id");
    assertDemoId(row.invoiceNo, "purchase invoice number");
    assertIsoDate(row.invoiceDate, `purchase invoice date ${row.id}`);
    assertPositiveInteger(row.taxAmount, `purchase tax amount ${row.id}`);
  }

  for (const row of caseData.gstr2bRows) {
    validateSourceId(row.id, "GSTR-2B row id");
    assertDemoId(row.demoSupplierId, "GSTR-2B supplier id");
    assertDemoId(row.invoiceNo, "GSTR-2B invoice number");
    assertIsoDate(row.invoiceDate, `GSTR-2B invoice date ${row.id}`);
    assertTaxPeriod(row.period, `GSTR-2B period ${row.id}`);
    if (row.period < caseData.period) {
      throw new Error(
        `GSTR-2B period ${row.period} for ${row.id} is before the case period.`,
      );
    }
    assertPositiveInteger(row.taxAmount, `GSTR-2B tax amount ${row.id}`);
  }
}

function buildMatchGroups(caseData: DemoCase): Map<string, MatchGroup> {
  const groups = new Map<string, MatchGroup>();

  for (const row of caseData.purchaseClaimRows) {
    const key = normalizedKey(row);
    const group = groups.get(key) ?? {
      purchaseRows: [],
      currentRows: [],
      laterRows: [],
    };
    group.purchaseRows.push(row);
    groups.set(key, group);
  }

  for (const row of caseData.gstr2bRows) {
    const key = normalizedKey(row);
    const group = groups.get(key);
    if (!group) {
      throw new Error(
        `Unexplained residual: GSTR-2B source row ${row.id} has no purchase/workpaper candidate.`,
      );
    }
    if (row.period === caseData.period) {
      group.currentRows.push(row);
    } else {
      group.laterRows.push(row);
    }
  }

  return groups;
}

function addClassifications(
  target: RecordClassification[],
  rows: ReadonlyArray<{ id: DemoId }>,
  sourceKind: SourceKind,
  category: ReconciliationCategory,
): void {
  for (const row of rows) {
    target.push({
      sourceRowId: row.id,
      sourceKind,
      category,
      matchRule: MATCH_RULES[category],
      comparedFields: [...COMPARED_FIELDS],
    });
  }
}

export function classifySourceRecords(
  caseData: DemoCase,
): RecordClassification[] {
  validateCase(caseData);
  const groups = buildMatchGroups(caseData);
  const classifications: RecordClassification[] = [];

  for (const group of groups.values()) {
    const { purchaseRows, currentRows, laterRows } = group;

    if (currentRows.length > 0 && laterRows.length > 0) {
      throw new Error(
        `Ambiguous classification: normalized key for ${purchaseRows[0].id} appears in both current and later-period GSTR-2B.`,
      );
    }
    if (currentRows.length > 1 || laterRows.length > 1) {
      throw new Error(
        `Ambiguous classification: normalized key for ${purchaseRows[0].id} has multiple GSTR-2B candidates.`,
      );
    }

    if (purchaseRows.length > 1) {
      if (currentRows.length !== 1 || laterRows.length !== 0) {
        throw new Error(
          `Ambiguous classification: repeated workpaper key for ${purchaseRows[0].id} is also missing or later-period evidence.`,
        );
      }
      addClassifications(
        classifications,
        purchaseRows,
        "purchase_workpaper",
        "possible_duplicate",
      );
      addClassifications(
        classifications,
        currentRows,
        "gstr_2b",
        "possible_duplicate",
      );
      continue;
    }

    if (currentRows.length === 1) {
      addClassifications(
        classifications,
        purchaseRows,
        "purchase_workpaper",
        "exact_match",
      );
      addClassifications(
        classifications,
        currentRows,
        "gstr_2b",
        "exact_match",
      );
    } else if (laterRows.length === 1) {
      addClassifications(
        classifications,
        purchaseRows,
        "purchase_workpaper",
        "later_period_match",
      );
      addClassifications(
        classifications,
        laterRows,
        "gstr_2b",
        "later_period_match",
      );
    } else {
      addClassifications(
        classifications,
        purchaseRows,
        "purchase_workpaper",
        "missing_in_2b",
      );
    }
  }

  const expectedCount =
    caseData.purchaseClaimRows.length + caseData.gstr2bRows.length;
  if (
    classifications.length !== expectedCount ||
    new Set(classifications.map(({ sourceRowId }) => sourceRowId)).size !==
      expectedCount
  ) {
    throw new Error(
      "Every source row must receive exactly one reconciliation category.",
    );
  }

  return classifications;
}

export function reconcile(caseData: DemoCase): ReconciliationResult {
  const recordClassifications = classifySourceRecords(caseData);

  const purchaseTotal = sumAmounts(caseData.purchaseClaimRows);
  if (purchaseTotal !== caseData.claimedItc) {
    throw new Error(
      `Purchase workpaper total ${purchaseTotal} does not equal claimed ITC ${caseData.claimedItc}.`,
    );
  }

  const currentPeriodRows = caseData.gstr2bRows.filter(
    (row) => row.period === caseData.period,
  );
  const currentPeriodTotal = sumAmounts(currentPeriodRows);
  if (currentPeriodTotal !== caseData.availableItc) {
    throw new Error(
      `Current-period GSTR-2B total ${currentPeriodTotal} does not equal available ITC ${caseData.availableItc}.`,
    );
  }

  const groups = buildMatchGroups(caseData);
  const findings: Finding[] = [];
  let laterIndex = 0;
  let duplicateIndex = 0;

  for (const group of groups.values()) {
    const { purchaseRows, currentRows, laterRows } = group;
    if (purchaseRows.length > 1) {
      duplicateIndex += 1;
      findings.push({
        id: `DEMO-FINDING-DUPLICATE-${String(duplicateIndex).padStart(2, "0")}`,
        category: "possible_duplicate",
        type: "probable_duplicate",
        amount: purchaseRows[0].taxAmount * (purchaseRows.length - 1),
        sourceRowIds: [
          ...purchaseRows.map((row) => row.id),
          currentRows[0].id,
        ],
        matchRule: MATCH_RULES.possible_duplicate,
        comparedFields: [...COMPARED_FIELDS],
        evidence:
          "The same normalized synthetic key and tax amount appear more than once in the workpaper, with one current-period GSTR-2B support row. This is a possible duplicate and needs verification.",
        confidenceLabel: "needs_verification",
      });
    } else if (laterRows.length === 1) {
      laterIndex += 1;
      findings.push({
        id: `DEMO-FINDING-LATER-${String(laterIndex).padStart(2, "0")}`,
        category: "later_period_match",
        type: "later_period_supplier_filing",
        amount: purchaseRows[0].taxAmount,
        sourceRowIds: [purchaseRows[0].id, laterRows[0].id],
        matchRule: MATCH_RULES.later_period_match,
        comparedFields: [...COMPARED_FIELDS],
        evidence: `No matching row appears in the synthetic ${caseData.period} GSTR-2B extract; the same normalized key and tax amount appears in the synthetic ${laterRows[0].period} extract. This is timing evidence only and needs professional review.`,
        confidenceLabel: "strong_evidence",
      });
    }
  }

  const mismatchAmount = caseData.claimedItc - caseData.availableItc;
  const explainedAmount = findings.reduce(
    (total, finding) => total + finding.amount,
    0,
  );
  if (explainedAmount !== mismatchAmount) {
    throw new Error(
      `Unexplained residual: findings explain ${explainedAmount}, but the notice mismatch is ${mismatchAmount}.`,
    );
  }

  const matchedPurchaseRowIds = recordClassifications
    .filter(
      ({ sourceKind, category }) =>
        sourceKind === "purchase_workpaper" && category === "exact_match",
    )
    .map(({ sourceRowId }) => sourceRowId);

  return {
    caseId: caseData.id,
    claimedItc: caseData.claimedItc,
    availableItc: caseData.availableItc,
    mismatchAmount,
    findings,
    recordClassifications,
    matchedPurchaseRowIds,
  };
}
