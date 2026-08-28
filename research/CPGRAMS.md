# CPGRAMS Research — Build What Moves India

Platform: Centralised Public Grievance Redress and Monitoring System (pgportal.gov.in), run by DARPG (Dept. of Administrative Reforms and Public Grievances). Researched 2026-08-24. Secondary research only, no live scraping of the portal.

---

## 1. What the platform actually does

**Core flow:**
1. **File a grievance.** A citizen registers on pgportal.gov.in (or a department-specific mirror like EPFiGMS, CPENGRAMS for pensioners, or state portals), selects a ministry/department, writes a free-text complaint, optionally attaches documents. No login/Aadhaar mandatory for filing in most flows. ([pgportal.gov.in](https://pgportal.gov.in/))
2. **Routing.** The grievance is auto/manually routed to a Grievance Redressal Officer (GRO) inside the relevant ministry/department — over 1.11 lakh GROs are mapped as of 2025, up from 10,232 in 2014. ([PIB via search, 2026](https://x.com/PIB_India/status/1951150891362648293))
3. **Resolution window.** Statutory target is 21 days (tightened from 30, and DARPG has referenced a 45-day "outer limit" in older guidance); actual average disposal time nationally has fallen from 157 days (2014) to ~13–15 days (2024–2025) per DARPG's own monthly reports. ([pgportal.gov.in preview doc](https://pgportal.gov.in/Home/Preview/T21SZWR1Y3Rpb25PZlJlZHJlc3NhbFRpbWVMaW1pdFRvNDVEYXlzLnBkZg%3D%3D); [newsonair.gov.in, Nov 2025](https://www.newsonair.gov.in/central-ministries-resolve-over-1-44-lakh-grievances-in-october-cpgrams-report))
4. **"Disposed" status + Action Taken Report (ATR).** The GRO closes the case with a mandatory ATR text field. There is no system-level check that the ATR text substantively addresses the complaint — it is a free-text field the GRO fills in.
5. **Feedback.** After closure, the complainant can rate the resolution (Good/Average/Poor). A separate DARPG **Feedback Call Centre** also proactively phone-surveys a sample of closed cases — 19,74,594 surveys completed through Dec 2024, 78,830 more in May 2026 alone. ([search result, PIB/DARPG data](https://vajiramandravi.com/current-affairs/centralised-public-grievance-redress-and-monitoring-system-cpgrams/); [Cavalier, Jun 2026](https://www.cavalier.in/cds-ota-current-affairs/2026-06-23/cpgrams-grievance-redress-2026))
6. **Appeal to Appellate Authority.** If the complainant rates the closure **"Poor,"** an "Appeal" option unlocks on that same grievance ID. This routes to an officer senior to the GRO (ministry's Nodal Appellate Authority is typically Additional/Joint Secretary rank), with its own 30-day target. Up to ~5 escalation levels exist in the full architecture (Subordinate Office → Department → Ministry → DARPG → CPGRAMS Reform Cell). ([vikramkushwaha.in](https://vikramkushwaha.in/blog/cpgrams-appeal-grievance-closed/); [filemyrti.com](https://filemyrti.com/grievance-help/cpgrams-complaint-ignored))
7. **Performance scoring.** DARPG scores ministries/states monthly on a dashboard; feedback (satisfaction + appeal rate) is stated to count for **30% of the score**, the rest being disposal volume/speed. ([search result](https://vajiramandravi.com/current-affairs/centralised-public-grievance-redress-and-monitoring-system-cpgrams/))

**Key structural fact:** the "Appeal" button is gated behind rating the case "Poor" first — a citizen who doesn't know to do this, or who rates neutrally, or who simply stops checking the portal after the disposal email, never sees the escalation path at all.

---

## 2. Where it concretely fails users today

### a) Disposal ≠ resolution — this is DARPG's own framing problem, documented by the system's own numbers
- **Citizen satisfaction barely exceeds 50%** despite very high disposal rates and record throughput (26,45,869 grievances "resolved" in 2024 alone). This is the single sharpest number found: half of closures leave the citizen unsatisfied even as the government reports near-total disposal. ([IMPRI, "Beyond Digital Box-Ticking: A Critical Analysis of India's CPGRAMS"](https://www.impriindia.com/insights/policy-update/beyond-digital-box-ticking-a-critical-analysis-of-indias-cpgrams/))
- IMPRI's analysis names this a **"disposal-at-all-costs" culture**: departments are structurally incentivized to close tickets because the dashboard rewards closure speed/volume, not resolution quality. Typical closing text cited: "matter forwarded to concerned department" or "noted for future action" — marked resolved in the system with no verification the underlying problem was fixed. (same source)
- IMPRI also flags a **"consequence architecture" gap**: nodal officers, appeals and feedback exist on paper, but there is no real penalty for a GRO who closes grievances with boilerplate. Monitoring officials are drawn from the same administrative cadre as the departments being complained against — the system self-polices.

### b) Parliamentary Standing Committee (119th Report, Personnel/Public Grievances/Law & Justice, chaired by Sushil Kumar Modi, Dec 2021) found, in its own words:
- Ministries/departments are **disposing grievances without giving valid reasons for closure**, despite DARPG instructions requiring justification. ([PRSIndia summary](https://prsindia.org/policy/report-summaries/strengthening-of-grievance-redressal-mechanisms); [ETV Bharat, Dec 2021](https://www.etvbharat.com/english/bharat/impress-upon-ministries-to-undertake-review-of-grievances-raised-in-media-par-panel-to-darpg/na20211218194712868))
- Many grievances that actually concern **state governments** are simply disposed with "approach the state government" rather than being forwarded — the complainant is sent away, not routed.
- In other cases grievances are **disposed by sending the complaint back to the very agency being complained against**, or by suggesting the citizen approach "another agency or a subordinate office" — a closed loop with no real handling.
- Committee found **wide variation in framework, process, and capacity across ministries** — no standard bar for what counts as a legitimate closure.
- Recommendation: reward/punishment system for grievance officials (implying none exists today), and stricter enforcement of DARPG's closure-documentation rules. ([Deccan Herald](https://www.deccanherald.com/india/parliamentary-panel-recommends-reward-punishment-system-for-grievance-officials-1135144))

### c) Documented case study of "robotic disposal" as an evasion tactic (RBI / Banking Ombudsman via CPGRAMS)
- A citizen filed four substantive grievances against RBI-regulated banking practices (unsigned computer-generated documents, premium-rate customer care lines, unauthorized account auto-conversion, ad-hoc SMS charges) between Oct–Nov 2020.
- RBI disposed **all four** using the same boilerplate: reclassifying each as a "suggestion / request / query / general observation" rather than a grievance — which exempts it from substantive review under the portal's own rules.
- Even after **PMO intervention** (grievance ref. PMOPG/E/2021/0017969) pushed RBI to reconsider, RBI repeated the identical dismissal. ([TaxTMI, "CPGRAMS Grievance Redressal Portal of GOI – Its Efficacy"](https://www.taxtmi.com/article/detailed?id=9665))
- This is direct evidence of a **backend/process loophole**: the classification field (complaint vs. grievance vs. suggestion vs. query) is self-assigned by the responding department with no independent check, and reclassification-to-dismiss is a repeatable evasion, not a one-off.

### d) Volume/backlog numbers (context, not necessarily failure but shows scale)
- 2,08,103 grievances pending as of April 2025; 23 states/UTs individually carrying 1,000+ pending grievances. ([IMPRI](https://www.impriindia.com/insights/policy-update/beyond-digital-box-ticking-a-critical-analysis-of-indias-cpgrams/))
- 1,15,52,503 grievances resolved cumulatively 2020–2024, average disposal time down to ~13-15 days — DARPG uses this as its headline success metric, which is exactly the metric IMPRI and the Standing Committee say is misleading on its own.

### e) Department-specific pattern: EPFO
- EPFO generally **does not reopen a "disposed" grievance** even when the underlying PF issue is unresolved — the citizen is told to file an entirely new grievance referencing the old one, restarting the clock. "Disposed" on EPFiGMS/CPGRAMS means EPFO responded and closed the ticket, not that the PF issue was fixed. ([kustodian.life EPF guide, 2026](https://kustodian.life/resources/provident-fund/epf-grievance-not-resolved))

### f) Practitioner-level accounts (anecdotal, not statistically representative, but consistent with the above)
- Common citizen experience described across multiple grievance-help sites: weeks of silence, then a "disposed" email with an ATR that restates the complaint, asserts everything is fine, and closes the file — with **most citizens never learning about or using the appeal mechanism** because the "Poor" rating gate is not obvious. ([vikramkushwaha.in](https://vikramkushwaha.in/blog/cpgrams-appeal-grievance-closed/); [filemyrti.com](https://filemyrti.com/grievance-help/cpgrams-complaint-ignored))

---

## 3. Root causes: backend/process, not UI

This maps cleanly onto the hackathon's "fix the process, not the screen" requirement. The failures are not about pgportal.gov.in's form design — they are about what happens *after* submission, inside the department:

| Failure mode | Layer | Evidence |
|---|---|---|
| ATR text is free-form with no substantive-match check against the original complaint | **Backend logic** | IMPRI: boilerplate ATRs marked resolved system-wide |
| Grievance can be reclassified as "suggestion/query" by the same department to dodge review | **Backend classification rule, self-assigned, unaudited** | TaxTMI RBI case study |
| Closure requires "valid reason" per DARPG policy, but nothing in the system enforces or validates it | **Policy exists, no technical enforcement** | Standing Committee 119th report |
| Appeal is gated behind an active "Poor" rating the citizen must know to select | **Workflow/UX-adjacent but really a process default** — should trigger automatically on evidence of non-resolution, not require citizen literacy | vikramkushwaha.in, filemyrti.com |
| Department performance dashboards weight closure volume/speed heavily; only 30% is feedback-based | **Incentive design / metrics architecture** | IMPRI "disposal-at-all-costs"; search result on 30% feedback weighting |
| No independent/external audit layer — GROs and monitoring officials share the same cadre as the complained-against department | **Institutional/organizational design** | IMPRI |
| EPFO-style "disposed grievances are never reopened" forces citizens to re-file from zero, losing continuity | **Workflow design (no case continuity/re-open logic)** | kustodian.life |

This is squarely a backend/process problem: the fix is a **verification layer between "GRO writes closure text" and "status flips to disposed,"** not a redesign of the citizen-facing form.

---

## 4. What's already been tried

- **10-step CPGRAMS reforms (April 2022):** DARPG's own reform package — details not fully surfaced in this search pass, but framed around timeliness/accessibility, not resolution-quality verification. ([PIB via X](https://x.com/PIB_India/status/1951150891362648293))
- **Timeline tightening:** resolution window cut from 30 → 21 days (and briefly to 3 days during COVID for certain categories), average disposal time driven from 157 days (2014) to ~13-15 days (2024-25). This targets speed, not substantive quality — and per IMPRI/the Standing Committee, may be *worsening* the disposal-over-resolution incentive.
- **Feedback Call Centre:** proactive phone survey of closed cases (19.7 lakh+ surveys through 2024) — a genuine attempt at an independent satisfaction signal, but its findings (only ~50%+ satisfaction) have not visibly changed the closure-approval workflow itself; it's a reporting layer, not a gate.
- **119th Parliamentary Standing Committee Report (Dec 2021):** the most authoritative critical document found. Recommended stricter compliance with closure-documentation rules and a reward/punishment system for grievance officials — no evidence found in this research pass that either has been implemented with teeth.
- **Samadhan Didi (May 2026):** new AI voice chatbot integrated with BHASHINI for filing grievances by speech in regional languages — addresses filing accessibility, not closure-quality verification. ([Cavalier, Jun 2026](https://www.cavalier.in/cds-ota-current-affairs/2026-06-23/cpgrams-grievance-redress-2026))
- **Academic literature:** Kumar & Joshi (2021, cited secondhand via search) found CPGRAMS "operates effectively yet needs proper follow-up procedures" due to unresolved grievances accumulating — consistent with the disposal/resolution gap. No large-scale independent academic audit of ATR text quality was found in this pass; that appears to be a genuine gap the hackathon prototype could credibly claim to fill in miniature.
- **No CAG performance audit of CPGRAMS specifically was located in this research pass** — flagging as **unverified/not found**, not confirmed absent. Worth a follow-up targeted search on cag.gov.in if time allows before submission.

---

## 5. Buildathon fit assessment

**Verdict: strong fit, fully mockable in ~3 days.**

- No live CPGRAMS scraping needed and none allowed anyway — the portal is auth-walled for meaningful data and grievance text is potentially personal, so a synthetic dataset is not just permitted, it's the only responsible option.
- The core technical challenge (does an ATR/closure response substantively address a complaint?) is a **text classification / semantic-matching problem**, exactly the kind of thing an OpenAI model prototype is well-suited to demo convincingly in a short build.
- **Mock dataset needed:** ~50-150 synthetic (grievance text, department ATR/closure text) pairs, spanning:
  - Genuinely resolved cases (ATR specifically addresses the complaint, cites an action, e.g. "payment of ₹X released on [date], UTR [number]")
  - Boilerplate/non-responsive closures ("matter noted," "forwarded to concerned section," restates the complaint without addressing it) — modeled directly on the IMPRI-quoted patterns
  - Misclassification-to-dismiss cases (complaint reclassified as "suggestion/query" per the TaxTMI RBI case study)
  - Redirect-without-forwarding cases ("approach state government" / "approach subordinate office" per the Standing Committee report)
  - Each pair labeled ground-truth "substantively resolved: yes/no" + a short synthetic citizen satisfaction rating, so the demo can show both the model's classification and a "would this citizen have rated Poor" prediction.
- Demo shape: citizen pastes/selects their (mock) grievance + the (mock) "disposed" ATR they received → tool flags whether it looks substantively resolved, explains why in plain language, and if not, **auto-drafts the appeal** citing the specific gap (mirroring the real appeal mechanism's Additional/Joint Secretary escalation) — this is exactly the process fix, not a screen redesign, because it inserts a verification step DARPG's own architecture currently lacks.
- Risk to flag: this is close to a "static rules-lookup" if under-scoped (same risk Varun flagged for EPFO). Mitigate by making the reasoning layer genuinely judge-y — plain-language "here's specifically what's missing" output, not a binary pass/fail.

---

## 6. Problem statement candidates

> **"Disposed doesn't mean done."** A citizen's CPGRAMS grievance comes back "disposed" with an Action Taken Report that restates the complaint, asserts everything is in order, and closes the file — a pattern common enough that citizen-help guides describe it as the default experience, not the exception. DARPG's own numbers back this up at scale: citizen satisfaction on closed grievances **barely exceeds 50%** even as the government reports record disposal volumes (26.4 lakh grievances "resolved" in 2024) and shrinking average closure times (13-15 days). The 119th Parliamentary Standing Committee report (Dec 2021) formally documented ministries disposing grievances **without giving valid reasons for closure**, contrary to DARPG's own rules, and IMPRI's 2025 analysis names the root cause directly: a "disposal-at-all-costs" culture where departments are scored on closure speed, not resolution quality, with no "consequence architecture" for a GRO who closes with boilerplate. Strong buildathon fit: this is exactly the team's existing "Did they actually solve my complaint?" idea, now grounded in named evidence — a synthetic (grievance, ATR) pair dataset labeled substantively-resolved vs. not lets the prototype demo the actual gap DARPG's dashboards don't measure.

> **"Reclassified to disappear."** A citizen's substantive grievance against a government-regulated entity gets dismissed not by being denied, but by being **relabeled** — from "grievance" to "suggestion," "query," or "general observation" — a category that exempts it from the portal's substantive-review requirement entirely. This isn't hypothetical: a documented case shows RBI disposing four separate banking-practice grievances (unsigned auto-generated documents, premium-rate customer-care lines, unauthorized account conversions, unexplained SMS charges) with the identical boilerplate reclassification, and repeating the same dismissal even after PMO intervention. The vulnerability is structural: classification is self-assigned by the responding department with no independent audit of whether the relabel was legitimate. Buildathon fit: build a classifier that reads the *original complaint text* independent of whatever label the department applied, and flags when a closure's stated category ("suggestion," "query") doesn't match what the complaint text actually describes (a specific, actionable harm) — a direct backend/process fix, fully demoable on synthetic complaint/label pairs modeled on the RBI case pattern.

> **"Redirected in a circle."** Grievances about state-level issues, or about the very office being complained against, get "disposed" by telling the citizen to go elsewhere — sent back to the originating agency, or told to "approach the state government" — rather than being forwarded, per the Standing Committee's explicit finding. The citizen experiences this as their complaint vanishing with an official-looking closure stamp on it. Buildathon fit: a rules/reasoning layer that reads a closure's redirect language and checks it against the grievance's stated jurisdiction/subject — flagging "this was disposed by redirecting you to [X], but the correct process is for the department to forward it, not close it" and generating the specific re-file or forwarding request. Fully mockable with a synthetic jurisdiction-routing table and labeled redirect-vs-forward closure examples; narrower scope than the general ATR-quality checker, which may make it easier to build convincingly in 3 days.

> **"You have to know to say Poor."** The only path from a bad closure to a real second look is rating the resolution "Poor," which unlocks the Appeal button on that specific grievance ID — a citizen who doesn't know this mechanic, or who never returns to the portal after the disposal email, silently loses their only recourse, and most citizens reportedly never file an appeal at all. This is a genuine process gap: the system should be able to infer non-resolution from the ATR text itself (see candidate 1) rather than requiring the citizen to correctly self-diagnose and act within an implicit window. Buildathon fit: pairs naturally with candidate 1 — once the substantive-resolution classifier flags a closure as inadequate, auto-generate the appeal draft citing DARPG's own "valid reason for closure" requirement and route it toward the Nodal Appellate Authority language real appeals use, closing the loop the current design leaves the citizen to close alone.

> **"Filed again from zero."** For high-volume departments like EPFO, a "disposed" grievance is generally **never reopened** even when the underlying issue (a stuck PF claim, a pension shortfall) is unresolved — the citizen is told to file an entirely new grievance referencing the old one, losing all continuity and restarting the clock. This converts every unresolved case into a fresh administrative event rather than an escalation, which is exactly the kind of process design that lets a department's dashboard show high "resolution" counts while the same citizen re-files the same problem repeatedly. Buildathon fit: weaker standalone than candidates 1-2 (it demos as a UX/continuity feature more than a reasoning product), but strong as a secondary feature bolted onto the main disposal-checker — auto-link a new filing to its predecessor by matching complaint text similarity against the citizen's own prior (mock) filing history.

**Recommendation:** Candidate 1 ("Disposed doesn't mean done") is the strongest standalone build — it has the best evidence base (the 50% satisfaction stat, the Standing Committee finding, the IMPRI "disposal-at-all-costs" framing), directly deepens the team's existing idea with named sources, and demos cleanly as a reasoning layer over synthetic data. Candidate 2 (reclassification-to-dismiss) is the sharpest *story* if the team wants a single dramatic case study to anchor the pitch, and could be folded in as a special case the classifier also catches.

---

## Sources (full list)
- [pgportal.gov.in](https://pgportal.gov.in/) — official portal
- [DARPG 45-day resolution time limit notice](https://pgportal.gov.in/Home/Preview/T21SZWR1Y3Rpb25PZlJlZHJlc3NhbFRpbWVMaW1pdFRvNDVEYXlzLnBkZg%3D%3D)
- [newsonair.gov.in — Oct 2025 CPGRAMS report](https://www.newsonair.gov.in/central-ministries-resolve-over-1-44-lakh-grievances-in-october-cpgrams-report)
- [newsonair.gov.in — Dec 2024, 1.12 Cr resolved 2020-2024](https://www.newsonair.gov.in/more-than-1-12-cr-public-grievances-resolved-during-period-of-jan-2020-to-oct-2024-on-cpgrams-portal)
- [PIB India / X — 10-step CPGRAMS reforms](https://x.com/PIB_India/status/1951150891362648293)
- [vikramkushwaha.in — CPGRAMS appeal guide](https://vikramkushwaha.in/blog/cpgrams-appeal-grievance-closed/)
- [filemyrti.com — CPGRAMS complaint ignored/closed, RTI route](https://filemyrti.com/grievance-help/cpgrams-complaint-ignored)
- [PRSIndia — Strengthening of Grievance Redressal Mechanisms (119th Standing Committee Report summary)](https://prsindia.org/policy/report-summaries/strengthening-of-grievance-redressal-mechanisms)
- [ETV Bharat, Dec 2021 — Parliamentary panel on CPGRAMS media grievances](https://www.etvbharat.com/english/bharat/impress-upon-ministries-to-undertake-review-of-grievances-raised-in-media-par-panel-to-darpg/na20211218194712868)
- [Deccan Herald — Parliamentary panel recommends reward/punishment system](https://www.deccanherald.com/india/parliamentary-panel-recommends-reward-punishment-system-for-grievance-officials-1135144)
- [IMPRI — Beyond Digital Box-Ticking: A Critical Analysis of India's CPGRAMS](https://www.impriindia.com/insights/policy-update/beyond-digital-box-ticking-a-critical-analysis-of-indias-cpgrams/)
- [TaxTMI — CPGRAMS Grievance Redressal Portal of GOI, Its Efficacy (RBI case study)](https://www.taxtmi.com/article/detailed?id=9665)
- [kustodian.life — EPF Grievance Not Resolved guide, 2026](https://kustodian.life/resources/provident-fund/epf-grievance-not-resolved)
- [Cavalier — CPGRAMS & Grievance Redress, DARPG Monthly Reports, Jun 2026](https://www.cavalier.in/cds-ota-current-affairs/2026-06-23/cpgrams-grievance-redress-2026)
- [vajiramandravi.com — CPGRAMS overview incl. 30% feedback weighting](https://vajiramandravi.com/current-affairs/centralised-public-grievance-redress-and-monitoring-system-cpgrams/)

**Unverified / not located in this pass (flagged, not confirmed absent):** a dedicated CAG performance audit of CPGRAMS; exact text of the "10-step reforms" (April 2022); primary text of Kumar & Joshi (2021) academic study (cited only secondhand via search snippet). Recommend a follow-up targeted search on cag.gov.in and Google Scholar if the team commits to this platform before finalizing the PRD.

---

## 7. Live walkthrough findings (2026-08-25) — observed on pgportal.gov.in, nothing submitted

Added after a browser walkthrough of the live portal. No grievance was lodged, no account created, no personal data entered. Portal version **7.0.01092019.0.0**, last updated **21-08-2026**.

### Corrections to what this file previously recorded

- **"Disposed grievances are never reopened" is NOT an EPFO quirk — it is the portal's own published policy, for every department.** FAQ Q7, verbatim: *"No. In such situations, the citizen will have to lodge a fresh grievance drawing reference to the closed grievance, and call for details."* Every unresolved case becomes a brand-new grievance with a fresh 21-day clock and no linkage to its predecessor. This upgrades the "Filed again from zero" candidate from a weak secondary feature to a documented, universal rule.
- **The strongest wedge on this platform is not ATR quality — it is closures that switch the citizen's rights off.** DARPG OM **F.No. S-15/21/2021-(PG)-DARPG (e-7085), dated 23 August 2024** documents at least five routes by which a grievance is closed with **no ATR and feedback disabled**: §2.2 references outside the grievance ambit (*"not supposed to file ATR on those categories and complaints will not go into feedback loop"*); §2.3 AI-flagged spam (auto-closed from the GRO's Spam box); §2.4 suggestions (*"can be simply closed"*); §2.5 scheme-benefit demands (*"bulk close such references with a polite rule position"*); §7.3 anything a GRO judges frivolous (*"feedback will be disabled on such grievances"*). §3.5.2 allows habitual complainants to be *"flagged and blocked in CPGRAMS."* **Because appeal requires a feedback rating, all five classes are structurally unappealable — and nothing tells the citizen which route their case took.**

### Procedural facts observed or cited

- **No anonymous or guest filing exists.** `/Home/LodgeGrievance` returns only: *"Grievance can now be lodged only by registered users.."* Homepage banners: *"Any Grievance sent by email will not be attended to / entertained"* and *"Government is not charging fee from the public for filing grievances."*
- **Registration is heavier than expected** (`/Registration/Index`, read only, nothing entered): Name*, Gender*, **Premise Number or Name*** plus Locality/Sub-locality, Country*, State*, District* (disabled until State picked), **Mobile* and E-mail*** (both, not either), captcha*. Pincode and landline optional. Verified by mobile OTP **and** an email confirmation link. A postal address is mandatory to complain about a service you may never have visited.
- **Official process flow** (`/Home/ProcessFlow`, observed): Citizen → One Time Registration and Login → Registration with department details, Grievance Unique ID → Transmission to PGO/Field Office → Resolution → ATR by SMS/Email → **Feedback → Satisfied?** Yes = Closure; No = **Nodal Appellate Authority / Sub Appellate Authority** → Final Resolution. Dotted box: **Resolution Time 21 days**. The diagram itself shows the appeal is a branch off the Feedback node, not a right.
- **Targeting is a three-tier cascade** Ministry → Department → **Subordinate Organisation**, and the **grievance category list is per-organisation, not global** (officer-side manual: 5-character org code, own Nodal Officer, own category list, category *"not mandatory"*). The taxonomy a citizen sees depends on which department they already guessed correctly.
- **Attachments are PDF only** (NIC manual). A separate, little-known **"Attach Document"** path adds a PDF to an *already-registered* grievance by registration number.
- **Tracking is easier than NCRP's.** `/Status` = Registration number + email or mobile + captcha, **no OTP**. `/Appeal/Status` takes a separate **Appeal Number**. `/Reminder` (Send Reminder) takes Registration number + either a **"Grievance password"** or email/mobile — the per-grievance password is never introduced anywhere a citizen would meet it.
- **Timelines, cited:** 21 days (OM §5.1, cut from 30, following the PM's 29 June 2024 direction; delay requires an *"Interim reply ... stating the reason"*). Priority cases *"resolved maximum within 3 days"* (Annexure §3.1.1). Ministries may set longer per-category timelines and DARPG is building *"an algorithm which will generate the optimal time for resolution"* (§5.2) — **so 21 days is advisory, not a hard SLA**.
- **Appeal mechanics:** window **30 days** from disposal (FAQ Q15); channels portal/chatbot/WhatsApp/feedback call centre with *"only a single appeal ... for a grievance"* (§4.1); heard by a **Nodal Appellate Authority** at Additional/Joint Secretary rank, optionally with **Sub Appellate Authorities**, *"next senior to the GRO in the hierarchy"* (§6, §4.2); disposed *"in a maximum of 30 days"* (§6); **no second appeal — "Appeals will not go into feedback process"** (§4.2), so the appeal outcome can be neither rated nor appealed. Note: the **"Poor" rating specifically** as the unlock is secondary-sourced only; the OM requires *a* rating, not a Poor one. **Verify on the live portal.**
- **"Issues not taken up" list, verbatim** (OM Annexure §2.1, expressly *illustrative*, reproducing the source's own lettering error): *a. RTI Matters; b. Court related / Sub-judice matters; c. Religious Matters; d. Grievances of Government employees concerning service matters; e. Suggestions; d. Anything that impacts upon territorial integrity of the country or friendly relations with other countries.*
- **Closure-quality rules exist on paper, enforced by nothing:** §7.1-7.4 forbid closing with *"Does not pertain to this Ministry/Department/Office"*, forbid closing for missing documents, require the **Relied Upon Document** to be uploaded, and require a *"valid and speaking reason while closing."* All are instructions to humans, not software checks.
- **What DARPG has genuinely fixed:** filing accessibility (22+ Eighth Schedule languages; **Samadhan Didi**, a Bhashini-built AI voice chatbot launched **30 May 2026**) and speed (central average disposal 22 days in 2022 → 15 in 2025 → **13 days**; 47th monthly report, March 2026, 1,81,279 redressed). **What it has not touched:** whether an ATR addresses the complaint.
- **Pendency is not falling:** **2,13,190 pending across States/UTs as on 31 May 2026**, 22 States/UTs over a thousand each (46th monthly report).
- **Feedback is mostly telephonic.** OM §8.1: *"Every disposed of grievance is dialed by the operator."* Call-centre records live at `pgportal.gov.in/ccfeedback`. In 2025 the call centre accounted for **66%** of all feedback (10.7 lakh citizens). It is a measurement layer, not a gate.
- **Oversight:** the 119th Standing Committee report (Dec 2021) remains the **last dedicated external review**. **No CAG performance audit of CPGRAMS found for 2023-2026.** The only current scoring is **GRAI**, DARPG grading itself on 11 indicators.
- **API integration is policy, not product.** OM §1: *"Integration of all PG portals ... through API shall be a priority."* 15 State/UT portals integrated as of the 2025 Annual Report. **No public API spec or developer documentation exists.**

### Still unverified — must be read off the live form by a logged-in user

1. **Grievance text character limit.** Conflicting: 4,000 vs 1,000 (with a 100-char subject).
2. **Attachment size and count.** Conflicting: 1 MB (PDF+JPG) vs 4 MB x 5 files (PDF only). PDF-only is confirmed; the numbers are not.
3. **Whether the Appeal button needs a "Poor" rating specifically, or any rating at all.**
4. **2026 appeals filed/disposed and satisfaction-rate tables** — these live in the DARPG monthly report PDFs, and **darpg.gov.in and pib.gov.in both return HTTP 403** to automated fetch. Most recent verified appeals figures are from 2025 (May 2025: 21,332 received / 23,006 disposed; Feb 2025: 12,649 filed / 15,399 disposed).
5. **A real (grievance, ATR) pair.** Any real disposed grievance and its closure text, redacted, is worth more to the prototype than any amount of further searching.
