import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import App from "../src/App";
import type { ExplanationPayload } from "../src/contracts/explanation";
import { demoCase } from "../src/data/demoCase";
import { reconcile } from "../src/domain/reconcile";
import { EvidenceView } from "../src/views/EvidenceView";
import { ExplanationView } from "../src/views/ExplanationView";
import { NoticeView } from "../src/views/NoticeView";
import { ReviewView } from "../src/views/ReviewView";

const result = reconcile(demoCase);
const noop = vi.fn();

const explanation: ExplanationPayload = {
  caseId: "DEMO-CASE-01",
  summary:
    "The synthetic difference is fully traced to one later-period match and one possible duplicate.",
  findingExplanations: result.findings.map((finding) => ({
    findingId: finding.id,
    evidenceIds: finding.sourceRowIds,
    explanation: `Plain-language explanation for ${finding.id}.`,
    whatToVerify: "Compare the listed synthetic source rows.",
  })),
  verificationChecklist: ["Compare invoice keys with the purchase workpaper."],
  draftPartBText:
    "The difference has been reviewed against the listed synthetic records. Please review the attached explanation before any response is made.",
  limitations: ["This prototype does not determine eligibility or liability."],
  generatedAt: "2026-08-28T06:30:00.000Z",
};

describe("portal-native taxpayer journey", () => {
  it("keeps the independent prototype disclosure visible at the app level", () => {
    const html = renderToStaticMarkup(createElement(App));

    expect(html).toContain(
      "INDEPENDENT SYNTHETIC PROTOTYPE · NOT GSTN · NOT TAX ADVICE",
    );
    expect(html).toContain("Part A");
    expect(html).toContain("Source reconciliation");
    expect(html).toContain("Plain-language explanation");
    expect(html).toContain("Part B review");
  });

  it("renders Part A with the approved CTA and human-readable period", () => {
    const html = renderToStaticMarkup(
      createElement(NoticeView, {
        caseData: demoCase,
        result,
        onNext: noop,
      }),
    );

    expect(html).toContain("PART A");
    expect(html).toContain("EXPLAIN THIS DIFFERENCE");
    expect(html).toContain("April 2026");
    expect(html).toContain("₹1,50,00,000");
    expect(html).toContain("₹30,00,000");
  });

  it("renders canonical findings, record classifications, rules and source evidence", () => {
    const html = renderToStaticMarkup(
      createElement(EvidenceView, {
        caseData: demoCase,
        result,
        onBack: noop,
        onGenerate: noop,
      }),
    );

    expect(html).toContain("NEW: EXPLANATION AND SOURCE RECONCILIATION");
    expect(html).toContain("Later-period match");
    expect(html).toContain("Possible duplicate");
    expect(html).toContain("Exact match");
    expect(html).toContain("DEMO-WP-1042");
    expect(html).toContain("DEMO-2B-MAY-1042");
    expect(html).toContain(result.findings[0].matchRule);
    expect(html).not.toContain("later_period_supplier_filing");
    expect(html).not.toContain("probable_duplicate");
  });

  it("keeps deterministic evidence usable while the model fails", () => {
    const html = renderToStaticMarkup(
      createElement(ExplanationView, {
        caseData: demoCase,
        result,
        explanationState: {
          status: "error",
          error: {
            code: "rate_limited",
            message: "The explanation service is busy.",
            retryable: true,
          },
        },
        onBack: noop,
        onNext: noop,
        onGenerate: noop,
      }),
    );

    expect(html).toContain("The explanation service is busy.");
    expect(html).toContain("RETRY EXPLANATION");
    expect(html).toContain("₹18,40,000");
    expect(html).toContain("₹11,60,000");
    expect(html).toContain("CONTINUE WITH EVIDENCE ONLY");
  });

  it("renders grounded model output and its limitations", () => {
    const html = renderToStaticMarkup(
      createElement(ExplanationView, {
        caseData: demoCase,
        result,
        explanationState: { status: "success", data: explanation },
        onBack: noop,
        onNext: noop,
        onGenerate: noop,
      }),
    );

    expect(html).toContain(explanation.summary);
    expect(html).toContain("DEMO-FINDING-LATER-01");
    expect(html).toContain("DEMO-WP-1042");
    expect(html).toContain(explanation.limitations[0]);
  });

  it("renders review-only Part B actions without filing controls", () => {
    const html = renderToStaticMarkup(
      createElement(ReviewView, {
        caseData: demoCase,
        result,
        explanation,
        onBack: noop,
        onRestart: noop,
      }),
    );
    const buttonLabels = [...html.matchAll(/<button[^>]*>(.*?)<\/button>/g)]
      .map((match) => match[1].replace(/<[^>]+>/g, " "))
      .join(" ");

    expect(html).toContain("PART B");
    expect(html).toContain("COPY DRAFT");
    expect(html).toContain("PRINT REVIEW");
    expect(html).toContain("START AGAIN");
    expect(html).toContain("Nothing submitted to GSTN");
    expect(buttonLabels).not.toMatch(/\b(file|submit|dsc|evc|otp|payment|arn)\b/i);
  });
});
