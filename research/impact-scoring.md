# Impact scoring: every candidate problem, one rubric

Compiled 2026-08-24. Purpose: give Kriti + Gaurav one apples-to-apples comparison across all 10 platforms before locking a platform + problem. Extends (does not replace) the top-5 shortlist from `memory/project.md` — the original five are re-scored under the same rubric alongside every other candidate.

Sources: live brief fetched this session (see below), all 20 files in `research/` + `research/primary/`, project `CLAUDE.md`, `memory/decisions.md`, `memory/project.md`.

---

## 1. The brief, fetched fresh (2026-08-24)

`https://buildwhatmovesindia.com/brief` blocks WebFetch (HTTP 403); the full text was pulled via a live Chrome session on 2026-08-24. The FAQ page was pulled the same way.

**Judging criteria, verbatim from the live brief:**

1. **Problem** — "Is this a real and important user problem?"
2. **Working build** — "Does the main journey actually work?"
3. **Usability** — "Is the experience simpler, clearer and more accessible?"
4. **Product thinking** — "Are the choices thoughtful and well explained?"
5. **End-to-end thinking** — "Does the solution address the backend, infrastructure and processes, not just the interface?"
6. **Honesty** — "Are limitations, mock data and dependencies clearly disclosed?"

**Other selection-relevant brief language:** "Pick one real problem you have faced"; "Solve one clearly defined user problem"; "Let us complete the main journey from start to finish"; "A static design is not enough"; "Be designed for real Indian users, including people on mobile devices, slower connections or with limited digital experience"; "Use mock or synthetic data wherever personal information, payments, OTPs or government systems would normally be involved"; "How could the idea work safely at a larger scale?"; Codex "should be a meaningful part of how you build it"; video minute one must "demo the project as a citizen."

### ✅ Verified 2026-08-24 — resolved against the live site, the FAQ page, and Varun Mayya's own explainer video

Checked directly (live Chrome session) against `buildwhatmovesindia.com/brief`, `buildwhatmovesindia.com/faq`, and the YouTube video "Build What Moves India: Rules & How to Participate" (Varun Mayya, posted 2026-08-21, transcript read in full).

| Fact | Old repo value | Confirmed value | Source |
|---|---|---|---|
| Submission deadline | Aug 27, 2026 | **Aug 28, 2026, 8:00 PM IST, no grace period** | brief page, FAQ page, and video (0:32-0:35) all agree |
| Finale | Sep 5–6, 2026 (filmed shoot Sep 6) | **Sep 12, 2026, Bengaluru, filmed not live-streamed, winners announced same day** | FAQ page and video (9:35-9:53) agree |
| Selection process | (not recorded) | **Two stages: top 250 shortlisted Aug 28–Sep 1, one week of WhatsApp mentorship with 5 mentors, improved build resubmitted by Sep 7 using the same registered emails, top 10 finalists announced Sep 8–12** | FAQ page and video (6:31-8:20) agree |
| Team size | 2 max (repo already correct) | **Confirmed strictly 2**, explicitly to fairly allocate prizes/mentor time/MacBooks/SF trip; groups of more than 2 must split into separate teams | video pinned comment + FAQ |
| Platform list | Narrowed to 10 named platforms as of 2026-08-24 | **Video confirms "pick one of the 10 public service platforms" shown on an on-screen graphic at 0:27-0:31** — the on-screen platform names themselves could not be captured (video playback stalled repeatedly in the automated browser session at that exact timestamp; not re-attempted further given diminishing returns). Off-list problems are explicitly allowed too, just judged at lower odds since the review team is less familiar with them. The live brief/FAQ pages carry **no fixed list at all** — they call IRCTC/EPFO/Income Tax "examples, not a fixed list," meaning the 10-platform constraint exists only in the video graphic, not in the durable brief text. |

CLAUDE.md has been updated with the confirmed deadline/finale/selection facts. The exact 10 platform names shown on-screen in the video remain unconfirmed pixel-for-pixel — if this repo's existing 10-name list (IRCTC, Income Tax, CPGRAMS, GST, EPFO, MCA, Cyber Crime, UMANG, Parivahan, RTI) turns out to mismatch the video's graphic, the safest fallback per the brief's own language is that off-list platforms are still eligible, just scored more cautiously by reviewers unfamiliar with them.

---

## 2. The rubric

Six weighted factors, each derived from specific brief language. Scores are integers 1–5. Weighted total is out of 100.

| # | Factor | Weight | Derived from (brief language) | 5 means / 1 means |
|---|---|---|---|---|
| F1 | **Problem reality & severity** | 25 | "Is this a real and important user problem?"; "Pick one real problem" | 5 = hard numbers + dense primary complaint trail + high personal stakes. 1 = inferred/anecdotal. |
| F2 | **Complete-journey demoability** | 20 | "Let us complete the main journey from start to finish"; "A static design is not enough"; video min 1 = citizen demo | 5 = a citizen goes from failing moment to resolved outcome inside the prototype (mocked backends allowed). 1 = demos as a dashboard, lookup table, or explainer. |
| F3 | **Backend/process depth** | 20 | "Does the solution address the backend, infrastructure and processes, not just the interface?" | 5 = builds a missing process layer (state machine, reconciliation, verification gate). 1 = reskin/search-bar fix. |
| F4 | **Mockability & rule compliance** | 15 | "Use mock or synthetic data wherever personal information, payments, OTPs or government systems would normally be involved"; the full "What not to do" list | 5 = whole build runs on synthetic data, no live-system temptation. 1 = only convincing with live data. |
| F5 | **Legible improvement** | 10 | "Be easier to understand or use than the current experience"; "Why is your version better?"; "real Indian users… limited digital experience" | 5 = the before/after is obvious to a judge in seconds. 1 = improvement needs domain literacy to appreciate. |
| F6 | **AI/Codex leverage** | 10 | Prototype "built with Codex or powered by an OpenAI model… a meaningful part of how you build it, not something added only for the submission" | 5 = an OpenAI model does the load-bearing reasoning (parse legal text, classify, reconcile, draft). 1 = CRUD with a chatbot bolted on. |

Not scored, tracked as flags: **overlap with the sister team (Harshit + Varun)** and **crowding risk** (how likely other teams pick the same obvious problem). Both are tie-breakers, not score components.

---

## 3. Full scored table — 29 candidates, all 10 platforms

`●` = one of the original 5 shortlisted problems, re-scored under this rubric.

| Rank | ID | Platform | Candidate problem | F1 | F2 | F3 | F4 | F5 | F6 | **Total** | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1= | C1 ● | Cyber Crime | Innocent account frozen, no notice/SLA → guided release path (RTI draft, bank letter, NOC/SLA tracker) | 5 | 4 | 5 | 5 | 5 | 4 | **94** | Holds #1 — conditional on Harshit overlap (open) |
| 1= | G1 ● | GST | Automated DRC-01B/01C notice, no officer → decode vs ledger, assign fault, draft the right reply | 5 | 4 | 5 | 5 | 4 | 5 | **94** | Rises to co-#1 — best AI leverage in the field |
| 3 | P1 ● | Parivahan | RC transfer stalls; status hides that the seller is still legally liable → staged tracker + liability shield | 5 | 4 | 5 | 5 | 4 | 3 | **90** | Holds #3 |
| 4 | P2 | Parivahan | e-Challan misissued (ANPR misread) → evidence-checked dispute triage + auto-drafted challenge | 4 | 4 | 4 | 5 | 5 | 5 | **87** | **New entrant** — under-weighted by earlier shortlist |
| 5 | I1 ● | IRCTC | Money debited, no ticket → reconciliation state machine with visible failure point | 5 | 4 | 4 | 5 | 4 | 3 | **86** | Holds ~#5; crowding-risk tiebreak down |
| 6= | R2 | RTI | Wrong-authority filing + doomed drafting → route right, validate draft, track through transfer ("filed right the first time") | 4 | 4 | 4 | 5 | 4 | 5 | **85** | Reframed RTI pick — replaces R1 |
| 6= | I2 ● | IRCTC | TDR trap: wrong dropdown → auto-reject or account lockout → pre-flight verdict before filing | 4 | 4 | 4 | 5 | 4 | 3 | **85** | Pairs with I1 (shortlist treated them as one) |
| 8= | T1 | Income Tax | AIS mismatch (double-counted interest, wrong PAN) → reconciliation engine before filing | 4 | 4 | 4 | 5 | 4 | 4 | **83** | Strong, but headline stat (42 lakh notices) unverified |
| 8= | T2 | Income Tax | "Is this notice scary or routine?" → classify + plain-language next step + deadline | 4 | 4 | 3 | 5 | 5 | 5 | **83** | Strong demo, thinner process depth |
| 10 | E1 | EPFO | Claim rejected on unseen mismatch (26% rate) → pre-flight check + auto-drafted fix artifact | 5 | 4 | 3 | 5 | 4 | 3 | **82** | Overlap: Varun's EPFO idea; static-lookup risk he flagged himself |
| 11= | G2 | GST | Supplier's late filing costs the buyer's ITC → early-warning watch on vendor filing status | 3 | 4 | 5 | 5 | 4 | 3 | **80** | Fold into G1, weak standalone primary evidence |
| 11= | CP1 | CPGRAMS | "Disposed doesn't mean done" → ATR substantive-match check + auto-drafted appeal | 3 | 4 | 4 | 5 | 4 | 5 | **80** | Overlap: Harshit's exact idea; thinnest primary trail of all 10 |
| 13= | C2 | Cyber Crime | "Disposed" status decoder → plain meaning + specific next action | 4 | 3 | 4 | 5 | 4 | 4 | **79** | Fold into C1 |
| 13= | R1 ● | RTI | Second appeal vanishes into commission backlog → wait estimator + return-proof appeal draft | 4 | 3 | 4 | 5 | 4 | 4 | **79** | **Downgraded out of top 5** — payoff invisible in a demo; fold into R2 |
| 15 | C3 | Cyber Crime | Golden-hour fund trail → hop-by-hop freeze status for the victim's money | 4 | 4 | 4 | 4 | 4 | 3 | **78** | Fold into C1 |
| 16 | T3 | Income Tax | Refund stuck 90+ days → which internal stage, which action unblocks it | 4 | 3 | 4 | 5 | 4 | 3 | **77** | Demo payoff is a status page |
| 17= | CP2 | CPGRAMS | Complaint reclassified as "suggestion/query" to dodge review → mislabel detector | 3 | 3 | 4 | 5 | 4 | 5 | **76** | Single documented case (RBI); fold into CP1 if ever picked |
| 17= | U1 | UMANG | 2,446 services indexed by department → intent-to-service match + ID pre-flight (Gaurav's idea) | 3 | 4 | 3 | 5 | 4 | 5 | **76** | "Why not fix the search bar" attack; discovery pain has no primary quotes |
| 19 | R3 | RTI | Fee debited, no registration number (2013→2026) → payment reconciliation recovery | 4 | 3 | 4 | 5 | 4 | 2 | **75** | Sharp moment, narrow product |
| 20= | M3 | MCA | Name rejected with no clue which name clashed → phonetic + trademark clash diagnostic | 3 | 4 | 3 | 5 | 4 | 4 | **74** | Niche audience (founders) |
| 20= | U2 | UMANG | EPFO OTP dead-end inside the app → pre-flight Aadhaar-mobile mismatch diagnosis | 4 | 3 | 4 | 4 | 4 | 3 | **74** | Overlap-adjacent: it's an EPFO fix wearing UMANG's badge |
| 22 | E2 | EPFO | EPS pension eligibility gaps surface only after exit (irreversible) → pre-flight while employed | 3 | 4 | 4 | 4 | 4 | 3 | **73** | Weak primary evidence for EPS specifically |
| 23 | R4 | RTI | One-line "exempt under Section 8" rejection → legality check + appeal grounds | 3 | 3 | 3 | 5 | 4 | 5 | **72** | Component, not a product |
| 24= | G3 | GST | Suo moto cancellation cliff → countdown + cheapest path back | 3 | 3 | 4 | 5 | 4 | 2 | **70** | Killed standalone: countdown = dashboard |
| 24= | M1 | MCA | Director disqualification early warning (14,000+ in 2025) | 3 | 3 | 4 | 5 | 4 | 2 | **70** | **Downgraded**: headline stat is search-synthesis, no primary voice, demos as dashboard |
| 24= | M2 | MCA | V3 "filed but not real" → true SRN-lifecycle status checker | 4 | 3 | 4 | 4 | 3 | 2 | **70** | Best MCA evidence, worst citizen-demo shape (audience = professionals) |
| 27= | P3 | Parivahan | Payment succeeded, status pending 24–72h → reconciliation diagnosis | 3 | 3 | 4 | 5 | 3 | 2 | **68** | Killed standalone |
| 27= | P4 | Parivahan | DL/LL test opaque rejections + slot chaos → decode the failure mode | 4 | 3 | 3 | 4 | 3 | 3 | **68** | Real fix is offline (RTO behavior) |
| 29 | I3 | IRCTC | WL/RAC decision support → "what should I actually do right now" | 3 | 4 | 3 | 4 | 3 | 3 | **67** | Killed: ConfirmTkt et al already exist |

---

## 4. Adversarial pass — attacks on the top candidates

Each of the top-ranked problems was argued against before the ranking was finalized.

**C1 — Cyber Crime innocent freeze (survives at #1, conditional).**
- *Attack: the resolution is offline (cyber cell, bank, magistrate) — isn't the product just a document generator?* Partial hit. The counter is the brief itself: "Use mock data, accounts and backend behavior where production access would be unsafe or unavailable." Mock the bank + cyber-cell backends so the demo completes the journey (freeze → diagnosis → evidence upload → NOC → release, with an SLA clock). If the build ships only letter templates, judges will see through it — the case-state machine is the product.
- *Attack: is the evidence real?* Yes, the strongest of all 29: both research passes independently rank it first; a 2,434-upvote first-person recovery thread; CBI's 8.5 lakh mule-account figure; dozens of near-identical threads across 8+ banks.
- *Unresolved external risk:* direct overlap with Harshit's "why is my account frozen" idea. Not resolvable by scoring — see §6.

**G1 — GST notice decoder (survives at co-#1).**
- *Attack: judges must understand GSTR-1/2B/3B inside a 60-second citizen demo.* Real risk. Mitigation: open the demo with the Karnataka persona — a flower seller who has never opened gst.gov.in gets an 18,000-notices-style UPI-triggered demand — before showing the registered-trader flow. That framing needs zero tax literacy.
- *Attack: ClearTax/GSPs/CAs already do this.* They serve the paying, tax-literate segment. No free tool takes a specific received notice and answers "do I actually owe this, whose fault is it, which form, by when." The four CAclubindia threads spanning 2019–2026 are the proof the gap persists.
- *Attack: is the AI real or garnish?* The most defensible AI story of the field: parse a legal notice, reconcile against a ledger, assign fault, draft DRC-03 vs DRC-06. Codex/OpenAI is load-bearing.

**P1 — RC transfer seller liability (survives at #3).**
- *Attack: the product cannot make the RTO transfer the RC.* True — so the build must be diagnosis + protection, not resolution theater: which stage is stuck, what the seller is exposed to today, and the auto-drafted intimation pack that shifts liability (the thing the arrest-warrant poster needed four years earlier). Journey completes against a mocked RTO pipeline.
- *Attack: evidence?* Excellent — CAG-audited pipeline numbers plus the single most visceral primary story in the research (bail bond, 374 upvotes; an 800+ day case where CPGRAMS and NCH both closed without action).

**P2 — e-Challan dispute triage (survives; the pass's one genuine new entrant).**
- *Attack: "narrow — dispute triage only."* Under this brief, bounded is a feature: the journey (challan arrives → plate-photo vs RC evidence check → verdict with confidence → drafted dispute → tracked outcome) completes start-to-finish. A vision model reading the challan photo against the registered plate is honest, demo-visible OpenAI usage.
- *Attack: evidence?* CAG's 3.8% forwarding stat + independent near-identical misread complaints in five cities + the issuing authority itself cancelling 69 wrong challans.

**I1+I2 — IRCTC debit-no-ticket + TDR trap (survives on evidence, demoted as a pick).**
- *Attack: this is the most famous portal on the list — the likely default pick for hundreds of teams; a debit-no-ticket demo risks drowning in a pile of identical submissions.* Not a rubric factor, but a real Stage-1 (250-shortlist) risk. Also Railways is actively shipping fixes (new PRS, anti-bot, capacity). Evidence remains top-tier; the TDR-lockout wedge is the differentiated part if the team goes here.

**R2 — RTI filed-right-the-first-time (survives with a flag).**
- *Attack: a free AI RTI drafter already exists (righttoinformation.wiki).* Direct hit on the drafting half. Differentiation must be the combination: authority routing before money changes hands (the portal's own FAQ admits misdirected fees are simply lost) + draft validation against legal rejection patterns + transfer/appeal tracking. Drafting alone is dead on arrival.

**R1 — RTI second-appeal backlog (downgraded out of the top 5).**
- The failing moment is real and superbly evidenced (4 lakh pending, 29-year modeled queue, 38% CIC returns) — but the prototype cannot resolve it. A wait-time estimator demos as a dashboard, the exact shape the brief warns against ("a static design is not enough"). Its useful parts (return-proof appeal drafting) fold into R2.

**M1 — MCA disqualification early warning (downgraded).** The 14,000+ figure is flagged in `research/MCA.md` as search-synthesis; the primary pass found no first-person voice for this cluster; and an early-warning product demos as a dashboard. MCA's best evidence (V3 breakage, M2) has the wrong audience shape for a "citizen journey."

**T1 — AIS mismatch (held at 8 with a caveat).** The 42-lakh figure "surfaced via an aggregated search-result summary" and is explicitly flagged in `research/IncomeTax.md` as needing a direct source before it goes in any pitch. Verify before committing.

**Killed as standalone builds:** G3, I3, P3, P4, C2, C3, R4 (fold-ins or below the bar). **Excluded by overlap, not by merit:** CP1 (Harshit's exact idea), E1 (Varun's EPFO idea), U2 (EPFO failure wearing UMANG's badge).

---

## 5. Re-ranked top picks

1. **C1 — Cyber Crime: guided release for the innocently frozen account (94).** Best evidence in the field, real process fix, fully synthetic, high emotional stakes. *Pick only after the Harshit conversation (§6).*
2. **G1 — GST: decode the automated notice, draft the right reply (94).** The clean-room co-#1: zero overlap with the sister team, lowest crowding risk of the top tier, and the strongest "Codex is load-bearing" story. If the overlap talk goes badly, this is the pick.
3. **P1 — Parivahan: RC-transfer liability shield (90).** The most visceral story (arrest warrant, bail bond) and a true staged-process fix.
4. **P2 — Parivahan: e-challan evidence-checked dispute (87).** New entrant; tightest bounded journey; vision-model demo moment.
5. **I1+I2 — IRCTC: debit-no-ticket + TDR pre-flight (86/85).** Top-tier evidence, but the highest same-idea crowding risk in the hackathon.
6. **R2 — RTI: filed right the first time (85).** Good, provided the pitch is routing + validation + tracking, not drafting (which already exists free).

---

## 6. Open questions (not resolved here — for Kriti + Gaurav)

1. **Cyber Crime × Harshit overlap — still open.** Rank-1 C1 directly overlaps Harshit's "Why is my account frozen?" idea from the shared sheet. `memory/project.md` already flags this: talk to the other team before committing. Options: (a) they're not building it → proceed; (b) they are → take G1, which is co-equal on score and has zero overlap; (c) both build it with agreed different wedges (their diagnosis vs. our guided release) — risky in a judged field.
2. **Brief-fact discrepancies (§1).** Confirm the real deadline (site says Aug 28 8 PM IST, repo says Aug 27), the finale date (site: Sep 12 Bengaluru), and the source/authority of the 10-platform list, which is absent from the live site.
3. **T1's 42-lakh stat** must be traced to a primary source before appearing in any pitch material.

---

## 7. Method notes

- Scoring: single Fable 5 pass, 2026-08-24, integers 1–5 per factor, weighted to /100. No new external research beyond the live brief/FAQ fetch; every evidence claim traces to `research/*.md` or `research/primary/*.md`.
- The adversarial pass (§4) ran after initial scoring; it changed rankings only via the R1 downgrade and the I1/I2 crowding note — scores themselves were set before the pass and not retro-fitted.
- Companion artifact: "Ten Portals, Ten Failures" (same URL as before), tab 3 "Finalizing Problem Statement" mirrors this file.
