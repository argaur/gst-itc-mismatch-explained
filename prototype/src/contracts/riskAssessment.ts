import type { DemoId } from "./reconciliation";

/**
 * Round 2 contract: the "silent loss" assessment.
 *
 * Deliberately separate from `reconciliation.ts`, which is frozen and whose
 * invariants assume a notice with a claimed-versus-available pair that must
 * reconcile to zero residual. This assessment has no notice and nothing to
 * balance to, so it gets its own contract rather than bending that one.
 */

export const RISK_CATEGORIES = [
  "credit_note_reducing_itc",
  "supplier_not_filed",
  "itc_not_available",
  "wrongly_rejected",
  "deemed_accept_harmless",
  "no_action_needed",
] as const;

export type RiskCategory = (typeof RISK_CATEGORIES)[number];

/** Drives display order and colour. `act_now` items expire on a date. */
export type RiskSeverity = "act_now" | "check" | "info" | "ok";

/** Answers the citizen's real question: whose fault is this? */
export type ResponsibleParty = "supplier" | "you" | "rules" | "nobody";

/** Invoice Management System action state. Null means it never reached the statement. */
export type ImsStatus = "A" | "R" | "N";

/** ITC availability flag as published in the GSTR-2B structure. */
export type ItcAvailability = "Y" | "N" | "T";

export type DocumentType = "invoice" | "credit_note";

export interface RiskRow {
  id: DemoId;
  demoSupplierId: DemoId;
  /** Synthetic GSTIN. State code 88 is unassigned, so it cannot collide with a real one. */
  supplierGstin: string;
  supplierName: string;
  invoiceNo: DemoId;
  invoiceDate: string;
  /** Whole rupees, never paise, to match the existing domain convention. */
  taxAmount: number;
  docType: DocumentType;
  imsStatus: ImsStatus | null;
  itcAvailable: ItcAvailability | null;
  unavailableReason: string | null;
  /** Null means the supplier never filed, so this never reached the statement. */
  supplierFiledDate: string | null;
  inPurchaseRegister: boolean;
}

export interface RiskCase {
  id: DemoId;
  /** Canonical tax period in YYYY-MM form. */
  period: string;
  /** The date the credit statement is drawn up. */
  statementDate: string;
  /** The date the pending option expires and inaction becomes acceptance. */
  actionDeadline: string;
  /** The annual last-chance date for the financial year. */
  annualCutoff: string;
  recipientGstin: string;
  rows: RiskRow[];
}

/**
 * The raw fields that produced a verdict. Shown in the UI and passed to the
 * model, so every sentence can be traced back to the data that caused it.
 */
export interface RiskEvidenceFields {
  imsStatus: ImsStatus | null;
  itcAvailable: ItcAvailability | null;
  unavailableReason: string | null;
  supplierFiledDate: string | null;
  inPurchaseRegister: boolean;
}

export interface RiskItem {
  rowId: DemoId;
  supplierName: string;
  invoiceNo: DemoId;
  docType: DocumentType;
  category: RiskCategory;
  severity: RiskSeverity;
  /** Zero for categories that need no action. Never null. */
  amountAtRisk: number;
  whyItMatters: string;
  whoCausedIt: ResponsibleParty;
  whatToDo: string;
  evidenceFields: RiskEvidenceFields;
}

export interface RiskAssessmentResult {
  caseId: DemoId;
  period: string;
  statementDate: string;
  actionDeadline: string;
  annualCutoff: string;
  /** Negative once the deadline has passed. The UI must handle that. */
  daysRemaining: number;
  totalAmountAtRisk: number;
  /** The subset that disappears with no further human involvement. */
  amountLostIfNothingDone: number;
  items: RiskItem[];
}
