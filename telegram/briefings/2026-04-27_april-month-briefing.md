# Unity Nodes — April 2026 Month Briefing

**Compiled:** 2026-04-27 (AMA day)
**Coverage:** Apr 1 – Apr 27, 2026
**Sources:** Unity Network Announcements (7 posts), Unity Network – Verified (~43K lines), Unity Farmers Collective (27 days), Club Unity License Operators (23 days)

> Replaces the earlier April briefing built on broken keyword-search data. This one is full-month-of-April, sourced from the clean per-channel raw exports.

---

## TL;DR

- **The "calibration" never ended.** It started in mid-March, persisted through all of April, and as of Apr 27 (AMA day) Sophie still cannot give an end date. Reward levels for telemetry are running at roughly 5–10% of pre-calibration. (Sophie, [Apr 23]; many ULO complaints daily.)
- **Q1 2026 roadmap tasks (WiFi, SIM, Hybrid) all slipped.** Repeated "7–10 days" promises from Josh on the X Spaces of late March became a community meme by mid-April. None of those three task types shipped this month. (R B [Apr 27]: "We just need wifi tasks what unity was in November 2025.")
- **Scout & Runner Alpha closed successfully on Apr 7** (8,959 UPs, 327 participants, $0.28/min top route rate). Public-beta MapQuest launch was scheduled for Apr 22, then **delayed by Jamie King on Apr 22 for "final polish"** — still not live by Apr 27.
- **Attestation outage hit ~Apr 14, 10:00 UTC** and broke S8-based farm boxes en masse. By Apr 27 it is still unresolved at the user level — Jack/William confirmed Apr 15 that an alternative attestation pathway is "in development" but no ETA. Some ULOs report 90–100% of their devices stranded.
- **Major web-panel update shipped Apr 16**: messaging in panel, mass messaging, marketplace search/claim-before-signin, license aliases, pagination. Easily the biggest delivery of the month.
- **Marketplace launched as concept Apr 15** ("Global Physical Compute Marketplace"); CLI test-volume increase announced Apr 23 plus "next-gen telemetry platform" alpha teased.
- **Today's Apr 27 AMA was rescheduled** from the original Apr 24 slot due to "team travel" — pre-AMA mood is the most cynical of the month: "I'm chalking it up as a nothingburger" (Rdawgie, [Apr 27]).
- **The per-IP throttling reverse-engineered by the community lands around 5 phones per IP**. Above that, telemetry rewards collapse from $0.20–0.40/day to $0.001–0.05/day. Static-IP setups are penalised hardest. (Darren @WorldDePIN, [Apr 27]; many others.)

---

## 1. Earnings Reality

### Reported earnings ranges (community-stated, April 2026)

| Setup | Daily $/license (telemetry only) | Source |
|---|---|---|
| Single SIM phone, single IP | $0.20 – $0.40 | Sophie [Apr 1]; Alex [Apr 27]; Darren [Apr 27]; Compost Man [Apr 26] |
| Personal phone with own SIM, 1 per IP | $0.40+ | Jack🎃 (Farmers) [Apr 2] – "highest were personal phones"; Kyle [Apr 3] |
| 5 phones per IP (WiFi only) | ~$0.09/phone | Anon [Farmers Apr 6] |
| 7–8 phones per IP (WiFi only) | $0.05–0.20 | Wopdiddly [Apr 26] – "8 phones on Virgin 1 Gbps → 0.05/phone; 8 phones on SIM-WiFi → 0.20" |
| 10+ phones per IP (WiFi only) | $0.001 – $0.02 | Multiple, sustained complaint |
| 20-phone S8 farm box (single IP, WiFi) | $0.025/device ($0.50/day total) | Anon [Farmers Apr 9] – "farm of 20 → ~$0.025/device" |
| Mini farm 20 phones, $14/day → $3/day | drop to ~15% of prior | Anon [Farmers Apr 8] |
| ULO full setup before calibration | $0.20–0.25 | "I was previously earning $0.20–$0.25 per ULO per day, now $0.01" – [Apr 23] |
| ULO full setup during calibration | $0.01–0.05 typical | Recurring across all channels |
| 180 active licenses, 10 phones per IP | $0.77 total/day | Anon screenshot [Apr 1] |
| Active S&R Scout (Alpha) | $35/license/day cited | Anon [Apr 3]: "woke up to $35 off one licence thanks to S&R" |
| Big network (~200 licenses, $0.20/day each) | $40/day theoretical | Compost Man math [Apr 26] |
| ULO using static IP range (/24-style) | Heavily penalised | Val [Apr 27] – "renting /24 IP ranges are penalized as that is emulating an edge network"; Darren [Apr 27] – "switching from static IP to SIM 3x rewards" |
| Single licence on top earner ULO | ~$1+/day | Anon [Apr 24] – "20/80 split, ULO active on S&R" |

### The IP / throttling rules the community has reverse-engineered

The team has **never officially stated a per-IP cap**. The community has triangulated these rules through trial and error throughout April:

- **Effective sweet spot is 1–5 phones per IP** for telemetry. Above 5, rewards drop sharply. (Anon [Apr 2]: "anything over 5–7 phones per IP gets docked"; Calus B [Apr 11]: "best just to keep 1 to 3 phones per ISP".)
- **Hard cap appears around 20 devices per IP** even at best — beyond that, rewards approach zero. (Anon [Farmers Apr 4]: "the situation seems similar to a month ago when devices per IP was effectively limited to 20".)
- **Static-IP ranges are flagged.** Renting a /24 block of IPs to spread phones is treated as "synthetic networking" because it emulates an edge network rather than being one. (Val [Apr 27].)
- **SIM connectivity beats WiFi.** Switching the same phone from static-IP WiFi to its own SIM card restores rewards 3x in same-day tests. (Darren @WorldDePIN [Apr 27]; Alex [Apr 27].)
- **Carrier-shared IPs (NAT) also get slashed.** ULOs with MVNOs whose `whatismyip` shows the same map location got reduced earnings. (Anon [ULO Club Apr 5].)
- **Uptime threshold appears to be ~80–95%.** ⚡️BeyondLimitsNodes⚡️ [Apr 27]: "Under 80% you're slashed to 0.05 max. Monitoring it for 14 days, since 'calibration' that's the case." J. P. Costa [Apr 27]: "Crazy to expect any real life ulos to keep up with this 95% uptime for max rewards. Not to mention we had to find out this ourselves, the team doesn't tell us the new rules."
- **The team will not publish the actual rules.** Sophie [Apr 21]: "We appreciate the thoroughness, but we're not able to share the specifics of the attestation architecture — including which levels are applied, how they map to leases or user profiles."

### WiFi vs SIM divide

This was the single most-discussed earnings topic in April. Confirmed pattern across many testers:

- WiFi-only phones at scale = pennies. SIM-equipped phones = cents to dimes.
- Anon [Apr 1]: "My sim phone is making 40c+ a day. But if it uses my wifi it drops to 2c. Almost like there is throttling on wifi connections."
- Wopdiddly's controlled comparison [Apr 26]: 8 phones on 1 Gbps Virgin Broadband = $0.05 each; same number of phones on SIM-card-tethered WiFi (25 Mbps) = $0.20 each. Concludes: "It's not bandwidth, it's the IP / SIM signal."
- Kyle [Apr 3]: 14 phones (mixed Android + iPhone, some SIM, some WiFi) — only the one phone "at college" (different IP) earns normally.

The community consensus: telemetry is now optimised for **organic, single-device, single-IP, SIM-bearing setups**. Farms of any kind are second-class citizens.

### Task-by-task earnings breakdown

| Task | Status (Apr 2026) | Earnings reported |
|---|---|---|
| Telemetry | Live, **drastically reduced** since calibration | $0.001 – $0.40/day depending on setup |
| Scout & Runner (Alpha) | Closed Apr 7; **public beta delayed past Apr 22** | $0.28/verified minute; one report of $35/license/day for active scout |
| CLI / Caller ID test | Live since ~Jan, **volume increase announced Apr 23** | $0.055 – $0.20/UPs per call; many phones get zero calls (Wen, Adam, Dean G, OSUN [all Apr 27]) |
| SMS testing | Went live ~Apr 1 | Negligible volume reported |
| WiFi-only task | **Promised Q1 2026, not shipped** | n/a |
| SIM-only task | **Promised Q1 2026, not shipped** | n/a |
| WiFi + SIM hybrid task | **Promised Q1 2026, not shipped** | n/a |
| Marketplace tasks | Launched as concept Apr 15 | n/a (no marketplace tasks yet flowing through to ULOs) |

CLI volume reality, Apr 27: Adam Buracchi: "I had no CLI calls so far"; Dean G: "4 sims set up for it, 0 calls"; OSUN: "9 sim phones. Zero calls"; Wopdiddly: "I had 8 over ten SIM phones but none for a few days." Even when calls do arrive, the in-app reporting flow is broken — Daniel 🇷🇴 [Apr 27]: "got a call 3hrs ago from +442034553661, unable to report it." Alex [Apr 27]: "Many prob have more unpaid than paid."

---

## 2. Official Announcements (chronological)

### Unity Network Announcements channel (only 7 posts in April)

| Date | Title | Key content |
|---|---|---|
| Apr 7, 18:44 UTC | S&R Alpha Release Successful | 8,959 UPs distributed across 12,200+ reward records; 327 participants (211 scouts, 116 runners); ~9,000 reports submitted, 81 IVR-confirmed, 30 promoted to live runners; runners dialing 1,696 active ranges covering 276,000+ numbers; top route $0.28/verified minute; reward split 96% runners / 4% scouts + 5 UP/test bonus + 0.10 UP per non-successful test |
| Apr 13, 18:03 UTC | S&R Alpha Wrap + What's Next | Briefing scheduled Tue Apr 14, 17:00 CET on X Spaces |
| Apr 13, 21:20 UTC | Date change | S&R briefing pushed to **Wed Apr 15, 17:00 CET** |
| Apr 15, 21:41 UTC | The Global Physical Compute Marketplace | 40,000+ devices online across 170+ countries / 1,500+ cities; three buyer access paths (web, API, MCP); operators rewarded by reputation score and uptime |
| Apr 16, 17:37 UTC | Application & Web Updates | Web panel parity push: in-panel messaging, mass messaging, settings menu, license pagination, marketplace search, license aliases, marketplace browse-and-claim before signin, manage-from-web, custom push sounds, anti-bot, performance |
| Apr 17, 19:57 UTC | Live Update & Q&A | AMA scheduled **Fri Apr 24, 16:00 UTC** on X Spaces; #ama tag for questions |
| Apr 23, 16:08 UTC | CLI Test Volume Is Climbing | Volume increase, "further growth expected as additional customers complete onboarding in the coming weeks" |
| Apr 23, 16:10 UTC | Telemetry Upgrade Unlocked | "Next-gen telemetry platform (alpha soon)" |
| Apr 24, 13:56 UTC | AMA Rescheduled to April 27 | Pushed from Apr 24 → **Mon Apr 27 18:00 UTC** "due to team travel" |

### Key team-member messages in the Verified channel

The most-quoted official voices in April were **Sophie** ("I will never DM you first"), **Jack** ("Will Never Message You First"), **Kay** ("Will never DM you first"), **Kyle** ("Will never DM you first"), **William** (developer, contacted privately re Magisk), **Jamie King | Minutes Network** (who personally announced the MapQuest delay), and the **Unity Network Assistant** account.

Sample official statements that shaped the month:

- Unity Network Assistant [Apr 1, 14:09]: "Yesterday alone — multiple new releases went live. SMS testing, web management portals, broadcast messaging among others. More task types are rolling out in the coming days including WiFi-only, SIM-only and S&R public release." [These task types still not shipped Apr 27.]
- Sophie [Apr 1, 06:11]: confirmed "There is indeed a limit in devices/IP" but never specified the number.
- Unity team via William [Apr 15]: "The attestation issues are intentional — They are a requirement put in place externally, and the level required varies depending on several factors."
- Jamie King [Apr 22, 20:34]: "We're pushing the launch [of S&R MapQuest public beta] back slightly whilst we complete some final polish... It's a short delay, but the right one." (Praised by Wopdiddly: "This is literally the sort of feedback we've been asking for when things are delayed.")
- Sophie [Apr 23, 14:10]: re fiat/bank withdrawal — "The release is close, but I can't share a fixed date yet."
- Unity Network Assistant [Apr 7, 19:08]: "The amount of projects that are generating revenue like Unity Network are next to nil."
- Kyle [Apr 27, 13:41]: removed a fake "AMA rescheduled to December 25" prank post by Jaba.
- Kay [Apr 27, 15:10]: corrected the Twitter widget timezone confusion — "**The correct time for the AMA is 6pm UTC**".

---

## 3. AMA Log

### The Apr 27 AMA (today)

- **Original schedule:** Fri Apr 24, 16:00 UTC.
- **Actual:** Mon Apr 27, **18:00 UTC** (announced as 16:00 UTC by the X Spaces widget — confusion all afternoon, finally cleared up by Kay at 15:10 UTC).
- **Reason for delay:** "team travel" (formal); community joked it was "team return travelling" (El Whalo, [Apr 27]).
- **Pre-AMA sentiment:** the lowest of any AMA cycle this year. The full pre-AMA Verified-channel exchange between 12:00–15:00 UTC consists almost entirely of variants of "I'm not joining," "another nothingburger," "10/10 self-rating expected." (See sentiment section below.)

### Pre-AMA #ama / #amaquestion submissions (April 1 → April 27)

Volume: 100+ messages tagged #ama or #amaquestion across the month. Recurring themes:

| Topic | Example questions | Asked by / dates |
|---|---|---|
| Calibration end date | "When can we get a baseline rewards of 25 cents a day?" / "When is calibration finally over?" / "what max period does calibration take?" | Anon [Apr 3]; Anon [Apr 23]; Anon [Apr 2] |
| Why was Q1 roadmap missed | "what caused the delay of promised tasks in december and Q1 Roadmap?" / "Why didn't WiFi/SIM/hybrid ship in Q1?" | Anon [Apr 6]; Val recurring |
| Per-IP throttling rules | "Josh Jamie and Omri says 10 to 20 devices per ISP limit, daily WiFi/telemetry rewards say otherwise. Anymore than 5 we will reduce the 20cents you would have earned per device to 0.002 per device" | Anon [Apr 22] |
| Telemetry reward fluctuation | "why are telemetry rewards fluctuating SO MUCH? we're talking +95% drops" | Anon [Apr 22] |
| Bank/fiat withdrawals | "How close are we to this release?" "Can we get an update when FIAT withdrawl will be enabled?" | Multiple [Apr 17, Apr 18, Apr 24, Apr 25] |
| Lease renewals | "Can we expect lease renewal to be implemented in the near term? I am worried of losing ULOs that have been consistently performing well" | Flavius [Apr 27]; Anon [Apr 16] |
| Referral program (layered) | "When will the team implement a simple referral system for ULO?" | OC Nodes / multiple [Apr 26, Apr 27] |
| Dev team size | "yes/no question; does the development team consist of more than 5 people?" / "does the development team consist of Fiver developers?" | Anon [Apr 22] |
| Ratings of progress | "rate unitys chance of succeeding from 1-10. 10 being the best" | Kalle [Apr 27] |
| CLI calls — none arriving | "How are the numbers that are called or the CLI task decided upon? I have one phone that received 5 calls before it even was set up properly... Another phone... hasnt received ANY call yet" | Anon [Apr 24] |
| Call-blocker apps interfering | "I got an email from vodafone... they have implemented scam call protection... would this impact the ability to receive cli calls?" / "call blocking software like Bitdefender, will it block these calls?" | Anon [Apr 22] |
| Active sales team | "is there a sales team going out to push what unity offers?" | Wen (fed up) [Apr 27] |
| Repeat marketplace re-claims | "The same licence is repeatedly taken from the marketplace... Why is it the same licence keeps being taken up?" | Anon [Apr 19] |
| In-app UX | "The Unity application urgently needs a better UX because now the new user does not understand it at all" | Matej [Apr 27] |
| Grading/toolkit status | "What is the status of the grading tool? Release was suppose to be within days weeks ago. What happened?" | Flippy [Apr 23] |
| Compensation for unreported CLI calls | "will a compensation plan be in place for ULOs that didn't have the option to report those calls?" | Alex [Apr 27] |

A post-AMA recap is **not present in the source data** — the AMA happens at 18:00 UTC today and the Verified channel export ends at ~15:50 UTC.

---

## 4. Major Threads

### (a) Q1 task delays (WiFi / SIM / Hybrid)

Background: in late March on an X Spaces, Josh (CEO) reportedly said new tasks were "7–10 days away, possibly sooner." This phrase became the meme of April.

- Apr 13, anon: "let me guess 7-10 days soon."
- Apr 14, anon: "did 7-10 days passed already? or have they reset the counter."
- Apr 14, anon: "we're told 7-10 days, target is missed, then we keep asking for weeks without a clear new target, then we're told on the next AMA how luxurious our position is."
- Apr 16, anon: "I know we like to have fun with the 7-10 days talk but when it comes to Josh's predictions, he's batting 0.00."
- Apr 17, anon: "Tool was promised and what I hate is the fact that tool-kit wasn't build before team killed 70% of the network."

The Unity Network Assistant on Apr 1, 14:09 listed WiFi-only and SIM-only tasks as "rolling out in the coming days." None had shipped by Apr 27.

The community has formally split into two camps on this:

- **Patient camp** (Calus B, Compost Man, Coffee Nodes, Janilom81): "we got carried away with the cool concept of earning from this platform from day one and just thought we were going to be rich year 1. It's not even year 1 haha!" (Apr 17.)
- **Critical camp** (Akira, El Whalo, Wen (fed up), Page Øne, ⚡️BeyondLimitsNodes⚡️, J.P. Costa, OSUN): the team's silent-then-promise-then-miss cycle is destroying ULO trust. "Many of us have gone above and beyond to help the team... we have been let down big time, basic things like ideal set ups, and app related usage has been a guesswork for us all" (Shazza YNWA, Apr 27).

### (b) Per-IP rewards collapse at 5+ licenses

Started Mar 17 (community refers to "calibration started 5–6 weeks ago" as of Apr 27). See "Earnings Reality" above for numeric details. Key points:

- The team will not publish the rules. Sophie repeatedly: "the toolkit is in the final stages and is expected to be released in the very near term" (Apr 1, Apr 9, Apr 15, Apr 23 — same line repeated).
- Anon prediction Apr 1: "Calibration will most likely end when they release the network toolkit… coincidentally. Then if you are still receiving minimal rewards even after recalibration, they'll tell you to use the toolkit. That way the loss of rewards can be due to your setup."
- Toolkit had still not shipped by Apr 27. Same Sophie line was reposted Apr 23 in a thread answering Flippy's question on its status.
- Critique from Flippy [Apr 23]: "We already have this information. Why do we need a tool for it? Uptime tier info is what we need. Location, load per area etc. And amount of devices per IP vs rewards."

### (c) Attestation failures on S8 farm boxes (Apr 14+)

Timeline:
- **Apr 14, ~10:00 UTC**: large-scale outage. "All my devices went offline with attestation failure on Tuesday around 10am UTC. All S8 boxes spread to friends and family. Never more than 20 on 1 IP." (Anon [Apr 15].)
- **Apr 14**: anon — "my whole farmbox (19 devices) just pooped out 'Attestation failure. Please reinstall the application from an official source.'"
- **Apr 15**: William (team) explains — "The attestation issues are intentional. They are a requirement put in place externally, and the level required varies depending on several factors. It's not a blanket application to the whole system. We have worked with our partners to plan a system that works for legitimate devices without having Google as a 3rd party requirement." Promises an alternative attestation pathway "in development" requiring TEE/StrongBox chip.
- **Apr 15, the catch**: S8 has TEE but **not StrongBox**. So even with the new pathway, S8 boxes may not pass.
- **Apr 16–25**: daily check-ins from affected ULOs. Anon [Apr 16] — "out of my 320 devices, i receive nothing. I drive a car with no wheels."
- **Apr 21**: Sophie/team confirms older lease codes still work on devices that fail with new lease codes — i.e. attestation requirement varies by lease/user profile. ULOs cannot move devices to fresh leases.
- **Apr 27**: still no fix shipped. Multiple "any update on attestation?" questions in #ama.

The Farmers Collective is split: **Jaba's boxes** (heavily customised) report "no attestation issues"; **3cfarmbox / Fiona** boxes report widespread failures. A community theory has emerged that custom ROMs and USB debugging-enabled setups fail integrity checks.

### (d) Scout & Runner status

- Apr 7: Alpha closed successfully (announcement: 8,959 UPs across 327 participants, $0.28/min top route).
- Apr 14: Live X Spaces "S&R Wrap + What's Next" briefing with Jamie/Josh.
- Apr 20: Willian | Nuvola: "S&R public beta is scheduled to go live on the 22nd starting with MapQuest for the first 7 days."
- **Apr 22, 20:34**: Jamie King personally announces the delay. "It's a short delay, but the right one." Community appreciates the proactive comm.
- Apr 24+: still not live. AMA delay puts further updates in limbo until Apr 27 evening.
- Anon scout Apr 3: "I submitted 10 sims (10 is the max) 7 of which got accepted, 1 got rejected and 2 are still pending. S&R is a game changer." Took "3 hours to find and submit those 10 reports."
- Cap structure (per Val/Unity Assistant Apr 7): scouts capped at 50/country (300 in USA after recent update); runners not capped — "thousands of individual runners per country supported (170+ countries)."

### (e) Marketplace launch & web panel updates

- **Apr 15** announcement: "Global Physical Compute Marketplace" — buyers post tasks via web, API, or MCP; gateway dispatches to devices by country/carrier/device-count match. Reputation score drives premium work.
- **Apr 16** announcement: large web-panel update — messaging, mass messaging, marketplace search, license aliases, browse-and-claim-before-signin, lease lifecycle management from web.
- Real-world reception (in-channel):
  - MikiRoma87 Miki [Apr 27]: "the management page should really receive enhancements on a weekly basis, it's quite annoying to have such limited filters. There are 3 sections: Total / Leased / Bound. There should be a way to see the ones that are not leased because if you use Filters there is currently Leased / Not leased. But if I click on not leased I see only 1 license, even though from the main page there are about 153 without ULO."
  - Anon [Apr 16]: "I've generated 100 codes 30/70 and now I want to put back those licenses to the marketplace 50/50 but those licenses are nowhere to be found."
  - Bug reported and fixed mid-month: licenses revoked from marketplace would be auto-reclaimed by the system (Val passing team comm Apr 12).
- Marketplace claim flow allows public browsing — first time a ULO doesn't need to sign in to see what's available.

### (f) Cheating accusations / IP flagging concerns

- Anon [Apr 19]: "Before 'calibration' big farms from India, Bangla..... extracted 1000 of $ of rewards taking those 10/90... Free money for them. Mega farms stealing money giving 0 valuable data back."
- Anon [Apr 24]: "Unfortunately, these low splits also attracted a load of synthetic scammers who didn't give a flip about the quality of the data that needs to be produced to make the edge network actually worth paying for. Thus we've been stuck in 'recalibration' for over a month."
- Val [Apr 27]: "We do know that renting /24 IP ranges are penalized as that is emulating an edge network."
- Darren @WorldDePIN [Apr 27]: legitimate UNO with static IPs and ≤5 phones per IP — penalised anyway. Has been raising support ticket "for weeks." Got Jamie's verbal promise to investigate at last AMA — still no action.
- Multiple ULOs report being flagged with no explanation, no recourse, no transparency on the algorithm.
- Worry expressed by Anon [Apr 1]: "I am using the private space function but UNO ONLY to manage/help on board people on the fly at work. Can I confirm this is okay? Don't want to be flagged as abusing the system by mistake."

---

## 5. Sentiment Shift Over Time

### Early April (Apr 1–7) — Frustration with hope

- Anon [Apr 1]: "I'm mentally destroyed by still getting less than a penny from all marketplace ULOs, most with perfect uptime."
- Anon [Apr 1]: "All we need is a little WiFi task to fill the gap before CLI and SMS volume shows its face 😊" (still hopeful)
- Anon [Apr 3] after S&R reward: "Alright nice, woke up to $35 off one licence thanks to S&R. It's coming guys 💴🔥"
- Anon [Apr 1]: "Same, just gonna become passive. If they finally fix the app and launch some tasks that have actual volume/rewards my licenses will be taken off of the marketplace. But I'm done with actively participating."

### Mid April (Apr 8–17) — Patience tipping into resignation

- Anon [Apr 13]: Compares Unity to MELD ("Cardano-based project that promised a lot of good things and made many announcements... but slowly rugged"). Triggers an extended "is this a scam?" subthread.
- Anon [Apr 13]: "Stay outcome-focused, not timeline-focused... this is a five-to-ten-year infrastructure play, not a six-month token flip" (most measured comment of the month).
- Anon [Apr 14]: "People are worried. I am worried too. I have already waited many years with WM and lost a lot of money with MELD. Don't wanna live either case again."
- Anon [Apr 17]: "Hate to be the guy to go against the grain but Val is right. Surely we were all aware how ridiculously early we were getting in... Perhaps communication could be better but perhaps proper patience could be better."

### Late April (Apr 18–27) — Cynicism dominant

- Anon [Apr 19]: "i turned off a whole load of phones on friday so am only running 4 and im still getting 0.001 cents for these phones, i was expecting to get 20cents a phone. are rewards non existent again, it seems like we are recalibrating the recalibration."
- Akira [Apr 27]: "quite a sub-par execution. i won't say this is disappointing because i'm numb at this point 🤣 let's see what the AMA is about. not holding much expectations tbh (remember josh rates their efforts as 10/10)."
- ~v1kram~ [Apr 27]: "The will self award 10/10, and make us all feel like fools."
- Rdawgie [Apr 27]: "I don't know about the rest of you but unless the hype from the AMA has verifiable actions to it, I'm chalking it up as a nothingburger."
- David P [DPADA] [Apr 27]: "I'll be lucky if this thing just costs me $$$. It could affect my job, marriage and general health and well being."
- Anon [Apr 26] long ULO testimony: "Over half of mine have left — some of them even with 20/80 splits. Latest left just yesterday. Sent me a picture of his rewards being mostly between 0.01 and 0.02 and said that 'I can't do this now bro' and told me he had deleted the app. ... I have 36 licenses bound right now and I am making about $2 per day, which makes almost 7 years to make my own money back."
- Wen (fed up)'s very username changed from "Wen" earlier in the month to "Wen (fed up)" by Apr 22.

The mood inflection point appears to be **Apr 14–15** — when the "7–10 days" deadline lapsed and the attestation failures simultaneously hit. The Apr 16 web-panel update softened it slightly, but the lack of shipped tasks dragged sentiment back down by Apr 18.

---

## 6. Notable People

### Team-side (verified posters)

| Name | Role | Characterization |
|---|---|---|
| Sophie | Community manager | Most-active team voice; copy-pastes evaluation-toolkit boilerplate ~6 times this month |
| Jack | Community lead | Most-active team voice late-night Apr 1–2; lighter touch than Sophie |
| Kay | Community manager | Surfaced Apr 27 to handle AMA timezone confusion; firm rule enforcer |
| Kyle | Community manager | Active Apr 27 — takedown of Jaba's prank "AMA rescheduled to December 25" message |
| William | Developer | The technical voice on attestation; provides Magisk troubleshooting privately to farm operators (Apr 16) |
| Jamie King | Minutes Network team | Personal MapQuest delay announcement (Apr 22), praised for proactive comm |
| Josh | CEO (X Spaces only) | The "7–10 days" prediction source; not posting in TG himself; community references only |
| Omri | Team (X Spaces only) | Cited alongside Josh/Jamie for the 10–20 devices/ISP figure that doesn't match reality |
| Unity Network Assistant | Bot/AI | Optimistic boilerplate; cited often in disbelief by community |

### Vocal community members

| Name | Stance | One-liner |
|---|---|---|
| Val | WhiteBridge Noderunners | Engaged ambassador | Highest-volume community poster, runs interference between team and members; passes questions to team in DM |
| ⚡️BeyondLimitsNodes⚡️ | Pragmatic believer | Methodical earnings tester; runs 14-day uptime experiments; calls out unfair team comms but stays |
| Akira | Numb veteran | "i'm numb at this point" — invested heavily, expects little, expects worst |
| Wen (fed up) | Critic | Username literally changed to "fed up"; pushes hard questions in AMAs |
| Rdawgie | Realist | "Nothingburger" framing; demands shipped product before applause |
| Page Øne | Sceptic | Wants concrete dates not "7–10 days"; cynical about AMA delivery |
| Flippy | Operator critic | Pushes back on toolkit-as-solution framing; wants raw rules instead |
| OC Nodes | Marketplace strategist | Pushes 10–15% ULO splits as "way to go for first 6 months" until tasks land |
| Calus B | Patient defender | Pro-team voice; "this is a scalable thing, just early" |
| Compost Man Unity code: XY | Patient defender | Counters cynicism with positivity |
| Coffee Nodes | Patient defender | Active referrals discussion participant |
| Matt | Long-suffering UNO | Reports daily on iPhone vs Android performance (Apple worse) |
| El Whalo | Realistic critic | "No FUD, reality" framing |
| OSUN | Operations critic | "Not even going to waste my time" |
| Shazza YNWA ✌️🥸 | Community-builder | Frustrated UNO with 5+ months of ULO management invested |
| Jouni Kuisma | Earnings analyst | Quantifies ULO-side reward drops in #ama |
| Darren @WorldDePIN | Static-IP early-adopter | Has tickets with team for weeks; unable to get static-IP penalty resolved |
| J.P. Costa | Critic | "Crazy to expect any real life ulos to keep up with this 95% uptime for max rewards" |
| Janilom81 | Pragmatist | "Until we have loads of tasks running on the network, the low rewards will be felt more by ULOs" |
| Wopdiddly | Methodical operator | Best controlled WiFi-vs-SIM-tethered comparison test of the month |
| Master of Sike-ology | Comic critic | Long username, one-liners, light moderation pressure |
| MikiRoma87 Miki | UX advocate | Pushes for weekly web-panel improvements; pilots filter requests |

### Farmers Collective specific

- **Jaba — Unityfarmers**: highest-volume Farmers Collective poster; sells own boxes; Apr 16 his boxes apparently survive attestation outage where 3cfarmbox/Fiona boxes don't.
- **Jack🎃**: Farmers operator; reports "personal phones with own SIMs are top earners" (Apr 2).
- **Anon [Apr 27 prank]**: Jaba posted a fake "AMA rescheduled to December 25" message in Verified channel; Kyle removed within minutes.

---

*End of briefing. See `/telegram/faq/`, `/telegram/tasks/`, and `/telegram/feature-requests/` for derived FAQ, promise tracking, and feature requests.*
