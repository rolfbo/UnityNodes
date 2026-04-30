# Questions Asked — Unity Network AMA — 2026-04-28

79 total questions submitted; ~72 answered live; 7 deferred to the May UNO meetup.

Format: **Asker — short question.** Then a one-line summary of the team's answer.

---

## Live questions (raised by participants on stage)

- **King Warwolf** — Functionality across regions; American & Albanian phones working, but leases in Thailand and Philippines have very poor uptime. → Josh: not aware of a known issue, will escalate. Take it to support.
- **King Warwolf** — Why does the same physical device produce different rewards for different operators (after a license is moved)? → Reward depends on customer selection of data, ramp-up after device join, and current task mix. Submit a bug report if it feels wrong.
- **Emporio DTV** — What did the latest QA improvements actually cover? UI/UX fixes? Onboarding? → Continuous customer onboarding plus end-to-end QA on customer-facing tasks at scale (200 vs. 1M user load is very different). For CLI specifically: in-house staging simulation → end-to-end staging-as-prod test → prod release.
- **Emporio DTV** — Communication feedback: Jamie's Scout & Runner delay note was a great example. → Josh: noted, team committed to keeping communications frequent and clear, more of this style coming.
- **Nigel Den** — 15 devices on one IP, rewards very low — what to do? → Reward fluctuates with customer demand and task mix. Submit a bug report if you believe network is optimal but rewards aren't.
- **Cornelitics** — Status of CLI / capacity-creation / Calibration Phase. → Stable; team continuously improving stability and volume; new Wi-Fi / SIM tasks coming.
- **Val** — Will there be a new app build before the rebrand? Many CLI hiccups on Android, esp. iPhone. → Yes, a new build in a few days, parallel to renaming. Smooth transition planned.
- **Val** — When the rename lands, do users need to do anything? → Reopen the app once it lands. Communicate this to incoming ULOs onboarded from the marketplace.
- **Val** — SNR public launch — soon? → Omri/Jamie will announce. Josh's read: "I don't think it'll happen this week."

## Submitted questions answered live (grouped by theme)

### Earth Nodes & architecture
- **Page1** — How do Earth Node operators fit into U-Network and what services? → Earth Nodes are the final aggregation + cryptographic attestation + on-chain anchor (WM Chain) layer. Sit *above* switch nodes (routing) and validation nodes (integrity).

### Round 1 and bonus licenses
- **Page1** — When do we get our extra licenses? → After round 1 closes 2026-05-05. Tier locked by round-1 purchase count.
- **Page1** — Have we seen active SHIB or Polkadot people buying nodes? → Yes, but Josh declined to share numbers live.

### Customers, revenue, contracts
- **Chili** — Total task volume currently funded by customers — any reward incentive or cross-pay? → No incentive, no cross-pay.
- **Chili** — How many customers live + how many active pilots? → 20+ customers live, not all active. New Wi-Fi tasks have 10+ customers each lined up. New tasks bringing major industry names.
- **Chili** — Are contracts pay-as-you-go, fixed orders, or commitments? → Mostly pay-as-you-go. Some long-running commitments. 3rd-party task partners (Apex, etc.) on multi-year contracts.

### Scout & Runner specifics
- **Summer** — Can same SIM card from earlier Scouts be used and only top-ups claimed? → Yes — same SIM works, top-ups claimable from Scout & Runner portal. Works for both Scouts and Runners (confirmed by Omri).
- **(submitted)** — If a Scout calls and a real person picks up, do we block them? → No. CLI is connectivity verification. If you reach the wrong person, hang up and report it via Apex control panel — that's *helping* the network.
- **Mickey Rama 87** — Does the speed of CLI report (within minutes vs hour from expiry) affect rewards? → No. Standard SLA is 24h. Some customers may pay for faster — visible on the ULO app at task time.

### Support & operations
- **(submitted)** — Will support team handle huge volumes once we're live? → Team is adaptable; will scale with requests. Currently far from inundated.
- **(submitted)** — Can AMA recordings be stored in a Discord area for re-listening? → AMA archive being put together; will be categorized and shared.
- **(submitted)** — Diverse cash-out options to prevent shortages? → Crypto already available; fiat in next weeks (wire transfer); localized options (PayPal, M-Pesa, MTN) in pipeline.
- **(submitted)** — Make the delete-account button less hair-trigger. → Will add a confirmation (e.g. type "delete").
- **Alex** — Will the team accept community help? → Yes — feedback / suggestions via email or in-app form. Implementations follow.

### Reward expectations
- **Wen** — Should the team postpone payouts until 6 months after launching ≥6 tasks with volume + consistency? → Activation credits are *not* live yet. Tasks + volume must grow first. Payout structure will be reviewed at a "convenient point" for ULOs.
- **Junie Kusama** — In Q3 / start of next year, what's a rough per-license-per-month estimate? $1, $10, the conservative $96? → $96 was always the conservative ceiling, never a baseline. Could potentially exceed it under optimal conditions. Currently in scaling phase: total revenue grows with customers + tasks; per-ULO depends on individual conditions and task mix.
- **Matthias77** — Are there hard rules about phones-per-hotspot / Wi-Fi etc.? → No hard / soft / universal limit. Recommendation only: <20 in one home for sanity. Customer parameters set the actual limits dynamically.
- **Zoli** — Explain how earnings are calculated for telemetry. → Customer demand drives selection; the synthetic device cull may have changed apparent rewards for ULOs running emulators / not understanding their own networks. Uptime is one of several factors.
- **Flippy** — Real-life reward data: only 95%+ uptime gets max rewards; 65% almost zero. Hidden tier system? → Not a fixed tier. Customers buy uptime, so reward correlates. Some tasks (SNR, the new hybrid task) don't weight uptime at all.
- **Nadia** — 90%+ gives normal earnings, <90% is "almost nothing" — by design or bug? → By design (customer demand). Multiple tasks with different uptime weighting will balance this.
- **Gwims** — Realistic reward per CLI call / SMS verification per license per day, mid/medium/long term? → CLI averages currently growing. Individual CLI test calls can pay up to ~$0.50. No global average given.

### Network behaviour & integrity
- **Ms. P. Beautiful Disasta** — Was there ever a "calibration" or just a reward slash? → Recalibration after synthetic-device purge. Tens of thousands of fake devices removed. Customers re-tuning what they buy. Not a centrally-clicked reward slash.
- **Wopdiddly** — Are CLI test numbers registered somewhere to avoid scam-call blocking? → Numbers are dynamic, customer-chosen. Not blocked currently. Report any case of blocking.
- **(submitted)** — Has same license repeatedly been taken from marketplace by someone exploiting the API? → Marketplace listing is randomized. Marketplace HTTP API exists (publicly discoverable, not yet documented); public API coming. Inactive ULOs are the UNO's responsibility to manage.
- **Eddie H** — Is the same license repeatedly cherry-picked from marketplace? → Order is randomized; no top-of-list bias.

### App & tooling
- **Lazio** — Filter to hide unbound licenses? → Yes, in next release.
- **(submitted)** — Per-group reward totals on web manager? → Yes, being implemented.
- **(submitted)** — Where can ULO operators find current/upcoming task info? → Announcements channel, wiki, Twitter, email. Soon: in-app news on home screen.
- **Willen** — Way to see which ULOs still need to opt into tasks? → Yes, will be added. App should also prompt ULOs to read that section.
- **Cura75** — Can we get folders / segments for licenses on web portal before end of April? → Backend ready; will try to ship before April 30.
- **Janelom81** — UNO sending top-ups directly to ULO? → Under technical review.
- **CRG878** — Wi-Fi optimization parameters — what router settings produce best results? → Network Evaluation Toolkit will provide diagnostics + recommendations. No magic-bullet settings; speed alone (3G vs 1Gbps) doesn't predict reward — customer demand does.

### Trust & escape velocity
- **Callie** — When will stats actually show product-market fit at "escape velocity"? → Hard to quantify. Network already growing, tasks expanding, multiple competitive moats (non-synthetic, entropy at scale). Confidence will follow visible growth.
- **Dano** — Yes/no: does the dev team include more than 5 people? → Yes — 12+ including QA, mix of full- and part-time.

### Communication / sentiment
- **(submitted)** — Is the team aware of how disconnected the community feels? → Yes; multiple channels for feedback (support, in-app suggestions). Continuous improvement mode.
- **Adam Buracchi** — Q1 roadmap items not finished — what's status? → Most Q1 milestones done. Outstanding ones moved to Q2 as priority.
- **Adam Buracchi** — SMS tasks largely non-existent — what's the deal? → Volume currently light. Exchange launch will drive volume. Highly competitive vs. existing synthetic-only solutions.
- **Adam Buracchi** — Communication is too limited; community is in the dark. SNR-style updates were great. → Acknowledged. More frequent / clearer updates committed. Encouraged Adam to bring questions to the May UNO meetup.

### Future tasks & integrations
- **(submitted)** — Are 3rd parties developing tasks beyond the original vision? → Yes — telecom, enterprise, government entities are actively building. Public API announced shortly; full builder platform Q2/Q3.
- **(submitted)** — Can a generalized parameter set be used for ULOs to align with task types? → Network Evaluation Toolkit will provide this.
- **Wen** — Update on game-changing Chainlink-related task? → Coming, but no detail given (competitive sensitivity). Game-changing.
- **Wen** — When can each license consistently earn 1 UNT/day (excluding SNR)? → Multiple tasks releasing will lift reward potential. Ongoing integration of new customers + telemetry + CLI + SMS volume + integrity testing + SNR.

### Misc
- **Flippy** — Status of grading tool (release was supposed to be "within days" weeks ago)? → Under QA. Deliberately balanced so it doesn't hand bad actors a how-to-fake-legitimacy guide.
- **Beyond Limit Nodes** — How close is bank withdrawal? → ~2 weeks, possibly sooner.
- **Flavius** — Status of bank withdrawals. → Same — ~2 weeks.

---

## Deferred (to UNO meetup, 2026-05-03)

Josh confirmed at the close that **7 of 79** questions were not reached live and will be answered at the next UNO meetup. Specific names mentioned: **Willen, Flavius, Mate J, Junie, Alex, Wen, Shazza,** and "anyone else who felt their question wasn't addressed."

- 👀 **Action for our project:** when the May 3 meetup happens, capture those answers and append them here so this AMA's record is complete.
