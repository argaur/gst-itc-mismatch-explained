# Codex prompts — GST build, four stages

How to use this file: paste one stage's prompt block into Codex at the right time. Do not paste ahead of where the project actually is. Each stage tells you what to check before running it.

Direction status: Gaurav has reviewed `index.html` and `GST_WIREFRAME.html` and approves the DRC-01C notice-decoder direction. Kriti has not yet confirmed the exact flow. The problem statement and deterministic/OpenAI responsibility boundary are sealed; the citizen journey remains provisional until the decision from the 2026-08-27 call is reported.

Execution status at the end of the 2026-08-27 session: Stages 1–3 are complete. `PRD.md` is sealed, `IMPLEMENTATION_PLAN.md` is reconciled, and the tested Block 1 flow-review skeleton is public at https://prototype-blue-three.vercel.app. **Do not run Stage 4 or continue the full build until Gaurav explicitly reports the confirmed flow decision.**

---

## Stage 1 — Seal the PRD

**Run this now.**

Read first, in this order: `AGENTS.md`, `PROJECT_CONTEXT.md`, `STATUS.md`, `Documentation/process/PRD_QUALITY_BAR.md`, `index.html` (all four tabs), `GST_WIREFRAME.html`, `IMPLEMENTATION_PLAN.md`.

---

We are sealing the GST direction into a real `PRD.md`. Gaurav has approved the DRC-01C notice-decoder direction shown in `index.html`. Kriti has not yet confirmed, and Gaurav and Kriti may adjust the exact citizen-journey flow tonight. Do not treat the flow in `index.html` and `IMPLEMENTATION_PLAN.md` as final, treat the problem statement and the underlying mechanism (DRC-01C, GSTR-3B vs GSTR-2B, deterministic reconciliation plus a constrained OpenAI explanation layer) as approved.

The current `PRD.md` describes an archived Cyber Crime problem. Rename or move it to `Documentation/archive/PRD-cybercrime.md` first, do not overwrite it silently. Then write a new root `PRD.md` for GST.

Follow the structure and tag conventions in `Documentation/process/PRD_QUALITY_BAR.md` exactly. Source the content from `index.html`'s four tabs and `IMPLEMENTATION_PLAN.md`, do not re-derive it from scratch, but do rewrite it into the PRD's Part A / Part B / Part C shape with confidence tags on every claim.

Specific instructions:
- **Part A (WHY):** the problem is the notice-to-source-record gap (a small trader receives a DRC-01C aggregate mismatch notice and has no way to see which transaction caused it). Target user needs a structural condition, not demographics: a GSTIN holder who reconciles their own returns without a retained CA or paid reconciliation software, and only learns of a problem when a notice with a fixed response deadline lands. Pull evidence from `index.html` tabs 1 and 2 and from `research/GST - Secondary.md`.
- **Part B (HOW):** describe the four-view citizen journey from `IMPLEMENTATION_PLAN.md` section 6 as the working design, but add a line stating explicitly: "This flow is the working design as of [date]. Gaurav and Kriti are confirming or adjusting it before Block 2 build work starts; this section will be updated in place, not re-sealed, once that happens." Include the deterministic-core-vs-model responsibility split from section 5 and section 7, since that boundary is not expected to change even if the view sequence does.
- **Part C (Execution):** deliverables and definition of done from `IMPLEMENTATION_PLAN.md` sections 11 and 12. Round-1 vs round-2 scope split from section 3.
- Close all 10 judging-criteria gaps listed in `Documentation/process/PRD_QUALITY_BAR.md`, each in the section where it's actually load-bearing.
- Run the 5 exit checks from `Documentation/process/PRD_QUALITY_BAR.md` against your draft before sealing. Output the check table. If NOT READY, fix the failures before sealing, do not seal with known failures.
- Seal with a Provenance block (see `Documentation/process/PRD_QUALITY_BAR.md` for the structure convention) noting the source files and that the flow section is provisional.

Update `STATUS.md`: record that `PRD.md` is now sealed for GST, and that the flow confirmation with Kriti is the next blocking item, not the problem statement.

**Stop and report the exit-check table to Gaurav before moving to Stage 2.**

---

## Stage 2 — Finalize the implementation plan

**Run this after Stage 1's PRD is sealed and Gaurav has confirmed the exit checks pass.**

---

`PRD.md` is now sealed for GST. `IMPLEMENTATION_PLAN.md` already exists and is thorough, your job is to reconcile it against the sealed PRD, not rewrite it from nothing.

Read `PRD.md` (the new GST version), `IMPLEMENTATION_PLAN.md`, and `Documentation/process/PRD_QUALITY_BAR.md`.

Do this:
- Update every cross-reference in `IMPLEMENTATION_PLAN.md` that pointed at `index.html` as the source PRD to point at `PRD.md` instead.
- Confirm Gate A in `IMPLEMENTATION_PLAN.md` section 2 reflects reality: Gaurav has approved, Kriti's confirmation and the flow-tweak conversation are open, tonight. Do not check that box until it is genuinely true.
- Explicitly separate, in a short new subsection near section 5, what is flow-agnostic (the deterministic domain core: fixtures, `reconcile.ts`, the OpenAI request/response contract, the data model) from what is flow-specific (the exact 4-view sequence and its copy). State plainly: "Block 1 work below does not depend on tonight's flow decision and can start immediately. Block 2 view-building work should wait for flow confirmation, or be built against the current 4-view design with the expectation that view order or count may change."
- Confirm the plan still closes all 10 judging-criteria gaps from `Documentation/process/PRD_QUALITY_BAR.md`. Note any gap the plan does not yet cover explicitly.
- Do not change the P0/P1/cut-list scope decisions in section 3 unless something in the sealed PRD directly contradicts them, if so, flag the contradiction to Gaurav rather than resolving it yourself.

Update `STATUS.md` with the reconciled state.

**Stop and report back before moving to Stage 3. Do not start writing application code yet.**

---

## Stage 3 — Scaffold the project

**Run this once Gaurav gives the go-ahead after Stage 2. This can run before tonight's flow call, on purpose, so Kriti and Gaurav have something clickable to react to instead of deciding in the abstract.**

---

Scaffold the prototype per `IMPLEMENTATION_PLAN.md` section 5 (stack: React, Vite, TypeScript, Vitest, Vercel). Follow the file layout in that section.

Build only Block 1 from `IMPLEMENTATION_PLAN.md` section 8, plus a minimal navigable shell for Block 2:
- Typed fixtures and `reconcile.ts` per section 4, with the exact invariants listed there (₹18,400 + ₹3,200 = ₹21,600, the two finding types, the `DEMO-` identifier prefix rule).
- Focused rules tests per section 9's automated P0 list, for the domain core only.
- A bare, unstyled or minimally styled shell for the 4 views in section 6, each showing real fixture data through `reconcile()`, but with placeholder or minimal treatment of copy and visual design. The goal is something Kriti and Gaurav can click through tonight to react to the flow, not a finished build.
- Deploy this shell to Vercel so it has a public URL, per section 8 Block 1's exit criterion. Do not implement the OpenAI call yet, that is Block 3, Stage 4.

Do not build: the OpenAI integration, print styles, final visual design, or anything in the "cut first" list in section 3. If you're unsure whether something belongs in this stage, it doesn't, leave it out and note it as deferred to Stage 4.

Update `STATUS.md` with the deployed URL and a one-line note that this is a flow-review skeleton, not a submission candidate.

**Stop here. Report the URL to Gaurav. Do not proceed to full build until he confirms the flow decision from tonight's call.**

---

## Stage 4 — Complete the build

**Do not run this until Gaurav tells you the flow is confirmed after tonight's call with Kriti. If the flow changed from what's in `IMPLEMENTATION_PLAN.md` section 6, Gaurav will describe the change when he gives you this prompt, fill it in below before pasting.**

---

Kriti and Gaurav confirmed the citizen-journey flow tonight. [Gaurav fills in: "no change from IMPLEMENTATION_PLAN.md section 6" OR a description of what changed.]

If the flow changed: update `PRD.md` Part B and `IMPLEMENTATION_PLAN.md` section 6 to reflect the final decision before writing any more application code. Remove the "provisional" language from `PRD.md` Part B once updated.

Then complete the build on top of the Stage 3 scaffold, following `IMPLEMENTATION_PLAN.md` Blocks 2 through 4 in section 8:
- Block 2: full views with real copy, disclosures, keyboard navigation, print styles.
- Block 3: the real OpenAI Responses API call per section 7, with the exact guardrails listed there (strict schema, validate every finding/evidence ID against server-supplied input, `store: false`, capped output, typed error states, no hardcoded copy labeled as AI).
- Block 4: run the full QA matrix in section 9, rehearse and record the 60-second route, finish the under-250-word summary per section 11.

Before declaring done, run through `Documentation/process/PRD_QUALITY_BAR.md`'s 10 judging-criteria gaps and the definition of done in `IMPLEMENTATION_PLAN.md` section 12, and report each as met or not met. Do not report the build as submission-ready with an unmet item, list it instead.

Update `STATUS.md` to reflect final state: public link, video status, summary status, and any open item blocking submission.
