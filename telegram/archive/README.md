# Archived Scripts

These scripts are kept for historical reference but are no longer needed.
Their functionality has been integrated into other tools.

## Archived Files

### export_telegram.py (267 lines)
- **Archived:** 2026-04-30
- **Reason:** Functionality duplicated by `telegram_mcp.py` export_to_files tool
- **Replacement:** Use MCP server instead: `telegram_export_to_files`

### pull_all_messages.py (145 lines)
- **Archived:** 2026-04-30
- **Reason:** Functionality duplicated by `telegram_mcp.py` get_messages tool
- **Replacement:** Use MCP server instead: `telegram_get_messages`

## Why Archive Instead of Delete?

These scripts contain working implementations that might be useful for:
- Reference when debugging the MCP tools
- Understanding the evolution of the codebase
- Extracting specific logic if needed in the future
- Historical context for documentation

## Code Consolidation

Shared functions from these scripts have been extracted to:
- `utils/telegram_helpers.py` — `get_display_name()`, `format_media()`

This eliminates duplication and creates a single source of truth.
