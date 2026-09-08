import { useEffect, useState, type FormEvent } from "react";
import { formatDate, formatPeriod } from "../components/display";
import type {
  ResponsibleParty,
  RiskAssessmentResult,
  RiskCategory,
} from "../contracts/riskAssessment";
import { formatInr } from "../domain/format";
import { sortItemsForDisplay } from "../domain/assessRisk";

type Language = "hi" | "en";

interface RiskViewProps {
  result: RiskAssessmentResult;
  onBack: () => void;
}

interface ApiError {
  code: string;
  message: string;
  retryable: boolean;
}

interface RiskProse {
  rowId: string;
  sentence: string;
}

type RiskExplanationState =
  | { status: "idle" | "loading" }
  | { status: "success"; explanations: RiskProse[] }
  | { status: "error"; error: ApiError };

type AnswerState =
  | { status: "idle" | "loading" }
  | {
      status: "success";
      answer: string;
      citedRowIds: string[];
      answerable: boolean;
    }
  | { status: "error"; error: ApiError };

const CATEGORY_LABELS: Record<RiskCategory, string> = {
  credit_note_reducing_itc: "Credit note reduces ITC · क्रेडिट कम होगा",
  supplier_not_filed: "Supplier has not filed · सप्लायर ने फाइल नहीं किया",
  itc_not_available: "Credit marked unavailable · क्रेडिट उपलब्ध नहीं",
  wrongly_rejected: "Possibly rejected by mistake · शायद गलती से अस्वीकार",
  deemed_accept_harmless: "Automatic acceptance looks safe · अपने रिकॉर्ड से सही",
  no_action_needed: "No action needed · कोई कार्रवाई नहीं",
};

const PARTY_LABELS: Record<ResponsibleParty, string> = {
  supplier: "Supplier",
  you: "You or your team",
  rules: "System rules",
  nobody: "Nobody",
};

const SUGGESTED_QUESTIONS = [
  "मेरा पैसा क्यों कम हुआ?",
  "सबसे पहले क्या करूँ?",
  "किसकी गलती है?",
  "Verma Packaging ka kya hua?",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readApiError(value: unknown): ApiError | undefined {
  if (!isRecord(value) || value.ok !== false || !isRecord(value.error)) {
    return undefined;
  }
  if (
    typeof value.error.code !== "string" ||
    typeof value.error.message !== "string" ||
    typeof value.error.retryable !== "boolean"
  ) {
    return undefined;
  }
  return {
    code: value.error.code,
    message: value.error.message,
    retryable: value.error.retryable,
  };
}

function readRiskProse(value: unknown): RiskProse[] | undefined {
  if (!isRecord(value) || value.ok !== true || !isRecord(value.data)) {
    return undefined;
  }
  if (!Array.isArray(value.data.explanations)) return undefined;

  const explanations: RiskProse[] = [];
  const seen = new Set<string>();
  for (const item of value.data.explanations) {
    if (
      !isRecord(item) ||
      typeof item.rowId !== "string" ||
      typeof item.sentence !== "string" ||
      item.sentence.trim().length === 0 ||
      seen.has(item.rowId)
    ) {
      return undefined;
    }
    seen.add(item.rowId);
    explanations.push({
      rowId: item.rowId,
      sentence: item.sentence.trim(),
    });
  }
  return explanations;
}

function readAnswer(
  value: unknown,
):
  | { answer: string; citedRowIds: string[]; answerable: boolean }
  | undefined {
  if (!isRecord(value) || value.ok !== true || !isRecord(value.data)) {
    return undefined;
  }
  if (
    typeof value.data.answer !== "string" ||
    typeof value.data.answerable !== "boolean" ||
    !Array.isArray(value.data.citedRowIds) ||
    value.data.citedRowIds.some((rowId) => typeof rowId !== "string")
  ) {
    return undefined;
  }
  return {
    answer: value.data.answer,
    citedRowIds: value.data.citedRowIds as string[],
    answerable: value.data.answerable,
  };
}

export function RiskView({ result, onBack }: RiskViewProps) {
  const [language, setLanguage] = useState<Language>("hi");
  const [question, setQuestion] = useState("");
  const [explanationState, setExplanationState] =
    useState<RiskExplanationState>({ status: "idle" });
  const [answerState, setAnswerState] = useState<AnswerState>({
    status: "idle",
  });

  const items = sortItemsForDisplay(result.items);
  const knownRowIds = new Set<string>(result.items.map((item) => item.rowId));
  const safeCount = result.items.filter(
    (item) => item.amountAtRisk === 0,
  ).length;

  useEffect(() => {
    const controller = new AbortController();
    setExplanationState({ status: "loading" });

    async function loadExplanation() {
      try {
        const response = await fetch("/api/explain-risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            caseId: result.caseId,
            language,
          }),
          signal: controller.signal,
        });
        const payload: unknown = await response.json();
        if (!response.ok) {
          const error = readApiError(payload);
          throw new Error(
            error?.message ??
              "Plain-language text is unavailable. The verified list remains available.",
          );
        }

        const explanations = readRiskProse(payload);
        if (
          !explanations ||
          explanations.some(({ rowId }) => !knownRowIds.has(rowId))
        ) {
          throw new Error(
            "Plain-language text could not be verified. The verified list remains available.",
          );
        }
        setExplanationState({ status: "success", explanations });
      } catch (error) {
        if (controller.signal.aborted) return;
        setExplanationState({
          status: "error",
          error: {
            code: "upstream_failure",
            message:
              error instanceof Error
                ? error.message
                : "Plain-language text is unavailable. The verified list remains available.",
            retryable: true,
          },
        });
      }
    }

    void loadExplanation();
    return () => controller.abort();
  }, [language, result.caseId]);

  async function askQuestion(questionText: string) {
    const trimmed = questionText.trim();
    if (!trimmed) return;

    setQuestion(trimmed);
    setAnswerState({ status: "loading" });

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: result.caseId,
          question: trimmed,
          language,
        }),
      });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const error = readApiError(payload);
        setAnswerState({
          status: "error",
          error: error ?? {
            code: "upstream_failure",
            message:
              "The question could not be answered. The verified risk list is unchanged.",
            retryable: true,
          },
        });
        return;
      }

      const answer = readAnswer(payload);
      if (
        !answer ||
        answer.citedRowIds.some((rowId) => !knownRowIds.has(rowId))
      ) {
        throw new Error("The answer endpoint returned an invalid response.");
      }
      setAnswerState({ status: "success", ...answer });
    } catch {
      setAnswerState({
        status: "error",
        error: {
          code: "upstream_failure",
          message:
            "The question could not be answered. The verified risk list is unchanged.",
          retryable: true,
        },
      });
    }
  }

  function submitQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askQuestion(question);
  }

  const proseByRow =
    explanationState.status === "success"
      ? new Map(
          explanationState.explanations.map((explanation) => [
            explanation.rowId,
            explanation.sentence,
          ]),
        )
      : new Map<string, string>();

  return (
    <section aria-labelledby="risk-title" className="portal-workspace">
      <div className="new-feature-banner">
        NEW: SILENT-LOSS CHECK BEFORE THE DEADLINE
      </div>

      <div className="section-titlebar">
        <div>
          <p className="section-kicker">
            DETERMINISTIC MONTHLY RISK ASSESSMENT
          </p>
          <h1 id="risk-title">
            Silence is a decision: {formatInr(result.amountLostIfNothingDone)}{" "}
            can disappear if nobody responds
          </h1>
        </div>
        <span className="status-pill">
          {result.daysRemaining >= 0
            ? `${result.daysRemaining} DAYS LEFT`
            : "DEADLINE PASSED"}
        </span>
      </div>

      <div className="details-grid">
        <div>
          <span>Tax period</span>
          <strong>{formatPeriod(result.period)}</strong>
        </div>
        <div>
          <span>Total amount needing attention</span>
          <strong>{formatInr(result.totalAmountAtRisk)}</strong>
        </div>
        <div>
          <span>Lost automatically if idle</span>
          <strong>{formatInr(result.amountLostIfNothingDone)}</strong>
        </div>
        <div>
          <span>Action deadline</span>
          <strong>{formatDate(result.actionDeadline)}</strong>
        </div>
      </div>

      <p className="plain-summary">
        The amounts and classifications below were produced immediately by
        fixed rules. AI does not calculate them or decide eligibility. It only
        adds optional plain-language sentences after this verified list is
        already visible.
      </p>

      <div className="category-summary" aria-label="Risk assessment summary">
        <div>
          <strong>{result.items.length}</strong>
          <span>Rows checked</span>
        </div>
        <div>
          <strong>{result.items.length - safeCount}</strong>
          <span>Need attention</span>
        </div>
        <div>
          <strong>{safeCount}</strong>
          <span>Nothing at risk</span>
        </div>
        <div>
          <strong>{formatInr(result.amountLostIfNothingDone)}</strong>
          <span>Silent loss</span>
        </div>
      </div>

      <div className="language-control" aria-label="AI answer language">
        <strong>AI prose language</strong>
        <div className="inline-actions">
          <button
            aria-pressed={language === "hi"}
            className={
              language === "hi" ? "primary-button" : "secondary-button"
            }
            onClick={() => setLanguage("hi")}
            type="button"
          >
            हिन्दी
          </button>
          <button
            aria-pressed={language === "en"}
            className={
              language === "en" ? "primary-button" : "secondary-button"
            }
            onClick={() => setLanguage("en")}
            type="button"
          >
            English
          </button>
        </div>
        <small>
          This changes optional model-written prose only. Verified amounts and
          category labels do not change.
        </small>
      </div>

      <h2 className="subsection-heading">EVERY ROW, INCLUDING SAFE ROWS</h2>
      <div className="finding-list">
        {items.map((item, index) => {
          const isSafe = item.amountAtRisk === 0;
          const prose = proseByRow.get(item.rowId);

          return (
            <details className="finding-panel" key={item.rowId} open>
              <summary>
                <span className="finding-index">{index + 1}</span>
                <span className="finding-summary-copy">
                  <strong>{CATEGORY_LABELS[item.category]}</strong>
                  <small>{item.rowId}</small>
                </span>
                <span
                  className={`confidence ${
                    isSafe ? "strong_evidence" : "needs_verification"
                  }`}
                >
                  {isSafe ? "SAFE — NO ACTION NEEDED" : "NEEDS ATTENTION"}
                </span>
                <strong className="finding-amount">
                  {isSafe
                    ? `${formatInr(0)} at risk`
                    : formatInr(item.amountAtRisk)}
                </strong>
              </summary>

              <div className="finding-body">
                <p>
                  <strong>{item.supplierName}</strong> ·{" "}
                  <code>{item.invoiceNo}</code>
                </p>
                <p>{item.whyItMatters}</p>

                <dl className="rule-grid">
                  <div>
                    <dt>Whose action caused this?</dt>
                    <dd>{PARTY_LABELS[item.whoCausedIt]}</dd>
                  </div>
                  <div>
                    <dt>What to do</dt>
                    <dd>
                      {isSafe
                        ? "No action needed based on these records."
                        : item.whatToDo}
                    </dd>
                  </div>
                </dl>

                <div className="table-scroll evidence-table" tabIndex={0}>
                  <table className="tax-table compact">
                    <thead>
                      <tr>
                        <th scope="col">IMS status</th>
                        <th scope="col">ITC available</th>
                        <th scope="col">Supplier filed</th>
                        <th scope="col">In own records</th>
                        <th scope="col">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{item.evidenceFields.imsStatus ?? "Not present"}</td>
                        <td>
                          {item.evidenceFields.itcAvailable ?? "Not present"}
                        </td>
                        <td>
                          {item.evidenceFields.supplierFiledDate
                            ? formatDate(
                                item.evidenceFields.supplierFiledDate,
                              )
                            : "Not filed"}
                        </td>
                        <td>
                          {item.evidenceFields.inPurchaseRegister
                            ? "Yes"
                            : "No"}
                        </td>
                        <td>
                          {item.evidenceFields.unavailableReason ??
                            "No reason recorded"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {prose && (
                  <div className="ai-disclosure">
                    <strong>AI plain-language note</strong>
                    <span>{prose}</span>
                  </div>
                )}
              </div>
            </details>
          );
        })}
      </div>

      <div className="evidence-fallback" aria-live="polite">
        {explanationState.status === "loading" && (
          <>
            <h2>Verified list is ready</h2>
            <p>
              Optional {language === "hi" ? "Hindi" : "English"} prose is being
              prepared without blocking the evidence above.
            </p>
          </>
        )}
        {explanationState.status === "error" && (
          <>
            <h2>Optional AI prose is unavailable</h2>
            <p>{explanationState.error.message}</p>
          </>
        )}
        {explanationState.status === "success" && (
          <>
            <h2>Verified AI prose added</h2>
            <p>
              Each sentence is attached to a real row. The deterministic
              categories and amounts remain the source of truth.
            </p>
          </>
        )}
      </div>

      <h2 className="subsection-heading">ASK IN YOUR OWN WORDS</h2>
      <div className="generated-explanation">
        <p>
          Ask in Hindi, English, or a mix. The model may only answer from the
          findings above, must cite a real row, and cannot introduce a number
          the engine did not produce.
        </p>

        <div className="inline-actions" aria-label="Suggested questions">
          {SUGGESTED_QUESTIONS.map((suggestion) => (
            <button
              className="secondary-button"
              disabled={answerState.status === "loading"}
              key={suggestion}
              onClick={() => void askQuestion(suggestion)}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form onSubmit={submitQuestion}>
          <label className="mandatory-label" htmlFor="risk-question">
            Your question <strong aria-hidden="true">*</strong>
          </label>
          <textarea
            className="draft-text risk-question"
            id="risk-question"
            maxLength={300}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Type your question here…"
            required
            rows={3}
            value={question}
          />
          <p className="field-help">
            Maximum 300 characters. Do not enter real GSTINs or taxpayer data.
          </p>
          <div className="actions">
            <button
              className="primary-button"
              disabled={
                answerState.status === "loading" || question.trim().length === 0
              }
              type="submit"
            >
              {answerState.status === "loading"
                ? "CHECKING THE FINDINGS…"
                : "ASK FROM VERIFIED FINDINGS"}
            </button>
          </div>
        </form>

        <div aria-live="polite">
          {answerState.status === "success" && (
            <div className="explanation-state">
              <h2>
                {answerState.answerable
                  ? "Answer from verified findings"
                  : "This cannot be answered from these findings"}
              </h2>
              <p>{answerState.answer}</p>
              {answerState.citedRowIds.length > 0 && (
                <p className="source-links">
                  Sources:{" "}
                  {answerState.citedRowIds.map((rowId) => (
                    <code key={rowId}>{rowId}</code>
                  ))}
                </p>
              )}
            </div>
          )}

          {answerState.status === "error" && (
            <div className="model-error">
              <h2>The answer was not shown</h2>
              <p>{answerState.error.message}</p>
              <p>The verified risk list above remains fully usable.</p>
            </div>
          )}
        </div>
      </div>

      <aside className="info-note">
        Synthetic test data only. It is shaped to the structure used by
        licensed commercial GST software, the best public reference available.
        Every value is invented. These are evidence labels, not tax advice or
        an eligibility decision.
      </aside>

      <div className="actions split">
        <button className="secondary-button" onClick={onBack} type="button">
          BACK TO PART B
        </button>
      </div>
    </section>
  );
}
