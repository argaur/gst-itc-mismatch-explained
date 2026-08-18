# Build What Moves India

## What This Is
Team hackathon submission (4 people: Gaurav, Harshit, Varun, Kriti) for **"Build What Moves India"**, a hackathon by Varun Mayya backed by OpenAI. Site: https://buildwhatmovesindia.com/

The brief: pick one real problem on an Indian public-service website or digital service and build a simpler, clearer, more useful way to solve it. Prototype must be built with Codex or an OpenAI model, and must address the backend/process, not just redesign the screen. IRCTC, EPFO, and the Income Tax portal are given as examples only, not a fixed list.

**Submission deadline: August 27, 2026.** Finale window: Sep 5-6, 2026 (10 finalists selected; filmed shoot planned Sep 6).

Hard rules from the brief: no touching live government systems, no undocumented private APIs, no real Aadhaar/PAN/OTP/payment data — use mock/synthetic data throughout.

## Framework state
**Framework: none, workspace.** No rubric yet — the team has not locked which idea to build; this is pending a combined decision. 2026-08-18.

Once the team picks one idea: run `/prd-create` on the chosen idea, then `/rubric` to lock framework depth, then bootstrap with the Blueprint `new-project.sh` script from the Claude Optimisation framework repo. Do not scaffold Blueprint's Documentation/ tree before that — it expects a filled PRD.md, not a blank one.

## Candidate ideas (from team's shared doc)
Source: [team ideas sheet](https://docs.google.com/spreadsheets/d/1bO0N33XyMnJFJNtw5x8oNMZ3nrR_xtoeikeczHe_Wn4/edit?gid=0#gid=0) — pulled 2026-08-18, re-check the sheet for updates before treating this list as current.

Shared pattern across nearly all ideas: don't rebuild the government portal, fix the moment it fails the user (a rejection, a "disposed" grievance, a "paid" status with no money received) by explaining what actually went wrong and what to do next.

**Harshit:**
- "Why is my money stuck?" — plain-language explainer for stuck/rejected PF, scholarship, pension, farmer payment, wage claims
- "Why is my account frozen?" — helper for unexplained bank account freezes (often fraud-linked)
- "What do I need to do after someone dies?" — single ordered checklist across banks, PF, property, insurance, pension
- "What government benefits am I eligible for?" — tells the user what schemes they qualify for instead of making them search
- "Turn my medical papers into a proper handover" — photo-to-summary tool for patient referrals between hospitals
- "Say it once, done everywhere" — single voice/text entry for frontline workers (Anganwadi/ASHA/teachers) that populates multiple government systems
- "Did they actually solve my complaint?" — checks whether a "disposed" grievance response actually addressed the issue, drafts the escalation if not
- "Where did my government payment actually go?" — diagnoses the gap between a "paid" status and no money received

**Varun:**
- SIR / voter roll gaps — address-to-ward/constituency/BLO resolver + Form 6 vs Form 8 wizard (voters.eci.gov.in requires the user to already know their ward)
- Aadhaar creation — online pre-enrollment form generating a QR/reference code so the centre operator does verify-and-confirm instead of full re-entry
- EPFO stuck claims — claim diagnosis tool mapping status to the ~6 known failure modes (UAN-Aadhaar link, name/DOB mismatch, employer attestation, stale IFSC, service overlap). Varun's own note: SIR and Aadhaar creation are the stronger builds since they're fully mockable; EPFO risks feeling like a static rules-lookup rather than something functional.

**Kriti:**
- Courts — "do I need to be in court tomorrow?" plain-language case status instead of a confusing PDF cause-list
- Aadhaar update rejections — checks the document the way the government checks it, before submission
- Voter ID after moving cities — links the add-at-new-address and remove-from-old-address forms into one tracked request
- ID mismatch across Aadhaar/PAN/voter ID — diagnoses which mismatch is causing which downstream problem and the right fix order
- PM-JAY (Ayushman Bharat) — real-time check at the hospital counter of whether a card refusal is actually valid
- Parivahan/RTO — decodes driving-licence step failures (payment, test rule, database mismatch) into plain language
- Land mutation — checks deed details against land records and flags what doesn't match
- Caste/Income/Domicile certificates — tracks the legal issuance deadline (often 30 days) and drafts the penalty complaint once missed
- Income Tax refund — explains refund status and decodes confusing letters from the tax department
- e-Shram — tells a registered worker which benefits they can actually use right now vs. which need another step

**Gaurav:**
- **"Will this hospital actually take my Ayushman card today?"** A family in Mumbai called eight hospitals off the official PMJAY empanelled list. Some said they only did certain treatments under the scheme, several said they were no longer empanelled at all. The list at hospitals.pmjay.gov.in is real and public, but it is a directory of paper status, not of what a counter will do this morning. Empanelment gets suspended during audits, hospitals pause cashless service when state dues run late (650 of Haryana's 1,300 empanelled private hospitals suspended PMJAY services in August 2025 over roughly Rs 490 crore unpaid), and some accept the card at admission then ask for cash at discharge saying the claim was not approved or the server is down. We are not rebuilding the empanelment directory, we are fixing the gap between "listed" and "will treat me now", and giving the family the exact words and the right escalation number (14555) when a refusal is not lawful. Strong buildathon fit: a mock hospital dataset with status, package coverage, last-verified date and crowd-reported refusals is fully synthetic, and the valuable part is the reasoning layer that turns a refusal into a plain answer, not any live feed.
- **"My scheme says cashless, the hospital says pay up."** Same failure shape for RGHS and CGHS, with a second layer. Rajasthan suspended 51 RGHS-empanelled hospitals in three months and levied about Rs 3 crore in penalties for fake and duplicate claim documents, unnecessary tests, package splitting and showing OPD patients as admitted. CGHS suspended 19 Delhi-NCR hospitals for forged bills, and CBI booked two Kanpur hospitals over roughly Rs 79 lakh billed for 25 beneficiaries who said they were never treated there. Note the correction to the original framing: the documented fraud sits with empanelled providers and intermediaries, not with employees as a class. The verifiable weakness is that a beneficiary cannot see what was billed in their name until long after, so a forged claim on their ID is invisible to the one person who would know it is false. We are not building an audit system for the health department, we are giving the beneficiary a readable statement of what was claimed under their ID and a one-tap "this did not happen to me" flag. Good buildathon fit and a sharper story than idea 1, because the demo shows a citizen catching a fabricated claim that no dashboard caught.
- **"UMANG has the service, I just cannot find it."** UMANG aggregates hundreds of central and state services, but a user who knows what they want ("activate my UAN", "check my pension") has to guess the department, then the scheme name, then which of several similar tiles is the live one. Reviews repeatedly describe getting stuck at a starting screen, opaque errors after OTP, and no desktop fallback when the app fails. Under that is a second wall: most services need an ID the user does not have handy and cannot easily recover, and each one calls it something different. The catalogue is organised by which department owns the service, which is the one thing the citizen does not know. We are not rebuilding UMANG, we are fixing the entry point: describe the problem in your own words or your own language, get the one right service, plus a short pre-flight list of exactly which ID or registration number it needs and where to find that number first. Strong buildathon fit: the service catalogue can be a mocked static index, and the whole build is intent-to-service matching plus a document readiness check.
- **"Is anyone accountable for this desk?"** Weakest of the five as originally framed, and worth saying why. There is no citizen-facing way today to report that a specific government office is not doing its job, and the anonymity assumption does not hold: CPGRAMS requires a registered account with mobile and email, the Department of Personnel has instructed departments that anonymous or pseudonymous corruption complaints against employees need no action and are simply to be filed, and the Whistleblowers Protection Act 2014 was passed but never operationalised and in any case rules out anonymous disclosures. So a portal that rates or accuses named individuals anonymously would be legally inert, unverifiable, and an easy tool for score-settling. The reframe that survives: measure the desk, not the person. Track service-level delivery against the legal timelines that already exist (many certificates carry a 30-day statutory deadline), aggregate anonymously at office and service level, and surface "this office misses its deadline on 7 out of 10 income certificates" instead of an accusation against a clerk. Buildathon-viable only in that reframed shape, and even then it demos as a dashboard rather than a moment being fixed.
- **"Who built this, and who else did they fail?"** A citizen sees a foot overbridge or a station platform redone badly six months ago and has no way to learn which vendor did it, what the contract promised, or whether the same vendor is currently working on three more sites nearby. Tender award data exists in scattered portals, but performance after award is effectively invisible, and blacklisting decisions are not published anywhere a citizen would look. The retaliation concern is real and documented at the general level: over 300 recorded instances of attack or harassment and at least 51 murders linked to information sought under the RTI Act, which is exactly why people who see bad work say nothing. We are not building a procurement watchdog, we are fixing the moment a citizen notices bad work and hits a dead end: point a photo and a location at it, get back who the vendor was and what else they hold, and file into an aggregated site-level record rather than a named individual complaint. Medium buildathon fit: fully mockable with a synthetic tender and works dataset, strong as a story, but it needs care to stay a record of work quality and not a public accusation board.

## Out of Scope
Nothing built yet. Do not start implementation until the team locks one idea and a PRD exists.
