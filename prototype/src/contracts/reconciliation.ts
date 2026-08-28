export type DemoId = `DEMO-${string}`;

export const RECONCILIATION_CATEGORIES = [
  "exact_match",
  "missing_in_2b",
  "possible_duplicate",
  "later_period_match",
] as const;

export type ReconciliationCategory =
  (typeof RECONCILIATION_CATEGORIES)[number];
export type ExceptionCategory = Exclude<
  ReconciliationCategory,
  "exact_match"
>;
export type SourceKind = "purchase_workpaper" | "gstr_2b";
export type ConfidenceLabel = "strong_evidence" | "needs_verification";
export type ComparedField =
  | "demoSupplierId"
  | "invoiceNo"
  | "invoiceDate"
  | "taxAmount";

/** @deprecated UI compatibility only. New consumers must use `category`. */
export type LegacyFindingType =
  | "later_period_supplier_filing"
  | "probable_duplicate";

export interface RecordClassification {
  sourceRowId: DemoId;
  sourceKind: SourceKind;
  category: ReconciliationCategory;
  matchRule: string;
  comparedFields: ComparedField[];
}

export interface Finding {
  id: DemoId;
  category: ExceptionCategory;
  /** @deprecated UI compatibility only. New consumers must use `category`. */
  type: LegacyFindingType;
  amount: number;
  sourceRowIds: DemoId[];
  matchRule: string;
  comparedFields: ComparedField[];
  evidence: string;
  confidenceLabel: ConfidenceLabel;
}

export interface ReconciliationResult {
  caseId: DemoId;
  claimedItc: number;
  availableItc: number;
  mismatchAmount: number;
  findings: Finding[];
  recordClassifications: RecordClassification[];
  /** @deprecated Derive exact matches from `recordClassifications`. */
  matchedPurchaseRowIds: DemoId[];
}
