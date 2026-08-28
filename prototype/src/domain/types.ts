import type { DemoId } from "../contracts/reconciliation";

export type {
  ComparedField,
  ConfidenceLabel,
  DemoId,
  ExceptionCategory,
  Finding,
  LegacyFindingType,
  ReconciliationCategory,
  ReconciliationResult,
  RecordClassification,
  SourceKind,
} from "../contracts/reconciliation";

export interface PurchaseClaimRow {
  id: DemoId;
  demoSupplierId: DemoId;
  invoiceNo: DemoId;
  invoiceDate: string;
  taxAmount: number;
}

export interface Gstr2bRow {
  id: DemoId;
  period: string;
  demoSupplierId: DemoId;
  invoiceNo: DemoId;
  invoiceDate: string;
  taxAmount: number;
}

export interface DemoCase {
  id: DemoId;
  /** Canonical tax period in YYYY-MM form. */
  period: string;
  noticeDate: string;
  reviewByDate: string;
  claimedItc: number;
  availableItc: number;
  purchaseClaimRows: PurchaseClaimRow[];
  gstr2bRows: Gstr2bRow[];
}
