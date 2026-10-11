import { describe, expect, it } from "vitest";
import {
  createExplainRiskHandler,
  createSlidingWindowRateLimiter,
} from "../api/explain-risk";
import { riskCase } from "../src/data/riskCase";
import { assessRisk } from "../src/domain/assessRisk";
import { readRiskProse } from "../src/views/RiskView";

/**
 * The server and the browser each parse this response on their own. When their
 * field names drifted apart, every verified 200 rendered as "AI prose is
 * unavailable". This test runs the real handler and feeds its body to the real
 * client parser, so the two cannot disagree again.
 */
describe("explain-risk response contract", () => {
  it("the client accepts the prose the handler verified and returned", async () => {
    const result = assessRisk(riskCase);
    const atRisk = result.items.filter((item) => item.amountAtRisk > 0);
    const modelOutput = {
      sentences: atRisk.map((item) => ({
        rowId: item.rowId,
        sentence: `${item.supplierName} put ₹${item.amountAtRisk} at risk, caused by ${item.whoCausedIt}. Act by ${result.actionDeadline}.`,
      })),
    };

    const handler = createExplainRiskHandler({
      fetchImpl: async () =>
        Response.json({
          status: "completed",
          output: [
            {
              type: "message",
              content: [{ type: "output_text", text: JSON.stringify(modelOutput) }],
            },
          ],
        }),
      env: { OPENAI_API_KEY: "test-key" },
      now: () => new Date("2026-10-11T00:00:00Z"),
      logger: () => undefined,
      rateLimiter: createSlidingWindowRateLimiter(100, 60_000),
      timeoutMs: 5_000,
    });

    const response = await handler(
      new Request("http://localhost/api/explain-risk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ caseId: result.caseId, language: "en" }),
      }),
    );
    expect(response.status).toBe(200);

    const prose = readRiskProse(await response.json());
    expect(prose).toBeDefined();
    expect(prose?.map((item) => item.rowId)).toEqual(
      atRisk.map((item) => item.rowId),
    );
  });
});
