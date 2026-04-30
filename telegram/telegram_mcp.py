#!/usr/bin/env python3
"""
MCP Server for Telegram Chat Export.

Provides tools to search, export, and browse Telegram chat messages
directly from Claude Desktop. Uses Telethon for Telegram API access.

First run requires interactive login (phone + code). After that,
the session file keeps you authenticated.
"""

import json
import os
import sys
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

try:
    from mcp.server.fastmcp import FastMCP
except ImportError:
    print("MCP SDK not installed. Run:  pip install mcp[cli]", file=sys.stderr)
    sys.exit(1)

try:
    from telethon import TelegramClient
    from telethon.tl.types import (
        MessageMediaDocument,
        MessageMediaPhoto,
    )
except ImportError:
    print("Telethon not installed. Run:  pip install telethon", file=sys.stderr)
    sys.exit(1)

# Import shared utilities
from utils.telegram_helpers import get_display_name, format_media


# ── CONFIGURATION ────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Load .env if present
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
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "conversations")


# ── HELPERS ──────────────────────────────────────────────────────────────────
# Using shared utilities from utils.telegram_helpers

_get_display_name = get_display_name
_format_media = format_media


def _msg_text(msg) -> str:
    """Get the full text content of a message including media tags."""
    text = msg.text or ""
    media_tag = _format_media(msg)
    if media_tag:
        text = f"{media_tag} {text}".strip() if text else media_tag
    return text


def _msg_to_dict(msg, sender_name: str) -> Dict[str, Any]:
    """Convert a Telethon message to a serializable dict."""
    return {
        "ts": msg.date.strftime("%Y-%m-%dT%H:%M"),
        "author": sender_name,
        "msg": _msg_text(msg),
        "id": msg.id,
    }


def _msg_to_raw_md(msg, sender_name: str) -> str:
    """Convert a message to the raw markdown format matching existing exports."""
    date_str = msg.date.strftime("%b %-d, %Y at %H:%M")
    text = _msg_text(msg)
    return f"{sender_name}, [{date_str}]\n{text}"


async def _find_chat(client, name: str):
    """Find a chat/group/channel by (partial) name match."""
    async for dialog in client.iter_dialogs():
        if dialog.name and name.lower() in dialog.name.lower():
            return dialog
    return None


async def _fetch_messages(client, chat, date_from: datetime, date_to: datetime, limit: int = 5000):
    """Fetch messages from a chat within a date range. Returns oldest-first."""
    offset_to = date_to.replace(hour=23, minute=59, second=59, tzinfo=timezone.utc)
    offset_from = date_from.replace(hour=0, minute=0, second=0, tzinfo=timezone.utc)

    messages = []
    async for msg in client.iter_messages(chat, offset_date=offset_to + timedelta(seconds=1), limit=limit):
        if msg.date < offset_from:
            break
        if msg.date > offset_to:
            continue
        sender = await msg.get_sender()
        sender_name = _get_display_name(sender)
        messages.append((msg, sender_name))

    messages.reverse()
    return messages


# ── GLOBAL TELEGRAM CLIENT ───────────────────────────────────────────────────

_telegram_client: Optional[TelegramClient] = None


async def _ensure_client() -> TelegramClient:
    """Get or create the global Telegram client."""
    global _telegram_client
    if _telegram_client is not None and _telegram_client.is_connected():
        return _telegram_client

    if API_ID == 0 or not API_HASH:
        raise RuntimeError(
            "TG_API_ID and TG_API_HASH not set. "
            "Add them to .env and restart the server."
        )

    session_path = SESSION_FILE + ".session"
    if not os.path.exists(session_path):
        raise RuntimeError(
            f"No session file at {session_path}. "
            "Run 'python3 telegram_login.py' first."
        )

    _telegram_client = TelegramClient(SESSION_FILE, API_ID, API_HASH)
    await _telegram_client.connect()

    if not await _telegram_client.is_user_authorized():
        await _telegram_client.disconnect()
        _telegram_client = None
        raise RuntimeError(
            "Session expired. Run 'python3 telegram_login.py' to re-authenticate."
        )

    print(f"Telegram client connected (session: {session_path})", file=sys.stderr)
    return _telegram_client


# ── MCP SERVER ───────────────────────────────────────────────────────────────

mcp = FastMCP("telegram_mcp")


# ── ENUMS & INPUT MODELS ────────────────────────────────────────────────────

class ResponseFormat(str, Enum):
    MARKDOWN = "markdown"
    JSON = "json"


class TelegramListChatsInput(BaseModel):
    """Input for listing available Telegram chats."""
    model_config = ConfigDict(str_strip_whitespace=True)

    limit: int = Field(default=30, description="Maximum number of chats to list", ge=1, le=200)
    filter: Optional[str] = Field(default=None, description="Filter chats by name (case-insensitive substring match)")


class TelegramGetMessagesInput(BaseModel):
    """Input for fetching messages from a Telegram chat."""
    model_config = ConfigDict(str_strip_whitespace=True)

    chat: str = Field(..., description="Chat name to search for (partial match, e.g. 'Unity Network')", min_length=1)
    date: Optional[str] = Field(default=None, description="Single date to fetch (YYYY-MM-DD)")
    date_from: Optional[str] = Field(default=None, description="Start of date range (YYYY-MM-DD)")
    date_to: Optional[str] = Field(default=None, description="End of date range (YYYY-MM-DD), defaults to today")
    days: Optional[int] = Field(default=None, description="Fetch last N days including today", ge=1, le=90)
    limit: int = Field(default=500, description="Max messages to return", ge=1, le=5000)
    response_format: ResponseFormat = Field(default=ResponseFormat.MARKDOWN, description="Output format")

    @field_validator("date", "date_from", "date_to")
    @classmethod
    def validate_date(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            try:
                datetime.strptime(v, "%Y-%m-%d")
            except ValueError:
                raise ValueError(f"Invalid date format: {v}. Use YYYY-MM-DD.")
        return v


class TelegramSearchInput(BaseModel):
    """Input for searching messages by keyword."""
    model_config = ConfigDict(str_strip_whitespace=True)

    chat: str = Field(..., description="Chat name to search in", min_length=1)
    query: str = Field(..., description="Search keyword or phrase", min_length=1, max_length=200)
    days: int = Field(default=14, description="How many days back to search", ge=1, le=90)
    limit: int = Field(default=50, description="Max results to return", ge=1, le=200)
    response_format: ResponseFormat = Field(default=ResponseFormat.MARKDOWN, description="Output format")


class TelegramExportInput(BaseModel):
    """Input for exporting messages to files in conversations/ folder."""
    model_config = ConfigDict(str_strip_whitespace=True)

    chat: str = Field(..., description="Chat name to export", min_length=1)
    date_from: str = Field(..., description="Start date (YYYY-MM-DD)")
    date_to: Optional[str] = Field(default=None, description="End date (YYYY-MM-DD), defaults to today")

    @field_validator("date_from", "date_to")
    @classmethod
    def validate_date(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            try:
                datetime.strptime(v, "%Y-%m-%d")
            except ValueError:
                raise ValueError(f"Invalid date format: {v}. Use YYYY-MM-DD.")
        return v


# ── TOOLS ────────────────────────────────────────────────────────────────────

async def _get_client() -> TelegramClient:
    """Get the global Telegram client, connecting if needed."""
    return await _ensure_client()


@mcp.tool(
    name="telegram_list_chats",
    annotations={
        "title": "List Telegram Chats",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
)
async def telegram_list_chats(params: TelegramListChatsInput) -> str:
    """List your Telegram chats/groups/channels.

    Returns chat names and IDs so you can pick the right one for
    get_messages or search. Optionally filter by name.

    Args:
        params: Contains limit (int) and optional filter (str).

    Returns:
        Markdown or JSON list of chats with name, type, and unread count.
    """
    client = await _get_client()

    chats = []
    async for dialog in client.iter_dialogs(limit=params.limit):
        if params.filter and params.filter.lower() not in (dialog.name or "").lower():
            continue
        chats.append({
            "name": dialog.name,
            "id": dialog.id,
            "type": dialog.entity.__class__.__name__,
            "unread": dialog.unread_count,
        })

    if not chats:
        return "No chats found" + (f" matching '{params.filter}'" if params.filter else "")

    lines = [f"# Telegram Chats ({len(chats)})\n"]
    for c in chats:
        lines.append(f"- **{c['name']}** (ID: {c['id']}, {c['type']}, {c['unread']} unread)")
    return "\n".join(lines)


@mcp.tool(
    name="telegram_get_messages",
    annotations={
        "title": "Get Telegram Messages",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
)
async def telegram_get_messages(params: TelegramGetMessagesInput) -> str:
    """Fetch messages from a Telegram chat for a given date or date range.

    Specify exactly one of: date, date_from+date_to, or days.

    Args:
        params: Chat name, date parameters, limit, and response format.

    Returns:
        Messages in markdown (human-readable) or JSON format.
    """
    client = await _get_client()

    chat = await _find_chat(client, params.chat)
    if chat is None:
        return f"Error: No chat found matching '{params.chat}'. Use telegram_list_chats to see available chats."

    today = datetime.now(timezone.utc).date()

    if params.date:
        d = datetime.strptime(params.date, "%Y-%m-%d")
        date_from = date_to = d
    elif params.date_from:
        date_from = datetime.strptime(params.date_from, "%Y-%m-%d")
        date_to = datetime.strptime(params.date_to, "%Y-%m-%d") if params.date_to else datetime(today.year, today.month, today.day)
    elif params.days:
        date_to = datetime(today.year, today.month, today.day)
        date_from = date_to - timedelta(days=params.days - 1)
    else:
        # Default to today
        date_to = date_from = datetime(today.year, today.month, today.day)

    messages = await _fetch_messages(client, chat, date_from, date_to, limit=params.limit)

    if not messages:
        return f"No messages found in '{chat.name}' for the specified date range."

    if params.response_format == ResponseFormat.JSON:
        data = [_msg_to_dict(m, n) for m, n in messages]
        return json.dumps(data, indent=2, ensure_ascii=False)

    # Markdown format
    lines = [
        f"# {chat.name} — Messages",
        f"## {date_from.strftime('%Y-%m-%d')} to {date_to.strftime('%Y-%m-%d')}",
        f"*{len(messages)} messages*\n",
        "---\n",
    ]
    for msg, name in messages:
        lines.append(_msg_to_raw_md(msg, name))
        lines.append("")

    return "\n".join(lines)


@mcp.tool(
    name="telegram_search",
    annotations={
        "title": "Search Telegram Messages",
        "readOnlyHint": True,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": True,
    },
)
async def telegram_search(params: TelegramSearchInput) -> str:
    """Search messages in a Telegram chat by keyword.

    Searches message text within the last N days. Returns matching
    messages with their timestamps and authors.

    Args:
        params: Chat name, search query, days to look back, limit, format.

    Returns:
        Matching messages in markdown or JSON format.
    """
    client = await _get_client()

    chat = await _find_chat(client, params.chat)
    if chat is None:
        return f"Error: No chat found matching '{params.chat}'. Use telegram_list_chats to see available chats."

    today = datetime.now(timezone.utc)
    cutoff = today - timedelta(days=params.days)

    results = []
    async for msg in client.iter_messages(chat, search=params.query, limit=params.limit):
        if msg.date < cutoff:
            break
        sender = await msg.get_sender()
        sender_name = _get_display_name(sender)
        results.append((msg, sender_name))

    if not results:
        return f"No messages matching '{params.query}' in '{chat.name}' (last {params.days} days)."

    results.reverse()

    if params.response_format == ResponseFormat.JSON:
        data = [_msg_to_dict(m, n) for m, n in results]
        return json.dumps(data, indent=2, ensure_ascii=False)

    lines = [
        f"# Search: '{params.query}' in {chat.name}",
        f"*{len(results)} matches (last {params.days} days)*\n",
        "---\n",
    ]
    for msg, name in results:
        lines.append(_msg_to_raw_md(msg, name))
        lines.append("")

    return "\n".join(lines)


@mcp.tool(
    name="telegram_export_to_files",
    annotations={
        "title": "Export Telegram Messages to Files",
        "readOnlyHint": False,
        "destructiveHint": False,
        "idempotentHint": True,
        "openWorldHint": False,
    },
)
async def telegram_export_to_files(params: TelegramExportInput) -> str:
    """Export messages to JSON + Markdown files in the conversations/ folder.

    Creates one JSON and one raw-MD file per day, matching the format
    of existing exported files. Files are written to the conversations/
    directory next to this server script.

    Args:
        params: Chat name, date_from, optional date_to.

    Returns:
        Summary of files written.
    """
    client = await _get_client()

    chat = await _find_chat(client, params.chat)
    if chat is None:
        return f"Error: No chat found matching '{params.chat}'."

    today = datetime.now(timezone.utc).date()
    date_from = datetime.strptime(params.date_from, "%Y-%m-%d")
    date_to = datetime.strptime(params.date_to, "%Y-%m-%d") if params.date_to else datetime(today.year, today.month, today.day)

    messages = await _fetch_messages(client, chat, date_from, date_to)

    if not messages:
        return f"No messages found in '{chat.name}' for {params.date_from} to {date_to.strftime('%Y-%m-%d')}."

    # Group by date
    by_date: Dict[str, list] = {}
    for msg, name in messages:
        day = msg.date.strftime("%Y-%m-%d")
        by_date.setdefault(day, []).append((msg, name))

    os.makedirs(OUTPUT_DIR, exist_ok=True)
    files_written = []

    for day, day_msgs in sorted(by_date.items()):
        dt = datetime.strptime(day, "%Y-%m-%d")
        day_name = dt.strftime("%A")
        date_display = dt.strftime("%B %-d, %Y")

        # JSON
        json_path = os.path.join(OUTPUT_DIR, f"{day}-messages.json")
        json_data = [_msg_to_dict(m, n) for m, n in day_msgs]
        with open(json_path, "w") as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)
        files_written.append(f"{day}-messages.json ({len(json_data)} msgs)")

        # Raw markdown
        md_path = os.path.join(OUTPUT_DIR, f"{day}-messages-raw.md")
        md_lines = [
            f"# Unity Network Verified — Raw Messages",
            f"## {date_display} ({day_name})",
            "",
            "---",
            "",
        ]
        for msg, name in day_msgs:
            md_lines.append(_msg_to_raw_md(msg, name))
            md_lines.append("")
        with open(md_path, "w") as f:
            f.write("\n".join(md_lines))
        files_written.append(f"{day}-messages-raw.md")

    summary = [
        f"# Export Complete",
        f"Chat: {chat.name}",
        f"Messages: {len(messages)}",
        f"Days: {len(by_date)}",
        f"Output: {OUTPUT_DIR}/",
        "",
        "## Files written:",
    ]
    for fw in files_written:
        summary.append(f"- {fw}")

    return "\n".join(summary)


# ── ENTRYPOINT ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    mcp.run()
