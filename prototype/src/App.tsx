import { useMemo, useState } from "react";
import { FlowStepper } from "./components/FlowStepper";
import type { ExplainCaseResponse } from "./contracts/explanation";
import { demoCase } from "./data/demoCase";
import { reconcile } from "./domain/reconcile";
import { EvidenceView } from "./views/EvidenceView";
import { ExplanationView } from "./views/ExplanationView";
import { NoticeView } from "./views/NoticeView";
import { ReviewView } from "./views/ReviewView";
import type { ExplanationState } from "./views/ViewProps";

const viewLabels = [
  "Part A",
  "Source reconciliation",
  "Plain-language explanation",
  "Part B review",
];

function isExplainCaseResponse(value: unknown): value is ExplainCaseResponse {
  if (!value || typeof value !== "object" || !("ok" in value)) return false;
  if (value.ok === true) return "data" in value && Boolean(value.data);
  if (value.ok !== false || !("error" in value) || !value.error || typeof value.error !== "object") {
    return false;
  }
  return (
    "code" in value.error &&
    typeof value.error.code === "string" &&
    "message" in value.error &&
    typeof value.error.message === "string" &&
    "retryable" in value.error &&
    typeof value.error.retryable === "boolean"
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState(0);
  const [explanationState, setExplanationState] = useState<ExplanationState>({
    status: "idle",
  });
  const result = useMemo(() => reconcile(demoCase), []);

  const commonProps = {
    caseData: demoCase,
    result,
  };

  async function generateExplanation() {
    setCurrentView(2);
    setExplanationState({ status: "loading" });

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId: demoCase.id }),
      });
      const payload: unknown = await response.json();

      if (!isExplainCaseResponse(payload)) {
        throw new Error("The explanation endpoint returned an invalid envelope.");
      }

      if (!response.ok || !payload.ok) {
        setExplanationState({
          status: "error",
          error: payload.ok
            ? {
                code: "upstream_failure",
                message: "The explanation service could not be reached.",
                retryable: true,
              }
            : payload.error,
        });
        return;
      }

      setExplanationState({ status: "success", data: payload.data });
    } catch {
      setExplanationState({
        status: "error",
        error: {
          code: "upstream_failure",
          message:
            "The explanation service is temporarily unavailable. Your source reconciliation is still available below.",
          retryable: true,
        },
      });
    }
  }

  function restart() {
    setExplanationState({ status: "idle" });
    setCurrentView(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="prototype-strip" role="note">
        INDEPENDENT SYNTHETIC PROTOTYPE · NOT GSTN · NOT TAX ADVICE
      </div>
      <header className="portal-header">
        <div className="utility-bar">
          <span>Taxpayer services prototype</span>
          <span>English</span>
        </div>
        <div className="brand-row">
          <div className="brand-mark" aria-hidden="true">NE</div>
          <div>
            <p className="product-name">Notice, Explained</p>
            <p className="product-subtitle">GST ITC difference review</p>
          </div>
          <div className="case-reference">
            <span>DEMO REFERENCE</span>
            <strong>{demoCase.id}</strong>
          </div>
        </div>
        <nav className="primary-nav" aria-label="Prototype navigation">
          <span>HOME</span>
          <span className="active">SERVICES</span>
          <span>RETURNS</span>
          <span>HELP</span>
        </nav>
      </header>

      <div className="page-frame">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <span>Home</span><span aria-hidden="true">›</span>
          <span>Returns</span><span aria-hidden="true">›</span>
          <strong>{viewLabels[currentView]}</strong>
        </nav>

        <FlowStepper currentView={currentView} onSelect={setCurrentView} />

        <main id="main-content" tabIndex={-1}>
          {currentView === 0 && (
            <NoticeView {...commonProps} onNext={() => setCurrentView(1)} />
          )}
          {currentView === 1 && (
            <EvidenceView
              {...commonProps}
              onBack={() => setCurrentView(0)}
              onGenerate={() => void generateExplanation()}
            />
          )}
          {currentView === 2 && (
            <ExplanationView
              {...commonProps}
              explanationState={explanationState}
              onBack={() => setCurrentView(1)}
              onNext={() => setCurrentView(3)}
              onGenerate={() => void generateExplanation()}
            />
          )}
          {currentView === 3 && (
            <ReviewView
              {...commonProps}
              explanation={
                explanationState.status === "success"
                  ? explanationState.data
                  : undefined
              }
              onBack={() => setCurrentView(2)}
              onRestart={restart}
            />
          )}
        </main>
      </div>

      <footer className="portal-footer">
        <strong>Independent hackathon prototype.</strong> Synthetic records only.
        No connection to GSTN or any government system. Nothing can be filed
        from this experience.
      </footer>
    </div>
  );
}
