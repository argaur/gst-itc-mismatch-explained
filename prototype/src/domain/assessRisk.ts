import type {
  ResponsibleParty,
  RiskAssessmentResult,
  RiskCase,
  RiskCategory,
  RiskItem,
  RiskRow,
  RiskSeverity,
} from "../contracts/riskAssessment";

export type {
  DocumentType,
  ImsStatus,
  ItcAvailability,
  ResponsibleParty,
  RiskAssessmentResult,
  RiskCase,
  RiskCategory,
  RiskEvidenceFields,
  RiskItem,
  RiskRow,
  RiskSeverity,
} from "../contracts/riskAssessment";

interface RiskRule {
  severity: RiskSeverity;
  whyItMatters: string;
  whoCausedIt: ResponsibleParty;
  whatToDo: string;
  atRisk: boolean;
}

/**
 * These strings are the only explanation the model is permitted to paraphrase.
 * Keeping them here, next to the rule that fires them, is what makes the
 * generated language checkable against the deterministic verdict.
 */
const RISK_RULES: Record<RiskCategory, RiskRule> = {
  credit_note_reducing_itc: {
    severity: "act_now",
    whyItMatters:
      "Your supplier has sent a note that reduces your credit. Nobody has responded to it. If you do nothing, it is treated as accepted and this credit is gone.",
    whoCausedIt: "supplier",
    whatToDo:
      "Open the invoice screen and accept or reject this note before the date shown.",
    atRisk: true,
  },
  supplier_not_filed: {
    severity: "act_now",
    whyItMatters:
      "Your books show this purchase, but your supplier has not filed it. It has not reached your credit statement, and there is no button you can press to fix it yourself.",
    whoCausedIt: "supplier",
    whatToDo: "Contact this supplier and ask them to file this bill.",
    atRisk: true,
  },
  wrongly_rejected: {
    severity: "act_now",
    whyItMatters:
      "This bill was rejected on the portal, but your own books say you bought it. A rejection you did not intend costs you the credit.",
    whoCausedIt: "you",
    whatToDo:
      "Check whether this rejection was a mistake, and correct it before the date shown.",
    atRisk: true,
  },
  itc_not_available: {
    severity: "check",
    whyItMatters:
      "The government has marked this credit as not available, and given a reason.",
    whoCausedIt: "rules",
    whatToDo:
      "Read the reason and confirm with a professional whether it can be corrected.",
    atRisk: true,
  },
  deemed_accept_harmless: {
    severity: "info",
    // Deliberately does not say "no action needed". We only know this bill
    // matches the business's own records. We have not verified those records,
    // and accepting a bill still has consequences if they are wrong.
    whyItMatters:
      "Nobody has responded to this bill, so it will be accepted automatically. Your own records agree with it, so this looks correct. We have not checked it beyond that.",
    whoCausedIt: "nobody",
    whatToDo:
      "Nothing is at risk here based on your own records. Check it yourself if those records may be wrong.",
    atRisk: false,
  },
  no_action_needed: {
    severity: "ok",
    whyItMatters:
      "This bill matches your own records and has already been accepted.",
    whoCausedIt: "nobody",
    whatToDo: "Nothing to do here.",
    atRisk: false,
  },
};

function assertDemoId(value: string, field: string): void {
  if (!value.startsWith("DEMO-")) {
    throw new Error(`${field} must begin with DEMO-. Received: ${value}`);
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

function assertPositiveInteger(value: number, field: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${field} must be a positive integer number of rupees.`);
  }
}

function validateRiskCase(riskCase: RiskCase): void {
  assertDemoId(riskCase.id, "risk case id");
  if (!/^(\d{4})-(0[1-9]|1[0-2])$/.test(riskCase.period)) {
    throw new Error("risk case period must use YYYY-MM with a valid month.");
  }
  assertIsoDate(riskCase.statementDate, "statement date");
  assertIsoDate(riskCase.actionDeadline, "action deadline");
  assertIsoDate(riskCase.annualCutoff, "annual cutoff");
  if (riskCase.actionDeadline < riskCase.statementDate) {
    throw new Error("action deadline must not be before the statement date.");
  }
  if (riskCase.rows.length === 0) {
    throw new Error("risk case must contain at least one row.");
  }

  const seen = new Set<string>();
  for (const row of riskCase.rows) {
    assertDemoId(row.id, "risk row id");
    if (seen.has(row.id)) {
      throw new Error(`Duplicate risk row ID: ${row.id}.`);
    }
    seen.add(row.id);
    assertDemoId(row.demoSupplierId, `supplier id ${row.id}`);
    assertDemoId(row.invoiceNo, `invoice number ${row.id}`);
    assertIsoDate(row.invoiceDate, `invoice date ${row.id}`);
    assertPositiveInteger(row.taxAmount, `tax amount ${row.id}`);
    if (row.supplierFiledDate !== null) {
      assertIsoDate(row.supplierFiledDate, `supplier filed date ${row.id}`);
    }
    // A row that never reached the statement cannot carry a statement status.
    if (row.supplierFiledDate === null && row.imsStatus !== null) {
      throw new Error(
        `${row.id} has no supplier filing date, so imsStatus must be null.`,
      );
    }
  }
}

/**
 * Classification order is load-bearing. The first matching rule wins, and the
 * rules are ordered so that the loss which happens with no further human
 * involvement is caught before anything else.
 */
export function classifyRiskRow(row: RiskRow): RiskCategory {
  // 1. A credit note nobody has acted on. Silence destroys the credit.
  if (row.docType === "credit_note" && row.imsStatus === "N") {
    return "credit_note_reducing_itc";
  }
  // 2. In our books, but the supplier never filed. No unilateral remedy exists.
  if (row.inPurchaseRegister && row.supplierFiledDate === null) {
    return "supplier_not_filed";
  }
  // 3. The statement explicitly marks the credit unavailable, with a reason.
  if (row.itcAvailable === "N") {
    return "itc_not_available";
  }
  // 4. Rejected on the portal, but our own books say we bought it.
  if (row.imsStatus === "R" && row.inPurchaseRegister) {
    return "wrongly_rejected";
  }
  // 5. No action taken, but the bill agrees with our books, so acceptance is fine.
  //    This branch exists so the tool does not cry wolf on every unactioned row.
  if (
    row.docType === "invoice" &&
    row.imsStatus === "N" &&
    row.inPurchaseRegister
  ) {
    return "deemed_accept_harmless";
  }
  return "no_action_needed";
}

function daysBetween(fromIso: string, toIso: string): number {
  const ms =
    Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

export function assessRisk(
  riskCase: RiskCase,
  todayIso?: string,
): RiskAssessmentResult {
  validateRiskCase(riskCase);
  const today = todayIso ?? riskCase.statementDate;
  assertIsoDate(today, "today");

  const items: RiskItem[] = riskCase.rows.map((row) => {
    const category = classifyRiskRow(row);
    const rule = RISK_RULES[category];
    return {
      rowId: row.id,
      supplierName: row.supplierName,
      invoiceNo: row.invoiceNo,
      docType: row.docType,
      category,
      severity: rule.severity,
      amountAtRisk: rule.atRisk ? row.taxAmount : 0,
      whyItMatters: rule.whyItMatters,
      whoCausedIt: rule.whoCausedIt,
      whatToDo: rule.whatToDo,
      evidenceFields: {
        imsStatus: row.imsStatus,
        itcAvailable: row.itcAvailable,
        unavailableReason: row.unavailableReason,
        supplierFiledDate: row.supplierFiledDate,
        inPurchaseRegister: row.inPurchaseRegister,
      },
    };
  });

  const totalAmountAtRisk = items.reduce(
    (total, item) => total + item.amountAtRisk,
    0,
  );
  const amountLostIfNothingDone = items
    .filter((item) => item.category === "credit_note_reducing_itc")
    .reduce((total, item) => total + item.amountAtRisk, 0);

  return {
    caseId: riskCase.id,
    period: riskCase.period,
    statementDate: riskCase.statementDate,
    actionDeadline: riskCase.actionDeadline,
    annualCutoff: riskCase.annualCutoff,
    daysRemaining: daysBetween(today, riskCase.actionDeadline),
    totalAmountAtRisk,
    amountLostIfNothingDone,
    items,
  };
}

const SEVERITY_ORDER: Record<RiskSeverity, number> = {
  act_now: 0,
  check: 1,
  info: 2,
  ok: 3,
};

/** Display helper: the thing that disappears first appears first. */
export function sortItemsForDisplay(items: RiskItem[]): RiskItem[] {
  return [...items].sort((a, b) => {
    const bySeverity =
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity];
    if (bySeverity !== 0) return bySeverity;
    return b.amountAtRisk - a.amountAtRisk;
  });
}
