// src/types/index.ts

export enum SessionCategory {
  WORK = 'Work',
  STUDY = 'Study',
  BUSINESS = 'Business',
  READING = 'Reading',
  GYM = 'Gym',
  CREATIVE = 'Creative',
  PERSONAL = 'Personal',
}

export enum TimerMode {
  STANDARD = 'Standard',
  POMODORO_25 = 'Pomodoro 25/5',
  POMODORO_50 = 'Pomodoro 50/10',
  LONG_FOCUS = 'Long Focus',
  CUSTOM = 'Custom',
}

export enum AmbientSound {
  NONE = 'None',
  RAIN = 'Rain',
  COFFEESHOP = 'Coffee Shop',
  LOFI = 'Lo-Fi',
  BROWN_NOISE = 'Brown Noise',
  FIREPLACE = 'Fireplace',
  SPACE = 'Space',
  FOREST = 'Forest',
  OCEAN = 'Ocean',
}

export interface FocusSession {
  id: string;
  category: SessionCategory;
  mode: TimerMode;
  startTime: number; // Unix timestamp
  endTime?: number;
  plannedDuration: number; // seconds
  actualDuration: number; // seconds
  wasCompleted: boolean;
  notes?: string;
}

export interface UserProfile {
  currentStreak: number;
  longestStreak: number;
  totalHours: number;
  totalSessions: number;
  level: number;
  xp: number;
  lastSessionDate?: number; // Unix timestamp
  perfectWeeks: number;
  isDarkMode: boolean;
  selectedTheme: string;
  isPremium: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: number;
  isUnlocked: boolean;
  unlockedDate?: number;
}

export const CATEGORY_ICONS: Record<SessionCategory, string> = {
  [SessionCategory.WORK]: 'briefcase',
  [SessionCategory.STUDY]: 'book',
  [SessionCategory.BUSINESS]: 'trending-up',
  [SessionCategory.READING]: 'book-open',
  [SessionCategory.GYM]: 'activity',
  [SessionCategory.CREATIVE]: 'palette',
  [SessionCategory.PERSONAL]: 'user',
};

export const CATEGORY_COLORS: Record<SessionCategory, string> = {
  [SessionCategory.WORK]: '#3B82F6',
  [SessionCategory.STUDY]: '#8B5CF6',
  [SessionCategory.BUSINESS]: '#10B981',
  [SessionCategory.READING]: '#F59E0B',
  [SessionCategory.GYM]: '#EF4444',
  [SessionCategory.CREATIVE]: '#EC4899',
  [SessionCategory.PERSONAL]: '#06B6D4',
};

export const SOUND_ICONS: Record<AmbientSound, string> = {
  [AmbientSound.NONE]: 'volume-x',
  [AmbientSound.RAIN]: 'cloud-rain',
  [AmbientSound.COFFEESHOP]: 'coffee',
  [AmbientSound.LOFI]: 'music',
  [AmbientSound.BROWN_NOISE]: 'activity',
  [AmbientSound.FIREPLACE]: 'flame',
  [AmbientSound.SPACE]: 'star',
  [AmbientSound.FOREST]: 'tree',
  [AmbientSound.OCEAN]: 'droplet',
};

export const TIMER_DURATIONS: Record<TimerMode, { work: number; break: number }> = {
  [TimerMode.STANDARD]: { work: 3600, break: 0 }, // 1 hour
  [TimerMode.POMODORO_25]: { work: 1500, break: 300 }, // 25/5 min
  [TimerMode.POMODORO_50]: { work: 3000, break: 600 }, // 50/10 min
  [TimerMode.LONG_FOCUS]: { work: 5400, break: 1200 }, // 90/20 min
  [TimerMode.CUSTOM]: { work: 1800, break: 0 }, // 30 min default
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first focus session',
    icon: 'star',
    requirement: 1,
    isUnlocked: false,
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Focus for 1 hour total',
    icon: 'clock',
    requirement: 1,
    isUnlocked: false,
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Focus for 10 hours total',
    icon: 'zap',
    requirement: 10,
    isUnlocked: false,
  },
  {
    id: 'power-user',
    title: 'Power User',
    description: 'Focus for 50 hours total',
    icon: 'battery-charging',
    requirement: 50,
    isUnlocked: false,
  },
  {
    id: 'century',
    title: 'Century',
    description: 'Focus for 100 hours total',
    icon: 'award',
    requirement: 100,
    isUnlocked: false,
  },
  {
    id: 'master',
    title: 'Master',
    description: 'Focus for 500 hours total',
    icon: 'crown',
    requirement: 500,
    isUnlocked: false,
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'flame',
    requirement: 7,
    isUnlocked: false,
  },
  {
    id: 'perfect-week',
    title: 'Perfect Week',
    description: 'Complete at least one session every day for a week',
    icon: 'check-circle',
    requirement: 1,
    isUnlocked: false,
  },
];