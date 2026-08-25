# Spark

Captured 2026-08-25/26, autonomous session (Gaurav stepped away, asked Claude to proceed with `/prd-create` through problem statement and pain points, no solution space yet). This spark is reconstructed from the session's own research and two independent Fable 5 agent opinions, not a live verbal dump from Gaurav. Flagged here so the gap is visible, not hidden.

---

**[H]** Kriti and Gaurav are building for the "Build What Moves India" hackathon. The brief: pick one of 10 named Indian government digital platforms, find a real failure in it, and fix the backend or process behind that failure, not just the screen. No live systems, no real Aadhaar/PAN/OTP/payment data. Team is 2 people. Deadline Aug 28, 2026, 8:00 PM IST.

**[H]** The team narrowed 10 platforms to 2: the National Cyber Crime Reporting Portal (cybercrime.gov.in) and CPGRAMS (pgportal.gov.in). Both were researched in depth (secondary sources plus a live screen-by-screen walkthrough of both real portals, no data submitted) and compared by two independent Fable 5 agents, one giving an opinion, one grilling that opinion.

**[H]** The pain point that survived both rounds: on the Cyber Crime portal, when fraud money moves through a chain of bank accounts before reaching a scammer, banks freeze every account in that chain, including people who received money for an unrelated, legitimate reason and had no idea it was tainted. The freeze itself is fast and automated. Getting an account released is not. There is no tracked process, no SLA, no notice explaining why the account froze, and no default path back. Victims describe reverse-engineering their own way out: filing an RTI to prove no case names them, threatening a High Court writ, publicly tagging police on social media to get a callback, or traveling hundreds of kilometers to a jurisdiction they have no other connection to.

**[H]** This shows up as a real, recurring, well-documented pattern. Secondary research counts roughly 8.5 lakh mule accounts flagged by the CBI in 2025 and 2.73 million accounts shared by I4C with banks between September 2024 and January 2026, at a scale where innocent people are near-certainly caught in that net. Primary research (real Reddit threads from victims) found the same pattern independently, at higher volume and higher engagement than any other failure mode checked across all 10 platforms, including one post with 2,434 points and 316 comments describing exactly this ordeal.

**[H]** Gaurav has not yet confirmed this is the pain point he wants to build for. He has also not yet resolved a real overlap risk: Harshit, from the other 2-person team that split off the same original group, has a candidate idea on record ("why is my account frozen") that touches the same problem. That conversation has been flagged twice in this session's memory but not yet had.

**Non-goal for this session:** no solution design. This Spark and everything downstream in this run stops at problem statement and pain points, per Gaurav's explicit instruction.
