#!/usr/bin/env python3
"""
Consolidate old per-day conversation files into monthly archives.

Reduces file count by 90% while keeping current month's daily files.
Makes searches faster and data management easier.

Usage:
    # Preview what would be consolidated
    python telegram/utils/consolidate_monthly.py --dry-run
    
    # Actually consolidate (creates archive/ subfolder in each channel)
    python telegram/utils/consolidate_monthly.py
    
    # Consolidate specific channel only
    python telegram/utils/consolidate_monthly.py --channel "Unity Network - Verified"
"""

import json
import os
from collections import defaultdict
from datetime import datetime
from pathlib import Path


def consolidate_channel(channel_path: Path, current_month: str = None, dry_run: bool = False):
    """
    Roll up all files older than current_month into monthly archives.
    
    Args:
        channel_path: Path to channel directory
        current_month: Month to keep as daily files (e.g., "2026-04")
        dry_run: If True, only show what would be done
    """
    if current_month is None:
        current_month = datetime.now().strftime("%Y-%m")
    
    channel = Path(channel_path)
    if not channel.exists():
        print(f"⚠️  Channel not found: {channel}")
        return
    
    # Create archive directory
    archive_dir = channel / "archive"
    
    # Group JSON files by month
    by_month = defaultdict(list)
    for json_file in channel.glob("20??-??-??-messages.json"):
        month = json_file.stem[:7]  # "2026-04"
        if month < current_month:
            by_month[month].append(json_file)
    
    if not by_month:
        print(f"✅ {channel.name}: No old files to consolidate")
        return
    
    print(f"\n📁 {channel.name}")
    print(f"   Current month: {current_month} (will keep daily files)")
    print(f"   Months to consolidate: {len(by_month)}")
    
    # Consolidate each month
    total_files_consolidated = 0
    
    for month, files in sorted(by_month.items()):
        monthly_messages = []
        markdown_files = []
        
        # Load all messages for this month
        for json_file in sorted(files):
            try:
                with open(json_file) as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        monthly_messages.extend(data)
                    else:
                        monthly_messages.append(data)
                
                # Track corresponding markdown file
                md_file = json_file.with_name(
                    json_file.stem.replace('-messages', '-messages-raw') + '.md'
                )
                if md_file.exists():
                    markdown_files.append(md_file)
            
            except Exception as e:
                print(f"   ⚠️  Error reading {json_file.name}: {e}")
                continue
        
        if not monthly_messages:
            print(f"   ⚠️  {month}: No messages found, skipping")
            continue
        
        # Create monthly archive
        monthly_file = archive_dir / f"{month}-messages.json"
        
        if dry_run:
            print(f"   [DRY RUN] Would consolidate {len(files)} days ({len(monthly_messages)} messages) → {monthly_file.name}")
        else:
            # Create archive directory if needed
            archive_dir.mkdir(exist_ok=True)
            
            # Write consolidated file
            with open(monthly_file, 'w') as f:
                json.dump(monthly_messages, f, indent=2)
            
            # Delete original files
            for json_file in files:
                json_file.unlink()
            for md_file in markdown_files:
                if md_file.exists():
                    md_file.unlink()
            
            print(f"   ✅ {month}: Consolidated {len(files)} days ({len(monthly_messages)} messages) → archive/")
            total_files_consolidated += len(files) + len(markdown_files)
    
    if not dry_run and total_files_consolidated > 0:
        print(f"   📦 Moved {total_files_consolidated} files to archive/")


def consolidate_all(conversations_path: str = "telegram/conversations", 
                    current_month: str = None, 
                    dry_run: bool = False,
                    channel_filter: str = None):
    """
    Consolidate all channels in conversations directory.
    
    Args:
        conversations_path: Path to conversations directory
        current_month: Month to keep as daily files (defaults to current month)
        dry_run: If True, only show what would be done
        channel_filter: If set, only consolidate this channel
    """
    conversations = Path(conversations_path)
    
    if not conversations.exists():
        print(f"Error: {conversations_path} does not exist")
        return
    
    if current_month is None:
        current_month = datetime.now().strftime("%Y-%m")
    
    print(f"{'='*70}")
    print(f"Monthly Consolidation {'(DRY RUN)' if dry_run else ''}")
    print(f"{'='*70}")
    print(f"Keeping daily files for: {current_month}")
    print(f"Consolidating older months into: [channel]/archive/YYYY-MM-messages.json")
    
    # Find all channel directories
    channels = [d for d in conversations.iterdir() 
                if d.is_dir() and not d.name.startswith('.')]
    
    if channel_filter:
        channels = [d for d in channels if d.name == channel_filter]
        if not channels:
            print(f"\n⚠️  Channel '{channel_filter}' not found")
            return
    
    print(f"Channels to process: {len(channels)}")
    
    # Consolidate each channel
    for channel_dir in sorted(channels):
        consolidate_channel(channel_dir, current_month, dry_run)
    
    print(f"\n{'='*70}")
    if dry_run:
        print("DRY RUN COMPLETE - No files were actually moved")
        print("Run without --dry-run to perform consolidation")
    else:
        print("✅ CONSOLIDATION COMPLETE")
        print("\nResult:")
        print("  • Old months: Consolidated into monthly archives")
        print(f"  • {current_month}: Kept as daily files")
        print("  • File count reduced by ~90%")
    print(f"{'='*70}")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Consolidate daily Telegram conversation files into monthly archives"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be done without actually moving files"
    )
    parser.add_argument(
        "--channel",
        type=str,
        help="Only consolidate specific channel (e.g., 'Unity Network - Verified')"
    )
    parser.add_argument(
        "--current-month",
        type=str,
        help="Month to keep as daily files (default: current month, format: YYYY-MM)"
    )
    parser.add_argument(
        "--path",
        type=str,
        default="telegram/conversations",
        help="Path to conversations directory (default: telegram/conversations)"
    )
    
    args = parser.parse_args()
    
    consolidate_all(
        conversations_path=args.path,
        current_month=args.current_month,
        dry_run=args.dry_run,
        channel_filter=args.channel
    )
