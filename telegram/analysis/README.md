# Telegram Analysis Tools

Automated analysis scripts for Unity Nodes community management.

## Available Tools

### 1. Recurring Question Detector

**Purpose:** Identify frequently asked questions to populate FAQs

**File:** `detect_recurring_questions.py`

**What it does:**
- Scans conversation archives for question patterns
- Groups similar questions together
- Reports questions asked 3+ times (configurable)
- Shows date ranges and example askers

**Usage:**
```bash
# Analyze all channels
python telegram/analysis/detect_recurring_questions.py

# Specific channel only
python telegram/analysis/detect_recurring_questions.py --channel "Unity Network - Verified"

# Date range
python telegram/analysis/detect_recurring_questions.py --start 2026-04-01 --end 2026-04-30

# Lower threshold (show questions asked 2+ times)
python telegram/analysis/detect_recurring_questions.py --min-count 2
```

**Output example:**
```
💬💬💬 Asked 15 times:
   "when will ios app be available"
   Dates: 2026-04-01 to 2026-04-28
   Example: CommunityMember123

💬💬 Asked 7 times:
   "how do i check my earnings"
   Dates: 2026-04-10 to 2026-04-25
   Example: NewUser456
```

**Next steps:**
1. Review output
2. Add answers to `telegram/faq/` files
3. Update frequency markers (💬/💬💬/💬💬💬)

---

### 2. Promise Tracker

**Purpose:** Never miss a team commitment or deadline

**File:** `detect_promises.py`

**What it does:**
- Scans messages from known team members
- Detects commitment language ("will ship", "coming soon", "working on")
- Categorizes by type (commitment, timeline, in_progress, announcement)
- Tracks dates and signal strength

**Usage:**
```bash
# Scan announcements channel (default)
python telegram/analysis/detect_promises.py

# Scan all channels
python telegram/analysis/detect_promises.py --all-channels

# Specific channel
python telegram/analysis/detect_promises.py --channel "Unity Network - Verified"

# Date range
python telegram/analysis/detect_promises.py --start 2026-04-01 --end 2026-04-30

# Include non-team messages
python telegram/analysis/detect_promises.py --include-all

# Export to JSON for processing
python telegram/analysis/detect_promises.py --output promises.json
```

**Output example:**
```
🎯 Commitments (will ship/release/deliver) — 12 detected

[2026-04-28] Sophie (3 signals):
  "iOS app will ship by end of Q2, currently in final testing stages"
  Signals: will ship, by end of, in final testing

📅 Timeline Mentions (coming soon, Q1/Q2, dates) — 8 detected

[2026-04-25] Kyle (2 signals):
  "Referral program coming soon, expected in May"
  Signals: coming soon, expected
```

**Next steps:**
1. Review detected promises
2. Add to `telegram/tasks/active.md`
3. Track fulfillment status
4. Follow up on overdue items

**Known team members:**
- Sophie, Kay, Kyle, Jack, Josh, Mickey, Omri
- Unity Network Assistant, Jamie King, William
- Alex, Danny, Val, Page Øne, Calus B

To add more team members, edit `TEAM_MEMBERS` set in the script.

---

## Pattern Detection

### Question Detection Patterns

The recurring question detector looks for:
- Messages ending with `?`
- Messages starting with question words (how, when, why, what, where, who, can, will, is, are, do, does, wen)
- Minimum length: 10 characters

### Promise Detection Patterns

The promise tracker looks for:

**Commitment verbs:**
- "will be/ship/release/deliver/launch/add/implement"
- "shipping/releasing soon/this week/next week"

**Timeline language:**
- "coming soon/shortly/this week/next week"
- "expected to/in/by/within"
- "planned for", "targeting", "Q1/Q2/Q3/Q4"
- Date mentions (YYYY-MM-DD)

**Work status:**
- "working on"
- "in development/progress/QA/final stages"
- "building/developing/creating"

**Feature announcements:**
- "announcing", "introducing", "new feature"

**Confirmation:**
- "confirmed", "guarantee", "promise"

---

## Requirements

Install dependencies:
```bash
pip install -r telegram/requirements.txt
```

Or manually:
```bash
pip install telethon mcp pydantic
```

---

## Data Sources

Scripts read from:
- Daily files: `telegram/conversations/[channel]/YYYY-MM-DD-messages.json`
- Monthly archives: `telegram/conversations/[channel]/archive/YYYY-MM-messages.json`
- Consolidated: `telegram/unity-verified-messages.json` (52,612 messages)

---

## Output Integration

### For FAQ Building

1. Run question detector
2. Review high-frequency questions (💬💬💬 = 10+, 💬💬 = 5+, 💬 = 3+)
3. Add to appropriate FAQ file in `telegram/faq/`:
   - `earnings-faq.md` — Earnings and rewards
   - `license-faq.md` — License questions
   - `node-faq.md` — Node setup and management
   - `staking-faq.md` — Staking questions
   - `tasks-faq.md` — Task-related questions

### For Task Tracking

1. Run promise tracker
2. Review commitments and timelines
3. Add to `telegram/tasks/active.md`
4. Move completed items to `telegram/tasks/delivered.md`
5. Flag overdue items in `telegram/tasks/overdue.md`

### For Daily Briefings

Use both tools when preparing `telegram/briefings/YYYY-MM-DD_daily-briefing.md`:
- Questions: Recurring themes section
- Promises: Team responses section
- Combine: Action items section

---

## Tips & Best Practices

### Question Detector

✅ **Do:**
- Run weekly to catch emerging patterns
- Lower `--min-count` if community is small
- Check date ranges around major events (AMAs, launches)

❌ **Don't:**
- Ignore low-frequency questions — they might be important
- Auto-add to FAQ without verification
- Miss variations in phrasing (manual review needed)

### Promise Tracker

✅ **Do:**
- Run after every AMA or major announcement
- Cross-reference with `telegram/AMAs/promises/` files
- Update task status regularly
- Follow up on overdue promises

❌ **Don't:**
- Take casual mentions as hard promises (check context)
- Ignore "in progress" items — track them too
- Let promises get buried in chat history

### Performance

- Full archive scan (52k messages): ~10-30 seconds
- Single channel, one month: ~1-3 seconds
- Date filtering significantly speeds up analysis

---

## Troubleshooting

**"No messages found"**
- Check channel name (case-sensitive)
- Verify JSON files exist in conversations/ folder
- Try `--path` parameter to specify location

**"Error reading file"**
- Check JSON formatting (run through `jq` or Python json.tool)
- Verify file permissions

**"No questions/promises detected"**
- Lower threshold (`--min-count 1`)
- Check date range (you might be filtering out all data)
- For promises: verify team member names in TEAM_MEMBERS list

---

## Future Enhancements

Planned features:
- [ ] Sentiment analysis (track community mood)
- [ ] Briefing template generator (auto-generate structure)
- [ ] Fuzzy question matching (catch similar phrasings)
- [ ] Promise fulfillment tracking (auto-detect when delivered)
- [ ] MCP integration (call from Claude Desktop)
- [ ] Web dashboard for visualization

---

## Contributing

To add new analysis tools:

1. Create script in `telegram/analysis/`
2. Follow naming: `detect_*.py` or `analyze_*.py`
3. Include argparse with `--help`
4. Add to this README
5. Update `telegram/CLAUDE.md` workflow section

---

## Questions?

See main documentation: `telegram/CLAUDE.md` (Telegram Community Management section)
