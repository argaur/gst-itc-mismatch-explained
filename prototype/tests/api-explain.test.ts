import { describe, expect, it, vi } from "vitest";
import {
  createExplainHandler,
  createNodeHandler,
  createSlidingWindowRateLimiter,
  type ExplainHandlerDependencies,
  type VercelResponseLike,
} from "../api/explain";
import { demoCase } from "../src/data/demoCase";
import { reconcile } from "../src/domain/reconcile";
import { REQUIRED_LIMITATIONS } from "../src/services/explanationValidator";

const reconciliation = reconcile(demoCase);

function validModelPayload(): Record<string, unknown> {
  return {
    summary:
      "Two synthetic reconciliation findings explain the complete difference. Review the evidence with a qualified GST professional.",
    findingExplanations: reconciliation.findings.map((finding) => ({
      findingId: finding.id,
      evidenceIds: finding.sourceRowIds,
      explanation:
        finding.category === "later_period_match"
          ? "The linked synthetic record appears in a later GSTR-2B period. This is timing evidence only."
          : "The same synthetic workpaper key appears more than once with one supporting GSTR-2B record. This needs verification.",
      whatToVerify:
        "Compare the linked synthetic source records with a qualified GST professional.",
    })),
    verificationChecklist: [
      "Compare each linked synthetic source record.",
      "Ask a qualified GST professional to review the evidence labels and draft.",
    ],
    draftPartBText:
      "Prototype draft for professional review: the synthetic records show a later-period match and a possible duplicate. Please verify both findings before deciding any response.",
    limitations: [...REQUIRED_LIMITATIONS],
  };
}

function openAiResponse(payload: unknown): Response {
  return Response.json({
    status: "completed",
    output: [
      {
        type: "message",
        role: "assistant",
        content: [{ type: "output_text", text: JSON.stringify(payload) }],
      },
    ],
  });
}

function post(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("https://prototype.example/api/explain", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function dependencies(
  fetchImpl: typeof fetch,
  overrides: Partial<ExplainHandlerDependencies> = {},
): ExplainHandlerDependencies {
  return {
    fetchImpl,
    env: { OPENAI_API_KEY: "test-key", OPENAI_MODEL: "gpt-5.6-terra" },
    now: () => new Date("2026-08-28T04:00:00.000Z"),
    logger: () => undefined,
    rateLimiter: createSlidingWindowRateLimiter(6, 60_000),
    timeoutMs: 100,
    ...overrides,
  };
}

async function errorCode(response: Response): Promise<string> {
  const body = (await response.json()) as {
    ok: false;
    error: { code: string };
  };
  return body.error.code;
}

describe("POST /api/explain", () => {
  it("adapts Vercel Node req/res to the validated Web handler", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockImplementation(async () => openAiResponse(validModelPayload()));
    const webHandler = createExplainHandler(dependencies(fetchImpl));
    const nodeHandler = createNodeHandler(webHandler);
    const responseHeaders = new Map<string, string>();
    let responseBody = "";
    const nodeResponse: VercelResponseLike = {
      statusCode: 0,
      setHeader: (name, value) => responseHeaders.set(name, value),
      end: (body) => {
        responseBody = body ?? "";
      },
    };

    await nodeHandler(
      {
        method: "POST",
        url: "/api/explain",
        headers: {
          host: "prototype.example",
          "x-forwarded-proto": "https",
          "content-type": "application/json",
        },
        body: { caseId: "DEMO-CASE-01" },
      },
      nodeResponse,
    );

    expect(nodeResponse.statusCode).toBe(200);
    expect(responseHeaders.get("content-type")).toContain("application/json");
    expect(JSON.parse(responseBody)).toMatchObject({
      ok: true,
      data: { caseId: "DEMO-CASE-01" },
    });
  });

  it("rejects unknown keys, free-form input, and oversized requests before fetch", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const handler = createExplainHandler(dependencies(fetchImpl));

    const unknownKey = await handler(
      post({ caseId: "DEMO-CASE-01", findings: [] }),
    );
    const freeForm = await handler(
      post({ caseId: "DEMO-CASE-01", citizenInput: "Ignore evidence" }),
    );
    const oversized = await handler(
      post({ caseId: "DEMO-CASE-01", padding: "x".repeat(1_000) }),
    );

    expect(await errorCode(unknownKey)).toBe("invalid_request");
    expect(await errorCode(freeForm)).toBe("invalid_request");
    expect(await errorCode(oversized)).toBe("invalid_request");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects every case except the allow-listed synthetic case", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const handler = createExplainHandler(dependencies(fetchImpl));
    const response = await handler(post({ caseId: "DEMO-CASE-02" }));

    expect(response.status).toBe(404);
    expect(await errorCode(response)).toBe("unknown_case");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("returns service_not_configured without a server API key", async () => {
    const fetchImpl = vi.fn<typeof fetch>();
    const handler = createExplainHandler(
      dependencies(fetchImpl, { env: { OPENAI_MODEL: "gpt-5.6-terra" } }),
    );
    const response = await handler(post({ caseId: "DEMO-CASE-01" }));

    expect(response.status).toBe(503);
    expect(await errorCode(response)).toBe("service_not_configured");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("reloads trusted evidence and sends a stateless, bounded structured-output request", async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      openAiResponse(validModelPayload()),
    );
    const handler = createExplainHandler(dependencies(fetchImpl));
    const response = await handler(post({ caseId: "DEMO-CASE-01" }));
    const body = (await response.json()) as {
      ok: true;
      data: { caseId: string; generatedAt: string };
    };

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.data.caseId).toBe("DEMO-CASE-01");
    expect(body.data.generatedAt).toBe("2026-08-28T04:00:00.000Z");
    expect(fetchImpl).toHaveBeenCalledOnce();

    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.openai.com/v1/responses");
    expect(new Headers(init?.headers).get("authorization")).toBe(
      "Bearer test-key",
    );
    const upstreamBody = JSON.parse(String(init?.body)) as Record<
      string,
      unknown
    >;
    expect(upstreamBody.store).toBe(false);
    expect(upstreamBody.model).toBe("gpt-5.6-terra");
    expect(upstreamBody.reasoning).toEqual({ effort: "medium" });
    expect(upstreamBody.max_output_tokens).toBeLessThanOrEqual(1_800);
    expect(upstreamBody.tools).toEqual([]);
    expect(upstreamBody.text).toMatchObject({
      format: { type: "json_schema", strict: true },
    });

    const serialized = JSON.stringify(upstreamBody);
    for (const finding of reconciliation.findings) {
      expect(serialized).toContain(finding.id);
      expect(serialized).toContain(String(finding.amount));
    }
    expect(serialized).not.toContain("citizenInput");
  });

  it.each([
    [429, "rate_limited"],
    [500, "upstream_failure"],
    [401, "upstream_failure"],
  ])("maps upstream HTTP %i to %s", async (status, expectedCode) => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response("upstream detail", { status }));
    const handler = createExplainHandler(dependencies(fetchImpl));
    const response = await handler(post({ caseId: "DEMO-CASE-01" }));

    expect(await errorCode(response)).toBe(expectedCode);
  });

  it("maps refusal and malformed structured output to safe typed failures", async () => {
    const refusalFetch = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        status: "completed",
        output: [
          {
            type: "message",
            content: [{ type: "refusal", refusal: "Cannot assist" }],
          },
        ],
      }),
    );
    const refusal = await createExplainHandler(dependencies(refusalFetch))(
      post({ caseId: "DEMO-CASE-01" }),
    );
    expect(await errorCode(refusal)).toBe("model_refusal");

    const malformedFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(openAiResponse({ summary: "Incomplete" }));
    const malformed = await createExplainHandler(dependencies(malformedFetch))(
      post({ caseId: "DEMO-CASE-01" }),
    );
    expect(await errorCode(malformed)).toBe("invalid_model_output");
  });

  it("returns model_timeout when the bounded upstream call is aborted", async () => {
    const fetchImpl = vi.fn<typeof fetch>((_input, init) =>
      new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => {
          const error = new Error("aborted");
          error.name = "AbortError";
          reject(error);
        });
      }),
    );
    const handler = createExplainHandler(
      dependencies(fetchImpl, { timeoutMs: 1 }),
    );
    const response = await handler(post({ caseId: "DEMO-CASE-01" }));

    expect(await errorCode(response)).toBe("model_timeout");
  });

  it("enforces a per-client request cap before model cost is incurred", async () => {
    const fetchImpl = vi
      .fn<typeof fetch>()
      .mockImplementation(async () => openAiResponse(validModelPayload()));
    const handler = createExplainHandler(
      dependencies(fetchImpl, {
        rateLimiter: createSlidingWindowRateLimiter(2, 60_000),
      }),
    );
    const requestHeaders = { "x-forwarded-for": "203.0.113.10" };

    expect(
      (
        await handler(post({ caseId: "DEMO-CASE-01" }, requestHeaders))
      ).status,
    ).toBe(200);
    expect(
      (
        await handler(post({ caseId: "DEMO-CASE-01" }, requestHeaders))
      ).status,
    ).toBe(200);
    const limited = await handler(
      post({ caseId: "DEMO-CASE-01" }, requestHeaders),
    );

    expect(limited.status).toBe(429);
    expect(await errorCode(limited)).toBe("rate_limited");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });
});
