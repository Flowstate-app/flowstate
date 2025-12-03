// src/screens/TimerScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import {
  SessionCategory,
  TimerMode,
  TIMER_DURATIONS,
  CATEGORY_ICONS,
  CATEGORY_COLORS,
  FocusSession,
} from '../types';
import DataManager from '../services/DataManager';
import { useTheme } from '../contexts/ThemeContext';
import SoundPlayer from '../components/SoundPlayer';

const { width } = Dimensions.get('window');

// Category gradient colors
const CATEGORY_GRADIENTS: Record<SessionCategory, readonly [string, string, ...string[]]> = {
  [SessionCategory.WORK]: ['#3B82F6', '#2563EB'] as const,
  [SessionCategory.STUDY]: ['#8B5CF6', '#7C3AED'] as const,
  [SessionCategory.BUSINESS]: ['#059669', '#047857'] as const,
  [SessionCategory.READING]: ['#F59E0B', '#D97706'] as const,
  [SessionCategory.GYM]: ['#EF4444', '#DC2626'] as const,
  [SessionCategory.CREATIVE]: ['#EC4899', '#DB2777'] as const,
  [SessionCategory.PERSONAL]: ['#06B6D4', '#0891B2'] as const,
};

export default function TimerScreen() {
  const { themeColors } = useTheme();
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(SessionCategory.WORK);
  const [selectedMode, setSelectedMode] = useState(TimerMode.STANDARD);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showCustomTimer, setShowCustomTimer] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('25');
  const [showPaywall, setShowPaywall] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused]);

  const loadProfile = async () => {
    const userProfile = await DataManager.getUserProfile();
    setProfile(userProfile);
  };

  const startTimer = (category: SessionCategory, mode: TimerMode, customDuration?: number) => {
    const duration = customDuration || TIMER_DURATIONS[mode].work;
    
    setTotalDuration(duration);
    setTimeRemaining(duration);
    setSelectedCategory(category);
    setSelectedMode(mode);
    setIsRunning(true);
    setIsPaused(false);

    setCurrentSession({
      id: Date.now().toString(),
      category,
      mode,
      startTime: Date.now(),
      plannedDuration: duration,
      actualDuration: 0,
      wasCompleted: false,
    });
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = async (completed: boolean) => {
    if (currentSession) {
      const elapsedTime = totalDuration - timeRemaining;
      const session: FocusSession = {
        ...currentSession,
        actualDuration: elapsedTime,
        endTime: Date.now(),
        wasCompleted: completed,
      };

      await DataManager.addSession(session);
      await loadProfile();
    }

    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(0);
    setTotalDuration(0);
    setCurrentSession(null);
  };

  const completeSession = () => {
    stopTimer(true);
    Alert.alert('🎉 Session Complete!', 'Great job! You completed your focus session.');
  };

  const handleStopPress = () => {
    Alert.alert(
      'End Session?',
      'Ending early will reduce XP earned. Are you sure?',
      [
        { text: 'Keep Going', style: 'cancel' },
        { text: 'End Session', style: 'destructive', onPress: () => stopTimer(false) },
      ]
    );
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalDuration > 0 ? (totalDuration - timeRemaining) / totalDuration : 0;

  return (
    <LinearGradient colors={themeColors} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {profile && (
            <View style={styles.streakContainer}>
              <View style={styles.streakCard}>
                <Feather name={"flame" as any} size={24} color="#F59E0B" />
                <Text style={styles.streakValue}>{profile.currentStreak}</Text>
                <Text style={styles.streakLabel}>Day Streak</Text>
              </View>
              <View style={styles.streakCard}>
                <Feather name={"star" as any} size={24} color="#F59E0B" />
                <Text style={styles.streakValue}>Lv {profile.level}</Text>
                <Text style={styles.streakLabel}>Level</Text>
              </View>
              <View style={styles.streakCard}>
                <Feather name={"clock" as any} size={24} color="#F59E0B" />
                <Text style={styles.streakValue}>{Math.floor(profile.totalHours)}h</Text>
                <Text style={styles.streakLabel}>Total</Text>
              </View>
            </View>
          )}

          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <View style={styles.timerContent}>
                <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                {isRunning && (
                  <Text style={styles.categoryText}>{selectedCategory}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Ambient Sounds - ALWAYS VISIBLE */}
          <View style={styles.soundPlayerContainer}>
            <Text style={styles.sectionTitle}>🎵 Ambient Sounds</Text>
            <SoundPlayer 
              isPremium={profile?.isPremium || false}
              onUpgradePress={() => setShowPaywall(true)}
            />
          </View>

          <View style={styles.controlsContainer}>
            {!isRunning ? (
              <>
                {/* Category Selector */}
                <Text style={styles.sectionTitle}>Select Category</Text>
                <View style={styles.categoryGrid}>
                  {Object.values(SessionCategory).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryCard,
                        selectedCategory === category && styles.categoryCardSelected,
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <LinearGradient
                        colors={CATEGORY_GRADIENTS[category]}
                        style={styles.categoryCardGradient}
                      >
                        <Feather name={CATEGORY_ICONS[category] as any} size={24} color="white" />
                        <Text style={styles.categoryCardText}>{category}</Text>
                        {selectedCategory === category && (
                          <View style={styles.selectedBadge}>
                            <Feather name={"check" as any} size={16} color="white" />
                          </View>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Quick Presets */}
                <Text style={styles.sectionTitle}>Quick Start</Text>
                <View style={styles.quickStartRow}>
                  <TouchableOpacity style={styles.quickButton} onPress={() => startTimer(selectedCategory, TimerMode.CUSTOM, 5 * 60)}>
                    <Text style={styles.quickButtonText}>5m</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickButton} onPress={() => startTimer(selectedCategory, TimerMode.CUSTOM, 15 * 60)}>
                    <Text style={styles.quickButtonText}>15m</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickButton} onPress={() => startTimer(selectedCategory, TimerMode.POMODORO_25)}>
                    <Text style={styles.quickButtonText}>25m</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.quickButton} onPress={() => startTimer(selectedCategory, TimerMode.POMODORO_50)}>
                    <Text style={styles.quickButtonText}>50m</Text>
                  </TouchableOpacity>
                </View>

                {/* Sleep Timer */}
                <Text style={styles.sectionTitle}>💤 Sleep Timer</Text>
                <View style={styles.sleepTimerRow}>
                  <TouchableOpacity 
                    style={styles.sleepButton} 
                    onPress={() => startTimer(selectedCategory, TimerMode.CUSTOM, 20 * 60)}
                  >
                    <Text style={styles.sleepButtonText}>20m</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.sleepButton} 
                    onPress={() => startTimer(selectedCategory, TimerMode.CUSTOM, 30 * 60)}
                  >
                    <Text style={styles.sleepButtonText}>30m</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.sleepButton} 
                    onPress={() => startTimer(selectedCategory, TimerMode.CUSTOM, 45 * 60)}
                  >
                    <Text style={styles.sleepButtonText}>45m</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.sleepButton} 
                    onPress={() => startTimer(selectedCategory, TimerMode.CUSTOM, 60 * 60)}
                  >
                    <Text style={styles.sleepButtonText}>60m</Text>
                  </TouchableOpacity>
                </View>

                {/* Custom Time */}
                <TouchableOpacity 
                  style={styles.customTimeButton}
                  onPress={() => setShowCustomTimer(true)}
                >
                  <Feather name={"edit-3" as any} size={20} color="#3B82F6" />
                  <Text style={styles.customTimeText}>Custom Time</Text>
                </TouchableOpacity>

                {/* Start Button */}
                <TouchableOpacity 
                  style={styles.startButton}
                  onPress={() => startTimer(selectedCategory, selectedMode)}
                >
                  <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.startButtonGradient}>
                    <Text style={styles.startButtonText}>Start Focus Session</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.timerControlsRow}>
                <TouchableOpacity 
                  style={[styles.controlButton, { backgroundColor: '#3B82F6' }]}
                  onPress={isPaused ? resumeTimer : pauseTimer}
                >
                  <Feather name={isPaused ? ("play" as any) : ("pause" as any)} size={30} color="white" />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.controlButton, { backgroundColor: '#EF4444' }]}
                  onPress={handleStopPress}
                >
                  <Feather name={"square" as any} size={30} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Custom Timer Modal */}
          <Modal visible={showCustomTimer} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Custom Timer</Text>
                <Text style={styles.modalSubtitle}>Enter duration in minutes (1-240)</Text>
                
                <TextInput
                  style={styles.timeInput}
                  value={customMinutes}
                  onChangeText={setCustomMinutes}
                  keyboardType="number-pad"
                  placeholder="25"
                  maxLength={3}
                />

                <View style={styles.quickCustomRow}>
                  <TouchableOpacity 
                    style={styles.quickCustomButton}
                    onPress={() => setCustomMinutes('90')}
                  >
                    <Text style={styles.quickCustomText}>90 min</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickCustomButton}
                    onPress={() => setCustomMinutes('120')}
                  >
                    <Text style={styles.quickCustomText}>2 hours</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickCustomButton}
                    onPress={() => setCustomMinutes('180')}
                  >
                    <Text style={styles.quickCustomText}>3 hours</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity 
                  style={styles.startCustomButton}
                  onPress={() => {
                    const minutes = parseInt(customMinutes);
                    if (minutes > 0 && minutes <= 240) {
                      startTimer(selectedCategory, TimerMode.CUSTOM, minutes * 60);
                      setShowCustomTimer(false);
                    } else {
                      Alert.alert('Invalid Time', 'Please enter a duration between 1 and 240 minutes');
                    }
                  }}
                >
                  <Text style={styles.startCustomText}>Start Timer</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalCloseButton}
                  onPress={() => setShowCustomTimer(false)}
                >
                  <Text style={styles.modalCloseText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  streakCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  streakValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  streakLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  timerCircle: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 12,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  timerContent: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  categoryText: {
    fontSize: 16,
    color: 'white',
    marginTop: 8,
  },
  soundPlayerContainer: {
    marginBottom: 20,
  },
  controlsContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    marginTop: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 15,
    overflow: 'hidden',
  },
  categoryCardSelected: {
    borderWidth: 3,
    borderColor: 'white',
  },
  categoryCardGradient: {
    padding: 16,
    alignItems: 'center',
    position: 'relative',
  },
  categoryCardText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickStartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sleepTimerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sleepButton: {
    flex: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.4)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  sleepButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  customTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  customTimeText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  startButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  startButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerControlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  timeInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  quickCustomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  quickCustomButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  quickCustomText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  startCustomButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  startCustomText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});