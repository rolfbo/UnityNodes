#!/usr/bin/env python3
"""
Telegram Chat Exporter for Unity Network Verified channel.

Exports messages in two formats:
1. JSON  — machine-readable, one object per message
2. Raw MD — human-readable, matching existing conversations/ format

Usage:
    python export_telegram.py --date 2026-04-05
    python export_telegram.py --from 2026-03-27 --to 2026-04-07
    python export_telegram.py --days 7          # last 7 days

First run will ask you to log in via phone number (session is cached after that).
"""

import argparse
import asyncio
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone

try:
    from telethon import TelegramClient
    from telethon.tl.types import MessageMediaPhoto, MessageMediaDocument
except ImportError:
    print("Telethon not installed. Run:  pip install telethon")
    sys.exit(1)

# ── CONFIGURATION ────────────────────────────────────────────────────────────
# Option 1: Set these directly
API_ID = int(os.environ.get("TG_API_ID", "0"))
API_HASH = os.environ.get("TG_API_HASH", "")

# Option 2: Or put them in a .env file next to this script
ENV_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
if os.path.exists(ENV_FILE) and (API_ID == 0 or not API_HASH):
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if line.startswith("TG_API_ID="):
                API_ID = int(line.split("=", 1)[1].strip().strip('"').strip("'"))
            elif line.startswith("TG_API_HASH="):
                API_HASH = line.split("=", 1)[1].strip().strip('"').strip("'")

if API_ID == 0 or not API_HASH:
    print("ERROR: Set TG_API_ID and TG_API_HASH as environment variables or in .env")
    sys.exit(1)

# Target chat — change this to match your group/channel name or ID
TARGET_CHAT = "Unity Network Verified"

# Output directory for exported files
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "conversations")

# Session file (keeps you logged in between runs)
SESSION_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tg_session")


# ── HELPERS ──────────────────────────────────────────────────────────────────

def get_display_name(sender):
    """Extract a readable display name from a Telethon user/channel object."""
    if sender is None:
        return "Unknown"
    # Channels / groups
    if hasattr(sender, "title"):
        return sender.title
    # Users
    parts = []
    if getattr(sender, "first_name", None):
        parts.append(sender.first_name)
    if getattr(sender, "last_name", None):
        parts.append(sender.last_name)
    name = " ".join(parts).strip()
    if not name and getattr(sender, "username", None):
        return sender.username
    return name or "Unknown"


def format_media(msg):
    """Return a short description of any media attached to a message."""
    if msg.media is None:
        return ""
    if isinstance(msg.media, MessageMediaPhoto):
        return "[Photo]"
    if isinstance(msg.media, MessageMediaDocument):
        doc = msg.media.document
        for attr in getattr(doc, "attributes", []):
            if hasattr(attr, "file_name"):
                return f"[File: {attr.file_name}]"
        mime = getattr(doc, "mime_type", "")
        if "video" in mime:
            return "[Video]"
        if "audio" in mime or "voice" in mime:
            return "[Voice message]"
        if "sticker" in mime or "webp" in mime:
            return "[Sticker]"
        return "[Document]"
    return "[Media]"


def msg_to_json(msg, sender_name):
    """Convert a message to the JSON format matching existing exports."""
    ts = msg.date.strftime("%Y-%m-%dT%H:%M")
    text = msg.text or ""
    media_tag = format_media(msg)
    if media_tag:
        text = f"{media_tag} {text}".strip() if text else media_tag
    return {
        "ts": ts,
        "author": sender_name,
        "msg": text,
    }


def msg_to_raw_md(msg, sender_name):
    """Convert a message to the raw markdown format matching existing exports."""
    # Format: Author, [Apr 4, 2026 at 19:58]
    dt = msg.date
    date_str = dt.strftime("%b %-d, %Y at %H:%M")
    text = msg.text or ""
    media_tag = format_media(msg)
    if media_tag:
        text = f"{media_tag} {text}".strip() if text else media_tag
    return f"{sender_name}, [{date_str}]\n{text}"


# ── MAIN EXPORT ──────────────────────────────────────────────────────────────

async def export_messages(date_from, date_to):
    """Fetch messages from TARGET_CHAT between date_from and date_to (inclusive)."""

    client = TelegramClient(SESSION_FILE, API_ID, API_HASH)
    await client.start()

    # Find the target chat
    target = None
    async for dialog in client.iter_dialogs():
        if dialog.name and TARGET_CHAT.lower() in dialog.name.lower():
            target = dialog
            break

    if target is None:
        print(f"ERROR: Could not find chat matching '{TARGET_CHAT}'")
        print("Available chats:")
        async for d in client.iter_dialogs(limit=30):
            print(f"  - {d.name}")
        await client.disconnect()
        sys.exit(1)

    print(f"Found chat: {target.name} (ID: {target.id})")

    # Adjust date_to to end of day and date_from to start of day (UTC)
    offset_from = datetime(date_from.year, date_from.month, date_from.day,
                           0, 0, 0, tzinfo=timezone.utc)
    offset_to = datetime(date_to.year, date_to.month, date_to.day,
                         23, 59, 59, tzinfo=timezone.utc)

    print(f"Fetching messages from {date_from.isoformat()} to {date_to.isoformat()}...")

    # Collect all messages (Telethon returns newest-first)
    all_messages = []
    async for msg in client.iter_messages(target, offset_date=offset_to + timedelta(seconds=1)):
        if msg.date < offset_from:
            break
        if msg.date > offset_to:
            continue
        sender = await msg.get_sender()
        sender_name = get_display_name(sender)
        all_messages.append((msg, sender_name))

    all_messages.reverse()  # oldest first

    print(f"Collected {len(all_messages)} messages")

    # Group by date
    by_date = {}
    for msg, name in all_messages:
        day = msg.date.strftime("%Y-%m-%d")
        by_date.setdefault(day, []).append((msg, name))

    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Write files per day
    for day, messages in sorted(by_date.items()):
        dt = datetime.strptime(day, "%Y-%m-%d")
        day_name = dt.strftime("%A")
        date_display = dt.strftime("%B %-d, %Y")

        # JSON file
        json_path = os.path.join(OUTPUT_DIR, f"{day}-messages.json")
        json_data = [msg_to_json(m, n) for m, n in messages]
        with open(json_path, "w") as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)
        print(f"  Wrote {json_path} ({len(json_data)} messages)")

        # Raw markdown file
        md_path = os.path.join(OUTPUT_DIR, f"{day}-messages-raw.md")
        lines = [
            f"# Unity Network Verified — Raw Messages",
            f"## {date_display} ({day_name})",
            "",
            "---",
            "",
        ]
        for msg, name in messages:
            lines.append(msg_to_raw_md(msg, name))
            lines.append("")

        with open(md_path, "w") as f:
            f.write("\n".join(lines))
        print(f"  Wrote {md_path}")

    await client.disconnect()
    print(f"\nDone! Exported {len(all_messages)} messages across {len(by_date)} days.")


# ── CLI ──────────────────────────────────────────────────────────────────────

def parse_date(s):
    return datetime.strptime(s, "%Y-%m-%d").date()

def main():
    parser = argparse.ArgumentParser(description="Export Telegram chat messages")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--date", type=parse_date,
                       help="Export a single day (YYYY-MM-DD)")
    group.add_argument("--from", dest="date_from", type=parse_date,
                       help="Start date (YYYY-MM-DD), use with --to")
    group.add_argument("--days", type=int,
                       help="Export last N days (including today)")

    parser.add_argument("--to", dest="date_to", type=parse_date,
                        help="End date (YYYY-MM-DD), use with --from")
    parser.add_argument("--chat", type=str, default=None,
                        help=f"Chat name to search for (default: '{TARGET_CHAT}')")

    args = parser.parse_args()

    if args.chat:
        global TARGET_CHAT
        TARGET_CHAT = args.chat

    today = datetime.now(timezone.utc).date()

    if args.date:
        date_from = date_to = args.date
    elif args.date_from:
        date_from = args.date_from
        date_to = args.date_to or today
    elif args.days:
        date_to = today
        date_from = today - timedelta(days=args.days - 1)
    else:
        parser.print_help()
        sys.exit(1)

    print(f"Exporting: {date_from} → {date_to}")
    asyncio.run(export_messages(date_from, date_to))


if __name__ == "__main__":
    main()
