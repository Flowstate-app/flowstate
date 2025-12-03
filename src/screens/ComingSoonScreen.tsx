// src/screens/ComingSoonScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface Feature {
  icon: string;
  title: string;
  description: string;
  version: string;
  isPremium: boolean;
  color: string[];
}

const COMING_FEATURES: Feature[] = [
  {
    icon: 'zap',
    title: 'AI Focus Coach',
    description: 'Get personalized focus recommendations based on your task, energy level, and past performance',
    version: 'v1.1',
    isPremium: true,
    color: ['#8B5CF6', '#7C3AED'],
  },
  {
    icon: 'brain',
    title: 'AI Task Breakdown',
    description: 'Break large tasks into smaller focus sessions with time estimates and step-by-step plans',
    version: 'v1.1',
    isPremium: true,
    color: ['#EC4899', '#DB2777'],
  },
  {
    icon: 'clipboard',
    title: 'AI Daily Planner',
    description: 'Morning check-in creates a personalized time-blocked schedule for your entire day',
    version: 'v1.2',
    isPremium: true,
    color: ['#F59E0B', '#D97706'],
  },
  {
    icon: 'trending-up',
    title: 'AI Distraction Insights',
    description: 'Learn when you focus best, when you quit early, and get tips to improve your patterns',
    version: 'v1.2',
    isPremium: true,
    color: ['#3B82F6', '#2563EB'],
  },
  {
    icon: 'bar-chart-2',
    title: 'Advanced Analytics',
    description: 'Long-term trends, productivity score, peak performance times, and detailed reports',
    version: 'v1.3',
    isPremium: true,
    color: ['#059669', '#047857'],
  },
  {
    icon: 'smile',
    title: 'Mood Tracking',
    description: 'Track your daily mood and see correlations with your productivity and focus patterns',
    version: 'v1.3',
    isPremium: false,
    color: ['#F472B6', '#EC4899'],
  },
  {
    icon: 'activity',
    title: 'Stress Meter',
    description: 'Monitor your stress levels throughout the day and get AI-powered relaxation recommendations',
    version: 'v1.3',
    isPremium: false,
    color: ['#EF4444', '#DC2626'],
  },
  {
    icon: 'message-circle',
    title: 'Daily Motivational Quotes',
    description: 'Start each day with inspiring quotes tailored to your focus goals',
    version: 'v1.3',
    isPremium: false,
    color: ['#06B6D4', '#0891B2'],
  },
  {
    icon: 'music',
    title: 'More Ambient Sounds',
    description: '20+ additional sounds: binaural beats, white noise, nature sounds, lo-fi music, and more',
    version: 'v1.4',
    isPremium: true,
    color: ['#8B5CF6', '#6D28D9'],
  },
  {
    icon: 'wifi',
    title: 'AI Sound Matching',
    description: 'AI automatically recommends the perfect sound based on your task and energy level',
    version: 'v1.4',
    isPremium: true,
    color: ['#14B8A6', '#0D9488'],
  },
  {
    icon: 'users',
    title: 'Global Leaderboards',
    description: 'Compete with users worldwide and see how you rank on weekly focus challenges',
    version: 'v2.0',
    isPremium: false,
    color: ['#F59E0B', '#F97316'],
  },
  {
    icon: 'award',
    title: 'Weekly Challenges',
    description: 'Join community challenges: 10-hour week, 7-day streak, category challenges, and more',
    version: 'v2.0',
    isPremium: false,
    color: ['#EF4444', '#F97316'],
  },
  {
    icon: 'share-2',
    title: 'Share Progress',
    description: 'Auto-generate beautiful progress cards to share your streaks and milestones on social media',
    version: 'v2.0',
    isPremium: false,
    color: ['#3B82F6', '#06B6D4'],
  },
  {
    icon: 'user-plus',
    title: 'Friend System',
    description: 'Add friends, compare streaks, compete on private leaderboards, and send encouragement',
    version: 'v2.0',
    isPremium: false,
    color: ['#EC4899', '#F472B6'],
  },
  {
    icon: 'smartphone',
    title: 'Home Screen Widgets',
    description: 'Live timer countdown, streak display, and daily progress right on your home screen',
    version: 'v2.1',
    isPremium: true,
    color: ['#8B5CF6', '#A78BFA'],
  },
  {
    icon: 'cloud',
    title: 'Cloud Sync',
    description: 'Seamlessly sync your data across all your devices - iPhone, iPad, and Mac',
    version: 'v2.1',
    isPremium: true,
    color: ['#06B6D4', '#3B82F6'],
  },
  {
    icon: 'lock',
    title: 'Hardcore Mode',
    description: 'No pause, no exit, lose streak on quit - for the ultimate focus warriors',
    version: 'v2.2',
    isPremium: true,
    color: ['#DC2626', '#991B1B'],
  },
  {
    icon: 'globe',
    title: 'International Support',
    description: 'Spanish, French, German, Portuguese, Japanese, and more languages coming soon',
    version: 'v3.0',
    isPremium: false,
    color: ['#059669', '#10B981'],
  },
];

export default function ComingSoonScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Header */}
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.header}
          >
            <Feather name={"sparkles" as any} size={48} color="white" />
            <Text style={styles.headerTitle}>What's Coming Soon</Text>
            <Text style={styles.headerSubtitle}>
              Get excited! Here's what we're building for you
            </Text>
          </LinearGradient>

          {/* Premium Notice */}
          <View style={styles.premiumNotice}>
            <Feather name={"award" as any} size={24} color="#F59E0B" />
            <View style={styles.premiumNoticeText}>
              <Text style={styles.premiumNoticeTitle}>Premium Members Get It All</Text>
              <Text style={styles.premiumNoticeSubtitle}>
                All premium features are included in your subscription at no extra cost!
              </Text>
            </View>
          </View>

          {/* Features List */}
          {COMING_FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <LinearGradient
                colors={feature.color}
                style={styles.featureIconContainer}
              >
                <Feather name={feature.icon as any} size={28} color="white" />
              </LinearGradient>

              <View style={styles.featureContent}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <View style={styles.badges}>
                    <View style={styles.versionBadge}>
                      <Text style={styles.versionText}>{feature.version}</Text>
                    </View>
                    {feature.isPremium && (
                      <View style={styles.premiumBadge}>
                        <Feather name={"award" as any} size={12} color="#F59E0B" />
                        <Text style={styles.premiumBadgeText}>Pro</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Have a Feature Request?</Text>
            <Text style={styles.footerText}>
              We love hearing from our users! Email us your ideas at support@flowstate.app
            </Text>
          </View>
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
    paddingBottom: 40,
  },
  header: {
    padding: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  premiumNotice: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  premiumNoticeText: {
    flex: 1,
    marginLeft: 12,
  },
  premiumNoticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  premiumNoticeSubtitle: {
    fontSize: 13,
    color: '#78350F',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  versionBadge: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    margin: 20,
    marginTop: 30,
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