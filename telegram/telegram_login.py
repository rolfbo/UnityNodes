#!/usr/bin/env python3
"""
One-time Telegram login script.

Run this once to authenticate and create a session file.
After that, the MCP server (telegram_mcp.py) will use the saved session.

Usage:
    python3 telegram_login.py
"""

import asyncio
import os
import sys

try:
    from telethon import TelegramClient
except ImportError:
    print("Telethon not installed. Run:  pip install telethon")
    sys.exit(1)

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Load .env
ENV_FILE = os.path.join(SCRIPT_DIR, ".env")
if os.path.exists(ENV_FILE):
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))

API_ID = int(os.environ.get("TG_API_ID", "0"))
API_HASH = os.environ.get("TG_API_HASH", "")
SESSION_FILE = os.path.join(SCRIPT_DIR, "tg_session")

if API_ID == 0 or not API_HASH:
    print("ERROR: Set TG_API_ID and TG_API_HASH in .env")
    sys.exit(1)


async def main():
    client = TelegramClient(SESSION_FILE, API_ID, API_HASH)
    await client.start()

    me = await client.get_me()
    print(f"\nLogged in as: {me.first_name} (ID: {me.id})")
    print(f"Session saved to: {SESSION_FILE}.session")
    print("You can now run the MCP server.")

    await client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
