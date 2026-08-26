# PROJECT_CONTEXT.md — Build What Moves India

Background Codex needs but won't rediscover on its own. Read this once at the start of a build session, then work from `AGENTS.md` and `STATUS.md`.

## What this is

Hackathon submission for "Build What Moves India," run by Varun Mayya, backed by OpenAI. Site: https://buildwhatmovesindia.com/

The brief: pick one real problem on an Indian public-service website or digital service and build a simpler, clearer, more useful way to solve it. Must be built with Codex or an OpenAI model, and must address the backend/process, not just redesign the screen.

## Team

**Kriti + Gaurav**, a 2-person team. Both must register on the submission form and each list the other's registered email. The same email must be used at every stage (Aug 28 submission, Sep 1 shortlist result, Sep 7 resubmission).

Related team, separate submission: Harshit + Varun Malani (a different person from Varun Mayya, the hackathon organizer). **Harshit's team is building on EPFO** — confirmed 2026-08-26, this was previously an open overlap risk with this team's cyber-crime direction and is now resolved.

## Deadline and process

- **Round 1 deadline: August 28, 2026, 8:00 PM IST. No grace period.**
- Round 1 shortlist of 250 announced by Sep 1, 2026.
- Shortlisted teams get one week of mentorship (a WhatsApp group with 5 mentors from engineering, tech, and OpenAI).
- **Round 2 resubmission: September 7, 2026**, same format, same registered email.
- Top 10 finalists announced Sep 8-12. Finale in Bengaluru, Sep 12, 2026 (filmed, not livestreamed).

Practical implication: the Aug 28 build only has to clear the top-250 bar. It does not need to be finished-quality. Round 2 is where it gets polished, with mentor input.

## The brief, extracted (live page fetched 2026-08-26)

The live brief page has 8 sections: The challenge, What to build, A strong build, What not to do, What to submit, How builds are judged, What happens next, Prizes.

### The challenge
Pick one real problem, ideally one the team has personally faced, on an Indian public-service website or digital service. Verbatim from the live page: "IRCTC, EPFO and the Income Tax portal are examples, not a fixed list." There is no fixed platform list on the live brief/FAQ pages. A 10-platform list (IRCTC, Income Tax e-Filing, CPGRAMS, GST Portal, EPFO, MCA Portal, National Cyber Crime Reporting Portal, UMANG, Parivahan Sewa, RTI Online) appears in Varun Mayya's own explainer video graphic, and the team's chosen platform (National Cyber Crime Reporting Portal / CPGRAMS) is on that list, so this is not a live risk, just worth knowing the live brief itself does not enforce it.

### What to build
- A prototype where Codex or an OpenAI model is a meaningful part of the build, not added only for the submission.
- A complete citizen journey solving one clearly defined problem, start to finish.
- Mock data, accounts, and backend behavior wherever production access would be unsafe or unavailable.
- Reviewers test the citizen experience, not an admin panel.
- Designed for real Indian users: mobile devices, slower connections, limited digital experience.

### What a strong build looks like
A strong submission makes these obvious:
1. Who is facing the problem.
2. What is difficult about the current experience.
3. What was changed.
4. Why the new version is better.
5. What works today, and what is still mocked.
6. How the idea could work safely at a larger scale.
Plus: the interface and interactions must actually run start to finish. A static design is not enough.

### What not to do
See `AGENTS.md` hard rules 1-8. Same list, kept there since Codex reads that file automatically.

### What to submit
1. A live public link, opens in browser, no access request, no app download. Mock login credentials included if the build needs them.
2. A video, max 2 minutes: minute 1 is a citizen demo, minute 2 is how and why it was built. Both teammates may present.
3. A project summary under 250 words.
4. Registration: both teammates registered, each listing the other's registered email.

### How builds are judged (the actual rubric)
See `AGENTS.md` "What done means" section. Same 6 criteria, kept there for Codex's convenience.

### What happens next
Two-stage process described above under Deadline and process.

### Prizes
Top 10: a year of Codex Pro plus a Codex Micro. Top 3: a MacBook. Winner: a trip to San Francisco (visa permitting), plus everything above. No product-design implication, informational only.

## Problem direction — STATUS AS OF 2026-08-26: PENDING RETHINK

The team spent through 2026-08-26 drafting a PRD around a Cyber Crime Reporting Portal problem: helping an innocent recipient in a fraud chain get their wrongfully frozen bank account released, since the government's freeze pipeline is fast and automated but the release side barely exists. Full detail: `PRD.md` (Part A only, unsealed), `Documentation/research/NARROWED_CANDIDATES.md`, `Documentation/research/PROBLEM_SPACE.md`.

**Gaurav flagged the whole approach for reconsideration at the end of that session and said he has different ideas to bring next session.** Do not build against the Cyber Crime direction, or any specific solution shape, until `STATUS.md` confirms a locked problem statement. If `STATUS.md` still shows this as open, stop and ask before writing product code.

## Research and prior work (reference only, do not treat as locked)

- `PRD.md` — working PRD, Part A (problem) drafted, Part B (solution) and Part C (execution) intentionally not drafted.
- `Documentation/research/PRD_STATE.md` — stage-by-stage progress log for the PRD process.
- `Documentation/research/SECONDARY_RESEARCH.md`, `research/CyberCrime.md`, `research/primary/CyberCrime-primary.md` — fact-checked secondary and primary research on the cyber-crime freeze problem, Firecrawl-verified 2026-08-26.
- `Documentation/research/NARROWED_CANDIDATES.md` — three narrowed problem candidates, not yet picked by Gaurav.
- `research/` — secondary research on all 10 platforms named in the video's platform list.
- `artifact/` — published comparison artifact, "Ten Portals, Ten Failures."

## Judging-criteria checklist (use this to sanity-check scope before building anything)

- [ ] One clearly defined problem, not several bundled together.
- [ ] A citizen journey that runs start to finish, not a static mockup.
- [ ] Simpler and clearer than the real incumbent experience (name the incumbent, be specific).
- [ ] Backend/process addressed, not just the screen (this is the criterion most builds fail).
- [ ] Mock vs. real clearly labeled somewhere the reviewer will see it.
- [ ] Codex/OpenAI model used meaningfully in the product, not just to write the code.
- [ ] Mobile-first, works on a slow connection, plain language throughout.
- [ ] No live government system touched, no real PII anywhere, no government logos implying approval.
