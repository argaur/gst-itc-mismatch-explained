# GST ITC Mismatch — Development Handoff

## Purpose

This document is the authoritative handoff for the documentation/review pass after the implementation and first production deployment of the GST ITC mismatch prototype.

## Product decision

The approved solution is an explanation layer inserted between the familiar GST DRC-01C Part A and Part B experience. The prototype makes a synthetic aggregate mismatch understandable by tracing it to deterministic source reconciliation, then asks OpenAI to explain only the validated findings and draft neutral review text.

Authority: `GST-ITC Mismatch Solution PRD.docx`.

The visual language follows GST portal interaction grammar (dense form layout, numbered sections, familiar labels and tables) without copying official logos, emblems, assets, or claiming GSTN affiliation.

## User journey shipped

1. Part A shows a synthetic notice and aggregate ITC difference.
2. User selects `EXPLAIN THIS DIFFERENCE`.
3. The explanation layer shows deterministic reconciliation categories, source IDs, amounts, match rules, compared fields, evidence and confidence labels.
4. User requests an OpenAI explanation.
5. The server returns a strict grounded explanation or a typed failure while preserving deterministic evidence.
6. Part B shows a review-only neutral draft with Copy, Print and Start again actions.

The product permanently discloses: `INDEPENDENT SYNTHETIC PROTOTYPE · NOT GSTN · NOT TAX ADVICE`. It has no filing, submission, DSC, EVC, OTP, payment, ARN, or fake-success controls.

## Synthetic case

- Case ID: `DEMO-CASE-01`
- Period: `2026-04`
- Claimed ITC: ₹1,50,00,000
- Available ITC: ₹1,20,00,000
- Difference: ₹30,00,000
- Later-period indicator: ₹18,40,000
- Possible-duplicate indicator: ₹11,60,000

All IDs and data are synthetic. No live GST system, GST API, taxpayer credential, PAN, Aadhaar, OTP, or payment data is used.

## Architecture

### Deterministic domain

`prototype/src/domain/reconcile.ts` owns normalization, matching, exhaustive classification, arithmetic invariants, confidence labels, evidence IDs and fail-closed behavior. Categories are:

- `exact_match`
- `missing_in_2b`
- `possible_duplicate`
- `later_period_match`

The reconciler rejects unsafe IDs, duplicate source IDs, ambiguous current/later matches, orphan rows, multiple candidates and unexplained residuals.

### Contracts

`prototype/src/contracts/reconciliation.ts` freezes `Finding`, `RecordClassification` and `ReconciliationResult`. `prototype/src/contracts/explanation.ts` freezes the success/error envelope and eight typed error codes:

`invalid_request`, `unknown_case`, `service_not_configured`, `model_timeout`, `model_refusal`, `invalid_model_output`, `rate_limited`, `upstream_failure`.

### Server-side model path

`prototype/api/explain.ts` is the Vercel function. It:

- accepts only `POST {"caseId":"DEMO-CASE-01"}`;
- reloads the trusted fixture and reruns reconciliation on every request;
- never trusts browser findings or free-form user input;
- calls `https://api.openai.com/v1/responses` with strict JSON schema output;
- uses `store:false`, no tools, medium reasoning, and an output cap;
- validates every finding/evidence ID, claim, amount and limitation before returning;
- has request/response size limits, timeout handling and an instance rate limiter;
- logs safe event metadata only, never prompts, secrets or taxpayer data.

The default model is `gpt-5.6-terra`; `OPENAI_MODEL` may override it server-side.

`prototype/src/services/explainCase.ts` is the browser client. `prototype/src/services/explanationValidator.ts` contains the shared model-output validator and schema builder.

### Deployment adapter

The default API export includes a Node `req/res` adapter because Vercel invokes this function in its Node runtime. The validated Web Request/Response handler remains independently testable.

## Verification completed

- Full local suite: 40/40 tests passed.
- Focused API/validator suite after the Vercel adapter fix: 15/15 passed.
- Local production TypeScript/Vite build passed.
- Public page smoke test: HTTP 200.
- Live production `/api/explain` smoke test: HTTP 200 with a grounded structured explanation.
- A first deployment exposed extensionless ESM imports; these were fixed with explicit `.js` specifiers.
- A second deployment exposed the Web Request vs Node `req/res` mismatch; the adapter fixed it.

Note: Vercel’s build log emits a non-blocking `vitest/globals` type-definition warning during its transpilation phase, while the local `npm run build` is green. Review whether to split production and test TypeScript configs in a future cleanup; do not change the working submission flow without retesting.

## Live resources

- Prototype: https://prototype-blue-three.vercel.app
- GitHub: https://github.com/argaur/gst-itc-mismatch-explained
- Latest GitHub status commit: `cf9ea39`
- Latest production deployment: `dpl_2aLXcNqN6UGEh1cAfF7gSejbjyPt`

## Secrets and access

- OpenAI secret is stored in gopass as `buildwhatmovesindia/OPENAI_API_KEY`.
- Local executable path: `C:\Users\Gaurav Gupta\AppData\Local\gopass\gopass.exe`.
- Never put the secret value in this document, git, logs, screenshots or prompts.
- The secret was added to Vercel Production as a sensitive `OPENAI_API_KEY` variable and verified with one live call.
- Kriti (`kritikandharikapoor`) was invited to the public repository with write access. She must accept the invitation.

## Files to read first

1. `AGENTS.md` — non-negotiable hackathon/build rules.
2. `PROJECT_CONTEXT.md` — brief, judging criteria and submission mechanics.
3. `STATUS.md` — current project truth.
4. `GST-ITC Mismatch Solution PRD.docx` — approved solution authority.
5. `IMPLEMENTATION_PLAN.md` — stage gates, model allocation and ownership.
6. This handoff — implementation and release record.

## Remaining work for the documentation/submission pass

1. Confirm Kriti accepted the GitHub invitation.
2. Run rendered browser QA at 375px and print preview; the earlier headless Edge capture hung before producing an image.
3. Rehearse the under-60-second citizen journey and record the two-minute demo video.
4. Create the sub-250-word project summary and final submission checklist.
5. Do not add GST APIs or live government integrations; that would violate the approved synthetic prototype boundary and hackathon safety rules.

## Model allocation record

- Manager/release review: `gpt-5.6-sol`, medium/high.
- Domain foundation and reconciliation: `gpt-5.6-sol`, high.
- Portal UI: `gpt-5.6-sol`, high.
- Grounded API: `gpt-5.6-sol`, high.
- Future integrated QA: `gpt-5.6-terra`, medium, with Sol review for critical findings.
- Future repetitive smoke/reporting only: `gpt-5.6-luna`, low/medium.

## Honesty boundary

Real: deterministic reconciliation logic, schema validation, Vercel deployment, OpenAI model call, error handling, and public prototype route.

Mocked/synthetic: GST notice, taxpayer/source records, amounts, identifiers, GST portal data, filing journey, and professional review outcome. The UI and copy must continue to disclose this distinction.
