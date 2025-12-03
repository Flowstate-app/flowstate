// src/services/DataManager.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FocusSession,
  UserProfile,
  Achievement,
  DEFAULT_ACHIEVEMENTS,
  SessionCategory,
} from '../types';

const KEYS = {
  USER_PROFILE: '@flowstate:userProfile',
  SESSIONS: '@flowstate:sessions',
  ACHIEVEMENTS: '@flowstate:achievements',
};

class DataManager {
  private static instance: DataManager;

  private constructor() {}

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // User Profile Methods
  async getUserProfile(): Promise<UserProfile> {
    try {
      const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }

    // Return default profile
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalHours: 0,
      totalSessions: 0,
      level: 1,
      xp: 0,
      perfectWeeks: 0,
      isDarkMode: false,
      selectedTheme: 'default',
      isPremium: false,
    };
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  async updateStreak(profile: UserProfile): Promise<UserProfile> {
    const now = Date.now();
    const today = new Date(now).setHours(0, 0, 0, 0);

    if (profile.lastSessionDate) {
      const lastSessionDay = new Date(profile.lastSessionDate).setHours(0, 0, 0, 0);
      const daysDifference = Math.floor((today - lastSessionDay) / (1000 * 60 * 60 * 24));

      if (daysDifference === 0) {
        // Same day, no change
        return profile;
      } else if (daysDifference === 1) {
        // Consecutive day
        profile.currentStreak += 1;
        if (profile.currentStreak > profile.longestStreak) {
          profile.longestStreak = profile.currentStreak;
        }
      } else {
        // Missed days, reset
        profile.currentStreak = 1;
      }
    } else {
      // First session ever
      profile.currentStreak = 1;
      profile.longestStreak = 1;
    }

    profile.lastSessionDate = now;
    await this.saveUserProfile(profile);
    return profile;
  }

  async addXP(profile: UserProfile, amount: number): Promise<UserProfile> {
    profile.xp += amount;
    const newLevel = Math.floor(profile.xp / 1000) + 1;
    if (newLevel > profile.level) {
      profile.level = newLevel;
    }
    await this.saveUserProfile(profile);
    return profile;
  }

  // Session Methods
  async getSessions(): Promise<FocusSession[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SESSIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
    return [];
  }

  async saveSessions(sessions: FocusSession[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  }

  async addSession(session: FocusSession): Promise<void> {
    const sessions = await this.getSessions();
    sessions.unshift(session); // Add to beginning
    await this.saveSessions(sessions);

    // Update user profile
    let profile = await this.getUserProfile();
    profile.totalSessions += 1;
    profile.totalHours += session.actualDuration / 3600;
    profile = await this.updateStreak(profile);

    // Add XP (1 XP per minute)
    const xpEarned = Math.floor(session.actualDuration / 60);
    await this.addXP(profile, xpEarned);

    // Check achievements
    await this.checkAchievements(profile);
  }

  // Analytics Methods
  async getSessionsForDate(date: Date): Promise<FocusSession[]> {
    const sessions = await this.getSessions();
    const targetDay = new Date(date).setHours(0, 0, 0, 0);

    return sessions.filter((session) => {
      const sessionDay = new Date(session.startTime).setHours(0, 0, 0, 0);
      return sessionDay === targetDay;
    });
  }

  async getSessionsForWeek(weekStart: Date): Promise<FocusSession[]> {
    const sessions = await this.getSessions();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return sessions.filter((session) => {
      const sessionTime = session.startTime;
      return sessionTime >= weekStart.getTime() && sessionTime < weekEnd.getTime();
    });
  }

  async getTotalFocusTime(date: Date): Promise<number> {
    const sessions = await this.getSessionsForDate(date);
    return sessions.reduce((total, session) => total + session.actualDuration, 0);
  }

  async getSessionsByCategory(): Promise<Record<SessionCategory, FocusSession[]>> {
    const sessions = await this.getSessions();
    const grouped: Record<SessionCategory, FocusSession[]> = {} as any;

    sessions.forEach((session) => {
      if (!grouped[session.category]) {
        grouped[session.category] = [];
      }
      grouped[session.category].push(session);
    });

    return grouped;
  }

  async getAveragSessionLength(): Promise<number> {
    const sessions = await this.getSessions();
    if (sessions.length === 0) return 0;

    const total = sessions.reduce((sum, session) => sum + session.actualDuration, 0);
    return total / sessions.length;
  }

  // Achievement Methods
  async getAchievements(): Promise<Achievement[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.ACHIEVEMENTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
    return DEFAULT_ACHIEVEMENTS;
  }

  async saveAchievements(achievements: Achievement[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    } catch (error) {
      console.error('Error saving achievements:', error);
    }
  }

  async checkAchievements(profile: UserProfile): Promise<void> {
    const achievements = await this.getAchievements();
    let updated = false;

    achievements.forEach((achievement) => {
      if (!achievement.isUnlocked) {
        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first-step':
            shouldUnlock = profile.totalSessions >= 1;
            break;
          case 'getting-started':
            shouldUnlock = profile.totalHours >= 1;
            break;
          case 'dedicated':
            shouldUnlock = profile.totalHours >= 10;
            break;
          case 'power-user':
            shouldUnlock = profile.totalHours >= 50;
            break;
          case 'century':
            shouldUnlock = profile.totalHours >= 100;
            break;
          case 'master':
            shouldUnlock = profile.totalHours >= 500;
            break;
          case 'week-warrior':
            shouldUnlock = profile.currentStreak >= 7;
            break;
          case 'perfect-week':
            shouldUnlock = profile.perfectWeeks >= 1;
            break;
        }

        if (shouldUnlock) {
          achievement.isUnlocked = true;
          achievement.unlockedDate = Date.now();
          updated = true;
        }
      }
    });

    if (updated) {
      await this.saveAchievements(achievements);
    }
  }

  // Settings Methods
  async toggleDarkMode(): Promise<void> {
    const profile = await this.getUserProfile();
    profile.isDarkMode = !profile.isDarkMode;
    await this.saveUserProfile(profile);
  }

  async updateTheme(theme: string): Promise<void> {
    const profile = await this.getUserProfile();
    profile.selectedTheme = theme;
    await this.saveUserProfile(profile);
  }

  async setPremiumStatus(isPremium: boolean): Promise<void> {
    const profile = await this.getUserProfile();
    profile.isPremium = isPremium;
    await this.saveUserProfile(profile);
  }

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        KEYS.USER_PROFILE,
        KEYS.SESSIONS,
        KEYS.ACHIEVEMENTS,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export default DataManager.getInstance();