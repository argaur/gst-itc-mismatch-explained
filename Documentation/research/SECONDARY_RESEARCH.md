# Secondary Research (Stage C)

Source: synthesized from `research/CyberCrime.md` (full secondary research pass, dated 2026-08-24, plus a live walkthrough of cybercrime.gov.in added 2026-08-25) and the Fable 5 opinion and grill-me sessions run inside this session. This file does not restate every line of that source, it pulls out what Stage C needs: market signal, prior art, community signals, and disconfirming evidence. Read the source file for full citations.

Tags: **[S]** secondary source, **[H]** hypothesis / inference, **[X]** contradicted by later evidence.

---

## 1. Scale and market signal

- **[S]** The CBI identified nearly 8.5 lakh mule accounts opened across 700 bank branches in 2025 (The420.in).
- **[S]** Between September 2024 and January 2026, I4C shared details of more than 2.73 million suspected "Layer 1" mule accounts with banks, blocking transactions worth over ₹9,518 crore (The420.in, search-aggregated).
- **[S]** MHA parliamentary answers (Rajya Sabha, 31 Dec 2025) put CFCFRMS savings at more than ₹8,189 crore across 23.61 lakh complaints since 2021; a later PIB/I4C figure as of 30 June 2026 cites ₹11,158 crore saved across 32.80 lakh complaints. Multiple parliamentary answers on the same underlying number differ by a few hundred crore depending on the date they were given, treat any single figure as directional, not exact.
- **[H]** At the 2.73 million-account scale, some proportion of frozen accounts are near-certainly innocent third parties caught in the fraud chain, this is inference from scale, not a government-published innocent-freeze count. No official source publishes an "innocent freeze" number. This is the single largest unverified assumption in the whole problem space and should be named as such wherever it is used.
- **[S]** Fraud money typically routes through 5-6 intermediate accounts before reaching the fraudster (news4hackers.com), which is the structural reason freezes cascade past the actual fraudster to unrelated recipients.

## 2. Named prior art (what already exists, and what it's missing)

- **[S]** The 1930 helpline plus CFCFRMS is the government's own fast-freeze mechanism, it works within a "golden hour" (roughly first 60 minutes) and is credited with the savings figures above. It only targets the freeze side of the process, not release.
- **[S]** e-Zero FIR (May 2025) auto-generates a Zero FIR at the e-Crime Police Station, Delhi, but only for losses above ₹10 lakh, most of the account-freeze victims found in primary research report far smaller amounts (₹1,000 to ₹4 lakh range).
- **[S]** IBA (Indian Banks' Association) has been pushing RBI for explicit statutory power to freeze mule accounts faster (April 2025), which implies the legal basis for freezing, and by extension for releasing wrongly frozen accounts, is itself still ambiguous at the regulatory level. This is a signal the gap is real and recognized by the industry, not just by victims.
- **[S]** No official enumeration of NCRP status values exists anywhere in the manual, FAQ, or any reachable I4C document (confirmed via live portal walkthrough, 2026-08-25). Third-party guide sites disagree with each other on what each status means.

## 3. Steal List (specific mechanics worth copying, not a threat list)

| Source | Specific mechanic worth copying | Why it works |
|---|---|---|
| u/HauntedAlgorithm's Reddit "how I fought it" post (2,434 pts, 316 comments) | Files an RTI asking a direct, narrow question, "does any case in this district name me" | Turns a vague fear into a yes/no answer using an existing legal right, no new law needed |
| u/Progamersera's follow-on explainer post | Lays out a numbered DIY playbook: RTI, BNSS §451/457 magistrate application, Delhi Cyber Crime Unit NOC route, RBI Ombudsman | Proves the steps can be sequenced and explained in plain language, the raw material for a guided flow already exists in the wild |
| righttoinformation.wiki and legalfund.in explainer sites | Third-party sites built purely to decode portal status codes and freeze/unfreeze steps | Their mere existence, several dated 2025-2026, is evidence of unmet demand for exactly this translation layer |
| Madras HC ruling, W.P. No. 25631 of 2024 | Established that only the disputed amount, not the whole account, should be frozen | A citable legal hook a build can surface to a citizen and to a bank branch that may not know the ruling exists |

## 4. Community signals

- **[S]** Multiple independent 2025-2026-dated explainer articles exist purely to answer "what does disposed mean" or "how do I unfreeze my account", their existence across several unrelated publishers is itself evidence of a real, recurring, unmet need, not a single blogger's pet topic.
- **[S]** Bank branch staff routinely do not know the applicable legal sections (Section 91 vs 102 CrPC, 94 vs 106 BNSS) or that MHA's own SOP restricts freezes to the disputed amount, this appears consistently across multiple independent accounts, not as an isolated branch failure.

## 5. Evidence Against (required, minimum 3)

1. **[S]** The single most commonly cited number in early framing of this problem, "₹167 crore restored out of ₹52,969 crore reported, a 2.18% restoration rate", is flagged in the source research itself as coming from one aggregated search result that could not be independently verified against a primary MHA document. It should not be used in a pitch or in this PRD's Success Criteria without separate confirmation.
2. **[H]→ open** No government source publishes a number for how many of the 8.5 lakh / 2.73 million flagged mule accounts belonged to genuinely innocent recipients versus actual mules or fraudsters. The entire "innocent freeze at scale" argument rests on inference from the 5-6 hop routing pattern, not a hard count. If a future source shows the innocent-recipient share is small, this weakens the case for building around it.
3. **[S]** The government's own framing of the freeze mechanism (1930, CFCFRMS, mule-account sharing) is uniformly presented as a success story in every parliamentary answer and press release found, savings rising release over release. None of the secondary sources found any government acknowledgment that the release side is broken. This means the "missing release process" framing is entirely citizen-and-journalist sourced, not officially conceded, a build pitched to judges should be honest that this is the team's diagnosis, not an admitted government gap.
4. **[S]** e-Zero FIR and the newer Fraud Risk Indicator (FRI, credited with preventing over ₹660 crore in losses in 6 months as of Dec 2025) show the government is actively investing in this space. A judge could reasonably ask whether official channels are already closing this gap faster than a hackathon prototype could matter. Searched for evidence the release-side gap is already being addressed by a named initiative, found none, both new mechanisms target detection and freezing speed, not release.

---

*Full citation trail: `research/CyberCrime.md` (all sections, especially §2C, §3, §6, §7) and the two Fable 5 agent transcripts run earlier this session (not persisted as separate files, summarized into this document and into `DECISIONS_LOG.md` once written).*
