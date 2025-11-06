// src/navigation/ProfileCreationNavigator.tsx
import OnboardingScreen from '@/app/screens/onboarding/_layout';
import BasicInformationScreen from '@/app/screens/onboarding/basic-information';
import FaithProfileScreen from '@/app/screens/onboarding/faith-profile';
import PartnerPreferencesScreen from '@/app/screens/onboarding/partner-preferences';
import PersonalDetailsScreen from '@/app/screens/onboarding/personal-details';
import VerificationUploadScreen from '@/app/screens/onboarding/verification-upload';
import VerificationPendingScreen from '@/app/screens/verification-pending';
import type { OnboardingStackParamList } from '@/types/navigation.types';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator = () => {
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
