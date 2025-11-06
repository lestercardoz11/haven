// src/screens/ProfileScreen.tsx
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { stats } = useProfile(user!.id);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: `${theme.colors.primary}10` },
        ]}>
        <View style={styles.headerTop}>
          <Ionicons name='heart' size={32} color={theme.colors.primary} />
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons
              name='notifications-outline'
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          My Profile
        </Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.photoContainer}>
          <Image
            source={{
              uri: user?.profile_photo_url || 'https://via.placeholder.com/128',
            }}
            style={styles.profilePhoto}
          />
          <TouchableOpacity
            style={[
              styles.editPhotoButton,
              { backgroundColor: theme.colors.primary },
            ]}>
            <Ionicons name='camera' size={20} color='#ffffff' />
          </TouchableOpacity>
        </View>
        <Text style={[styles.profileName, { color: theme.colors.text }]}>
          {user?.full_name}
        </Text>
        <Text
          style={[styles.profileLocation, { color: theme.colors.textMuted }]}>
          {user?.current_location}
        </Text>
      </View>

      {/* Verification Badge */}
      {user?.verification_status === 'verified' && (
        <View
          style={[
            styles.verificationBadge,
            { backgroundColor: `${theme.colors.success}10` },
          ]}>
          <Ionicons
            name='checkmark-circle'
            size={20}
            color={theme.colors.success}
          />
          <Text
            style={[styles.verificationText, { color: theme.colors.success }]}>
            Profile Verified
          </Text>
        </View>
      )}

      {/* Completion Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressCircle}>
          <Text style={[styles.progressPercent, { color: theme.colors.text }]}>
            {user?.profile_completion_percentage || 0}%
          </Text>
          <Text
            style={[styles.progressLabel, { color: theme.colors.textMuted }]}>
            Complete
          </Text>
        </View>
        <Text style={[styles.progressHint, { color: theme.colors.textMuted }]}>
          Add more photos to reach 85%!
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[
            styles.actionCard,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
            },
          ]}>
          <Ionicons name='star' size={32} color='#F5A623' />
          <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
            Upgrade
          </Text>
          <Text
            style={[styles.actionSubtitle, { color: theme.colors.textMuted }]}>
            Go Premium
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionCard,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
            },
          ]}>
          <Ionicons name='create' size={32} color={theme.colors.primary} />
          <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
            Edit Profile
          </Text>
          <Text
            style={[styles.actionSubtitle, { color: theme.colors.textMuted }]}>
            Your details
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View
        style={[
          styles.statsContainer,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
          },
        ]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {stats?.profile_views || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
            Profile Views
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: theme.colors.border }]}
        />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {stats?.interests_received || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
            Interests
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: theme.colors.border }]}
        />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {stats?.matches_count || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>
            Matches
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {[
          { icon: 'person', title: 'About Me', screen: 'EditProfile' },
          { icon: 'heart', title: 'My Faith Journey', screen: 'EditFaith' },
          { icon: 'images', title: 'Photos & Videos', screen: 'EditPhotos' },
          { icon: 'settings', title: 'Settings', screen: 'Settings' },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              { borderBottomColor: theme.colors.border },
            ]}
            onPress={() => navigation.navigate(item.screen)}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color={theme.colors.primary}
              />
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                {item.title}
              </Text>
            </View>
            <Ionicons
              name='chevron-forward'
              size={20}
              color={theme.colors.textMuted}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

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
