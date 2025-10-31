// src/navigation/ProfileCreationNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { BasicInformationScreen } from '../screens/ProfileCreation/BasicInformationScreen';
import { FaithProfileScreen } from '../screens/ProfileCreation/FaithProfileScreen';
import { PartnerPreferencesScreen } from '../screens/ProfileCreation/PartnerPreferencesScreen';
import { PersonalDetailsScreen } from '../screens/ProfileCreation/PersonalDetailsScreen';
import { VerificationUploadScreen } from '../screens/ProfileCreation/VerificationUploadScreen';
import { VerificationPendingScreen } from '../screens/VerificationPendingScreen';
import type { ProfileCreationStackParamList } from '../types/navigation.types';

const Stack = createStackNavigator<ProfileCreationStackParamList>();

export const ProfileCreationNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name='BasicInformation' component={OnboardingScreen} />
      <Stack.Screen
        name='BasicInformation'
        component={BasicInformationScreen}
      />
      <Stack.Screen name='FaithProfile' component={FaithProfileScreen} />
      <Stack.Screen
        name='VerificationUpload'
        component={VerificationUploadScreen}
      />
      <Stack.Screen name='PersonalDetails' component={PersonalDetailsScreen} />
      <Stack.Screen
        name='PartnerPreferences'
        component={PartnerPreferencesScreen}
      />
      <Stack.Screen
        name='VerificationPending'
        component={VerificationPendingScreen}
      />
    </Stack.Navigator>
  );
};
