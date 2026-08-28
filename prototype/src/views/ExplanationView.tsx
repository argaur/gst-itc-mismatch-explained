import { formatInr } from "../domain/format";
import type { ExplanationViewProps } from "./ViewProps";

function EvidenceFallback({ result }: Pick<ExplanationViewProps, "result">) {
  return (
    <section className="evidence-fallback" aria-labelledby="evidence-still-available">
      <h2 id="evidence-still-available">Your verified source evidence is still available</h2>
      <div className="fallback-findings">
        {result.findings.map((finding) => (
          <div key={finding.id}>
            <strong>{formatInr(finding.amount)}</strong>
            <span>{finding.category === "later_period_match" ? "Later-period match" : "Possible duplicate"}</span>
            <small>{finding.sourceRowIds.join(" · ")}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ExplanationView({
  result,
  explanationState,
  onBack,
  onNext,
  onGenerate,
}: ExplanationViewProps) {
  return (
    <section aria-labelledby="explanation-title" className="portal-workspace">
      <div className="new-feature-banner">NEW: EXPLANATION AND SOURCE RECONCILIATION</div>
      <div className="section-titlebar">
        <div>
          <p className="section-kicker">OPENAI-ASSISTED · GROUNDED IN VERIFIED FINDINGS</p>
          <h1 id="explanation-title">Plain-language explanation</h1>
        </div>
        <span className="status-pill ai-status">AI ASSISTED</span>
      </div>

      <EvidenceFallback result={result} />

      {explanationState.status === "idle" && (
        <div className="explanation-state">
          <h2>Turn the validated findings into plain language</h2>
          <p>
            The model receives only this synthetic case and its deterministic
            source evidence. It does not calculate the difference or decide a tax response.
          </p>
          <button className="primary-button" onClick={onGenerate} type="button">GENERATE EXPLANATION</button>
        </div>
      )}

      {explanationState.status === "loading" && (
        <div aria-live="polite" className="explanation-state loading-state" role="status">
          <span className="loading-indicator" aria-hidden="true" />
          <div>
            <h2>Preparing a grounded explanation…</h2>
            <p>Your verified source evidence remains visible while the model responds.</p>
          </div>
        </div>
      )}

      {explanationState.status === "error" && (
        <div className="model-error" role="alert">
          <h2>We could not generate the explanation</h2>
          <p>{explanationState.error.message}</p>
          <p>
            No evidence was lost. You can retry or continue to a review-only
            Part B draft built from the deterministic findings.
          </p>
          <div className="inline-actions">
            {explanationState.error.retryable && (
              <button className="primary-button" onClick={onGenerate} type="button">RETRY EXPLANATION</button>
            )}
            <button className="secondary-button" onClick={onNext} type="button">CONTINUE WITH EVIDENCE ONLY</button>
          </div>
        </div>
      )}

      {explanationState.status === "success" && (
        <div className="generated-explanation">
          <div className="ai-disclosure">
            <strong>Generated explanation</strong>
            <span>OpenAI-assisted · facts and arithmetic supplied by deterministic code</span>
          </div>
          <section className="summary-block">
            <h2>What this difference means</h2>
            <p>{explanationState.data.summary}</p>
          </section>

          <h2 className="subsection-heading">FINDING-BY-FINDING EXPLANATION</h2>
          <div className="explanation-findings">
            {explanationState.data.findingExplanations.map((item) => (
              <article key={item.findingId}>
                <h3>{item.findingId}</h3>
                <p>{item.explanation}</p>
                <p><strong>What to verify:</strong> {item.whatToVerify}</p>
                <p className="source-links"><strong>Evidence:</strong> {item.evidenceIds.map((id) => <code key={id}>{id}</code>)}</p>
              </article>
            ))}
          </div>

          <div className="two-column-info">
            <section>
              <h2>Verification checklist</h2>
              <ul>{explanationState.data.verificationChecklist.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h2>What this prototype cannot decide</h2>
              <ul>{explanationState.data.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>
        </div>
      )}

      <div className="actions split">
        <button className="secondary-button" onClick={onBack} type="button">BACK TO SOURCE EVIDENCE</button>
        {explanationState.status === "success" && (
          <button className="primary-button" onClick={onNext} type="button">REVIEW PART B DRAFT</button>
        )}
      </div>
    </section>
  );
}
