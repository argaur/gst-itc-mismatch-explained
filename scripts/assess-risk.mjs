#!/usr/bin/env node
/**
 * assess-risk.mjs
 *
 * Reference implementation of the Round 2 "silent loss" classifier, plus a
 * self-check against the generated answer key.
 *
 * This is deliberately a PURE function over data. No I/O, no model, no network.
 * The AI never runs until after this has already decided every number.
 *
 * Port target in the repo: prototype/src/domain/assessRisk.ts
 *
 * Run: node assess-risk.mjs ./fixtures
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

const DIR = process.argv[2] ?? "./fixtures";

// ---------------------------------------------------------------------------
// The classifier. Order of rules matters and is deliberate.
// ---------------------------------------------------------------------------

/**
 * Each rule states, in plain words, what the citizen is being told.
 * These strings are the ONLY explanation the model is allowed to paraphrase.
 */
const RULES = {
  credit_note_reducing_itc: {
    severity: "act_now",
    whyItMatters:
      "Your supplier has sent a note that reduces your credit. Nobody has responded to it. " +
      "If you do nothing, it is treated as accepted and this credit is gone.",
    whoCausedIt: "supplier",
    whatToDo: "Open the invoice screen and accept or reject this note before the date below.",
  },
  supplier_not_filed: {
    severity: "act_now",
    whyItMatters:
      "Your books show this purchase, but your supplier has not filed it. " +
      "It has not reached your credit statement, and there is no button you can press to fix it yourself.",
    whoCausedIt: "supplier",
    whatToDo: "Contact this supplier and ask them to file this bill.",
  },
  wrongly_rejected: {
    severity: "act_now",
    whyItMatters:
      "This bill was rejected on the portal, but your own books say you bought it. " +
      "A rejection you did not intend costs you the credit.",
    whoCausedIt: "you",
    whatToDo: "Check whether this rejection was a mistake, and correct it before the date below.",
  },
  itc_not_available: {
    severity: "check",
    whyItMatters:
      "The government has marked this credit as not available, and given a reason.",
    whoCausedIt: "rules",
    whatToDo: "Read the reason and confirm with a professional whether it can be corrected.",
  },
  deemed_accept_harmless: {
    severity: "info",
    whyItMatters:
      "Nobody has responded to this bill, so it will be accepted automatically. " +
      "Your own records agree with it, so this looks correct. We have not " +
      "checked it beyond that.",
    whoCausedIt: "nobody",
    whatToDo:
      "Nothing is at risk here based on your own records. Check it yourself if those records may be wrong.",
  },
  no_action_needed: {
    severity: "ok",
    whyItMatters:
      "This bill matches your own records and has already been accepted.",
    whoCausedIt: "nobody",
    whatToDo: "Nothing to do here.",
  },
};

function classifyRow(row) {
  // 1. A credit note nobody has acted on. Silence destroys credit. Highest priority.
  if (row.docType === "credit_note" && row.imsStatus === "N") {
    return "credit_note_reducing_itc";
  }
  // 2. In our books, but the supplier never filed it. No unilateral remedy.
  if (row.inPurchaseRegister && row.supplierFiledDate === null) {
    return "supplier_not_filed";
  }
  // 3. Government has explicitly marked the credit unavailable.
  if (row.itcAvailable === "N") {
    return "itc_not_available";
  }
  // 4. Rejected on the portal, but our books say we bought it.
  if (row.imsStatus === "R" && row.inPurchaseRegister) {
    return "wrongly_rejected";
  }
  // 5. No action taken, but the bill agrees with our books. Deemed accept is fine.
  if (row.docType === "invoice" && row.imsStatus === "N" && row.inPurchaseRegister) {
    return "deemed_accept_harmless";
  }
  // 6. Nothing to do.
  return "no_action_needed";
}

function amountAtRisk(category, row) {
  const AT_RISK = new Set([
    "credit_note_reducing_itc",
    "supplier_not_filed",
    "itc_not_available",
    "wrongly_rejected",
  ]);
  return AT_RISK.has(category) ? row.taxAmount : 0;
}

function daysBetween(fromIso, toIso) {
  const ms = Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

export function assessRisk(riskCase, todayIso) {
  const today = todayIso ?? riskCase.statementDate;
  const items = riskCase.rows.map((row) => {
    const category = classifyRow(row);
    const rule = RULES[category];
    return {
      rowId: row.id,
      supplierName: row.supplierName,
      invoiceNo: row.invoiceNo,
      docType: row.docType,
      category,
      severity: rule.severity,
      amountAtRisk: amountAtRisk(category, row),
      whyItMatters: rule.whyItMatters,
      whoCausedIt: rule.whoCausedIt,
      whatToDo: rule.whatToDo,
      // Every claim points back to the fields that produced it.
      evidenceFields: {
        imsStatus: row.imsStatus,
        itcAvailable: row.itcAvailable,
        unavailableReason: row.unavailableReason,
        supplierFiledDate: row.supplierFiledDate,
        inPurchaseRegister: row.inPurchaseRegister,
      },
    };
  });

  const totalAtRisk = items.reduce((t, i) => t + i.amountAtRisk, 0);
  const silentLoss = items
    .filter((i) => i.category === "credit_note_reducing_itc")
    .reduce((t, i) => t + i.amountAtRisk, 0);

  return {
    caseId: riskCase.id,
    period: riskCase.period,
    statementDate: riskCase.statementDate,
    actionDeadline: riskCase.actionDeadline,
    daysRemaining: daysBetween(today, riskCase.actionDeadline),
    totalAmountAtRisk: totalAtRisk,
    amountLostIfNothingDone: silentLoss,
    items,
    // Ordered so the citizen sees the thing that disappears first, first.
    priorityOrder: ["act_now", "check", "info", "ok"],
  };
}

// ---------------------------------------------------------------------------
// Self-check against the answer key
// ---------------------------------------------------------------------------

const riskCase = JSON.parse(readFileSync(join(DIR, "riskCase.json"), "utf8"));
const answerKey = JSON.parse(readFileSync(join(DIR, "answer-key.json"), "utf8"));

const result = assessRisk(riskCase, "2026-09-15");

let failures = 0;
console.log("Scoring classifier against answer key\n");
console.log("  ROW              EXPECTED                      GOT                           AMOUNT      OK");
console.log("  " + "-".repeat(94));

for (const expected of answerKey.expectations) {
  const got = result.items.find((i) => i.rowId === expected.rowId);
  const catOk = got.category === expected.expectedCategory;
  const amtOk = got.amountAtRisk === expected.expectedAmountAtRisk;
  const ok = catOk && amtOk;
  if (!ok) failures += 1;
  console.log(
    `  ${expected.ref.padEnd(16)} ${expected.expectedCategory.padEnd(29)} ${got.category.padEnd(29)} ${String(got.amountAtRisk).padStart(9)}   ${ok ? "PASS" : "FAIL"}`,
  );
}

console.log("  " + "-".repeat(94));

const totalOk = result.totalAmountAtRisk === answerKey.totalAmountAtRisk;
const silentOk = result.amountLostIfNothingDone === answerKey.amountLostIfNothingDone;
if (!totalOk) failures += 1;
if (!silentOk) failures += 1;

console.log(`\n  Total at risk:          Rs ${result.totalAmountAtRisk.toLocaleString("en-IN")}  (expected Rs ${answerKey.totalAmountAtRisk.toLocaleString("en-IN")})  ${totalOk ? "PASS" : "FAIL"}`);
console.log(`  Lost silently if idle:  Rs ${result.amountLostIfNothingDone.toLocaleString("en-IN")}   (expected Rs ${answerKey.amountLostIfNothingDone.toLocaleString("en-IN")})   ${silentOk ? "PASS" : "FAIL"}`);
console.log(`  Days remaining:         ${result.daysRemaining} (from 2026-09-15 to ${result.actionDeadline})`);

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
