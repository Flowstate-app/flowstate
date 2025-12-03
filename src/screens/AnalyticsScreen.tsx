// src/screens/AnalyticsScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DataManager from '../services/DataManager';

export default function AnalyticsScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userProfile = await DataManager.getUserProfile();
    const allSessions = await DataManager.getSessions();
    setProfile(userProfile);
    setSessions(allSessions);
  };

  const avgSessionLength = sessions.length > 0
    ? sessions.reduce((sum: number, s: any) => sum + s.actualDuration, 0) / sessions.length
    : 0;

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Feather name={"clock" as any} size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{profile ? profile.totalHours.toFixed(1) : '0'}</Text>
              <Text style={styles.statTitle}>Total Hours</Text>
            </View>
            
            <View style={styles.statCard}>
              <Feather name={"check-circle" as any} size={24} color="#10B981" />
              <Text style={styles.statValue}>{profile ? profile.totalSessions : '0'}</Text>
              <Text style={styles.statTitle}>Sessions</Text>
            </View>
            
            <View style={styles.statCard}>
              <Feather name={"bar-chart-2" as any} size={24} color="#F59E0B" />
              <Text style={styles.statValue}>{formatDuration(avgSessionLength)}</Text>
              <Text style={styles.statTitle}>Avg Length</Text>
            </View>
            
            <View style={styles.statCard}>
              <Feather name={"flame" as any} size={24} color="#EF4444" />
              <Text style={styles.statValue}>{profile ? profile.longestStreak : '0'}</Text>
              <Text style={styles.statTitle}>Best Streak</Text>
            </View>
          </View>

          {sessions.length === 0 && (
            <View style={styles.emptyContainer}>
              <Feather name={"bar-chart-2" as any} size={64} color="#ccc" />
              <Text style={styles.emptyText}>No sessions yet!</Text>
              <Text style={styles.emptySubtext}>Complete a focus session to see your stats</Text>
            </View>
          )}

          {sessions.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Sessions</Text>
              {sessions.slice(0, 10).map((session) => (
                <View key={session.id} style={styles.sessionRow}>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionCategory}>{session.category}</Text>
                    <Text style={styles.sessionDate}>
                      {new Date(session.startTime).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.sessionRight}>
                    <Text style={styles.sessionDuration}>
                      {formatDuration(session.actualDuration)}
                    </Text>
                    {session.wasCompleted && (
                      <Feather name={"check-circle" as any} size={16} color="#10B981" />
                    )}
                  </View>
                </View>
              ))}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
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
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionCategory: {
    fontSize: 16,
    fontWeight: '600',
  },
  sessionDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  sessionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionDuration: {
    fontSize: 16,
    fontWeight: '600',
  },
});