// src/navigation/MainNavigator.tsx
import HomeScreen from '@/app/(tabs)';
import { ChatScreen } from '@/app/screens/ChatScreen';
import { MatchesScreen } from '@/app/screens/MatchesScreen';
import { MessagesScreen } from '@/app/screens/MessagesScreen';
import { ProfileDetailScreen } from '@/app/screens/ProfileDetailScreen';
import { ProfileScreen } from '@/app/screens/ProfileScreen';
import { SettingsScreen } from '@/app/screens/SettingsScreen';
import { useTheme } from '@/context/ThemeContext';
import type { MainStackParamList } from '@/types/navigation.types';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<MainStackParamList>();

const TabNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Matches') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}>
      <Tab.Screen
        name='Home'
        component={HomeScreen}
        options={{ title: 'Discover' }}
      />
      <Tab.Screen
        name='Matches'
        component={MatchesScreen}
        options={{ title: 'Matches' }}
      />
      <Tab.Screen
        name='Messages'
        component={MessagesScreen}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='Home' component={TabNavigator} />
      <Stack.Screen name='Chat' component={ChatScreen} />
      <Stack.Screen name='ProfileDetail' component={ProfileDetailScreen} />
      <Stack.Screen name='Settings' component={SettingsScreen} />
    </Stack.Navigator>
  );
};
