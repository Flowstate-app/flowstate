// src/screens/ThemeSettingsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES, ThemeName } from '../types/themes';
import DataManager from '../services/DataManager';

export default function ThemeSettingsScreen() {
  const { currentTheme, setTheme } = useTheme();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkPremium();
  }, []);

  const checkPremium = async () => {
    const profile = await DataManager.getUserProfile();
    setIsPremium(profile.isPremium);
  };

  const handleThemeSelect = async (themeName: ThemeName) => {
    const theme = THEMES[themeName];
    
    if (theme.isPremium && !isPremium) {
      // User needs to upgrade - do nothing
      return;
    }
    
    await setTheme(themeName);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Choose Your Theme</Text>
          <Text style={styles.subtitle}>
            Select a theme that matches your focus mood
          </Text>

          {(Object.keys(THEMES) as ThemeName[]).map((themeName) => {
            const theme = THEMES[themeName];
            const isSelected = currentTheme === themeName;
            const isLocked = theme.isPremium && !isPremium;

            return (
              <TouchableOpacity
                key={themeName}
                style={[
                  styles.themeCard,
                  isSelected && styles.themeCardSelected,
                ]}
                onPress={() => handleThemeSelect(themeName)}
                disabled={isLocked}
              >
                <LinearGradient
                  colors={theme.colors}
                  style={styles.themePreview}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {isLocked && (
                    <View style={styles.lockOverlay}>
                      <Feather name={"lock" as any} size={32} color="white" />
                      <Text style={styles.lockText}>Premium</Text>
                    </View>
                  )}
                  {isSelected && !isLocked && (
                    <View style={styles.selectedBadge}>
                      <Feather name={"check" as any} size={24} color="white" />
                    </View>
                  )}
                </LinearGradient>

                <View style={styles.themeInfo}>
                  <Text style={styles.themeName}>{theme.displayName}</Text>
                  <Text style={styles.themeDescription}>
                    {theme.description}
                  </Text>
                  {theme.isPremium && (
                    <View style={styles.premiumBadge}>
                      <Feather name={"award" as any} size={14} color="#F59E0B" />
                      <Text style={styles.premiumBadgeText}>Premium</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}

          {!isPremium && (
            <View style={styles.upgradeCard}>
              <Feather name={"award" as any} size={32} color="#F59E0B" />
              <Text style={styles.upgradeTitle}>Unlock All Themes</Text>
              <Text style={styles.upgradeText}>
                Get access to 3 exclusive themes with Premium
              </Text>
              <TouchableOpacity style={styles.upgradeButton}>
                <LinearGradient
                  colors={['#3B82F6', '#8B5CF6']}
                  style={styles.upgradeButtonGradient}
                >
                  <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
                </LinearGradient>
              </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  themeCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  themeCardSelected: {
    borderColor: '#3B82F6',
  },
  themePreview: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  selectedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeInfo: {
    padding: 16,
  },
  themeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  themeDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  premiumBadgeText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  upgradeCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 15,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  upgradeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  upgradeButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});