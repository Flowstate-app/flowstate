// src/components/SoundPlayer.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SOUNDS, SoundName } from '../types/sounds';

// Static sound file mapping
const SOUND_FILES: Record<SoundName, any> = {
  brownNoise: require('../../assets/brown-noise.mp3'),
  rain: require('../../assets/rain.mp3'),
  ocean: require('../../assets/ocean.mp3'),
  forest: require('../../assets/forest.mp3'),
  fireplace: require('../../assets/fireplace.mp3'),
};

// Sound color schemes
const SOUND_COLORS: Record<SoundName, { gradient: readonly [string, string, ...string[]]; bg: string }> = {
  brownNoise: { gradient: ['#78350F', '#451A03'] as const, bg: '#FEF3C7' },
  rain: { gradient: ['#1E40AF', '#1E3A8A'] as const, bg: '#DBEAFE' },
  ocean: { gradient: ['#0891B2', '#0E7490'] as const, bg: '#CFFAFE' },
  forest: { gradient: ['#15803D', '#166534'] as const, bg: '#D1FAE5' },
  fireplace: { gradient: ['#DC2626', '#B91C1C'] as const, bg: '#FEE2E2' },
};

interface Props {
  isPremium: boolean;
  onUpgradePress: () => void;
}

export default function SoundPlayer({ isPremium, onUpgradePress }: Props) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState<SoundName | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    // Enable audio in background and prevent interruption
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          interruptionModeIOS: 1, // Do not mix with others
          interruptionModeAndroid: 1, // Do not mix
        });
      } catch (error) {
        console.error('Error setting audio mode:', error);
      }
    };
    
    setupAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const playSound = async (soundName: SoundName) => {
    try {
      console.log('🎵 Playing sound:', soundName);
      
      // Stop current sound if playing
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      const soundData = SOUNDS[soundName];
      
      // Check if premium required
      if (soundData.isPremium && !isPremium) {
        console.log('🔒 Sound is premium, showing upgrade');
        onUpgradePress();
        return;
      }

      console.log('📂 Loading sound file:', soundData.fileName);

      // Load and play new sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        SOUND_FILES[soundName],
        { 
          shouldPlay: true, 
          isLooping: true, 
          volume: 1.0 // Full volume
        }
      );

      console.log('✅ Sound loaded and playing');

      // Keep sound playing even when screen changes
      await newSound.setIsLoopingAsync(true);

      setSound(newSound);
      setCurrentSound(soundName);
      setIsPlaying(true);
      setShowPicker(false);
    } catch (error) {
      console.error('❌ Error playing sound:', error);
      Alert.alert('Error', 'Could not play sound. Please try again.');
    }
  };

  const stopSound = async () => {
    console.log('⏹️ Stopping sound');
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
      setCurrentSound(null);
      console.log('✅ Sound stopped');
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.soundButton}
        onPress={() => setShowPicker(true)}
      >
        {currentSound ? (
          <LinearGradient
            colors={SOUND_COLORS[currentSound].gradient}
            style={styles.soundButtonGradient}
          >
            <Feather name={"music" as any} size={20} color="white" />
            <Text style={styles.soundButtonTextActive}>{SOUNDS[currentSound].name}</Text>
            {isPlaying && <Feather name={"volume-2" as any} size={20} color="white" />}
          </LinearGradient>
        ) : (
          <View style={styles.soundButtonDefault}>
            <Feather name={"music" as any} size={20} color="#3B82F6" />
            <Text style={styles.soundButtonText}>Select Ambient Sound</Text>
            <Feather name={"chevron-down" as any} size={20} color="#666" />
          </View>
        )}
      </TouchableOpacity>

      {isPlaying && (
        <TouchableOpacity style={styles.stopButton} onPress={stopSound}>
          <Feather name={"volume-x" as any} size={20} color="#EF4444" />
          <Text style={styles.stopButtonText}>Stop Sound</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showPicker} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ambient Sounds</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Feather name={"x" as any} size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {(Object.keys(SOUNDS) as SoundName[]).map((soundName) => {
                const soundData = SOUNDS[soundName];
                const colors = SOUND_COLORS[soundName];
                const isLocked = soundData.isPremium && !isPremium;
                const isActive = currentSound === soundName;

                return (
                  <TouchableOpacity
                    key={soundName}
                    style={[
                      styles.soundOption,
                      isActive && styles.soundOptionActive,
                    ]}
                    onPress={() => playSound(soundName)}
                    disabled={isLocked}
                  >
                    <LinearGradient
                      colors={colors.gradient}
                      style={styles.soundIconContainer}
                    >
                      <Feather
                        name={soundData.icon as any}
                        size={28}
                        color="white"
                      />
                      {isLocked && (
                        <View style={styles.lockIconOverlay}>
                          <Feather name={"lock" as any} size={16} color="white" />
                        </View>
                      )}
                    </LinearGradient>
                    <View style={styles.soundInfo}>
                      <Text
                        style={[
                          styles.soundName,
                          isLocked && styles.soundNameLocked,
                        ]}
                      >
                        {soundData.name}
                      </Text>
                      <Text
                        style={[
                          styles.soundDescription,
                          isLocked && styles.soundDescriptionLocked,
                        ]}
                      >
                        {soundData.description}
                      </Text>
                    </View>
                    {isLocked ? (
                      <View style={styles.lockBadge}>
                        <Feather name={"lock" as any} size={14} color="#F59E0B" />
                        <Text style={styles.lockBadgeText}>Pro</Text>
                      </View>
                    ) : isActive ? (
                      <View style={styles.playingBadge}>
                        <Feather name={"volume-2" as any} size={20} color="#10B981" />
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {!isPremium && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => {
                  setShowPicker(false);
                  onUpgradePress();
                }}
              >
                <Text style={styles.upgradeButtonText}>
                  Unlock All Sounds with Premium
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  soundButton: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  soundButtonDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
  },
  soundButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
  },
  soundButtonText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  soundButtonTextActive: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
  },
  stopButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  soundOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
  },
  soundOptionActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  soundIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  lockIconOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 4,
  },
  soundInfo: {
    flex: 1,
  },
  soundName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  soundNameLocked: {
    color: '#9CA3AF',
  },
  soundDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  soundDescriptionLocked: {
    color: '#D1D5DB',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lockBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F59E0B',
  },
  playingBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});