// src/screens/ComingSoonScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import PremiumPaywall from '../components/PremiumPaywall';

interface Feature {
  icon: string;
  title: string;
  description: string;
  isPremium: boolean;
}

interface VersionRelease {
  version: string;
  title: string;
  releaseDate: string;
  tagline: string;
  color: string[];
  features: Feature[];
}

const ROADMAP: VersionRelease[] = [
  {
    version: 'v1.5',
    title: 'AI Foundation',
    releaseDate: 'Week 2-3 After Launch',
    tagline: 'Your Personal AI Focus Coach',
    color: ['#8B5CF6', '#7C3AED'],
    features: [
      {
        icon: 'zap',
        title: 'AI Focus Coach',
        description: 'Get personalized recommendations based on your task, energy, and past performance',
        isPremium: true,
      },
      {
        icon: 'scissors',
        title: 'AI Task Breakdown',
        description: 'Break large tasks into focused sessions with time estimates and step-by-step plans',
        isPremium: true,
      },
      {
        icon: 'sunrise',
        title: 'AI Daily Check-in',
        description: 'Morning goal setting with personalized time-blocking for your entire day',
        isPremium: true,
      },
      {
        icon: 'message-circle',
        title: 'Mid-Session Encouragement',
        description: 'AI sends motivational messages when you need them most',
        isPremium: true,
      },
      {
        icon: 'trending-up',
        title: 'AI Post-Session Insights',
        description: 'Learn what worked, what didn\'t, and how to improve next time',
        isPremium: true,
      },
    ],
  },
  {
    version: 'v2.0',
    title: 'Calendar & Analytics',
    releaseDate: 'Week 4-5 After Launch',
    tagline: 'Track Progress, Build Habits',
    color: ['#3B82F6', '#2563EB'],
    features: [
      {
        icon: 'calendar',
        title: 'Streak Calendar',
        description: 'Visual calendar showing your daily progress and maintaining streaks',
        isPremium: true,
      },
      {
        icon: 'bell',
        title: 'Smart Push Notifications',
        description: 'Morning reminders, streak alerts, achievement celebrations, and insights',
        isPremium: true,
      },
      {
        icon: 'target',
        title: 'Daily Goals Tracking',
        description: 'Set morning goals, track throughout the day, review in the evening',
        isPremium: true,
      },
      {
        icon: 'bar-chart-2',
        title: 'Advanced Analytics Dashboard',
        description: 'Focus time graphs, category breakdown, best times, and focus score',
        isPremium: true,
      },
      {
        icon: 'file-text',
        title: 'AI Weekly Reports',
        description: 'Personalized insights delivered every Sunday with recommendations',
        isPremium: true,
      },
      {
        icon: 'edit',
        title: 'Session Reflection System',
        description: 'Journal your thoughts after sessions to track what helps you focus',
        isPremium: true,
      },
    ],
  },
  {
    version: 'v2.5',
    title: 'Social & Power Features',
    releaseDate: 'Week 6-8 After Launch',
    tagline: 'Share, Compete, Dominate',
    color: ['#EC4899', '#DB2777'],
    features: [
      {
        icon: 'camera',
        title: 'Progress Sharing',
        description: 'Auto-generate beautiful cards for Instagram, Twitter, and TikTok',
        isPremium: false,
      },
      {
        icon: 'award',
        title: 'Global Leaderboards',
        description: 'Compete with users worldwide on weekly focus challenges',
        isPremium: false,
      },
      {
        icon: 'users',
        title: 'Friend System',
        description: 'Add friends by username, compare streaks, send encouragement',
        isPremium: false,
      },
      {
        icon: 'trophy',
        title: 'Focus Challenges',
        description: 'Weekly and seasonal challenges with exclusive achievement badges',
        isPremium: false,
      },
      {
        icon: 'cloud',
        title: 'Cloud Sync',
        description: 'Seamlessly sync across iPhone, iPad, and Mac with iCloud',
        isPremium: true,
      },
      {
        icon: 'smartphone',
        title: 'Home Screen Widgets',
        description: 'Live timer countdown and streak display on your home screen',
        isPremium: true,
      },
      {
        icon: 'lock',
        title: 'Hardcore Mode',
        description: 'No pause, no exit, 2x XP - for ultimate focus warriors',
        isPremium: true,
      },
      {
        icon: 'download',
        title: 'Session History Export',
        description: 'Export your data as CSV for time tracking and analysis',
        isPremium: true,
      },
    ],
  },
];

export default function ComingSoonScreen() {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Hero Header */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.hero}
          >
            <Feather name={"rocket" as any} size={64} color="white" />
            <Text style={styles.heroTitle}>The Future of FlowState</Text>
            <Text style={styles.heroSubtitle}>
              We're not just a timer. We're building the ultimate focus companion powered by AI.
            </Text>
            <Text style={styles.heroTagline}>
              Premium members get early access to all new features 🚀
            </Text>
          </LinearGradient>

          {/* Premium Early Access Banner */}
          <TouchableOpacity 
            style={styles.earlyAccessBanner}
            onPress={() => setShowPaywall(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F59E0B', '#F97316']}
              style={styles.earlyAccessGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.earlyAccessContent}>
                <View style={styles.earlyAccessLeft}>
                  <Feather name={"star" as any} size={32} color="white" />
                  <View style={styles.earlyAccessText}>
                    <Text style={styles.earlyAccessTitle}>Unlock Early Access</Text>
                    <Text style={styles.earlyAccessSubtitle}>Get new features first as a Premium member</Text>
                  </View>
                </View>
                <Feather name={"arrow-right" as any} size={24} color="white" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Roadmap Sections */}
          {ROADMAP.map((release, releaseIndex) => (
            <View key={releaseIndex} style={styles.releaseSection}>
              {/* Version Header */}
              <LinearGradient
                colors={release.color}
                style={styles.versionHeader}
              >
                <View style={styles.versionHeaderLeft}>
                  <View style={styles.versionBadge}>
                    <Text style={styles.versionBadgeText}>{release.version}</Text>
                  </View>
                  <View style={styles.versionTitleContainer}>
                    <Text style={styles.versionTitle}>{release.title}</Text>
                    <Text style={styles.versionTagline}>{release.tagline}</Text>
                  </View>
                </View>
                <View style={styles.releaseDateBadge}>
                  <Feather name={"clock" as any} size={14} color="white" />
                  <Text style={styles.releaseDateText}>{release.releaseDate}</Text>
                </View>
              </LinearGradient>

              {/* Features */}
              <View style={styles.featuresContainer}>
                {release.features.map((feature, featureIndex) => (
                  <View key={featureIndex} style={styles.featureCard}>
                    <View style={[
                      styles.featureIconContainer,
                      { backgroundColor: release.color[0] + '20' }
                    ]}>
                      <Feather 
                        name={feature.icon as any} 
                        size={24} 
                        color={release.color[0]} 
                      />
                    </View>

                    <View style={styles.featureContent}>
                      <View style={styles.featureHeader}>
                        <Text style={styles.featureTitle}>{feature.title}</Text>
                        {feature.isPremium && (
                          <View style={styles.premiumTag}>
                            <Feather name={"crown" as any} size={12} color="#F59E0B" />
                            <Text style={styles.premiumTagText}>Premium</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.featureDescription}>{feature.description}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Bottom CTA */}
          <View style={styles.bottomCTA}>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={styles.ctaCard}
            >
              <Feather name={"zap" as any} size={48} color="white" />
              <Text style={styles.ctaTitle}>Don't Miss Out!</Text>
              <Text style={styles.ctaSubtitle}>
                Premium members get all these features as they launch - at no extra cost
              </Text>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => setShowPaywall(true)}
              >
                <Text style={styles.ctaButtonText}>Unlock Premium Now</Text>
                <Feather name={"arrow-right" as any} size={20} color="#8B5CF6" />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Have Ideas?</Text>
            <Text style={styles.footerText}>
              We love hearing from our users! Share your feature requests at support@flowstate.app
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Premium Paywall Modal */}
      <Modal
        visible={showPaywall}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <PremiumPaywall
          onClose={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
            // Premium unlocked!
          }}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  hero: {
    padding: 40,
    paddingTop: 60,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  heroTagline: {
    fontSize: 15,
    color: '#FCD34D',
    fontWeight: '600',
    textAlign: 'center',
  },
  earlyAccessBanner: {
    marginHorizontal: 20,
    marginTop: -30,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  earlyAccessGradient: {
    padding: 20,
  },
  earlyAccessContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  earlyAccessLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  earlyAccessText: {
    marginLeft: 16,
    flex: 1,
  },
  earlyAccessTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  earlyAccessSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  releaseSection: {
    marginBottom: 30,
  },
  versionHeader: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  versionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  versionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 12,
  },
  versionBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  versionTitleContainer: {
    flex: 1,
  },
  versionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  versionTagline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  releaseDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  releaseDateText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  featuresContainer: {
    paddingHorizontal: 20,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  premiumTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomCTA: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  ctaCard: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  footer: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});