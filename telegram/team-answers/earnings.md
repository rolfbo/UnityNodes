# Team Answers — Earnings, Withdrawals, Rewards

Approved/canonicalized responses on earnings-related questions. Drop these into Telegram as-is.
Flag ⚠️ on answers that contain numbers/dates/policies that may change — review monthly.

---

## $150 Withdrawal Limit — Is it a hard cap?

**Question pattern:** "When can I withdraw more than $150?" / "Why a $150 limit?"

**Approved answer (sourced from Kyle, Apr 28 in Verified channel):**

> The $150 limit is only in place as a safety precaution. It's not a hard cap — there's no limit to how many withdrawal requests you can make. You can submit multiple back-to-back transactions in the same session if you want to move more than $150. The limit will be increased in the future.

⚠️ **Watch:** If/when the team raises the cap, update this number.

---

## Why does the same phone earn different amounts day-to-day even at high uptime?

**Question pattern:** "I have 99% uptime but my reward is $0.01. Why?" / "Same setup, different rewards. Why?"

**Approved answer:**

> Reward variance is driven by *which tasks land on your device*, not just your uptime. Your device has to be online AND match a paying customer's task parameters (region, network type, SIM carrier, device profile, etc.). High uptime is necessary but not sufficient — if no customer is testing in your region/profile that day, rewards will be low even at 100% uptime.
>
> Currently the only widely-active task is CLI verification (3rd-party customer-driven, region-by-region). More tasks (telemetry alpha, new WiFi/SIM/hybrid tasks) are in QA per the 2026-04-27 AMA. ⚠️ This explanation is a placeholder; the team has not published a reward calculation formula. We're still asking.

---

## Why is the US getting no CLI test calls?

**Question pattern:** "I'm in the US with a SIM, no CLI calls. Why?"

**Approved answer (community-relayed, no direct team statement):**

> CLI testing is initiated by 3rd-party customers (telecom operators) who choose which routes/countries they want to verify. As of Apr 28, US-based ULOs are reporting zero CLI calls. The team confirmed in the Apr 27 AMA that more customers are completing onboarding "in the coming weeks" but has not committed to specific country coverage.
>
> What this means for US ULOs: until US-targeting customers come online, telemetry/WiFi tasks (alpha-soon) will likely be the realistic earning surface. Stay opted-in to all task types in the app so your device is eligible the moment a US-customer route activates.

⚠️ **Watch:** Update this answer as soon as US CLI activity starts (or the team publishes country-coverage info).

---

## Calibration / Why are rewards so low right now?

**Question pattern:** "Why dropped from $0.20 to $0.01?" / "Are we still in calibration?"

**Approved answer (paraphrased from Sophie / Unity Network Assistant — recurring throughout April):**

> The network has been in a "calibration" phase since around 2026-03-21 to differentiate well-configured devices from synthetic/bad-actor setups. Reward levels you're seeing reflect that calibration. Once the **ULO Network Evaluation Toolkit** ships (currently in QA per the 2026-04-28 AMA, no firm ETA), each device's grading will be visible.
>
> Practical levers right now: (1) make sure your device has high uptime (95%+ — below this rewards drop sharply), (2) prefer SIM/cellular over static-IP WiFi where possible, (3) keep low device count per IP (3 or fewer for max rewards based on community testing).

⚠️ **Watch:** This answer has been used since at least Apr 1. As soon as the Toolkit ships or the team publishes calibration details, replace this answer.

---

## Are motherboard-only farms penalized vs full retail phones?

**Question pattern:** "Do motherboard farms (CellHasher, S20 PCB rigs) earn less than real phones?"

**Approved answer:**

> [NEEDS OFFICIAL ANSWER] The team has declined to publish attestation specifics (Sophie, Apr 21). Community evidence (Alder Nodes, Apr 29) shows a 3.75× gap: 10 TCL IONZ full phones at $0.30/day vs 20 Samsung S20 motherboard-only at $0.08/day in the same setup. Whether this is a deliberate motherboard penalty, a per-IP density penalty, or a device-attestation level difference is unclear. We are pressing the team for a yes/no on motherboard policy. Until then, full retail phones are the safer assumption if you're investing in new farm hardware.

⚠️ **Watch:** Replace with team statement when issued.
