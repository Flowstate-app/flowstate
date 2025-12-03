import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import Purchases from 'react-native-purchases';

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
    // Initialize RevenueCat
    const initializeRevenueCat = async () => {
      try {
        console.log('🚀 Initializing RevenueCat...');
        await Purchases.configure({ 
          apiKey: 'appl_LMPXepgH4mOj2LEwb2PMbQz2NQX'
        });
        console.log('✅ RevenueCat initialized successfully');
        
        // Log customer info for debugging
        const customerInfo = await Purchases.getCustomerInfo();
        console.log('👤 Customer Info:', {
          activeEntitlements: Object.keys(customerInfo.entitlements.active),
          originalAppUserId: customerInfo.originalAppUserId,
        });
      } catch (error) {
        console.error('❌ Error initializing RevenueCat:', error);
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