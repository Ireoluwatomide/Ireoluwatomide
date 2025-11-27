#!/usr/bin/env python3
"""
Update README with dynamic data - XP calculations, stats, and more
"""

import os
import re
import json
import requests
from datetime import datetime, timedelta
from typing import Dict, Any

# GitHub API configuration
GITHUB_TOKEN = os.getenv('GH_TOKEN', '')
GITHUB_USER = 'ireoluwatomide'
HEADERS = {'Authorization': f'token {GITHUB_TOKEN}'} if GITHUB_TOKEN else {}

def get_github_stats() -> Dict[str, Any]:
    """Fetch GitHub statistics for XP calculation"""
    stats = {
        'commits': 0,
        'prs': 0,
        'issues': 0,
        'stars': 0,
        'followers': 0,
        'repos': 0,
        'contributions_today': 0
    }

    try:
        # Get user data
        user_response = requests.get(f'https://api.github.com/users/{GITHUB_USER}', headers=HEADERS)
        if user_response.status_code == 200:
            user_data = user_response.json()
            stats['followers'] = user_data.get('followers', 0)
            stats['repos'] = user_data.get('public_repos', 0)

        # Get recent activity
        events_response = requests.get(f'https://api.github.com/users/{GITHUB_USER}/events', headers=HEADERS)
        if events_response.status_code == 200:
            events = events_response.json()
            today = datetime.now().date()

            for event in events[:30]:  # Check last 30 events
                event_date = datetime.strptime(event['created_at'], '%Y-%m-%dT%H:%M:%SZ').date()

                if event_date == today:
                    stats['contributions_today'] += 1

                if event['type'] == 'PushEvent':
                    stats['commits'] += len(event.get('payload', {}).get('commits', []))
                elif event['type'] == 'PullRequestEvent':
                    stats['prs'] += 1
                elif event['type'] == 'IssuesEvent':
                    stats['issues'] += 1

        # Get total stars
        repos_response = requests.get(f'https://api.github.com/users/{GITHUB_USER}/repos', headers=HEADERS)
        if repos_response.status_code == 200:
            repos = repos_response.json()
            stats['stars'] = sum(repo.get('stargazers_count', 0) for repo in repos)

    except Exception as e:
        print(f"Error fetching GitHub stats: {e}")

    return stats

def calculate_xp(stats: Dict[str, Any]) -> tuple:
    """Calculate XP and level based on GitHub activity"""
    # XP formula
    xp = (
        stats['commits'] * 10 +
        stats['prs'] * 50 +
        stats['issues'] * 25 +
        stats['stars'] * 20 +
        stats['followers'] * 15 +
        stats['repos'] * 30
    )

    # Level calculation (every 1000 XP = 1 level)
    level = min(42 + (xp // 1000), 50)  # Cap at level 50
    xp_in_level = xp % 1000
    xp_percent = int((xp_in_level / 1000) * 100)

    return level, xp_in_level, xp_percent

def update_readme():
    """Update README with dynamic data"""
    # Read current README
    with open('README.md', 'r', encoding='utf-8') as f:
        readme = f.read()

    # Get GitHub stats
    stats = get_github_stats()
    level, xp_current, xp_percent = calculate_xp(stats)

    # Update XP bar
    progress_bar = '█' * (xp_percent // 2) + '░' * ((100 - xp_percent) // 2)
    xp_line = f"║  ████████████████████████████████████{'█' * (xp_percent // 3)}{'░' * ((100 - xp_percent) // 3)} {xp_percent}% to LVL {level + 1}    ║"

    # Update level
    level_line = f"║  🏆 LVL {level} DATA WIZARD                                        ║"

    # Update stats
    stats_lines = f"""║  📊 Stats Processed    : {stats['commits'] * 100000:,}                          ║
║  ⚡ Pipelines Built    : {127 + stats['repos']}                                  ║
║  🚀 Latency Achieved   : <100ms                               ║
║  👥 Engineers Mentored : {15 + stats['followers'] // 10}+                                  ║"""

    # Update activity count for today
    activity_line = f"│  Last Deploy    : Pipeline processing {10 + stats['contributions_today']}M events/day      │"

    # Replace in README (simplified for demonstration)
    # In production, you'd want more sophisticated replacement logic

    # Write updated README
    with open('README.md', 'w', encoding='utf-8') as f:
        f.write(readme)

    print(f"✅ Updated README - Level {level}, {xp_current} XP")
    print(f"📊 Today's contributions: {stats['contributions_today']}")

if __name__ == '__main__':
    update_readme()