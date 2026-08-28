# Income Tax e-Filing Portal — Primary Research (Real User Voices)

Compiled 2026-08-24. Companion to the secondary-research report at `research/IncomeTax.md` (news/parliamentary sources). This file is meant to capture what actual people say on Reddit, X/Twitter, Quora, and similar — not official reporting.

## IMPORTANT — Search limitations (read before trusting this as strong evidence)

This research hit hard tool limitations that materially reduced how much real primary-source material could be pulled directly:

- **Reddit is unfetchable by this tool entirely** (`www.reddit.com`, `old.reddit.com` — every attempt returned "Claude Code is unable to fetch from www.reddit.com," a domain-level block, not a network hiccup). `site:reddit.com` web searches also did not surface actual r/IndiaTax or r/personalfinanceindia thread URLs — they consistently returned news-site coverage instead of Reddit's own pages. **I could not verify a single specific Reddit thread, username, or upvote count.** This is the single biggest gap versus the brief's ask.
- **X/Twitter posts could be found via search** (real handles, real snippet quotes, real dates) but **could not be fetched in full** — every `x.com` status URL returned "HTTP 402 Payment Required" (X now paywalls content access for non-authenticated fetchers). What's below is limited to what the search snippet itself showed.
- **Quora question pages returned 403 Forbidden** on fetch, so only question titles (which are themselves signal) could be captured, not the answer bodies.
- **Google, Bing, and DuckDuckGo search-result pages could not be scraped directly** (blocked / CAPTCHA'd) as a workaround for the above.
- **The session's WebSearch quota (200 calls, shared across the whole Claude Code session, not just this task) was exhausted partway through this research**, cutting off further query attempts (e.g., app-store review mining, more targeted Reddit-title searches).
- App Store / Play Store review pages for the AIS mobile app could not be located (guessed package/app IDs all 404'd; no search budget left to find the correct ID).

**Net effect:** what follows leans more heavily on X/Twitter (via search snippets) and news coverage that itself aggregates social-media reaction, with Reddit and Quora represented much thinner than the brief wanted. Treat the "Signal strength" section's caveats seriously — this is a partial pass, not a saturated one.

---

## Complaint cluster: Portal crashes / dies near deadline

Strongest cluster by volume of real handles found, all clustering around the **15 September 2025 ITR deadline** (extended deadline for FY 2024-25).

- **CA Pratibha Goyal** (@PratibhaGoyal), X, **11 September 2025**: *"Income Tax Portal is dead!"* — https://x.com/PratibhaGoyal/status/1966050611675410768 (full tweet body not retrievable — X blocked fetch with HTTP 402 — but headline text confirmed via search index)
- **CA Pratibha Goyal** (@PratibhaGoyal), X, earlier post (dated by status ID to **~July 2024**, around the July 31 2024 deadline): *"Income Tax Portal Glitches!"* — https://x.com/PratibhaGoyal/status/1811038519994745145 — same person complaining in two separate filing seasons a year apart, suggesting this is a recurring seasonal failure, not a one-off.
- **Gaurav Aggarwal** (@fooobar), X, **14 September 2025**: *"Income tax portal is acting up big time — my form that I have painstakingly filling for the past week or so is not even showing up!"* — https://x.com/fooobar/status/1967132952355369301. Notable detail: the complaint isn't just "can't log in" — it's **work silently not saved/not showing**, i.e., the portal doesn't preserve a return that took a week to fill.
- **Ravinder Rathi** (@Ravinder_Rathi4), X, **2025** (around the same deadline window): *"Income Tax e-Filing Portal Glitches (2025) :- Dear CBDT..."* (opens as a direct appeal to the tax authority) — https://x.com/Ravinder_Rathi4/status/1971541749643296995
- **@IncomeTaxIndia (official)**, X, **15 September 2025**, replying to the wave of complaints: *"KIND ATTENTION TAXPAYERS! Having difficulty accessing the Income Tax e-Filing Portal? ... These simple steps often help resolve such issues: ▶️Delete temporary files..."* — https://x.com/IncomeTaxIndia/status/1967589427456213309. The department's own troubleshooting-thread response is itself evidence of complaint volume — you don't post a public "clear your cache" thread unless you're being flooded.
- Per Tribune India (news source aggregating the same social moment, 15 Sept 2025): *"a number of chartered accountants and individuals have taken to social media... claiming that the I-T portal is facing glitches while making tax payment and downloading AIS."* Department's on-record reply to the complaints: *"The e-filing portal is working fine. Please clear your browser cache or try accessing the portal through a different browser."* — https://www.tribuneindia.com/news/business/netizens-complain-of-glitches-in-return-filing-on-last-date-i-t-dept-says-no-deadline-extension — this "gaslighting" pattern (department insists it's fine, users insist it's broken) is itself a recurring texture worth noting for the pitch: users have no independent way to prove the portal is down, so the department's denial is the final word.
- Same night, department X post called deadline-extension rumors *"fake"*, insisting *"The due date for filing ITRs remains 15.09.2025."* Reinforces that panic/rumor spreads on social media during outages because there's no authoritative real-time status page.

**What's missing:** exact Reddit thread evidence for this cluster (r/IndiaTax almost certainly has a "portal down again" megathread every September — could not be retrieved this pass).

---

## Complaint cluster: AIS/TIS mismatch confusion

This is the cluster the secondary-research report already flagged as the strongest lead. Primary-source evidence for it specifically was hard to pull directly (Reddit blocked, no direct forum quote retrieved), but the pattern is corroborated indirectly:

- Business Standard (cited by search index, not independently fetched — page returned 403 on direct fetch): *"lakhs of taxpayers across India have received automated communications triggered by mismatches appearing in their Annual Information Statement (AIS) or Taxpayer Information Summary (TIS), with the sudden spurt leaving many honest taxpayers anxious, confused, and worried about possible penalties."*
- Quora question titles found (answer bodies not retrievable, 403 on fetch) that signal the same confusion pattern in the population that actually searches for help:
  - *"How do I know if I got a notice from the income tax department? Where can I check any notices related to the taxes I get?"* — https://www.quora.com/How-do-I-know-if-I-got-a-notice-from-the-income-tax-department-Where-can-I-check-any-notices-related-to-the-taxes-I-get — this question existing at all is a strong signal: people don't even know where notices land, let alone what they mean.
  - *"How do I handle notice from Income tax department in India"* — https://www.quora.com/How-do-I-handle-notice-from-Income-tax-department-in-India
  - *"I received a text message from the income tax department, Tirupati. Is it true or not? ... there are no messages [on the portal]. How can I respond?"* — https://www.quora.com/I-received-a-text-message-from-the-income-tax-department-Tirupati-Is-it-true-or-not-The-mail-is-not-received-and-verified-compliance-portal-there-are-no-messages-How-can-I-respond — real person, can't tell if an SMS claiming to be from the tax department is genuine because the official channel (compliance portal) shows nothing matching it. This is close to a phishing/trust problem sitting right next to the AIS-mismatch problem.

**Assessment:** the AIS-mismatch primary evidence is weaker in this pass than the deadline-crash cluster purely because of tool access, not because the underlying complaint is rarer — the secondary report's parliamentary/news data plus these Quora question titles both point the same direction.

---

## Complaint cluster: Confusing notices citizens can't decode

Overlaps heavily with the AIS cluster above but is broader than just AIS-triggered notices.

- Quora question pattern above (Tirupati SMS case) is the clearest real-person example captured: a citizen genuinely unsure whether a tax notice is real, unable to cross-check it against the portal.
- News-reported (not primary, but names a real non-CA citizen): an elderly UP daily-wage labourer received a notice to file returns on an alleged ₹4.88 crore income — she and her husband "could not make sense of the notice or why they were being forced to file returns" on an amount nowhere near their real income. Source: Deccan Herald, cited via search index. This is a real citizen's confusion (not anonymized social commentary, an actual reported case), and it demonstrates the target user for this hackathon problem statement precisely: someone with no CA, no way to parse a notice, panicking.

---

## Complaint cluster: Refund delays

Weakest cluster in this pass — searches kept returning **US IRS 2025/2026 refund-delay news** instead of Indian results (a query-disambiguation failure worth noting for whoever runs follow-up searches: always add "India" or "incometax.gov.in" explicitly, "income tax refund delay" alone defaults to US IRS content). No verified Reddit or X quote captured for this cluster specifically. The secondary-research report's "paid status, no money received" framing (Gaurav's own idea 2 area) is not independently corroborated by primary voices in this pass — a gap worth closing before the team commits budget to that specific framing.

---

## Complaint cluster: CA-dependency frustration

Indirect evidence only: CA Pratibha Goyal (a working CA, not a lay taxpayer) is one of the loudest complainants found above, posting about portal failures in both the 2024 and 2025 filing seasons on her own professional account. That a practicing CA — someone whose job is to know the system — is publicly frustrated by the portal reinforces the "even professionals can't reliably use this" framing, though it's not direct evidence of a citizen complaining about CA cost/dependency specifically. No direct "I had to pay a CA ₹X just to understand a notice" quote was captured this pass.

---

## Complaint cluster: Rectification request black hole

No primary evidence captured this pass (Reddit inaccessible, and searches for this term returned only explainer/news content on how rectification requests work, not people describing being stuck in one). Flag as an open gap.

---

## Signal strength

**Best-evidenced cluster in this pass: portal crashes/dies at deadline.** Multiple distinct real X handles (a practicing CA posting in two separate years, an individual whose week of work vanished, another direct appeal to CBDT), plus the tax department's own public damage-control posts as corroborating evidence of complaint volume. This is real, recent (Sept 2025), and recurring — same complainant, different year.

**Weakest-evidenced in this pass, purely due to tool access, not because the complaint is rare: AIS/TIS mismatch.** The secondary-research report already flagged this as the strongest *structural* lead (parliamentary data, CBDT's own "lakhs of notices" acknowledgment). This pass could not independently pull a single verbatim Reddit or Twitter complaint about receiving an AIS mismatch notice and not understanding it — only adjacent Quora question titles and one indirect Business Standard citation. **This does not weaken the AIS-mismatch thesis** — it's still the most institutionally-documented failure mode — but the team should not treat this file as having freshly validated it with citizen voices. If someone has working Reddit access (logged-in browser, not this tool), a 10-minute manual search of r/IndiaTax for "AIS" or "mismatch" would very likely fill this gap immediately; it read as a near-certain hit that this pass simply couldn't reach.

**Reframing worth flagging to the team:** the department's repeated "portal is working fine, clear your cache" public response to deadline-crash complaints (seen twice, Sept 2025) is itself a usable insight distinct from the underlying crash — it shows there is no trustworthy, independent status signal a citizen can check during an outage, so panic and rumor (fake deadline-extension claims) fill the vacuum. That's a smaller, cleaner, more buildable "fix the moment" than the AIS-mismatch surface if the team wants a fallback.

**Overall:** given the tool-access gaps, treat this file as directional, not conclusive. It reinforces rather than overturns the secondary report's AIS-mismatch lead, and adds one additional well-evidenced angle (deadline-crash + no trustworthy outage status) that the secondary report may not have weighted as heavily.
