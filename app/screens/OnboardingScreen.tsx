// src/screens/OnboardingScreen.tsx (Simple implementation)
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'shield-checkmark',
    title: 'A Verified Christian Community',
    description:
      'Every profile is manually reviewed for authenticity to ensure a trusted and genuine network.',
  },
  {
    icon: 'heart',
    title: 'Faith-Centered Matching',
    description:
      'Our algorithm connects you based on shared faith, values, and denomination.',
  },
  {
    icon: 'lock-closed',
    title: 'Safe & Secure',
    description:
      'Private messaging and user reporting create a secure environment for you to connect.',
  },
];

export const OnboardingScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleGetStarted = () => {
    navigation.navigate('BasicInformation');
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Carousel
        width={width}
        height={600}
        data={slides}
        onSnapToItem={setCurrentIndex}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${theme.colors.primary}20` },
              ]}>
              <Ionicons
                name={item.icon as any}
                size={80}
                color={theme.colors.primary}
              />
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {item.title}
            </Text>
            <Text
              style={[styles.description, { color: theme.colors.textMuted }]}>
              {item.description}
            </Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex
                      ? theme.colors.primary
                      : theme.colors.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {currentIndex === slides.length - 1 ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.skipButton]}
            onPress={handleGetStarted}>
            <Text style={[styles.skipText, { color: theme.colors.textMuted }]}>
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 192,
    height: 192,
    borderRadius: 96,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
