// src/navigation/AppNavigator.tsx
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { AuthNavigator } from './auth';
import { MainNavigator } from './main';
import { ProfileCreationNavigator } from './profile-creation';

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
