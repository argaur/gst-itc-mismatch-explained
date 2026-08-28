# Secondary Research (Stage C)

Source: synthesized from `research/CyberCrime.md` (full secondary research pass, dated 2026-08-24, plus a live walkthrough of cybercrime.gov.in added 2026-08-25) and the Fable 5 opinion and grill-me sessions run inside this session. This file does not restate every line of that source, it pulls out what Stage C needs: market signal, prior art, community signals, and disconfirming evidence. Read the source file for full citations.

Tags: **[S]** secondary source, **[H]** hypothesis / inference, **[X]** contradicted by later evidence.

---

## 1. Scale and market signal

- **[S]** The CBI identified nearly 8.5 lakh mule accounts opened across 700 bank branches in 2025 (The420.in).
- **[S]** Between September 2024 and January 2026, I4C shared details of more than 2.73 million suspected "Layer 1" mule accounts with banks, blocking transactions worth over ₹9,518 crore (The420.in, search-aggregated). **Refreshed 2026-08-26:** as of 30 June 2026, the suspect registry had shared 32.08 lakh Layer-1 mule accounts and 30.48 lakh suspect identifiers, with over ₹25,698 crore in transactions declined (New Indian Express, 21 Aug 2026, citing MoS Home Bandi Sanjay Kumar in Parliament). Use the June 2026 figure, the earlier one is stale.
- **[S]** Firecrawl-confirmed 2026-08-26: ₹167 crore restored against ₹52,969 crore reported stolen (Apr 2021-Nov 2025), a 2.18% restoration rate, blocked-but-not-restored gap of ₹7,647 crore. Confirmed on I4C's own site (i4c.mha.gov.in/newsletter-manual.aspx) and independently in New Indian Express (27 Jan 2026) and News18. This was previously flagged as unverifiable in Evidence Against #1 below, that flag is retracted, see §5.
- **[S]** MHA parliamentary answers (Rajya Sabha, 31 Dec 2025) put CFCFRMS savings at more than ₹8,189 crore across 23.61 lakh complaints since 2021; a later PIB/I4C figure as of 30 June 2026 cites ₹11,158 crore saved across 32.80 lakh complaints. Multiple parliamentary answers on the same underlying number differ by a few hundred crore depending on the date they were given, treat any single figure as directional, not exact.
- **[H]** At the 2.73 million-account scale, some proportion of frozen accounts are near-certainly innocent third parties caught in the fraud chain, this is inference from scale, not a government-published innocent-freeze count. No official source publishes an "innocent freeze" number. This is the single largest unverified assumption in the whole problem space and should be named as such wherever it is used.
- **[S]** Fraud money typically routes through 5-6 intermediate accounts before reaching the fraudster (news4hackers.com), which is the structural reason freezes cascade past the actual fraudster to unrelated recipients.

## 2. Named prior art (what already exists, and what it's missing)

- **[S]** The 1930 helpline plus CFCFRMS is the government's own fast-freeze mechanism, it works within a "golden hour" (roughly first 60 minutes) and is credited with the savings figures above. It only targets the freeze side of the process, not release.
- **[S]** e-Zero FIR (May 2025) auto-generates a Zero FIR at the e-Crime Police Station, Delhi, but only for losses above ₹10 lakh, most of the account-freeze victims found in primary research report far smaller amounts (₹1,000 to ₹4 lakh range).
- **[S]** IBA (Indian Banks' Association) has been pushing RBI for explicit statutory power to freeze mule accounts faster (April 2025), which implies the legal basis for freezing, and by extension for releasing wrongly frozen accounts, is itself still ambiguous at the regulatory level. This is a signal the gap is real and recognized by the industry, not just by victims.
- **[S]** No official enumeration of NCRP status values exists anywhere in the manual, FAQ, or any reachable I4C document (confirmed via live portal walkthrough, 2026-08-25). Third-party guide sites disagree with each other on what each status means.
- **[S]** New, confirmed 2026-08-26: MHA/I4C launched the Money Restoration Module (MRM, `mrm-ncrp.mha.gov.in`) around 20-21 Aug 2026 (New Indian Express, ANI). It gives a complainant a tracked release path: enter the 14-digit NCRP acknowledgement number, OTP-authenticate, optionally upload a court order and PAN, submit. This generates a 14-digit request ID, then, once an eligible amount is identified, an SMS/email prompt and a Unique Request Number (URN) for tracking; an indemnity bond to police may be required before funds move. **This does not close the gap this research points to.** MRM's login step requires an NCRP acknowledgement number, meaning it only serves someone who filed their own fraud complaint. It has no entry point for the uninvolved recipient this candidate targets, who never filed a complaint and has no acknowledgement number. The corrected claim: a tracked release path now exists for the complainant, not for the bystander.
- **[S]** New, confirmed 2026-08-26: MHA issued revised NCRP/CFCFRMS SOPs (reported New Indian Express, 27 Jan 2026) directing agencies to verify complaint authenticity before ordering a freeze, explicitly citing "mistaken identity, disputed transactions, or insufficient verification" and directing that freezes be "applied proportionately, with clear accountability at every stage." This is an official acknowledgment of the exact problem this candidate targets, it changes Evidence Against #3 below from an open gap to a resolved one.

## 3. Steal List (specific mechanics worth copying, not a threat list)

| Source | Specific mechanic worth copying | Why it works |
|---|---|---|
| u/HauntedAlgorithm's Reddit "how I fought it" post (2,434 pts, 316 comments) | Files an RTI asking a direct, narrow question, "does any case in this district name me" | Turns a vague fear into a yes/no answer using an existing legal right, no new law needed |
| u/Progamersera's follow-on explainer post | Lays out a numbered DIY playbook: RTI, a magistrate application for property release (source calls it "Section 451/457 BNSS"; the correct current sections are BNSS §497/503, formerly CrPC §451/457, corrected 2026-08-26), Delhi Cyber Crime Unit NOC route, RBI Ombudsman | Proves the steps can be sequenced and explained in plain language, the raw material for a guided flow already exists in the wild |
| righttoinformation.wiki and legalfund.in explainer sites | Third-party sites built purely to decode portal status codes and freeze/unfreeze steps | Their mere existence, several dated 2025-2026, is evidence of unmet demand for exactly this translation layer |
| Madras HC ruling, W.P. No. 25631 of 2024 | Established that only the disputed amount, not the whole account, should be frozen | A citable legal hook a build can surface to a citizen and to a bank branch that may not know the ruling exists |

## 4. Community signals

- **[S]** Multiple independent 2025-2026-dated explainer articles exist purely to answer "what does disposed mean" or "how do I unfreeze my account", their existence across several unrelated publishers is itself evidence of a real, recurring, unmet need, not a single blogger's pet topic.
- **[S]** Bank branch staff routinely do not know the applicable legal sections (Section 91 vs 102 CrPC, 94 vs 106 BNSS) or that MHA's own SOP restricts freezes to the disputed amount, this appears consistently across multiple independent accounts, not as an isolated branch failure.

## 5. Evidence Against (required, minimum 3)

1. **[X] Retracted 2026-08-26.** The "₹167 crore restored out of ₹52,969 crore reported, a 2.18% restoration rate" figure was flagged here as unverified. Firecrawl fact-check confirmed it independently on I4C's own site and two news sources. It is now [S] and safe to lead a pitch with, see §1 above.
2. **[H] → open, unchanged.** No government source publishes a number for how many of the 8.5 lakh / 2.73 million (now 32.08 lakh, refreshed figure) flagged mule accounts belonged to genuinely innocent recipients versus actual mules or fraudsters. The entire "innocent freeze at scale" argument rests on inference from the 5-6 hop routing pattern, not a hard count. If a future source shows the innocent-recipient share is small, this weakens the case for building around it.
3. **[X] Resolved in the PRD's favour, 2026-08-26.** This item previously said the release-side gap was "entirely citizen-and-journalist sourced, not officially conceded." That is now false. MHA issued revised NCRP/CFCFRMS SOPs (New Indian Express, 27 Jan 2026) explicitly naming "mistaken identity, disputed transactions, or insufficient verification" as causes of wrongful freezes and directing proportionate, accountable freezing. The problem this PRD targets is now an officially conceded gap, not just a team diagnosis. Cite the SOP directly in any pitch.
4. **[X] Partially resolved, 2026-08-26.** A named initiative was found: the Money Restoration Module (MRM), launched ~20 Aug 2026, gives the original NCRP complainant a tracked online refund path. This is real and should be cited, not hidden. It does not close the gap: MRM's login requires an NCRP acknowledgement number, so it structurally excludes the uninvolved bystander this candidate targets, who never filed a complaint. The corrected framing: government investment has produced a release process for the complainant, and none for the person this build is for. e-Zero FIR and the Fraud Risk Indicator (FRI, preventing over ₹660 crore in 6 months) remain freeze/detection-side only, unchanged from the original finding.

---

*Full citation trail: `research/CyberCrime.md` (all sections, especially §2C, §3, §6, §7) and the two Fable 5 agent transcripts run earlier this session (not persisted as separate files, summarized into this document and into `DECISIONS_LOG.md` once written).*
