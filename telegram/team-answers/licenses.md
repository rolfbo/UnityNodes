# Team Answers — Licenses, Splits, Marketplace

Approved/canonicalized responses on license and marketplace questions. Drop these into Telegram as-is.

---

## Can a license run without a node? Can a ULO own a license outright?

**Question pattern:** "If I sell a license off my node, what happens?" / "Can someone run a license with no node?"

**Approved answer:**

> Yes. A license is a separate NFT from the node NFT. If a license NFT is in your wallet (e.g. MetaMask), you can connect to the Unity app as a Licence Operator (ULO) and earn 100% of rewards from it — no split, since there's no UNO leasing it to you.
>
> The catch: **you cannot lease a standalone license out without a node.** A node is what enables the leasing capability. So a node with 0 licenses still has value (it's the leasing capacity itself), and a license without a node is "yours, you run it, 100%."

---

## What does "bound" mean? What's the difference between Total / Leased / Bound?

**Question pattern:** "What's the difference between bound and not-bound leases?" / "How do I see which leases are activated?"

**Approved answer:**

> - **Total** — all licenses you own.
> - **Leased** — licenses currently leased out to a ULO via marketplace or by code.
> - **Bound** — leases that have been activated on a device (i.e. the ULO has actually connected the app).
>
> A lease can be generated and handed out but never activated — that lease is *not bound*. In the web panel, look for the small phone-icon indicator: **illuminated phone icon = bound**, **grey phone "rectangle" = not bound** (lease code generated but not yet activated on a device). Revoking a not-bound lease and regenerating gives a new lease code but keeps the same license ID.

---

## How do I bulk-revoke unused/non-performing leases?

**Question pattern:** "I have 2000 licenses out, half are dead, how do I clean up?"

**Approved answer:**

> Until stackable filters ship in the official portal (promised at the 2026-04-28 AMA, "next release"), the most effective community-built tool is the **NexusNerd Chrome extension** (now approved as of 2026-04-29). It provides:
> - One-click snapshot of all your leases with their status.
> - Multi-sort filters (uptime, name, lease expiration).
> - Filter by offline + zero rewards over last 7 days → bulk select for revocation.
>
> Workaround tip from Rocky NOW pool: bump your configured uptime % by 1% every 200 lease codes you hand out. That implicitly date-stamps batches, so you can clean up older non-performers more easily.

---

## Why does my revoked license get auto-claimed again immediately?

**Question pattern:** "I revoke a license and it's claimed back within hours. Same license, same ULO often. Is this a bug?"

**Approved answer (open issue — work in progress):**

> The team's current position (Josh, 2026-04-27 AMA) is that this is a recent issue and may be related to API users — the recommendation is to file a support ticket with details. ⚠️ Multiple UNOs (Compost Man Unity, Akira, Matt, others, 2026-04-28) report this has been happening for months and is not API-user driven; resetting license settings before/after revoke does not help. We've flagged it as a recurring issue and the team is reviewing.
>
> Practical workaround until fixed: when revoking, also adjust the split (e.g. 30/70 or below) so the license goes off-marketplace and into your private code pool — these don't auto-claim. You can then reissue a private code to a chosen ULO.

⚠️ **Watch:** Replace this answer once the team issues a fix or a definitive policy statement.

---

## What's the right UNO/ULO split right now?

**Question pattern:** "What split should I run?" / "How do I attract ULOs?"

**Approved answer (community consensus, no team guidance):**

> The team set marketplace default at 50/50 — operator's choice beyond that. Community signals from April 2026:
> - **Aggressive ULO-favouring (to attract leases right now):** 10/90 to 15/85. OC Nodes recommends "10/90, 12/88, 15/85 for the current first 6 months — anything less for the ULO and you'll most likely lose interest. After May/June we may be able to move to 20/80+."
> - **Steady-state plan:** ~45/55 (BeyondLimitsNodes) — sustainable but slow ULO acquisition.
> - **Marketplace default:** 50/50 (most ULOs ignore this in favour of off-marketplace codes from UNOs offering better rates).
>
> ⚠️ This will move once tasks scale. Re-check this answer monthly.
