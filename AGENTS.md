# AGENTS.md — Build What Moves India

You are Codex, building the prototype for this hackathon submission. Read `PROJECT_CONTEXT.md` and `STATUS.md` before writing any code. `STATUS.md` is the current source of truth for what is decided and what is still open. If `STATUS.md` says a decision is still pending, do not guess it, ask.

Deadline: **August 28, 2026, 8:00 PM IST. No grace period.**

## Hard rules (from the official brief, do not break these)

1. Do not try to access, test, or interfere with any live government system.
2. Do not reverse-engineer private systems or use undocumented private APIs.
3. Do not scrape personal or restricted information.
4. Do not use real Aadhaar numbers, PAN details, passwords, OTPs, payment details, health information, or other sensitive data anywhere. Mock and synthetic data only.
5. Do not present the prototype as an official government product.
6. Do not use government logos in any way that suggests approval or partnership.
7. This is a new build, not an old project with small changes.
8. Do not include code, assets, or data you do not have permission to use.

## What "done" means (the 6 judging criteria)

Every feature you build should trace back to one of these. If it doesn't, it's a cut candidate, not a nice-to-have.

1. **Problem** — is it obvious who faces this problem and what's hard about it today.
2. **Working build** — does the main journey actually run, start to finish. A static screen fails this.
3. **Usability** — is it simpler, clearer, and more accessible than the current experience.
4. **Product thinking** — are the choices thoughtful and explained, not arbitrary.
5. **End-to-end thinking** — does the build address backend, infrastructure, and process, not just the screen. This is the criterion most builds fail.
6. **Honesty** — is what's mocked and what's real clearly disclosed, in the product and in the demo.

No criterion rewards visual polish alone, business projections, or feature breadth. Do not build things that only serve those.

## Build requirements

- Codex or an OpenAI model must be a **meaningful part of how this is built**, not added only for the submission. This is a hard eligibility rule, not a style choice. Wherever the product itself uses an LLM (drafting a legal document, interpreting a citizen's plain-language input, etc.), that should be a real model call, not a hardcoded template pretending to be one.
- The reviewer tests the **citizen-facing experience**, not an admin panel. Any tracking, status, or workflow-state view belongs inside the citizen's own journey (their own case timeline), never as a separate ops dashboard.
- Build for **mobile-first**, slower connections, and users with limited digital experience. Plain language over jargon. Large touch targets (44px minimum). Under 2 seconds to first meaningful content where feasible.
- Dark mode: verify as actually rendered if you build it, not just present in CSS. Optional for the hackathon, but if you add it, make it real.
- Use mock or synthetic data anywhere personal information, payments, OTPs, or government systems would normally be involved. Never real.
- The main citizen journey must be genuinely walkable start to finish, in under 60 seconds, because minute 1 of the demo video is a live citizen demo of exactly this.
- Keep a running note (in code comments only where the WHY is non-obvious, and in your own working notes) of what's real vs. what's mocked. This directly feeds the Honesty criterion and the required disclosure in the demo and summary.

## Deliverables this build must produce

1. A live public link that opens in a browser with no access request and no app download. If there's a login step, mock credentials must be documented and ready.
2. A 2-minute demo video: minute 1 is the citizen journey live, minute 2 is how and why it was built.
3. A project summary under 250 words.
Full detail on all four in `PROJECT_CONTEXT.md` under Submission Mechanics.

## Quality bar (standing, not hackathon-specific)

Correct, Simple, Maintainable, Fast, Elegant, in that priority order. No placeholder scaffolds (`# TODO`, bare `pass`, stub functions) left behind. No silent `except`/`except Exception: pass` — surface errors. Don't guess IDs, API details, or config against live systems, find ground truth first.

## If you're unsure

If a decision depends on something not yet locked (which platform, which exact legal citation, which flow variant), check `STATUS.md` first. If it's still open there, stop and ask rather than guessing. Guessing here is expensive: the deadline doesn't move, and a wrong guess costs a rebuild we don't have time for.
