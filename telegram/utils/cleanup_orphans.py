#!/usr/bin/env python3
"""
Move orphaned export files from conversations/ root to their channel subfolder.

After multi-channel exports, files sometimes remain in the conversations/ root
due to bash sandbox limitations. This script detects the channel from the
markdown header and moves files to the correct subfolder.

Usage:
    python telegram/utils/cleanup_orphans.py
"""

import os
import re
from pathlib import Path


def detect_channel_from_file(md_path: Path) -> str | None:
    """
    Read markdown header to determine which channel it's from.
    
    Args:
        md_path: Path to markdown file
        
    Returns:
        Channel name or None if not detected
    """
    try:
        with open(md_path) as f:
            first_line = f.readline().strip()
        
        # Parse: "# Unity Network - Verified — Raw Messages"
        match = re.match(r'^# (.+?) — Raw Messages', first_line)
        if match:
            return match.group(1)
    except Exception as e:
        print(f"Error reading {md_path}: {e}")
    
    return None


def move_orphans(conversations_path: str = "telegram/conversations", dry_run: bool = False):
    """
    Move all orphaned YYYY-MM-DD files to channel subfolders.
    
    Args:
        conversations_path: Path to conversations directory
        dry_run: If True, only print what would be done without moving files
    """
    conversations = Path(conversations_path)
    
    if not conversations.exists():
        print(f"Error: {conversations_path} does not exist")
        return
    
    # Find all orphaned files (YYYY-MM-DD pattern in root)
    orphan_pattern = re.compile(r'^20\d{2}-\d{2}-\d{2}-messages')
    orphans = [f for f in conversations.iterdir() 
               if f.is_file() and orphan_pattern.match(f.name)]
    
    if not orphans:
        print("✅ No orphaned files found in conversations/ root")
        return
    
    print(f"Found {len(orphans)} orphaned file(s)")
    
    # Group by base name (markdown + json pairs)
    processed = set()
    moved_count = 0
    
    for orphan in sorted(orphans):
        if orphan.name in processed:
            continue
        
        # Determine channel
        channel = None
        
        if orphan.suffix == '.md':
            channel = detect_channel_from_file(orphan)
            md_file = orphan
            json_file = orphan.with_suffix('.json').with_name(
                orphan.stem.replace('-raw', '') + '.json'
            )
        elif orphan.suffix == '.json':
            # Try to find corresponding markdown
            md_name = orphan.stem.replace('-messages', '-messages-raw') + '.md'
            md_file = orphan.with_name(md_name)
            if md_file.exists():
                channel = detect_channel_from_file(md_file)
            json_file = orphan
        else:
            continue
        
        if not channel:
            print(f"⚠️  Could not detect channel for {orphan.name}")
            continue
        
        # Move files
        dest_dir = conversations / channel
        if not dest_dir.exists():
            print(f"⚠️  Channel directory does not exist: {dest_dir}")
            continue
        
        # Move markdown file
        if md_file.exists():
            dest_md = dest_dir / md_file.name
            if dry_run:
                print(f"[DRY RUN] Would move: {md_file.name} → {channel}/")
            else:
                md_file.rename(dest_md)
                print(f"✅ Moved: {md_file.name} → {channel}/")
                moved_count += 1
            processed.add(md_file.name)
        
        # Move JSON file
        if json_file.exists():
            dest_json = dest_dir / json_file.name
            if dry_run:
                print(f"[DRY RUN] Would move: {json_file.name} → {channel}/")
            else:
                json_file.rename(dest_json)
                print(f"✅ Moved: {json_file.name} → {channel}/")
                moved_count += 1
            processed.add(json_file.name)
    
    if dry_run:
        print(f"\n[DRY RUN] Would move {len(processed)} file(s)")
    else:
        print(f"\n✅ Successfully moved {moved_count} file(s)")


if __name__ == "__main__":
    import sys
    
    # Check for --dry-run flag
    dry_run = "--dry-run" in sys.argv
    
    if dry_run:
        print("=== DRY RUN MODE (no files will be moved) ===\n")
    
    move_orphans(dry_run=dry_run)
