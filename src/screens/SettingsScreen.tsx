// src/screens/SettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DataManager from '../services/DataManager';
import PremiumPaywall from '../components/PremiumPaywall';

export default function SettingsScreen({ navigation }: any) {
  const [profile, setProfile] = useState<any>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const userProfile = await DataManager.getUserProfile();
    setProfile(userProfile);
  };

  const handlePremiumSuccess = async () => {
    await DataManager.setPremiumStatus(true);
    setShowPaywall(false);
    loadProfile();
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data?',
      'This will delete all your sessions, streaks, and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await DataManager.clearAllData();
            loadProfile();
            Alert.alert('Success', 'All data has been reset');
          },
        },
      ]
    );
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            {/* Premium Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Subscription</Text>
              {!profile.isPremium ? (
                <TouchableOpacity
                  style={styles.premiumCard}
                  onPress={() => setShowPaywall(true)}
                >
                  <View style={styles.premiumContent}>
                    <View style={styles.premiumLeft}>
                      <View style={styles.crownContainer}>
                        <Feather name={"award" as any} size={24} color="#F59E0B" />
                      </View>
                      <View>
                        <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                        <Text style={styles.premiumSubtitle}>
                          Unlock AI features, themes & more
                        </Text>
                      </View>
                    </View>
                    <Feather name={"chevron-right" as any} size={24} color="#666" />
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.premiumActiveCard}>
                  <Feather name={"award" as any} size={24} color="#F59E0B" />
                  <Text style={styles.premiumActiveText}>Premium Active</Text>
                  <Feather name={"check-circle" as any} size={24} color="#10B981" />
                </View>
              )}
            </View>

            {/* Appearance */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Appearance</Text>
              <TouchableOpacity 
                style={styles.linkRow}
                onPress={() => navigation.navigate('ThemeSettings')}
              >
                <Feather name={"droplet" as any} size={20} color="#3B82F6" />
                <Text style={styles.linkLabel}>Themes</Text>
                <Feather name={"chevron-right" as any} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* What's New */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What's New</Text>
              <TouchableOpacity 
                style={styles.linkRow}
                onPress={() => navigation.navigate('ComingSoon')}
              >
                <Feather name={"sparkles" as any} size={20} color="#F59E0B" />
                <Text style={styles.linkLabel}>Coming Soon Features</Text>
                <Feather name={"chevron-right" as any} size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Your Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Stats</Text>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Hours</Text>
                <Text style={styles.statValue}>{profile.totalHours.toFixed(1)}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Sessions</Text>
                <Text style={styles.statValue}>{profile.totalSessions}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Current Streak</Text>
                <Text style={styles.statValue}>{profile.currentStreak} days</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Level</Text>
                <Text style={styles.statValue}>{profile.level}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>XP</Text>
                <Text style={styles.statValue}>{profile.xp}</Text>
              </View>
            </View>

            {/* About */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkText}>Privacy Policy</Text>
                <Feather name={"external-link" as any} size={20} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkText}>Terms of Service</Text>
                <Feather name={"external-link" as any} size={20} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.linkRow}>
                <Text style={styles.linkText}>Support</Text>
                <Feather name={"external-link" as any} size={20} color="#3B82F6" />
              </TouchableOpacity>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Version</Text>
                <Text style={styles.statValue}>1.0.0</Text>
              </View>
            </View>

            {/* Data */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data</Text>
              <TouchableOpacity style={styles.dangerButton} onPress={handleResetData}>
                <Text style={styles.dangerButtonText}>Reset All Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Premium Paywall Modal */}
      <Modal
        visible={showPaywall}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <PremiumPaywall
          onClose={() => setShowPaywall(false)}
          onSuccess={handlePremiumSuccess}
        />
      </Modal>
    </>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#6B7280',
  },
  premiumCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  crownContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  premiumActiveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
  },
  premiumActiveText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    color: '#666',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  linkLabel: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  linkText: {
    fontSize: 16,
    color: '#3B82F6',
  },
  dangerButton: {
    backgroundColor: '#FEE2E2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});