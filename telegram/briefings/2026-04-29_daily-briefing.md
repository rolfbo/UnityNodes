# Unity Nodes — Daily Briefing

**Date:** 2026-04-29 (automated scheduled run)
**Window covered:** 2026-04-28 → 2026-04-29
**Channels scanned:** Unity Network - Verified (608 msgs), Unity Farmers Collective (44 msgs), Club Unity License Operators (31 msgs), Unity Network Announcements (0)
**Focus:** Day-after-AMA fallout, Round 1 close speculation, persistent low-reward complaints, attestation/disconnection bugs

---

## TL;DR

- **Day-after-AMA mood is split and somewhat bitter.** The Apr 27 AMA produced no firm dates beyond Round 1 closing 2026-05-05. UNOs spent Apr 28 dissecting Josh's "satisfactory" framing of the web portal and "we're doing extremely well" comments — many feel disconnected from project leadership. Val | WhiteBridge attempted a measured defense ("development is just running, accept where we are"); Flippy, Akira, Wen, Pilla, Page Øne, Rdawgie pushed back. A new community AMA question is forming: *"With UNO confidence at an all time low, what actions (not words) will the team take to restore confidence?"* (Rdawgie, queued for May 5 monthly).
- **Earnings still in the cellar for the majority.** Reported per-device daily numbers Apr 28: Tap MastersTaps avg fell from $0.24 → $0.07 over a month. NEM0 fell from $0.25-$0.33 → $0.01-$0.03. Akira, Carlos, Rdawgie all confirm zero CLI test calls in the US. A counter-cohort: Carlos got $0.357-$0.432 on 3 T-Mobile-gateway phones, Calus B's android ULOs at $0.15-$0.30.
- **Round 1 closes May 5 — community is skeptical it'll actually close** for the third time. NEM0: "Crystal ball says it will close on May 5th." Page Øne, Akira, Wen all set "wait and see" tone; Kerry: "if you can't sell at 5k, why would anyone pay 10k?"
- **Two persistent bugs:** (1) Attestation error still requiring individual bug reports, no platform fix. (2) Phones disconnecting randomly — some traced to data SIM/Playstore, switching to WiFi reconnects.
- **Static-IP / SIM-vs-WiFi penalty pattern keeps surfacing.** Alex switched a phone from static IP/SIM to WiFi → rewards went back up. Multiple ULOs confirm this. Same dynamic Crg878 reported Apr 26.
- **New question (Apr 29):** Alder Nodes asks if the system penalizes motherboard-only farms vs full phones — TCL IONZ full phones avg $0.30/day vs Samsung S20 motherboard-only at $0.08/day in his side-by-side.
- **One bright spot:** Jaba shared that the **NexusNerd Chrome extension for license dashboard / bulk filtering is now approved** and live. This is a meaningful operator-tool unlock.
- **World Market V2 Marketplace update:** Danny shared a sneak peek — they decided to completely rebuild the bulk NFT minting function (jpg.store style, replacing OpenSea-style V1). V1 still live on mainnet. Rest of marketplace is "complete and could ship," but Danny prefers complete product first.

---

## 1. New earnings data points (Apr 28-29)

| Source | Setup | Reported earnings |
|---|---|---|
| Tap MastersTaps (Apr 28) | Cellhasher box, 20 phones/ISP × 2 + 35 charging-stand | ~$1.40/day per 20-phone cellhasher; total $6.75/day across ~75 phones (was $18/day before calibration) |
| Tap MastersTaps (Apr 28) | Per-phone average | $0.07/day (was $0.24/day a month ago, $0.41 yesterday) |
| Tap MastersTaps (Apr 28) | S&R highest day | "double digits" (number not shared per team request) |
| NEM0 (Apr 28) | 99.6% uptime, WiFi | $0.01-$0.02/day (was $0.25-$0.33) |
| Calus B (Apr 28) | WiFi-only Android | $0.18/day steady |
| Calus B (Apr 28) | SIM-only Android | $0.50/day steady |
| Calus B (Apr 28) | Android ULOs (general) | $0.15-$0.30/day depending on split |
| Carlos (Apr 28) | 3 phones on T-Mobile gateway, no SIM | $0.357, $0.387, $0.432 (one phone hit $0.5184 prior night) |
| Akira (Apr 28) | 1 ULO on iOS, 50/50 split | "consistent for a month" |
| Akira (Apr 28) | Multiple licenses 97% uptime | "still shit rewards" — flagging randomness even at high uptime |
| Wen (fed up) (Apr 28) | 3 phones | $0.006/each, 0 CLI calls received ever |
| Paul (Apr 28) | (unspecified) | "less than a penny" |
| OSUN (Apr 28) | WiFi phones + sim iPad | $0.04 |
| OSUN (Apr 28) | SIM phones | $0.01-$0.54 (high variance) |
| Alder Nodes (Apr 29) | 10 TCL IONZ full phones | ~$0.30/day each |
| Alder Nodes (Apr 29) | 20 Samsung S20 motherboard-only | ~$0.08/day each |
| MikiRoma87 (Apr 28, Farmers) | ~600 licenses (double last week) | ~$30/day |

**Key dynamics confirmed (again):**
- **Uptime gating cliff:** Akira posts evidence (with screenshot) that dropping below ~90% uptime = rewards near zero. He notes this is "an unrealistic threshold if we're targeting consumer devices." Charles agreed: "dropping rewards to nearly zero when uptime falls below a 95% threshold is problematic for retaining ULOs."
- **iOS instability:** Calus B confirms his iOS can't get above 70% uptime, randomly disconnects. Akira's ONE iOS ULO works fine — others struggle. Yinzer Mobile reports ULO with iPhone where Unity app doesn't recognize internet connection at all.
- **US gets no CLI calls:** Rdawgie, Carlos, Akira all confirm zero CLI activity in US. Page Øne notes CLI is by 3rd-party — they pick which countries to test.
- **WiFi > SIM trend reversing per Alex:** "customers prefer wifi data now??" — switched a phone from SIM to WiFi and rewards went back up. Used to be SIM that paid more (per Crg878 Apr 26).
- **Motherboard farm penalty?** Alder Nodes (Apr 29) flags 3.75× difference between full-phone vs motherboard farms. He's testing by turning off 10 of the S20s.

---

## 2. AMA reactions and community sentiment (Apr 28)

- **Kay shared partial transcript** of the Apr 27 AMA in Verified (timestamps 13:29, 19:49, 28:04, 45:57, 1:14:22). Key points captured:
  - CLI test network "everything looks fantastic," large customers online, exposure to "very renowned names." Specific timeline / contracts: "variety of contracts, mostly pay-as-you-go."
  - In-house staging environment used to set up CLI testing at scale; production rolled out, "customers are happy." Notification-without-call and call-without-notification bugs were fixed (pushed yesterday per Josh).
  - Vodafone scam-call protection does NOT block CLI verification calls (these are opt-in by ULO, not flagged as spam).
- **Sentiment swings:** Mat (Apr 28): "Josh handled himself well, good mix of authenticity and professionalism." Flippy (Apr 28): "Whole AMA was so vague, sounds like we have never been more far away from any new tasks. No clarity on anything coming up unfortunately."
- **Val vs Akira/Flippy debate:** Val arguing "this is not a casino ticket, it's RWA with a clear build target — we just have to accept where we are." Akira: "where did community expectations come from? Did we just make them up or was the team overselling and underdelivering?" Kerry: "the community was told it had advanced over the year of testing... but it was actually [marketing] to pacify those unhappy with lack of massive hyperscaling on revenue side."
- **Dennis vs Wen exchange** turned philosophical: Dennis defending "this is crypto, you bought a lottery ticket." Wen: "5kX means nothing to you? Why not give it to charity?" — emotional undertone showing how invested some UNOs feel.
- **Adam Buracchi joke** that captures it: "I'll buy more nodes at 1k 😬"

---

## 3. Open bugs & operational issues (last 48h)

- **Attestation error** — still no platform fix. Reported by Rocky NOW pool's ULO (Apr 28), Daniel 🇷🇴 (asks if individual reports needed), WW Telecoms ("Can we get an update on the attestation error, can't get any of my phones on"). Jack: "No wider update on this one sorry. Still requesting individualised bug reports."
- **Phones disconnecting** — Villion (multiple phones), Dreaminforest (20 phones, 3 days, no fix), Jon (one ULO with 10 phones all kicked, basics didn't work). Some root-caused to data SIM / Playstore / app naming issue when switching wifi↔mobile data. G Boot also flags this.
- **Marketplace "license-held-hostage" pattern.** Compost Man Unity (Apr 28): licenses auto-picked-up again immediately after revoke, from a different device, every time. Akira and Matt confirm. Josh apparently said in the AMA he didn't think this was an issue / suggested it could be API users — community disagrees firmly. Reset-license-settings before/after revoke doesn't help.
- **APK signup network failure (US).** Zolee's new US ULO trying to sign up via APK gets "network request failed" on email signup. Speculated to be related to app-naming issue (Unity → U-Network rename) affecting US-region builds.
- **iOS Unity app not recognizing internet.** Yinzer Mobile's ULO had a previously-fine iPhone where the app shows no internet/server connection despite phone being online.
- **Bug-report SLA frustration** — Jon: "I never get a response."

---

## 4. Round 1 close — community read

- Josh confirmed in AMA: Round 1 closes 2026-05-05.
- Community reads it as plausible (third try is the charm) but skeptical of the "strategic date" reasoning.
- Compost Man Unity (Apr 28): noted Josh referenced "things which have been said in social media recently concerning that date" → speculated possible coordination with World Mobile Media's May 5 marketing push. Val: "nothing, just a date coincidence."
- Kerry: "If you can't sell at 5k, why would anybody buy at 10k? Marketplace will set price below 5k."
- Lorizzle: "If people start dumping them for $500 on the new NFT market, I might bite."
- Ivo: "It doesn't make any difference in terms of rewards either way."

---

## 5. Marketplace V2 progress (World Market — Danny)

- Danny | World Market | ENO UK shared a sneak peek (Apr 28 19:39): bulk NFT minting function rebuilt from scratch.
  - Original: OpenSea-style minting.
  - V2: jpg.store-style minting.
  - V1 still live on mainnet; V2 will replace it.
  - Now integrating into admin portal — "and we're good to go."
- Akira pushed Danny to ship Buy/Sell basics now and add minting later: "ship the basics so this soft lock ends once and for all."
- Danny: "rest of marketplace is complete and can be shipped as is, allowing people to trade NFT's etc... but I'd like to ship a more complete product. Other projects on WMC need this functionality so they can continue to build and release." → He's holding for the more complete release.

---

## 6. New tooling

- **NexusNerd Chrome extension approved (Apr 29).** Jaba (Unityfarmers) confirms the extension is now approved. Snapshot view: all devices, online/offline filter, multi-sort filters (uptime, name, lease expiration). One-click filter to find offline ones with zero rewards over last 7 days for bulk revocation. This unlocks a major UNO portfolio-management capability that the official portal is still building toward.
- **Akira's dashboard** — soliciting beta testers with multiple leases. Use it for sims/wifi differentiation. (Internal/community tool, not official.)

---

## 7. Newly-surfacing recurring questions worth tracking

These appeared 2+ times in the last 48h and look like FAQ candidates:

1. **"Why does the same phone with 99% uptime earn vastly different amounts?"** — Akira's screenshots, NEM0's confusion (99.6% uptime = $0.01-$0.02), Alex's "wheel of names" line.
2. **"Are motherboard phone farms penalized vs real phones?"** — Alder Nodes Apr 29.
3. **"Why is the US getting no CLI calls?"** — Rdawgie, Carlos, Akira (all Apr 28).
4. **"What does 'bound' mean and how do I revoke unbound leases?"** — Rocky NOW pool (484 leases, 454 bound) Apr 29.
5. **"Can I run a license without a node?"** — Wattdog/Akira Apr 28 thread (answered: yes via web3 wallet, but you can't lease it out).
6. **"How do I know which ULO has my license code if I issue lots in bulk?"** — Rocky NOW pool Apr 29 (workaround: vary uptime% by 1% per batch of 200 to date-ish-stamp them).

---

## 8. Recommended actions

1. **Update `telegram/feature-requests/open.md`** with two newly-surfaced requests:
   - Stackable filters in license panel ("date generated" + "lease never activated" simultaneously) — Rocky NOW pool Apr 29.
   - Region/country expansion of CLI customer testing (US is starved) — Rdawgie/Carlos/Akira Apr 28.
2. **Update `telegram/tasks/active.md`:**
   - World Market V2 marketplace — note bulk NFT mint rebuild as cause of latest delay; rest of MP "complete."
   - Add: "Round 1 close — May 5" with status 🟡 Promised, will become Delivered or Overdue Tuesday.
   - NexusNerd extension approval is a community-built dependency that effectively unblocks the "License Grouping / Folders" official feature for now.
3. **Add a new FAQ topic file `telegram/faq/calibration-and-rewards.md`** consolidating the "why so low," uptime cliff, IP/SIM penalty, and motherboard-farm-penalty questions. The same answers keep getting repeated.
4. **AMA question to track:** Rdawgie's queued Q for May 5 monthly UNO call: "What actions, not words, will the team take to restore confidence?" — This deserves a dedicated tracker entry; it represents the central tension going into round-1 close.
5. **Earnings Tracker app:** Worth adding "device type: full-phone vs motherboard-only" as an optional record field given Alder Nodes' Apr 29 data point. Could also add "static IP vs dynamic" toggle given the Alex / Crg878 / Darren convergent finding.

---

## Sources

- [Unity Network - Verified — 2026-04-28 raw](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Network%20-%20Verified/2026-04-28-messages-raw.md) (555 msgs)
- [Unity Network - Verified — 2026-04-29 raw](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Network%20-%20Verified/2026-04-29-messages-raw.md) (53 msgs)
- [Unity Farmers Collective — 2026-04-28 raw](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Farmers%20Collective/2026-04-28-messages-raw.md) (41 msgs)
- [Unity Farmers Collective — 2026-04-29 raw](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Farmers%20Collective/2026-04-29-messages-raw.md) (3 msgs)
- [Club Unity License Operators — 2026-04-28 raw](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Club%20Unity%20License%20Operators/2026-04-28-messages-raw.md) (31 msgs)
- Unity Network Announcements — no posts in window.
