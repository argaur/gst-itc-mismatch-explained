# Platform research index

Secondary research on all 10 official platforms named in the hackathon brief (as of 2026-08-24). Each file is a full report with sourced evidence, root cause analysis, buildathon fit, and 3 to 5 candidate problem statements. Read the linked file before committing to a platform.

This research is shared across both teams. Kriti and Gaurav should use it to narrow their own pick from this list. Harshit and Varun can use the same files.

| Platform | File | Strongest candidate idea (one line) |
|---|---|---|
| IRCTC | [IRCTC.md](IRCTC.md) | Money deducted, no ticket: a payment reconciliation tracker, or a TDR pre-check tool |
| Income Tax e-Filing | [IncomeTax.md](IncomeTax.md) | AIS mismatch reconciliation engine (42 lakh AY2025-26 mismatch notices) |
| CPGRAMS | [CPGRAMS.md](CPGRAMS.md) | "Disposed doesn't mean done": checks if a closure response actually addressed the complaint, drafts the appeal if not |
| GST Portal | [GST.md](GST.md) | Decode an automated DRC-01B/01C notice against the ledger and auto-draft the right response |
| EPFO | [EPFO.md](EPFO.md) | EPS pension pre-flight check: catch service-gap issues while still employed, before an irreversible claim rejection |
| MCA | [MCA.md](MCA.md) | Director disqualification early-warning dashboard against MCA's own penalty rules |
| National Cyber Crime | [CyberCrime.md](CyberCrime.md) | Innocent mule-account freeze: fast automated freeze, slow manual release, no SLA |
| UMANG | [UMANG.md](UMANG.md) | "UMANG has the service, I just cannot find it": intent-to-service matching plus a document readiness pre-flight check |
| Parivahan Sewa | [Parivahan.md](Parivahan.md) | Payment reconciliation gap, or RC transfer/NOC staged-blocker delays (CAG-audited) |
| RTI Online | [RTI.md](RTI.md) | Information Commission appeal backlog and pendency estimator, paired with wrong-authority routing fix |

## What's confirmed across all 10
The shared pattern from the original team candidate list holds up under research: the real failure sits after a status changes (paid, disposed, rejected, frozen) and the citizen has no way to tell what actually happened or what to do next. Every strongest candidate above is a backend/process fix on top of a real, sourced failure mode. None of them require touching a live government system or real personal data.

## Where evidence was thin
Flag these before pitching:
- EPFO: Varun's original doubt held up. The 6 rejection reasons are real but risk reading as a static lookup table unless framed as a pre-flight check, not a post-rejection diagnosis.
- Some UMANG stats (service/department counts) are self-reported PIB figures and should be hedged in a pitch deck, not stated as hard fact.
