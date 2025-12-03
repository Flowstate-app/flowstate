// App.tsx
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import Purchases from 'react-native-purchases';

// Theme Provider
import { ThemeProvider } from './src/contexts/ThemeContext';

// Custom Splash Screen
import SplashScreen from './src/components/SplashScreen';

// Screens
import TimerScreen from './src/screens/TimerScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ThemeSettingsScreen from './src/screens/ThemeSettingsScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SettingsMain" 
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ThemeSettings" 
        component={ThemeSettingsScreen}
        options={{ 
          headerTitle: 'Themes',
          headerBackTitle: 'Back'
        }}
      />
      <Stack.Screen 
        name="ComingSoon" 
        component={ComingSoonScreen}
        options={{ 
          headerTitle: 'Coming Soon',
          headerBackTitle: 'Back'
        }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Focus') {
            iconName = 'clock';
          } else if (route.name === 'Stats') {
            iconName = 'bar-chart-2';
          } else if (route.name === 'Rewards') {
            iconName = 'star';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          }
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Focus" component={TimerScreen} />
      <Tab.Screen name="Stats" component={AnalyticsScreen} />
      <Tab.Screen name="Rewards" component={AchievementsScreen} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Configure RevenueCat
    const configureRevenueCat = async () => {
      try {
        // iOS API Key - replace with your production key
        const apiKey = 'appl_LMPXepgH4mOj2LEwb2PMbQz2NQX';
        
        await Purchases.configure({ apiKey });
        console.log('RevenueCat configured successfully');
      } catch (error) {
        console.error('Error configuring RevenueCat:', error);
      }
    };

    configureRevenueCat();
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <MainTabs />
      </NavigationContainer>
    </ThemeProvider>
  );
}