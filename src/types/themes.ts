// src/types/themes.ts

export type ThemeName = 'default' | 'deepFocus' | 'studyMode' | 'calmMode';

export interface Theme {
  name: ThemeName;
  displayName: string;
  colors: readonly [string, string, ...string[]];
  isPremium: boolean;
  description: string;
}

export const THEMES: Record<ThemeName, Theme> = {
  default: {
    name: 'default',
    displayName: 'Flow State',
    colors: ['#667eea', '#764ba2'] as const,
    isPremium: false,
    description: 'Classic purple gradient for balanced focus',
  },
  deepFocus: {
    name: 'deepFocus',
    displayName: 'Deep Focus',
    colors: ['#1e3a8a', '#0f172a'] as const,
    isPremium: true,
    description: 'Dark blue to black for intense concentration',
  },
  studyMode: {
    name: 'studyMode',
    displayName: 'Study Mode',
    colors: ['#f97316', '#fbbf24'] as const,
    isPremium: true,
    description: 'Warm orange to yellow for learning sessions',
  },
  calmMode: {
    name: 'calmMode',
    displayName: 'Calm Mode',
    colors: ['#059669', '#14b8a6'] as const,
    isPremium: true,
    description: 'Soft green to teal for relaxed focus',
  },
};