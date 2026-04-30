# Telegram MCP Server — Setup Guide

## 1. Get Telegram API credentials

Go to https://my.telegram.org/apps and create an app:
- **App title:** TelegramExport
- **Short name:** tgexport
- **Platform:** Desktop
- **Description:** Personal script to export chat history for archival purposes

Copy the `api_id` and `api_hash` from the result page.

## 2. Create your .env file

In this folder (`Unity Nodes/`), create a file called `.env`:

```
TG_API_ID=your_api_id_here
TG_API_HASH=your_api_hash_here
```

## 3. Install dependencies

```bash
pip install telethon "mcp[cli]"
```

## 4. First-time login (interactive — do this once)

```bash
cd /Users/rolfbosscha/Documents/Projecten/UnityNodes
python telegram_mcp.py
```

This will ask for your phone number and a Telegram verification code.
After logging in, a `tg_session` file is created that keeps you authenticated.
Press Ctrl+C after login succeeds.

## 5. Add to Claude Desktop

Open Claude Desktop settings → Developer → Edit Config, and add this to the `mcpServers` section:

```json
{
  "mcpServers": {
    "telegram": {
      "command": "python",
      "args": ["/Users/rolfbosscha/Documents/Projecten/UnityNodes/telegram_mcp.py"],
      "env": {
        "TG_API_ID": "your_api_id_here",
        "TG_API_HASH": "your_api_hash_here"
      }
    }
  }
}
```

Restart Claude Desktop after saving.

## Available tools

Once connected, you'll have these tools in Claude Desktop:

- **telegram_list_chats** — Browse your Telegram chats
- **telegram_get_messages** — Fetch messages by date or date range
- **telegram_search** — Search messages by keyword
- **telegram_export_to_files** — Save messages to JSON + Markdown files
