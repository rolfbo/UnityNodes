#!/usr/bin/env python3
"""
Auto-detect team promises from Telegram conversations.

Scans official announcements and team member messages for commitment language,
helping track what has been promised so nothing falls through the cracks.

Usage:
    # Scan announcements channel
    python telegram/analysis/detect_promises.py --channel "Unity Network Announcements"
    
    # Scan all channels for team messages
    python telegram/analysis/detect_promises.py --all-channels
    
    # Scan specific date range
    python telegram/analysis/detect_promises.py --start 2026-04-01 --end 2026-04-30
    
    # Export to JSON for processing
    python telegram/analysis/detect_promises.py --output promises.json
"""

import json
import re
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional


# Known team members (expand as needed)
TEAM_MEMBERS = {
    "Sophie", "Kay", "Kyle", "Jack", "Josh", "Mickey", "Omri",
    "Unity Network Assistant", "Jamie King", "William", "Alex",
    "Danny", "Val", "Page Øne", "Calus B"
}

# Promise language patterns
PROMISE_PATTERNS = [
    # Commitment verbs
    (r'\bwill (be|ship|release|deliver|launch|add|implement|fix|improve)\b', 'commitment'),
    (r'\b(shipping|releasing|launching|delivering) (soon|shortly|today|tomorrow|this week|next week)\b', 'commitment'),
    
    # Timeline language
    (r'\bcoming (soon|shortly|this week|next week|in \w+ days?)\b', 'timeline'),
    (r'\bexpected (to|in|by|within)\b', 'timeline'),
    (r'\bplanned for\b', 'timeline'),
    (r'\btarget(ing|ed)?\b', 'timeline'),
    (r'\b(Q[1-4]|quarter [1-4])\b', 'timeline'),
    (r'\b\d{4}-\d{2}-\d{2}\b', 'timeline'),  # Date mentions
    
    # Work status
    (r'\bworking on\b', 'in_progress'),
    (r'\bin (development|progress|QA|final stages|testing)\b', 'in_progress'),
    (r'\b(building|developing|creating|implementing)\b', 'in_progress'),
    (r'\bunder (review|development)\b', 'in_progress'),
    
    # Feature announcements
    (r'\bannouncing\b', 'announcement'),
    (r'\bintroducing\b', 'announcement'),
    (r'\bnew feature\b', 'announcement'),
    (r'\bupgrade\b', 'announcement'),
    
    # Confirmation language
    (r'\bconfirmed\b', 'confirmed'),
    (r'\bguarantee\b', 'confirmed'),
    (r'\bpromise\b', 'confirmed'),
]


def is_team_member(author: str) -> bool:
    """
    Check if author is a known team member.
    
    Args:
        author: Message author name
        
    Returns:
        bool: True if recognized team member
    """
    if not author:
        return False
    
    # Exact match
    if author in TEAM_MEMBERS:
        return True
    
    # Partial match (case-insensitive)
    author_lower = author.lower()
    return any(member.lower() in author_lower for member in TEAM_MEMBERS)


def detect_promise_language(text: str) -> List[tuple]:
    """
    Detect promise/commitment language in text.
    
    Args:
        text: Message text
        
    Returns:
        List of (pattern, category, match_text) tuples
    """
    matches = []
    text_lower = text.lower()
    
    for pattern, category in PROMISE_PATTERNS:
        for match in re.finditer(pattern, text_lower, re.IGNORECASE):
            matches.append((pattern, category, match.group(0)))
    
    return matches


def load_messages(channel_path: Path, start_date: str = None, end_date: str = None) -> List[dict]:
    """
    Load messages from channel directory.
    
    Args:
        channel_path: Path to channel directory
        start_date: Optional start date (YYYY-MM-DD)
        end_date: Optional end date (YYYY-MM-DD)
        
    Returns:
        List of message dictionaries
    """
    messages = []
    
    # Check for archive directory
    archive_dir = channel_path / "archive"
    
    # Load from daily files
    for json_file in sorted(channel_path.glob("20??-??-??-messages.json")):
        file_date = json_file.stem[:10]
        
        if start_date and file_date < start_date:
            continue
        if end_date and file_date > end_date:
            continue
        
        try:
            with open(json_file) as f:
                data = json.load(f)
                if isinstance(data, list):
                    messages.extend(data)
                else:
                    messages.append(data)
        except Exception as e:
            print(f"⚠️  Error reading {json_file.name}: {e}")
    
    # Load from monthly archives
    if archive_dir.exists():
        for json_file in sorted(archive_dir.glob("20??-??-messages.json")):
            month = json_file.stem[:7]
            
            if start_date and month < start_date[:7]:
                continue
            if end_date and month > end_date[:7]:
                continue
            
            try:
                with open(json_file) as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        messages.extend(data)
                    else:
                        messages.append(data)
            except Exception as e:
                print(f"⚠️  Error reading {json_file.name}: {e}")
    
    return messages


def analyze_promises(channel_path: Path, 
                    start_date: str = None, 
                    end_date: str = None,
                    team_only: bool = True) -> List[Dict]:
    """
    Analyze channel for promises and commitments.
    
    Args:
        channel_path: Path to channel directory
        start_date: Optional start date filter
        end_date: Optional end date filter
        team_only: Only look at team member messages
        
    Returns:
        List of promise dictionaries
    """
    print(f"\n📁 Analyzing: {channel_path.name}")
    
    messages = load_messages(channel_path, start_date, end_date)
    print(f"   Loaded {len(messages)} messages")
    
    if not messages:
        return []
    
    promises = []
    
    for msg in messages:
        author = msg.get('author', '')
        text = msg.get('msg', '')
        
        if not text or len(text) < 10:
            continue
        
        # Filter by team membership if requested
        if team_only and not is_team_member(author):
            continue
        
        # Detect promise language
        matches = detect_promise_language(text)
        
        if matches:
            # Categorize by strongest signal
            categories = [cat for _, cat, _ in matches]
            primary_category = 'commitment' if 'commitment' in categories else categories[0]
            
            promise = {
                'date': msg.get('ts', '')[:10],
                'author': author,
                'text': text[:500],  # Truncate long messages
                'full_text': text,
                'category': primary_category,
                'signals': len(matches),
                'matches': [match_text for _, _, match_text in matches],
                'message_id': msg.get('id'),
            }
            promises.append(promise)
    
    print(f"   Found {len(promises)} potential promises")
    
    return promises


def categorize_promises(promises: List[Dict]) -> Dict[str, List[Dict]]:
    """
    Group promises by category.
    
    Args:
        promises: List of promise dictionaries
        
    Returns:
        Dict mapping category to list of promises
    """
    by_category = {
        'commitment': [],
        'timeline': [],
        'in_progress': [],
        'announcement': [],
        'confirmed': [],
    }
    
    for promise in promises:
        category = promise.get('category', 'commitment')
        by_category[category].append(promise)
    
    return by_category


def format_output(promises: List[Dict], channel_name: str):
    """
    Format analysis results for display.
    
    Args:
        promises: List of promise dictionaries
        channel_name: Name of channel analyzed
    """
    print(f"\n{'='*80}")
    print(f"DETECTED PROMISES — {channel_name}")
    print(f"{'='*80}\n")
    
    if not promises:
        print("No promises detected")
        return
    
    # Group by category
    by_category = categorize_promises(promises)
    
    category_labels = {
        'commitment': '🎯 Commitments (will ship/release/deliver)',
        'timeline': '📅 Timeline Mentions (coming soon, Q1/Q2, dates)',
        'in_progress': '🔵 In Progress (working on, in development)',
        'announcement': '📢 Announcements (introducing, new feature)',
        'confirmed': '✅ Confirmed Promises (promise, guarantee)',
    }
    
    for category, label in category_labels.items():
        items = by_category[category]
        if not items:
            continue
        
        print(f"\n{label} — {len(items)} detected\n")
        
        # Sort by date
        items.sort(key=lambda x: x.get('date', ''), reverse=True)
        
        for promise in items[:10]:  # Show top 10 per category
            date = promise.get('date', 'Unknown')
            author = promise.get('author', 'Unknown')
            text = promise.get('text', '')
            signals = promise.get('signals', 0)
            
            print(f"[{date}] {author} ({signals} signal{'s' if signals > 1 else ''}):")
            
            # Show text with matches highlighted
            matches = promise.get('matches', [])
            display_text = text[:200]
            if len(text) > 200:
                display_text += "..."
            
            print(f"  \"{display_text}\"")
            
            if matches:
                print(f"  Signals: {', '.join(matches[:3])}")
            
            print()
        
        if len(items) > 10:
            print(f"  ... and {len(items) - 10} more\n")


def export_json(promises: List[Dict], output_path: str):
    """
    Export promises to JSON file.
    
    Args:
        promises: List of promise dictionaries
        output_path: Path to output JSON file
    """
    with open(output_path, 'w') as f:
        json.dump(promises, f, indent=2)
    
    print(f"\n✅ Exported {len(promises)} promises to {output_path}")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Detect team promises from Telegram conversations"
    )
    parser.add_argument(
        "--channel",
        type=str,
        help="Specific channel to analyze"
    )
    parser.add_argument(
        "--all-channels",
        action="store_true",
        help="Analyze all channels"
    )
    parser.add_argument(
        "--start",
        type=str,
        help="Start date (YYYY-MM-DD)"
    )
    parser.add_argument(
        "--end",
        type=str,
        help="End date (YYYY-MM-DD)"
    )
    parser.add_argument(
        "--include-all",
        action="store_true",
        help="Include all messages, not just team members"
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Export to JSON file"
    )
    parser.add_argument(
        "--path",
        type=str,
        default="telegram/conversations",
        help="Path to conversations directory"
    )
    
    args = parser.parse_args()
    
    conversations = Path(args.path)
    
    if not conversations.exists():
        print(f"❌ Error: {args.path} does not exist")
        exit(1)
    
    # Find channels to analyze
    if args.channel:
        channels = [conversations / args.channel]
        if not channels[0].exists():
            print(f"❌ Error: Channel '{args.channel}' not found")
            exit(1)
    elif args.all_channels:
        channels = [d for d in conversations.iterdir() 
                   if d.is_dir() and not d.name.startswith('.')]
    else:
        # Default: only announcements channel
        announcements = conversations / "Unity Network Announcements"
        if announcements.exists():
            channels = [announcements]
        else:
            print("⚠️  No announcements channel found, analyzing all channels")
            channels = [d for d in conversations.iterdir() 
                       if d.is_dir() and not d.name.startswith('.')]
    
    print(f"Analyzing {len(channels)} channel(s)")
    if args.start or args.end:
        print(f"Date range: {args.start or 'earliest'} to {args.end or 'latest'}")
    print(f"Filter: {'All messages' if args.include_all else 'Team members only'}")
    
    # Analyze channels
    all_promises = []
    
    for channel_dir in sorted(channels):
        promises = analyze_promises(
            channel_dir,
            start_date=args.start,
            end_date=args.end,
            team_only=not args.include_all
        )
        
        all_promises.extend(promises)
        
        if promises and not args.output:
            format_output(promises, channel_dir.name)
    
    # Export if requested
    if args.output:
        export_json(all_promises, args.output)
    
    print(f"\n{'='*80}")
    print(f"✅ Analysis complete — {len(all_promises)} promises detected")
    print("\nNext steps:")
    print("  1. Review promises above")
    print("  2. Add to telegram/tasks/active.md for tracking")
    print("  3. Update status as promises are fulfilled")
    print(f"{'='*80}\n")
