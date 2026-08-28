**Status:** active — full build underway via Codex, deployed with a working OpenAI path as of 2026-08-28
**Last session:** 2026-08-28 final release — Codex completed Stages 0–3, fixed extensionless ESM and Vercel Node req/res defects, deployed https://prototype-blue-three.vercel.app, configured the gopass-managed OpenAI key in Vercel Production, and verified a live grounded `/api/explain` response. The public repository is https://github.com/argaur/gst-itc-mismatch-explained; Kriti (`kritikandharikapoor`) was invited with write access.
**Next up:** Run rendered mobile/print QA, create the two-minute demo and sub-250-word summary, complete the submission checklist, and confirm Kriti accepts the GitHub invite.
**Blockers:** No technical deployment blocker. Only submission assets and Kriti's invitation acceptance remain.

## Team
Split as of 2026-08-24 (2-person team cap): **Harshit + Varun Malani** on one submission, **Kriti + Gaurav** on the other. This repo tracks Kriti+Gaurav's work; the candidate idea pool below still holds all 4 original members' ideas as shared research. Note: Varun Malani (Harshit's teammate) is a different person from Varun Mayya, the hackathon's organizer.

## Deadline
**Verified 2026-08-24** against the live brief, FAQ, and Varun Mayya's own explainer video: submission deadline is **Aug 28, 2026, 8:00 PM IST, no grace period**. Selection: top 250 shortlisted by Sep 1, one week mentorship, resubmission by Sep 7, top 10 announced Sep 8-12. Finale: **Sep 12, 2026, Bengaluru**, filmed not livestreamed. (Earlier repo values of Aug 27 / Sep 5-6 were wrong — see `past-mistakes.md`.)

## Idea pool
Full structured list (team's + Gaurav's) lives in `CLAUDE.md` at the project root, under "Candidate ideas". Gaurav's 5 ideas are verified against real sources (see `decisions.md` for the one framing correction that came out of that research).

## Platform research (10 official platforms)
`research/README.md` indexes 10 secondary-research reports (news, CAG, parliamentary sources), one per named platform, each with root-cause analysis, buildathon-fit assessment, and 3 to 5 candidate problem statements.

`research/primary/README.md` indexes 10 primary-research reports (real Reddit, X, app store, and forum complaints) for the same platforms. Read both before narrowing Kriti+Gaurav's pick. Three platforms got a sharper lead from primary research than secondary alone: UMANG (an EPFO-action OTP dead-end inside the app beats the discovery problem), MCA (the MCA21 V3 portal itself failing, backed by named professionals, beats the disqualification-dashboard framing), and National Cyber Crime (came back as the single strongest-evidenced problem statement across all 10 platforms: innocent account freezes with no explanation).

## Comparison artifact
Published 2026-08-24 as a Claude artifact ("Ten Portals, Ten Failures") — 10 tabs, one per platform, each with its top 5 sourced problems (evidence-strength chip + Secondary/Primary source tags per finding) and an "also on record" list of every additional issue found. Source file: `research/` + `research/primary/` (synthesized, not a new research pass). Gaurav decided to share it with Kriti as a downloaded file rather than an "anyone with the link" share, given Anthropic's July 2026 share-link indexing incident (patched, but the safer call for a first share).

As of 2026-08-25 the artifact has 2 top-level tabs: **Problem Identification** (the original 3-tab research view above, unchanged) and **Platform Walkthrough**, itself split into **Cyber Crime** / **CPGRAMS** sub-tabs — a live, screen-by-screen walkthrough of both chosen portals with "Needs Gaurav" callouts marking what Chrome automation couldn't verify. Live at https://claude.ai/code/artifact/f3d9d505-91e7-490d-aff9-deafdfca7fec — local source mirrored at `artifact/ten-portals-ten-failures.html`. Publishing this artifact hit a recurring gate bug requiring `force:true` twice; see `past-mistakes.md`.
