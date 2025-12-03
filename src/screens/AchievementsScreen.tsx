// src/screens/AchievementsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import DataManager from '../services/DataManager';

export default function AchievementsScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userProfile = await DataManager.getUserProfile();
    const userAchievements = await DataManager.getAchievements();
    setProfile(userProfile);
    setAchievements(userAchievements);
  };

  const unlockedAchievements = achievements.filter((a) => a.isUnlocked);
  const lockedAchievements = achievements.filter((a) => !a.isUnlocked);
  const xpProgress = profile ? (profile.xp % 1000) / 1000 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {profile && (
            <View style={styles.xpContainer}>
              <View style={styles.xpHeader}>
                <Text style={styles.levelText}>Level {profile.level}</Text>
                <Text style={styles.xpText}>{profile.xp % 1000} / 1000 XP</Text>
              </View>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#3B82F6', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: `${xpProgress * 100}%` }]}
                />
              </View>
            </View>
          )}

          {unlockedAchievements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Unlocked 🎉</Text>
              <View style={styles.achievementsGrid}>
                {unlockedAchievements.map((achievement) => (
                  <View key={achievement.id} style={styles.achievementCard}>
                    <View style={[styles.iconCircle, { backgroundColor: '#3B82F620' }]}>
                      <Feather name={achievement.icon as any} size={32} color="#3B82F6" />
                    </View>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDesc}>{achievement.description}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {lockedAchievements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Locked 🔒</Text>
              <View style={styles.achievementsGrid}>
                {lockedAchievements.map((achievement) => (
                  <View key={achievement.id} style={[styles.achievementCard, styles.lockedCard]}>
                    <View style={[styles.iconCircle, { backgroundColor: '#9CA3AF20' }]}>
                      <Feather name={achievement.icon as any} size={32} color="#9CA3AF" />
                    </View>
                    <Text style={[styles.achievementTitle, styles.lockedText]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDesc, styles.lockedText]}>
                      {achievement.description}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {achievements.length === 0 && (
            <View style={styles.emptyContainer}>
              <Feather name={"award" as any} size={64} color="#ccc" />
              <Text style={styles.emptyText}>Start your journey!</Text>
              <Text style={styles.emptySubtext}>Complete sessions to unlock achievements</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  xpContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  xpText: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedCard: {
    opacity: 0.6,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  lockedText: {
    color: '#9CA3AF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});