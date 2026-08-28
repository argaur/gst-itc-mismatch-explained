# Narrowed Problem Statement Candidates (Stage D)

Status: **awaiting Gaurav's gate ("Problem statement finalized").** Per the prd-create ground rules, Claude does not author or finalize the problem statement, only this evidence dossier. `PRD.md` section 6 is left as a draft pending Gaurav's pick from the three candidates below, or a rejection that loops back to Stage B.

Each candidate traces to a Stage B framing (`PROBLEM_SPACE.md`) and cites file anchors in the two Stage C research files.

---

## Candidate 1: The missing release process (traces to Framing 2)

**Statement (draft wording, not final):** An innocent person whose bank account gets frozen as collateral damage in a cyber-fraud investigation has no default, tracked path to get it released. Freezing is fast, automated, and centralized. Release is slow, manual, and depends entirely on the account holder personally reverse-engineering a legal and procedural path that most people, including bank branch staff, do not know exists.

**Supporting evidence:**
- `PRIMARY_RESEARCH.md` §1-2: dozens of near-identical accounts across 8+ banks, one at 2,434 points / 316 comments, all describing the same shape: freeze, silence, self-built escalation.
- `SECONDARY_RESEARCH.md` §1-2: scale figures (8.5 lakh mule accounts, 2.73 million shared accounts) plus confirmation that no official NCRP status enumeration exists.
- `SECONDARY_RESEARCH.md` §2: IBA lobbying RBI for clearer freeze powers is itself a signal the legal/process plumbing is incomplete on both freeze and release.

**Contradicting evidence:**
- `PRIMARY_RESEARCH.md` Evidence Against #3: at least two cases resolved in 8-13 days through ordinary persistence, without RTI or legal escalation. Not every case needs the full guided-legal flow.
- ~~`SECONDARY_RESEARCH.md` Evidence Against #3: the government has never officially conceded the release side is broken~~ **Resolved 2026-08-26:** MHA issued revised NCRP/CFCFRMS SOPs (reported 27 Jan 2026) explicitly naming "mistaken identity, disputed transactions, or insufficient verification" as causes of wrongful freezes. This is no longer contradicting evidence, it is now supporting evidence, see `SECONDARY_RESEARCH.md` §2 and §5 item 3.
- **New, 2026-08-26:** MHA/I4C's Money Restoration Module (launched ~20 Aug 2026) gives the fraud victim who filed the original NCRP complaint a tracked refund path. It does not weaken this candidate: MRM's login requires the complainant's own NCRP acknowledgement number, which the uninvolved bystander this candidate targets never has. See `SECONDARY_RESEARCH.md` §2.

**What would flip this:** if Harshit's team confirms they are building the same freeze problem with a similar guided-exit angle, the differentiation risk (flagged in `PROBLEM_SPACE.md` Framing 5) may be too high to proceed without a materially different wedge. MRM was checked as a second potential flip (a government tool closing the whole gap) and does not flip it, see above.

---

## Candidate 2: The information vacuum at the moment of freeze (traces to Framing 3)

**Statement (draft wording, not final):** The moment an account freezes, the account holder receives no notice, no reason, and no next step, from the bank, the portal, or any government channel. Every downstream problem, wrong assumption of guilt, panic, wasted calls to the wrong office, traces back to this single missing message.

**Supporting evidence:**
- `PRIMARY_RESEARCH.md` §1: u/techie_0115's case is the sharpest example, "no SMS, no email, no call, no lien amount shown," and "bank seems confused too."
- `SECONDARY_RESEARCH.md` §2: no official NCRP status enumeration exists anywhere, confirmed by a live portal walkthrough, meaning even a well-intentioned system has no plain-language vocabulary to draw from.

**Contradicting evidence:**
- Narrower in scope than Candidate 1. A notification alone does not get anyone's account released, it treats a symptom of the process gap, not the gap itself.
- Risk of reading to a judge as a UI/communication fix rather than a backend/process fix, the hackathon brief specifically penalizes screen-only fixes.

**What would flip this:** if 3-day scoping shows Candidate 1's full guided-exit flow is too large to build credibly, this is the fallback that keeps the same evidence base but ships something narrower and more certain to finish.

---

## Candidate 3: This platform may not be the right call at all (traces to Framing 5, the anti-thesis)

**Statement (draft wording, not final):** Before finalizing any Cyber Crime problem statement, the team should confirm what Harshit's team is building, and separately weigh CPGRAMS's closed-grievance-with-no-appeal finding on its own merits, not only as a fallback triggered by a Harshit collision.

**Supporting evidence:**
- Both independent Fable 5 agent sessions this run (opinion and grill) flagged the Harshit overlap as the single open risk capable of invalidating the Cyber Crime pick, and both recommended resolving it before locking, not after.
- The grill session specifically found the CPGRAMS finding evaluated on its own average-case merits, not just conditionally, still loses to Cyber Crime on evidence and demo strength, but not by so wide a margin that it should be dismissed without Gaurav seeing the comparison directly.

**Contradicting evidence:**
- CPGRAMS's own primary research came back with zero real citizen voices found, versus dozens for Cyber Crime, a real, material evidence gap that does not close no matter how the Harshit question resolves.

**What would flip this:** a direct answer from Harshit on what his team is building. This is a 10-minute action, not a research task, and both agent sessions treated it as the single highest-leverage thing left undone.

---

## Recommendation for Gaurav (not a decision, a starting point)

Both independent agent sessions converged on Candidate 1, reframed per the grill's two required changes: treat the RTI as the discovery mechanism rather than a "status diagnosis engine" the team cannot actually build without data no real citizen has, and build the missing release-side state machine as the process fix, with the citizen-facing guided flow as its front end. Candidate 2 is the fallback if that scope proves too large in 3 days. Candidate 3 is not a competing problem statement, it is a precondition that should close before either is finalized.

**This section is a starting point for Gaurav's Stage D pick, not the pick itself.**
