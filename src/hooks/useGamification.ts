import { useState, useEffect } from 'react';

export interface UserProgress {
  xp: number;
  level: number;
  streak: number;
  lastActionDate: string | null;
  achievements: string[];
}

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];

export function useGamification() {
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    streak: 0,
    lastActionDate: null,
    achievements: []
  });

  useEffect(() => {
    const saved = localStorage.getItem('derma_gamification');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse gamification progress", e);
      }
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    localStorage.setItem('derma_gamification', JSON.stringify(newProgress));
    setProgress(newProgress);
  };

  const addXP = (amount: number) => {
    const newXP = progress.xp + amount;
    let newLevel = progress.level;
    
    // Check for level up
    while (newLevel < LEVEL_THRESHOLDS.length && newXP >= LEVEL_THRESHOLDS[newLevel]) {
      newLevel++;
    }

    const today = new Date().toISOString().split('T')[0];
    let newStreak = progress.streak;

    if (progress.lastActionDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (progress.lastActionDate === yesterdayStr) {
        newStreak++;
      } else {
        newStreak = 1;
      }
    }

    const checkAchievements = (currentXp: number, currentStreak: number) => {
      const newAchievements: string[] = [];
      const existing = new Set(progress.achievements);

      if (currentXp >= 20 && !existing.has('First Steps')) {
        newAchievements.push('First Steps');
      }
      if (currentXp >= 100 && !existing.has('Dedicated Learner')) {
        newAchievements.push('Dedicated Learner');
      }
      if (currentStreak >= 3 && !existing.has('Consistent')) {
        newAchievements.push('Consistent');
      }
      if (currentXp >= 500 && !existing.has('Scholar')) {
        newAchievements.push('Scholar');
      }

      return newAchievements;
    };

    const unlocked = checkAchievements(newXP, newStreak);
    const updatedAchievements = [...progress.achievements, ...unlocked];

    saveProgress({
      ...progress,
      xp: newXP,
      level: newLevel,
      streak: newStreak,
      lastActionDate: today,
      achievements: updatedAchievements
    });

    return { 
      leveledUp: newLevel > progress.level, 
      newLevel,
      newAchievements: unlocked
    };
  };

  const getNextLevelXP = () => {
    return LEVEL_THRESHOLDS[progress.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  };

  const getProgressToNextLevel = () => {
    const currentLevelXP = LEVEL_THRESHOLDS[progress.level - 1];
    const nextLevelXP = getNextLevelXP();
    const levelRange = nextLevelXP - currentLevelXP;
    const progressInLevel = progress.xp - currentLevelXP;
    return (progressInLevel / levelRange) * 100;
  };

  return {
    progress,
    addXP,
    getNextLevelXP,
    getProgressToNextLevel
  };
}
