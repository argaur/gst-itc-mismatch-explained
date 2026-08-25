# Primary Research (Stage C)

Source: `research/primary/CyberCrime-primary.md`, pulled 2026-08-24 via live Reddit search across r/IndianCyberHub, r/LegalAdviceIndia, r/TeenIndia, r/IndianWomen, r/scamindia. Quotes are copied verbatim from public posts, no private data accessed. Cross-checked against a live, no-submission walkthrough of cybercrime.gov.in on 2026-08-25 (`research/CyberCrime.md` §7).

**Named gap, stated plainly:** these are real public victim posts, not structured interviews run by the team. No `pm-product-discovery:interview-script` interview has been conducted with a real account-freeze victim. Every `[P]` tag below rests on quotable public text, not on a Mom Test interview Gaurav or Kriti personally ran. If the team gets time before the deadline, 2-3 short calls with people who lived through this (several Reddit posters, including u/HauntedAlgorithm, posted in threads that are still active) would upgrade this from strong secondary-adjacent evidence to true primary research.

Tags: **[P]** quotable line from a real public account, treated as primary voice evidence per the note above, **[H]** inference, **[X]** contradicted.

---

## 1. The dominant, repeated pattern: frozen with zero explanation

**[P]** u/Hungry_Predator, SBI account frozen the day after a first salary credit: *"I received my first salary at night and the very next day I got to know that my account has been frozen... daily he tells me the same story that the account will be unfrozen by the evening but nothing happens."* Resolved in 13 days.

**[P]** u/First_Mark7508, ₹4 lakh family wire for a visa fund, account frozen next day: *"I asked the service manager for the reason she simply says I don't know... she said I cannot give the mail [contact of cyber cell]."* Resolved in ~8 days, only after separately escalating through the bank's own customer-care channel.

**[P]** u/techie_0115, account frozen after helping police catch a scammer who had defrauded him personally: **no SMS, no email, no call, no lien amount shown.** *"Bank seems confused too."*

**[P]** u/crookit007, cyber officer's own words when reached after 10 calls: *"suno babu your account has freezed right? Just refund the amount to the victim and I will unfreeze it"*, i.e. pay regardless of guilt.

**[H]** This pattern recurs across SBI, ICICI, HDFC, Axis, IndusInd, Federal Bank, IDFC, Kotak, and Airtel Payments Bank, this is not one bank's software bug, it is a structural pattern in how the freeze mechanism propagates.

## 2. The single highest-engagement post in the entire research pass

**[P]** u/HauntedAlgorithm, "How I got my frozen bank account unfreezed" (2,434 points, 316 comments, the highest-engagement post found anywhere in this research across all 10 platforms checked): ICICI account fully debit-frozen twice over a ₹175 credit, locking ₹18.6 lakh. *"The bank got an email from cyber police station, and the entire account was locked... They handed me a letter saying 'Cyber police told us to freeze it.' When I asked for a copy of the email or notice, they refused."* Resolution required tagging police publicly on social media, filing an RTI that confirmed no case existed against him, and threatening a High Court writ citing Madras HC W.P. No. 25631 of 2024.

**[H]** This single post is strong evidence the *process*, not the underlying fraud detection, is the broken thing, a technically savvy, persistent, well-informed person still needed an RTI and a legal threat to get his own money back.

## 3. Jurisdiction ping-pong, forced physical presence

**[P]** u/Homeless_Programmer, Vadodara cyber cell freezing a distant account holder's funds, told to appear in person: *"I'm not from Gujarat, I'll have to travel 1000+km to reach there."*

**[P]** u/sandeep075aa, Bihar cyber cell case, Chennai-based account holder: after police-side unfreeze, *"the bank's own EDD team froze it again independently... Initially, they said they could not act because the freeze was due to Cyber Crime. Now that the Cyber Crime issue has been resolved, they are saying they cannot help because the freeze is from the EDD team."*

**[P]** u/lendrickchamarr, Hisar cyber cell case: officer instructed him to personally repay a disputed ₹8,200 to the original complainant before an NOC would be issued, then went silent for a month, and when reached, implied guilt: *"if I hadn't done 'wrong work' I wouldn't be facing this situation."*

## 4. What victims are already doing, manually, to fix this themselves

**[P]** u/Progamersera's explainer post documents a full DIY playbook other victims now copy: RTI request, Section 451/457 BNSS magistrate application, Delhi Cyber Crime Unit NOC route, RBI Ombudsman escalation. *"The cyber crime system does not distinguish between guilty and innocent at the time of freezing... You are now frozen, even though you are a victim of the system, not a fraudster."*

**[H]** The existence of a hand-built, community-maintained playbook for a legal process is itself the sharpest signal in the whole research pass: real people are already assembling the exact flow a product would need to formalize, one Reddit post at a time.

## 5. Second-order harm

**[P]** Community warning post (u/RubOwn7366) documents a second wave of fraud that specifically targets people who already reported a first fraud, fake "recovery agents," fake ethical hackers, fake lawyers who obtain victims' complaint numbers and charge upfront fees for recovery that never happens.

## Evidence Against (required, minimum 3)

1. **[H]→open** All primary evidence is drawn from two subreddits (r/IndianCyberHub, r/LegalAdviceIndia). Reddit users skew younger, more urban, and more digitally literate than the average account-freeze victim. Whether this pattern holds equally for less digitally literate victims (older account holders, rural bank customers) is unverified, and those are arguably the people who need a guided tool the most, and are the hardest to reach through this research method.
2. **[P]** Not every thread describes total failure. u/RubOwn7366's community guide states the freezing mechanism itself is trusted: *"Call 1930... This starts the process that can freeze the money downstream. Do it before anything else, even before your bank."* The complaint is specifically about the release side, not the entire system, a build that frames this as "the whole portal is broken" would be overstating what the evidence actually shows.
3. **[P]** At least one thread shows the system moving fast when it wants to: u/Hungry_Predator's case resolved in 13 days, u/First_Mark7508's in about 8, without any legal escalation. Not every case requires an RTI or a High Court threat, some resolve through persistence with the bank's own customer-care channel. A build that assumes every case needs the full legal-escalation flow may be over-engineered for the median case.
4. **[H]→open** No primary source describes what happens on the other side of a *correct* freeze, i.e. a case where the account holder genuinely was a knowing mule. All primary evidence found is self-selected: people who believe themselves innocent and are motivated enough to post publicly about it. This is a real selection bias the team should carry forward, a build cannot verify guilt or innocence any better than the current system can, and should not pretend otherwise.

---

*Full citation trail and additional threads: `research/primary/CyberCrime-primary.md`.*
