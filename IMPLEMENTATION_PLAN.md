# Implementation Plan — Notice, Explained

**Status:** SCOPE HOLD — solution approved; Stages 0–3 implemented; integration/release gate in progress
**Approved solution:** [GST-ITC Mismatch Solution PRD](GST-ITC%20Mismatch%20Solution%20PRD.docx)  
**Problem reference:** [Final problem PRD](GST-%20ITC%20Mismatch%20PRD.docx)  
**Public skeleton:** https://prototype-blue-three.vercel.app  
**Deadline:** August 28, 2026, 8:00 PM IST — no grace period  
**Development mode:** The root Codex session manages agents, dependencies, reviews, and gates. Bounded implementation agents write the product.

---

## 1. Outcome to ship

Deliver one public, mobile-first GST DRC-01C prototype that a reviewer can complete in under 60 seconds:

1. **Part A — Existing:** see a synthetic aggregate ITC difference and choose `EXPLAIN THIS DIFFERENCE`.
2. **Explanation — New:** inspect deterministic reconciliation findings, source rows, match rules, amounts, and confidence labels.
3. **Explanation — New:** request a real OpenAI plain-language explanation grounded only in validated findings.
4. **Part B — Existing:** review a clearly marked prototype draft and use Copy, Print, or Start again.

The route must always show that the build is independent, synthetic, not GSTN, not tax advice, and has submitted nothing.

### Success line

The build is done when the public URL proves the complete happy and failure paths, the deterministic evidence explains exactly ₹30,00,000, the real model output is schema-valid and grounded, the portal-native flow works at 375 px, and the demo assets are ready before the submission buffer.

---

## 2. Locked decisions

- Product shape: an explanation layer inserted between DRC-01C Part A and Part B, not a reconciliation dashboard.
- Visual direction: GST Portal interaction grammar, not official identity. No emblem, GSTN logo, copied portal assets, exact official header, or government-affiliation claim.
- Reconciliation benchmark: ClearTax is primary; Speqta GST by ICAI is secondary. Adopt exception categories, source snapshots, match-rule visibility, and evidence drill-down. Do not copy their UI or enterprise breadth.
- Deterministic boundary: code owns normalization, classification, arithmetic, confidence labels, evidence IDs, and invariant checks.
- OpenAI boundary: the model explains validated findings and drafts neutral review text. It never performs tax math, determines liability, invents evidence, or recommends payment, reversal, contest, or filing.
- Round-1 scope: one synthetic case, two exception findings, one real model call, one mock Part B draft, browser print, public link.
- Dark mode, uploads, login, database, multi-GSTIN, vendor outreach, ERP sync, filing, OTP, DSC/EVC, payment, dashboard, history, filters, analytics, chat, and custom PDF generation are cut.

### Synthetic case migration — first implementation change

Replace the current ₹21,600 fixture everywhere before UI or model development:

| Field | Approved value |
|---|---:|
| Claimed ITC | ₹1,50,00,000 |
| Available ITC | ₹1,20,00,000 |
| Difference | ₹30,00,000 |
| Later-period match | ₹18,40,000 |
| Possible duplicate | ₹11,60,000 |

The case is designed to be defensible against the publicly documented initial DRC-01C trigger without claiming that ₹25 lakh or 20% is a permanent current threshold. Product copy must say threshold settings can change and must not give legal advice.

---

## 3. Agent operating model

### Manager contract

The root Codex session does not take a broad feature-coding assignment. It owns:

- stage dispatch and dependency order;
- exclusive file ownership and overlap prevention;
- acceptance criteria and gate reviews;
- diff review, critical safety review, and integration decisions;
- returning defects to the agent that owns the affected files;
- status, plan, release record, and final handoff.

The manager may make only minimal integration glue or conflict-resolution edits. If a change belongs to an agent-owned feature file, the owning agent fixes it.

### Agent rules

- One bounded outcome per agent prompt.
- Every non-trivial feature begins with a failing test.
- Each agent receives exact files, exclusions, acceptance criteria, verification commands, and a stop condition.
- No two live agents edit the same file.
- Each handoff states: files changed, tests run, remaining risks, and real-versus-mocked impact.
- A stage does not pass because code exists; it passes only when its stated tests and manager review pass.
- Foundation freezes shared types and dependencies before UI and API agents run in parallel.

### Model allocation

Current model roles follow [official OpenAI model guidance](https://developers.openai.com/api/docs/guides/latest-model): Sol for the hardest reasoning/coding and design judgment, Terra for balanced implementation and QA, and Luna only for repetitive low-risk work. Availability and limits must be confirmed in the account before dispatch.

| Stage | Agent | Model / effort | Why this is sufficient |
|---|---|---|---|
| Manager throughout | Orchestrator | `gpt-5.6-sol`, medium; high for final safety/release review | Complex dependency, scope, and integration judgment without spending maximum reasoning on routine dispatch. |
| 0. Baseline freeze | Foundation agent | `gpt-5.6-sol`, high | Contract migration affects fixtures, shared types, tests, dependencies, and every downstream agent. |
| 1. Domain and fixture | Domain agent | `gpt-5.6-sol`, high | Tax-adjacent arithmetic, exhaustive categorisation, invariants, and failure behavior need the strongest coding/reasoning pass. |
| 2. Portal-native journey | UI agent | `gpt-5.6-sol`, high | Visual fidelity, mobile hierarchy, accessibility, and unfamiliar public-service interaction grammar require strong frontend judgment. |
| 3. Real OpenAI path | API agent | `gpt-5.6-sol`, high | Server-only secret handling, structured-output validation, grounding, timeout, and typed failure behavior are release-critical. |
| 4. Integrated QA | QA agent | `gpt-5.6-terra`, medium; critical findings reviewed by `gpt-5.6-sol`, high | Terra is sufficient for systematic automated/manual execution; Sol adjudicates security, grounding, and architectural defects. |
| 5. Submission assets | Submission agent | `gpt-5.6-terra`, medium | The product is already frozen; the work is concise narrative, rehearsal, evidence capture, and checklist completion. |
| Optional repetitive checks | Smoke/reporting agent | `gpt-5.6-luna`, low or medium | Use only for repeated link checks, result collation, or formatting. Never use it for tax logic, API safety, UI fidelity, or release approval. |

### Product runtime model

- Default explanation model: `gpt-5.6-terra`, medium reasoning.
- Configuration: server-side `OPENAI_MODEL` environment variable; never hard-code an unavailable account-specific model.
- Rationale: constrained plain-language transformation plus structured output needs reliable instruction following, but deterministic code already owns all high-stakes facts and arithmetic.
- Fallback: deterministic evidence remains fully usable when the model is unavailable; no hardcoded text may be presented as a successful AI response.

---

## 4. File ownership and dependency graph

| Stage | Exclusive owner | Files allowed | Files excluded |
|---|---|---|---|
| 0 | Foundation agent | `prototype/package.json`, lockfile, shared test config, `src/contracts/**` | UI, styles, API implementation |
| 1 | Domain agent | `src/data/**`, `src/domain/**`, `tests/reconcile.test.ts`, new domain tests | `App.tsx`, UI, API |
| 2 | UI agent | `src/App.tsx`, `src/components/**`, `src/views/**`, `src/styles.css`, UI tests | Domain rules, API/server files, dependency manifest |
| 3 | API agent | `api/**`, `src/services/**`, API/validator tests, Vercel function config | UI/styles, domain algorithm, dependency manifest |
| 4 | QA agent | E2E/test/checklist artifacts only | Production fixes; defects return to owning agent |
| 5 | Submission agent | `SUBMISSION_SUMMARY.md`, `DEMO_SCRIPT.md`, disclosure checklist | Product code |

```text
Foundation freeze
      │
      ├── Domain case + rules ─────┐
      │                            ├── Manager integration ── QA ── Deploy ── Submission
      ├── Portal-native UI ────────┤
      │                            │
      └── OpenAI API + validator ──┘
```

The UI and API agents may run in parallel only after the foundation and domain contracts are frozen. The API must consume the shared finding schema rather than creating a second one.

---

## 5. Stage 0 — baseline and contract freeze

**Owner:** Foundation agent  
**Model:** `gpt-5.6-sol`, high  
**Timebox:** 30 minutes  
**Status:** Complete on 2026-08-28. Baseline was 6/6 tests and a green build; shared contracts were frozen without adding dependencies.

### Work

- Capture baseline `npm test` and `npm run build` results.
- Add only the dependencies needed for the locked P0 route, testing, schema validation, and OpenAI server call.
- Create or freeze shared request/response and error contracts under `src/contracts/**`.
- Ensure UI and API consume the same finding IDs, evidence IDs, output schema, and typed failure codes.
- Stop if an existing uncommitted change overlaps an owned file; manager resolves ownership first.

### Exit gate

- Baseline state recorded.
- Dependency manifest and lockfile are stable.
- Shared contracts typecheck and have contract tests.
- No UI or API feature work starts before this gate passes.

---

## 6. Stage 1 — defensible fixture and deterministic reconciliation

**Owner:** Domain agent  
**Model:** `gpt-5.6-sol`, high  
**Timebox:** 60 minutes  
**Status:** Complete on 2026-08-28. Manager-verified result: 20/20 tests and production build pass.

### Failing tests first

- ₹1,50,00,000 − ₹1,20,00,000 = ₹30,00,000.
- ₹18,40,000 + ₹11,60,000 = ₹30,00,000.
- Every source row receives exactly one category: `exact_match`, `missing_in_2b`, `possible_duplicate`, or `later_period_match`.
- Clean exact matches do not enter the exception total.
- Later-period finding preserves the purchase-register and later-2B IDs.
- Duplicate finding preserves both purchase/workpaper IDs and the supporting 2B ID.
- Every visible identifier begins with `DEMO-`.
- Invalid identifiers, totals, dates, ambiguous multi-category rows, and unexplained residuals fail loudly.

### Work

- Migrate the fixture, tests, visible amounts, and contract examples together.
- Extend the finding type model to all four categories even if the demo has zero `missing_in_2b` exceptions.
- Expose deterministic match rule, compared fields, amount, source IDs, and evidence label on each finding.
- Keep `later-period match` neutral: appearance in a later synthetic 2B does not prove supplier payment, eligibility, or the correct response.
- Keep `possible duplicate` neutral: it identifies a repeated workpaper key, not proven double-claimed liability.

### Exit gate

- All domain tests pass.
- Exactly two displayed findings explain the full ₹30,00,000 difference.
- No old ₹21,600, ₹18,400, or ₹3,200 demo copy remains outside archived/history material.
- Manager reviews the arithmetic, categories, failure modes, and diff before releasing the UI/API stages.

---

## 7. Stage 2 — GST-portal-native taxpayer journey

**Owner:** UI agent  
**Model:** `gpt-5.6-sol`, high  
**Timebox:** 2 hours 30 minutes  
**Status:** Complete — UI agent handoff received; 6 UI tests pass and strict TypeScript compile passes. Rendered mobile/print QA remains.

### Failing journey test first

- `Part A → reconciliation → explanation → Part B` is walkable.
- Part A contains `EXPLAIN THIS DIFFERENCE`.
- Persistent strip reads `INDEPENDENT SYNTHETIC PROTOTYPE · NOT GSTN · NOT TAX ADVICE`.
- Inserted layer is labelled `NEW: EXPLANATION AND SOURCE RECONCILIATION`.
- Loading, failure, and retry preserve deterministic evidence.
- Part B contains Copy, Print, and Start again, with no File, Submit, DSC, EVC, OTP, payment, ARN-generation, or fake success action.
- Keyboard route works; primary touch targets are at least 44 px.

### Work

- Replace the current rounded-card product aesthetic with GST Portal interaction grammar:
  - familiar header/navigation proportions and breadcrumbs;
  - white workspace, navy/blue navigation, pale blue section headers;
  - Part A/Part B tabs, grey tax tables, uppercase rectangular actions;
  - mandatory-field and warning conventions.
- Do not use government emblem, GSTN logo, copied portal assets, exact official identity, official URL, or affiliation wording.
- Render plain-language summary before tax detail.
- Show aggregate proof, category summary, expandable finding cards, side-by-side evidence, match rule, amount, confidence, and source IDs.
- Show the OpenAI-assisted explanation with source links and limitations.
- Build the Part B review and browser print state; print must retain synthetic, not-submitted, and professional-review disclosures.
- Do not build dark mode.

### Exit gate

- Route completes in ≤60 seconds at desktop and 375 px.
- No horizontal page overflow at 320 px; responsive evidence/table treatment is readable.
- All primary actions are ≥44 px; focus is visible; no color-only meaning.
- Deterministic meaningful content renders without waiting for OpenAI.
- Manager compares rendered screens against the approved visual-direction checklist.

---

## 8. Stage 3 — real grounded OpenAI path

**Owner:** API agent  
**Model:** `gpt-5.6-sol`, high  
**Timebox:** 2 hours  
**Status:** Complete — API agent handoff received; focused API/validator tests pass, grounded Responses API path and typed failures implemented.

### Failing API tests first

- Unknown request keys and any case other than `DEMO-CASE-01` are rejected.
- Free-form citizen input is not accepted.
- Server reloads the trusted fixture and reruns reconciliation; it does not trust browser-supplied findings.
- Unknown finding/evidence IDs, extra amounts, invalid structured output, unsupported instructions, and missing required limitations are rejected.
- Timeout, refusal, upstream error, invalid schema, missing API key, and rate limit return typed safe errors.
- Deterministic evidence remains usable after every model failure.

### Work

- Implement a Vercel server function using the OpenAI Responses API and structured output.
- Request accepts only the allow-listed case ID.
- Send only the minimum validated synthetic evidence required for explanation.
- Use `store: false`, a short timeout, request-size cap, safe rate/cost cap, and server-only environment variables.
- Validate the response before returning it to the browser.
- Response fields: plain-language summary, per-finding explanations keyed to supplied IDs, verification checklist, neutral Part B draft, limitations, and generation time.
- Do not log prompts or sensitive content. Safe logs contain only event type, case ID, latency, and error code.
- Use `gpt-5.6-terra` medium by default through `OPENAI_MODEL`.

### Exit gate

- API and validator tests pass.
- No secret appears in client code, bundle, repository, or logs.
- Five consecutive deployed calls return schema-valid output grounded to the two approved findings.
- Timeout/invalid-output simulation produces a usable typed retry and deterministic fallback.

---

## 9. Stage 4 — integration and release QA

**Owner:** QA agent; fixes go back to the owning agent  
**Model:** `gpt-5.6-terra`, medium; critical review by `gpt-5.6-sol`, high  
**Timebox:** 2 hours

### Automated gate

- `npm test`, typecheck/lint if configured, and `npm run build` pass.
- Domain, API contract, component, and complete-route tests pass.
- Dependency audit has no unreviewed high/critical production vulnerability.
- Source scan finds no real-looking GSTIN/PAN, secret, official logo asset, unsafe HTML sink, live GSTN URL call, placeholder, bare `pass`, or silent exception swallowing.

### Manual gate

- Public URL opens in a clean browser with no account, access request, or download.
- Happy path and model failure path both complete.
- Five deployed model outputs contain no unknown amount, ID, advice, or claim.
- 375 px and desktop routes complete in ≤60 seconds; keyboard-only route works.
- Three throttled runs show deterministic meaningful content in under two seconds where feasible.
- Print preview has no clipping and retains all honesty disclosures.
- Browser console is clean; the client makes no request to GSTN or another government system.

### Critical review order

1. Auth/secret exposure, unsafe endpoint, XSS, data leakage, live-government interaction, deceptive official identity.
2. Arithmetic/evidence integrity, schema grounding, failure behavior, mobile/keyboard/print defects.
3. Dead code, side effects, maintainability, and test gaps.

### Exit gate

- Every P0 issue is closed or the build does not release.
- P1 polish defects are recorded and cut rather than delaying submission.

---

## 10. Stage 5 — deploy and submit

**Owner:** Submission agent for assets; manager for release gate  
**Models:** `gpt-5.6-terra`, medium for assets; `gpt-5.6-sol`, high for final gate  
**Timebox:** 2 hours plus one-hour submission buffer

### Deliverables

- Public Vercel link, verified after the final production deployment.
- Two-minute video:
  - minute 1: live taxpayer journey;
  - minute 2: problem, deterministic/OpenAI split, agent-based build, safe scale path, and real-versus-mocked disclosure.
- Project summary under 250 words.
- Both teammates registered with each other's correct registered email.

### Minute 1 route

1. Point to the independent synthetic prototype strip.
2. Show Part A and click `EXPLAIN THIS DIFFERENCE`.
3. Open both findings and prove ₹18,40,000 + ₹11,60,000 = ₹30,00,000.
4. Generate the real OpenAI-assisted explanation and point to evidence and limits.
5. Open Part B review, copy/print, and state that nothing was submitted.

### Final gate

- Link opens from a logged-out clean browser.
- Video is ≤2:00 and shows the working build rather than slides for minute 1.
- Summary is <250 words and makes real versus mocked explicit.
- No P0 change after the video unless the video is re-recorded and link rechecked.

---

## 11. Deadline-day schedule

Start immediately and preserve the fixed hard stops even if an earlier timebox slips.

| Latest IST | Gate |
|---|---|
| 09:30 | Plan/status and foundation contract frozen |
| 10:30 | ₹30 lakh fixture, categories, and domain tests green |
| 13:00 | UI and API agent handoffs complete |
| 14:00 | Integrated route and browser print complete |
| 15:30 | Production deployment and environment verified |
| 17:00 | Mobile, keyboard, failure, grounding, and safety QA complete |
| 18:00 | Under-60-second rehearsal and final copy frozen |
| 19:00 | Video, summary, and final link check complete; stop feature development |
| 19:00–20:00 | Submit and retain contingency buffer |

If the current time is already beyond a listed gate, compress P1 and review breadth, not the P0 safety or working-build gates.

---

## 12. External validation gate

A qualified GST practitioner should review the synthetic arithmetic, evidence labels, and neutral Part B wording before final copy/video freeze. This does not block engineering.

If no practitioner is available by early afternoon:

- keep `possible duplicate` and `later-period match` explicitly evidentiary, not conclusive;
- remove legal conclusions, recommended actions, and any statutory-deadline language;
- state in the product, summary, and video that the wording has not been professionally validated;
- ship the safe prototype rather than inventing certainty.

---

## 13. Rubric depth gate

The project scores **2/5** on the framework depth dial:

- money/payment movement: no;
- sensitive PII or authentication: no (synthetic data only);
- multiple entities/relationships: yes;
- portfolio-quality requirement: no;
- other people/public users will use it: yes.

Recommendation: **Full depth, greenfield build**. Because a working project already exists, do not backfill earlier framework phases today; map the work to the current implementation/release phase. Record this in framework state only after explicit confirmation.

---

## 14. Definition of done

- [ ] Approved ₹30,00,000 case and all domain/API/UI tests pass.
- [ ] Part A → explanation → Part B route works in ≤60 seconds.
- [ ] GST Portal interaction grammar is recognizable without official identity or assets.
- [ ] Every finding shows source evidence, deterministic rule, amount, and confidence.
- [ ] Real OpenAI output is schema-valid, grounded, and safely fails.
- [ ] Part B has Copy/Print/Start again only; nothing can be filed.
- [ ] Persistent synthetic/not-GSTN/not-tax-advice disclosure appears on screen and print.
- [ ] 375 px, keyboard, throttled-load, console, secret, dependency, and hostile-input checks pass.
- [ ] Public URL, ≤2-minute video, <250-word summary, and teammate registration are complete.
- [ ] Manager records the final real-versus-mocked boundary and remaining professional-validation caveat.
