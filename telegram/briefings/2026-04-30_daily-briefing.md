# Unity Nodes — Daily Briefing

**Date:** 2026-04-30 (automated scheduled run)
**Window covered:** 2026-04-29 → 2026-04-30
**Channels scanned:** Unity Network - Verified (~616 msgs), Unity Farmers Collective (~58 msgs), Unity Network Announcements (1), Club Unity License Operators (NOT ACCESSIBLE — channel not in current Telegram account chat list)
**Focus:** Credit-card payments go live for node purchases, CLI upgrade window + return, Round 1 close T-5 days, persistent low-reward sentiment, attestation errors continuing, Ember Nodes underwhelming sale (22% sold)

---

## TL;DR

- 🟢 **MAJOR SHIP (Apr 29 14:57 UTC):** Global credit card payments are now LIVE on UnityNodes.io for buying nodes. First fiat-on-ramp delivered ahead of the May 5 Round 1 close. Community reaction: lukewarm — majority were waiting for fiat *withdrawals*, not deposits. Bug surfaced (kalle: "Internal server error" on KYC step) — Kay confirmed "this issue has been resolved" same evening.
- 🟢 **CLI upgrade window opened and closed in one evening (Apr 29).** Calus B [17:45]: "Hey the CLI system is going in for upgrades, currently not processing calls." By 19:30 calls resumed (brickman1914 in Jamaica, Alex got +4420 number). Apr 30 morning: BeyondLimits confirms "2 ULOs got a call today. So CLI calls are back." This is the fastest team-acknowledged-and-fixed cycle observed in April.
- 🔴 **Bank/fiat withdrawal officially overdue.** Mats [Apr 29]: "Bank withdrawal was on the list for april." Apr 28 AMA framed it as ~2 weeks away. Sentiment: BeyondLimits, Nico, Ab, R B all loudly demanding bank withdrawals before more node sales.
- 🔴 **Ember Nodes sale flopped.** BeyondLimits tracked it live: "45 minutes and they sold 700 Ember nodes out of 4000" → final tally "Ember closed.. 22% sold.. Big fall." Lorizzle (an Ember holder): "Not earning even 9c a day." Lorizzle's killer comparison: "1 Unity license on a decent device can earn over 4 times an Ember node." Akira: "since embers rely on data consumption it's a lottery." Andrei still defending Sparks 40% ROI as "pretty safe."
- ⚠️ **U Network rebrand search-collision concern surfaced.** Charles [Apr 29]: "I wish U Network wasn't also a failed cryptocurrency project. The more we distance from crypto the better, but now that's what people get when they Google us." Akira: "it only takes 3 seconds to google a name before making a rebranding decision 😭😭" Compost Man [Apr 29] also asked for confirmation of the spelling and noted the plain text "doesn't look particularly nice" without the U logo.
- 📉 **Day-2 reward decline reported (Apr 30).** If You Know You Know: "Rewards are shithouse day 2 again — something definitely has changed so looking to report it." Same user previous day: "Didn't have a single phone above $0.02 when I used to get multiple around the $0.30-0.50 mark? Lowest reward distribution in 2 months." Multiple confirmations: Adam Buracchi "massive reduction here too," LIIICHT "phones are all switched off now," libben "just keep going down."
- 💼 **Wallet liquidity concern surfaced via community bot.** GliTch_'s wallet-balance bot showed total only **$2,213.04** across all withdrawal wallets. Page Øne immediately filed an `#amaquestion`: "why is there always a low balance in the wallets, how are we going to solve this when multiple people want to withdraw." Akira: "i think this happens when there aren't enough funds in their wallet" (re San's Internal Server Error on withdrawal quote). Wen (fed up): "I've actually made more in the last 6 months (40UPS) than is available to withdraw 🤦."
- 🔧 **5-phones-per-IP cap re-confirmed by multiple operators.** GliTch_: "Has to be like under 5 for highest then 8 for middle above that it's .01-.03 here." NEM0: "3-4 phones max for decent rewards anything above 5 drops to 0.01-0.02 range. Been testing for 2 weeks now and it's consistent." Calus B: only running 1-2 phones on his WiFi at a time now.
- 🔧 **Motherboard-vs-real-phone penalty test (Alder Nodes, Farmers Collective).** Day-2 update on his side-by-side: 10 TCL IONZ at $0.30/phone vs 20 S20 motherboards at $0.08. GliTch_'s read: "it's not that they are 'not real phones' it's that apparently they can see the devices and there are a lot of them on the network. It has to be some combination of device id/rom/some other flag." Suggests reducing to 5-8 motherboards per box improves rewards per box.
- 📲 **App still removed from Play Store.** Drewdrew [Apr 30]: "Can't find unity app on play store." BeyondLimits confirms apk-only until rebrand. Same naming/regional issue from prior days.
- 🐛 **Attestation errors persist.** David P [DPADA Farmers Apr 29]: "anyone see attestation error? Force close clears it but comes back hours later." Dave confirmed "I have this issue constantly." Darko Apr 29 evening: "Yes today almost 2 full boxes with SIM with errors." David P asks if MacroDroid auto-restart can help. No team response.
- 💬 **Sentiment summary (Apr 29-30):** Notable burnout from active community figures. James_WM_ENO: "I'm here but I'm focusing on other things in my life now.. totally drained... Starting to think earthnodes will be paying us before unity 🙄 What a terrible thought that is." Quoia75: "I'll check back in a month and see what's improved." LIIICHT: "Been this way for weeks. It doesn't work. My phones are all switched off now." This is the Wen/Akira "sceptic" cohort growing — but with a measurably more weary tone vs Apr 27-28's anger.

---

## 1. Apr 29 announcement: Credit Card payments LIVE

Single official Announcements post Apr 29 14:57 UTC: global credit card payments now active in checkout flow on UnityNodes.io.

Key reactions in Verified channel:
- Calus B: "This is amazing"
- Krabalot: "Finally 👏"
- Mats: "Bank withdrawal was on the list for april" (i.e. wrong direction)
- Adam Buracchi: "They really need to sell those nodes before the 5th…"
- BeyondLimits: "Credit card options and bank withdrawal and you move away from crypto🔥 Big WIN."
- Page Øne: "i was the same like oo that is cool now i link or get a creditcard and use it to purchase stuff. buuuuuuttttttttttttt noooooooo its just to purchase nodes"
- Flippy [Apr 29 15:32]: on whether anyone is buying with credit card — "No one"
- Master of Sike-ology [Apr 29 16:09]: "Gotta sell them now before MP opens. They'll be practically worthless then, U node what I mean?"

Bug encountered Apr 29 ~19:22 UTC:
- kalle: "Fiat version doesn't work. Internal error. Anyone else?"
- Kay confirmed bug, asked at what stage it failed (KYC).
- Kay [Apr 29 19:48]: "I'm hearing that this issue has been resolved :)"
- Wen (fed up) snark: "Such speed and precision and urgency. Very wow. Better than 7-10 days."

**Round 1 close framing:** Page Øne [Apr 29 16:28]: "dont forget 95% has been sold people, 5% is left." Akira correction: "bro its 95% of the round 1 allocation, not the whole supply. i dont think they sold more than 3500 nodes." This 3500 figure is community-estimated, not team-confirmed.

---

## 2. CLI calls — short upgrade window then back online

Timeline:
- **Apr 29 ~10:10:** Flippy: "Anyone getting calls? Had 4 or 5 per day but until yesterday just one and today zero." Multiple confirmations of dry CLI volume.
- **Apr 29 17:25:** Flippy: "Still no CLI calls today. Anyone else had one?"
- **Apr 29 17:45:** Calus B: "Hey the CLI system is going in for upgrades. It is currently not processing calls."
- **Apr 29 19:30:** brickman1914: "2 CLI calls in the space of 5 minutes!" (Jamaica)
- **Apr 29 ~19:50:** Alex got a +4420 number. Wopdiddly: "If only we knew what number the - represented 9?"
- **Apr 29 20:15:** Calus B: "OK, so I think it's safe to say at least part of the upgrade is done"
- **Apr 30 04:53:** BeyondLimits: "2 ULOs got a call today. So CLI calls are back"
- **Apr 30 04:56:** G Boot: "Got a call too."

**Note:** No team statement on what the upgrade actually changed. Worth watching for whether the "couldn't report the call" bug from earlier in the month is now fixed.

**Outstanding question (Rocky NOW pool, Apr 30 03:39):** "Is there a list of countries that are getting calls for caller id? It will be extremely helpful to push notifications regarding this to our ULOs in the appropriate regions." → New explicit feature request.

---

## 3. Reward sentiment — day-2 decline + 5-phone cap re-confirmed

**The decline reports (Apr 29):**
- Summer5372: "Still at 0.01 and 0.02 with 18 phones." (1 IP, 2 routers, all WiFi)
- If You Know You Know: "Didn't have a single phone above $0.02 when I used to get multiple around the $0.30-0.50 mark? Lowest reward distribution in 2 months." Then Apr 30: "Rewards are shithouse day 2 again."
- Adam Buracchi: "Yes massive reduction here too…"
- LIIICHT: "Been this way for weeks. It doesn't work. My phones are all switched off now."
- libben: "Same for me it just keep going down" + photo.
- Wen (fed up): 28.4.26: "0.33 Samsung no sim, 0.0065 x 3 all iOS with sim, 0.001 rando probably in Pakistan. No calls."
- Page Øne friend: 1 box went from $12 to $2.40 per day after calibration.
- Wopdiddly: most of his SIM-card phones at $0.01-0.02/day; "about 15 of them all terrible."

**The bright spots (Apr 29):**
- Calus B: "SIM cards my Wi-Fi phone, which I only have one of right now gets about $0.20 a day." Some of his phones at $0.50/day.
- Lucas: "most of my phones are now back around 0.2 up on avg from barely making 0.1 in the last few weeks."
- Dodo: "My rewards are a mixed bag, but overall it went up a bit over the last week."
- Wopdiddly Apr 29 19:08 (sarcasm but real): "One of my SIM phones is almost at two cents a day 🔥."

**5-phones-per-IP cap re-confirmed by independent observers:**
- GliTch_: "Has to be like under 5 for highest then 8 for middle, above that it's $0.01-0.03 here for whatever reason" — quantity-related.
- NEM0: "3-4 phones max for decent rewards anything above 5 drops to $0.01-0.02 range. Been testing for 2 weeks now and it's consistent."
- Elias Nikolaidis: "Once you go above five devices, the rewards decrease dramatically." (Cross-continent confirmation.)
- Calus B: "I have started basically only having a couple phones on my Wi-Fi at a time."
- Calus B's framework: "I think that's why calibrating is taking so long... clients almost certainly took the approach of going through and more carefully selecting what data they were paying for."
- Calus B: "When you have very low rewards for an extended period of time the telemetry data they're getting from your phones is not very interesting to them" — i.e. it's customer-driven, not algorithmic punishment.

---

## 4. Ember Nodes sale — 22% sold, market signal

Apr 29 timeline (BeyondLimits live-tracking):
- 16:44: "45 minutes and they sold 700 Ember nodes out of 4000.. I knew day would come we would be out of money.."
- 17:09: "Ember closed.. 22% sold.. Big fall"
- 17:11: "Second sale .. No interest. Someone getting fired"

**ROI math people are doing:**
- Ember = $165 node, currently earning $0.09/day per Lorizzle → ~$33/year → ~5-year payback at current rates.
- Lorizzle: "1 Unity license on a decent device can earn over 4 times an Ember node. And those licenses cost what…$25" → ~25-30× capital efficiency.
- Andrei argues the comparison only holds at small scale: "The moment you try to scale, you have other costs" (operational, density limits).
- Akira on Sparks vs Ember: "Sparks were a very good product... since embers rely on data consumption it's a lottery."
- BeyondLimits: "Embers are money thrown away. Buy Unity with card."

**Philippines Airnodes timing (Andrei, Apr 29 17:09):** "We need a little more time for PH. I'm hoping for end of may drops but still working on this. We've added a lot to the plans." Akira flagged the PH energy crisis (national emergency) as another headwind: "they will have to switch to solar powered ANs. Not exactly the best time to deploy infrastructure."

---

## 5. Wallet balance disclosure incident (Apr 29 ~11:55)

GliTch_ posted his wallet-balance bot output:
```
SHIB: $727.73
USDT: $364.73
SOL: $334.26
BNB: $256.81
XRP: $186.39
ETH: $161.08
USDT_BSC: $157.36
ADA: $17.38
USDC: $7.18
USDC_BSC: $0.11
Total: $2,213.04
```

Context: San had reported `Internal Server Error` on `/rewards_request_withdrawal_quote`. Akira theory: "i think this happens when there aren't enough funds in their wallet."

GliTch_ technical read: "it was previously scripted afaik. I think a few of them get pulled under a level and the script doesn't check, then they get stuck in limbo mode until updated manually."

Page Øne filed an `#amaquestion`:
> "why is there always a low balance in the wallets, how are we going to solve this when multiple people want to withdraw"

Page Øne: "i mean it should be available 24/7 to withdraw, i hope they solve it early." Akira asked GliTch_ if he can integrate the bot's API into Akira's custom dashboard so users can see wallet status before submitting withdrawal — GliTch_ open to it.

**Why this matters:** This is the first time wallet liquidity has been put into a hard number on the channel. Previously a vague concern; now a concrete (and uncomfortably small) figure. The 38.5% UNT supply distribution post-round-1 will need to scale this dramatically.

---

## 6. App rebrand status (Apr 29-30)

- **Still removed from Google Play Store.** Drewdrew [Apr 30]: "Can't find unity app on play store." Same as Matt Larsh's Apr 29 report.
- **Workaround:** APK still available via the pinned link in Verified.
- **New name confirmation:** Compost Man asked if "U Network" / "Unetwork" is confirmed. Calus B: "I think the U will be similar to or exactly like the current logo." Page Øne: "I think they probably will keep the Unity name maybe and just rebrand the app."
- **Search collision flagged by Charles + Akira:** "U Network" is also the name of a failed cryptocurrency project. Googling "U Network" surfaces that. Akira: "awful... it only takes 3 seconds to google a name before making a rebranding decision."
- **Compost Man's design concern:** plaintext "U Network" without the logo "doesn't look particularly nice."

**Implication:** The rebrand isn't fully landed. App still off Play Store ~5 days before Round 1 close. Search competition with "U Network" crypto might force another iteration.

---

## 7. Notable AMA queue (#amaquestion / queued for May 5)

New questions added to the May 5 AMA queue this window:
- **Crg878 [Apr 29 12:25]:** "Is 'proof of work' really the best term for this, or would something like 'proof of network participation' be clearer for people coming from Bitcoin and early crypto where proof of work meant something more computational?" (Long, well-argued post about marketing language.)
- **Page Øne [Apr 29 11:56]:** "why is there always a low balance in the wallets, how are we going to solve this when multiple people want to withdraw" (wallet liquidity).
- **flipwip [Apr 29 15:20]:** "When will BTC be added as a withdrawal option. It's stated on the website and causing ULO's to complain. Can the team just convert internally and make it available in the funds wallet portfolio."
- **BeyondLimits [Apr 29 15:21]:** "When bank withdrawals?" (answered in chat — see below).

Page Øne [Apr 29 12:54]: "we need atleast to have something to talk about" — i.e. expectation that May 5 needs material updates not just status quo.

---

## 8. New feature requests / pain points (Apr 29-30)

1. **Stackable filters** — already in `feature-requests/open.md`, reinforced by Rocky NOW pool's continued struggle managing 484 leases.
2. **Country list for CLI activity (NEW Apr 30)** — Rocky NOW pool: "Is there a list of countries that are getting calls for caller id? It will be extremely helpful to push notifications regarding this to our ULOs in the appropriate regions." — Sub-feature of the broader US-CLI-coverage request, but distinctly about *transparency* not coverage.
3. **Export rewards by license (NEW Apr 30)** — If You Know You Know: "Anyone got a way how we can export the rewards by license somehow? Last update lets you see the reward linked to the license with a copy function but don't want to have to copy line by line." — Currently only the NexusNerd Chrome extension provides this. Native CSV export request is new.
4. **"Mark all as read" feature (NEW Apr 29)** — Daniel 🇷🇴: "Wen 'mark all as read' feature?" — UX nit, recurring small annoyance with notification noise.
5. **Localized fiat withdrawal for emerging markets (NEW Apr 29)** — R B: "ULOs also need a withdraw a bank option for all these 3rd world countries not just a wallet address." BeyondLimits: "3 ULOs wrote to me this weekend, wen Bank😁." Already partly covered in the Apr 28 AMA "Localized Fiat Payouts (PayPal/M-Pesa/MTN)" promise.
6. **Promote-a-license to ULOs (NEW Apr 29)** — Daniel 🇷🇴: "Is there a way to promote a certain license? Can future ULOs search for a specific license?" → Currently no, RaAnRe described his workaround: created a private TG channel and contacts license holders directly.
7. **Wallet balance visibility for withdrawal (NEW Apr 29)** — Akira via GliTch_'s bot: a UI that shows wallet liquidity before user submits withdrawal request, so they know whether it'll succeed.
8. **In-app diagnostic before binding** — re-stated through Summer5372/Calus B exchange about why phones aren't earning. Already in `feature-requests/open.md` ("In-App ULO Self-Setup Verification Test").
9. **Withdraw to credit card / debit card** — Nico (NodeX): "Just get our Unity debit card working again." Val: "Withdraw to CC should follow-up I hope." Adjacent to PayPal/bank requests.

---

## 9. Promised tasks — status changes for the trackers

| Task | Status change | Source |
|---|---|---|
| Credit Card Payments (for buying nodes) | 🔵 In Progress → 🟢 **Delivered Apr 29** | Apr 29 announcement; bug fixed same day |
| CLI Upgrade (specific Apr 29 incident) | New 🟢 Delivered Apr 29 | Calus B 17:45 → calls live by 19:30 |
| Bank / Fiat Withdrawal | 🔵 In Progress → 🔴 **Overdue** | Mats: "was on the list for april"; April ends today |
| Round 1 Close | 🟡 Promised — T-5 days, watch list | All channels referencing May 5 |
| App Back on Play Store (post-rebrand) | 🟡 Promised — still pending | Apr 30 still not visible |
| Network Evaluation Toolkit | 🔴 Approaching Overdue → no update this window | Sentiment continues to harden |
| ULO Network Wifi/SIM/Hybrid Tasks | 🔴 Overdue — no update | Status quo |
| Marketplace V2 | 🔵 In Progress — no update this window | Status quo |

---

## 10. Bugs reported (still unfixed)

- **Attestation errors persist (Farmers Collective Apr 29)** — David P [DPADA], Dave, Daniel 🇷🇴 all confirm. Force-close-clears-then-returns-hours-later pattern. Darko: "almost 2 full boxes with SIM with errors." Sophie [Apr 29] told Dave "the team is working on it" with no detail.
- **Withdrawal Internal Server Error** — San [Apr 29 11:31] hit `/rewards_request_withdrawal_quote` returning `INTERNAL_ERROR`. Sophie asked him to restart device + update app + send report. San's response: "No." (Likely cause per Akira: wallet liquidity below threshold.)
- **Fiat checkout Internal Server Error** — kalle Apr 29 19:22, fixed by Apr 29 19:48 per Kay.
- **iPad rewards specifically down** — LE [Apr 29 09:32]: "Down on iPads but phones ok!!"

---

## 11. Sources

- [Unity Network - Verified — 2026-04-29 raw](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Network%20-%20Verified/2026-04-29-messages-raw.md) (600 msgs)
- [Unity Network - Verified — 2026-04-30 raw](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Network%20-%20Verified/2026-04-30-messages-raw.md) (16 msgs, partial day)
- [Unity Farmers Collective — 2026-04-29 raw](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Farmers%20Collective/2026-04-29-messages-raw.md) (~50 msgs)
- [Unity Farmers Collective — 2026-04-30 raw](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Farmers%20Collective/2026-04-30-messages-raw.md) (~6 msgs)
- [Unity Network Announcements — 2026-04-29 raw](/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/conversations/Unity%20Network%20Announcements/2026-04-29-messages-raw.md) (1 msg — Credit Card payments live)
- Club Unity License Operators — **NOT ACCESSIBLE** in this run; channel not present in current Telegram chat list (was previously accessible). Worth checking why.

---

## URGENT FLAGS

- 🚨 **Bank withdrawal is now broken-promise overdue.** April ends today; the "list for April" did not deliver. Recommend update to `tasks/overdue.md` to capture this explicitly. Trust impact: BeyondLimits, Nico, Val, Mats, Ab, R B all sound increasingly unimpressed.
- 🚨 **Wallet liquidity at $2,213 total** is structurally too small for the size of the user base — not a fixable bug, but a financial-runway question the team needs to address publicly. Page Øne's AMA queue question is the right framing.
- 🚨 **Ember sale 22% sold** is a meaningful market-demand signal for the broader Watkins ecosystem. Unity's Round 1 close on May 5 will be read against this. If Round 1 also flops, the May 5 → May 5 UNO meetup → Round 2 sequence becomes a critical confidence inflection.
- ⚠️ **Burnout among power-user UNOs is visible.** James_WM_ENO and Quoia75 both essentially tapped out this window. LIIICHT switched off all phones. These are the people who do the in-channel community-management labor for free; their disengagement compounds.
