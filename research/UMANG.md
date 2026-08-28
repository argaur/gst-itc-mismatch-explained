# Research: UMANG (Unified Mobile Application for New-age Governance)

Researched 2026-08-24 for "Build What Moves India" hackathon (backed by OpenAI / Varun Mayya). Platform: umang.gov.in / UMANG app. All facts below are sourced inline; anything not independently corroborated is flagged **[unverified]**.

---

## 1. What the platform actually does

UMANG is the Indian government's single aggregator app/portal for central, state, and local government services — one login surface sitting in front of hundreds of otherwise-separate department systems (EPFO, PAN/Income Tax, pension, DigiLocker, CoWIN, Jan Aushadhi, Indian Railways, Delhi Metro, NHAI, utility bill payment, certificates, etc.).

**Scale (figures vary by source and date — the app is in continuous rollout):**
- Launched 23 November 2017 by PM Modi at the Global Conference on Cyberspace, built by MeitY with the National e-Governance Division (NeGD). At launch: 162 services, 33 departments, 4 states. — [Wikipedia](https://en.wikipedia.org/wiki/UMANG)
- By late 2024/2025: **~1,745 services from ~80 central departments/ministries/autonomous bodies and 30 states.** — [Digital India / MeitY](https://www.digitalindia.gov.in/initiative/umang/)
- By February 2026 (most recent PIB figure found): **2,446 services (872 Central + 1,574 State) from 240 government departments — 80 Central departments and 160 departments across 30 states/UTs.** A further batch of 50 new services was added in a 2026 update. — [PIB press release via search summary](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2245056) (page itself returned HTTP 403 on direct fetch; figures triangulated via search index and [NewsPress India, 2026](https://newspress.co.in/umang-app-2026-update-50-new-government-services-integrated/))
- User base cited at **5.58 crore (55.8 million) registered users, 383 crore cumulative transactions** [unverified — single-source search summary, not independently confirmed]. Downloads on Android alone: **~130 million** as of July 2026 per AppBrain — [AppBrain](https://www.appbrain.com/app/umang/in.gov.umang.negd.g2c).
- Supports 23 Indian languages, works via app (Android/iOS), web (web.umang.gov.in), SMS, IVR/phone (dial 14444/1800-115-565), and integrates with DigiLocker. — [Wikipedia](https://en.wikipedia.org/wiki/UMANG), [PIB via search](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2245056)
- **Google Play rating: 4.84/5 from ~3.1 million ratings** (search-index summary of the Play Store listing) — [Google Play](https://play.google.com/store/apps/details?id=in.gov.umang.negd.g2c&hl=en). Note the aggregate rating is high despite loud, specific complaint threads — a pattern consistent with a captive-user product (people who *must* use it for PF/pension have no substitute app to switch to, so they rate it after finally succeeding, not after every failure).

**Navigation structure:** Services are organized primarily by **department/category tile** (Health, Finance, Education, Housing, Energy, Agriculture, Transport, Utility, Employment & Skills, etc.), which maps to which *government body* owns the service, not to what the citizen is trying to do. A citizen who wants "check my PF" has to already know that lives under EPFO under Employment, not Finance. — [Digital India / MeitY](https://www.digitalindia.gov.in/initiative/umang/), [Bajaj Finserv](https://www.bajajfinserv.in/investments/umang-app)

---

## 2. Where it concretely fails users today

### Discovery / navigation failure (the core of Gaurav's idea)
- The app's own department-first taxonomy is the structural problem: a citizen thinking in *outcomes* ("get my UAN", "check pension", "book a vaccination slot") must translate that into a *department* ("EPFO", "SSPMIS", "CoWIN") before the app's own navigation is useful. This is the same failure shape documented across the CLAUDE.md brief for other portals, and UMANG is the platform where it's most acute because it hosts 2,400+ services under 240 departments simultaneously.
- Independent commentary states low real engagement despite huge download numbers: one industry blog cites "over 50 million downloads" but "only 20–25% of users engage with UMANG regularly," attributing the gap to "limited awareness, technical glitches, and incomplete integrations" — [Om Management Consultancy, 2026](https://omconsultants.in/blog/umang-app-why-indias-one-stop-government-service-platform-still-feels-like-work-in-progress/). **Flag: this specific 20–25% figure is unsourced within that article itself** (no citation to survey/government data) — treat as directional, not verified, but consistent with the discoverability thesis.
- Government's own response confirms discoverability was recognized as a weakness before being partially UI-patched: 2025–2026 app updates explicitly added "revamped UI/UX," "voice-based search functionalities," and multilingual chatbot support "to enhance usability across diverse user demographics" — i.e., the government's fix so far has been surface-level search/voice layered on top of the same department taxonomy, not a restructure of how services are organized. — [search summary of PIB release, 2026]

### Authentication / OTP / session failures
- Users report **"Unexpected error occurred"** after entering OTP, and **"Duplicate or no transaction history found for OTP verification"** — specifically surfaced after the August 2025 rule change requiring employees (not employers) to self-generate their UAN via UMANG's Aadhaar Face Authentication Technology (FAT) flow. — search summary of app store/support forum threads, referencing [EPFO circular, Aug 2025](https://www.epfindia.gov.in/site_docs/PDFs/Circulars/Y2025-2026/MandatoryAllotment_ActivationOfUANThroughUMANGAPPUsingFAT.pdf)
- A separate, persistent complaint thread: passbook and OTP messaging failures reported as ongoing for **"more than three months"** by some users, with UMANG support's stock answer being "OTP services are working fine... heavy traffic may cause delays," directing anything unresolved after 24 hours to the helpline 1800-115-565.
- **Root cause named directly by one guide source:** "Skipping the Aadhaar step is the single biggest cause of UMANG login failure, as UIDAI sends every authentication OTP to the Aadhaar-linked mobile [number]" — i.e., users try to log in/authenticate with a *current* mobile number that isn't the one on file with Aadhaar, and the app gives no diagnostic pointing at that mismatch. — search summary citing a UMANG troubleshooting guide
- EPFO-specific access failures independent of OTP: users report the message **"You don't have permission to access this service"** when trying to view PF passbook, which "sometimes starts working again after a few days" with no explanation given to the user.

### Reliability / performance under load
- Multiple 2025 reviews describe the app and its underlying EPFO integration as effectively down under load: "endless loading screens, crashes, and server downtimes" during periods of high demand (e.g., post-UAN-mandate traffic spikes). — [Medium, "UMANG App & EPFO Crashes Expose Hypocrisy in India's New Labour Codes"](https://medium.com/@abhishekroy77771/umang-app-epfo-crashes-expose-hypocrisy-in-indias-new-labour-codes-ab9fcacbf294) (direct fetch blocked by site, title/framing captured via search index only — treat specifics inside as **unverified** pending direct read)
- Generic 1-star review language recurs across app-store threads: "worst app," "gives error most of the times," "always shows technical issues every time," "the service you were looking for is experiencing some issues, please try again."

### Fragmented per-service authentication ("UMANG login ≠ service access")
- UMANG registration only gets a user *into the app*; each integrated service (EPFO, ESIC, CoWIN, Jan Aushadhi, etc.) has its **own separate authentication/ID requirement layered underneath** — UAN or EPF Member ID for EPFO, Aadhaar-linked-mobile for FAT-based UAN generation, scheme-specific registration numbers for state schemes, etc. Nothing in the app tells a user *before* they start a flow which ID/number they will be asked for, so failures surface mid-flow rather than as a pre-flight check. — search summary synthesizing UAN-generation guides ([Pocket HRMS](https://www.pockethrms.com/blog/how-to-register-for-uan-on-the-umang-app/), [Kustodian](https://kustodian.life/resources/uan-activation-errors-fixes-otp-name-dob-mobile-2026-guide))
- Confusable adjacent products: users conflate UMANG and DigiLocker because both are NeGD products and both touch Aadhaar identity, compounding "which app has what I need" confusion.

### Desktop/offline access — correction to the brief's assumption
- The brief's premise of "no desktop fallback" is **only partly true**. A web version does exist at **web.umang.gov.in**, described as bypassing some app-specific bugs. — search summary. This weakens "no desktop fallback" as a standalone pain point; the report should lean on discoverability + auth/session failures instead, which are far better evidenced.

---

## 3. Root causes — UI or backend/process?

Genuinely mixed, but the *severe* and *distinctive* failures are process/backend, not paint:

| Symptom | Layer | Evidence |
|---|---|---|
| Can't find the right service | **Taxonomy/data model** — services indexed by owning department, not by citizen intent or synonym/vernacular phrasing | Department-first category structure confirmed across MeitY/Bajaj Finserv descriptions; government's own fix (voice search, chatbot) added *on top of* the same taxonomy rather than replacing it |
| OTP/auth errors mid-flow | **Session & identity-linkage layer** — Aadhaar-linked-mobile mismatch is invisible to the user until failure; UMANG login is a shallow shell over deep per-service auth (UAN, Member ID, Aadhaar FAT) with no consolidated pre-check | Named directly in troubleshooting guides; the "which ID do I need" question is answered only *after* attempting a flow |
| "No permission to access this service" | **Backend entitlement/session sync** between UMANG and department systems (e.g. EPFO) — resolves itself "after a few days" with zero explanation, consistent with a backend sync/cache issue, not a UI bug | App store review pattern |
| Server errors under load (UAN mandate spike, Aug 2025) | **Capacity/integration layer** between UMANG and EPFO's own portal, both buckling together | Cross-referenced complaint pattern citing simultaneous EPFO portal and UMANG app failures |
| Slow, "outdated interface" | UI/design — real, but not the differentiated or backend-relevant failure the hackathon brief wants | Om Management Consultancy blog |

**Conclusion:** the buildathon-relevant failure is the **service catalog's taxonomy (department-indexed, not intent-indexed) and the missing pre-flight ID/document check per service** — both are data-model/process problems that a wrapper UI cannot fix without redesigning what "search" resolves to and what a service record contains before the user starts. This is squarely backend/process, matching the brief's requirement, not a reskin.

---

## 4. What's already been tried (and why gaps remain)

- **In-app search bar** — exists, keyword-matches service names, but is only as good as its literal index of ~2,400 service names/departments; a user searching "vaccine" has to already be close to the correct vocabulary.
- **Chatbot** — UMANG has advertised an AI chatbot ("Ask #UMANG chatbot") for query resolution across EPFO/ESIC/CoWIN/Jan Aushadhi topics since at least 2022 — [X/Twitter, UMANG Official, 2022](https://x.com/UmangOfficial_/status/1527153832009994240). 2025–2026 updates added a **multilingual chatbot powered by Bhashini's ULCA models** — search summary of PIB release.
- **Voice assistant ("Hey UMANG")** — government shortlisted conversational-AI vendor Senseforth.ai to add voice command functionality (download vaccination certificate, book slots, check pension, track scholarship, PF passbook, EPFO claim status) — [IndiaAI](https://indiaai.gov.in/news/now-say-hey-umang-to-avail-government-services). The stated rationale was explicitly to bridge discoverability for semi-urban/rural users who find text search or a menu tree hard to use.
- **IIPA evaluation (2025)** of the e-Governance Scheme including UMANG reportedly found it "enabled easy and seamless access... with multilingual support and extended reach" — a positive government-commissioned framing; independently, no public negative audit (CAG or otherwise) specific to UMANG's usability was found in this research pass — **flag as a gap, not a finding of "no problems exist."**

**Why the gap remains despite search/chatbot/voice investment:** all three additions are *retrieval* layers bolted onto the same department-indexed catalog and the same shallow-then-deep authentication model. None of them restructure the underlying service index around citizen intent, and none of them tell a user *before* they commit to a flow which ID/registration number that specific service will demand. A voice assistant that still routes "check my pension" into a department-tagged service list improves input modality, not the matching logic or the pre-flight readiness problem.

---

## 5. Buildathon fit assessment

**Yes, fully buildable in ~3 days with mock/synthetic data.** The reasons:
- The service catalog (department, service name, required ID/document, sub-agency) is public, structured information (already listed on umang.gov.in and in third-party guides) — a mock/synthetic index of, say, 40-80 representative real service names across EPFO, income tax, PM-JAY-adjacent, state scholarship, RTO, and certificate services is enough to demo convincingly without touching a live government system.
- No live API, OTP, Aadhaar, or payment data is needed. The core mechanic (intent → service match → document/ID pre-flight checklist) is entirely a reasoning/matching layer over static data, which fits the "must be built with an OpenAI model, must not touch live systems" constraint precisely.
- The demo story is strong and self-evident on camera: type a plain-language problem ("my UAN got rejected", "I need to update my address on my voter ID" — note: cross-reference, some of these actually live on other portals, so the mock index should stay UMANG-scoped), get routed to the right actual service tile, and get told *before* starting which of Aadhaar / UAN / Member ID / scheme registration number will be asked for and where to find it.

**Risk to flag:** this is a *matching + pre-flight* tool, not a transaction-completing tool — judges may ask "why not just fix UMANG's search bar." The defensible answer is that the value is in the **document/ID readiness check**, which UMANG's own search (keyword or voice) cannot do because it doesn't model prerequisites at all today — that's the backend/process gap, not a UI gap.

---

## 6. Candidate "fix the failing moment" problem statements

> **1. "UMANG has the service, I just cannot find it."** (Gaurav's original candidate — validated and strongest fit)
> UMANG now aggregates **2,446 services across 240 departments** (872 Central, 1,574 State) as of early 2026, up from 1,745 services/80 departments/30 states in 2024 — a catalog that has grown faster than its navigation model. Services are organized by *department* (Health, Finance, Employment, Transport, etc.), which is the one fact a citizen typically does not know about their own problem: someone who wants to "check why my PF is stuck" has to already know that lives under EPFO, itself filed under Employment & Skills, not Finance, before the app's category tiles are any use. Independent commentary puts regular engagement at roughly 20–25% of the ~50 million+ downloads [unverified single-source figure, directional only], and the government's own fixes to date — an in-app keyword search, a multilingual chatbot (Bhashini ULCA-powered), and a voice assistant built with Senseforth.ai explicitly pitched as a rural/semi-urban discoverability bridge — are all retrieval layers on top of the same department-first catalog, not a restructuring of it. None of them tell a user, before they start, which ID a given service actually needs: UMANG registration gets a user *into* the app, but each service underneath (EPFO's UAN/Member ID, Aadhaar-linked-mobile for Face Authentication Technology, state scheme registration numbers) has its own separate identity requirement that only surfaces mid-flow, which is exactly where OTP/verification failures ("Unexpected error occurred," "Duplicate or no transaction history found for OTP verification") get reported after the August 2025 UAN self-generation mandate. **Strong buildathon fit:** the service catalog is mockable as a static, synthetic index (department, service name, required ID/document, and a short "find this number here" hint per service); the actual product is an intent-to-service matcher plus a pre-flight readiness check, both pure reasoning over static data, no live systems touched.

> **2. "Tell me before I fail, not after the OTP."**
> The single most repeated failure pattern in UMANG's own user complaints is not "the service is missing," it's authentication breaking mid-flow: "Unexpected error occurred" after OTP entry, "Duplicate or no transaction history found for OTP verification," and passbook/OTP failures some users report persisting for months, with UMANG support's own stock response ("heavy traffic... try after 24 hours, call 1800-115-565") offering no diagnosis of *why* a specific user's flow failed. One documented root cause is genuinely diagnosable in advance: the OTP goes to the mobile number linked to Aadhaar, not necessarily the number the user is currently using or registered with UMANG — a mismatch UMANG never surfaces before the user hits "get OTP." A tool that takes the service a user wants and the IDs/numbers they currently have on hand, and flags *in advance* — "your OTP will go to the mobile number linked to Aadhaar, not the one you typed; here's how to check which number that is" — converts a silent failure into an explained one. **Good buildathon fit but narrower than #1:** it's mockable (a small rules table of known failure modes: Aadhaar-mobile mismatch, name/DOB mismatch, employer attestation pending, etc., mirroring EPFO's own documented UAN activation errors) but risks feeling like a single-service (EPFO-only) fix rather than a platform-wide one, weakening the "UMANG" framing versus a narrower EPFO pitch.

> **3. "Which ID do I actually need, and do I have it?"**
> This is the pre-flight half of #1 isolated as its own product: UMANG's 2,400+ services span wildly different identity prerequisites (Aadhaar number + Aadhaar-linked mobile for UAN FAT generation; existing UAN/EPF Member ID if already registered; state-specific scheme registration numbers; DigiLocker-issued documents for others), and nothing in the app states this before a user opens a service. Guides written entirely to explain "UMANG registration ≠ UAN activation. Activation happens later inside the EPFO services" exist specifically because this isn't self-evident from the app. **Buildathon fit:** strong as a companion/sub-feature of #1, weaker as a fully standalone pitch since the "which ID" question is only valuable paired with "which service," making it more natural to fold into #1 than to pitch separately.

> **4. "My department redirected me to another portal and now I'm lost."**
> Independent commentary notes some state-level services on UMANG "redirect users to external portals rather than completing transactions in-app," meaning the aggregator's promise of "one app for everything" silently breaks for a subset of services, and the citizen has no way to know in advance which services will hand them off elsewhere versus complete natively. **Weaker buildathon fit:** the underlying redirect behavior is real but thinly sourced in this research pass (single blog, no independent confirmation or specific service list), and demoing "sometimes it redirects you" is a less concrete failing moment than #1 or #2 — would need further verification before committing a team to it.

> **5. "The app says my complaint chatbot answered me. Did it?"**
> UMANG has run a chatbot since at least 2022 and added a Bhashini-powered multilingual version in 2025–2026 for query resolution across EPFO, ESIC, CoWIN, Jan Aushadhi and other services. No sourced evidence in this research pass documents chatbot *failure* specifically (as opposed to general app instability), so this is speculative rather than evidenced — **weakest of the five, not recommended without further primary research** (e.g., pulling actual chatbot transcripts or reviews mentioning it by name) before treating it as a real problem statement.

---

## Recommendation

Candidate **#1** is the strongest pick: it has the deepest, most specific, most recent sourcing (service/department counts, government's own retrieval-layer fixes, the fragmented per-service auth pattern), is explicitly a backend/process fix (service taxonomy + prerequisite modeling) rather than a reskin, and is fully buildable from synthetic data in the hackathon window. Candidate #2 is a credible secondary layer to fold into the same build (pre-flight readiness checks naturally extend into "why will my OTP fail" diagnostics) rather than a competing pitch.

## Sources referenced
- [Wikipedia: UMANG](https://en.wikipedia.org/wiki/UMANG)
- [Digital India / MeitY: UMANG initiative page](https://www.digitalindia.gov.in/initiative/umang/)
- [Google Play: UMANG](https://play.google.com/store/apps/details?id=in.gov.umang.negd.g2c&hl=en)
- [AppBrain: UMANG for Android](https://www.appbrain.com/app/umang/in.gov.umang.negd.g2c)
- [EPFO circular, Aug 2025: Mandatory Allotment/Activation of UAN through UMANG using FAT](https://www.epfindia.gov.in/site_docs/PDFs/Circulars/Y2025-2026/MandatoryAllotment_ActivationOfUANThroughUMANGAPPUsingFAT.pdf)
- [NewsPress India: Umang App 2026 Update — 50 New Government Services](https://newspress.co.in/umang-app-2026-update-50-new-government-services-integrated/)
- [IndiaAI: "Now say Hey UMANG"](https://indiaai.gov.in/news/now-say-hey-umang-to-avail-government-services)
- [Om Management Consultancy blog: UMANG App — Why India's One-Stop Platform Still Feels Like Work-in-Progress](https://omconsultants.in/blog/umang-app-why-indias-one-stop-government-service-platform-still-feels-like-work-in-progress/)
- [Medium: UMANG App & EPFO Crashes Expose Hypocrisy in India's New Labour Codes](https://medium.com/@abhishekroy77771/umang-app-epfo-crashes-expose-hypocrisy-in-indias-new-labour-codes-ab9fcacbf294) (title/claims via search index only, direct fetch blocked)
- [Bajaj Finserv: UMANG App guide](https://www.bajajfinserv.in/investments/umang-app)
- [Pocket HRMS: How to Register for UAN on UMANG](https://www.pockethrms.com/blog/how-to-register-for-uan-on-the-umang-app/)
- [Kustodian: UAN Activation Errors & Fixes](https://kustodian.life/resources/uan-activation-errors-fixes-otp-name-dob-mobile-2026-guide)
- PIB press release PRID=2245056 (figures via search-index summary; direct fetch returned HTTP 403)

## Notes on research limitations
- Several primary sources (PIB press release, Mouthshut reviews, Medium article) returned HTTP 403 on direct fetch and had to be relied on via search-engine summary snippets rather than full text — treat exact figures from those as reasonably reliable (search engines index accurately) but not independently re-verified word-for-word.
- No independent CAG or parliamentary audit report specifically on UMANG's usability was located in this pass; this is a gap in available evidence, not a claim that none exists.
- The "20–25% regular engagement" and "5.58 crore users / 383 crore transactions" figures are flagged unverified — cite with appropriate hedging if used in the team's pitch deck, or seek a primary-source government release before presenting them as fact.
