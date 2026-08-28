import { formatPeriod, humanize } from "../components/display";
import { formatInr } from "../domain/format";
import type { Finding, ReconciliationCategory } from "../domain/types";
import type { EvidenceViewProps } from "./ViewProps";

const categoryLabels: Record<ReconciliationCategory, string> = {
  exact_match: "Exact match",
  missing_in_2b: "Missing in 2B",
  possible_duplicate: "Possible duplicate",
  later_period_match: "Later-period match",
};

function SourceEvidence({ finding, caseData }: Pick<EvidenceViewProps, "caseData"> & { finding: Finding }) {
  const sourceRows = finding.sourceRowIds.map((sourceId) => {
    const purchaseRow = caseData.purchaseClaimRows.find(({ id }) => id === sourceId);
    if (purchaseRow) {
      return { ...purchaseRow, source: "Purchase / claim workpaper", period: caseData.period };
    }
    const gstr2bRow = caseData.gstr2bRows.find(({ id }) => id === sourceId);
    if (!gstr2bRow) throw new Error(`Missing source evidence for ${sourceId}`);
    return { ...gstr2bRow, source: "GSTR-2B extract" };
  });

  return (
    <div className="table-scroll evidence-table" tabIndex={0} aria-label={`${finding.id} source evidence`}>
      <table className="tax-table compact">
        <thead>
          <tr>
            <th scope="col">Source</th>
            <th scope="col">Source row ID</th>
            <th scope="col">Invoice</th>
            <th scope="col">Period</th>
            <th className="amount-cell" scope="col">Tax amount</th>
          </tr>
        </thead>
        <tbody>
          {sourceRows.map((row) => (
            <tr key={row.id}>
              <td>{row.source}</td>
              <td><code>{row.id}</code></td>
              <td><code>{row.invoiceNo}</code></td>
              <td>{formatPeriod(row.period)}</td>
              <td className="amount-cell">{formatInr(row.taxAmount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EvidenceView({ caseData, result, onBack, onGenerate }: EvidenceViewProps) {
  const categoryCounts = result.recordClassifications.reduce(
    (counts, record) => ({ ...counts, [record.category]: counts[record.category] + 1 }),
    { exact_match: 0, missing_in_2b: 0, possible_duplicate: 0, later_period_match: 0 },
  );

  return (
    <section aria-labelledby="evidence-title" className="portal-workspace">
      <div className="new-feature-banner">NEW: EXPLANATION AND SOURCE RECONCILIATION</div>
      <div className="section-titlebar">
        <div>
          <p className="section-kicker">DETERMINISTIC RECONCILIATION</p>
          <h1 id="evidence-title">Two findings explain the full difference</h1>
        </div>
        <span className="status-pill complete">FULLY TRACED</span>
      </div>

      <p className="plain-summary">
        We compared the synthetic purchase workpaper with current and later
        GSTR-2B extracts. The evidence below accounts for all {formatInr(result.mismatchAmount)}.
      </p>

      <div className="proof-equation" aria-label="Difference proof">
        <span><small>Later-period match</small>{formatInr(result.findings.find(({ category }) => category === "later_period_match")?.amount ?? 0)}</span>
        <b aria-hidden="true">+</b>
        <span><small>Possible duplicate</small>{formatInr(result.findings.find(({ category }) => category === "possible_duplicate")?.amount ?? 0)}</span>
        <b aria-hidden="true">=</b>
        <span className="proof-total"><small>Difference explained</small>{formatInr(result.mismatchAmount)}</span>
      </div>

      <h2 className="subsection-heading">RECORD CLASSIFICATION SUMMARY</h2>
      <div className="category-summary">
        {(Object.keys(categoryLabels) as ReconciliationCategory[]).map((category) => (
          <div key={category}>
            <strong>{categoryCounts[category]}</strong>
            <span>{categoryLabels[category]}</span>
          </div>
        ))}
      </div>

      <h2 className="subsection-heading">FINDINGS AND SOURCE EVIDENCE</h2>
      <div className="finding-list">
        {result.findings.map((finding, index) => (
          <details className="finding-panel" key={finding.id} open>
            <summary>
              <span className="finding-index">{index + 1}</span>
              <span className="finding-summary-copy">
                <strong>{categoryLabels[finding.category]}</strong>
                <small>{finding.id}</small>
              </span>
              <span className={`confidence ${finding.confidenceLabel}`}>{humanize(finding.confidenceLabel)}</span>
              <strong className="finding-amount">{formatInr(finding.amount)}</strong>
            </summary>
            <div className="finding-body">
              <p>{finding.evidence}</p>
              <dl className="rule-grid">
                <div><dt>Match rule</dt><dd>{finding.matchRule}</dd></div>
                <div><dt>Fields compared</dt><dd>{finding.comparedFields.map(humanize).join(", ")}</dd></div>
              </dl>
              <SourceEvidence caseData={caseData} finding={finding} />
            </div>
          </details>
        ))}
      </div>

      <aside className="info-note">
        These are evidence labels, not tax conclusions. A later-period match
        does not prove eligibility, and a possible duplicate is not proof of a
        double claim. Verify the source records with a qualified professional.
      </aside>

      <div className="actions split">
        <button className="secondary-button" onClick={onBack} type="button">BACK TO PART A</button>
        <button className="primary-button" onClick={onGenerate} type="button">GENERATE PLAIN-LANGUAGE EXPLANATION</button>
      </div>
    </section>
  );
}
