import { describe, expect, it } from "vitest";

import { riskCase } from "../src/data/riskCase";
import { assessRisk } from "../src/domain/assessRisk";
import {
  allowedMoneyFigures,
  assertQuestionAcceptable,
  buildAnswerModelInput,
  extractNumbers,
  validateModelAnswer,
} from "../src/services/answerValidator";

const result = assessRisk(riskCase, "2026-09-15");

const goodAnswer = {
  answerable: true,
  answer:
    "Aapke supplier Verma Packaging ne ek note bheja hai jo aapka credit 86400 rupaye kam karta hai. Abhi tak koi jawab nahi diya gaya.",
  citedRowIds: ["DEMO-ROW-0003"],
};

describe("question guard", () => {
  it("accepts an ordinary question", () => {
    expect(assertQuestionAcceptable("mera paisa kyun kam hua?")).toBe(
      "mera paisa kyun kam hua?",
    );
  });

  it("accepts a Hindi question", () => {
    expect(assertQuestionAcceptable("मेरा पैसा क्यों कम हुआ?")).toContain("पैसा");
  });

  it("rejects an empty question", () => {
    expect(() => assertQuestionAcceptable("   ")).toThrow(/must not be empty/);
  });

  it("rejects an oversized question", () => {
    expect(() => assertQuestionAcceptable("a".repeat(301))).toThrow(
      /300 characters/,
    );
  });
});

describe("number extraction", () => {
  it("reads Indian digit grouping", () => {
    expect(extractNumbers("Rs 1,52,000 is at risk")).toContain(152_000);
  });

  it("reads Devanagari digits", () => {
    expect(extractNumbers("८६४०० रुपये")).toContain(86_400);
  });

  it("returns nothing when there are no digits", () => {
    expect(extractNumbers("koi number nahi hai")).toEqual([]);
  });
});

describe("allowed money figures", () => {
  it("includes every at-risk amount and both totals", () => {
    const allowed = allowedMoneyFigures(result);
    expect(allowed.has(86_400)).toBe(true);
    expect(allowed.has(152_000)).toBe(true);
    expect(allowed.has(324_400)).toBe(true);
    // 38,500 is the harmless deemed-accept row, never at risk, so never quotable.
    expect(allowed.has(38_500)).toBe(false);
  });
});

describe("validateModelAnswer", () => {
  it("accepts a grounded answer that cites a real finding", () => {
    const validated = validateModelAnswer(goodAnswer, result);
    expect(validated.citedRowIds).toEqual(["DEMO-ROW-0003"]);
    expect(validated.answerable).toBe(true);
  });

  it("BLOCKS an invented rupee figure", () => {
    const hallucinated = {
      ...goodAnswer,
      answer: "Aapka nuksan 99999 rupaye ka hai.",
    };
    expect(() => validateModelAnswer(hallucinated, result)).toThrow(
      /number that the engine did not produce/,
    );
  });

  it("BLOCKS a figure that exists but is not at risk", () => {
    const wrong = {
      ...goodAnswer,
      answer: "Aap 38500 rupaye kho rahe hain.",
    };
    expect(() => validateModelAnswer(wrong, result)).toThrow(
      /did not produce: 38500/,
    );
  });

  it("BLOCKS a small invented figure, with no lower threshold", () => {
    // Regression guard. An earlier version only checked figures >= 1000, so a
    // wrong "800 rupaye" slipped through. There is no safe threshold.
    const wrong = { ...goodAnswer, answer: "Sirf 800 rupaye ka farak hai." };
    expect(() => validateModelAnswer(wrong, result)).toThrow(
      /did not produce: 800/,
    );
  });

  it("BLOCKS an invented percentage or small count", () => {
    const wrong = { ...goodAnswer, answer: "Aapke 15 bill kharab hain." };
    expect(() => validateModelAnswer(wrong, result)).toThrow(
      /did not produce: 15/,
    );
  });

  it("blocks a citation to a row that does not exist", () => {
    const wrong = { ...goodAnswer, citedRowIds: ["DEMO-ROW-9999"] };
    expect(() => validateModelAnswer(wrong, result)).toThrow(/unknown row/);
  });

  it("blocks an answerable reply that cites nothing", () => {
    const wrong = { ...goodAnswer, citedRowIds: [] };
    expect(() => validateModelAnswer(wrong, result)).toThrow(
      /must cite at least one finding/,
    );
  });

  it("allows a refusal that cites nothing", () => {
    const refusal = {
      answerable: false,
      answer:
        "Yeh sawaal is jaankari se nahi bataya ja sakta. Kisi GST professional se poochhiye.",
      citedRowIds: [],
    };
    expect(validateModelAnswer(refusal, result).answerable).toBe(false);
  });

  it("blocks a refusal that still cites findings", () => {
    const wrong = {
      answerable: false,
      answer: "Pata nahi.",
      citedRowIds: ["DEMO-ROW-0003"],
    };
    expect(() => validateModelAnswer(wrong, result)).toThrow(
      /must not cite findings/,
    );
  });

  it("blocks a duplicate citation", () => {
    const wrong = {
      ...goodAnswer,
      citedRowIds: ["DEMO-ROW-0003", "DEMO-ROW-0003"],
    };
    expect(() => validateModelAnswer(wrong, result)).toThrow(/more than once/);
  });

  it("rejects a malformed payload", () => {
    expect(() => validateModelAnswer("not an object", result)).toThrow(
      /must be an object/,
    );
    expect(() => validateModelAnswer({ answer: "hi" }, result)).toThrow(
      /answerable/,
    );
  });

  it("allows dates and day counts the engine actually holds", () => {
    const withDates = {
      ...goodAnswer,
      answer: "20 October tak jawab dijiye. Sirf 35 din bache hain.",
    };
    expect(validateModelAnswer(withDates, result).answerable).toBe(true);
  });

  it("allows a legitimate count of findings", () => {
    const withCount = { ...goodAnswer, answer: "4 bill par dhyan dijiye." };
    expect(validateModelAnswer(withCount, result).answerable).toBe(true);
  });
});

describe("model input", () => {
  it("sends findings but never the raw tax rows", () => {
    const input = buildAnswerModelInput(result, "kya hua?", "hi");
    expect(input.replyLanguage).toBe("hi");
    expect(Array.isArray(input.findings)).toBe(true);
    const serialized = JSON.stringify(input);
    // The purchase register and 2B rows must never reach the model.
    expect(serialized).not.toContain("supplierGstin");
    expect(serialized).not.toContain("inPurchaseRegister");
  });
});
