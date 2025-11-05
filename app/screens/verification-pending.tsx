// src/screens/VerificationPendingScreen.tsx (already mentioned, creating full version)
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const VerificationPendingScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { refreshUser } = useAuth();

  const handleBrowse = async () => {
    await refreshUser();
    // Navigation will be handled automatically by AppNavigator
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View
            style={[
              styles.illustration,
              { backgroundColor: `${theme.colors.primary}10` },
            ]}>
            <Ionicons
              name='hourglass-outline'
              size={80}
              color={theme.colors.primary}
            />
          </View>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Your Profile is Under Review
        </Text>

        {/* Description */}
        <Text style={[styles.description, { color: theme.colors.textMuted }]}>
          Our team is verifying your information. This typically takes 24-48
          hours to ensure our community is safe and authentic.
        </Text>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
              Estimated completion:
            </Text>
          </View>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.border },
            ]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary, width: '25%' },
              ]}
            />
          </View>
          <Text
            style={[styles.progressTime, { color: theme.colors.textMuted }]}>
            24-48 hours
          </Text>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          <Text style={[styles.timelineTitle, { color: theme.colors.text }]}>
            What Happens Next?
          </Text>

          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                { backgroundColor: theme.colors.success },
              ]}>
              <Ionicons name='checkmark' size={16} color='#ffffff' />
            </View>
            <View style={styles.timelineContent}>
              <Text
                style={[styles.timelineLabel, { color: theme.colors.text }]}>
                Profile Submitted
              </Text>
              <Text
                style={[
                  styles.timelineText,
                  { color: theme.colors.textMuted },
                ]}>
                {`We've received your details.`}
              </Text>
            </View>
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                styles.timelineDotActive,
                { backgroundColor: theme.colors.primary },
              ]}>
              <Ionicons name='search' size={16} color='#ffffff' />
            </View>
            <View style={styles.timelineContent}>
              <Text
                style={[styles.timelineLabel, { color: theme.colors.primary }]}>
                Verification in Progress
              </Text>
              <Text
                style={[
                  styles.timelineText,
                  { color: theme.colors.textMuted },
                ]}>
                Our team is reviewing your profile.
              </Text>
            </View>
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineItem}>
            <View
              style={[
                styles.timelineDot,
                { backgroundColor: theme.colors.border },
              ]}>
              <Ionicons name='heart' size={16} color={theme.colors.textMuted} />
            </View>
            <View style={styles.timelineContent}>
              <Text
                style={[
                  styles.timelineLabel,
                  { color: theme.colors.textMuted },
                ]}>
                Profile Approved
              </Text>
              <Text
                style={[
                  styles.timelineText,
                  { color: theme.colors.textMuted },
                ]}>
                {`You'll be notified upon completion.`}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View
        style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[
            styles.browseButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleBrowse}>
          <Text style={styles.browseButtonText}>Browse While You Wait</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpButton}>
          <Text
            style={[styles.helpButtonText, { color: theme.colors.primary }]}>
            Need Help?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 80,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  illustration: {
    width: 192,
    height: 192,
    borderRadius: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  progressSection: {
    marginBottom: 40,
  },
  progressHeader: {
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressTime: {
    fontSize: 14,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timelineLine: {
    width: 2,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginLeft: 15,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 16,
    paddingBottom: 8,
  },
  timelineLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineText: {
    fontSize: 14,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  browseButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  browseButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  helpButton: {
    padding: 12,
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
