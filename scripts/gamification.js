/**
 * GitHub Profile Gamification System
 * Calculate XP, levels, and achievements based on GitHub activity
 */

const ACHIEVEMENTS = {
  // Commit achievements
  FIRST_COMMIT: { name: "Hello World", xp: 100, icon: "🌟" },
  COMMIT_STREAK_7: { name: "Week Warrior", xp: 250, icon: "🔥" },
  COMMIT_STREAK_30: { name: "Monthly Master", xp: 500, icon: "🏆" },
  COMMIT_STREAK_100: { name: "Century Champion", xp: 1000, icon: "💯" },
  COMMIT_1000: { name: "Commit Machine", xp: 2000, icon: "🤖" },

  // Repository achievements
  FIRST_REPO: { name: "Repository Created", xp: 150, icon: "📦" },
  REPO_10_STARS: { name: "Rising Star", xp: 300, icon: "⭐" },
  REPO_100_STARS: { name: "Shooting Star", xp: 800, icon: "🌠" },
  REPO_1000_STARS: { name: "Supernova", xp: 2500, icon: "💫" },

  // Collaboration achievements
  FIRST_PR: { name: "Contributor", xp: 200, icon: "🤝" },
  PR_MERGED_10: { name: "Team Player", xp: 400, icon: "👥" },
  PR_MERGED_50: { name: "Collaboration Expert", xp: 900, icon: "🎯" },
  ISSUE_CLOSED_25: { name: "Problem Solver", xp: 600, icon: "🔧" },

  // Language achievements
  POLYGLOT_3: { name: "Trilingual", xp: 300, icon: "🗣️" },
  POLYGLOT_5: { name: "Polyglot", xp: 500, icon: "🌍" },
  POLYGLOT_10: { name: "Language Master", xp: 1000, icon: "🎓" },

  // Special achievements
  HACKTOBERFEST: { name: "Hacktoberfest Hero", xp: 750, icon: "🎃" },
  ARCTIC_VAULT: { name: "Arctic Code Vault", xp: 1500, icon: "❄️" },
  GITHUB_SPONSOR: { name: "Open Source Supporter", xp: 500, icon: "💖" },
  README_PROFILE: { name: "Profile Pioneer", xp: 200, icon: "📝" },

  // Data Engineering specific
  PIPELINE_MASTER: { name: "Pipeline Master", xp: 1200, icon: "🚀" },
  DATA_WIZARD: { name: "Data Wizard", xp: 1500, icon: "🧙" },
  KAFKA_KING: { name: "Kafka King", xp: 1000, icon: "👑" },
  CLOUD_ARCHITECT: { name: "Cloud Architect", xp: 1100, icon: "☁️" }
};

class GitHubGamification {
  constructor(username) {
    this.username = username;
    this.stats = {
      commits: 0,
      pullRequests: 0,
      issues: 0,
      stars: 0,
      followers: 0,
      repositories: 0,
      languages: [],
      streakDays: 0
    };
    this.achievements = [];
    this.xp = 0;
    this.level = 1;
  }

  calculateXP() {
    // Base XP calculation
    this.xp =
      this.stats.commits * 10 +
      this.stats.pullRequests * 50 +
      this.stats.issues * 25 +
      this.stats.stars * 20 +
      this.stats.followers * 15 +
      this.stats.repositories * 30;

    // Add achievement XP
    this.achievements.forEach(achievement => {
      this.xp += ACHIEVEMENTS[achievement]?.xp || 0;
    });

    return this.xp;
  }

  calculateLevel() {
    // Every 1000 XP = 1 level, starting at level 1
    this.level = Math.floor(this.xp / 1000) + 1;
    return this.level;
  }

  checkAchievements() {
    const newAchievements = [];

    // Commit achievements
    if (this.stats.commits >= 1 && !this.hasAchievement('FIRST_COMMIT')) {
      newAchievements.push('FIRST_COMMIT');
    }
    if (this.stats.commits >= 1000 && !this.hasAchievement('COMMIT_1000')) {
      newAchievements.push('COMMIT_1000');
    }

    // Streak achievements
    if (this.stats.streakDays >= 7 && !this.hasAchievement('COMMIT_STREAK_7')) {
      newAchievements.push('COMMIT_STREAK_7');
    }
    if (this.stats.streakDays >= 30 && !this.hasAchievement('COMMIT_STREAK_30')) {
      newAchievements.push('COMMIT_STREAK_30');
    }
    if (this.stats.streakDays >= 100 && !this.hasAchievement('COMMIT_STREAK_100')) {
      newAchievements.push('COMMIT_STREAK_100');
    }

    // Repository achievements
    if (this.stats.repositories >= 1 && !this.hasAchievement('FIRST_REPO')) {
      newAchievements.push('FIRST_REPO');
    }
    if (this.stats.stars >= 10 && !this.hasAchievement('REPO_10_STARS')) {
      newAchievements.push('REPO_10_STARS');
    }
    if (this.stats.stars >= 100 && !this.hasAchievement('REPO_100_STARS')) {
      newAchievements.push('REPO_100_STARS');
    }

    // Language achievements
    if (this.stats.languages.length >= 3 && !this.hasAchievement('POLYGLOT_3')) {
      newAchievements.push('POLYGLOT_3');
    }
    if (this.stats.languages.length >= 5 && !this.hasAchievement('POLYGLOT_5')) {
      newAchievements.push('POLYGLOT_5');
    }

    this.achievements.push(...newAchievements);
    return newAchievements;
  }

  hasAchievement(achievementKey) {
    return this.achievements.includes(achievementKey);
  }

  getProgressBar(percentage) {
    const filled = Math.floor(percentage / 2);
    const empty = 50 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }

  getLevelProgress() {
    const currentLevelXP = (this.level - 1) * 1000;
    const nextLevelXP = this.level * 1000;
    const progressXP = this.xp - currentLevelXP;
    const percentage = (progressXP / 1000) * 100;

    return {
      current: progressXP,
      needed: 1000,
      percentage: Math.floor(percentage),
      bar: this.getProgressBar(percentage)
    };
  }

  getTitle() {
    const titles = [
      { level: 1, title: "Code Novice" },
      { level: 5, title: "Script Kiddie" },
      { level: 10, title: "Developer" },
      { level: 15, title: "Senior Developer" },
      { level: 20, title: "Tech Lead" },
      { level: 25, title: "Architect" },
      { level: 30, title: "Principal Engineer" },
      { level: 35, title: "Distinguished Engineer" },
      { level: 40, title: "Engineering Fellow" },
      { level: 42, title: "Data Wizard" },
      { level: 45, title: "Code Sage" },
      { level: 50, title: "Tech Legend" }
    ];

    for (let i = titles.length - 1; i >= 0; i--) {
      if (this.level >= titles[i].level) {
        return titles[i].title;
      }
    }

    return "Code Novice";
  }

  generateStats() {
    this.calculateXP();
    this.calculateLevel();
    this.checkAchievements();

    const progress = this.getLevelProgress();

    return {
      username: this.username,
      level: this.level,
      title: this.getTitle(),
      xp: this.xp,
      levelProgress: progress,
      achievements: this.achievements.map(a => ({
        ...ACHIEVEMENTS[a],
        key: a
      })),
      totalAchievements: this.achievements.length,
      stats: this.stats
    };
  }
}

// Export for use in GitHub Actions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubGamification;
}

// Example usage
const gamification = new GitHubGamification('ireoluwatomide');
gamification.stats = {
  commits: 1250,
  pullRequests: 87,
  issues: 45,
  stars: 234,
  followers: 156,
  repositories: 42,
  languages: ['Python', 'JavaScript', 'Go', 'SQL', 'Scala'],
  streakDays: 127
};

console.log(JSON.stringify(gamification.generateStats(), null, 2));