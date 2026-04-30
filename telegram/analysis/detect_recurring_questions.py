#!/usr/bin/env python3
"""
Detect frequently asked questions from Telegram conversation archives.

Scans messages for question patterns and identifies recurring themes
that should be added to the FAQ.

Usage:
    # Analyze current month
    python telegram/analysis/detect_recurring_questions.py
    
    # Analyze specific channel
    python telegram/analysis/detect_recurring_questions.py --channel "Unity Network - Verified"
    
    # Analyze date range
    python telegram/analysis/detect_recurring_questions.py --start 2026-04-01 --end 2026-04-30
    
    # Lower threshold for less common questions
    python telegram/analysis/detect_recurring_questions.py --min-count 2
"""

import json
import re
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import List, Tuple


# Question markers for detection
QUESTION_MARKERS = [
    r'\?$',  # Ends with question mark
    r'\?[\s]*$',  # Question mark with trailing whitespace
]

QUESTION_STARTERS = [
    'how', 'when', 'why', 'what', 'where', 'who', 
    'can', 'will', 'is', 'are', 'do', 'does', 'did',
    'has', 'have', 'should', 'could', 'would',
    'wen',  # Common crypto slang for "when"
]


def is_question(text: str) -> bool:
    """
    Detect if message text is a question.
    
    Args:
        text: Message text
        
    Returns:
        bool: True if appears to be a question
    """
    if not text or len(text) < 5:
        return False
    
    text_lower = text.lower().strip()
    
    # Check for question mark
    if any(re.search(marker, text) for marker in QUESTION_MARKERS):
        return True
    
    # Check for question starters
    words = text_lower.split()
    if words and words[0] in QUESTION_STARTERS:
        return True
    
    return False


def normalize_question(text: str) -> str:
    """
    Normalize question text for comparison.
    
    Args:
        text: Original question text
        
    Returns:
        str: Normalized text (lowercase, trimmed, punctuation removed)
    """
    # Lowercase
    normalized = text.lower().strip()
    
    # Remove extra whitespace
    normalized = re.sub(r'\s+', ' ', normalized)
    
    # Remove trailing question marks
    normalized = re.sub(r'\?+\s*$', '', normalized)
    
    # Remove emojis and special chars (keep basic punctuation)
    normalized = re.sub(r'[^\w\s\.,!?-]', '', normalized)
    
    return normalized.strip()


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
        
        # Filter by date range
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
    
    # Load from monthly archives if they exist
    if archive_dir.exists():
        for json_file in sorted(archive_dir.glob("20??-??-messages.json")):
            month = json_file.stem[:7]
            
            # Filter by date range (approximate)
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


def extract_questions(messages: List[dict], min_length: int = 10) -> List[Tuple[str, dict]]:
    """
    Extract questions from messages.
    
    Args:
        messages: List of message dictionaries
        min_length: Minimum question length to consider
        
    Returns:
        List of (normalized_question, original_message) tuples
    """
    questions = []
    
    for msg in messages:
        text = msg.get('msg', '').strip()
        
        if not text or len(text) < min_length:
            continue
        
        if is_question(text):
            normalized = normalize_question(text)
            if len(normalized) >= min_length:
                questions.append((normalized, msg))
    
    return questions


def cluster_similar_questions(questions: List[Tuple[str, dict]], similarity_threshold: float = 0.7) -> dict:
    """
    Group similar questions together (basic word overlap approach).
    
    Args:
        questions: List of (normalized_question, original_message) tuples
        similarity_threshold: Minimum word overlap ratio to consider similar
        
    Returns:
        Dict mapping representative question to list of similar questions
    """
    # For now, use exact match (can be enhanced with fuzzy matching later)
    clusters = {}
    
    for normalized, original_msg in questions:
        # Use normalized text as cluster key
        if normalized not in clusters:
            clusters[normalized] = []
        clusters[normalized].append(original_msg)
    
    return clusters


def analyze_channel(channel_path: Path, 
                   start_date: str = None, 
                   end_date: str = None,
                   min_count: int = 3) -> List[Tuple[str, int, List[dict]]]:
    """
    Analyze questions in a channel.
    
    Args:
        channel_path: Path to channel directory
        start_date: Optional start date filter
        end_date: Optional end date filter
        min_count: Minimum occurrences to report
        
    Returns:
        List of (question, count, example_messages) tuples
    """
    print(f"\n📁 Analyzing: {channel_path.name}")
    
    # Load messages
    messages = load_messages(channel_path, start_date, end_date)
    print(f"   Loaded {len(messages)} messages")
    
    if not messages:
        return []
    
    # Extract questions
    questions = extract_questions(messages)
    print(f"   Found {len(questions)} questions")
    
    if not questions:
        return []
    
    # Cluster similar questions
    clusters = cluster_similar_questions(questions)
    
    # Filter by frequency
    recurring = [
        (q, len(msgs), msgs[:5])  # Keep first 5 examples
        for q, msgs in clusters.items()
        if len(msgs) >= min_count
    ]
    
    # Sort by frequency
    recurring.sort(key=lambda x: x[1], reverse=True)
    
    print(f"   Found {len(recurring)} recurring questions (asked {min_count}+ times)")
    
    return recurring


def format_output(results: List[Tuple[str, int, List[dict]]], channel_name: str):
    """
    Format analysis results for display.
    
    Args:
        results: List of (question, count, examples) tuples
        channel_name: Name of channel analyzed
    """
    print(f"\n{'='*80}")
    print(f"RECURRING QUESTIONS — {channel_name}")
    print(f"{'='*80}\n")
    
    if not results:
        print("No recurring questions found (increase sensitivity with --min-count)")
        return
    
    for question, count, examples in results:
        # Frequency emoji
        if count >= 10:
            emoji = "💬💬💬"
        elif count >= 5:
            emoji = "💬💬"
        else:
            emoji = "💬"
        
        print(f"{emoji} Asked {count} times:")
        print(f"   \"{question[:120]}{'...' if len(question) > 120 else ''}\"")
        
        # Show date range
        dates = [msg.get('ts', '')[:10] for msg in examples if msg.get('ts')]
        if dates:
            date_range = f"{min(dates)} to {max(dates)}" if len(set(dates)) > 1 else dates[0]
            print(f"   Dates: {date_range}")
        
        # Show example asker
        if examples and examples[0].get('author'):
            print(f"   Example: {examples[0]['author']}")
        
        print()


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Detect recurring questions from Telegram conversations"
    )
    parser.add_argument(
        "--channel",
        type=str,
        help="Specific channel to analyze (e.g., 'Unity Network - Verified')"
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
        "--min-count",
        type=int,
        default=3,
        help="Minimum times a question must be asked to report (default: 3)"
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
    else:
        channels = [d for d in conversations.iterdir() 
                   if d.is_dir() and not d.name.startswith('.')]
    
    print(f"Analyzing {len(channels)} channel(s)")
    if args.start or args.end:
        print(f"Date range: {args.start or 'earliest'} to {args.end or 'latest'}")
    print(f"Minimum occurrences: {args.min_count}")
    
    # Analyze each channel
    for channel_dir in sorted(channels):
        results = analyze_channel(
            channel_dir,
            start_date=args.start,
            end_date=args.end,
            min_count=args.min_count
        )
        
        if results:
            format_output(results, channel_dir.name)
    
    print(f"\n{'='*80}")
    print("✅ Analysis complete")
    print("\nNext steps:")
    print("  1. Review recurring questions above")
    print("  2. Add answers to telegram/faq/ files")
    print("  3. Update FAQ frequency markers (💬/💬💬/💬💬💬)")
    print(f"{'='*80}\n")
