# Unity Nodes — Daily Briefing

**Date:** 2026-04-28
**Window covered:** 2026-04-21 → 2026-04-28 (last 7 days, with focus on April 27 AMA and April 28 follow-up)
**Channels scanned:** Unity Network - Verified, Unity Farmers Collective, Unity Network Announcements
**Focus:** Latest community discussions about Unity Nodes and current earnings situation

---

## TL;DR

- **Sentiment is at a low.** Multiple long-time UNOs are publicly stepping back, threatening to sell, or warning that ULOs are abandoning licenses *en masse* because rewards have dropped to cents (or fractions of cents) per device per day since "calibration" began on/around 21–22 March.
- **The April 27 AMA** (rescheduled from April 24 due to team travel) ran for ~2 hours at 6 PM UTC. A community-made summary PDF (`UNETWORK_AMA_27_04_26.pdf`, by Nico | NodeX) is circulating. The next AMA is teased for Tuesday next week (May 5, 2026).
- **The earnings story splits into two camps.**
  - *Majority view:* rewards are far below the $96/license/month and $19,200/node/year originally implied, and have collapsed since "calibration." Typical reports: $0.001–$0.05/device/day, with many "0" days. Several UNOs calculate ROI now in years, not months.
  - *Minority counter-view:* a small number of farmers/UNOs (Janilom81, MikiRoma87, Wattdog) report rewards trending **up** — one Farmers Collective post from a ~600-license farmer claims ~$30/day this week.
- **Two acute bugs are open:** (1) an "Attestation error" that's affecting newly-bound devices; (2) phones spontaneously disconnecting from Unity. Both still require individual bug reports — no platform-wide fix yet.
- **Round 1 node sale** is rumored to end May 5. Community is skeptical it will actually close — sentiment is "no one is buying $10k nodes earning $0.20/day."

---

## 1. Earnings situation — the hard numbers being shared

These are the actual figures community members posted in the last 7 days. They are direct ULO/UNO reports, not official data.

| Source | Setup | Reported earnings |
|---|---|---|
| Nashy82 (Apr 21) | First successful CLI test call | $0.20 (one-off reward) |
| Compost Man Unity (Apr 21) | CLI test, 100% UNO split | 0.2 UPs per call |
| WE (Apr 21) | CLI on 50/50 lease | 0.2 UPs |
| Page Øne (Apr 21) | Repeated CLI calls | $0.08–$0.10 per call |
| Wen "fed up" (Apr 25) | 3 devices, no CLI calls | $0.006/device/day — "lowest ever" |
| Jouni Kuisma (Apr 26) | 36 bound licenses | ~$2/day total → ~7 years to recoup investment |
| Kerry (Apr 28) | "Stagnant revenue over the last 13 months" | (no number; complaint about flat trend) |
| Crg878 (Apr 26) | 8 phones on 1000 Mbps fibre | $0.05/day per phone |
| Crg878 (Apr 26) | 8 phones on 25 Mbps SIM router | $0.20/day per phone (slower link earns *more*) |
| Flippy (Apr 27) | Box of 5 devices | 1 device $0.48/day, other 4 ~$0.25/day |
| Flippy (Apr 27) | Box of 4 devices, his house | ~$0.30/day each |
| ⚡️BeyondLimitsNodes⚡️ (Apr 24) | Multiple nodes/ULOs | ~$10/day total, considering selling a node |
| Wattdog (Apr 26) | 5 phones bedside | ~$0.20/day each (passive) |
| Coffee Nodes (Apr 24) | 1 active ULO on 20/80 split | >$1/day (active on Scout & Runner) |
| Zolee (Apr 23) | 99% uptime license | $0.46/day |
| Zolee (Apr 23) | 66% uptime license | $0.02/day |
| Janilom81 (Apr 27) | Small farm + ULOs | "rewards going up," ULOs requesting more licenses |
| MikiRoma87 (Apr 28) | ~600 licenses (double last week's count) | ~$30/day this week |

### Key earnings dynamics surfacing in the discussion

- **The "calibration" event** (community shorthand for the reward-recalculation that began March 21–22) is the inflection point. Pre-calibration rewards of $0.20–$0.25/ULO/day are now $0.01 for many people — a ~95%+ drop.
- **Static IP / multi-device penalty.** Darren @WorldDePIN (Apr 27): switching the same phone from his static IP to a SIM data plan "increases rewards back to previous levels." Community now believes static-IP ranges and IPs hosting >5 devices are silently penalized. Flippy: "5 units on one IP is not max rewards, more like 50%. 1 to 3 gets max."
- **Uptime gating is harsh and binary, not linear.** Zolee's data shows 99% uptime → $0.46/day, 66% uptime → $0.02/day — a 23× cliff for a 33% uptime delta. Sophie (team) confirmed there are still small rewards below the set uptime, but the magnitude is what people are complaining about.
- **CLI (Caller ID Testing) launched but underwhelming.** Three months after going "live" the rewards-per-call are $0.08–$0.20, the call-number-matching logic has bugs (showing "incorrect number" messages when the reward still pays), some users can't verify SIMs, and the UNO/ULO split display on the dashboard is misreporting (FriendlyUrchin, Apr 27).
- **iOS underperformance** is being repeatedly raised — appears to earn meaningfully less than Android (emperor tamarin, Apr 23; James_WM_ENO, Apr 27).
- **Randomness / variance** is corrosive to trust. Flippy (Apr 26): "Two phones next door to each other, both 99% uptime — one earns $0.50/day, the other $0.20."

---

## 2. The April 27 AMA — what was discussed

**When:** Apr 27, 2026 at 18:00 UTC (originally scheduled Apr 24, postponed due to team travel; the original announcement said "same time" which actually meant 18:00 UTC, not the Friday's 16:00 UTC slot — caused some confusion).
**Format:** X (Twitter) Spaces, ~2 hours.
**Speakers:** Josh, Jamie, Omri (Unity team) — community moderators Jack, Sophie, Kay relayed questions.
**Community summary:** PDF `UNETWORK_AMA_27_04_26.pdf` produced by Nico | NodeX, distributed via DM forwarding (Jack helped relay it because Nico can't post files in the channel).

### Topics confirmed in the room (per community recaps)

- **Calibration:** addressed near the end of the AMA. Per BeamNode and Alex, Josh "answered it" but R B and HFA | Earnest Nodes report no concrete explanation of *why* their rewards are near zero. Krabalot's takeaway: "rewards will suck for the majority until devs onboard more clients" — telemetry is paid by client uptime, CLI is the only other meaningfully-active task.
- **3-ULO marketplace anomaly.** Multiple UNOs reported they each pulled exactly 3 licenses from the marketplace at the start and never got more. OSUN, Jouni, others confirmed the pattern. Josh acknowledged the question but did not explain the cause.
- **Telemetry alpha / new platform.** Apr 23 announcement teased a "next-gen telemetry platform — alpha soon." Not given a firm date in the AMA.
- **CLI test volume.** Apr 23 announcement: CLI volume "continues to climb" and is expected to grow as additional customers complete onboarding. No specific volume numbers shared.
- **Timelines.** Per Akira: "2 hours of AMA and no one can tell what's coming next nor when." Per San (sarcastic recap): "Summary: everything soon."
- **Tone of the Q&A.** Mat's takeaway (Apr 28): "Josh handled himself well — good mix of authenticity and professionalism. We clearly conveyed our questions and frustration regarding communication & timelines."
- **Next AMA:** Tuesday next week (May 5, 2026 — first Tuesday of the month).

### Unanswered or weakly-answered AMA questions (logged but not resolved)

These were submitted with `#amaquestion` tags and are still open in community minds — worth tracking as needing follow-up:

- **Why did so many UNOs get exactly 3 licenses from the marketplace and never more?** (Jouni, OSUN)
- **Are current rewards funded from the original $10k node sale proceeds, or from genuine customer revenue?** (David P [DPADA], Apr 25) — i.e. is this sustainable.
- **Was "calibration" actually a euphemism for a deliberate reward cut?** (David P [DPADA], Apr 25)
- **How is telemetry reward calculated?** (Zolee — gave a concrete two-license example, asked for the formula)
- **How does the UNO-set uptime % interact with rewards?** (MikiRoma87, Elias) — same physical device, two different UNO uptime settings, what happens to rewards?
- **WiFi — why does the slower SIM router (25 Mbps) pay 4× the fibre (1 Gbps)?** (Crg878, Apr 26)
- **Compensation plan for ULOs whose unpaid CLI test calls slipped through during the broken period?** (Alex, Apr 27)
- **How close are we to WiFi-task rewards scaling to 20 devices, as originally implied?** (Flippy, Apr 23)
- **Where does the $19,200/node figure on the Unity website actually come from?** (DZ, Apr 22)

---

## 3. Open bugs & operational issues raised this week

- **Attestation error.** Reported by Rocky NOW pool, Daniel 🇷🇴, WW Telecoms (Apr 28) — appears when a ULO binds multiple licenses to separate devices and force-quits. Jack (team): "Common bug the team is working on. Still requesting individualised bug reports — no wider update."
- **Mass phone disconnections.** Villion, Dreaminforest (10 phones offline), Jon (one ULO with 10 phones all kicked) all reported phones going offline starting around April 25–26. Some root-caused to mobile data SIM/playstore issue; switching to WiFi reconnected. Not yet confirmed as a single underlying cause.
- **Caller ID dashboard — "Total Earned" displayed on wrong side.** When CLI rewards land on UNO, ULO dashboard still shows the amount under "Total Earned" (WE, Compost Man Unity, Zolee). Cosmetic but causes confusion.
- **Marketplace 3-license cap.** See AMA section above — pattern confirmed across multiple UNOs.
- **Bug-report response loop.** Jon (Apr 28): "I never get a response." This is a recurring complaint — bug-report SLA is degrading trust.

---

## 4. Community sentiment & departures

- **Shazza YNWA (Apr 25):** publicly announced stepping away. "Sick of seeing cents and less over the past 2/3 weeks. I have 17 Vivo phones for sale, London-based, 5 months old."
- **Flippy (Apr 25):** "Right now sentiment is rock bottom. No one is interested in Unity Nodes while the deal is at its best. ULOs abandon their licenses daily. UNOs want to get out."
- **⚡️BeyondLimitsNodes⚡️ (Apr 24):** "Thinking of selling one node. Currently earning approx $10 daily. Too much work. Cant believe we can't do it after 6 months. Team failed here."
- **Jouni Kuisma (Apr 26):** "Over half of mine [ULOs] have left — some even on 20/80 splits. Latest left yesterday with mostly $0.01–$0.02 rewards saying 'I can't do this now bro' and deleted the app."
- **MikiRoma87 (Apr 27):** "Anyone selling nodes for 2.5k? plz dm me" — i.e. there is a secondary market forming at ~25% of the original node price.
- **Counter-balance (Wattdog, Janilom81, Mat, MikiRoma87 farmer post):** these voices argue the project has long-term legs, rewards are improving for some, and the AMA was constructive.

A point of order: Owen D (Apr 26) pushed back on the constant complaining and was rebutted by Jouni with hard numbers — "I am making about $2/day on 36 bound licenses, that's almost 7 years to make my own money back." This exchange captures the split.

---

## 5. Round 1 node sale — closing rumor

- Round 1 has been "closing soon" multiple times per Page Øne (Apr 26), who calls it a FOMO tactic.
- Dreaminforest (Apr 28): "I highly doubt Round 1 will end May 5th but we shall see. They've teased this multiple times. Zero reasons why anyone would pay $10k for a node right now."
- Wattdog (Apr 26): "Round 1 hadn't ended because no one will buy nodes earning cents for $10k. Maybe that was a scare tactic, maybe it wasn't."
- BeamNode (Apr 27): asked whether the special reward(s) for owning ≥3 nodes is now clear — no resolution in the AMA.

---

## 6. Recommended actions for the project owner (Rolf)

1. **Run / refresh the FAQ on calibration and uptime.** This is now the dominant question in the channel and will keep coming back. The same `telegram/faq/staking.md` and `telegram/faq/nodes.md` pattern fits — add a `telegram/faq/calibration-and-rewards.md` if it doesn't exist.
2. **Log the AMA promises.** Per the project's `telegram/tasks/active.md` workflow, the AMA mentioned "lots of new tasks soon" and "telemetry alpha soon" without dates — log as `🟡 Promised`, source: April 27 AMA, expected outcome: tasks beyond CLI + telemetry to lift average per-device earnings.
3. **Open feature requests** to capture in `telegram/feature-requests/open.md`:
   - Pyramid / multi-layer ULO referral rewards (Calus B, Val, Alex — repeated several times this week → frequency 💬💬💬, but flagged with legal-risk note from Quoia75 about US federal law on >1 referral layer)
   - In-app explanation of how UP rewards work, with rules visible inside the app (Matej, Apr 27 — UX clarity for new ULOs)
   - Diagnostic / setup-recommendation tool for WiFi optimization (Crg878, Apr 26)
4. **Earnings Tracker app inputs.** The reports from Zolee, Flippy, Crg878 are clean side-by-side comparisons (uptime%, IP type, device count → $/day). Consider adding a "calibration era" flag to records imported into the Earnings Tracker so pre/post-March 21 cohorts can be sliced separately.

---

## Sources

- [Unity Network - Verified — 2026-04-28 raw messages](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Network%20-%20Verified/2026-04-28-messages-raw.md)
- [Unity Farmers Collective — 2026-04-28 raw messages](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Farmers%20Collective/2026-04-28-messages-raw.md)
- [Unity Network Announcements — last post Apr 24](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Network%20Announcements/2026-04-24-messages-raw.md)
- [Unity Network - Verified — Apr 21 to Apr 27 raw messages folder](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Network%20-%20Verified/)
- AMA recap PDF: `UNETWORK_AMA_27_04_26.pdf` (Nico | NodeX) — distributed via channel DM, not yet saved to project. Worth requesting a copy and storing under `telegram/conversations/Unity Network - Verified/2026-04-27-AMA-summary.pdf`.
