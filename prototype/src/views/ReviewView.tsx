import { useState } from "react";
import { formatPeriod } from "../components/display";
import { formatInr } from "../domain/format";
import type { ReviewViewProps } from "./ViewProps";

function buildEvidenceDraft({ caseData, result }: Pick<ReviewViewProps, "caseData" | "result">): string {
  const lines = result.findings.map(
    (finding) =>
      `• ${finding.category === "later_period_match" ? "Later-period match" : "Possible duplicate"}: ${formatInr(finding.amount)} (${finding.sourceRowIds.join(", ")})`,
  );
  return [
    `Prototype review note for ${caseData.id}, tax period ${formatPeriod(caseData.period)}.`,
    `The synthetic difference of ${formatInr(result.mismatchAmount)} was traced to the following records:`,
    ...lines,
    "These evidence labels require professional verification. This draft does not determine eligibility, liability, or the response to be filed.",
  ].join("\n\n");
}

export function ReviewView({ caseData, result, explanation, onBack, onRestart }: ReviewViewProps) {
  const [copyStatus, setCopyStatus] = useState("");
  const draft = explanation?.draftPartBText ?? buildEvidenceDraft({ caseData, result });

  async function copyDraft() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopyStatus("Draft copied.");
    } catch {
      setCopyStatus("Copy was blocked by the browser. Select the draft text and copy it manually.");
    }
  }

  return (
    <section aria-labelledby="review-title" className="portal-workspace part-b-workspace">
      <div className="section-titlebar">
        <div>
          <p className="section-kicker">FORM GST DRC-01C · REVIEW-ONLY PROTOTYPE</p>
          <h1 id="review-title">Response to intimation of difference</h1>
        </div>
        <span className="status-pill draft-status">PROTOTYPE DRAFT</span>
      </div>

      <div className="form-tabs" role="tablist" aria-label="DRC-01C form parts">
        <span aria-selected="false" className="form-tab" role="tab">PART A</span>
        <span aria-selected="true" className="form-tab active" role="tab">PART B</span>
      </div>

      <div className="not-submitted" role="status">
        <strong>Nothing submitted to GSTN</strong>
        <span>This page can only copy or print a draft for professional review.</span>
      </div>

      <div className="details-grid review-details">
        <div><span>Reference number</span><strong>{caseData.id}</strong></div>
        <div><span>Tax period</span><strong>{formatPeriod(caseData.period)}</strong></div>
        <div><span>Difference reviewed</span><strong>{formatInr(result.mismatchAmount)}</strong></div>
        <div><span>Evidence findings</span><strong>{result.findings.length}</strong></div>
      </div>

      <h2 className="subsection-heading">RESPONSE TEXT FOR PROFESSIONAL REVIEW</h2>
      <div className="mandatory-label"><span>Draft explanation</span><strong aria-label="required">*</strong></div>
      <textarea aria-label="Part B prototype draft" className="draft-text" readOnly value={draft} />
      <p className="field-help">
        {explanation
          ? "This draft was generated from the validated synthetic findings by OpenAI."
          : "The model was unavailable, so this review draft lists deterministic evidence only."}
      </p>

      <aside className="professional-warning">
        <strong>Professional review required.</strong> The wording has not been
        validated by a GST practitioner. Verify source records and applicable
        requirements before using any response outside this prototype.
      </aside>

      <p className="copy-status" aria-live="polite">{copyStatus}</p>
      <div className="actions part-b-actions">
        <button className="secondary-button" onClick={onBack} type="button">BACK</button>
        <button className="secondary-button" onClick={() => void copyDraft()} type="button">COPY DRAFT</button>
        <button className="secondary-button" onClick={() => window.print()} type="button">PRINT REVIEW</button>
        <button className="primary-button" onClick={onRestart} type="button">START AGAIN</button>
      </div>
    </section>
  );
}
