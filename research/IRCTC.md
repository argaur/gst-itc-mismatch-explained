# IRCTC — Research Brief

Researched 2026-08-24 for the "Build What Moves India" hackathon (backed by OpenAI / Varun Mayya). Platform: IRCTC (irctc.co.in, Rail Connect app). All facts below are sourced inline; anything not independently verifiable is flagged **[unverified]**.

---

## 1. What the platform actually does

IRCTC is the Indian Railways' ticketing arm, running the online booking layer over the Passenger Reservation System (PRS). Core user flows:

- **General quota booking** — opens 60 days before travel (advance reservation period). ([ixigo](https://www.ixigo.com/what-are-the-different-quotas-story-1183533))
- **Tatkal booking** — short-notice quota, opens exactly one day before travel: 10:00–10:10 AM for AC classes, 11:00–11:10 AM for non-AC classes. ([lastberth.com](https://lastberth.com/blog/irctc-premium-tatkal-booking-rules-fares))
- **Premium Tatkal** — a dynamic-pricing variant of Tatkal, price rises with demand, no concessions of any kind apply. ([lastberth.com](https://lastberth.com/blog/irctc-premium-tatkal-booking-rules-fares))
- **~19 total quotas** — General, Tatkal, Premium Tatkal, Ladies, Senior Citizen, Defence, Handicapped (HP), and others, each with different eligibility, timing, and berth-allocation rules. ([Ghumo.Live](https://www.ghumo.live/guides/irctc-quotas), [pratidintime.com](https://www.pratidintime.com/education/irctc-quotas))
- **PNR status / waitlist / RAC** — a booked-but-unconfirmed ticket shows WL (Waiting List) or RAC (Reservation Against Cancellation, a shared berth). Status can move WL → RAC → Confirmed as others cancel, up until chart preparation. ([SPYTM](https://spytm.com/blog/irctc-waiting-lists-chances-ticket-confirmation), [lastberth.com](https://lastberth.com/blog/irctc-pnr-status-check-meaning-guide))
- **Chart preparation** — happens roughly 4 hours before departure (railway board has also discussed moving this to 8 hours prior). Any ticket still WL at chart prep is auto-cancelled and the passenger cannot board. ([RailMitra](https://www.railmitra.com/blog/pnr-status-guide-how-to-handle-waitlisted-or-rac-tickets-smartly), [newsonair.gov.in](https://www.newsonair.gov.in/railway-board-to-prepare-reservation-charts-8-hours-prior-to-train-departure))
- **Cancellation / refund** — standard cancellation refunds run through IRCTC/bank; average turnaround cited by third-party guides is 5–7 working days for straightforward cases. ([rtiwala.com](https://rtiwala.com/content/how-to-get-refund-from-irctc/))
- **TDR (Ticket Deposit Receipt)** — the formal claim mechanism for refunds Railways owes but doesn't auto-process (train delayed 3+ hours and passenger didn't travel, AC failure, etc.). Must be filed ≥30 minutes before scheduled departure; only one TDR per PNR; processing can take up to 60 days. ([redbus.in](https://www.redbus.in/indian-railways/tdr-ticket-deposit-receipt), [Quora](https://www.quora.com/How-long-does-it-take-to-get-refund-from-IRCTC-for-the-TDR-filed))
- **Confirmation-probability prediction** — IRCTC and third parties (ConfirmTkt, RailYatri, RailTC) show a percentage chance a WL/RAC ticket will confirm, based on historical patterns (quota type, class, days-to-journey). Broad public rule of thumb: WL 1–15 ≈ 85%+ confirmation, WL 16–30 ≈ 55%, WL 60+ < 10% — but these are third-party estimates, not official guarantees, and users report the numbers diverging sharply from outcomes. ([Quora](https://www.quora.com/How-accurate-is-IRCTCs-confirmation-probability-feature), [citizennest.com](https://www.citizennest.com/guide/irctc-waiting-list-confirmation-chances))
- **Aadhaar-based OTP authentication (new, 2025)** — mandatory for Tatkal bookings from 1 July 2025 (Aadhaar-authenticated user) and OTP verification from 15 July 2025, across web, app, PRS counters, and authorised agents. From October 2025, Aadhaar verification became mandatory for booking more broadly. ([newsonair.gov.in](https://www.newsonair.gov.in/aadhaar-authentication-made-mandatory-for-online-tatkal-ticket-booking-from-july-15), [thebridgechronicle.com](https://www.thebridgechronicle.com/tech/irctc-tatkal-booking-aadhaar-authentication-rule-change-2025-mp99))

---

## 2. Where it concretely fails users today

### a) Tatkal server crashes / booking failures at open
- October 2025 (Diwali rush): IRCTC's website crashed just before Tatkal booking opened, leaving thousands of users frustrated. ([Business Standard, 17 Oct 2025](https://www.business-standard.com/india-news/diwali-rush-irctc-website-crashes-before-tatkal-bookings-users-frustrated-125101700604_1.html))
- April 2026: a fresh wave of Tatkal booking chaos — app crashes, endless buffering, failed transactions, delayed responses, bookings slipping straight to waitlist within seconds of opening. ([The Youth, 20 Apr 2026](https://www.theyouth.in/2026/04/20/irctc-responds-after-tatkal-booking-chaos-leaves-users-frustrated/), [postoast.com](https://www.postoast.com/irctc-responds-after-users-complain-about-tatkal-booking-crash-and-payment-failures))
- Demand vs capacity: during the Tatkal window, demand spikes to ~186,000–223,000 ticket requests/hour (200–400% surge). ([Travel And Tour World](https://www.travelandtourworld.com/news/article/irctc-tatkal-booking-crash-how-to-fix-failed-payments-and-app-errors-for-users/))
- IRCTC's own reported peak: 37,410 tickets booked in a single minute on 16 August 2025 (10 AM window); current stated capacity ~32,000 tickets/min against ~4 lakh (400,000) enquiries/min. A new PRS upgrade claims capacity of 1.5 lakh (150,000) tickets/min and 40 lakh enquiries/min. ([RailMitra](https://www.railmitra.com/blog/irctc-upgrade-boosts-capacity-1-25-lakh-tickets-per-min), [Business Today, 11 Aug 2026](https://www.businesstoday.in/latest/trends/photo/indian-railways-new-ticket-booking-system-will-be-5x-faster-heres-whats-changing-for-irctc-users-548374-2026-08-11))
- IRCTC processes over 18.4 lakh (1.84 million) tickets daily with peak concurrent loads exceeding 3 lakh (300,000) users — versus 29 tickets/day when the system first launched. ([Factly](https://factly.in/irctc-improvements-from-9-tickets-booked-in-a-day-to-13-lakh-tickets-irctc-has-come-a-long-way/))

### b) Money deducted, no ticket issued
- A recurring, IRCTC-acknowledged failure mode: payment gateway processes the debit but fails to communicate confirmation back to IRCTC in time, or a server/app error interrupts booking after payment — leaving the fare deducted with no PNR generated. IRCTC itself publishes an alert PDF on this exact issue. ([IRCTC official alert](https://contents.irctc.co.in/en/Alerts_mone_debited.pdf), [travelandtourworld.com](https://www.travelandtourworld.com/news/article/irctc-tatkal-booking-crash-how-to-fix-failed-payments-and-app-errors-for-users/))
- App-review aggregation confirms this is a top user complaint category: "payments debited without tickets and pending refunds," alongside login/OTP/e-wallet failures. Overall app sentiment analysis found ratings skew 83% unfavorable vs 12% positive. ([Kimola review analysis](https://kimola.com/reports/unveil-user-insights-irctc-rail-connect-app-review-analysis-google-play-hi-141076))

### c) Refunds and TDR are slow and manual
- Standard refund turnaround cited as 5–7 working days, but IRCTC "does not auto-resolve stuck refunds" — users must file a formal complaint with transaction ID/bank reference to trigger manual verification once the window passes. ([rtiwala.com](https://rtiwala.com/content/how-to-get-refund-from-irctc/))
- TDR claims (train delay, AC failure, etc.) require filing ≥30 minutes before departure — a hard, unforgiving deadline — and can take up to 60 days to resolve, longer if supporting documents are requested. Choosing the wrong TDR reason code causes automatic rejection. ([redbus.in](https://www.redbus.in/indian-railways/tdr-ticket-deposit-receipt), [Quora](https://www.quora.com/How-long-does-it-take-to-get-refund-from-IRCTC-for-the-TDR-filed))
- Escalation path for a genuinely stuck refund today is RTI (Right to Information) applications to the IRCTC PIO — i.e. citizens are resorting to a legal transparency mechanism just to get status on their own money. ([rtiwala.com](https://rtiwala.com/content/how-to-get-refund-from-irctc/))

### d) Bots and agents crowd out ordinary users during Tatkal
- CBI arrested a serving CBI technical staffer (Ajay Garg) and an associate (Anil Gupta) for building and selling "Neo," illegal Tatkal-booking software that bypassed IRCTC captcha, bypassed bank OTP, auto-filled forms, used proxy IPs, and allowed multiple simultaneous logins — enabling bulk bookings in far under the ~120 seconds a normal single booking takes. They charged travel agents ₹1,000–1,200 per use and were paid in bitcoin; many similar tools were reported to be under CBI scanner. ([Business Standard](https://www.business-standard.com/article/current-affairs/cbi-techie-nabbed-over-software-that-hacks-railways-tatkal-ticket-system-117122701039_1.html), [inuth.com](https://www.inuth.com/india/cbi-techie-arrested-for-making-software-to-aid-illegal-irctc-tatkal-bulk-bookings-took-payment-in-bitcoins/))
- More recent reporting: Tatkal bookings allegedly "hijacked in 60 seconds" via bots coordinated over WhatsApp/Telegram groups; during the first five minutes of a Tatkal window, up to 50% of login attempts are reported to be bot traffic. Users publicly describe the process as rigged ("System Rigged for Agents?"). ([Times Bull](https://www.timesbull.com/business/irctc-tatkal-ticket-scam-exposed-bookings-hijacked-in-60-seconds-via-whatsapp-telegram-537786.html), [Republic World](https://www.republicworld.com/india/netizens-slam-irctc-over-tatkal-scam-as-bots-and-agents-grab-tickets-in-seconds))
- Railways' response: from mid-2025, authorised agents are blocked from booking in the first 30 minutes of the Tatkal window (10:00–10:30 AM AC / 11:00–11:30 AM non-AC), plus the new Aadhaar+OTP authentication layer and CDN-backed anti-bot infrastructure. ([Upstox](https://upstox.com/news/business-news/latest-updates/trouble-booking-tatkal-tickets-through-travel-agents-indian-railways-new-anti-bot-move-explained/article-171823/))

### e) Waitlist/RAC status is opaque and confidence in predictions is low
- The gap between WL, RAC, and Confirmed, and what happens at chart preparation, is not explained in plain language on IRCTC's own status screen — third-party sites (RailMitra, SPYTM, lastberth.com) exist specifically to explain what a PNR status code means. ([RailMitra](https://www.railmitra.com/blog/pnr-status-guide-how-to-handle-waitlisted-or-rac-tickets-smartly))
- Confirmation-probability tools show a number (e.g. "42% chance") that users report diverging meaningfully from what actually happens; providers themselves disclaim these are statistical estimates only, not guarantees, and accuracy varies heavily by train/route/season/quota/class. ([Quora](https://www.quora.com/How-accurate-is-IRCTCs-confirmation-probability-feature))

### f) Quota system is confusing enough to cause booking errors
- 19 quotas exist (General, Tatkal, Premium Tatkal, Ladies, Senior Citizen, Defence, HP, etc.), each with different windows, eligibility, and interaction rules — e.g., there is a senior-citizen berth preference under General quota but explicitly **no** senior citizen, ladies, or disability concession under Tatkal or Premium Tatkal, a distinction that trips up users. ([Ghumo.Live](https://www.ghumo.live/guides/irctc-quotas), [Quora](https://www.quora.com/Is-there-a-senior-citizen-quota-in-Tatkal-Bookings))

---

## 3. Root causes — backend/process, not just UI

The hackathon explicitly wants a fix at the backend/process layer. Mapping each failure to its root cause:

| Failure | Root cause layer | Detail |
|---|---|---|
| Tatkal crashes | **Backend capacity / queueing** | Demand (186k–223k req/hr) vs. legacy PRS throughput (32k tickets/min stated capacity against 4 lakh enquiries/min) — a load-shedding/queue-fairness problem, not a screen problem. |
| Money deducted, no ticket | **Backend reconciliation pipeline** | Payment gateway ↔ IRCTC PRS confirmation handshake has no reliable synchronous acknowledgement; the reconciliation/refund-trigger process is manual after a timeout, not automatic. This is a process design gap, fixable without touching IRCTC's actual payment rails in a demo. |
| Slow refunds/TDR | **Manual verification backend + rigid rule engine** | "IRCTC does not auto-resolve stuck refunds" — a human/manual review step exists behind the scenes with no visible status pipeline for the citizen. TDR reason-code selection determines approval algorithmically, but the citizen has no way to see or reason through that logic before filing, so avoidable rejections happen. |
| Bots/agents grabbing tickets | **Rate-limiting / bot-detection architecture** (partially being fixed by Railways with Aadhaar+OTP, agent 30-min lockout, CDN anti-bot) | This is the government's own live infrastructure — off-limits to touch per hackathon rules, but the *citizen-facing gap it leaves behind* (a genuine user still doesn't know if they're competing against bots on a given route/train, or why they keep losing) is a legitimate build target. |
| Confusing WL/RAC/PNR status | **No decision-support layer over raw status data** | IRCTC exposes only a raw status code with no plain-language "what does this mean for me / should I book an alternative / when will I know" layer. Purely a synthesis/reasoning gap over public status data — very buildable. |
| Quota confusion | **No eligibility-reasoning layer** | The 19-quota rule matrix exists as static documentation, not as an interactive eligibility check integrated into the booking flow. |

---

## 4. What's already been tried, and why it's inadequate

- **ConfirmTkt, RailYatri, RailTC, ixigo Trains** — legitimate, IRCTC-API-integrated third-party apps that show confirmation probability and alternate-train suggestions. Useful, but: (a) probability estimates are acknowledged as unreliable/divergent from outcomes, (b) they don't explain *why* a ticket is stuck or fix the underlying reconciliation/refund process, they just add a prediction on top of the same opaque status. ([Quora](https://www.quora.com/How-accurate-is-IRCTCs-confirmation-probability-feature))
- **"Tatkal for Sure," "Magic Autofill" browser extensions, and bot software like "Neo"** — automate form-fill and in some documented cases bypass captcha/OTP and use proxy IPs/multiple logins. These are against IRCTC's terms (unauthorized software clause carries penalties up to ₹20,000, legal action, deregistration for agents) and in the CBI case, led to criminal prosecution. Inadequate because they are illegal/high-risk, actively contribute to the fairness problem rather than solving it, and are exactly the kind of private/unofficial workaround the hackathon brief prohibits building on top of. ([momoproxy.com](https://momoproxy.com/blog/automating-irctc-ticket-booking), [Quora](https://www.quora.com/If-we-use-Tatkal-for-sure-extension-for-ticket-booking-will-the-IRCTC-block-account-permanently))
- **Railways' own fixes (2025–2026)** — Aadhaar+OTP authentication, agent 30-minute lockout at Tatkal open, CDN-backed anti-bot infrastructure, and a claimed 5x PRS capacity upgrade. These target the bot/capacity problem at the infrastructure level but do nothing for the refund reconciliation gap, the plain-language status gap, or the quota-eligibility confusion — all still open. ([Upstox](https://upstox.com/news/business-news/latest-updates/trouble-booking-tatkal-tickets-through-travel-agents-indian-railways-new-anti-bot-move-explained/article-171823/), [Business Today](https://www.businesstoday.in/latest/trends/photo/indian-railways-new-ticket-booking-system-will-be-5x-faster-heres-whats-changing-for-irctc-users-548374-2026-08-11))

---

## 5. Buildathon fit assessment

Overall: **strong fit for a narrow slice, weak fit for anything simulating live Tatkal contention or payments.**

Good candidates use only synthetic/mock data and reasoning logic:
- Synthetic PNR records (status: CNF/RAC/WL, quota type, coach/berth, days-to-journey, chart-prep timestamp).
- Synthetic refund/TDR ledger (payment debit timestamp, PRS confirmation timestamp or null, refund-trigger timestamp, refund-credit timestamp, TDR reason code, TDR filing timestamp vs. departure timestamp).
- Synthetic quota-eligibility matrix (passenger attributes → quota → berth-preference rules).
- Synthetic train schedule/route data (for a plain-language "what does WL 23 GNWL mean for my specific train" explainer).

Bad candidates for a 3-day mock build: anything requiring live Tatkal-second-level contention simulation at IRCTC's real scale, or anything that touches actual payment gateway behavior — both would either require live systems (against the rules) or would not demo convincingly as synthetic data.

**Do not build:** a faster/better Tatkal booking bot (illegal territory, already prosecuted precedent, explicitly against hackathon's "no undocumented private APIs" rule) or a live PNR-status scraper (would require querying real IRCTC/NTES, against the "no touching live government systems" rule — must use a synthetic PNR dataset instead).

---

## 6. Candidate "fix the failing moment" problem statements

### A. "My money is gone. Where is my ticket?"
A passenger tries to book Tatkal at 10:00:03 AM, sees a spinner, and 90 seconds later gets a payment-success SMS from their bank — but no PNR, no ticket, no confirmation email. IRCTC's own published alert acknowledges this exact "money debited but ticket not booked" failure mode as a known, recurring event, driven by the payment gateway confirming the debit without a synchronous handshake back to the PRS booking engine before the Tatkal quota fills. Independent app-review analysis places "payments debited without tickets, pending refunds" among the most common user complaints on the Rail Connect app, contributing to an overall 83% unfavorable rating skew. Today the passenger's only recourse is to wait 24–48 hours for an automatic reversal, and if that doesn't happen, manually raise a complaint with transaction ID and bank reference for a human to reconcile — with no visible status of where their money actually is in that reconciliation pipeline in the meantime. **Strong buildathon fit:** the whole failure and fix live entirely in a mock reconciliation pipeline — a synthetic ledger of (debit timestamp, PRS booking-attempt timestamp, PRS confirm/fail response, refund-trigger state) — and the valuable deliverable is a state machine that tells the passenger in plain language exactly which of the 4-5 known failure points their transaction is stuck at and what happens next, instead of a black box.

### B. "Is my TDR going to be rejected before I even file it?"
A passenger's train is delayed 3 hours 40 minutes; they decide not to travel and go to file a TDR for a refund. The rule requires the claim to be filed at least 30 minutes before the train's *scheduled* (not delayed) departure time — a deadline many passengers only discover after they've missed it, at which point the claim is auto-rejected regardless of how legitimate the delay was. Selecting the wrong reason code from IRCTC's TDR dropdown is a second, separate way to get auto-rejected, and there is no guidance shown to the passenger about which code fits their situation before they submit. TDR processing then takes up to 60 days even when correctly filed. This is a case where the government's own rule engine already knows, deterministically, whether a claim will be accepted — but that logic is invisible to the citizen until after they've committed. **Strong buildathon fit:** the entire idea is a synthetic TDR-eligibility checker — mock train-delay data plus the passenger's ticket and intended claim reason — that runs the same accept/reject rules IRCTC would apply *before* filing, tells the passenger their real deadline in a countdown, and pre-selects the correct reason code, turning a 60-day gamble into an upfront yes/no with the reason why.

### C. "Why is my ticket still WL 46, and what should I actually do right now?"
A passenger booked a Sleeper ticket 25 days out and is sitting at WL 46 with 2 days to departure. IRCTC's own status page shows only the raw code; understanding what it means requires cross-referencing third-party explainer sites for how WL becomes RAC becomes Confirmed, when chart preparation happens (roughly 4 hours before departure), and rule-of-thumb confirmation odds that vary wildly by quota, class and season (WL 1-15 is quoted around 85%+, but WL 60+ under 10%, with providers explicitly disclaiming these as unreliable estimates that users report diverging from real outcomes). The passenger has no idea, in their own words, whether to keep waiting, book an alternate train now, or start a Tatkal fallback plan, and by the time chart preparation confirms they didn't get a berth, the alternatives have often filled up too. **Good buildathon fit:** built entirely on a synthetic PNR + historical-confirmation dataset (no live scraping needed), the product is a reasoning layer that turns a bare status code into "you will almost certainly not get a seat, here are 3 concrete actions and the exact time by which you must take each one" — decision support, not a reskinned status checker.

### D. "Which of these 19 quotas do I actually qualify for, and did I just book myself out of a seat?"
A senior citizen traveling with their disabled adult child tries to book a Tatkal ticket assuming their usual General-quota senior/disability berth preference will still apply, books normally, and only later learns Premium Tatkal and Tatkal explicitly carry zero concessions of any kind for seniors, ladies, or persons with disability — a rule buried in fine print that is not surfaced anywhere in the booking flow itself. With 19 distinct quotas (General, Tatkal, Premium Tatkal, Ladies, Senior Citizen, Defence, HP, and more), each with different windows and eligibility interactions, passengers routinely default to whichever quota the app defaults them into rather than the one that actually maximizes their chances or benefits. **Good buildathon fit:** the quota rule matrix is small, static, and fully mockable as structured data; the build is an eligibility-and-recommendation reasoning layer ("given who you are and when you're traveling, here is the quota that actually helps you, and here is what you'd lose by picking Tatkal instead") integrated as a pre-booking check rather than a document to go read.

### E. "Am I actually competing with a bot right now?"
During the first 5 minutes of a Tatkal window, up to half of login/booking attempts are reported to be automated bot traffic, and CBI has prosecuted at least one operator of illegal captcha/OTP-bypassing bulk-booking software sold to travel agents. Ordinary users experience this only as "tickets vanished in seconds" with no visibility into why — fueling both frustration and, per public commentary ("System Rigged for Agents?"), a trust collapse in the system's fairness even where Railways has already deployed countermeasures (Aadhaar+OTP, agent lockout windows, CDN anti-bot). This is the weakest candidate of the five for a hackathon build: the actual anti-bot fight is Railways' live infrastructure, off-limits under the "no touching live systems" rule, and a synthetic demo can only *narrate* bot competition rather than let a user experience or fix it — it would demo as an explainer dashboard, not a moment being fixed. Include only as a stretch/secondary angle, not the primary build.

---

## Recommendation signal for the team
**B (TDR pre-check) and A (payment reconciliation tracker)** are the tightest fits: both are fully synthetic, both are explicitly backend/process fixes (a reconciliation state machine and a rules-engine pre-check) rather than UI reskins, and both map directly to IRCTC's own documented, acknowledged failure modes. **C (WL/RAC decision support)** is a close third with broader everyday relevance and the most demoable "aha" moment. D and E are secondary/stretch angles.

---

## Sources
- [Business Standard, 17 Oct 2025 — Diwali rush IRCTC crash](https://www.business-standard.com/india-news/diwali-rush-irctc-website-crashes-before-tatkal-bookings-users-frustrated-125101700604_1.html)
- [The Youth, 20 Apr 2026 — IRCTC Tatkal booking chaos](https://www.theyouth.in/2026/04/20/irctc-responds-after-tatkal-booking-chaos-leaves-users-frustrated/)
- [Postoast — IRCTC responds to booking crash](https://www.postoast.com/irctc-responds-after-users-complain-about-tatkal-booking-crash-and-payment-failures)
- [Travel And Tour World — IRCTC Tatkal booking crash fix guide](https://www.travelandtourworld.com/news/article/irctc-tatkal-booking-crash-how-to-fix-failed-payments-and-app-errors-for-users/)
- [RailMitra — IRCTC 1.25 lakh tickets/min upgrade](https://www.railmitra.com/blog/irctc-upgrade-boosts-capacity-1-25-lakh-tickets-per-min)
- [Business Today, 11 Aug 2026 — New PRS 5x faster](https://www.businesstoday.in/latest/trends/photo/indian-railways-new-ticket-booking-system-will-be-5x-faster-heres-whats-changing-for-irctc-users-548374-2026-08-11)
- [Factly — IRCTC ticket volume history](https://factly.in/irctc-improvements-from-9-tickets-booked-in-a-day-to-13-lakh-tickets-irctc-has-come-a-long-way/)
- [IRCTC official alert PDF — money debited, ticket not booked](https://contents.irctc.co.in/en/Alerts_mone_debited.pdf)
- [Kimola — IRCTC Rail Connect app review analysis](https://kimola.com/reports/unveil-user-insights-irctc-rail-connect-app-review-analysis-google-play-hi-141076)
- [rtiwala.com — How to get IRCTC refund / RTI route](https://rtiwala.com/content/how-to-get-refund-from-irctc/)
- [redbus.in — TDR guide](https://www.redbus.in/indian-railways/tdr-ticket-deposit-receipt)
- [Quora — TDR refund timeline](https://www.quora.com/How-long-does-it-take-to-get-refund-from-IRCTC-for-the-TDR-filed)
- [Business Standard, 2017 — CBI techie arrest, "Neo" software](https://www.business-standard.com/article/current-affairs/cbi-techie-nabbed-over-software-that-hacks-railways-tatkal-ticket-system-117122701039_1.html)
- [inuth.com — CBI techie arrest, bitcoin payment detail](https://www.inuth.com/india/cbi-techie-arrested-for-making-software-to-aid-illegal-irctc-tatkal-bulk-bookings-took-payment-in-bitcoins/)
- [Times Bull — Tatkal bookings hijacked in 60 seconds](https://www.timesbull.com/business/irctc-tatkal-ticket-scam-exposed-bookings-hijacked-in-60-seconds-via-whatsapp-telegram-537786.html)
- [Republic World — "System Rigged for Agents?"](https://www.republicworld.com/india/netizens-slam-irctc-over-tatkal-scam-as-bots-and-agents-grab-tickets-in-seconds)
- [Upstox — Railways' anti-bot agent lockout](https://upstox.com/news/business-news/latest-updates/trouble-booking-tatkal-tickets-through-travel-agents-indian-railways-new-anti-bot-move-explained/article-171823/)
- [newsonair.gov.in — Aadhaar authentication mandatory for Tatkal](https://www.newsonair.gov.in/aadhaar-authentication-made-mandatory-for-online-tatkal-ticket-booking-from-july-15)
- [thebridgechronicle.com — Aadhaar verification mandatory Oct 2025](https://www.thebridgechronicle.com/tech/irctc-tatkal-booking-aadhaar-authentication-rule-change-2025-mp99)
- [Quora — Confirmation probability accuracy](https://www.quora.com/How-accurate-is-IRCTCs-confirmation-probability-feature)
- [citizennest.com — WL confirmation chance rules of thumb](https://www.citizennest.com/guide/irctc-waiting-list-confirmation-chances)
- [RailMitra — PNR/RAC/WL status guide](https://www.railmitra.com/blog/pnr-status-guide-how-to-handle-waitlisted-or-rac-tickets-smartly)
- [Ghumo.Live — IRCTC quotas explained](https://www.ghumo.live/guides/irctc-quotas)
- [Quora — Senior citizen Tatkal quota confusion](https://www.quora.com/Is-there-a-senior-citizen-quota-in-Tatkal-Bookings)
- [momoproxy.com — IRCTC automation tools 2026](https://momoproxy.com/blog/automating-irctc-ticket-booking)
- [Quora — "Tatkal for Sure" extension ToS risk](https://www.quora.com/If-we-use-Tatkal-for-sure-extension-for-ticket-booking-will-the-IRCTC-block-account-permanently)
