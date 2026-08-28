# Research: MCA (Ministry of Corporate Affairs) Portal — mca.gov.in / MCA21

Pulled 2026-08-24. Platform assigned: MCA21 (the Ministry's e-governance backbone for company and LLP filings).

---

## 1. What the platform actually does

MCA21 is the system of record for every registered company and LLP in India — incorporation, ongoing compliance, and enforcement all run through it.

**Core user flows:**
- **Incorporation** — SPICe+ (Simplified Proforma for Incorporating Company Electronically Plus), a single web form with Part A (name reservation, or via the standalone RUN service) and Part B (incorporation details, DIN allotment, PAN/TAN, EPFO/ESIC/GST registration, bank account, Certificate of Incorporation). LLPs use a parallel FiLLiP flow.
- **Director identity** — DIN allotment during incorporation or via DIR-3; annual DIR-3 KYC (web or e-form) to keep a DIN active; DSC (Digital Signature Certificate) registration and association with a DIN/PAN, required to sign every form.
- **Annual filings** — AOC-4 / AOC-4 XBRL (financial statements) and MGT-7 / MGT-7A (annual return), due annually for every company; a large, fixed compliance calendar independent of whether the company is actually operating.
- **Charge registration** — CHG-1 and related forms to register/satisfy charges (loans/mortgages) against company assets, time-bound and penalty-bearing if missed.
- **Compliance tracking / master data** — "View Public Documents," company master data lookup, compliance dashboards.
- **Strike-off / closure** — STK-2 for voluntary strike-off; the ROC can also suo moto strike off a company for non-filing, with directors then facing five-year disqualification under Section 164(2) and needing an NCLT Section 252 restoration to reverse it ([RegisterKaro, 2026](https://www.registerkaro.in/post/strike-off-company-process-and-restoration)).

**System note:** MCA21 has been mid-migration from "V2" to a rebuilt "V3" platform since January 2023. The final batch of 38 company forms (13 annual filing + 6 audit forms) went live on V3 on 14 July 2025, and the old V2 portal was permanently decommissioned 18 June 2025 ([IndiaFilings](https://www.indiafilings.com/learn/mca-to-launch-38-final-company-forms-on-v3-portal); [XBRL.org](https://www.xbrl.org/news/india-completes-shift-to-mca-v3-digital-filings-fully-modernised/)). V3 processed 84.31 lakh (8.43 million) forms between April 2024 and February 2025 alone — this is a high-volume, high-stakes system, not a niche portal.

---

## 2. Where it concretely fails users today

### a) V3 migration is still causing active, dated breakage (2025-2026)
- **20 December 2025**: ICSI (Institute of Company Secretaries of India) sent a formal representation to MCA, just 9 working days before the extended 31 December 2025 annual-filing deadline, documenting: SRNs not appearing/retrievable after submission on AOC-4; "File Validation Failed" errors with redirection loops on AOC-4 XBRL; contradictory prompts and Excel-upload failures on MGT-7/MGT-7A; SRNs cancelled for forms "duly uploaded... pending DSC affixation"; portal slowdowns and homepage failures concentrated 3pm-8pm (peak filing hours); and a workflow bug where "even minor modifications necessitate saving and validating all linked forms afresh." ICSI asked for either urgent fixes or an extension to 31 March 2026 ([TaxGuru](https://taxguru.in/company-law/functioning-mca-21-v3-portal-issues-challenges-faced-stakeholders.html); [StudyCafe](https://studycafe.in/extend-due-dates-for-filing-roc-annual-forms-icsis-plea-for-relief-amid-mca-21-v3-portal-glitches-396414.html)).
- Earlier, ICSI had submitted a 45-item list of unresolved V3 issues (24 August 2023) covering: master data not updating after appointments/amalgamations; DINs/PANs/CINs failing to pre-fill correctly; duplicate master-data records for one company after office relocation; payment challans not processing and receipts not generating even when payment succeeded; duplicate payments (including stamp duty) with no refund path; STK-2 (strike-off) forms "getting rejected without giving any opportunity of re-submission"; NCLT-order forms (INC-28, LLP Form 22) simply unavailable; MGT-14 delays blocking dependent forms (INC-27, INC-24); site malfunctions during 10am-6pm business hours; DSC verification failing despite a valid, correctly associated certificate ([TaxGuru](https://taxguru.in/chartered-accountant/icsi-submits-list-pending-issues-stakeholders-mca-21-v3-portal.html)).
- Journalistic coverage (CorporateIndia, tracing back to the Feb 2023 rollout) documents that Finance Minister Nirmala Sitharaman had to personally acknowledge the problems and set up a special task force, and quotes practitioners: "The automation introduced in V3 has proven counterproductive for company secretaries, making routine filings more challenging than ever." Business impact cited: incorporation delays, closure complications, DIN acquisition delays, and disruption specifically to VC-backed startups ([CorporateInd](https://www.corporateind.com/economy/mca-v3-portal-plagued-by-glitches-and-inefficiencies-causing-chaos-for-cas-and-startups-ease-of-doing-business-a-far-fetched-dream)).
- As of late 2025, DSC validation stability and payment-gateway reliability have reportedly improved from the 2024 rollout, but form-validation and SRN-tracking problems on annual filings are current/active as of December 2025 ([CapEasy summary](https://www.capeasy.in/compliance/mca-v3-problems/)).

### b) DSC/DIN activation is a recurring, opaque friction point
MCA issued a specific advisory on the "DSC not registered with DIN" error during DIR-3 KYC filing — a *mandatory annual filing* every DIN holder must complete just to keep their identity active. Causes bundled under one cryptic error: expired/revoked DSC, untrusted issuing CA, missing certificate chain, DSC not linked to the correct DIN/PAN, wrong user-role selection, or a plain portal glitch. MCA's own remediation path when self-service fails is to "raise a service-related complaint on the MCA Portal" — i.e., a support ticket into the void ([TaxGuru](https://taxguru.in/company-law/mca-advisory-fix-dsc-not-registered-with-din-error-in-dir-3-kyc.html); [FinTax Blog](https://fintaxblog.com/troubleshooting-dsc-association-issues-on-mca-portal-faqs/)).

### c) Name rejection is the single biggest incorporation-delay driver
Name rejection via SPICe+ Part A / RUN adds an estimated 3-5 days per resubmission cycle, and a normal incorporation that would otherwise take 7-10 working days routinely blows past that. The dominant rejection driver is **phonetic or visual similarity** to an existing company/LLP/trademark — not just exact duplicates — and MCA does not check the trademark registry for the applicant; users are expected to separately search both databases before applying ([Beacon Filing](https://beaconfiling.com/blog/company-registration-stuck-track-mca-status); [ComplianceCalendar](https://www.compliancecalendar.in/learn/common-causes-of-rejection-of-spice-part-a-or-run-application-under-crc); [RegisterKaro](https://www.registerkaro.in/post/company-name-rejection)). First-time founders with no CA/CS guidance have no way to know this before they burn a cycle and a filing fee.

### d) Penalty/enforcement severity is high and poorly signposted to first-timers
- Late filing of AOC-4/MGT-7 accrues **₹100/day per form, uncapped, with no ceiling** — a founder who is late by 200 days on both forms owes ₹40,000 in penalty alone, on top of the base fee ([StartupGrantsIndia](https://www.startupgrantsindia.com/calculators/compliance/mca-late-fee); [Ebizfiling](https://ebizfiling.com/blog/penalties-for-non-filing-of-aoc-4-and-mgt-7/)).
- Missing filings blocks the company from filing *any other form* until the backlog clears — a single missed annual return can cascade into an inability to register a charge, change a director, or do anything else on the portal.
- **Over 14,000 directors were disqualified in 2025 alone** for non-filing of annual returns for 3+ consecutive years, each barred from any Indian directorship for 5 years under Section 164(2) ([search synthesis, multiple sources including CARajput, Muds]).
- Reversing an ROC-initiated strike-off requires an NCLT Section 252 petition — legal process, ₹25,000-₹1,00,000+ in total cost, months of delay — for what is very often a small/dormant company whose founder simply didn't know a filing was due, not a case of deliberate default ([RegisterKaro](https://www.registerkaro.in/revival-of-struck-off-companies); [IncorpX](https://www.incorpx.io/guide/how-to-revive-struck-off-company-roc)).

---

## 3. Root causes — backend/process, not just UI

The hackathon explicitly wants the backend/process fixed, not a reskin. On MCA21, the pain is overwhelmingly **process- and backend-level**, which is good buildathon fit:

1. **State/session management failure, not a form-design problem.** Lost draft data on session timeout, SRNs generated then silently cancelled, forms flagged as validated but rejected downstream — these are backend workflow/queue bugs (the form's internal state diverging from what the server thinks happened), not something a prettier UI fixes.
2. **No plain-language failure explanation surfaced to the user.** A "File Validation Failed" or "DSC not registered with DIN" error is a raw system-state dump, not a diagnosis. The backend knows *which* of 5-6 known causes triggered it (expired cert vs wrong DIN link vs role mismatch) but never tells the user which one — this is a translation-layer/decision-logic gap, exactly the kind of "explain what actually went wrong and what to do next" fix the hackathon brief wants.
3. **Penalty calculation is a black box until the fee is already due.** The ₹100/day uncapped accrual, small-company 50% concessions, and cross-form filing lockout are rule-based logic that exists in MCA's backend fee engine but is never proactively surfaced to a founder as "you are N days from a ₹X penalty and a filing freeze" — it's discoverable only after the fact via third-party calculators.
4. **Name-clash checking is incomplete by design.** MCA's own name-reservation logic doesn't cross-check the trademark database, so the system approves reservations it knows are statistically likely to later be legally challenged or provoke phonetic-similarity rejection on resubmission — a rules/matching-logic gap, not a form-field issue.
5. **Strike-off and disqualification are irreversible-feeling because there is no early-warning layer.** The suo moto strike-off and Section 164(2) disqualification triggers are deterministic (2 consecutive years unfiled) but MCA does not proactively notify a dormant/small company's founder in plain language before the threshold is crossed — enforcement is backend-triggered with no user-facing pre-emption step.

---

## 4. What's already been tried, and why gaps remain

- **CS/CA-assisted filing** is the default path for anyone who can afford it — a human intermediary absorbs the portal's opacity. This works but doesn't scale to solo founders/bootstrapped startups who are price-sensitive and are exactly the population disqualification/strike-off numbers (14,000+ directors in 2025) suggest is being caught out.
- **Private compliance SaaS** (IndiaFilings — founded 2007, ~600 employees, $511M raised; Vakilsearch/Zolvit — founded 2010, $12M raised, 300,000+ customers served) wrap the MCA portal in a friendlier UI and calculators (fee/penalty calculators, name-check tools, step-by-step guides) ([CBInsights](https://www.cbinsights.com/company/vakilsearch/); public company pages). These are commercial, filing-fee-plus-service-fee businesses — they solve "get it filed for me" but their business model depends on the confusion persisting; none of them fix the underlying MCA backend, and none offer a free, proactive "here is exactly why your specific filing/DSC/name failed" diagnostic tool aimed at first-time founders before they've paid a CA.
- **Gap that remains:** no free, standalone tool exists that (a) decodes a specific MCA error/rejection into plain language with the exact next action, or (b) proactively tells a founder how close they are to a penalty/disqualification cliff before it happens. Third-party calculators exist for late fees, but they're reactive (compute cost after the fact), not preventive.

---

## 5. Buildathon fit assessment

**Yes, prototypable in ~3 days with entirely mock/synthetic data.** MCA21 is a strong fit for this brief because:
- The government's own current failure mode (cryptic errors, unexplained rejections, opaque penalty accrual) is a **reasoning/translation problem**, not a live-data problem — a mock dataset of realistic MCA error codes/rejection reasons plus a rules engine that maps them to plain-language causes and next steps is fully synthetic and demoable without touching mca.gov.in.
- No Aadhaar/PAN/OTP/payment data needed if the mock uses synthetic CIN/DIN/SRN-style identifiers and synthetic filing-status records.
- Penalty/deadline logic (₹100/day, disqualification thresholds, small-company concessions) is public, documented, rule-based law — easy to encode faithfully without needing live MCA figures.

**Mock datasets needed (all synthetic):**
- Synthetic company records: CIN, incorporation date, last AOC-4/MGT-7 filing date, DIN(s) of directors, DSC status, current "days overdue" counter.
- Synthetic error/rejection code table: e.g. `DSC_NOT_REGISTERED_WITH_DIN`, `NAME_PHONETIC_CLASH`, `SRN_CANCELLED_PENDING_DSC`, `FILE_VALIDATION_FAILED_XBRL`, each mapped to plain-language cause + fix steps + who to contact.
- Synthetic name-reservation attempt log (proposed name, existing-name clash score, trademark clash flag) to demo the name-rejection diagnostic.
- Synthetic penalty-accrual calendar per company to demo the proactive "you are N days from disqualification" warning.

---

## 6. Candidate problem statements ("fix the failing moment")

> **"Why was my company name rejected — and will the next one work?"**
> A first-time founder submits SPICe+ Part A, waits 1-3 days, and gets a name rejection citing "similarity to an existing name" with no explanation of *which* existing name, how similar, or whether it was a company-name clash or a trademark clash. Since MCA's own logic doesn't cross-check the trademark registry, users are told separately to search two different databases before resubmitting — most don't know this until a CA tells them, or until they've burned a second 1-3 day cycle and a second filing fee ([ComplianceCalendar](https://www.compliancecalendar.in/learn/common-causes-of-rejection-of-spice-part-a-or-run-application-under-crc); [Beacon Filing](https://beaconfiling.com/blog/company-registration-stuck-track-mca-status)). Strong buildathon fit: a synthetic MCA + trademark name-clash dataset with phonetic-similarity scoring is fully mockable, and the valuable part is the reasoning layer that separates "will get rejected again" from "safe to resubmit" — something the actual portal never tells you.

> **"What does 'DSC not registered with DIN' actually mean for me?"**
> A director tries to file DIR-3 KYC (mandatory annually, or their DIN goes inactive) and hits a single generic error that MCA itself had to issue a special advisory to explain, because it can mean any of six different underlying problems — expired certificate, wrong CA, missing chain, DSC-DIN mismatch, wrong role selected, or a portal bug — and the portal's own fallback when self-service fails is "raise a complaint" ([TaxGuru advisory](https://taxguru.in/company-law/mca-advisory-fix-dsc-not-registered-with-din-error-in-dir-3-kyc.html)). Strong buildathon fit: mock a small decision tree over synthetic DSC/DIN records (expiry date, linked PAN, linked DIN, CA trust status) and turn one opaque error into a specific diagnosis and fix path — this is the exact "explain what actually went wrong" pattern the brief asks for.

> **"Am I about to lose my directorship and not know it?"**
> Over 14,000 directors were disqualified in 2025 alone for missing annual filings 3 years running, each barred from any Indian directorship for 5 years, with the only path back an NCLT Section 252 restoration costing ₹25,000-₹1,00,000+ over months. The ₹100/day uncapped late fee and the filing-lockout-until-backlog-cleared rule exist in MCA's backend today but are never proactively surfaced — a founder finds out only when trying to file something else and getting blocked, or when disqualification has already landed. Strong buildathon fit: a synthetic per-company filing calendar plus MCA's real, documented penalty formula gives a demoable "you are 340 days overdue, ₹34,000 in penalties, 25 days from the 2-year strike-off threshold" early-warning dashboard — the reasoning/calculation layer is the whole product, no live MCA connection needed.

> **"My annual filing says it went through — did it actually?"**
> ICSI's December 2025 letter to MCA documents SRNs that are generated, appear to succeed, and are then silently cancelled while "pending DSC affixation," plus AOC-4 XBRL submissions that loop through "File Validation Failed" with no clear resolution path, concentrated in peak hours (3-8pm) when the portal itself slows or the homepage fails to load ([TaxGuru](https://taxguru.in/company-law/functioning-mca-21-v3-portal-issues-challenges-faced-stakeholders.html)). A founder filing without a CA has no independent way to confirm a filing that "looks submitted" is actually accepted until much later. Buildathon fit is moderate: it demos well as a "true filing status" checker layered over a synthetic SRN-lifecycle dataset (submitted → validated → DSC-pending → accepted/cancelled), but the underlying bug (session/state desync) is harder to dramatize as a single fixable "moment" compared to the other three.

> **"Which strike-off am I actually facing, and can I still stop it?"**
> Strike-off can be voluntary (STK-2, founder-initiated) or ROC-initiated (non-filing for 2+ years), and ICSI's 2023 list documented STK-2 forms themselves "getting rejected without giving any opportunity of re-submission" — so even founders trying to properly close a dormant company hit a dead end. Meanwhile founders who didn't intend to close anything can be struck off involuntarily and only discover it when trying to use a bank account or apply for a loan. The law explicitly allows restoration "if removed due to oversight, unawareness, or genuine reasons" ([TaxGuru ICSI list](https://taxguru.in/chartered-accountant/icsi-submits-list-pending-issues-stakeholders-mca-21-v3-portal.html); [RegisterKaro](https://www.registerkaro.in/post/strike-off-company-process-and-restoration)) but a founder has no plain-language triage for "am I already struck off, about to be, or safely closing voluntarily, and what's my next step in each case." Weaker buildathon fit than the top three: the underlying legal process (NCLT filing) is real-world and slow, so the demo can only go as far as diagnosis and next-step guidance, not resolution — still valid as a "fix the failing moment," but less punchy as a live prototype.

---

## Strongest candidate (my read)

The **directorship/disqualification early-warning** idea ("Am I about to lose my directorship and not know it?") is the strongest: it has the hardest numbers (14,000+ real 2025 disqualifications, documented uncapped ₹100/day penalty law), the clearest backend-fix framing (MCA's own penalty/deadline rules exist but are never surfaced proactively), and needs nothing but a synthetic filing calendar plus real published penalty formulas to build a compelling, fully mockable demo in 3 days.
