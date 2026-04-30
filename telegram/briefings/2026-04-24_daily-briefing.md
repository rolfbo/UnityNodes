# Unity Nodes — Daily Telegram Briefing

**Date:** 2026-04-24
**Channels reviewed (last 7–14 days):**
- Unity Network Announcements (official)
- Unity Network - Verified (official community)
- Club Unity License Operators (ULO community)
- Unity Farmers Collective (farmer community)

---

## 1. Official Announcements (last 2 weeks)

### Apr 13–15 — Scout & Runner Alpha Wrap
Team hosted an X Spaces briefing on **Apr 15 at 17:00 CET** to wrap the S&R Alpha and outline next steps toward public launch.

### Apr 15 — Global Physical Compute Marketplace positioning
- 40,000+ devices online across 170+ countries and 1,500+ cities.
- Three access paths for buyers: Marketplace website, API, MCP (for AI agents).
- Pitch: "real devices in real hands in real locations" — positioned vs. VPNs and cloud simulators.
- Operator message: higher demand = more tasks = more reward potential; reputation score drives premium work.

### Apr 16 — Web panel major upgrade
Feature highlights:
- Messaging + mass messaging in web panel
- Settings menu, pagination on licensing, license search, license alias
- Browse & claim marketplace pre-login
- Manage owned licenses + lease lifecycle from web
- Custom push sounds, anti-bot protection
- URL: https://manage.unitynodes.io/

### Apr 17 — Live Update & Q&A announced for **today, Apr 24 at 16:00 UTC**
- X Spaces link: https://x.com/i/spaces/1yxBeMlaXMLJN
- #ama hashtag for questions. (Event is happening today — relevant for the user.)

### Apr 23 — CLI test volume climbing
Team states CLI test volume is rising, more customers onboarding in the coming weeks.

### Apr 23 — Telemetry Upgrade teaser
Next-gen telemetry platform announced, alpha coming soon.

---

## 2. Earnings — What the community is actually reporting

### Reward levels are DOWN significantly — widespread frustration
Community sentiment is at a low point. Consistent theme: rewards dropped sharply roughly 1.5–2 months ago and have only partially recovered.

**Concrete numbers being shared:**

| Source | Setup | Reported earnings |
|---|---|---|
| Matt (Apr 18) | 36 phones (home + marketplace) | ~$15/week now, was ~$7/day 1.5 months ago |
| OC Nodes (Apr 18) | 269 bound licenses | $39/week, up from $23/week the prior week |
| Kevin Blowers (Apr 20) | 44 phones + 8 leases | $7.31/day; was $9/day pre-"recalibration" |
| Ricky (Apr 22) | S8 farm, no SIM | ~$0.18/day per license, max $0.35 |
| Forty41 (Apr 17) | eSIM for S&R | $0.47/day (best performer) |
| Dime (Apr 21) | Individual licenses | $0.05–$0.20/day per license |
| Wopdiddly (Apr 21) | 10 phones w/ SIM | ~$0.01/day |
| b y (Apr 21) | Farming device | $0.02/day — turned it off |
| LIIICHT (Apr 24) | 5 phones, multi-carrier | Zero CLI, zero SMS, "dog shit" rewards |

**The per-IP throttle pattern (Daano, Apr 22):**
- 1 license on IP: ~$0.52/day
- 2 licenses: ~$0.41–0.43 each
- 3 licenses: ~$0.26–0.38 each
- 4 licenses: ~$0.20–0.35 each
- 5 licenses: ~$0.20 each
- 6+: drops to $0.03–0.06 (Saurabh Singh confirms)

**Key insight (UKSimservice, Apr 21):** Below $0.10/day/license means the ULO is not hitting expected earnings (for 50% ULO split). Sweet spot is $0.15–0.20/license but "breaching the 5/6 [per IP] then the whole batch become $0.01."

### Farm setups are not profitable right now
- Multiple farmers have turned devices off (R B, b y, Willian, Wopdiddly).
- Widespread belief that farm setups are being deliberately throttled or blocked.
- Wopdiddly (Apr 21): 4/4 devices getting "Failed to Initiate verification" when trying to register for CLI — suspects farm setups are being blocked.
- Electricity cost vs. rewards no longer makes sense for many.

### CLI task status
- Rewards from CLI are starting to appear for some (Alder Nodes saw $0.12 and $0.04 rewards Apr 23).
- Team previously said CLI rewards would be 0.5–2.0 UPs.
- Bug: CLI test calls landing but app shows "No Test Call" — still present in build 1.1.5 (2aa32d7) as of this morning.
- Alex (Apr 24): one ULO had 8–9 CLI calls with no rewards and no way to report it — requesting a refund/missing-rewards form in today's AMA.

### Community sentiment
- NEM0 (Apr 19): "Want rewards to increase? Turn off devices."
- Chewy Dankz (Apr 20): Suspects rewards are being recycled from original Unity sales due to lack of real revenue.
- R B (Apr 22): "Guys is there something else we can use our S8 farms with… I don't have faith and time for Unity."
- James_WM_ENO (Apr 24, AMA question): "When will rewards increase to a point where it is actually worth keeping a device online?"

---

## 3. Hot topics going into today's AMA (Apr 24, 16:00 UTC)

Questions already submitted with `#amaquestion` / `#ama`:
1. **FIAT withdrawal** — when will it be enabled? (Dodo, MRCY Nodes)
2. **Missing CLI rewards** — can the team add a retrospective refund form for calls that weren't reported due to the app bug? (Alex)
3. **Reward economics** — when will rewards actually justify keeping devices online? (James_WM_ENO)
4. **WiFi/hybrid tasks** — promised late January, still not delivered late April (James_WM_ENO)

### Unresolved delay (as of this morning)
"redman" and Kyle (admin) exchange confirms: some previously announced item has been delayed; no new date; team will communicate when there's an update. Admins pushing back on vague "soon" promises.

---

## 4. Community tools & workarounds

- **unitynodes.club** — Coffee Nodes' dashboard with withdrawal guide: https://unitynodes.club/withdraw-rewards/
- **Saurabh Singh** (Apr 22) added Google Sheets logging to a community tool for daily earnings tracking.
- **Alprax** (Apr 23) added custom range support for per-license daily earnings measurement.
- **Tap Masters** (Apr 24) — Nexus nerds dashboard: 2 months in development, supports groups/aliases/search across leases.

---

## 5. Bugs / issues surfaced this week

- CLI test calls not registering in app (build 2aa32d7) — unresolved.
- "Lifetime rewards stuck at $146" on someone's dashboard (Alprax, Apr 23).
- UNO (Apr 24): iPhone lease uptime drops from 95% → 45% overnight while idle — possible background disconnect bug.
- Multiple users unable to register for CLI with farm-setup phones.

---

## 6. Suggested follow-ups for the user

1. **Attend today's AMA at 16:00 UTC** — several live questions already queued on rewards, FIAT, CLI refunds.
2. **Track the "per-IP throttle" pattern** in the ROI Calculator — the 5/6 licenses per IP breakpoint is a strong, user-reported signal that should inform scenario defaults.
3. **Flag for `telegram/tasks/active.md`:** CLI reporting fix (ongoing), WiFi/hybrid tasks (promised Jan, still open), telemetry alpha (announced Apr 23, no date).
4. **Flag for `telegram/feature-requests/open.md`:** retrospective missing-rewards refund form (Alex, strong frequency signal from multiple ULOs).

---

*Generated from Telegram MCP search across 4 channels. Source channels:*
- Unity Network Announcements (7 messages, Apr 13–23)
- Unity Network - Verified (30 recent messages, Apr 24 focus)
- Unity Farmers Collective (40+ messages across "earning", "reward", "CLI", "per day" queries)
- Club Unity License Operators (16 messages across "earning", "reward" queries)
