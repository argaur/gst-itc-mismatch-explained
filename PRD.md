# Notice, Explained — GST DRC-01C notice-to-source-record reconciliation

**DRI:** [S] Gaurav Gupta / Kriti  
**Pod:** [S] Build What Moves India hackathon team (2 people)  
**Status:** [S] SEALED for the GST DRC-01C problem, product mechanism, and deterministic-core/OpenAI boundary; the four-view citizen-flow sequence remains provisional pending Gaurav + Kriti confirmation.  
**Created:** [S] 2026-08-27 | **Last Updated:** [S] 2026-08-27  
**Figma:** [S] None; code-first. `GST_WIREFRAME.html` is a comparison wireframe, not a Figma artifact.  
**ERD / Engineering Docs:** [S] No ERD is required for Round 1 because the approved plan uses versioned local fixtures and no database; engineering detail lives in `IMPLEMENTATION_PLAN.md`.  
**Analytics:** [X] No production analytics in Round 1; focused usability and QA observations are recorded manually.

**Document lineage:** [S] This PRD depends on `AGENTS.md`, `PROJECT_CONTEXT.md`, `STATUS.md`, `Documentation/process/PRD_QUALITY_BAR.md`, all four tabs of `index.html`, `GST_WIREFRAME.html`, `IMPLEMENTATION_PLAN.md`, and `research/GST - Secondary.md`. [S] The archived Cyber Crime discovery PRD is preserved at `Documentation/archive/PRD-cybercrime.md` and is not an active product document.

---

## Changelog

| Change | Date | People | Comments / link |
|---|---|---|---|
| [S] Archived the unsealed Cyber Crime discovery PRD without overwriting it. | [S] 2026-08-27 | [S] Codex, on Gaurav's instruction | [S] `Documentation/archive/PRD-cybercrime.md` |
| [S] Sealed the GST DRC-01C problem, underlying reconciliation mechanism, and deterministic/OpenAI responsibility boundary. | [S] 2026-08-27 | [S] Gaurav + Codex; Kriti confirmation pending | [S] Gaurav approved the direction; the citizen-flow sequence remains provisional. |
| [S] Ran all five PRD exit checks and closed all ten judging-criteria gaps. | [S] 2026-08-27 | [S] Codex | [S] See “Seal exit checks” below. |

---

# PART A — WHY (Problem Alignment)

---

## 1. The Problem

**[S] Problem statement:** A GSTIN holder receives a DRC-01C intimation showing an aggregate difference between input tax credit claimed in GSTR-3B and input tax credit available in GSTR-2B, but the notice-to-response workflow does not reconcile that total to the holder's purchase and claim records. [S] The citizen can see that a difference exists but not which transaction or record condition created it, while a required Part B response remains tied to a fixed compliance window and a missing response can block a subsequent GSTR-1/IFF filing. [Sources: `index.html`, Tabs 1–2; `research/GST - Secondary.md`, §§1–3.]

**[S] The failing moment:** The portal's documented path takes the taxpayer from an alert to Part A's aggregate figures and then to the Part B reply channel; the invoice-level reconciliation needed to explain the difference happens outside that path. [Source: `GST_WIREFRAME.html`, “Existing workflow”.]

**[S] Why this is a process gap, not a cosmetic redesign:** GSTR-3B is an aggregate claim summary, GSTR-2B is a period-specific statement populated from supplier-reported records, and the taxpayer's purchase/claim workpaper is the invoice-level bridge between them. [S] The missing capability is a traceable reconciliation layer that connects the automated flag to source evidence before the taxpayer drafts a response. [Sources: `IMPLEMENTATION_PLAN.md`, §4; `index.html`, Tabs 2–4.]

> **[S] Sharp comparison with the incumbent:** The current GST Portal gives the holder the aggregate mismatch and a form to answer it; Notice, Explained shows the exact synthetic source rows and arithmetic that explain the mismatch before any response text is drafted. [Sources: `GST_WIREFRAME.html`; `index.html`, Tab 1.]

### 1.1 Real user scenario and evidence boundary

**[H]** A GSTIN holder who prepares or checks their own returns receives a DRC-01C notice only after the automated comparison has found a mismatch. [H] They have a response deadline but no retained chartered accountant, paid reconciliation product, or already-prepared invoice-level diagnosis. [H] They must line up their GSTR-3B total, GSTR-2B rows, and purchase/claim workpaper; distinguish a supplier timing difference from a bookkeeping error; and prepare a reason that a qualified reviewer can assess.

**[H]** “Meera,” the independent wholesaler used in the demo, is a synthetic composite rather than an interviewed person. [H] Her seeded case contains a ₹21,600 aggregate difference explained by a ₹18,400 later-period supplier filing and a ₹3,200 probable duplicate claim-workpaper row. [Source: `index.html`, Tab 3; `IMPLEMENTATION_PLAN.md`, §§1 and 4.]

**[S]** The repository contains direct public forum evidence of DRC-01C-related confusion and filing blockage, but it does not contain a structured interview with a DRC-01C recipient. [S] Claims about the exact target segment, frequency of each mismatch cause, and preferred response artifact therefore remain hypotheses until practitioner review and recipient research. [Source: `index.html`, Tab 2.]

### 1.2 Evidence

| Evidence | What it supports | Source | Confidence |
|---|---|---|---|
| DRC-01C compares ITC claimed in GSTR-3B with ITC available in GSTR-2B. | The approved problem rests on a specific public compliance mechanism rather than a generic “GST is confusing” claim. | `index.html`, Tabs 1–2; linked government functionality note | [S] |
| Part B can carry a DRC-03 payment ARN, a reason for the difference, or both; a missing required Part B response can block a subsequent GSTR-1/IFF filing. | The notice creates a consequential, deadline-bound response task. | `index.html`, Tabs 1–2; linked government functionality note | [S] |
| A dated CAclubindia DRC-01C thread records a filer unable to proceed while the portal checked compliance and asking others how to resolve it. | There is a direct signal of confusion and workflow blockage, though not a dense recipient evidence base. | `index.html`, Tabs 1–2, linked DRC-01C thread | [S] |
| Late supplier filing, incorrect invoice or GSTIN data, period differences, and duplicate claims recur across practitioner and industry explanations. | These are credible categories from which to choose synthetic causes; their prevalence for this segment is not established. | `index.html`, Tab 2; `research/GST - Secondary.md`, §2 | [S] |
| GSPs, accounting products, and CA-assisted workflows already offer broader reconciliation support. | The prototype must differentiate through a narrow notice-to-evidence journey, not claim that reconciliation software does not exist. | `index.html`, Tab 2; `research/GST - Secondary.md`, §4 | [S] |
| No structured interview with a DRC-01C recipient exists in the current corpus. | Segment fit and response-artifact usefulness require follow-up validation and must not be presented as proven. | `index.html`, Tab 2 | [S] |

### 1.3 Why now

**[S]** The official mechanism already automates the aggregate mismatch and attaches a filing consequence to non-response, while the record-level diagnosis remains work the taxpayer or a paid professional performs elsewhere. [S] The hackathon deadline is August 28, 2026 at 8:00 PM IST, so the approved Round-1 wedge must be narrow enough to demonstrate that missing layer end to end with no live GSTN access. [Sources: `index.html`, Tabs 1–2; `PROJECT_CONTEXT.md`; `IMPLEMENTATION_PLAN.md`, §§1–3.]

**[H]** One qualified GST practitioner's review of the synthetic arithmetic, cause labels, and neutral Part B wording is a build gate because the official mechanics are better evidenced than the proposed citizen-facing language. [Source: `IMPLEMENTATION_PLAN.md`, §2.]

## 2. Target User

**[H] Structural segment:** A GSTIN holder who reconciles their own returns without a retained CA or paid reconciliation software and first learns that reconciliation failed when a DRC-01C notice with a fixed response deadline arrives.

| Required field | Segment definition | Confidence |
|---|---|---|
| Job | Trace the notice's aggregate GSTR-3B-versus-GSTR-2B difference to source records and prepare a reviewable explanation before responding. | [H] |
| Trigger | A DRC-01C intimation arrives with an aggregate mismatch and a response deadline. | [S] |
| Context | The holder has their own return summary and purchase records but lacks an already-running paid reconciliation workflow or retained professional who owns the diagnosis. | [H] |
| Current workaround | Manually compare GSTR-3B, current and later-period GSTR-2B records, and the purchase/claim workpaper; search practitioner forums; or pay for ad hoc professional help. | [S] |
| Switching cost | The holder must trust a new tool with a compliance-sensitive explanation and still spend time checking its evidence with a qualified professional; the prototype reduces organisation work but does not remove that review. | [H] |

**[X] Explicit exclusions:** The Round-1 user is not a GST officer, administrator, retained CA, enterprise compliance team, person seeking a tax-liability decision, or person asking the prototype to file on GSTN. [X] No diagnostic, reasoning, status, or workflow output will be placed in a separate admin or operations dashboard; every output stays inside the citizen's own synthetic case journey.

## 3. Existing ecosystem and product opportunity

**[S]** Existing GSPs, accounting tools, and CA-led processes can reconcile records, but they generally assume paid access, ongoing data preparation, or compliance literacy. [H] The opportunity is not to replace those systems; it is to give a self-reconciling holder a transparent bridge from one received DRC-01C aggregate to the source rows and review questions behind it. [Sources: `research/GST - Secondary.md`, §4; `index.html`, Tabs 1–3.]

**[S]** The product fixes one exact handoff failure: the current portal goes from aggregate Part A figures to a Part B response form, whereas the proposed mechanism inserts deterministic record reconciliation, a constrained explanation, and a professional-review brief between those steps. [Source: `GST_WIREFRAME.html`.]

## 4. Key assumptions

| Assumption | Validation plan | Confidence |
|---|---|---|
| A self-reconciling GSTIN holder can understand the difference more safely when the aggregate is tied to visible source rows and plain-language cause labels. | Run the primary comprehension test defined in §10 with no tax coaching. | [H] |
| The seeded later-period and probable-duplicate causes are credible and neutrally described. | One qualified GST practitioner reviews the fixture, arithmetic, labels, and draft boundary before Block 2. | [H] |
| A review brief is a useful handoff artifact even though it is not a filing. | Ask the practitioner and at least one DRC-01C recipient whether it shortens their diagnosis/review work. | [H] |
| The constrained model can improve comprehension without becoming the source of tax math or unsupported advice. | Validate structured outputs against allow-listed finding and evidence IDs; fail visibly on any invalid output. | [H] |

---

# PART B — HOW (Solution)

---

## 5. Product promise and principles

**[H] Product promise:** Trace one synthetic DRC-01C mismatch from the aggregate intimation to the purchase and claim records behind it, explain only validated findings in plain language, and prepare a clearly labeled brief for qualified professional review.

**[H]** The product will put plain language before tax abbreviations, show evidence before generated explanation, keep uncertainty visible, and end at a human-reviewable artifact. [X] It will not determine liability, recommend paying or reversing credit, validate a GSTIN, file a response, display a fabricated portal outcome, or imply that professional judgment is unnecessary.

## 6. Four-view citizen journey

**[H] This flow is the working design as of August 27, 2026. Gaurav and Kriti are confirming or adjusting it before Block 2 build work starts; this section will be updated in place, not re-sealed, once that happens.**

**[H]** The working journey begins with useful content rather than a separate welcome screen and is designed to be walked from notice to review brief in under 60 seconds. [Source: `IMPLEMENTATION_PLAN.md`, §§1 and 6.]

1. **[H] View 1 — Notice overview:** Show a persistent `Synthetic demo · Not connected to GSTN · Not tax advice` disclosure, translate the ₹21,600 aggregate into plain language, show GSTR-3B and GSTR-2B totals, and offer one action: `Show where ₹21,600 comes from`.
2. **[H] View 2 — Evidence:** Show the GSTR-3B total, GSTR-2B total, and purchase/claim workpaper; then show ₹18,400 + ₹3,200 = ₹21,600 before two expandable findings with source IDs and confidence wording.
3. **[H] View 3 — OpenAI explanation:** Request a structured explanation only after deterministic findings exist; render `What we found`, `Evidence used`, `What to verify`, and `What this tool cannot decide`, while leaving deterministic evidence usable during loading or failure.
4. **[H] View 4 — Review brief:** Present the aggregate arithmetic, both findings, source-row appendix, neutral checklist, short draft Part B text, and limitations; place `Nothing has been submitted to GSTN` immediately above `Print review brief`, and provide `Start again` without a success status or case timeline.

## 7. End-to-end mechanism and responsibility boundary

**[H] System path:** Synthetic DRC-01C notice → trusted synthetic GSTR-3B summary and purchase/claim workpaper → current and next-period synthetic GSTR-2B rows → deterministic reconciliation → constrained OpenAI explanation and short draft → citizen-visible review brief.

| Component | Owns | Must not own | Confidence |
|---|---|---|---|
| Client | Citizen route, local evidence display, loading/error states, disclosures, and browser-print view. | Tax calculations, secret handling, or government interaction. | [H] |
| Shared deterministic domain | Totals, record matching, cause classification, arithmetic, and source-row links. | Natural-language tax advice or unsupported inferences. | [H] |
| Server function | Accept only `{"caseId":"DEMO-CASE-01"}`, load trusted fixtures, run reconciliation, call OpenAI, validate the response schema, and return a safe result. | Arbitrary public input, open-ended personal data, or a client-exposed API key. | [H] |
| OpenAI model | Explain validated findings and draft concise, neutral text for professional review. | Matching, classification, arithmetic, liability decisions, portal instructions, deadlines, payment advice, or facts absent from the trusted payload. | [H] |

**[H] Functionally central model role:** The real OpenAI call produces the citizen's plain-language interpretation and draft review text from validated evidence; without it, the evidence path remains available but the promised explanation layer is unavailable and is shown as a failure state rather than replaced by hardcoded copy labeled as AI. [H] This makes the model central to the explanation task while keeping every rupee and evidence reference independently verifiable. [Source: `IMPLEMENTATION_PLAN.md`, §§5 and 7.]

**[H] Validation boundary:** The server will use Responses API Structured Outputs, revalidate parsed output in application code, require every finding and evidence reference to exist in the trusted input, set `store: false`, cap output length, use a short timeout, and return a typed safe error on refusal, timeout, invalid schema, incomplete response, or upstream failure. [Source: `IMPLEMENTATION_PLAN.md`, §7.]

## 8. Mock-versus-real boundary

| Element | Round-1 state | Citizen-facing disclosure | Confidence |
|---|---|---|---|
| DRC-01C category, aggregate comparison, Part B response mechanics, and filing consequence | Public-process reference used as the design basis; not claimed as complete tax or legal guidance. | Link the public source and state that the prototype is independent and educational. | [S] |
| Notice, identity, GSTIN, reference number, invoices, suppliers, dates, amounts, and return rows | Entirely synthetic; visible identifiers begin with `DEMO-` and no valid-looking GSTIN is required. | `Demo data` persists on every case view and print output. | [H] |
| Reconciliation and mismatch arithmetic | Real prototype code operating on trusted synthetic fixtures. | Show source rows and arithmetic; never call the result a GSTN result. | [H] |
| Explanation and draft response language | Real server-side OpenAI output constrained to validated synthetic findings. | Label it `OpenAI-assisted prototype output` and `Review with a qualified GST professional before using`. | [H] |
| GSTN login, validation, filing, payment, portal status, and outcome | Not connected and not implemented. | Show `Nothing has been submitted to GSTN`; never show a fake outcome. | [X] |

## 9. Experience, accessibility, performance, and scale safety

**[H] Mobile-first requirements:** The primary route will work at 375 px width, all primary touch targets will be at least 44 px, the entire route will work by keyboard, and plain English will precede each tax abbreviation. [H] The first meaningful notice and deterministic evidence will render without waiting for the model and target less than 2 seconds under the agreed throttled test profile. [X] Dark mode is excluded from Round 1.

**[H] Low-bandwidth and low-digital-literacy requirements:** Round 1 will use local versioned fixtures, no user uploads, no database, minimal assets, one primary action per view, concise cause labels, and a readable browser-print stylesheet. [H] Model loading, timeout, and failure states will keep the evidence visible and say plainly that nothing was lost or submitted.

**[H] Zero-user behavior:** With no visits, no database, background job, scheduled government request, or model call runs. [H] A first visitor receives the local deterministic case before any optional model-dependent content.

**[H] Scale behavior:** The public endpoint will accept only the single allow-listed demo case, cap model output and timeout, keep the API key server-side, and use a project spending limit or alert appropriate to a public demo. [H] If traffic exceeds the demo's safe operating envelope, the model path may fail closed while deterministic evidence remains available.

**[H] Malicious or malformed input behavior:** The server will reject unknown keys and case IDs, never accept free-form citizen text, never forward personal data, and reject model responses containing unknown finding or evidence IDs. [H] Errors will be typed and user-safe rather than silently swallowed.

## 10. Success criteria, primary metric, and kill signals

| Criterion | Target and measurement | Kill / diagnosis signal | Confidence |
|---|---|---|---|
| Primary user outcome: unaided comprehension | Early test: at least 4 of the first 5 participants can state the ₹21,600 cause, name both findings, and state that nothing was filed after one journey of 60 seconds or less. Real-read floor: do not generalize the rate until at least 15 participants; at that floor, require at least 12 of 15. | Stop feature expansion and diagnose the journey if 2 or fewer of the first 5 succeed, or if fewer than 12 of 15 succeed at the real-read floor. | [H] |
| Deterministic correctness | Automated tests prove claimed ITC minus available ITC equals ₹21,600, the two findings equal ₹18,400 and ₹3,200, their sum equals ₹21,600, and a clean matched row is excluded. | Stop deployment on any arithmetic, classification, or source-link failure. | [H] |
| Model grounding | The early gate is 5 consecutive deployed outputs and the release read is 20 consecutive deployed outputs; every output must be schema-valid and reference only supplied finding and evidence IDs. | Stop the model release on the first unsupported or unknown ID at either sample size; keep the deterministic route available while diagnosing. | [H] |
| End-to-end usability | Complete notice → evidence → explanation → review brief in 60 seconds or less for 3 consecutive rehearsals at 375 px and once at desktop width. | Stop recording if any of the 4 runs exceeds 60 seconds or the primary route cannot be completed. | [H] |
| Accessibility | Complete the primary route once by keyboard with no trap; verify every primary action is at least 44 px. | Stop recording if any primary action is unreachable, focus is lost, or a primary target is below 44 px. | [H] |
| Failure resilience | Force loading, timeout/failure, invalid output, and retry once each on the deployed build; deterministic evidence must remain visible in all 4 states. | Stop deployment if any forced failure hides evidence, implies submission, or substitutes fake AI output. | [H] |
| Honest disclosure | Each of the 4 views and the print output states the synthetic/no-GSTN boundary; the final view states that nothing was submitted. | Stop recording if any of the 5 surfaces omits its required disclosure or implies an official result. | [H] |
| Performance | First meaningful notice and deterministic evidence render in under 2 seconds in 3 consecutive runs under the agreed throttled mobile profile. | Stop non-essential polish and diagnose payload/rendering if any of the 3 runs reaches 2 seconds or more. | [H] |

## 11. Tradeoffs and rejected designs

| Decision | Reason | Confidence |
|---|---|---|
| Use one notice, one synthetic case, and exactly two seeded causes. | This preserves a complete, traceable Round-1 journey and avoids breadth that does not improve the judging criteria. | [H] |
| End with a professional-review brief, not filing or a claimed resolution. | The build can demonstrate process depth honestly without GSTN access or a fabricated government outcome. | [H] |
| Use deterministic rules for all matching and math; use OpenAI only for explanation and drafting. | This keeps financial reasoning auditable and constrains hallucination risk while preserving a meaningful model role. | [H] |
| Reject uploads, OCR, login, persistence, arbitrary chat input, and live integration in Round 1. | These add privacy, injection, security, and delivery risk without strengthening the one-minute citizen demo. | [X] |
| Reject a case timeline, mocked status changes, or a separate admin/ops dashboard. | These would imply a backend state or reviewer workflow the prototype does not have and would move attention away from the citizen's own evidence. | [X] |
| Reject custom PDF, charts, animations, dark mode, analytics, and a component library in Round 1. | Browser print and a focused mobile path meet the submission need with less deadline risk. | [X] |

---

# PART C — EXECUTION

---

## 12. Scope split

### Round 1 — August 28, 2026 submission

- **[H]** Ship one synthetic `DEMO-CASE-01` DRC-01C intimation with a ₹21,600 aggregate difference.
- **[H]** Ship trusted GSTR-3B summary, current and next-period GSTR-2B extracts, and purchase/claim-workpaper fixtures.
- **[H]** Ship deterministic reconciliation for exactly two findings, visible arithmetic, source-row references, and focused tests.
- **[H]** Ship one real server-side OpenAI Responses API call with structured output, validation, loading, failure, and retry states.
- **[H]** Ship the confirmed version of the four-view mobile citizen journey and a browser-printable professional-review brief.
- **[H]** Ship persistent synthetic-data, no-submission, independent-product, and professional-review disclosures.
- **[H]** Ship a public Vercel URL and a rehearsed 60-second route.

### Round 1 — cut before deadline

- **[X]** No timeline, mocked status changes, uploads, CSV import, OCR, accounts, login, persistence, multiple notices, multiple personas, multiple languages, custom PDF generation, charts, animations, dark mode, analytics, or broad test program.

### Round 2 — September 7, 2026 resubmission, only if shortlisted

- **[H]** Consider consent-based local import of taxpayer-downloaded files only after privacy review.
- **[H]** Consider more reconciliation causes, multiple synthetic cases, regional-language explanations, a practitioner-validated response taxonomy, and richer print/PDF output.
- **[H]** Round-2 additions remain contingent on Round-1 evidence, mentor input, safety review, and the core journey remaining understandable.

## 13. Delivery sequence and blocking gates

1. **[S] Block 0 — direction and safety:** The DRC-01C problem and mechanism are approved by Gaurav; Kriti's confirmation of the exact flow remains the next blocker. [H] A qualified GST practitioner must sanity-check the synthetic arithmetic, cause labels, evidence chain, and neutral response wording before Block 2.
2. **[H] Block 1 — deterministic core:** Create typed fixtures and reconciliation tests first, scaffold the smallest React/Vite/TypeScript app and server function, and deploy a static first view early.
3. **[H] Block 2 — confirmed no-AI journey:** After Gaurav + Kriti confirm or adjust §6, build the notice, evidence, and review-brief route with persistent disclosures, keyboard support, and print styles.
4. **[H] Block 3 — constrained model:** Add the allow-listed server contract, structured OpenAI output, application validation, and honest loading/failure/retry behavior.
5. **[H] Block 4 — submission proof:** Run focused QA, rehearse and record the 60-second journey, record minute two, finish the under-250-word summary, and verify the public URL before the deadline buffer.

## 14. Submission deliverables

| Hackathon requirement | Round-1 deliverable | Acceptance condition | Confidence |
|---|---|---|---|
| Live public link | Vercel-hosted citizen prototype. | Opens in a browser with no access request, account, or app download; all 4 views and the deployed model success/failure paths work. | [H] |
| Two-minute demo video | Minute 1: the synthetic citizen journey; minute 2: why it matters and how deterministic code, OpenAI, and the safety boundary work. | Total duration is no more than 2 minutes; minute 1 completes the live route and minute 2 names real versus mocked behavior. | [H] |
| Project summary | A submission summary naming the structural user, notice-to-record gap, journey, responsibility split, and synthetic/no-GSTN boundary. | Final summary is fewer than 250 words and makes no claim of interviews, real outcomes, tax accuracy, or official approval. | [H] |
| Team registration | Kriti and Gaurav use the required registered-email pairing. | Both team members are listed consistently before submission. | [S] |

## 15. Definition of done

- **[S]** The GST DRC-01C problem, underlying reconciliation mechanism, and deterministic/OpenAI responsibility boundary are sealed in this PRD.
- **[H]** Gaurav and Kriti have confirmed or adjusted the §6 flow before Block 2 implementation begins.
- **[H]** A qualified GST practitioner has sanity-checked the synthetic scenario and wording boundary.
- **[H]** Deterministic code proves ₹18,400 + ₹3,200 = ₹21,600 from visible synthetic source rows and excludes clean matches.
- **[H]** A real deployed OpenAI call returns schema-valid explanation text grounded only in supplied demo IDs.
- **[H]** Model failure is stated honestly and does not block access to deterministic evidence.
- **[H]** A reviewer completes notice → evidence → explanation → review brief in under 60 seconds on the main mobile route.
- **[H]** The primary mobile and keyboard routes work, all primary touch targets are at least 44 px, first meaningful content meets the §10 performance check, and print preview is readable.
- **[H]** Every identifier is synthetic; no live government system, real personal/tax data, secret, or arbitrary citizen input is exposed.
- **[H]** No screen implies GSTN connection, filing, payment, portal status, official approval, or outcome.
- **[H]** The public link, no-more-than-2-minute video, and under-250-word summary are ready before August 28, 2026 at 8:00 PM IST.

## 16. Non-negotiable safety, identity, and licensing constraints

- **[X]** The prototype will not access, test, or interfere with a live government system; use an undocumented private API; or scrape personal or restricted information.
- **[X]** The prototype will not contain real Aadhaar numbers, PAN details, GSTINs, passwords, OTPs, payment details, health information, or other sensitive data.
- **[X]** The prototype will not present itself as an official government product or imply approval, affiliation, or partnership.
- **[X]** The prototype will not use government logos or seals in any way that suggests approval or partnership.
- **[S]** This is a new build from zero prototype code, not a recycled prior project with small changes. [Source: `STATUS.md`; `AGENTS.md`.]
- **[X]** The build will not include code, assets, fonts, data, or other material without permission to use them.

## 17. Seal exit checks

| Check | Result | Location | Fix owner |
|---|---|---|---|
| Confidence-tag coverage | [S] PASS — every row in Evidence, Key assumptions, Success criteria, and other claim tables carries `[S]`, `[H]`, or `[X]`; prose claims are tagged. | §§1–16 | None — closed in this draft. |
| Vague-metric scan | [S] PASS — every success commitment has a number or binary test, including 60 seconds, 44 px, 2 seconds, sample sizes, consecutive runs, output counts, video length, and summary length. | §10, §§14–15 | None — closed in this draft. |
| ICP structural-condition test | [S] PASS — the segment is defined by self-reconciliation without retained CA/software plus notice-triggered discovery; Job, Trigger, Context, Current workaround, and Switching cost are explicit. | §2 | None — closed in this draft. |
| Kill signal | [S] PASS — the primary comprehension metric has numeric early and real-read stop thresholds; each supporting criterion also has a stop-and-diagnose condition. | §10 | None — closed in this draft. |
| Two-n rule | [S] PASS — the primary comprehension rate names an early kill-switch `n=5` and real-read floor `n=15`; model-grounding sampling names an early gate of 5 and release read of 20. | §10 | None — closed in this draft. |

**[S] READY (all 5 pass).**

---

> **Provenance**
>
> **[S] Sealed on:** 2026-08-27 for the GST DRC-01C notice-to-source-record problem, the GSTR-3B → purchase/claim workpaper → GSTR-2B reconciliation mechanism, and the deterministic-core/constrained-OpenAI responsibility boundary.  
> **[S] Source files:** `AGENTS.md`; `PROJECT_CONTEXT.md`; `STATUS.md`; `Documentation/process/PRD_QUALITY_BAR.md`; `index.html` Tabs 1–4; `GST_WIREFRAME.html`; `IMPLEMENTATION_PLAN.md`; `research/GST - Secondary.md`.  
> **[S] Archived predecessor:** `Documentation/archive/PRD-cybercrime.md`, preserved as unsealed Cyber Crime discovery.  
> **[H] Provisional section:** §6, Four-view citizen journey. Gaurav and Kriti may confirm or adjust the exact sequence before Block 2; the section will be updated in place without reopening the sealed problem or responsibility boundary.  
> **[S] Decision state:** Gaurav has approved the DRC-01C notice-decoder direction; Kriti has not yet confirmed the exact citizen-flow sequence.
