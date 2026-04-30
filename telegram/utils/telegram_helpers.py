"""
Shared helper functions for Telegram message processing.

This module provides common utilities used across Telegram scripts
to avoid code duplication.
"""

from telethon.tl.types import (
    MessageMediaDocument,
    MessageMediaPhoto,
    MessageMediaWebPage,
)


def get_display_name(sender) -> str:
    """
    Extract readable display name from Telethon user/channel object.
    
    Args:
        sender: Telethon user or channel object
        
    Returns:
        str: Display name (title, first+last name, username, or "Unknown")
    """
    if sender is None:
        return "Unknown"
    
    # Channels have titles
    if hasattr(sender, "title"):
        return sender.title
    
    # Users have first/last names
    parts = []
    if getattr(sender, "first_name", None):
        parts.append(sender.first_name)
    if getattr(sender, "last_name", None):
        parts.append(sender.last_name)
    name = " ".join(parts).strip()
    
    # Fall back to username
    if not name and getattr(sender, "username", None):
        return sender.username
    
    return name or "Unknown"


def format_media(msg) -> str:
    """
    Return short description of message media type.
    
    Args:
        msg: Telethon message object
        
    Returns:
        str: Media description like "[Photo]", "[Video]", etc., or empty string
    """
    if msg.media is None:
        return ""
    
    if isinstance(msg.media, MessageMediaPhoto):
        return "[Photo]"
    
    if isinstance(msg.media, MessageMediaDocument):
        mime_type = msg.media.document.mime_type
        if mime_type.startswith("video/"):
            return "[Video]"
        if mime_type.startswith("audio/"):
            return "[Audio]"
        return "[Document]"
    
    if isinstance(msg.media, MessageMediaWebPage):
        # Web previews don't need annotation
        return ""
    
    return "[Media]"


def validate_date(date_str: str) -> bool:
    """
    Validate date string in YYYY-MM-DD format.
    
    Args:
        date_str: Date string to validate
        
    Returns:
        bool: True if valid format, False otherwise
    """
    import re
    pattern = r'^\d{4}-\d{2}-\d{2}$'
    return bool(re.match(pattern, date_str))
