// src/types/sounds.ts

export type SoundName = 'brownNoise' | 'rain' | 'ocean' | 'forest' | 'fireplace';

export interface Sound {
  id: SoundName;
  name: string;
  fileName: string;
  isPremium: boolean;
  description: string;
  icon: string;
}

export const SOUNDS: Record<SoundName, Sound> = {
  brownNoise: {
    id: 'brownNoise',
    name: 'Brown Noise',
    fileName: 'brown-noise.mp3',
    isPremium: false,
    description: 'Deep, soothing frequency for focus',
    icon: 'radio',
  },
  rain: {
    id: 'rain',
    name: 'Rain',
    fileName: 'rain.mp3',
    isPremium: true,
    description: 'Gentle rainfall ambience',
    icon: 'cloud-rain',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Waves',
    fileName: 'ocean.mp3',
    isPremium: true,
    description: 'Calming ocean waves',
    icon: 'wind',
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    fileName: 'forest.mp3',
    isPremium: true,
    description: 'Peaceful forest ambience',
    icon: 'sun',
  },
  fireplace: {
    id: 'fireplace',
    name: 'Fireplace',
    fileName: 'fireplace.mp3',
    isPremium: true,
    description: 'Crackling fire sounds',
    icon: 'zap',
  },
};