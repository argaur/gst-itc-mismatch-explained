interface FlowStepperProps {
  currentView: number;
  onSelect: (view: number) => void;
}

const steps = [
  { short: "Part A", label: "Part A", context: "Existing" },
  { short: "Evidence", label: "Source reconciliation", context: "New" },
  { short: "Explanation", label: "Plain-language explanation", context: "New" },
  { short: "Part B", label: "Part B review", context: "Existing" },
];

export function FlowStepper({ currentView, onSelect }: FlowStepperProps) {
  return (
    <nav aria-label="Case response flow" className="stepper">
      {steps.map((step, index) => (
        <button
          aria-current={currentView === index ? "step" : undefined}
          className="step-button"
          key={step.label}
          onClick={() => onSelect(index)}
          type="button"
        >
          <span className="step-number" aria-hidden="true">{index + 1}</span>
          <span className="step-copy">
            <strong>{step.label}</strong>
            <small>{step.context}</small>
          </span>
        </button>
      ))}
    </nav>
  );
}
