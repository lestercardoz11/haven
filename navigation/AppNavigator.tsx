// src/navigation/AppNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { ProfileCreationNavigator } from './ProfileCreationNavigator';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name='Auth' component={AuthNavigator} />
      ) : !user.onboarding_completed ? (
        <Stack.Screen
          name='ProfileCreation'
          component={ProfileCreationNavigator}
        />
      ) : (
        <Stack.Screen name='Main' component={MainNavigator} />
      )}
    </Stack.Navigator>
  );
};
