import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// Screens
import TimerScreen from './src/screens/TimerScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';

// Contexts
import { ThemeProvider } from './src/contexts/ThemeContext';

const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        console.log('🚀 Initializing RevenueCat...');
        
        // Enable debug logs
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        
        // Configure RevenueCat
        if (Platform.OS === 'ios') {
          await Purchases.configure({ 
            apiKey: 'appl_LMPXepgH4mOj2LEwb2PMbQz2NQX'
          });
          console.log('✅ RevenueCat configured successfully');
          
          // Get customer info to verify
          const customerInfo = await Purchases.getCustomerInfo();
          console.log('👤 Customer ID:', customerInfo.originalAppUserId);
          
          // Try to get offerings
          const offerings = await Purchases.getOfferings();
          console.log('📦 Offerings loaded:', offerings.current?.identifier || 'none');
          if (offerings.current) {
            console.log('📋 Available packages:', offerings.current.availablePackages.length);
          }
        }
      } catch (error) {
        console.error('❌ RevenueCat initialization error:', error);
      }
    };

    initializeRevenueCat();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: string;

                if (route.name === 'Timer') {
                  iconName = 'clock';
                } else if (route.name === 'Progress') {
                  iconName = 'trending-up';
                } else if (route.name === 'Analytics') {
                  iconName = 'bar-chart-2';
                } else if (route.name === 'Settings') {
                  iconName = 'settings';
                } else if (route.name === 'Coming Soon') {
                  iconName = 'star';
                } else {
                  iconName = 'circle';
                }

                return <Feather name={iconName as any} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#667eea',
              tabBarInactiveTintColor: 'gray',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Timer" component={TimerScreen} />
            <Tab.Screen name="Progress" component={AchievementsScreen} />
            <Tab.Screen name="Analytics" component={AnalyticsScreen} />
            <Tab.Screen name="Coming Soon" component={ComingSoonScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}