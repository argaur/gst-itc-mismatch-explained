# Problem-Space Map (Stage B)

Status: **awaiting Gaurav's gate ("Framings approved").** Drafted autonomously while Gaurav was away. Do not treat any framing below as chosen. This file exists to give Gaurav a real choice, not to justify a conclusion already reached.

Five framings follow: four live framings and one mandatory anti-thesis. Each is a distinct way to read the same Spark, with its own tradeoffs. Stage C research questions get drawn from all five, not just the one that looks strongest today.

---

## Framing 1: The stuck asset problem

**Read:** An innocent person's money is trapped. The account freeze is the symptom. The real cost is the money itself sitting inaccessible, sometimes for weeks, sometimes touching rent, tuition, or business payroll.

**What this points the build toward:** a tool centered on financial impact and urgency, ranking cases by how much money is stuck and for how long, maybe integrating a simple hardship flag.

**Tradeoff:** strong emotional pull, but it risks building a triage dashboard for a system the team cannot see inside. There is no real data feed on "how much money is stuck" a hackathon team can access, only what a citizen can self-report.

---

## Framing 2: The missing process problem

**Read:** The freeze itself works fine, it is fast, automated, and centralized. What is missing is the mirror process on the way out. Release has no state machine, no SLA, no default path. The system was built to freeze, never finished on the release side.

**What this points the build toward:** a guided, tracked process for the citizen (RTI as discovery, bank representation letter, BNSS application, escalation timeline) paired with a visible state machine showing what "release" should look like if it existed.

**Tradeoff:** this is the framing both independent Fable 5 agents converged on. It is well evidenced and structurally matches the hackathon's "fix the backend, not the screen" requirement. Risk: without careful scoping it can turn into a document generator wearing a legal costume, a smart form, not a process fix.

---

## Framing 3: The information vacuum problem

**Read:** The core failure is not the freeze and not the missing process, it is that the account holder gets no information at all. No SMS, no email, no letter, no reason. Every downstream problem, the panic, the wrong assumption of guilt, the fumbling first calls, traces back to this single gap: nobody tells the person anything.

**What this points the build toward:** a notification and explanation layer. The moment a freeze lands, the account holder gets a plain-language message: here is what happened, here is why, here is what to do next.

**Tradeoff:** this is the cleanest, most contained framing and the easiest to build small. But it risks being too thin for a hackathon judged on backend/process depth. It reads close to "notification feature," not "process fix," unless paired with Framing 2's missing state machine.

---

## Framing 4: The jurisdiction chaos problem

**Read:** The deepest structural failure is that the freezing authority is almost never in the account holder's home city, and the system treats this as the citizen's problem to solve, not its own. Multiple primary sources show contradictory guidance from different arms of the same system, one office says travel is required, another says it is not, for the exact same case.

**What this points the build toward:** a jurisdiction resolver, one tracked case with one point of contact regardless of which district's cyber cell is technically assigned, replacing the current physical-presence-by-default assumption.

**Tradeoff:** real and well evidenced (Cluster 5 of the primary research), but narrower than Framing 2 and possibly a sub-problem inside it rather than a standalone build. Building a jurisdiction resolver alone does not address the account holder's actual goal, getting the account unfrozen.

---

## Framing 5 (mandatory anti-thesis): This may not be the platform to build on at all

**Read:** The team already flagged, and has not yet resolved, that Harshit's separate 2-person team has "why is my account frozen" on their own candidate list. If both teams converge on the same platform and a similar angle, the differentiation a judge sees in a two-minute demo may collapse to nothing, no matter how the internal team frames it as different. Separately, CPGRAMS, the other finalist platform, has an original, better-documented, and less-contested finding, closed grievances with the appeal right structurally switched off, sourced to a named DARPG office memorandum, that no other team is likely to walk in with.

**What this points toward:** either resolve the Harshit conversation before locking Cyber Crime at all, or seriously re-weigh CPGRAMS on its own merits rather than only as a fallback if Harshit collides.

**Tradeoff:** this framing does not propose a build, it proposes pausing. Its value is forcing the choice to be made with the overlap question closed, not open. The cost of ignoring it is a wasted three days if Kriti and Gaurav discover the collision after they have already built.

---

## What Stage C research needs to answer, across all five framings

1. Is the "stuck money" hardship angle (Framing 1) something a hackathon team can credibly demo without real financial data, or is it a dead end?
2. Does the release-side state machine (Framing 2) hold up as a genuine backend/process fix, or does it collapse into a document generator once scoped for 3 days?
3. Is the information vacuum (Framing 3) strong enough to stand alone, or does it only work as the front end of Framing 2?
4. Is the jurisdiction problem (Framing 4) a distinct build or a feature inside Framing 2?
5. What does Harshit's team actually plan to build, and does that change the calculus for Framing 5?

**Gate: awaiting "Framings approved" from Gaurav before Stage C research questions are frozen and committed to git.**
