// src/screens/WelcomeScreen.tsx
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const WelcomeScreen = ({ navigation }: any) => {
  const { theme } = useTheme();

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6',
      }}
      style={styles.container}
      resizeMode='cover'>
      <LinearGradient
        colors={[
          'rgba(246, 247, 248, 0.8)',
          'rgba(246, 247, 248, 0.95)',
          '#f6f7f8',
        ]}
        style={styles.gradient}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name='heart' size={60} color={theme.colors.primary} />
        </View>

        {/* Headline */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Christian Matrimony
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Where Faith Meets Forever
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Info Text */}
        <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
          Join thousands of Christian singles
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={() => navigation.navigate('Registration')}
            activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              {
                backgroundColor: `${theme.colors.primary}20`,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => navigation.navigate('SignIn')}
            activeOpacity={0.8}>
            <Text
              style={[
                styles.secondaryButtonText,
                { color: theme.colors.primary },
              ]}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  primaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
