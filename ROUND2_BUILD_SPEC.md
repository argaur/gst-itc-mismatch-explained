# ROUND2_BUILD_SPEC.md — "Silence is a decision"

**For:** Gaurav + Codex
**Written:** 2026-09-07, after reading the repo at `argaur/gst-itc-mismatch-explained`
**Deadline:** 2026-09-08, 22:00 IST. `STATUS.md` currently says Sep 7 — that is stale, fix it.

Read `AGENTS.md` first. Every rule in it still applies. This document adds one feature and does not change any existing decision.

---

## START HERE — the domain layer is already written and tested

**Do not build the logic from scratch. It is done.** Six TypeScript files were written against a clone of this repo, and verified inside it:

```
npm test      ->  7 files, 80 tests passing   (your existing 40, plus 40 new)
npm run build ->  tsc --noEmit clean, vite build clean
```

Apply them either way:

```bash
# option A, one command from the repo root
git apply round2-domain-layer.patch

# option B, copy the six files in by hand, paths already match
prototype/src/contracts/riskAssessment.ts
prototype/src/domain/assessRisk.ts
prototype/src/data/riskCase.ts
prototype/src/services/answerValidator.ts
prototype/tests/assess-risk.test.ts
prototype/tests/answer-validator.test.ts
```

Then run `npm test` and confirm 80 passing before writing a line of new code.

**What is left for you: two screens, two endpoints, and the live API.** Sections 6 to 9 below.

---

## 1. What we are building, in one paragraph

Round 1 explains a notice **after** the money is gone. Round 2 adds the half that comes **before**: a screen that tells the business owner what they are about to lose this month by doing nothing, and by which date.

This is driven by a rule most owners have never heard of. On the government's invoice screen, **if you take no action, the system treats it as accepted.** Since Oct 2025 the "pending" option lasts only one tax period, then the button disables and the deemed acceptance locks in. A supplier's credit note that reduces your credit goes through silently if nobody looks.

**Minute 1 of the video is the existing build, unchanged. Minute 2 is this feature.** We are not rebuilding anything.

---

## 2. The most important engineering decision

**Do not touch `src/domain/reconcile.ts`. Do not edit anything under `src/contracts/`.**

I read the engine. `reconcile()` is a good, strict, pure function, and its invariants are correct **for a notice**:

- `purchaseTotal` must equal `claimedItc`, exactly
- current-period 2B total must equal `availableItc`, exactly
- findings must explain `claimedItc - availableItc` with **zero residual**, or it throws
- every 2B row must have a purchase-side candidate, or it throws
- every ID must start with `DEMO-` (`assertDemoId`), enforced at runtime and in the `DemoId` type

The new feature has **no notice, no claimed-vs-available pair, and no residual to balance to.** Bending `reconcile()` to fit it would break those invariants, break the 5 existing test files, and put minute 1 of the video at risk on the one day we cannot afford that.

So: **add a parallel path.** New contract file, new domain function, new view, new endpoint. Nothing existing changes. `STATUS.md` already declares `src/contracts/**` frozen — this respects that by adding a file rather than editing one.

---

## 3. Files to add

Already written, tested, and in the patch:
```
prototype/src/contracts/riskAssessment.ts     new types (new file, nothing frozen is touched)
prototype/src/domain/assessRisk.ts            the classifier (pure function)
prototype/src/data/riskCase.ts                the fixture
prototype/src/services/answerValidator.ts     guards for the question box (§7b)
prototype/tests/assess-risk.test.ts           scores the classifier against the answer key
prototype/tests/answer-validator.test.ts      proves the model cannot invent a number
```

Still yours to write:
```
prototype/src/views/RiskView.tsx              the risk screen + question chips
prototype/api/ask.ts                          the question box endpoint (§7b)
prototype/api/explain-risk.ts                 plain-language summary of the result
prototype/scripts/generate-risk-fixture.mjs   copy in from the handoff folder if you want to regenerate data
```

Files to **modify**, minimally:
```
prototype/src/App.tsx                         add the new step to the existing stepper
STATUS.md                                     update deadline + what's decided
```

---

## 4. The classifier — already written and verified

**Already written at `src/domain/assessRisk.ts` and in the patch.** You do not need to port anything. `scripts/assess-risk.mjs` in the handoff folder is the same logic in plain JavaScript, kept only because it is easier to read in one sitting. The rules below are documentation of what is already there.

Rules, in this exact order — order is load-bearing:

| # | Condition | Category | At risk? |
|---|---|---|---|
| 1 | `docType === "credit_note"` && `imsStatus === "N"` | `credit_note_reducing_itc` | **Yes** |
| 2 | `inPurchaseRegister` && `supplierFiledDate === null` | `supplier_not_filed` | **Yes** |
| 3 | `itcAvailable === "N"` | `itc_not_available` | **Yes** |
| 4 | `imsStatus === "R"` && `inPurchaseRegister` | `wrongly_rejected` | **Yes** |
| 5 | `docType === "invoice"` && `imsStatus === "N"` && `inPurchaseRegister` | `deemed_accept_harmless` | No |
| 6 | otherwise | `no_action_needed` | No |

Rule 5 matters as much as rule 1. **A tool that flags everything is worthless.** Deemed acceptance of a bill your own books agree with is *fine*, and the demo must show the tool saying so. The answer key contains two rows that are deliberately not at risk, so a naive engine fails it.

Output shape (see `assess-risk.mjs` for the full object):
```
{ caseId, period, statementDate, actionDeadline, daysRemaining,
  totalAmountAtRisk, amountLostIfNothingDone, items[], priorityOrder }
```

Each item carries `whyItMatters`, `whoCausedIt` (`supplier` | `you` | `rules` | `nobody`), `whatToDo`, and `evidenceFields` — the raw fields that produced the verdict. **`evidenceFields` is what makes the AI honest.** See §7.

---

## 5. Dummy data — generator included, already tested

Run it:
```bash
node scripts/generate-risk-fixture.mjs ./fixtures
```

It emits four files:

| File | What it is |
|---|---|
| `gstr2b-synthetic.json` | The government's **real GSTR-2B structure**, synthetic contents |
| `purchase-register.csv` | What the business's own books say |
| `riskCase.json` | Flattened shape the app consumes |
| `answer-key.json` | Ground truth, so the engine is **scored, not eyeballed** |

Verified output:
```
Total at risk:         Rs 3,24,400
Lost silently if idle: Rs 86,400 on 2026-10-20
```

### Two honesty decisions baked into the generator, say these out loud on camera

1. **Field names and enum values follow the real published structure.** `imsStatus` (`A`/`R`/`N`), `itcavl` (`Y`/`N`/`T`), `rsn`, `supfildt`, `supprd`, the `b2b` and `cdnr` sections, `DD-MM-YYYY` dates. Every *value* inside is invented.

   **Be precise about the source if asked, because this is attackable.** The field-by-field structure is published by a licensed commercial provider (`developer.sandbox.co.in`), **not by GSTN itself**. The government's own user guide confirms the file is downloadable and meant to be read by offline software, but we could not find a government-published schema in the open. So the correct claim on camera is *"shaped to the structure used by licensed commercial software, the best public reference available"* — **not** *"the government's published schema"*. Do not overstate this. A judge who checks will find the source is a company.

2. **Every synthetic GSTIN uses state code `88`, which does not appear in the published list of Indian state codes** (which run 01–38, plus 97 and 99). So these should not collide with any real taxpayer. Say "not in use today", not "cannot ever exist" — we cannot promise how codes get allocated in future.

Internal IDs keep the `DEMO-` prefix so the repo's existing `assertDemoId` guards keep passing.

---

## 6. The one real live API call

**This is the only thing in the build that talks to the outside world besides OpenAI, and it earns the "real integration" claim.**

It answers the question the credit statement structurally cannot: *the bill is missing — has my supplier actually filed at all?*

**Before building anything on it, verify it returns usable data.** This is the first task of the morning, time-boxed to 15 minutes:

```bash
# 1. Sign up: https://accounts.sandbox.co.in/signup   (self-serve, free test tier)
# 2. Keys from console.sandbox.co.in -> Settings -> API Keys
# 3. Authenticate:
curl -X POST https://test-api.sandbox.co.in/authenticate \
  -H "x-api-key: $SANDBOX_KEY" \
  -H "x-api-secret: $SANDBOX_SECRET"
# 4. Then call the public GSTIN search / Track GST Returns endpoint with the returned JWT.
```

**If it returns fixtures instead of real data, or the signup stalls: stop and fall back.** Do not spend more than 30 minutes total on this. Fallbacks in order:
1. RapidAPI "GST Insights" — free tier, key instantly, **100 requests/month hard cap** so cache every response to disk.
2. Cut the live call entirely and ship §4 + §5 only. The feature still stands on its own.

Rate limits are 25 req/min (Sandbox). **Cache aggressively and say so** — a constraint that produced a caching design is a good answer to "tell me about your backend", not an embarrassment.

**Hard rule:** this call goes to a third-party commercial API, never to `gst.gov.in`. Scraping the GST portal is named as an offence under s.43 of the IT Act in the portal's own terms, and it is WAF-blocked anyway. Do not attempt it, do not demo it, do not mention it.

---

## 7. The AI layer — keep it exactly where it already is

The existing pattern in `api/explain.ts` is genuinely good and should be copied, not redesigned:

- Reconciliation is **re-run server-side** on every call, so nothing from the browser can become evidence
- OpenAI Responses API, `gpt-5.6-terra`, `store: false`, strict `json_schema`, `tools: []`
- Output is validated against the deterministic result before it reaches the user
- Every failure path degrades to *"the deterministic evidence is still available"*

Mirror all of it in `api/explain-risk.ts`. The model's **only** job:

> Take the already-decided findings and write them as short plain sentences, in Hindi or English, naming the supplier, the amount, whose fault it is, and the date.

The model must **not** compute an amount, invent a finding, decide eligibility, or give tax advice. Pass it only `items[]` with their `whyItMatters` / `evidenceFields`. Validate that every returned sentence maps to a `rowId` that exists. If validation fails, show the deterministic list without the prose — the screen must be fully usable with the AI switched off.

### Latency — this was explicit mentor feedback to another team

**Render the deterministic result immediately. Do not wait for the model.** The rupee amounts, the categories, and the deadline are known instantly and require no network call. Paint them, then let the plain-language text stream in after. Existing timeout is 12s; keep it. The screen must never show a spinner over an empty page.

### Hindi

Add a language toggle that changes only the model's output language. Do **not** machine-translate the numbers or the category labels — keep those deterministic and localise them with a static string map. Hindi is our sharpest differentiator: every incumbent tool in this space is English-only, and the most-watched public explainer of this exact government screen is a Hindi video.

---

## 7b. "Ask in your own words" — the feature that answers *how is AI actually used*

**This is now the most important thing in the build after the risk list itself.** Read why before you build it.

The mentors' single most repeated point was *"how is AI used in the project, not just from a building point of view but from product use."* In everything else we do, the model paraphrases findings our code already decided — and a judge can fairly say *"that is a template with extra steps."* They would be right.

This feature is the answer, because it is the one job a template genuinely cannot do.

**What it is:** a box on the risk screen where the owner asks in ordinary words, in Hindi, English, or a mix of both. *"mera paisa kyun kam hua?"* / *"मेरा पैसा क्यों कम हुआ?"* / *"Verma ka bill kya hua?"* The model reads the question, works out which finding it refers to, and answers in the same language the person used.

Mapping messy, transliterated, code-mixed language from an untrained person onto the right finding is exactly what a model is for. That sentence is your answer on camera.

**Also note what this does for two other criteria.** It is the plainest possible answer to "average Indian consumer who may not understand heavy lingo", and it is the sharpest thing separating us from ProfitPulse, which is English-only and sold to the accountant.

### It is already made safe. Do not weaken this.

`src/services/answerValidator.ts` ships with the patch and has **22 tests**. The model runs behind these guards:

- **The number guard, with no threshold.** *Every* number in the model's answer must already exist in the deterministic result — money figures, the day count, the parts of the three dates, and counts up to the number of findings. Anything else is rejected before it reaches the screen. Devanagari digits and Indian comma grouping are normalised first, so a Hindi answer is checked exactly as strictly as an English one.

  Tests prove `99999` is blocked; that `38,500` is blocked even though it is a real amount on the sheet, because that row is *not* at risk; and that a small `800` is blocked too. **That last one matters:** the first version of this guard only checked figures of ₹1,000 or more, which left a wrong "800 rupaye" free to pass. There is no safe threshold, so there is no threshold. Do not reintroduce one.
- **Citation check.** An answer must cite at least one real `rowId`. Unknown IDs and duplicates are rejected.
- **Honest refusal.** If the question cannot be answered from the findings, the model must set `answerable: false`, cite nothing, and point to a professional. Enforced both ways.
- **Minimal input.** `buildAnswerModelInput` sends findings only. The purchase register, the GSTINs and the raw tax rows never reach the model. There is a test asserting that.

You are wiring these up, not designing them.

### What to build

`prototype/api/ask.ts`, mirroring `explain.ts` exactly:

1. Accept `{ caseId, question, language }`. Run `assertQuestionAcceptable(question)`.
2. **Re-run `assessRisk(riskCase)` server-side.** Never trust anything from the browser as evidence. Same rule as the existing endpoint.
3. Call the model with `createAnswerJsonSchema()` as a strict `json_schema`, and `buildAnswerModelInput(result, question, language)` as the only content.
4. Pass the result through `validateModelAnswer`. On any failure return a typed error and show the risk list unchanged — the screen must stay fully usable when this path fails.

**Instructions to give the model:** answer only from the supplied findings; reply in the language requested; use short plain sentences a person with no tax training can read; never give tax advice, never decide eligibility, never state a number that is not in the findings; if it cannot be answered from the findings, set `answerable: false`.

### Offer four buttons, not an empty box

An empty text box is a bad demo and worse for a first-time user. Ship suggested questions as tappable chips, with free typing also allowed:

- `मेरा पैसा क्यों कम हुआ?` (why did my money reduce)
- `सबसे पहले क्या करूँ?` (what should I do first)
- `किसकी गलती है?` (whose mistake is this)
- `Verma Packaging ka kya hua?`

The chips make the demo reliable and prove the point without anyone typing on camera.

### Latency

Use `reasoning: { effort: "low" }` and roughly `max_output_tokens: 400`. This is a short answer, not a reasoning task.

---

## 7c. Fix the latency in the EXISTING endpoint too

`api/explain.ts` currently sends `reasoning: { effort: "medium" }` and `max_output_tokens: 1_800`.

**We are paying for reasoning effort on a job that involves no reasoning.** Our engine has already decided every number; the model only rewrites confirmed findings into sentences. Drop the effort to `"low"` and trim the token ceiling.

A mentor told another team in this exact cohort to optimise their prompt because their model took 5 to 15 seconds. This is that fix, it is two lines, and it improves Minute 1 as well as the new feature. Do it early and time it before and after.

---

## 8. Build order, time-boxed

| # | Task | Box | Gate |
|---|---|---|---|
| 0 | Verify the Sandbox API (§6). If stalled, fall back and move on. | 30 min | Decision made, not perfected |
| 1 | ~~Port the classifier~~ **DONE** — apply the patch | 5 min | `npm test` shows 80 passing |
| 2 | ~~Scoring test~~ **DONE** — included in the patch | — | — |
| 3 | ~~Fixtures + `riskCase.ts`~~ **DONE** — included in the patch | — | — |
| 4 | Latency fix in `explain.ts` (§7c) | 15 min | Timed before and after |
| 5 | `RiskView.tsx` + wire into the stepper | 120 min | Journey walkable end to end |
| 6 | **`api/ask.ts` + the question chips (§7b)** | 90 min | Grounded answer in Hindi, invented number blocked |
| 7 | `api/explain-risk.ts`, mirroring `explain.ts` | 60 min | Failure path degrades cleanly |
| 8 | Live API into the `supplier_not_filed` path | 45 min | Cached, with backoff |
| 9 | Mobile QA, deploy, five verified calls | 60 min | Public URL green |
| — | **Feature freeze** | **19:00 IST** | Nothing new after this |

**If you are behind at 15:00, cut in this order: step 8 first, then step 7.**

Do **not** cut step 6. The question box is what answers *"how is AI actually used in the product"*, which was the mentors' most repeated point across every session we heard about. One third-party supplier lookup is worth far less to our score than that. Steps 1 to 6 alone are a complete, demoable, differentiated feature.

Ship the smaller thing working rather than the bigger thing half-working — *every feature you demo must work* is a hard rule in the brief.

---

## 9. Acceptance criteria

- [ ] `npm test` green, including the new scoring test. Existing 40 tests still pass, unmodified.
- [ ] `npm run build` green.
- [ ] The new screen is reachable from the existing journey and walkable on a phone in under 60 seconds.
- [ ] With `OPENAI_API_KEY` **unset**, the screen still renders every number and category correctly.
- [ ] The two non-risk rows are visibly shown as *not* needing action.
- [ ] Every screen keeps the existing synthetic-data disclosure.
- [ ] The live API path is cached and does not fail the page when the provider is down.
- [ ] `STATUS.md` updated: correct deadline, what's real, what's mocked.

---

## 10. Things not to do

1. **Do not claim the credit figure in the monthly return is now locked.** Liability locking is confirmed (Jul 2025). ITC locking was announced Oct 2024, postponed Jan 2025, and I could not find a government advisory switching it on — the "July 2026" claim traces only to social posts. Say the system is *moving* that way. A judge who knows GST will catch an overclaim, and Honesty is one of the six criteria.
2. **Do not claim nobody else does AI mismatch explanation.** ProfitPulse GST Pro already ships deterministic matching plus AI plain-language cause attribution. Our defensible claim is narrower and true: they sell to the accountant, in English, and the journey ends with the accountant emailing the owner a PDF. We are built for the person whose name is on the notice, in their language.
3. **Do not touch `reconcile.ts` or `src/contracts/**`.** See §2.
4. **Do not scrape gst.gov.in.** See §6.
5. **Do not add a second new screen.** One screen. The brief rewards a working journey, not feature breadth.

---

## 11. Files shipping with this spec

| File | Status |
|---|---|
| `round2-domain-layer.patch` | **Apply this first.** The four files below, in one command. |
| `prototype/src/contracts/riskAssessment.ts` | Written, typechecks |
| `prototype/src/domain/assessRisk.ts` | Written, typechecks, 18 tests |
| `prototype/src/data/riskCase.ts` | Written, generated from the fixture |
| `prototype/tests/assess-risk.test.ts` | **58/58 passing in a clone of this repo** |
| `prototype/scripts/generate-risk-fixture.mjs` | Regenerates the data if the scenario changes |
| `fixtures/` | Already generated. You do not need to run anything to get data. |
| `scripts/assess-risk.mjs` | Reference JS version, kept for readability |

Verified in a clone of this repo at commit time: `npm test` 58 passed, `npm run build` clean.

To change the scenario: edit the `SCENARIO` array in `generate-risk-fixture.mjs`, rerun it, and update `riskCase.ts` plus the `ANSWER_KEY` constant in the test. Everything else follows.
