# Unity Network AMA — 2026-04-28 — Key Learnings

**Hosts:** Josh (Unity Network) + Jamie King (questions from social)
**Format:** Spoken AMA, ~2 hours, mix of prepared updates, live questions, and questions submitted via the CM team. 79 questions submitted — ~72 answered live, 7 deferred to the UNO meetup on the first Sunday of May.

---

## Headline announcements

1. **Rebrand: Unity Network → U-Network (uNetwork).** All platform, app, web property and communication names will switch over. Timing: "near future" — a new build for Android and iPhone will ship before the rename completes. The transition is described as a *renaming* rather than a *rebranding* — it's a smooth name swap; users will need to reopen the app once the change goes live.
2. **Round 1 closes 2026-05-05 at 00:00 UTC.** Bonus license tier is locked based on round-1 purchase count and bonus licenses distribute *after* round 1 closes. Round-1 buyers also receive 38.5% of the 1B UNT supply, distributed over 12 months.
3. **Network scale (post-purge):** 50,000+ devices online, 150+ countries weekly, 1,500+ cities. Tens of thousands of synthetic devices were removed in the recent purge — the network is currently in "recalibration" as customers re-tune what they're buying.

---

## What's already shipped

- **CLI test network on production.** Customers happy. A bug where some users got a notification but no call (or vice versa) was fixed — pushed at noon CET on 2026-04-27.
- **In-app messaging UNO → ULO.** Direct from the management panel.
- **Web management portal upgrades:** pagination, license search, license aliases, marketplace browsing, owned-licenses filter.
- **Custom push notification sound.**
- **Scout & Runner Alpha** — described as "very successful complete," running on 3rd-party APEX-built infrastructure. First-ever 3rd-party task on Unity. More 3rd-party tasks in the pipeline.
- **Entropy generation as a service** — using 50K+ devices for true randomness. Described as a competitive moat: a single-machine RNG is strong but distributed-device entropy at this scale is a "dealbreaker."
- **Earth Node role clarified:** ULO device → switch nodes (routing) → validation nodes (integrity) → **Earth Nodes (final aggregation, cryptographic attestation, on-chain anchoring on WM Chain)**.

## What's in QA / "final stages"

- **Next-gen telemetry platform** — going to alpha. 2 alpha customers selected. 15+ telemetry endpoints, AI-integrated data selection. ULO license holders will be invited to test.
- **Network Evaluation Toolkit / device & network grading** — designed to give ULOs visibility into *why* their rewards are what they are. Deliberately balances "enough info to optimize" against "not enough info to teach bad actors how to fake it." Hence the delays.
- **Network Explorer** — public dashboard view into the network; ships alongside telemetry launch.
- **New Wi-Fi tasks, new SIM tasks, and at least one hybrid task** — in final QA, "released shortly."
- **Wire-transfer / fiat payouts** — backend already implemented, in final QA. Estimated ~2 weeks, possibly sooner.
- **Compute marketplace** — global, non-synthetic. Will accept phones, PCs, dedicated servers/VPS, TV-compatible devices, ARM/MIPS variants. Point-and-click + MCP-compatible (AI-agent friendly) + public API.
- **Builder platform / public API** — APIs announced "shortly"; full builder platform Q2/Q3.
- **Chainlink-related task** — repeatedly described as "game-changing." No further detail given due to competitive sensitivity.

---

## Tone, communication, and trust

- Multiple community members (Adam, Wen, Emporio, Callie) raised that communication feels distant and that the gap between promised and delivered is straining trust. Josh acknowledged this and pointed at the upcoming UNO meetup (first Sunday of May) plus the under-construction roadmap as the answer.
- Emporio specifically called out **Jamie's Scout & Runner delay note** as a positive example — short, clear, no false timelines, framed as "we want to do it right." Took as feedback that this style works.
- Reward expectations were re-set: the originally cited **$96/month per license is the conservative ceiling, not a baseline or promise**. Earnings depend on customer demand, opt-in tasks, uptime, and network behaviour.
- 7 of 79 submitted questions were not reached on air — the team committed to answering them at the May UNO meetup.

---

## Specific clarifications worth saving as FAQ candidates

| Question | Team's answer |
|---|---|
| Is there a hard limit on devices per IP / hotspot? | **No.** Recommendation only: <20 per network for sanity. Customer demand drives reward, not a hardcoded limit. |
| Are CLI test calls flagged as scam by carriers? | **No.** They're connectivity verification calls initiated by the operator who opted in. Not spam. |
| Does timing of CLI report affect reward? | **No.** You have 24h to report a CLI verification call. No reward bonus for reporting earlier. |
| Why is the same license repeatedly taken from the marketplace? | Marketplace listing is **randomized**, not top-of-list. Possibly someone is using the (unannounced but discoverable) marketplace HTTP API. Public API coming. |
| Will fiat options like PayPal / M-Pesa / MTN come? | **Yes,** localized to regions with high ULO concentration. Not yet available. |
| Are Earth Node operators part of U-Network? | **Yes** — they are the final on-chain anchoring layer. |
| Are SHIB / Polkadot communities buying nodes? | Yes, but Josh declined to share numbers live. |
| Reward calculation for telemetry? | Customer-demand-driven. No flat slash; uptime and customer-selected data points dictate per-ULO reward. |
| Are uptime tiers a hidden rule? (95% / 90% / 65%) | **No fixed tier.** Reward correlates with uptime because customers buy uptime. Some tasks (SNR, the new hybrid task) don't weight uptime at all. |
| Does location affect CLI / SIM tasks? | **Yes** — location-dependent. Customers select countries + MNOs. |
| Same SIM card from Scout, can I claim top-ups? | Yes. No need to buy a new SIM. Top-ups claimable from Scout & Runner portal — works for both Scouts and Runners. |
| What does "calibration" mean? | Network re-balancing after the synthetic-device purge. Not a reward slash — it's the customer base re-selecting what they buy now that fake devices are gone. |
| Dev team size? | 12+ including QA, mix of full- and part-time. |

---

## What we should do with this in the project

- **Promote the FAQ candidates above into `telegram/faq/` and `telegram/team-answers/`** — most of these are recurring questions in the daily Telegram traffic and now have on-record team answers.
- **Migrate every promise from this AMA into `telegram/tasks/active.md`** — see `2026-04-28_ama-promises.md` for the structured list. Several already exist in `active.md` (Network Evaluation Toolkit, Bank/Fiat, CLI volume, Telemetry alpha, Scout & Runner public, Referral program) and should be updated with the latest dates and quotes from this AMA rather than duplicated.
- **Watch for the renaming.** Once it lands, every wiki entry, FAQ page, and `team-answers` reference to "Unity Network" will need a sweep.
