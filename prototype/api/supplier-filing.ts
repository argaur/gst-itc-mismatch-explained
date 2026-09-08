import { riskCase } from "../src/data/riskCase.js";
import { assessRisk } from "../src/domain/assessRisk.js";

const ALLOWED_CASE_ID = "DEMO-RISK-CASE-01";
const CACHE_TTL_MS = 15 * 60_000;
const MAX_REQUEST_BYTES = 512;

interface CachedSupplierResult {
  expiresAt: number;
  response: SupplierFilingResponse;
}

interface SupplierFilingResponse {
  ok: true;
  data: {
    caseId: typeof ALLOWED_CASE_ID;
    rowId: string;
    supplierName: string;
    filed: false;
    checkedAt: string;
    live: false;
    evidenceOrigin: "synthetic_fixture";
    message: string;
  };
}

interface SupplierFilingFailure {
  ok: false;
  error: {
    code: "invalid_request" | "unknown_case" | "unknown_row";
    message: string;
    retryable: false;
  };
}

export interface VercelRequestLike {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface VercelResponseLike {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
}

const cache = new Map<string, CachedSupplierResult>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function jsonResponse(
  body: SupplierFilingResponse | SupplierFilingFailure,
  status: number,
): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "private, max-age=60",
      "x-content-type-options": "nosniff",
    },
  });
}

function errorResponse(
  code: SupplierFilingFailure["error"]["code"],
  message: string,
  status: number,
): Response {
  return jsonResponse(
    {
      ok: false,
      error: {
        code,
        message,
        retryable: false,
      },
    },
    status,
  );
}

async function readRequest(
  request: Request,
): Promise<
  | { caseId: typeof ALLOWED_CASE_ID; rowId: string }
  | SupplierFilingFailure["error"]["code"]
> {
  if (request.method !== "POST") return "invalid_request";
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return "invalid_request";
  }

  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return "invalid_request";
  }

  let bodyText: string;
  try {
    bodyText = await request.text();
  } catch {
    return "invalid_request";
  }

  if (
    bodyText.length === 0 ||
    new TextEncoder().encode(bodyText).byteLength > MAX_REQUEST_BYTES
  ) {
    return "invalid_request";
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    return "invalid_request";
  }

  if (!isRecord(parsed)) return "invalid_request";
  const keys = Object.keys(parsed).sort();
  if (keys.length !== 2 || keys[0] !== "caseId" || keys[1] !== "rowId") {
    return "invalid_request";
  }
  if (
    typeof parsed.caseId !== "string" ||
    typeof parsed.rowId !== "string"
  ) {
    return "invalid_request";
  }
  if (parsed.caseId !== ALLOWED_CASE_ID) return "unknown_case";

  return {
    caseId: ALLOWED_CASE_ID,
    rowId: parsed.rowId,
  };
}

export function createSupplierFilingHandler(
  now: () => Date = () => new Date(),
): (request: Request) => Promise<Response> {
  return async (request) => {
    const approved = await readRequest(request);

    if (typeof approved === "string") {
      if (approved === "unknown_case") {
        return errorResponse(
          "unknown_case",
          "That synthetic risk case is not available.",
          404,
        );
      }
      return errorResponse(
        "invalid_request",
        "Send only the approved synthetic case ID and a row ID.",
        400,
      );
    }

    const cacheKey = `${approved.caseId}:${approved.rowId}`;
    const nowMs = now().getTime();
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > nowMs) {
      return jsonResponse(cached.response, 200);
    }

    const result = assessRisk(riskCase);
    const item = result.items.find(
      (candidate) =>
        candidate.rowId === approved.rowId &&
        candidate.category === "supplier_not_filed",
    );

    if (!item) {
      return errorResponse(
        "unknown_row",
        "That row is not an approved supplier-not-filed finding.",
        404,
      );
    }

    const response: SupplierFilingResponse = {
      ok: true,
      data: {
        caseId: ALLOWED_CASE_ID,
        rowId: item.rowId,
        supplierName: item.supplierName,
        filed: false,
        checkedAt: now().toISOString(),
        live: false,
        evidenceOrigin: "synthetic_fixture",
        message:
          "Live supplier filing verification is not enabled. This result comes only from the disclosed synthetic fixture, so the deterministic risk screen remains usable without a third-party provider.",
      },
    };

    cache.set(cacheKey, {
      expiresAt: nowMs + CACHE_TTL_MS,
      response,
    });

    if (cache.size > 100) {
      for (const [key, value] of cache) {
        if (value.expiresAt <= nowMs) cache.delete(key);
        if (cache.size <= 100) break;
      }
    }

    return jsonResponse(response, 200);
  };
}

function firstHeaderValue(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function nodeRequestBody(body: unknown): string | undefined {
  if (body === undefined) return undefined;
  if (typeof body === "string") return body;
  if (body instanceof Uint8Array) return new TextDecoder().decode(body);
  return JSON.stringify(body);
}

export function createNodeHandler(
  webHandler: (request: Request) => Promise<Response>,
): (request: VercelRequestLike, response: VercelResponseLike) => Promise<void> {
  return async (request, response) => {
    const headers = new Headers();

    for (const [name, value] of Object.entries(request.headers)) {
      if (value === undefined) continue;
      headers.set(name, Array.isArray(value) ? value.join(", ") : value);
    }

    const protocol =
      firstHeaderValue(request.headers["x-forwarded-proto"]) || "https";
    const host = firstHeaderValue(request.headers.host) || "localhost";
    const path = request.url?.startsWith("/")
      ? request.url
      : `/${request.url ?? "api/supplier-filing"}`;
    const method = request.method?.toUpperCase() || "GET";
    const body =
      method === "GET" || method === "HEAD"
        ? undefined
        : nodeRequestBody(request.body);

    const webRequest = new Request(`${protocol}://${host}${path}`, {
      method,
      headers,
      body,
    });
    const webResponse = await webHandler(webRequest);

    response.statusCode = webResponse.status;
    webResponse.headers.forEach((value, name) =>
      response.setHeader(name, value),
    );
    response.end(await webResponse.text());
  };
}

const productionWebHandler = createSupplierFilingHandler();

export default createNodeHandler(productionWebHandler);
