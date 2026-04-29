# CLAUDE.md

This file provides guidance to Claude (claude.ai desktop app and Claude Code) when working in this repository.

> **Living document** — When we discover something in our workflow that works well (or doesn't), update these instructions immediately so future sessions benefit.

---

## Project Overview

**Unity Nodes** — This repo covers two workstreams for the Unity Network DePIN (Decentralized Physical Infrastructure Network) project:

1. **ROI Calculator & Earnings Tracker** — A React SPA for estimating ROI and tracking actual earnings from Unity Nodes network participation.
2. **Telegram Community Management** — Organizing community conversations, recurring questions, approved team answers, tracking promised tasks, and collecting feature requests from the Unity Network Telegram channels.

**Unity Network Context:** A DePIN project connected to World Mobile and Minutes Network. Node operators (UNOs) buy licenses and lease them to end-users (ULOs) who run the Unity app on Android/iOS phones to perform edge network tasks (telemetry, Scout & Runner, etc.) in exchange for rewards.

---

## 1. ROI Calculator App

### Commands

All commands run from `roi-calculator-app/`:

```bash
npm run dev       # Start Vite dev server (auto-port, network-accessible)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
```

No test framework is configured.

### Architecture

- React 19 + Vite 6, JavaScript/JSX (no TypeScript)
- Tailwind CSS 4 for styling, Recharts for charts
- localStorage for all data persistence (no backend)

### Key Files

- **`src/App.jsx`** — Top-level navigation shell (tab switching between calculator and tracker)
- **`src/ROICalculatorApp.jsx`** (~4000 lines) — ROI calculator with scenario modeling, ramp-up periods, reality check ecosystem analysis, earnings target calculator, monthly credits toggle, bound nodes metrics, PDF export
- **`src/EarningsTrackerApp.jsx`** (~3000 lines) — Three-tab earnings tracker (Dashboard, Data Table, Add Earnings) with charting, inline editing, import/export (JSON/CSV/Markdown/PDF), auto-backup
- **`src/utils/earningsStorage.js`** — localStorage CRUD API for earnings data, import/export logic
- **`src/utils/earningsParser.js`** — Parses pasted earnings text into structured records
- **`src/utils/autoBackup.js`** — Configurable auto-backup trigger system
- **`src/utils/usePersistentState.js`** — React hook wrapping localStorage
- **`src/utils/importValidator.js`** — Validates imported data structure

### Design Patterns

- **Large single-file components**: Business logic, state, and UI are co-located in the main app files rather than decomposed into small components
- **URL parameter sharing**: ROI Calculator encodes scenario parameters in URL for sharing (not routing)
- **localStorage keys**: `unity-nodes-earnings` (records), `unity-nodes-node-mapping` (node ID → license type)
- **Dark theme**: Purple/slate gradient design throughout

### Documentation

The `instructions/` directory contains detailed feature documentation and implementation guides for each major feature (reality check, bound nodes, backup/restore, calendar picker, etc.).

---

## 2. Telegram Community Management

### Overview

This section manages Telegram message analysis from Unity Network community channels using a custom MCP server and the Telethon library.

### Folder Structure

```
telegram/
├── conversations/                       # Raw Telegram exports, organized by channel subfolder
│   ├── Unity Network - Verified/        # YYYY-MM-DD-messages-raw.md + .json per day
│   ├── Unity Farmers Collective/
│   ├── Club Unity License Operators/
│   └── Unity Network Announcements/
├── briefings/                           # Synthesized briefings, date-prefixed
├── faq/                                 # Recurring community questions, grouped by topic
├── team-answers/                        # Standard approved responses from the team
├── tasks/                               # Promised tasks tracker (active, delivered, overdue)
├── feature-requests/                    # Community feature requests (open, planned, shipped, declined)
├── unity-verified-messages.json         # Main message archive (52,612 messages, 2025-12-22 to 2026-04-07)
├── unity-announcements.json             # Official announcements (142 messages from ambassadors)
├── telegram_mcp.py                      # MCP server (4 tools)
├── export_telegram.py                   # Standalone export script
├── pull_all_messages.py                 # Simple message puller
├── telegram_login.py                    # Auth helper
├── tg_session.session                   # Telethon session (do not delete)
└── .env                                 # TG_API_ID and TG_API_HASH
```

### Data Location

- **Main message archive:** `telegram/unity-verified-messages.json`
  - 52,612 messages from the "Unity Network - Verified" channel
  - Date range: 2025-12-22 to 2026-04-07
  - Format: `[{"ts": "2026-01-15T23:29", "author": "Name", "msg": "text", "id": 6223}, ...]`
  - Sorted chronologically, deduplicated by message ID
  - 409 unique authors

- **Official announcements:** `telegram/unity-announcements.json`
  - 142 official messages from ambassadors (Sophie, Kay, Kyle, Jack) and Unity Network Assistant
  - Filtered from main archive: messages with 🤝 marker, "Unity Network" header, #update tags
  - Good starting point for understanding team communications and project timeline

### MCP Server

**Server:** `telegram/telegram_mcp.py` — FastMCP server with 4 tools:

1. **`telegram_list_chats`** — List available Telegram chats
2. **`telegram_get_messages`** — Pull messages from a chat (supports date range, limit up to 5,000)
3. **`telegram_search`** — Search messages by keyword
4. **`telegram_export_to_files`** — Export messages to JSON and Markdown files

**Auth:** Run `telegram/telegram_login.py` once interactively to create session

**Claude Desktop MCP Config:**

To use the Telegram MCP in Claude Desktop, add to config:
```json
{
  "mcpServers": {
    "telegram": {
      "command": "python3",
      "args": ["/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram/telegram_mcp.py"]
    }
  }
}
```

### Workflow

1. **Import conversations** — Always do this BEFORE analysis. Use the `telegram_export_to_files` MCP tool to export raw messages into `telegram/conversations/<Channel Name>/` (channel-specific subfolders). See **Telegram Export Workflow** below for critical gotchas.

2. **Extract recurring questions** — Read through conversations, identify questions that keep coming back, and add them to topic files in `telegram/faq/` (e.g. `staking.md`, `nodes.md`, `general.md`).

3. **Document team answers** — For each recurring question, capture the approved team response in `telegram/team-answers/`. Each entry should have:
   - **Question** — what is being asked
   - **Answer** — the approved response
   - **Notes** — edge cases, when to escalate, related links

4. **Track promised tasks** — When the team says "we will do X" in a conversation, log it in `telegram/tasks/active.md`. Each entry needs:
   - **Date promised** and **Promised by** — when and who
   - **What was promised** — the task or deliverable
   - **What it should achieve** — the expected outcome for the community
   - **Status** — `🟡 Promised` → `🔵 In Progress` → `🟢 Delivered` or `🔴 Overdue`
   - Move to `delivered.md` when done, or `overdue.md` when it's late

5. **Collect feature requests** — When community members ask for new features or improvements, log them in `telegram/feature-requests/open.md`. Each entry needs:
   - **What they want** and **why** — the feature and the problem it solves
   - **Frequency** — how often it comes up (`💬` once, `💬💬` a few times, `💬💬💬` constantly)
   - **Status** — `💡 Requested` → `👀 Acknowledged` → `🔵 Planned` → `🟢 Shipped` or `❌ Won't Do`
   - Move between `open.md` → `planned.md` → `shipped.md` (or `declined.md`) as status changes

6. **Keep it current** — When new patterns emerge from conversations, update the FAQ, team-answers, tasks, and feature-requests files.

### Naming Conventions

| Folder | File naming |
|---|---|
| `conversations/<Channel Name>/` | `YYYY-MM-DD-messages-raw.md` and `YYYY-MM-DD-messages.json` (one of each per day, both formats kept) |
| `briefings/` | `YYYY-MM-DD_briefing-topic.md` |
| `faq/` | `topic.md` (e.g. `staking.md`, `nodes.md`) |
| `team-answers/` | `topic.md` (mirrors the faq topics) |
| `tasks/` | `active.md`, `delivered.md`, `overdue.md` |
| `feature-requests/` | `open.md`, `planned.md`, `shipped.md`, `declined.md` |

The `<Channel Name>` subfolder uses the exact Telegram chat name as it appears in `telegram_list_chats`, e.g. `Unity Network - Verified`, `Unity Farmers Collective`, `Club Unity License Operators`, `Unity Network Announcements`. Never put per-day export files in the root of `conversations/` — the export tool overwrites by date filename, so root files from one channel will get clobbered by the next channel's export.

### Telegram Export Workflow

This is the only way to get raw conversation data into the project. Several gotchas were learned the hard way — follow this exactly:

**Tool:** `telegram_export_to_files` — produces both `YYYY-MM-DD-messages.json` and `YYYY-MM-DD-messages-raw.md` per day.

**Hard constraints of the tool and sandbox:**

1. **The export tool always writes to `conversations/` ROOT, never to channel subfolders.** It has no output-path parameter. You must copy files into the channel subfolder yourself after each export.

2. **The export tool has a 5,000-message hard cap per call.** If you ask for more than that across the date range, it silently truncates the OLDEST end of the range AND silently truncates individual days. For high-volume channels (Unity Network – Verified routinely hits this), split the date range into chunks small enough that each call stays under 5,000 messages. After each chunked call, copy to subfolder before the next call so root files aren't clobbered. If a single day is suspected of being truncated, re-export that day alone to get the full count (e.g. Apr 16 came back as 129 msgs in a multi-day call but 740 msgs when fetched as a single day — confirming truncation).

3. **NEVER run multiple `telegram_export_to_files` calls in parallel.** All channels write to the same `YYYY-MM-DD-messages-*` filenames in `conversations/` root. Parallel calls race and corrupt each other's files. Always sequential, one channel at a time.

4. **The bash sandbox cannot delete or move files in the user's mounted folder.** It can READ and WRITE (including overwriting), but `rm` and `mv` return "Operation not permitted". The Cowork file-delete tool requires interactive approval that isn't available in scheduled-task / unsupervised sessions. Workaround: use `cat src > dst` to copy. Cleanup of orphan root files has to be done manually by the user in Finder.

5. **The per-day raw markdown header is hardcoded to `# Unity Network Verified — Raw Messages` regardless of channel.** This is a bug in the export tool. The MESSAGE CONTENT inside the file IS correct (matches the channel you exported), only the title line is wrong. After copying to a subfolder, fix the header with `sed -i 's/^# Unity Network Verified — Raw Messages$/# <Channel Name> — Raw Messages/' "<Channel Name>/2026-XX-*-messages-raw.md"`.

**Standard sequential workflow (per channel, per chunk):**

```bash
# Step 1: Export (call MCP tool sequentially, never parallel)
telegram_export_to_files {chat: "Unity Farmers Collective", date_from: "2026-04-01", date_to: "2026-04-27"}

# Step 2: Copy each date file from root into the channel subfolder (in bash)
cd "telegram/conversations/"
for date in 2026-04-{01..27}; do
  for ext in "messages-raw.md" "messages.json"; do
    src="${date}-${ext}"
    if [ -f "$src" ]; then cat "$src" > "Unity Farmers Collective/${src}"; fi
  done
done

# Step 3: Fix the wrong header in raw markdown files (skip this for the actual Verified channel)
for f in "Unity Farmers Collective/"2026-04-*-messages-raw.md; do
  sed -i 's/^# Unity Network Verified — Raw Messages$/# Unity Farmers Collective — Raw Messages/' "$f"
done
```

After running all four channel exports, the user is left with ~27 orphan root files matching the LAST channel exported. Tell the user clearly so they can delete those manually in Finder.

**Channels currently tracked:**
- `Unity Network Announcements` — official posts, low volume
- `Unity Network - Verified` — main community channel, very high volume (always needs date-range splitting)
- `Unity Farmers Collective` — farmer/operator focused
- `Club Unity License Operators` — ULO-focused side channel

(Other channels in `conversations/` like `World Mobile Announcements`, `World Mobile Club`, `Minutes Network Token Announcements` are out of scope for Unity Nodes briefings.)

### Guidelines

- When analyzing conversations, focus on **questions that appear 3+ times** — those are the real FAQs.
- Keep team answers **concise and copy-pasteable** — they should be ready to drop into Telegram.
- Flag answers that reference numbers, dates, or changing details with a ⚠️ so they get reviewed regularly.
- If a question doesn't have a clear team answer yet, add it to the FAQ with `[NEEDS ANSWER]` so it's visible.
- **Always scan for promises** — any time the team says "we'll", "coming soon", "we're working on", "expect this by" → log it in `tasks/active.md`.
- **Always scan for feature requests** — any time users say "it would be nice if", "can you add", "I wish", "please make" → log it in `feature-requests/open.md`.
- Review `tasks/overdue.md` regularly — broken promises erode community trust faster than anything else.
- Feature requests that come up from **multiple users** are stronger signals — bump the frequency and note the usernames.
- Keep `declined.md` well-documented — when the same request comes back, you can point to a clear reason.

### Key Community Figures

- **Sophie, Kay, Kyle, Jack** — Ambassadors / moderators (post official announcements)
- **Unity Network Assistant** — Official bot account
- **Calus B, Val, Page One, Flippy, Akira** — Very active community members
- **Josh, Mickey, Omri** — Team members (referenced in discussions, rarely post directly)

### X Spaces AMA Recordings

| Date | Event | Link |
|------|-------|------|
| 2026-01-04 | S&R Task Briefing | https://x.com/i/spaces/1vOxwdorNjqKB |
| 2026-01-13 | S&R Briefing | https://x.com/i/spaces/1jMKgRpWqPexL |
| 2026-01-30 | Minutes Network AMA | https://twitter.com/i/spaces/1OdKrOjyNmQGX |
| 2026-02-07 | Unity AMA | https://twitter.com/i/spaces/1YqKDNkogbAJV |
| 2026-02-20 | S&R Alpha Update | https://x.com/i/spaces/1qGvvkkwWbwGB |
| 2026-03-04 | S&R Briefing | https://x.com/i/spaces/1lKQRvRPQRqGE |
| 2026-03-13 | S&R Briefing | https://x.com/i/spaces/1qKVmQvLEyVxB |
| 2026-03-26 | S&R Cohort Update | https://x.com/i/spaces/1NGaraEwWQnJj |
| 2026-04-03 | Recent space | https://x.com/i/spaces/1wxWjaykyOMJQ |

### Analysis History

- **Trustworthiness assessment (April 2026): 5/10**
  - Working product on Android/iOS (6/10)
  - Rewards & revenue very low, cents/day (3/10)
  - Q1 2026 roadmap mostly missed (3/10)
  - Team communication regular but lacking transparency (5/10)
  - Active community but increasingly frustrated (5/10)

---

## General Principles

### Learn and Update

**This is the most important rule for this project:**

When we discover during our work that something works well — a process, a prompt pattern, a file structure, a naming convention — **update this CLAUDE.md immediately**. Don't wait. Future sessions should start smarter than the last one ended.

Examples of things worth capturing:
- A better way to parse Telegram exports
- A question pattern that signals a FAQ vs. a one-off
- A formatting approach that makes team answers easier to use
- Phrases that signal a team promise (for task tracking)
- Phrases that signal a feature request vs. a complaint
- Anything that made us backtrack or redo work

### File Hygiene

- Use Markdown for all documentation
- Date-prefix filenames where chronological order matters
- Keep README files in each folder up to date
- Don't let files grow beyond ~500 lines — split into subtopics instead
