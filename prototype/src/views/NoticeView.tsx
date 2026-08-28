import { formatDate, formatPeriod } from "../components/display";
import { formatInr } from "../domain/format";
import type { ViewProps } from "./ViewProps";

export function NoticeView({ caseData, result, onNext }: ViewProps) {
  return (
    <section aria-labelledby="notice-title" className="portal-workspace">
      <div className="section-titlebar">
        <div>
          <p className="section-kicker">FORM GST DRC-01C · SYNTHETIC CASE</p>
          <h1 id="notice-title">Intimation of difference in input tax credit</h1>
        </div>
        <span className="status-pill">ACTION REQUIRED</span>
      </div>

      <div className="form-tabs" role="tablist" aria-label="DRC-01C form parts">
        <span aria-selected="true" className="form-tab active" role="tab">PART A</span>
        <span aria-selected="false" className="form-tab" role="tab">PART B</span>
      </div>

      <div className="notice-alert" role="alert">
        <strong>Review the difference before preparing any response.</strong>
        <span>
          The claimed ITC is {formatInr(result.mismatchAmount)} higher than the
          available ITC in this synthetic case.
        </span>
      </div>

      <div className="details-grid" aria-label="Notice details">
        <div><span>Reference number</span><strong>{caseData.id}</strong></div>
        <div><span>Tax period</span><strong>{formatPeriod(caseData.period)}</strong></div>
        <div><span>Notice date</span><strong>{formatDate(caseData.noticeDate)}</strong></div>
        <div><span>Review by</span><strong>{formatDate(caseData.reviewByDate)}</strong></div>
      </div>

      <h2 className="subsection-heading">ITC DIFFERENCE — PART A</h2>
      <div className="table-scroll" tabIndex={0} aria-label="ITC comparison table">
        <table className="tax-table">
          <thead>
            <tr>
              <th scope="col">Description</th>
              <th scope="col">Return / statement</th>
              <th className="amount-cell" scope="col">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ITC claimed</td>
              <td>GSTR-3B</td>
              <td className="amount-cell">{formatInr(caseData.claimedItc)}</td>
            </tr>
            <tr>
              <td>ITC available</td>
              <td>GSTR-2B</td>
              <td className="amount-cell">{formatInr(caseData.availableItc)}</td>
            </tr>
            <tr className="difference-row">
              <td colSpan={2}><strong>Difference requiring explanation</strong></td>
              <td className="amount-cell"><strong>{formatInr(result.mismatchAmount)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <aside className="threshold-note">
        <strong>Important:</strong> Trigger settings and legal requirements can
        change. This prototype does not determine whether a notice is valid or
        what response should be filed.
      </aside>

      <div className="actions">
        <button className="primary-button" onClick={onNext} type="button">
          EXPLAIN THIS DIFFERENCE
        </button>
      </div>
    </section>
  );
}
