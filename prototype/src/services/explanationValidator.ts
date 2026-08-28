import type { ExplanationPayload } from "../contracts/explanation.js";
import type {
  DemoId,
  Finding,
  ReconciliationResult,
} from "../contracts/reconciliation.js";

export const REQUIRED_LIMITATIONS = [
  "This is an independent synthetic prototype, not GSTN.",
  "This explanation is not tax advice and needs review by a qualified GST professional.",
  "Later-period evidence and possible duplicate labels are indicators only; they do not determine ITC eligibility, liability, or the correct filing response.",
  "Nothing has been submitted to GSTN.",
] as const;

const MODEL_PAYLOAD_KEYS = [
  "summary",
  "findingExplanations",
  "verificationChecklist",
  "draftPartBText",
  "limitations",
] as const;

const FINDING_EXPLANATION_KEYS = [
  "findingId",
  "evidenceIds",
  "explanation",
  "whatToVerify",
] as const;

const MONEY_CLAIM_PATTERN =
  /(?:₹\s*\d)|(?:\b(?:INR|Rs\.?|rupees?)\b\s*[:.]?\s*\d)|(?:\b\d+(?:\.\d+)?\s*(?:lakh|lakhs|crore|crores)\b)/i;
const PRESCRIPTIVE_TAX_ACTION_PATTERN =
  /(?:\b(?:you|taxpayer|we)\s+(?:must|should|need to|have to)\s+(?:pay|reverse|claim|file|submit|contest|accept|reject)\b)|(?:\b(?:eligible|ineligible|tax is due|liability is)\b)/i;
const DEMO_ID_PATTERN = /\bDEMO-[A-Z0-9-]+\b/g;

interface ModelFindingExplanation {
  findingId: DemoId;
  evidenceIds: DemoId[];
  explanation: string;
  whatToVerify: string;
}

interface ModelExplanationPayload {
  summary: string;
  findingExplanations: ModelFindingExplanation[];
  verificationChecklist: string[];
  draftPartBText: string;
  limitations: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
  field: string,
): void {
  const actualKeys = Object.keys(value).sort();
  const expected = [...expectedKeys].sort();
  if (
    actualKeys.length !== expected.length ||
    actualKeys.some((key, index) => key !== expected[index])
  ) {
    throw new Error(`${field} contains an unexpected or missing property.`);
  }
}

function readBoundedString(
  value: unknown,
  field: string,
  minLength = 1,
  maxLength = 1_200,
): string {
  if (typeof value !== "string") {
    throw new Error(`${field} must be a string.`);
  }
  const normalized = value.trim();
  if (normalized.length < minLength || normalized.length > maxLength) {
    throw new Error(
      `${field} must contain ${minLength}-${maxLength} characters.`,
    );
  }
  return normalized;
}

function readStringArray(
  value: unknown,
  field: string,
  minItems: number,
  maxItems: number,
  maxItemLength = 500,
): string[] {
  if (
    !Array.isArray(value) ||
    value.length < minItems ||
    value.length > maxItems
  ) {
    throw new Error(`${field} must contain ${minItems}-${maxItems} items.`);
  }
  return value.map((item, index) =>
    readBoundedString(item, `${field}[${index}]`, 1, maxItemLength),
  );
}

function assertSameOrderedValues(
  actual: readonly string[],
  expected: readonly string[],
  field: string,
): void {
  if (
    actual.length !== expected.length ||
    actual.some((value, index) => value !== expected[index])
  ) {
    throw new Error(`${field} does not match the trusted evidence.`);
  }
}

function assertNarrativeGrounding(
  strings: readonly string[],
  allowedIds: ReadonlySet<string>,
): void {
  for (const text of strings) {
    if (MONEY_CLAIM_PATTERN.test(text)) {
      throw new Error(
        "Model narrative must not make monetary claims; amounts come from deterministic evidence.",
      );
    }
    if (PRESCRIPTIVE_TAX_ACTION_PATTERN.test(text)) {
      throw new Error(
        "Model narrative contains unsupported tax advice or a filing instruction.",
      );
    }
    for (const id of text.match(DEMO_ID_PATTERN) ?? []) {
      if (!allowedIds.has(id)) {
        throw new Error(`Model narrative contains an unknown evidence ID: ${id}.`);
      }
    }
  }
}

function trustedFindingById(
  result: ReconciliationResult,
): Map<DemoId, Finding> {
  return new Map(result.findings.map((finding) => [finding.id, finding]));
}

export function validateModelExplanation(
  value: unknown,
  result: ReconciliationResult,
  generatedAt: string,
): ExplanationPayload {
  if (!isRecord(value)) {
    throw new Error("Model output must be a JSON object.");
  }
  assertExactKeys(value, MODEL_PAYLOAD_KEYS, "Model output");

  const summary = readBoundedString(value.summary, "summary", 20, 700);
  const draftPartBText = readBoundedString(
    value.draftPartBText,
    "draftPartBText",
    40,
    1_200,
  );
  const verificationChecklist = readStringArray(
    value.verificationChecklist,
    "verificationChecklist",
    2,
    5,
  );
  const limitations = readStringArray(
    value.limitations,
    "limitations",
    REQUIRED_LIMITATIONS.length,
    REQUIRED_LIMITATIONS.length,
  );
  assertSameOrderedValues(limitations, REQUIRED_LIMITATIONS, "limitations");

  if (
    !Array.isArray(value.findingExplanations) ||
    value.findingExplanations.length !== result.findings.length
  ) {
    throw new Error(
      "findingExplanations must cover every trusted finding exactly once.",
    );
  }

  const trustedFindings = trustedFindingById(result);
  const seenFindingIds = new Set<DemoId>();
  const narrativeStrings = [summary, draftPartBText, ...verificationChecklist];

  const findingExplanations = value.findingExplanations.map(
    (rawFinding, index): ModelFindingExplanation => {
      if (!isRecord(rawFinding)) {
        throw new Error(`findingExplanations[${index}] must be an object.`);
      }
      assertExactKeys(
        rawFinding,
        FINDING_EXPLANATION_KEYS,
        `findingExplanations[${index}]`,
      );

      const findingId = readBoundedString(
        rawFinding.findingId,
        `findingExplanations[${index}].findingId`,
        6,
        100,
      ) as DemoId;
      const trustedFinding = trustedFindings.get(findingId);
      if (!trustedFinding || seenFindingIds.has(findingId)) {
        throw new Error(`Unknown or repeated finding ID: ${findingId}.`);
      }
      seenFindingIds.add(findingId);

      const evidenceIds = readStringArray(
        rawFinding.evidenceIds,
        `findingExplanations[${index}].evidenceIds`,
        trustedFinding.sourceRowIds.length,
        trustedFinding.sourceRowIds.length,
        100,
      ) as DemoId[];
      assertSameOrderedValues(
        evidenceIds,
        trustedFinding.sourceRowIds,
        `Evidence IDs for ${findingId}`,
      );

      const explanation = readBoundedString(
        rawFinding.explanation,
        `findingExplanations[${index}].explanation`,
        20,
        700,
      );
      const whatToVerify = readBoundedString(
        rawFinding.whatToVerify,
        `findingExplanations[${index}].whatToVerify`,
        20,
        500,
      );
      narrativeStrings.push(explanation, whatToVerify);

      return { findingId, evidenceIds, explanation, whatToVerify };
    },
  );

  if (seenFindingIds.size !== trustedFindings.size) {
    throw new Error("Model output omitted a trusted finding.");
  }

  const allowedIds = new Set<string>([
    result.caseId,
    ...result.findings.flatMap((finding) => [
      finding.id,
      ...finding.sourceRowIds,
    ]),
  ]);
  assertNarrativeGrounding(narrativeStrings, allowedIds);

  if (Number.isNaN(Date.parse(generatedAt))) {
    throw new Error("generatedAt must be a valid ISO timestamp.");
  }

  return {
    caseId: result.caseId,
    summary,
    findingExplanations,
    verificationChecklist,
    draftPartBText,
    limitations,
    generatedAt,
  };
}

export function buildTrustedModelInput(
  result: ReconciliationResult,
): Record<string, unknown> {
  return {
    caseId: result.caseId,
    aggregate: {
      claimedItcRupees: result.claimedItc,
      availableItcRupees: result.availableItc,
      mismatchRupees: result.mismatchAmount,
    },
    findings: result.findings.map((finding) => ({
      findingId: finding.id,
      category: finding.category,
      amountRupees: finding.amount,
      evidenceIds: finding.sourceRowIds,
      matchRule: finding.matchRule,
      evidence: finding.evidence,
      confidenceLabel: finding.confidenceLabel,
    })),
  };
}

export function createExplanationJsonSchema(
  result: ReconciliationResult,
): Record<string, unknown> {
  const findingIds = result.findings.map((finding) => finding.id);
  const evidenceIds = result.findings.flatMap(
    (finding) => finding.sourceRowIds,
  );

  return {
    type: "object",
    additionalProperties: false,
    required: [...MODEL_PAYLOAD_KEYS],
    properties: {
      summary: { type: "string" },
      findingExplanations: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [...FINDING_EXPLANATION_KEYS],
          properties: {
            findingId: { type: "string", enum: findingIds },
            evidenceIds: {
              type: "array",
              items: { type: "string", enum: evidenceIds },
            },
            explanation: { type: "string" },
            whatToVerify: { type: "string" },
          },
        },
      },
      verificationChecklist: {
        type: "array",
        items: { type: "string" },
      },
      draftPartBText: { type: "string" },
      limitations: {
        type: "array",
        items: { type: "string", enum: [...REQUIRED_LIMITATIONS] },
      },
    },
  };
}
