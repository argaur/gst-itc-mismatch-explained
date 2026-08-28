# STATUS.md — Build What Moves India

Living doc. Update this as work progresses, whether you're Codex or Gaurav. This is the file Claude reads first if pulled back in for guidance, instead of the full `memory/` folder. Keep it current, keep it short.

**Last updated:** 2026-08-28, by Codex, after the Stage 0/1 foundation and deterministic-domain gate passed.

## Current state in one line

Stages 0–3 are complete: the ₹30 lakh fixture, exhaustive reconciliation, shared explanation contracts, portal-native UI, grounded server-side OpenAI path, 40 tests, and production build are green. Integration/release QA is now the gate.

## What's decided

- Team: Kriti + Gaurav, 2-person team, submitting separately from Harshit + Varun Malani.
- Harshit's team is building on EPFO. No overlap risk with this team's direction.
- Deadline: Aug 28, 2026, 8:00 PM IST, no grace period. Round 2 resubmission Sep 7, 2026.
- Hard rules and judging criteria: locked, see `AGENTS.md` and `PROJECT_CONTEXT.md`. These came from a live re-fetch of the brief on 2026-08-26 and are not expected to change.
- Codex plan: Gaurav is upgrading from ChatGPT Go to Plus for this build, to get full model access and a workable usage floor during the sprint. Watch the 5-hour rolling usage limit reintroduced on Plus starting Aug 26, 2026, and pace sessions accordingly.
- From 2026-08-26 on: Codex builds, Claude plans. This 3-file structure (`AGENTS.md`, `PROJECT_CONTEXT.md`, `STATUS.md`) is the handoff mechanism.
- A shareable four-tab decision brief exists in `index.html`: decision analysis, documented primary/secondary GST research, working PRD, and a high-level implementation plan (kept last). Its approval labels reflect the pre-2026-08-27 review state; root `PRD.md` and this file now carry the current decision state.
- `GST_WIREFRAME.html` is a standalone, clickable comparison wireframe with two top-level tabs: the documented existing GST Portal DRC-01C workflow and the proposed four-step citizen journey. It uses the same synthetic case across both views and is for team understanding and decision-making only; creating it did not approve the direction or start the production prototype.
- `IMPLEMENTATION_PLAN.md` is the approved deadline-day agent plan. It assigns exclusive file ownership, model/effort by stage, test-first gates, integration order, cuts, and a 7:00 PM feature freeze.
- Hosting split is locked: deploy only the standalone `index.html` teammate-review page to Netlify; use Vercel for the eventual prototype portal and OpenAI server function. The detailed Markdown plan stays in the repository for now.
- Gaurav has approved the GST DRC-01C notice-decoder direction: one aggregate GSTR-3B-versus-GSTR-2B mismatch traced through a purchase/claim workpaper to source records, with deterministic matching and arithmetic plus a constrained OpenAI explanation/drafting layer.
- Gaurav approved the final flow on 2026-08-28. The solution authority is `GST-ITC Mismatch Solution PRD.docx`; `IMPLEMENTATION_PLAN.md` is now the deadline-day agent orchestration plan.
- The approved demo case is implemented locally: ₹1.50 crore claimed ITC versus ₹1.20 crore available ITC, with a ₹30 lakh difference explained by ₹18.40 lakh later-period evidence and ₹11.60 lakh possible duplicate.
- The visual direction is GST Portal interaction grammar without official identity, government logos, copied assets, or affiliation claims. ClearTax is the primary reconciliation benchmark and Speqta/ICAI is secondary.
- Root `PRD.md` preserves the sealed 2026-08-27 problem and mechanism. The final 2026-08-28 solution and flow authority is `GST-ITC Mismatch Solution PRD.docx`.
- The former Cyber Crime PRD has been preserved at `Documentation/archive/PRD-cybercrime.md` as unsealed discovery; it is no longer the active root PRD.
- The prototype app lives in `prototype/` so the existing root `index.html` decision brief remains intact. The app follows the planned `src/data`, `src/domain`, `src/components`, `src/views`, and `tests` layout and deploys that directory as the Vercel project root.
- The public URL https://prototype-blue-three.vercel.app now serves the Stage 0–3 build. The page returns HTTP 200 and the production `/api/explain` path has returned a grounded structured explanation using the configured OpenAI key. The deterministic evidence path remains usable on every failure.
- Public repository: https://github.com/argaur/gst-itc-mismatch-explained
- `prototype/src/contracts/**` is frozen for the next agents. The current UI remains buildable through deprecated `Finding.type` and `matchedPurchaseRowIds` bridges; the UI agent must migrate to `category` and format `2026-04` as `April 2026`.
- Stage 0/1 verification: `npm test -- --run` passes 20/20 tests; `npm run build` passes; no dependency or package-manifest change was needed.
- The deployed four-view shell intentionally contains no OpenAI integration, print styles, final visual design, or cut-list features. The explanation and draft-response stages are visibly marked as deferred rather than simulated.

## What's open

- **Qualified-practitioner review remains open but does not block engineering.** It gates the final citizen-facing cause labels and neutral Part B wording. If unavailable by early afternoon, keep labels evidentiary, remove legal conclusions, and disclose the lack of professional validation.
- The corpus still has no structured interview with a DRC-01C recipient. Do not claim prevalence, interview validation, or tax/legal correctness beyond cited public sources.
- **Fixed locally:** Stage 0/1 has 20 passing domain/contract tests and a green production build. The deployed shell has not yet been updated with these changes.
- The Cyber Crime + CPGRAMS discovery PRD is archived at `Documentation/archive/PRD-cybercrime.md`. Do not implement it or treat it as active unless the team explicitly returns to it.
- 11 older platform-walkthrough gaps from 2026-08-25 remain open in the research corpus (see `memory/session-2026-08-25.md` if this project ever needs to revisit them, low priority given the rethink).

## Next up

1. Run rendered mobile/print QA and inspect the integrated happy/failure paths.
2. Deploy the Vercel prototype, configure `OPENAI_API_KEY` (and optional `OPENAI_MODEL`), and verify five grounded calls.
3. Prepare the demo script, project summary, and submission checklist.
2. UI agent must consume `category`/`recordClassifications`, format ISO periods, replace the rounded-card shell with GST Portal interaction grammar, and add Part B/print without submission controls.
3. API agent must add strict runtime validation around the frozen contracts, use only the allow-listed demo case, keep the key server-side, and implement typed success/failure including `rate_limited`.
4. After both handoffs, integrate, deploy, run critical QA, and freeze feature development by 7:00 PM IST.
5. Get one qualified GST practitioner to sanity-check the evidence labels and neutral Part B wording before video/copy freeze when possible.

Full context for the existing-vs-proposed comparison wireframe is saved in `memory/session-2026-08-26-7.md`. The four-tab GST research work is in `memory/session-2026-08-26-8.md`. The PRD seal, plan reconciliation, Block 1 implementation, deployment verification, and session-stop boundary are in `memory/session-2026-08-27.md`. All are indexed from `memory/MEMORY.md`.

## Open question

Can a qualified GST practitioner review the synthetic labels and neutral wording before final video recording? Engineering proceeds safely either way under the fallback in the approved plan.
