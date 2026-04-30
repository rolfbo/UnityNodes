#!/usr/bin/env python3
"""
Track community sentiment over time from Telegram conversations.

Analyzes message tone (positive/negative/neutral) to identify trends,
detect frustration spikes, and provide early warning of community issues.

Usage:
    # Analyze recent week
    python telegram/analysis/sentiment_tracker.py --days 7
    
    # Specific channel
    python telegram/analysis/sentiment_tracker.py --channel "Unity Network - Verified"
    
    # Date range
    python telegram/analysis/sentiment_tracker.py --start 2026-04-01 --end 2026-04-30
    
    # Export to JSON
    python telegram/analysis/sentiment_tracker.py --output sentiment.json
    
    # Show daily breakdown
    python telegram/analysis/sentiment_tracker.py --by-day
"""

import json
import re
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Tuple


# Sentiment keyword lists
POSITIVE_KEYWORDS = [
    'great', 'good', 'excellent', 'amazing', 'awesome', 'perfect', 'love',
    'happy', 'thanks', 'thank you', 'appreciate', 'helpful', 'nice', 'cool',
    'excited', 'impressive', 'wonderful', 'fantastic', 'congrats', 'success',
    '👍', '🎉', '🚀', '💪', '❤️', '😊', '😁', '👏', '🔥', '✨',
    'lol', 'lmao', 'haha', 'finally', 'working', 'fixed', 'solved'
]

NEGATIVE_KEYWORDS = [
    'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'angry',
    'frustrated', 'annoyed', 'disappointed', 'useless', 'broken', 'fail',
    'disaster', 'scam', 'fraud', 'lie', 'lying', 'ridiculous', 'unfair',
    'pathetic', 'joke', 'waste', 'garbage', 'trash', 'stupid', 'dumb',
    '😡', '😠', '🤬', '😤', '😞', '😢', '😭', '💩', '👎',
    'wtf', 'bullshit', 'bs', 'sucks', 'suck', 'damn', 'fuck',
    'problem', 'issue', 'bug', 'error', 'not working', 'doesnt work',
    "doesn't work", 'cant', "can't", 'wont', "won't", 'never'
]

FRUSTRATION_PHRASES = [
    'still waiting', 'still no', 'still not', 'how long', 'when will',
    'enough is enough', 'fed up', 'giving up', 'done with', 'over this',
    'losing patience', 'losing faith', 'losing trust', 'waste of time',
    'waste of money', 'regret', 'should have', 'shouldve', "should've",
    'promised', 'said', 'told us', 'where is', 'why is', 'what happened to'
]


def analyze_sentiment(text: str) -> Tuple[str, float, Dict[str, int]]:
    """
    Analyze sentiment of message text.
    
    Args:
        text: Message text to analyze
        
    Returns:
        Tuple of (sentiment, score, keyword_counts)
        - sentiment: 'positive', 'negative', or 'neutral'
        - score: -1.0 to 1.0 (negative to positive)
        - keyword_counts: dict with pos/neg/frustration counts
    """
    if not text or len(text) < 5:
        return 'neutral', 0.0, {'positive': 0, 'negative': 0, 'frustration': 0}
    
    text_lower = text.lower()
    
    # Count sentiment keywords
    pos_count = sum(1 for kw in POSITIVE_KEYWORDS if kw in text_lower)
    neg_count = sum(1 for kw in NEGATIVE_KEYWORDS if kw in text_lower)
    frust_count = sum(1 for phrase in FRUSTRATION_PHRASES if phrase in text_lower)
    
    # Frustration counts as extra negative
    total_neg = neg_count + (frust_count * 2)
    
    # Calculate score
    if pos_count == 0 and total_neg == 0:
        return 'neutral', 0.0, {'positive': 0, 'negative': 0, 'frustration': 0}
    
    # Normalize to -1.0 to 1.0 range
    total = pos_count + total_neg
    score = (pos_count - total_neg) / total if total > 0 else 0.0
    
    # Classify
    if score > 0.2:
        sentiment = 'positive'
    elif score < -0.2:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    return sentiment, score, {
        'positive': pos_count,
        'negative': neg_count,
        'frustration': frust_count
    }


def load_messages(channel_path: Path, start_date: str = None, end_date: str = None) -> List[dict]:
    """Load messages from channel directory."""
    messages = []
    
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
    
    # Load from archives
    archive_dir = channel_path / "archive"
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


def analyze_channel_sentiment(channel_path: Path,
                             start_date: str = None,
                             end_date: str = None,
                             by_day: bool = False) -> Dict:
    """
    Analyze sentiment for a channel.
    
    Args:
        channel_path: Path to channel directory
        start_date: Optional start date
        end_date: Optional end date
        by_day: Group results by day
        
    Returns:
        Dictionary with sentiment analysis results
    """
    print(f"\n📁 Analyzing: {channel_path.name}")
    
    messages = load_messages(channel_path, start_date, end_date)
    print(f"   Loaded {len(messages)} messages")
    
    if not messages:
        return None
    
    # Analyze each message
    daily_sentiment = defaultdict(lambda: {
        'positive': 0,
        'negative': 0,
        'neutral': 0,
        'scores': [],
        'frustration': 0
    })
    
    overall = {
        'positive': 0,
        'negative': 0,
        'neutral': 0,
        'scores': [],
        'frustration_count': 0
    }
    
    for msg in messages:
        text = msg.get('msg', '')
        date = msg.get('ts', '')[:10]
        
        if not text:
            continue
        
        sentiment, score, counts = analyze_sentiment(text)
        
        # Update overall
        overall[sentiment] += 1
        overall['scores'].append(score)
        if counts['frustration'] > 0:
            overall['frustration_count'] += 1
        
        # Update daily
        if by_day and date:
            daily_sentiment[date][sentiment] += 1
            daily_sentiment[date]['scores'].append(score)
            if counts['frustration'] > 0:
                daily_sentiment[date]['frustration'] += 1
    
    # Calculate averages
    total_msgs = sum([overall['positive'], overall['negative'], overall['neutral']])
    avg_score = sum(overall['scores']) / len(overall['scores']) if overall['scores'] else 0
    
    result = {
        'channel': channel_path.name,
        'total_messages': total_msgs,
        'positive': overall['positive'],
        'negative': overall['negative'],
        'neutral': overall['neutral'],
        'positive_pct': overall['positive'] / total_msgs * 100 if total_msgs > 0 else 0,
        'negative_pct': overall['negative'] / total_msgs * 100 if total_msgs > 0 else 0,
        'neutral_pct': overall['neutral'] / total_msgs * 100 if total_msgs > 0 else 0,
        'avg_score': avg_score,
        'frustration_messages': overall['frustration_count'],
        'frustration_pct': overall['frustration_count'] / total_msgs * 100 if total_msgs > 0 else 0,
    }
    
    if by_day:
        daily_results = {}
        for date, data in sorted(daily_sentiment.items()):
            total = sum([data['positive'], data['negative'], data['neutral']])
            avg = sum(data['scores']) / len(data['scores']) if data['scores'] else 0
            daily_results[date] = {
                'total': total,
                'positive': data['positive'],
                'negative': data['negative'],
                'neutral': data['neutral'],
                'avg_score': avg,
                'frustration': data['frustration']
            }
        result['daily'] = daily_results
    
    print(f"   Sentiment: {result['positive_pct']:.1f}% pos, {result['negative_pct']:.1f}% neg, {result['neutral_pct']:.1f}% neutral")
    print(f"   Average score: {avg_score:+.2f}")
    print(f"   Frustration: {result['frustration_pct']:.1f}% ({result['frustration_messages']} messages)")
    
    return result


def format_output(results: List[Dict]):
    """Format analysis results for display."""
    print(f"\n{'='*80}")
    print("SENTIMENT ANALYSIS RESULTS")
    print(f"{'='*80}\n")
    
    for result in results:
        if not result:
            continue
        
        channel = result['channel']
        total = result['total_messages']
        
        # Emoji for overall sentiment
        avg_score = result['avg_score']
        if avg_score > 0.3:
            mood = "😊 Positive"
        elif avg_score > 0:
            mood = "🙂 Slightly Positive"
        elif avg_score > -0.3:
            mood = "😐 Neutral/Mixed"
        else:
            mood = "😞 Negative"
        
        print(f"📊 {channel}")
        print(f"   Total messages: {total}")
        print(f"   Overall mood: {mood} (score: {avg_score:+.2f})")
        print(f"   ")
        print(f"   Breakdown:")
        print(f"     • Positive: {result['positive']} ({result['positive_pct']:.1f}%)")
        print(f"     • Negative: {result['negative']} ({result['negative_pct']:.1f}%)")
        print(f"     • Neutral:  {result['neutral']} ({result['neutral_pct']:.1f}%)")
        print(f"   ")
        
        # Frustration warning
        frust_pct = result['frustration_pct']
        if frust_pct > 10:
            print(f"   ⚠️  HIGH FRUSTRATION: {result['frustration_messages']} messages ({frust_pct:.1f}%)")
        elif frust_pct > 5:
            print(f"   ⚡ Frustration detected: {result['frustration_messages']} messages ({frust_pct:.1f}%)")
        else:
            print(f"   ✅ Low frustration: {frust_pct:.1f}%")
        
        print()


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Track community sentiment from Telegram conversations"
    )
    parser.add_argument(
        "--channel",
        type=str,
        help="Specific channel to analyze"
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
        "--days",
        type=int,
        help="Analyze last N days (alternative to --start/--end)"
    )
    parser.add_argument(
        "--by-day",
        action="store_true",
        help="Show daily sentiment breakdown"
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Export results to JSON file"
    )
    parser.add_argument(
        "--path",
        type=str,
        default="telegram/conversations",
        help="Path to conversations directory"
    )
    
    args = parser.parse_args()
    
    # Calculate date range if --days provided
    if args.days:
        end_date = datetime.now().strftime("%Y-%m-%d")
        start_date = (datetime.now() - timedelta(days=args.days)).strftime("%Y-%m-%d")
        args.start = start_date
        args.end = end_date
    
    conversations = Path(args.path)
    
    if not conversations.exists():
        print(f"❌ Error: {args.path} does not exist")
        exit(1)
    
    # Find channels
    if args.channel:
        channels = [conversations / args.channel]
        if not channels[0].exists():
            print(f"❌ Error: Channel '{args.channel}' not found")
            exit(1)
    else:
        channels = [d for d in conversations.iterdir() 
                   if d.is_dir() and not d.name.startswith('.') and d.name != 'archive']
    
    print(f"Analyzing {len(channels)} channel(s)")
    if args.start or args.end:
        print(f"Date range: {args.start or 'earliest'} to {args.end or 'latest'}")
    
    # Analyze channels
    results = []
    for channel_dir in sorted(channels):
        result = analyze_channel_sentiment(
            channel_dir,
            start_date=args.start,
            end_date=args.end,
            by_day=args.by_day
        )
        if result:
            results.append(result)
    
    # Display results
    if not args.output:
        format_output(results)
    
    # Export if requested
    if args.output:
        with open(args.output, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"\n✅ Exported results to {args.output}")
    
    print(f"\n{'='*80}")
    print("✅ Sentiment analysis complete")
    print("\nInterpretation:")
    print("  • Score > +0.3: Strong positive sentiment")
    print("  • Score 0 to +0.3: Slightly positive")
    print("  • Score -0.3 to 0: Mixed/neutral")
    print("  • Score < -0.3: Negative sentiment")
    print("  • Frustration > 10%: Action may be needed")
    print(f"{'='*80}\n")
