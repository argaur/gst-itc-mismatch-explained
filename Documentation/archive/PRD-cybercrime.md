<!-- STATUS: DRAFT, NOT SEALED. Written autonomously while Gaurav was away, per his explicit
     instruction to run /prd-create through problem statement and pain points only, no
     solution space. Stages B and D gates ("Framings approved" and "Problem statement
     finalized") have NOT been walked with Gaurav yet. Section 6 below carries the
     strongest candidate both research passes point to, but it is a draft, not his final
     wording. Do not treat this document as sealed, do not run /rubric against it, until
     Gaurav has read Documentation/research/PROBLEM_SPACE.md and NARROWED_CANDIDATES.md
     and confirmed both gates. Part B (Solution) and Part C (Execution) are deliberately
     not drafted, per Gaurav's instruction, except for one short unconfirmed suggestion
     paragraph at the end, added on his request in the same session. -->

# Guided release from a wrongful cyber-fraud account freeze

**DRI:** Gaurav Gupta / Kriti | **Pod:** Build What Moves India hackathon team (2-person)
**Status:** Discovery / Define. Stages A-C complete, Stage D (narrow) drafted but not picked by Gaurav, Stage E (draft) in progress for Part A only, Stage F not started.
**Created:** 2026-08-26 | **Last Updated:** 2026-08-26
**Figma:** none, code-first | **ERD / Engineering Docs:** none yet | **Analytics:** not applicable, hackathon prototype

**Document lineage:** `Documentation/research/SPARK.md` (Stage A), `PROBLEM_SPACE.md` (Stage B, five framings, not yet gated), `PRIMARY_RESEARCH.md` and `SECONDARY_RESEARCH.md` (Stage C, committed to git as the bias-lock), `NARROWED_CANDIDATES.md` (Stage D, three candidates, not yet picked). Facts live in those files and are referenced here, not restated. This document is the working PRD, it does not yet override anything, because nothing has been finalized.

---

## Changelog

| Change | Date | People | Comments / link |
|---|---|---|---|
| Stages A-D drafted autonomously, Part A sections 1-6 drafted | 2026-08-26 | Claude, autonomous, Gaurav away | Two independent Fable 5 agent sessions (opinion, then grill) informed the research synthesis. Gaurav has not yet reviewed. |
| Firecrawl fact-check pass, corrected wrong BNSS citation (§451/457 to §497/503), added the newly-launched Money Restoration Module and MHA's Jan 2026 SOP, un-flagged and promoted the ₹167cr/2.18% stat, downgraded the RTI-as-discovery assumption, refreshed stale mule-account figures, archived the primary Reddit source | 2026-08-26 | Claude (Opus 5 agent, dispatched by Gaurav), verified via `mcp__firecrawl__*` tools | See findings summary in session transcript; full detail in `SECONDARY_RESEARCH.md` and `research/CyberCrime.md` |

---

# PART A — WHY (Problem Alignment)

---

## 1. The Problem

**[S]** When money passes through a fraud chain, typically 5-6 intermediate bank accounts before reaching a scammer, banks and police freeze every account in that chain, including people who received money for an unrelated, legitimate reason and had no idea it was tainted. **[H]** At the scale involved (8.5 lakh mule accounts flagged by the CBI in 2025, 2.73 million shared by I4C with banks between September 2024 and January 2026), some real share of these freezes catch genuinely innocent people, though no government source publishes that specific count.

**[P]** Once frozen, there is no default path back. Freezing is fast, automated, and centralized. Release is slow, manual, and depends on the account holder personally discovering a legal and procedural path most people, including bank branch staff, do not know exists. The highest-engagement post found across all ten platforms researched for this hackathon (2,434 points, 316 comments) describes a technically savvy person needing an RTI filing and a High Court writ threat just to get his own money back over a ₹175 disputed credit.

**What we are not trying to solve, stated now so the boundary is clear:** we are not building a fraud-detection or investigation tool, we are not trying to catch actual mules, and we are not claiming to verify guilt or innocence better than the current system does. We are building for the person the system has already decided is not the target of the investigation, but who still has no way to prove it or act on it.

### 1.2 Real User Scenario

**[P]** A person receives a routine, explainable payment: a salary credit, a friend repaying a small loan, a marketplace sale. Within a day to a few weeks, their account freezes without warning. There is no SMS, no email, no letter, and often no lien amount shown, `PRIMARY_RESEARCH.md` §1 documents this exact shape across SBI, ICICI, HDFC, Axis, IndusInd, and other banks independently.

**[P]** The account holder's own bank branch typically says "not our decision" and cannot or will not give a case number, a contact, or a reason. The freezing authority, some district cyber cell, is almost never in the account holder's home city, and multiple primary sources describe being told to appear in person hundreds of kilometers away, sometimes on contradictory instructions from two different offices about whether that's even required.

**[P]** The workflow that breaks: there is no default channel for "I believe I am innocent, tell me what to do." The only path that has worked for real victims is one they had to assemble themselves, RTI to confirm no case names them, a bank representation letter citing the relevant legal precedent, in one case a High Court writ threat, sometimes public pressure via social media. **[H]** This is structural, not a one-off failure: freezing has a designed, automated, centralized pipeline; release does not.

### 1.4 Evidence

| Evidence | Magnitude | Source | Confidence |
|----------|-----------|--------|-----------|
| Mule accounts flagged / shared with banks | 8.5 lakh (2025) / 2.73 million shared Sep 2024-Jan 2026 | `SECONDARY_RESEARCH.md` §1 | [S] |
| Money blocked via mule-account sharing | ₹9,518 crore | `SECONDARY_RESEARCH.md` §1 | [S] |
| Independent victim accounts of freeze-with-no-explanation | 10+ distinct threads across 8+ banks, 2 subreddits | `PRIMARY_RESEARCH.md` §1-3 | [P] |
| Time to resolution where it worked without legal escalation | 8-13 days | `PRIMARY_RESEARCH.md` §1, Evidence Against #3 | [P] |
| Time/effort where legal escalation was required | RTI filing + High Court writ threat + public pressure, over a ₹175 credit | `PRIMARY_RESEARCH.md` §2 | [P] |
| Official NCRP status enumeration | none exists, confirmed live | `research/CyberCrime.md` §7 | [S] |
| Restoration-rate figure ("2.18%, ₹167 crore") | confirmed on I4C's own site and two independent news sources | `SECONDARY_RESEARCH.md` §5 item 1 (retracted) | [S] Firecrawl-verified 2026-08-26, safe to lead with |
| Mule accounts flagged / shared with banks (refreshed) | 32.08 lakh Layer-1 accounts, 30.48 lakh suspect identifiers, ₹25,698 crore in transactions declined, as of 30 Jun 2026 | New Indian Express, 21 Aug 2026, citing MoS Home Bandi Sanjay Kumar in Parliament | [S] supersedes the Sep 2024-Jan 2026 figures used elsewhere in this table |

### 1.5 Why Now

**[H]** The scale of the underlying freeze mechanism has grown sharply and recently, 32.08 lakh Layer-1 mule accounts shared with banks as of June 2026, meaning the collateral-damage surface is expanding, not shrinking, even as the government's investment has gone almost entirely into faster freezing (1930, CFCFRMS, the newer Fraud Risk Indicator). **[S]** One exception, and it needs to be named honestly: MHA/I4C launched the Money Restoration Module (MRM) around 20 August 2026, a tracked online path for a fraud victim to request their frozen money back, using their own NCRP complaint number. This does not close the gap this PRD targets. MRM serves the original complainant getting their own money back; it has no entry point for the person this PRD is about, the uninvolved recipient whose account was frozen as a side effect, who never filed an NCRP complaint and has no acknowledgement number to log in with. The corrected claim is: release now has a tracked path for the complainant, and still has none for the bystander. **[H]** This is also a live hackathon deadline (Aug 28, 2026), which is the immediate reason this problem is being scoped now rather than a claim that the underlying government gap itself is new.

**[S]** The gap is also no longer just a citizen-and-journalist diagnosis. MHA issued revised NCRP/CFCFRMS SOPs (reported 27 Jan 2026) directing agencies to verify complaint authenticity before ordering a freeze, stating plainly that "individuals and businesses are sometimes caught up in the cybercrime control framework due to mistaken identity, disputed transactions, or insufficient verification," and that freezes should be "applied proportionately, with clear accountability at every stage" (New Indian Express, 27 Jan 2026). That is this PRD's problem statement, in the ministry's own words.

> **Key Insight**
>
> The system was built to freeze. It was never finished on the way back out. Every real fix an innocent person has found for this so far, they built by hand, in public, on Reddit.

---

## 2. Target User

**Segment:** **[P]** An Indian bank account holder, any income level, who received a routine and explainable payment, salary, a small personal repayment, a marketplace sale, and had that account frozen as collateral in a cyber-fraud chain they had no part in. The structural condition that defines them is not income, age, or geography, it is: they are a **downstream, uninvolved recipient in someone else's fraud chain**, with no case file, no complaint against them by name, and no procedural knowledge of how to prove that.

| Behaviour | Description | Product implication |
|-----------|-------------|---------------------|
| Has no case number or written notice | Bank says "not our decision," gives no ID to reference | Product cannot assume the user has any official reference to start from, intake must work from what the citizen actually has (bank name, approximate freeze date, transaction description) |
| Does not know which legal mechanisms apply | Most victims discover RTI / BNSS §497-503 (property release, formerly CrPC §451-457) / Banking Ombudsman only by reading someone else's Reddit post | Product must supply the legal path, not assume the user already knows to ask for it |
| Frozen authority is rarely local | Multiple accounts describe being told to travel hundreds of kilometers, or receiving contradictory guidance about whether travel is required | Product cannot assume in-person availability, needs to route around physical presence wherever legally possible |

**[H]** These traits are not fixable with a better FAQ page, they define a product that has to actively discover the user's situation (through something like an RTI request) rather than simply explain a status the system won't even name.

**Explicit exclusions:** people who are knowingly part of a fraud chain, this product does not attempt to verify guilt or innocence, it assumes the user's own belief that they are innocent and gives them the same tools a well-informed innocent person would use. Also excluded for now: the original fraud victim trying to recover their own stolen money, that is a related but distinct user and problem, tracked separately in `PROBLEM_SPACE.md` Framing 1 as a framing not selected for this build.

**Say-Do Gap:** skipped. No structured interviews have been run with a real account-freeze victim this session, `PRIMARY_RESEARCH.md` names this gap explicitly. Filling this table with Reddit-sourced quotes as both "say" and "do" would overstate what the team actually has.

---

## 3. Existing Ecosystem & Why It Fails

**Baseline tools users actually use:** **[P]** the real baseline is not an app, it is other victims' Reddit posts, read one at a time, and a phone call loop between the bank branch, 1930, and whichever district cyber cell is technically assigned. Zero setup, zero personalization, entirely dependent on finding the right thread by luck.

| Tool / Tier | What Works | What Fails | Why It Cannot Be Fixed (architectural ceiling) |
|-------------|-----------|------------|----------------------|
| Official channels (bank branch, 1930, cybercrime.gov.in) | Freeze side works fast and reliably; since Aug 2026, the Money Restoration Module gives the original complainant a tracked refund path | No release-side process exists for the uninvolved recipient, `SECONDARY_RESEARCH.md` §2 confirms no official NCRP status list, no published innocent-release SLA, and MRM's own login step (NCRP acknowledgement number) structurally excludes anyone who never filed a complaint | The gap is not a bug in these channels, it is a channel built for the wrong user; MRM patches the complainant's side, nothing patches the bystander's |
| Third-party explainer sites (righttoinformation.wiki, legalfund.in, sudhirrao.com) | Generic legal explanation of RTI, BNSS sections, NOC process | Not personalized to a specific case, not a tracked flow, no document generation | Built as static content, not as an interactive process, structural limit of the format |
| Reddit community threads | Real, detailed, high-trust peer accounts of what actually worked | Undiscoverable without knowing the right search terms, no tracking, advice scattered across dozens of separate threads with no synthesis | A public forum has no mechanism to turn one person's playbook into a repeatable tool for the next person |

**Architectural ceilings:** (1) no official party currently owns the release side of this process end to end, freeze and release sit in different agencies with no shared state, (2) legal knowledge (which BNSS section, which court precedent) is not distributed anywhere the average affected citizen would find it before they need it, (3) every existing fix is manually reconstructed per case, nothing persists what worked for the next victim.

---

## 4. Business Impact

**[H]** This is a hackathon prototype, not a revenue business, and it would be dishonest to invent a business-impact table this early. If this direction is picked and built past the hackathon, the honest operational-effect claim is: fewer hours per case spent by an innocent account holder reverse-engineering a legal process, and fewer cases that require escalating all the way to a High Court writ threat to resolve. No baseline exists for either, because no product exists yet, this is a named gap, not a hidden one.

**Total impact:** not sized. The hackathon's own judging is the immediate "business" this document should optimize for, credibility of the problem, credibility of the backend/process fix, and a demoable prototype, not a revenue projection.

---

## 5. Problem Prioritisation (Impact vs Effort)

| Problem | Description | Impact | Effort to attack | Priority |
|---------|-------------|--------|------------------|----------|
| P1 | Missing release-side process for an innocent frozen account (`NARROWED_CANDIDATES.md` Candidate 1) | HIGH, strongest and most repeated evidence found across all 10 platforms researched | MED, buildable in 3 days if scoped to intake + document generation + one tracked timeline, per the grill session's two required reframes | Attack now |
| P2 | Information vacuum at the moment of freeze (`NARROWED_CANDIDATES.md` Candidate 2) | MED, real and well evidenced, but narrower | LOW, a notification/explanation layer alone | Instrument now, as the front end of P1, not a standalone build |
| P3 | Jurisdiction ping-pong / forced physical presence (`PROBLEM_SPACE.md` Framing 4) | MED, consistent secondary pattern | MED, a jurisdiction resolver is a real sub-build | Defer, treat as a feature inside P1 rather than a separate problem, unless P1 is fully scoped early |

**Selected chain:** P1 → P2 → the failure mode both retire: a victim reverse-engineering a legal process from scattered Reddit posts with no tracked outcome. **[H]** This chain is a draft ranking following both agent sessions' convergence, it is not Gaurav's confirmed pick, see `NARROWED_CANDIDATES.md`.

**What we are not solving and why:**

| Problem | Reason excluded (structural, not "later") |
|---------|----------------|
| Recovering the original fraud victim's stolen money | Different user, different evidence chain (`PROBLEM_SPACE.md` Framing 1), would dilute a 3-day build across two distinct problems |
| Verifying guilt or innocence | Not something a hackathon prototype, or arguably any product, can do better than an actual investigation, the product assumes the user's stated innocence, same as the legal remedies it points them to |
| Any live integration with cybercrime.gov.in, bank APIs, or real account data | Explicitly out of bounds per hackathon rules, and unnecessary, the entire value is a mockable reasoning and document layer |

---

## 6. Narrowed Problem Statement & Key Assumptions

**STATUS: DRAFT, AWAITING GAURAV'S STAGE D PICK.** Per `NARROWED_CANDIDATES.md`, Claude does not finalize this wording, this is a starting point.

**Draft statement:** An innocent recipient in a multi-hop fraud chain, someone who received a routine, explainable payment with no involvement in the underlying fraud, gets their bank account frozen with no notice, no reason, and no default path to release. The freeze mechanism is fast, automated, and centralized. The release mechanism does not functionally exist, every documented resolution required the account holder to personally discover and execute a legal process (RTI, bank representation, sometimes a court filing) that neither the bank nor the portal exposes to them. Existing help, official or third-party, is either purely explanatory or entirely manual, nothing tracks a specific case from freeze to resolution or supplies the actual documents needed. **[H]** Every existing resource requires the citizen to become their own paralegal, on their own timeline, an unfamiliar and often invisible task while their money is frozen. Any real fix needs to supply that process, not just explain that it exists.

| Assumption | Evidence | Confidence |
|-----------|----------|------------|
| Innocent freezes are a real, non-trivial share of the 8.5 lakh / 2.73 million flagged accounts, not a rare edge case | Inferred from the 5-6 hop routing pattern and dozens of independent victim accounts, not a published government count | [H] |
| The RTI-as-discovery step (does any case name me) is a legally real and repeatable mechanism, not a one-off that worked for one lucky poster | Demonstrated successfully by u/HauntedAlgorithm (post archived: reddit.com/r/LegalAdviceIndia/comments/1jgljwj) and documented as a general playbook by u/Progamersera. **Counterweight:** RTI Act §8(1)(h) exempts information that would impede an ongoing investigation, and the CIC routinely upholds denial on exactly that fact pattern, a district cyber cell asked "does any case name me" while a live fraud investigation is open. Denial is not guaranteed but is common enough that this cannot be the product's only branch | [H], downgraded from [P]. Product needs a named fallback (bank representation letter + Madras HC precedent + Banking Ombudsman) as a co-equal path, not a rare exception |
| Bank branch staff will act on a well-formed representation letter citing the relevant legal precedent, without requiring the citizen to already know it | Not directly evidenced, no primary source describes a branch response to a citizen-generated letter specifically, this is the weakest assumption in the chain | [H], flagged as needing to flip fastest if wrong |
| Harshit's team's build will not collapse this idea's differentiation in a judge's eyes | Unresolved, both agent sessions flagged this as the single open risk | [H], open, action required before this section can be finalized |

### 6.1 Note on the Harshit overlap

Not yet resolved. `NARROWED_CANDIDATES.md` Candidate 3 and `PROBLEM_SPACE.md` Framing 5 both treat this as a precondition, not a footnote. This PRD cannot honestly be sealed until that conversation happens.

---

## Suggested solution direction (unconfirmed, Gaurav's call next session)

**[H]** Not drafted as Part B, per Gaurav's instruction to stop this session at problem statement and pain points. This paragraph exists only because he asked, mid-session, for a lightweight pointer to think about before the next session, not a commitment.

Both independent agent sessions, and the reframe the grill session forced, point toward a build with two paired halves rather than one flow. On the citizen side: a structured intake that captures what a real account holder actually has, no case number, an approximate freeze date, a bank name, a transaction description, and turns that into an RTI request as the discovery step (does any case name me), rather than pretending to diagnose the freeze from data no real citizen has access to. That RTI, once answered, becomes the input to the next document, a bank representation letter citing the Madras HC precedent that only the disputed amount, not the whole account, should be frozen, and, where warranted, a BNSS §497/503 draft application (the current property-release sections, formerly CrPC §451/457, corrected 2026-08-26 after a Firecrawl fact-check, see changelog). Each step sits on one tracked timeline so the citizen always knows what's been sent, what's pending, and what's next. On the backend side, and this is the piece both agent sessions considered the actual "fix the process, not the screen" claim, the build should also render the release-side state machine that does not currently exist anywhere: filed, RTI response received, representation sent, NOC issued, cleared, each stage with the SLA it should have, shown as the missing mirror image of the freeze pipeline that already exists and already works. This keeps the demo honest about what a hackathon team can actually build (a structured document and tracking flow, fully mockable) while still making the "no live systems, no real data" backend argument the brief rewards, rather than positioning the whole thing as a chatbot that decodes an unknowable status field.

---

*Evidence sources: `Documentation/research/SPARK.md`, `PROBLEM_SPACE.md`, `PRIMARY_RESEARCH.md`, `SECONDARY_RESEARCH.md`, `NARROWED_CANDIDATES.md`. Underlying platform research: `research/CyberCrime.md`, `research/primary/CyberCrime-primary.md`.*
