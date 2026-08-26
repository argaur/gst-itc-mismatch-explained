---
name: brief-judging-criteria
description: Full section-by-section extraction of buildwhatmovesindia.com/brief, the 6-criterion judging rubric, submission mechanics, and PRD gaps found against it (2026-08-26 live fetch)
metadata:
  type: project
---

Live brief page (fetched 2026-08-26) has exactly 8 sections: The challenge, What to build, A strong build, What not to do, What to submit, How builds are judged, What happens next, Prizes.

**Why:** This is the ranking rubric for the hackathon. Every PRD and prototype decision should trace back to one of the 6 judging criteria below, or it is a cut candidate.

**How to apply:** Use this as the checklist to validate PRD.md and the eventual [[codex-handoff-workflow]] context file against, before Aug 28 8PM IST submission and again before the Sep 7 resubmission.

## What to build (defines WHAT, not judged directly)
- One clearly defined problem, ideally personally faced by the team.
- A complete citizen journey, start to finish, that actually runs (a static design fails).
- Simpler and clearer than the current experience.
- Built for mobile, slow connections, and low digital experience.
- Mock/synthetic data anywhere real data would be unsafe (Aadhaar, PAN, OTP, payment, health info).
- Codex or an OpenAI model must be a **meaningful part of the build**, not added only for the submission. Hard eligibility requirement, not optional.
- Reviewers test the **citizen experience, not an admin panel**. Any state-machine or ops view in the solution must render inside the citizen's own journey, not as a separate dashboard.

## The 6 judging criteria (this is the actual rubric)
1. Problem: is it real and important, is who-faces-it and what's-hard-today obvious.
2. Working build: does the main journey actually run end to end.
3. Usability: simpler, clearer, more accessible than the incumbent.
4. Product thinking: are the choices thoughtful and explained.
5. End-to-end thinking: does it address backend, infrastructure, and process, not just the screen.
6. Honesty: is mocked vs. working data clearly disclosed.

No criterion rewards visual polish alone, market sizing, or feature breadth.

## Submission mechanics
- Deadline Aug 28 2026, 8:00 PM IST, no grace period.
- Live public link, opens with no access request, no app download. Include mock login credentials if the build requires them.
- One video, max 2 minutes: minute 1 is a citizen demo, minute 2 is how/why it was built.
- Project summary under 250 words.
- Both teammates register and cross-list each other's registered email. Same email used at every stage (Aug 28 submit, Sep 1 shortlist, Sep 7 resubmit).
- Two-round process: shortlist of 250 by Sep 1, one week of mentorship, resubmit improved build by Sep 7, top 10 finalists Sep 8-12, finale in Bengaluru Sep 12.

## PRD gaps found against this (as of 2026-08-26, before the rethink)
No Codex/OpenAI-model plan in PRD.md, no citizen-journey definition, no mock/real boundary table, no mobile/low-bandwidth constraints stated, no scale-safety answer, no deliverables/definition-of-done section, no sharp "why better than incumbent" line, admin-panel risk in the state-machine solution framing, no round-1/round-2 scope split, missing 4 of 8 "what not to do" rules (no official-product presentation, no government logos implying approval, no recycled project, no unlicensed assets).

## One live tension, not fully resolved
CLAUDE.md's headline claims the brief "narrowed to 10 named platforms." The live brief page itself still says "IRCTC, EPFO and the Income Tax portal are examples, not a fixed list" — no fixed 10-platform list appears on the live page. The 10-platform framing comes from Varun Mayya's video graphic, not the brief/FAQ. CLAUDE.md's own later paragraph already carries this nuance correctly. Practical effect: staying on Cyber Crime + CPGRAMS is safe either way (it's on the video's list), but the team is not formally locked out of an off-list idea if a stronger one appears during the rethink.
