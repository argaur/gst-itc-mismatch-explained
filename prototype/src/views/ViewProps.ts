import type {
  ExplainError,
  ExplanationPayload,
} from "../contracts/explanation";
import type { DemoCase, ReconciliationResult } from "../domain/types";

export type ExplanationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ExplanationPayload }
  | { status: "error"; error: ExplainError };

export interface ViewProps {
  caseData: DemoCase;
  result: ReconciliationResult;
  onBack?: () => void;
  onNext?: () => void;
  onRestart?: () => void;
}

export interface EvidenceViewProps extends ViewProps {
  onGenerate: () => void;
}

export interface ExplanationViewProps extends ViewProps {
  explanationState: ExplanationState;
  onGenerate: () => void;
}

export interface ReviewViewProps extends ViewProps {
  explanation?: ExplanationPayload;
}
