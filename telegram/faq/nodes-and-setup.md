# FAQ — Nodes, Phones, Setup

Frequency notation: 💬 = once · 💬💬 = a few times · 💬💬💬 = constantly

---

## "How many phones per IP / ISP can I run before rewards collapse?" — 💬💬💬

**Asked by:** Anon repeatedly Apr 1, 2, 4, 5, 6, 11, 12. The most consequential question of the month.

Sample asks:
- Anon [Apr 11]: "How many devices per IP?"
- Anon [Apr 4]: "to one per IP?"
- Anon [Farmers Apr 6]: "I'm at 5 or less per IP and have been for some time and am at 9 cents per phone."

**Team answer (partial):**
- Sophie [Apr 1]: confirmed "There is indeed a limit in devices/IP" but never specified.
- Anon [Apr 22 #amaquestion] paraphrasing past AMAs: "Josh, Jamie and Omri says 10 to 20 devices per ISP limit, daily WiFi/telemetry rewards say otherwise. Anymore than 5 we will reduce the 20cents you would have earned per device to 0.002 per device for each of your 10 to 20 devices."

**Community consensus:** sweet spot 1–5 per IP. 5–10 is heavily penalised. 10+ near zero.

---

## "What does 'Attestation failure' mean and how do I fix it?" — 💬💬💬

**Asked by:** dozens, especially after Apr 14, 10:00 UTC outage.

Sample asks:
- Anon [Apr 13]: "What does attestation error mean, I have reinstalled via apk and still comes up?"
- Anon [Apr 15]: "Why do all my devices suddenly show this attestation error?"
- Anon [Apr 17]: "Any update on the 'Attestation failure' bug?"

**Team answer (William, Apr 13/Apr 15):** "The error means that there was an issue validating the integrity of the device. This could be caused by anything that modifies system-level services. The attestation issues are intentional — They are a requirement put in place externally, and the level required varies depending on several factors. We have worked with our partners to plan a system that works for legitimate devices without having Google as a 3rd party requirement. The upcoming implementation for Android will only require a Google approved device, and a TEE/StrongBox chip — which includes the vast majority of Android 7+ devices."

⚠️ **Caveat:** Samsung S8 has TEE but no StrongBox chip. Many farm boxes use S8 boards. They may not pass even the new pathway.

⚠️ **Status:** Apr 27, fix still not shipped. Sophie [Apr 21]: "The alternative attestation pathway currently in development will broaden device compatibility." Older lease codes still work on devices that fail with new lease codes — i.e. requirement varies by lease/user profile.

---

## "Are S8 farm boxes still viable?" — 💬💬💬

**Asked by:** Apr 15 long farmer thread.

**Reality:** Mixed.
- 3cfarmbox / Fiona-purchased boxes — failing en masse since Apr 14.
- Jaba's boxes — reportedly surviving (Jaba [Farmers Apr 16]).
- Anon [Farmers Apr 15]: "All my S8+ boxes are out of business with attestation failure."
- Anon [Apr 15]: "Even the factory reset didn't resolve the attestation so I believe it's something like a missing sensor."
- Anon [Apr 16]: "out of my 320 devices, i receive nothing."

**Team answer:** Not confirmed S8 future. The guidance is essentially "this is the cost of stricter integrity checks; we are working on an alternative pathway."

---

## "Which app version should I install (APK vs Play Store vs App Store)?" — 💬💬

**Asked by:** Anon [Apr 15]: "so if i download the apk from the official website -> Attestation error?"

**Team answer (William, Apr 15):** "With the current implementation, there's no difference between the APK/AppStore version for attestation. Both are valid options. This will continue to be so."

Sources:
- Web Panel: https://manage.unitynodes.io/
- Google Play: https://play.google.com/store/apps/details?id=io.unitynodes.unityapp
- Direct APK: releases.unitynodes.io/android/
- App Store: https://apps.apple.com/us/app/unity-network-app/id6755482738
- "No uninstall required - update directly over your current version." (Apr 16 announcement.)

---

## "Why is my iPhone disconnecting from Unity?" — 💬💬

**Asked by:** Wattdog [Apr 22], Matt [Apr 27], MikiRoma87 [Apr 27].

Sample observations:
- Wattdog [Apr 22]: "I have struggled with my iOS devices. Tried almost everything except literally keeping the app open and locked open on my screen."
- MikiRoma87 [Apr 27]: "everytime they switch connection to wifi or data somehow get lost on that."

**Team answer:** [NEEDS ANSWER] iOS instability has not been formally addressed. Workaround: keep app foregrounded.

---

## "Does using a 'private space' / secured folder for the app cause issues?" — 💬

**Asked by:** Val [Apr 1]: "I am using the private space function but UNO ONLY to manage/help on board people on the fly at work. Can I confirm this is okay? Don't want to be flagged as abusing the system by mistake." / Unitynodehub.com [Apr 23]: "I have not received a CLI call yet. I am running unity in s secured folder. Could that be a problem?"

**Team answer:** [NEEDS ANSWER] Not officially addressed.

---

## "What phones should I avoid buying?" — 💬💬

Community guidance from observation only:
- Hisense, Samsung S8 = currently affected by attestation issues.
- Page Øne [Apr 27]: "are redmi devices still unstable for the unity app?"
- Matej [Apr 27]: "My 11 pro works perfect. Also no complains for iPhone XS."

**Team answer:** [NEEDS ANSWER] No official supported-hardware list published.

---

## "Why is uptime so important and what is the threshold?" — 💬💬

**Asked by:** ⚡️BeyondLimitsNodes⚡️, OC Nodes [Apr 27], Wopdiddly.

Community testing:
- ⚡️BeyondLimitsNodes⚡️ [Apr 27]: "Under 80% you're slashed to 0.05 max. Monitoring it for 14 days. Since 'calibration' that's the case."
- Janilom81 [Apr 27]: "Anybody with over X devices per IP will see a sharp decrease in rewards."
- Matt [Apr 27]: "with uptime..seems there are more disconnects occurring."
- Anon [Apr 23]: "Uptime 99% → 46 cents earned. Uptime 66% → 2 cents earned" — same setup.

**Team answer:** [NEEDS ANSWER] Specific thresholds not published.

---

## "What does the ULO Network Evaluation Toolkit do, and when does it ship?" — 💬💬💬

**Asked by:** community since at least Apr 1, every week.

**Team answer (Sophie, recurring):** "ULO Network Evaluation Toolkit - monitor your ULO quality 24/7 with full visibility into device grading, network quality, connectivity, device type and more. See exactly how each of your devices is rated and understand why your rewards look the way they do. The toolkit will highlight setups that may be classified as synthetic networking so you can see at a glance what's performing well for current tasks and what isn't."

⚠️ **Status:** Sophie has said "in the final stages and expected to be released in the very near term" verbatim on Apr 1, Apr 9, Apr 15, Apr 23. Not shipped Apr 27.

---

## "Where is the bug-report flow?" — 💬

**Team answer:** https://unitynodes.io/bug-report (linked in every announcement footer).
