// src/screens/ProfileDetailScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { profileService } from '../services/profile.service';
import { User } from '../types/user.types';

export const ProfileDetailScreen = ({ route, navigation }: any) => {
  const { userId } = route.params;
  const { theme } = useTheme();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const loadProfile = useCallback(async () => {
    const result = await profileService.getProfile(userId);
    if (result.success && result.data) {
      setProfile(result.data);
    }
  }, [userId]);

  if (!profile) return null;

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                profile.profile_photo_url || 'https://via.placeholder.com/400',
            }}
            style={styles.headerImage}
          />
          <View style={styles.imageOverlay} />

          {/* Floating Actions */}
          <View style={styles.floatingActions}>
            <TouchableOpacity
              style={styles.floatingButton}
              onPress={() => navigation.goBack()}>
              <Ionicons name='arrow-back' size={24} color='#ffffff' />
            </TouchableOpacity>
            <View style={styles.floatingRight}>
              <TouchableOpacity style={styles.floatingButton}>
                <Ionicons name='share-outline' size={24} color='#ffffff' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.floatingButton}>
                <Ionicons name='flag-outline' size={24} color='#ffffff' />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: theme.colors.background },
          ]}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.colors.text }]}>
              {profile.full_name},{' '}
              {profile.date_of_birth
                ? new Date().getFullYear() -
                  new Date(profile.date_of_birth).getFullYear()
                : ''}
            </Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name='checkmark-circle' size={16} color='#4CD964' />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name='location'
              size={16}
              color={theme.colors.textMuted}
            />
            <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
              {profile.current_location}
            </Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View
              style={[styles.quickStat, { borderColor: theme.colors.border }]}>
              <Ionicons
                name='resize-outline'
                size={20}
                color={theme.colors.textMuted}
              />
              <Text
                style={[
                  styles.quickStatLabel,
                  { color: theme.colors.textMuted },
                ]}>
                Height
              </Text>
              <Text
                style={[styles.quickStatValue, { color: theme.colors.text }]}>
                {profile.height_cm
                  ? `${Math.floor(profile.height_cm / 30.48)}'${Math.round(
                      (profile.height_cm % 30.48) / 2.54
                    )}"`
                  : 'N/A'}
              </Text>
            </View>
            <View
              style={[styles.quickStat, { borderColor: theme.colors.border }]}>
              <Ionicons
                name='briefcase-outline'
                size={20}
                color={theme.colors.textMuted}
              />
              <Text
                style={[
                  styles.quickStatLabel,
                  { color: theme.colors.textMuted },
                ]}>
                Profession
              </Text>
              <Text
                style={[styles.quickStatValue, { color: theme.colors.text }]}>
                {profile.profession || 'N/A'}
              </Text>
            </View>
            <View
              style={[styles.quickStat, { borderColor: theme.colors.border }]}>
              <Ionicons name='build' size={20} color={theme.colors.textMuted} />
              <Text
                style={[
                  styles.quickStatLabel,
                  { color: theme.colors.textMuted },
                ]}>
                Church
              </Text>
              <Text
                style={[styles.quickStatValue, { color: theme.colors.text }]}>
                {profile.denomination || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        <View style={styles.sections}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Faith & Values
            </Text>
            <Text
              style={[styles.sectionText, { color: theme.colors.textMuted }]}>
              {profile.faith_statement || 'No faith statement provided.'}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              About Me
            </Text>
            <Text
              style={[styles.sectionText, { color: theme.colors.textMuted }]}>
              {profile.about_me || 'No description provided.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={[
          styles.bottomActions,
          { backgroundColor: theme.colors.background },
        ]}>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: theme.colors.border }]}>
          <Text style={[styles.actionButtonText, { color: theme.colors.text }]}>
            Maybe Later
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButtonPrimary,
            { backgroundColor: theme.colors.primary },
          ]}>
          <Text style={styles.actionButtonPrimaryText}>Send Interest</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name='ban-outline'
            size={24}
            color={theme.colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Continue with SettingsScreen styles...
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Chat Screen
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerStatus: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  safetyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  safetyText: {
    fontSize: 12,
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  inputButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Profile Screen
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  editPhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 16,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  verificationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    alignItems: 'center',
    padding: 24,
  },
  progressCircle: {
    alignItems: 'center',
    marginBottom: 12,
  },
  progressPercent: {
    fontSize: 32,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 14,
  },
  progressHint: {
    fontSize: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  actionSubtitle: {
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 48,
  },
  menuSection: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  // Profile Detail Screen
  imageContainer: {
    position: 'relative',
    height: 400,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  floatingActions: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  floatingButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingRight: {
    flexDirection: 'row',
    gap: 8,
  },
  profileCard: {
    marginTop: -64,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#4CD964',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStat: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  quickStatValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  sections: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtonPrimary: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
