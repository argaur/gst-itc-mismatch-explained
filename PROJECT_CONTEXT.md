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
Pick one real problem, ideally one the team has personally faced, on an Indian public-service website or digital service. Verbatim from the live page: "IRCTC, EPFO and the Income Tax portal are examples, not a fixed list." There is no fixed platform list on the live brief/FAQ pages. A 10-platform list (IRCTC, Income Tax e-Filing, CPGRAMS, GST Portal, EPFO, MCA Portal, National Cyber Crime Reporting Portal, UMANG, Parivahan Sewa, RTI Online) appears in Varun Mayya's own explainer video graphic, and the team's chosen platform (GST Portal) is on that list, so this is not a live risk, just worth knowing the live brief itself does not enforce it.

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

## Approved problem direction — STATUS AS OF 2026-08-27

Gaurav approved the GST Portal DRC-01C notice-decoder direction and sealed it in root `PRD.md`: a GSTIN holder who self-reconciles without a retained CA or paid reconciliation product receives an aggregate mismatch between ITC claimed in GSTR-3B and ITC available in GSTR-2B, but cannot see which purchase/claim records caused it.

The final solution was approved on 2026-08-28: deterministic code owns the GSTR-3B summary → purchase/claim workpaper → current and later-period GSTR-2B reconciliation, while a constrained OpenAI layer explains only validated findings and drafts neutral text for professional review. The approved flow is Part A — Existing → Explanation and Source Reconciliation — New → Part B — Existing. Implementation is unblocked under `GST-ITC Mismatch Solution PRD.docx` and `IMPLEMENTATION_PLAN.md`.

The original Block-1 shell is public at https://prototype-blue-three.vercel.app and remains a review skeleton, not a submission candidate. Local Stage 0/1 is now complete: the approved ₹30 lakh fixture, four-category record classification, frozen UI/API contracts, 20 focused tests, and the production build are green. The public URL has not yet been redeployed; the next session builds the portal-native UI and real OpenAI path in parallel before integration.

## Active product and research files

- `PRD.md` — sealed GST problem/mechanism record from 2026-08-27. The final solution and flow authority is `GST-ITC Mismatch Solution PRD.docx`.
- `IMPLEMENTATION_PLAN.md` — approved deadline-day agent orchestration plan. Implementation is unblocked; only the qualified-practitioner wording review remains external.
- `prototype/` — React + Vite + TypeScript + Vitest application deployed to Vercel. The root `index.html` is deliberately not the Vite entry point.
- `index.html` — four-tab teammate decision/research/working-PRD/plan brief. Its pre-approval labels are historical; `PRD.md` and `STATUS.md` are authoritative.
- `GST_WIREFRAME.html` — existing-versus-proposed DRC-01C comparison used for flow discussion.
- `research/GST - Secondary.md` and `research/primary/GST-primary.md` — GST research corpus and evidence boundaries.
- `Documentation/archive/PRD-cybercrime.md` — preserved, unsealed Cyber Crime discovery PRD. It is not active and must not be implemented unless the team explicitly returns to it.
- `Documentation/research/SECONDARY_RESEARCH.md`, `research/CyberCrime.md`, and related discovery files — historical comparison research, not the current build source.

## Judging-criteria checklist (use this to sanity-check scope before building anything)

- [x] One clearly defined problem, not several bundled together: DRC-01C notice-to-source-record reconciliation only.
- [ ] A citizen journey that runs start to finish, not a static mockup. The approved route is locked; the current public skeleton still needs the portal-native UI, real model path, Part B review, and print state.
- [x] Simpler and clearer than the real incumbent experience: it inserts source-row reconciliation between the portal's aggregate Part A and Part B response form.
- [x] Backend/process addressed: deterministic matching, classification, arithmetic, evidence linking, and a guarded future model contract.
- [x] Mock vs. real boundary is visible in the skeleton and specified in the PRD/plan.
- [x] A real OpenAI model call is meaningful in the product. Stage 3 is implemented as a server-side, grounded Responses API path; deployment still requires `OPENAI_API_KEY`.
- [x] The skeleton is mobile-first, renders fixture content without a model, works at 375px, and uses plain language before tax detail.
- [x] No live government system or real PII is used; identifiers are synthetic and government-affiliation claims/logos are excluded.
