#!/usr/bin/env node
/**
 * generate-risk-fixture.mjs
 *
 * Generates the synthetic dataset for the Round 2 "silent loss" feature.
 *
 * Emits four files into the output directory:
 *   1. gstr2b-synthetic.json   real GSTN GSTR-2B structure, synthetic contents
 *   2. purchase-register.csv   what the business's own books say
 *   3. riskCase.json           the flattened shape the app's engine consumes
 *   4. answer-key.json         ground truth, so the engine can be scored not eyeballed
 *
 * Honesty design notes (these matter for the judging criteria):
 *   - Every synthetic GSTIN uses state code 88, which does not appear in the
 *     published list of Indian state codes (01-38, plus 97 and 99). So these
 *     should not collide with any real taxpayer. We say "not in use today", not
 *     "can never exist", because we cannot promise future allocation.
 *   - Every internal identifier keeps the existing DEMO- prefix convention so the
 *     repo's assertDemoId guards keep working.
 *   - Field NAMES and ENUM VALUES follow the published GSTR-2B structure
 *     (imsStatus A/R/N, itcavl Y/N/T, rsn, supfildt, cdnr section).
 *     IMPORTANT: that field-level structure is published by a licensed
 *     commercial provider, NOT by GSTN itself. We could not find a
 *     government-published schema in the open. Do not describe this as "the
 *     government's schema" in the video or the write-up.
 *     The structure is real. Every value inside it is invented.
 *
 * No dependencies. Run: node generate-risk-fixture.mjs [outputDir]
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = process.argv[2] ?? "./fixtures";

// ---------------------------------------------------------------------------
// Case-level constants
// ---------------------------------------------------------------------------

const PERIOD = "2026-08";           // tax period under review
const PERIOD_GSTN = "082026";       // same period, GSTN's MMYYYY format
const STATEMENT_DATE = "2026-09-14"; // the 14th: when the credit statement is drawn
const ACTION_DEADLINE = "2026-10-20"; // when the "pending" option expires
const ANNUAL_CUTOFF = "2027-11-30";  // s.16(4) hard stop for the FY

// State code 88 is unassigned in India. Deliberate: cannot collide with a real GSTIN.
const SYNTHETIC_STATE_CODE = "88";

/** Build a shape-valid but provably synthetic GSTIN. */
function syntheticGstin(index) {
  const pan = `DEMO${String.fromCharCode(65 + index)}${String(1000 + index)}${String.fromCharCode(65 + index)}`;
  return `${SYNTHETIC_STATE_CODE}${pan}1Z${index}`;
}

// ---------------------------------------------------------------------------
// The scenario
//
// Each row carries `expect`, which is the ground truth the engine must rediscover.
// The engine never sees `expect` - it is stripped before the fixture is written
// and kept only in answer-key.json.
// ---------------------------------------------------------------------------

const SCENARIO = [
  {
    ref: "OK-01",
    supplier: "Verma Packaging (synthetic)",
    invoiceNo: "DEMO-INV-4101",
    invoiceDate: "2026-08-04",
    taxAmount: 45_000,
    docType: "invoice",
    imsStatus: "A",
    itcAvailable: "Y",
    supplierFiledDate: "2026-09-09",
    inPurchaseRegister: true,
    expect: { category: "no_action_needed", amountAtRisk: 0 },
  },
  {
    ref: "OK-02",
    supplier: "Nadkarni Steel (synthetic)",
    invoiceNo: "DEMO-INV-4102",
    invoiceDate: "2026-08-07",
    taxAmount: 120_000,
    docType: "invoice",
    imsStatus: "A",
    itcAvailable: "Y",
    supplierFiledDate: "2026-09-10",
    inPurchaseRegister: true,
    expect: { category: "no_action_needed", amountAtRisk: 0 },
  },
  {
    // THE HERO FINDING. A credit note nobody has looked at.
    // Silence accepts it, and the credit quietly disappears.
    ref: "RISK-CN",
    supplier: "Verma Packaging (synthetic)",
    invoiceNo: "DEMO-CN-4108",
    invoiceDate: "2026-08-19",
    taxAmount: 86_400,
    docType: "credit_note",
    imsStatus: "N",
    itcAvailable: "Y",
    supplierFiledDate: "2026-09-11",
    inPurchaseRegister: false,
    expect: { category: "credit_note_reducing_itc", amountAtRisk: 86_400 },
  },
  {
    // Supplier typed it but never filed. No unilateral remedy exists.
    ref: "RISK-NOFILE",
    supplier: "Iqbal Traders (synthetic)",
    invoiceNo: "DEMO-INV-4114",
    invoiceDate: "2026-08-11",
    taxAmount: 152_000,
    docType: "invoice",
    imsStatus: null,          // never reached the statement at all
    itcAvailable: null,
    supplierFiledDate: null,  // never filed
    inPurchaseRegister: true,
    expect: { category: "supplier_not_filed", amountAtRisk: 152_000 },
  },
  {
    // No action taken, but it is a genuine invoice the business does want.
    // Deemed acceptance here is harmless. The tool must NOT cry wolf.
    ref: "INFO-DEEMED",
    supplier: "Rao Electricals (synthetic)",
    invoiceNo: "DEMO-INV-4121",
    invoiceDate: "2026-08-22",
    taxAmount: 38_500,
    docType: "invoice",
    imsStatus: "N",
    itcAvailable: "Y",
    supplierFiledDate: "2026-09-12",
    inPurchaseRegister: true,
    expect: { category: "deemed_accept_harmless", amountAtRisk: 0 },
  },
  {
    // Government has marked this credit as not available, with a reason.
    ref: "RISK-BLOCKED",
    supplier: "Sethi Motors (synthetic)",
    invoiceNo: "DEMO-INV-4126",
    invoiceDate: "2026-08-25",
    taxAmount: 22_000,
    docType: "invoice",
    imsStatus: "A",
    itcAvailable: "N",
    unavailableReason: "POS and supplier state are the same; recipient state differs",
    supplierFiledDate: "2026-09-10",
    inPurchaseRegister: true,
    expect: { category: "itc_not_available", amountAtRisk: 22_000 },
  },
  {
    // Rejected in the portal, but the business's own books say they bought it.
    ref: "RISK-WRONGREJECT",
    supplier: "Nadkarni Steel (synthetic)",
    invoiceNo: "DEMO-INV-4131",
    invoiceDate: "2026-08-28",
    taxAmount: 64_000,
    docType: "invoice",
    imsStatus: "R",
    itcAvailable: "Y",
    supplierFiledDate: "2026-09-10",
    inPurchaseRegister: true,
    expect: { category: "wrongly_rejected", amountAtRisk: 64_000 },
  },
];

// ---------------------------------------------------------------------------
// Assign stable supplier GSTINs
// ---------------------------------------------------------------------------

const supplierNames = [...new Set(SCENARIO.map((r) => r.supplier))];
const supplierGstin = new Map(
  supplierNames.map((name, i) => [name, syntheticGstin(i + 1)]),
);
const supplierDemoId = new Map(
  supplierNames.map((name, i) => [name, `DEMO-SUPPLIER-${String(i + 1).padStart(2, "0")}`]),
);

// ---------------------------------------------------------------------------
// 1. GSTR-2B in the government's own structure
// ---------------------------------------------------------------------------

function splitTax(total) {
  // Synthetic intra-state split: CGST and SGST each half, IGST nil.
  const half = Math.round(total / 2);
  return { igst: 0, cgst: half, sgst: total - half, cess: 0 };
}

function buildGstr2b() {
  // Only rows that actually reached the statement appear here.
  const present = SCENARIO.filter((r) => r.supplierFiledDate !== null);

  const b2bBySupplier = new Map();
  const cdnrBySupplier = new Map();

  for (const row of present) {
    const target = row.docType === "credit_note" ? cdnrBySupplier : b2bBySupplier;
    const gstin = supplierGstin.get(row.supplier);
    if (!target.has(gstin)) {
      target.set(gstin, {
        ctin: gstin,
        trdnm: row.supplier,
        supfildt: formatGstnDate(row.supplierFiledDate),
        supprd: PERIOD_GSTN,
        inv: [],
      });
    }
    const tax = splitTax(row.taxAmount);
    const doc = {
      inum: row.invoiceNo,
      typ: "R",
      dt: formatGstnDate(row.invoiceDate),
      val: row.taxAmount * 6, // synthetic invoice value, tax is a fraction of it
      pos: SYNTHETIC_STATE_CODE,
      rev: "N",
      itcavl: row.itcAvailable,
      rsn: row.unavailableReason ?? "",
      diffprcnt: 1,
      txval: row.taxAmount * 5,
      ...tax,
      imsStatus: row.imsStatus,
      srctyp: "e-Invoice",
    };
    target.get(gstin).inv.push(doc);
  }

  const b2b = [...b2bBySupplier.values()];
  const cdnr = [...cdnrBySupplier.values()].map((s) => ({
    ctin: s.ctin,
    trdnm: s.trdnm,
    supfildt: s.supfildt,
    supprd: s.supprd,
    nt: s.inv.map((d) => ({ ...d, ntnum: d.inum, ntty: "C" })),
  }));

  const availableRows = present.filter(
    (r) => r.docType === "invoice" && r.itcAvailable === "Y",
  );
  const unavailableRows = present.filter(
    (r) => r.docType === "invoice" && r.itcAvailable === "N",
  );
  const reversalRows = present.filter((r) => r.docType === "credit_note");

  const sumTax = (rows) => rows.reduce((t, r) => t + r.taxAmount, 0);

  return {
    chksum: "SYNTHETIC-FIXTURE-NOT-A-REAL-CHECKSUM",
    data: {
      gstin: syntheticGstin(0), // the recipient: our demo business
      rtnprd: PERIOD_GSTN,
      version: "1.0",
      gendt: formatGstnDate(STATEMENT_DATE),
      itcsumm: {
        itcavl: { nonrevsup: { ...splitTax(sumTax(availableRows)) } },
        itcunavl: { nonrevsup: { ...splitTax(sumTax(unavailableRows)) } },
        itcrev: { nonrevsup: { ...splitTax(sumTax(reversalRows)) } },
        itcRejected: { nonrevsup: { igst: 0, cgst: 0, sgst: 0, cess: 0 } },
      },
      cpsumm: {
        b2b: b2b.map((s) => ({
          ctin: s.ctin,
          trdnm: s.trdnm,
          supfildt: s.supfildt,
          supprd: s.supprd,
          ttldocs: s.inv.length,
          ...splitTax(s.inv.reduce((t, d) => t + d.cgst + d.sgst + d.igst, 0)),
        })),
      },
      docdata: { b2b, cdnr },
    },
    _synthetic: {
      warning:
        "SYNTHETIC FIXTURE. Not government data, and not issued or checked by " +
        "any tax authority. All values are invented. The field structure " +
        "follows public developer documentation published by a licensed " +
        "commercial provider, not a schema published by GSTN. GSTIN state " +
        "code 88 is not in the published list of Indian state codes, so these " +
        "identifiers should not match any real taxpayer.",
    },
  };
}

function formatGstnDate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`; // GSTN uses DD-MM-YYYY
}

// ---------------------------------------------------------------------------
// 2. Purchase register CSV (the business's own books)
// ---------------------------------------------------------------------------

function buildPurchaseRegisterCsv() {
  const header = [
    "our_ref",
    "supplier_name",
    "supplier_gstin",
    "invoice_no",
    "invoice_date",
    "document_type",
    "tax_amount_rupees",
  ].join(",");

  const lines = SCENARIO.filter((r) => r.inPurchaseRegister).map((r, i) =>
    [
      `DEMO-PR-${String(i + 1).padStart(4, "0")}`,
      `"${r.supplier}"`,
      supplierGstin.get(r.supplier),
      r.invoiceNo,
      r.invoiceDate,
      r.docType,
      r.taxAmount,
    ].join(","),
  );

  return [header, ...lines].join("\n") + "\n";
}

// ---------------------------------------------------------------------------
// 3. riskCase.json - the flattened shape the app consumes
// ---------------------------------------------------------------------------

function buildRiskCase() {
  return {
    id: "DEMO-RISK-CASE-01",
    period: PERIOD,
    statementDate: STATEMENT_DATE,
    actionDeadline: ACTION_DEADLINE,
    annualCutoff: ANNUAL_CUTOFF,
    recipientGstin: syntheticGstin(0),
    rows: SCENARIO.map((r, i) => ({
      id: `DEMO-ROW-${String(i + 1).padStart(4, "0")}`,
      demoSupplierId: supplierDemoId.get(r.supplier),
      supplierGstin: supplierGstin.get(r.supplier),
      supplierName: r.supplier,
      invoiceNo: r.invoiceNo,
      invoiceDate: r.invoiceDate,
      taxAmount: r.taxAmount,
      docType: r.docType,
      imsStatus: r.imsStatus,
      itcAvailable: r.itcAvailable,
      unavailableReason: r.unavailableReason ?? null,
      supplierFiledDate: r.supplierFiledDate,
      inPurchaseRegister: r.inPurchaseRegister,
    })),
  };
}

// ---------------------------------------------------------------------------
// 4. answer-key.json - ground truth for scoring
// ---------------------------------------------------------------------------

function buildAnswerKey(riskCase) {
  const expectations = SCENARIO.map((r, i) => ({
    rowId: riskCase.rows[i].id,
    ref: r.ref,
    expectedCategory: r.expect.category,
    expectedAmountAtRisk: r.expect.amountAtRisk,
  }));

  const totalAtRisk = SCENARIO.reduce((t, r) => t + r.expect.amountAtRisk, 0);

  return {
    caseId: riskCase.id,
    totalAmountAtRisk: totalAtRisk,
    amountLostIfNothingDone: SCENARIO.filter(
      (r) => r.expect.category === "credit_note_reducing_itc",
    ).reduce((t, r) => t + r.expect.amountAtRisk, 0),
    deadline: ACTION_DEADLINE,
    expectations,
    note:
      "The engine must reproduce every expectedCategory and the totalAmountAtRisk " +
      "exactly. Two rows are deliberately NOT at risk so a naive engine that flags " +
      "everything fails this key.",
  };
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true });

const gstr2b = buildGstr2b();
const riskCase = buildRiskCase();
const answerKey = buildAnswerKey(riskCase);
const csv = buildPurchaseRegisterCsv();

writeFileSync(join(OUT_DIR, "gstr2b-synthetic.json"), JSON.stringify(gstr2b, null, 2));
writeFileSync(join(OUT_DIR, "purchase-register.csv"), csv);
writeFileSync(join(OUT_DIR, "riskCase.json"), JSON.stringify(riskCase, null, 2));
writeFileSync(join(OUT_DIR, "answer-key.json"), JSON.stringify(answerKey, null, 2));

console.log(`Wrote 4 files to ${OUT_DIR}\n`);
console.log(`  Rows generated:        ${riskCase.rows.length}`);
console.log(`  In GSTR-2B statement:  ${gstr2b.data.docdata.b2b.reduce((t, s) => t + s.inv.length, 0)} invoices, ${gstr2b.data.docdata.cdnr.reduce((t, s) => t + s.nt.length, 0)} credit note(s)`);
console.log(`  In purchase register:  ${SCENARIO.filter((r) => r.inPurchaseRegister).length}`);
console.log(`\n  Total at risk:         Rs ${answerKey.totalAmountAtRisk.toLocaleString("en-IN")}`);
console.log(`  Lost silently if idle: Rs ${answerKey.amountLostIfNothingDone.toLocaleString("en-IN")} on ${answerKey.deadline}`);
console.log(`\n  Categories expected:`);
for (const e of answerKey.expectations) {
  console.log(`    ${e.ref.padEnd(16)} ${e.expectedCategory.padEnd(28)} Rs ${e.expectedAmountAtRisk.toLocaleString("en-IN")}`);
}
