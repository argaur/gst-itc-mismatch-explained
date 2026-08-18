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

## Out of Scope
Nothing built yet. Do not start implementation until the team locks one idea and a PRD exists.
