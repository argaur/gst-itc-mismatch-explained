import type { RiskAssessmentResult } from "../contracts/riskAssessment";

/**
 * Validation for the citizen question-and-answer path.
 *
 * The model is allowed to do exactly one thing here: understand a question
 * asked in ordinary words, in Hindi, English or a mix, and point at findings
 * the engine has already decided. It is not allowed to introduce a number.
 *
 * The money guard below is the load-bearing part. Every money-scale figure in
 * the model's answer must already exist in the deterministic result, so an
 * invented rupee amount cannot reach the citizen even if the model produces
 * one. This is checked, not trusted.
 */

const MAX_ANSWER_LENGTH = 600;
const MAX_QUESTION_LENGTH = 300;

export interface ValidatedAnswer {
  answer: string;
  citedRowIds: string[];
  answerable: boolean;
}

export class AnswerValidationError extends Error {}

function fail(reason: string): never {
  throw new AnswerValidationError(reason);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Devanagari digits map to ASCII so a Hindi answer is checked as strictly. */
function normalizeDigits(text: string): string {
  return text.replace(/[०-९]/g, (digit) =>
    String(digit.charCodeAt(0) - 0x0966),
  );
}

/**
 * Pulls every numeric token out of the text, tolerating Indian digit grouping
 * (1,50,000) and decimals. Returns whole-number values.
 */
export function extractNumbers(text: string): number[] {
  const normalized = normalizeDigits(text);
  const matches = normalized.match(/\d[\d,]*(?:\.\d+)?/g) ?? [];
  return matches
    .map((token) => Number(token.replace(/,/g, "")))
    .filter((value) => Number.isFinite(value));
}

/** Money figures the model may state, because the engine produced them. */
export function allowedMoneyFigures(result: RiskAssessmentResult): Set<number> {
  const allowed = new Set<number>();
  allowed.add(result.totalAmountAtRisk);
  allowed.add(result.amountLostIfNothingDone);
  for (const item of result.items) {
    if (item.amountAtRisk > 0) allowed.add(item.amountAtRisk);
  }
  return allowed;
}

function dateParts(iso: string): number[] {
  const [year, month, day] = iso.split("-").map(Number);
  return [year, month, day];
}

/**
 * EVERY number the model is permitted to state, of any size.
 *
 * An earlier version of this guard only checked figures of 1,000 or more, on
 * the assumption that small numbers were always dates or counts. That left a
 * real hole: a wrong "800 rupaye" would have passed unchallenged. There is no
 * safe threshold, so there is no threshold. Any number the engine did not
 * produce is rejected, whatever its size.
 */
export function allowedNumbers(result: RiskAssessmentResult): Set<number> {
  const allowed = allowedMoneyFigures(result);

  // Time references the engine itself computed or holds.
  allowed.add(result.daysRemaining);
  for (const iso of [
    result.statementDate,
    result.actionDeadline,
    result.annualCutoff,
  ]) {
    for (const part of dateParts(iso)) allowed.add(part);
  }

  // Counts the model may legitimately use, e.g. "2 bills need your attention".
  for (let count = 0; count <= result.items.length; count += 1) {
    allowed.add(count);
  }

  return allowed;
}

export function assertQuestionAcceptable(question: unknown): string {
  if (typeof question !== "string") fail("Question must be text.");
  const trimmed = question.trim();
  if (trimmed.length === 0) fail("Question must not be empty.");
  if (trimmed.length > MAX_QUESTION_LENGTH) {
    fail(`Question must be ${MAX_QUESTION_LENGTH} characters or fewer.`);
  }
  return trimmed;
}

export function validateModelAnswer(
  payload: unknown,
  result: RiskAssessmentResult,
): ValidatedAnswer {
  if (!isRecord(payload)) fail("Model payload must be an object.");

  const { answer, citedRowIds, answerable } = payload;

  if (typeof answerable !== "boolean") {
    fail("Model must state whether the question is answerable.");
  }
  if (typeof answer !== "string" || answer.trim().length === 0) {
    fail("Model answer must be non-empty text.");
  }
  if (answer.length > MAX_ANSWER_LENGTH) {
    fail(`Model answer must be ${MAX_ANSWER_LENGTH} characters or fewer.`);
  }
  if (
    !Array.isArray(citedRowIds) ||
    citedRowIds.some((id) => typeof id !== "string")
  ) {
    fail("Model must return citedRowIds as a list of strings.");
  }

  // Widened to string: the model returns untrusted text, so it must be checked
  // against the known IDs rather than assumed to carry the DemoId shape.
  const knownRowIds = new Set<string>(result.items.map((item) => item.rowId));
  const cited = citedRowIds as string[];

  for (const rowId of cited) {
    if (!knownRowIds.has(rowId)) {
      fail(`Model cited an unknown row: ${rowId}.`);
    }
  }
  if (new Set(cited).size !== cited.length) {
    fail("Model cited the same row more than once.");
  }

  if (answerable && cited.length === 0) {
    fail("An answerable reply must cite at least one finding.");
  }
  if (!answerable && cited.length > 0) {
    fail("A reply marked unanswerable must not cite findings.");
  }

  // The number guard. No threshold: any figure the engine did not produce fails.
  const allowed = allowedNumbers(result);
  for (const value of extractNumbers(answer)) {
    if (!allowed.has(value)) {
      fail(`Model stated a number that the engine did not produce: ${value}.`);
    }
  }

  return {
    answer: answer.trim(),
    citedRowIds: cited,
    answerable,
  };
}

/**
 * The response shape demanded from the model. Kept next to the validator so the
 * schema and the checks cannot drift apart.
 */
export function createAnswerJsonSchema(): Record<string, unknown> {
  return {
    type: "object",
    additionalProperties: false,
    required: ["answer", "citedRowIds", "answerable"],
    properties: {
      answerable: {
        type: "boolean",
        description:
          "True only if the question can be answered from the supplied findings.",
      },
      answer: {
        type: "string",
        description:
          "Short reply in the requested language. Plain words. No tax advice.",
      },
      citedRowIds: {
        type: "array",
        items: { type: "string" },
        description: "Row IDs this answer relies on. Empty if not answerable.",
      },
    },
  };
}

/**
 * The only thing the model sees. Deliberately excludes anything that would let
 * it compute: no raw tax rows, no purchase register, no arithmetic inputs.
 */
export function buildAnswerModelInput(
  result: RiskAssessmentResult,
  question: string,
  language: "hi" | "en",
): Record<string, unknown> {
  return {
    question,
    replyLanguage: language,
    deadline: result.actionDeadline,
    daysRemaining: result.daysRemaining,
    totalAmountAtRisk: result.totalAmountAtRisk,
    amountLostIfNothingDone: result.amountLostIfNothingDone,
    findings: result.items.map((item) => ({
      rowId: item.rowId,
      supplierName: item.supplierName,
      category: item.category,
      severity: item.severity,
      amountAtRisk: item.amountAtRisk,
      whyItMatters: item.whyItMatters,
      whoCausedIt: item.whoCausedIt,
      whatToDo: item.whatToDo,
    })),
  };
}
