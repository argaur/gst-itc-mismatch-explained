# UMANG — Primary Research (Real User Voices)

Companion to `research/UMANG.md` (secondary research). This file does not repeat that report's findings (2,446 services / 240 departments, intent-matching framing). It only captures what real people said, with sources, quotes, dates, and handles where findable.

**Method note:** Reddit (old.reddit.com, www.reddit.com/search.json) and Quora are blocked to this session's fetch tool (403/blocked errors) — could not pull live threads from either despite multiple attempts. DuckDuckGo returned a CAPTCHA wall. Bing search returned largely irrelevant/noise results for UMANG-specific queries. The strongest real-people evidence obtained is Apple App Store reviews (verbatim, with handles and dates) and one TeamBlind forum thread. This is a real gap — see "Signal strength" at the end.

---

## Cluster 1: "Technical error" / OTP verification breaks EPFO access — most heavily evidenced

This is by far the loudest, most repeated complaint in every source checked. Users get through OTP entry and then hit a generic, unexplained failure with no path forward.

- **AryanNan**, Apple App Store review, 1★, **19 Aug 2025** ("Bad experience for UAN allotment"): *"after entering the OTP, I got the error message 'Unexpected error occurred'"* and *"Duplicate or no transaction history found for OTP verification"* — described losing a job opportunity because the UAN allotment service kept failing.
  Source: [apps.apple.com/in/app/umang/id1236448857 (reviews)](https://apps.apple.com/in/app/umang/id1236448857?see-all=reviews)

- **Muzan_san**, Apple App Store, 1★, **9 Jul 2025** ("App is somewhere in between the technical glitches"): *"[passbook] feature has more than three months of everyday technical issue... otp messaging are pitiful and frustrating"* — also reported account/registration number conflicts (system not recognizing their existing account).
  Same source.

- **BasnetN**, Apple App Store, 1★, **20 Apr 2024** ("EPFO Technical issue most of the time"): *"technical error pop up most of the times when I try to either request for the OTP"* — describes this persisting for 2+ months despite what the review calls "many false promises that the review team has posted" (i.e., developer replies claiming fixes that didn't land).
  Same source.

- **madLad97**, Apple App Store, 1★, **1 Oct 2025** ("UAN activation"): *"all I keep getting is the same useless 'unexpected error occurred' message over and over again"* — blocked from a PF withdrawal during what they describe as a financial emergency.
  Same source.

- **Affan121**, Apple App Store, 1★, **23 Apr 2025** ("Extremely Disappointed with Umang App – Pathetic Experience"): *"Every time I try to log in to access my EPFO details, I keep getting the same 'technical error'... Logging in should not feel like a rocket science mission"* — reports the failure recurring across multiple days, not a one-off.
  Same source.

- **The.BigBull**, Apple App Store, 1★, **14 Feb** (year not shown on card, recent) ("Beg for your own money"): *"It is giving me a feeling that I am begging for my own money. Worst government and worst service"* — EPFO withdrawal blocked by a permissions error, and support channels (phone/email/chat) reported as non-functional.
  Same source.

- **Aggregate stat (chrome-stats.com, third-party review aggregator, pulled 2026-08-24):** recent-window average rating **1.10/5**, with **73% of recent reviews (38 of 52) rated 1 star**, against an all-time average of **4.15/5** — i.e., the review stream has visibly cratered recently, concentrated in this same EPFO/OTP failure mode. ([chrome-stats.com/d/in.gov.umang.negd.g2c/reviews](https://chrome-stats.com/d/in.gov.umang.negd.g2c/reviews))

- **TeamBlind thread**, "EPFO unable to reset password" — **OP "wohhoooo," 7 Oct 2024**: could not access the EPFO Provident Fund Nomination form because of server downtime and failing OTP generation during password reset; found that *"Changing the browser from Chrome to Firefox helped me!"* (workaround, not a fix). A reply from user **"Be Patient"** (8 Oct) suggested trying the UMANG app instead as "more reliable" — to which the OP replied that **the UMANG app also blocked the same EPFO password reset.** This is a direct primary data point that UMANG is not even a reliable fallback when the EPFO web portal itself is failing.
  Source: [teamblind.com/post/epfo-unable-to-reset-password-dhdx3j7j](https://www.teamblind.com/post/epfo-unable-to-reset-password-dhdx3j7j)

## Cluster 2: No working support channel when it fails

Layered on top of Cluster 1: multiple reviewers explicitly say there is nowhere to escalate to when the app fails.

- **The.BigBull** (above, 14 Feb): explicitly calls out phone, email, and chat support as non-functional when the EPFO error blocked their withdrawal.
- **Affan121** (above, 23 Apr 2025): frames the repeated login failure as something that "should not feel like a rocket science mission," implying no in-app help resolved it across multiple days of retrying.

## Cluster 3: General "great idea, poor execution" sentiment (mixed/older reviews)

Useful as contrast — shows the app was tolerated with a shrug in its early years, and patience has run out more recently.

- **Padma Priya**, Apple App Store, 4★ (rated positive), **27 Nov 2017**: *"It makes life easier to see all services under one roof. Even though there are glitches, bugs and room for improvement."*
- **conny43251**, Apple App Store, 4★, **22 Oct 2017**: praised being able to raise an EPFO withdrawal claim in-app ("I can even raise a claim to initiate withdrawal. That is amazing!") but still flagged "room for improvement in terms of user experience."
- **Kasi323**, Apple App Store, 4★, **15 May 2025**: reported an error connecting to the Aadhaar Face ID app for a life-certificate service, though a retry "immediately worked" — a smaller, recoverable version of the same integration-fragility pattern seen in Cluster 1.

All three: [apps.apple.com/in/app/umang/id1236448857 (reviews)](https://apps.apple.com/in/app/umang/id1236448857?see-all=reviews)

## Clusters NOT well-evidenced by this pass (gap, stated honestly)

The secondary research report's central lead — "can't find the right service among ~2,446 tiles across 240 departments," duplicate/near-duplicate tiles, no ID-readiness check — is a strong *structural* argument, but this primary pass could not independently source real quotes naming that specific failure mode. Reddit and Quora, the likeliest venues for "I couldn't find X in the app" venting, were both inaccessible to this session's tools. What primary evidence exists instead skews almost entirely toward **EPFO/OTP backend failures after the user has already found and opened the right service** — a related but distinct failure point (post-discovery, not discovery itself).

This does not contradict the secondary research's discovery thesis, but it means: if the team builds the intent-matching pitch, they currently have strong secondary/structural evidence for it and strong primary evidence for a different, adjacent pain point (EPFO transaction failures with no explanation or escalation path). Worth deciding whether to pivot the demo toward "explain the EPFO/OTP failure and give the right next step" (heavily evidenced) rather than pure discovery-matching (structurally argued, thin on real quotes from this pass).

## Signal strength

- **Strongest, best-evidenced cluster:** EPFO service failures after OTP entry ("Unexpected error occurred" / "technical error" loop), by a wide margin — six distinct named/dated App Store reviews plus one independent forum thread (TeamBlind) plus an aggregator stat showing the recent review stream is 73% one-star. This is real, recent (majority Apr–Oct 2025), and repeatedly described in the user's own words as a dead end with no explanation and no working support channel.
- **Weakest, thinnest cluster:** service-discovery / duplicate-tiles confusion — the exact complaint the secondary report's intent-matching idea is built on. No primary quotes surfaced in this pass; Reddit and Quora (most likely sources) were unreachable. This is a research-access gap, not evidence the complaint doesn't exist — a follow-up pass with working Reddit/Quora access, or manual browsing, is recommended before the team finalizes on pure "search/discovery" framing.
- **Net read:** primary evidence most strongly reinforces a **different but adjacent** angle to the secondary report — not "help me find the service" but "help me understand why the service just failed on me and what to do next" (the EPFO OTP/UAN failure loop). That angle fits the hackathon brief's "address the backend/process, not just redesign the screen" instruction arguably even more directly than pure discovery, and it has real, dated, quotable user pain behind it. Recommend the team weigh an EPFO-failure-explainer angle (in the spirit of Harshit's "Why is my money stuck?" and Varun's EPFO ideas) alongside or instead of pure intent-to-service matching, or fold both into one build: match intent to service AND explain the failure if that service then errors out.
