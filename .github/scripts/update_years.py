#!/usr/bin/env python3
"""
Auto-update years of experience in README.md
"""

from datetime import datetime
import re

# Configuration
START_DATE = datetime(2020, 1, 1)  # Change this to your actual start date
README_PATH = "README.md"

def calculate_years():
    """Calculate years of experience from start date to now"""
    current_date = datetime.now()
    years = current_date.year - START_DATE.year

    # Adjust if birthday hasn't occurred this year
    if (current_date.month, current_date.day) < (START_DATE.month, START_DATE.day):
        years -= 1

    return years

def update_readme():
    """Update README.md with current years of experience"""
    years = calculate_years()

    with open(README_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match: <!--YEARS_START-->X+<!--YEARS_END-->
    # This will replace the number between the markers
    pattern = r'<!--YEARS_START-->\d+\+<!--YEARS_END-->'
    replacement = f'<!--YEARS_START-->{years}+<!--YEARS_END-->'

    updated_content = re.sub(pattern, replacement, content)

    # Check if pattern was found and replaced
    if updated_content != content:
        with open(README_PATH, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        print(f"✅ Updated years of experience to {years}+")
    else:
        print("⚠️  No changes made - markers not found in README.md")
        print("Make sure your README contains: <!--YEARS_START-->X+<!--YEARS_END-->")

if __name__ == "__main__":
    update_readme()
