# PRD quality bar and exit checks

Reference file for Codex. `CODEX_PROMPTS.md` points here instead of repeating this content in every prompt. Read this in full before drafting or sealing any part of `PRD.md`.

## PRD structure to match

`PRD.md` (even in its archived Cyber Crime form) has a fixed shape. Copy the shape, not the content.

- Header block: DRI/Pod, Status, Created/Last Updated, Figma, ERD, Analytics.
- Document lineage line, listing every file the PRD depends on.
- Changelog table: Change | Date | People | Comments/link.
- **Part A, WHY (Problem Alignment):** the problem, real user scenario, evidence table, why now, target user with a structural condition (not demographics alone).
- **Part B, HOW (Solution):** the actual product design, tradeoffs, what was rejected and why.
- **Part C, Execution:** deliverables, scope split, definition of done.

## Confidence tags

Every factual or projected claim carries one tag:
- `[S]` — sourced, a citation backs it.
- `[H]` — hypothesis, not yet verified.
- `[P]` — primary evidence, a real quotable line exists in `PRIMARY_RESEARCH.md` for it. Never use `[P]` without that line existing.
- `[X]` — explicitly disconfirmed or ruled out.

If every tag in a document is `[H]`, that is a discovery gap, not a documentation gap. Say so directly rather than sealing anyway.

## The 5 exit checks (run before sealing any PRD section, report all 5 even if some pass)

Report format: a table with columns Check | Result | Location | Fix owner. End with one line: READY (all 5 pass) or NOT READY (N failures, listed in priority order, ICP failure first). Never soften a failure into "mostly ready."

1. **Confidence-tag coverage.** Every row in a Success Criteria, Evidence, or Key Assumptions table needs a tag. Quote every untagged claim.
2. **Vague-metric scan.** Any sentence meant to be a measurable commitment (goal, success criterion, metric, target, KPI, guardrail, kill signal) that carries no number. Judge by what the sentence does, not by which heading it's under. "Improve trust" fails. "70% of test users correctly identify the notice's cause within 60 seconds" passes.
3. **ICP structural-condition test.** The target-user section fails if it defines the user by demographics alone (age, role, geography) with no structural condition, the behavior or constraint that actually makes them a distinct segment. Then confirm five fields are each identifiable: Job (what they're trying to get done), Trigger, Context, Current workaround, Switching cost. Name every field that's missing or a placeholder.
4. **Kill signal.** Every primary metric needs the number at which the team stops and diagnoses, not just a target to hit.
5. **Two-n rule.** Any rate metric (a percentage, a conversion rate) needs two n's named: an early kill-switch n and a real-read floor n. A rate naming no n, or only one, fails.

## The 10 judging-criteria gaps to close (from `memory/brief-judging-criteria.md`)

Every PRD, plan, or build must address all 10, each placed where it's actually load-bearing, not bolted on as an afterthought section.

1. Codex/OpenAI usage plan that is functionally central to the product, not decorative. Wherever the product interprets a notice, drafts a response, or explains something in plain language, that must be a real model call.
2. Explicit end-to-end citizen journey, start to finish, walkable in under 60 seconds.
3. Mock-vs-real data boundary table: what's synthetic, what would be real in production, stated plainly.
4. Mobile, low-bandwidth, low-digital-literacy constraints stated as design requirements, not aspirations.
5. Scale-safety statement: what happens at scale, at zero users, under malicious or malformed input.
6. Deliverables and definition-of-done, mapped to what "What to submit" on the hackathon brief actually requires.
7. One sharp, specific line on why this beats the current GST portal experience. Not "it's simpler." Name the exact thing that's fixed.
8. Design note: every diagnostic or reasoning output renders inside the citizen's own journey (their own case view), never as a separate admin or ops dashboard.
9. Round-1 (Aug 28 submission) versus round-2 (Sep 7 resubmission) scope split, stated explicitly, not implied.
10. Four constraints stated directly: no official-product presentation, no government logos implying approval, not a recycled prior project, no unlicensed assets.

## Hard rules, apply everywhere, every stage

No live government systems touched or tested against. No undocumented private APIs. No scraping of personal or restricted information. No real Aadhaar, PAN, passwords, OTPs, payment details, or health information anywhere, mock and synthetic data only. No presenting the prototype as an official government product. No government logos implying approval or partnership. This is a new build, not an old project with small changes. No code, assets, or data without permission to use them.
