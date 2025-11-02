// src/navigation/AuthNavigator.tsx
import { RegistrationScreen } from '@/app/screens/RegistrationScreen';
import { SignInScreen } from '@/app/screens/SignInScreen';
import { WelcomeScreen } from '@/app/screens/WelcomeScreen';
import type { AuthStackParamList } from '@/types/navigation.types';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}>
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
      <Stack.Screen name='SignIn' component={SignInScreen} />
      <Stack.Screen name='Registration' component={RegistrationScreen} />
    </Stack.Navigator>
  );
};
