// src/navigation/ProfileCreationNavigator.tsx
import { OnboardingScreen } from '@/app/screens/OnboardingScreen';
import { BasicInformationScreen } from '@/app/screens/ProfileCreation/BasicInformationScreen';
import { FaithProfileScreen } from '@/app/screens/ProfileCreation/FaithProfileScreen';
import { PartnerPreferencesScreen } from '@/app/screens/ProfileCreation/PartnerPreferencesScreen';
import { PersonalDetailsScreen } from '@/app/screens/ProfileCreation/PersonalDetailsScreen';
import { VerificationUploadScreen } from '@/app/screens/ProfileCreation/VerificationUploadScreen';
import { VerificationPendingScreen } from '@/app/screens/VerificationPendingScreen';
import type { ProfileCreationStackParamList } from '@/types/navigation.types';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

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
