#!/usr/bin/env python3
"""
Auto-generate daily briefing template from Telegram conversations.

Analyzes yesterday's conversations and creates a structured briefing
with sections for key discussions, questions, sentiment, and action items.
Saves 10-15 minutes per day by automating the boring parts.

Usage:
    # Generate briefing for yesterday
    python telegram/automation/generate_daily_briefing.py
    
    # Specific date
    python telegram/automation/generate_daily_briefing.py --date 2026-04-28
    
    # Include sentiment analysis
    python telegram/automation/generate_daily_briefing.py --with-sentiment
    
    # Save to file
    python telegram/automation/generate_daily_briefing.py --output telegram/briefings/2026-04-30_daily-briefing.md
"""

import json
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Tuple

# Import our analysis tools
sys.path.insert(0, str(Path(__file__).parent.parent))
from analysis.detect_recurring_questions import is_question, extract_questions
from analysis.sentiment_tracker import analyze_sentiment


def load_day_messages(channel_path: Path, date: str) -> List[dict]:
    """Load messages for a specific day."""
    messages = []
    json_file = channel_path / f"{date}-messages.json"
    
    if json_file.exists():
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


def extract_key_topics(messages: List[dict], top_n: int = 5) -> List[Tuple[str, int]]:
    """Extract most discussed topics (simplified keyword extraction)."""
    # Common words to ignore
    stopwords = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
        'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further',
        'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
        'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
        'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',
        'can', 'will', 'just', 'dont', 'should', 'now', 'i', 'you', 'he',
        'she', 'it', 'we', 'they', 'them', 'their', 'what', 'which', 'who',
        'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has',
        'had', 'do', 'does', 'did', 'would', 'could', 'should', 'may', 'might',
        'must', 'shall', 'im', 'ive', 'youre', 'hes', 'shes', 'its', 'were',
        'theyre', 'thats', 'ill', 'this', 'that', 'these', 'those', 'get',
        'got', 'going', 'go', 'goes', 'like', 'theres', 'yes', 'yeah', 'yep',
        'ok', 'okay', 'thanks', 'thank'
    }
    
    # Extract meaningful words (2+ chars)
    word_counts = Counter()
    for msg in messages:
        text = msg.get('msg', '').lower()
        words = text.split()
        for word in words:
            # Clean word
            word = word.strip('.,!?:;()[]{}"\'-')
            if len(word) >= 2 and word not in stopwords and not word.startswith('@'):
                word_counts[word] += 1
    
    return word_counts.most_common(top_n)


def group_by_author(messages: List[dict]) -> Dict[str, int]:
    """Count messages by author."""
    author_counts = Counter()
    for msg in messages:
        author = msg.get('author', 'Unknown')
        if author != 'Unknown':
            author_counts[author] += 1
    return author_counts


def generate_briefing(date: str, 
                     channels: List[Path],
                     with_sentiment: bool = False) -> str:
    """
    Generate daily briefing markdown.
    
    Args:
        date: Date to analyze (YYYY-MM-DD)
        channels: List of channel paths to include
        with_sentiment: Include sentiment analysis section
        
    Returns:
        Markdown formatted briefing
    """
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    day_name = date_obj.strftime("%A")
    
    # Header
    briefing = f"# Daily Briefing — {date_obj.strftime('%B %d, %Y')} ({day_name})\n\n"
    briefing += "**Auto-generated briefing template** — Please review and enhance with human context\n\n"
    briefing += "---\n\n"
    
    # Overall stats
    briefing += "## 📊 Overview\n\n"
    
    total_messages = 0
    total_questions = 0
    total_authors = set()
    all_topics = Counter()
    
    channel_stats = []
    
    for channel_path in channels:
        messages = load_day_messages(channel_path, date)
        
        if not messages:
            continue
        
        # Extract data
        questions = extract_questions(messages)
        authors = group_by_author(messages)
        topics = extract_key_topics(messages, top_n=10)
        
        # Aggregate
        total_messages += len(messages)
        total_questions += len(questions)
        total_authors.update(authors.keys())
        for topic, count in topics:
            all_topics[topic] += count
        
        # Store for per-channel section
        channel_stats.append({
            'name': channel_path.name,
            'messages': len(messages),
            'questions': len(questions),
            'top_authors': authors.most_common(3),
            'topics': topics[:5]
        })
    
    briefing += f"- **Total messages**: {total_messages}\n"
    briefing += f"- **Active participants**: {len(total_authors)}\n"
    briefing += f"- **Questions asked**: {total_questions}\n"
    briefing += f"- **Channels active**: {len([c for c in channel_stats if c['messages'] > 0])}\n\n"
    
    # Top topics
    if all_topics:
        briefing += "### Top Discussion Topics\n\n"
        for topic, count in all_topics.most_common(5):
            briefing += f"- **{topic}** ({count} mentions)\n"
        briefing += "\n"
    
    # Per-channel breakdown
    briefing += "---\n\n## 📱 Channel Breakdown\n\n"
    
    for stats in channel_stats:
        if stats['messages'] == 0:
            continue
        
        briefing += f"### {stats['name']}\n\n"
        briefing += f"- Messages: {stats['messages']}\n"
        briefing += f"- Questions: {stats['questions']}\n"
        
        if stats['top_authors']:
            briefing += f"- Most active: {', '.join([f'{name} ({count})' for name, count in stats['top_authors']])}\n"
        
        if stats['topics']:
            briefing += f"- Topics: {', '.join([topic for topic, _ in stats['topics']])}\n"
        
        briefing += "\n"
    
    # Sentiment section (if requested)
    if with_sentiment:
        briefing += "---\n\n## 😊 Sentiment Analysis\n\n"
        briefing += "[HUMAN: Review sentiment data and add insights]\n\n"
        
        for channel_path in channels:
            messages = load_day_messages(channel_path, date)
            if not messages:
                continue
            
            # Analyze sentiment
            sentiments = {'positive': 0, 'negative': 0, 'neutral': 0, 'scores': []}
            frustration_count = 0
            
            for msg in messages:
                text = msg.get('msg', '')
                if text:
                    sentiment, score, counts = analyze_sentiment(text)
                    sentiments[sentiment] += 1
                    sentiments['scores'].append(score)
                    if counts['frustration'] > 0:
                        frustration_count += 1
            
            if len(sentiments['scores']) > 0:
                total = sentiments['positive'] + sentiments['negative'] + sentiments['neutral']
                avg_score = sum(sentiments['scores']) / len(sentiments['scores'])
                
                mood = "😊 Positive" if avg_score > 0.3 else "😐 Mixed" if avg_score > -0.3 else "😞 Negative"
                
                briefing += f"### {channel_path.name}\n\n"
                briefing += f"- Overall mood: {mood} (score: {avg_score:+.2f})\n"
                briefing += f"- Positive: {sentiments['positive']/total*100:.0f}% | "
                briefing += f"Negative: {sentiments['negative']/total*100:.0f}% | "
                briefing += f"Neutral: {sentiments['neutral']/total*100:.0f}%\n"
                
                if frustration_count > 0:
                    frust_pct = frustration_count / total * 100
                    if frust_pct > 10:
                        briefing += f"- ⚠️  **High frustration**: {frustration_count} messages ({frust_pct:.0f}%)\n"
                    else:
                        briefing += f"- Frustration: {frustration_count} messages ({frust_pct:.0f}%)\n"
                
                briefing += "\n"
    
    # Key discussions section (human to fill)
    briefing += "---\n\n## 💬 Key Discussions\n\n"
    briefing += "[HUMAN: Summarize important conversations and threads]\n\n"
    briefing += "1. **Topic**: [Description]\n"
    briefing += "   - Key points: ...\n"
    briefing += "   - Resolution: ...\n\n"
    briefing += "2. **Topic**: [Description]\n\n"
    
    # Recurring questions
    if total_questions > 10:
        briefing += "---\n\n## ❓ Frequently Asked Questions\n\n"
        briefing += "[HUMAN: Identify recurring questions and provide answers]\n\n"
        briefing += "**Question**: [Common question]\n"
        briefing += "- **Answer**: [Team response or FAQ reference]\n\n"
    
    # Team responses
    briefing += "---\n\n## 👥 Team Responses\n\n"
    briefing += "[HUMAN: Highlight official team communications]\n\n"
    briefing += "- **[Team Member]**: [Key announcement or response]\n"
    briefing += "- **[Team Member]**: [Important clarification]\n\n"
    
    # Action items
    briefing += "---\n\n## ✅ Action Items\n\n"
    briefing += "[HUMAN: List follow-ups needed]\n\n"
    briefing += "- [ ] [Action needed]\n"
    briefing += "- [ ] [Follow-up required]\n"
    briefing += "- [ ] [Issue to investigate]\n\n"
    
    # Footer
    briefing += "---\n\n"
    briefing += f"*Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}*\n"
    briefing += f"*Source: {len(channel_stats)} channels, {total_messages} messages*\n"
    
    return briefing


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Auto-generate daily briefing template from Telegram conversations"
    )
    parser.add_argument(
        "--date",
        type=str,
        help="Date to analyze (YYYY-MM-DD). Default: yesterday"
    )
    parser.add_argument(
        "--with-sentiment",
        action="store_true",
        help="Include sentiment analysis section"
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Output file path (default: print to stdout)"
    )
    parser.add_argument(
        "--path",
        type=str,
        default="telegram/conversations",
        help="Path to conversations directory"
    )
    
    args = parser.parse_args()
    
    # Default to yesterday
    if args.date:
        date = args.date
    else:
        date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    
    conversations = Path(args.path)
    
    if not conversations.exists():
        print(f"❌ Error: {args.path} does not exist")
        exit(1)
    
    # Find all channels
    channels = [d for d in conversations.iterdir() 
               if d.is_dir() and not d.name.startswith('.') and d.name != 'archive']
    
    print(f"Generating briefing for {date}...")
    print(f"Analyzing {len(channels)} channels...")
    
    # Generate briefing
    briefing = generate_briefing(date, channels, with_sentiment=args.with_sentiment)
    
    # Output
    if args.output:
        with open(args.output, 'w') as f:
            f.write(briefing)
        print(f"\n✅ Briefing saved to {args.output}")
    else:
        print("\n" + "="*80)
        print(briefing)
        print("="*80)
    
    print(f"\n✅ Briefing template generated")
    print("\nNext steps:")
    print("  1. Review auto-generated sections")
    print("  2. Fill in [HUMAN: ...] placeholders")
    print("  3. Add specific quotes and context")
    print("  4. Save to telegram/briefings/")
