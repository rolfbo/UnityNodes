#!/usr/bin/env python3
"""Pull all messages from Unity Network - Verified into a single JSON file."""

import asyncio
import json
import os
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_FILE = os.path.join(SCRIPT_DIR, ".env")
if os.path.exists(ENV_FILE):
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))

from telethon import TelegramClient
from telethon.tl.types import MessageMediaPhoto, MessageMediaDocument

API_ID = int(os.environ.get("TG_API_ID", "0"))
API_HASH = os.environ.get("TG_API_HASH", "")
SESSION_FILE = os.path.join(SCRIPT_DIR, "tg_session")
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "unity-verified-messages.json")

TARGET_CHAT = "Unity Network - Verified"
START_DATE = datetime(2025, 12, 20, tzinfo=timezone.utc)


def get_display_name(sender):
    if sender is None:
        return "Unknown"
    if hasattr(sender, "title"):
        return sender.title
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


async def main():
    client = TelegramClient(SESSION_FILE, API_ID, API_HASH)
    await client.connect()

    if not await client.is_user_authorized():
        print("ERROR: Not authorized. Run telegram_login.py first.")
        return

    # Find chat
    target = None
    async for dialog in client.iter_dialogs():
        if dialog.name and TARGET_CHAT.lower() in dialog.name.lower():
            target = dialog
            break

    if not target:
        print(f"ERROR: Chat '{TARGET_CHAT}' not found")
        return

    print(f"Found: {target.name}")

    now = datetime.now(timezone.utc)
    all_messages = []

    # Fetch week by week
    current = START_DATE
    while current < now:
        week_end = min(current + timedelta(days=7), now)
        end_of_day = week_end.replace(hour=23, minute=59, second=59)

        print(f"  Fetching {current.strftime('%Y-%m-%d')} to {week_end.strftime('%Y-%m-%d')}...", end=" ", flush=True)

        count = 0
        batch = []
        async for msg in client.iter_messages(target, offset_date=end_of_day + timedelta(seconds=1), limit=5000):
            if msg.date < current:
                break
            if msg.date > end_of_day:
                continue

            sender = await msg.get_sender()
            name = get_display_name(sender)
            text = msg.text or ""
            media_tag = format_media(msg)
            if media_tag:
                text = f"{media_tag} {text}".strip() if text else media_tag

            batch.append({
                "id": msg.id,
                "ts": msg.date.strftime("%Y-%m-%dT%H:%M:%S"),
                "date": msg.date.strftime("%Y-%m-%d"),
                "author": name,
                "msg": text,
                "reply_to": msg.reply_to.reply_to_msg_id if msg.reply_to else None,
            })
            count += 1

        batch.reverse()
        all_messages.extend(batch)
        print(f"{count} messages")

        current = week_end + timedelta(days=1)
        current = current.replace(hour=0, minute=0, second=0)

    # Write output
    with open(OUTPUT_FILE, "w") as f:
        json.dump(all_messages, f, indent=2, ensure_ascii=False)

    print(f"\nDone! {len(all_messages)} total messages written to {OUTPUT_FILE}")

    await client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
