// src/screens/SettingsScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { profileService } from '../services/profile.service';

export const SettingsScreen = ({ navigation }: any) => {
  const { theme, themeMode, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const [notifications, setNotifications] = useState({
    matches: true,
    messages: true,
    interests: true,
    marketing: false,
  });

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  const handleDeactivateAccount = () => {
    Alert.alert(
      'Deactivate Account',
      'Your profile will be hidden from others. You can reactivate anytime by signing in.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            const result = await profileService.deactivateAccount(user!.id);
            if (result.success) {
              Alert.alert('Success', 'Account deactivated', [
                { text: 'OK', onPress: () => signOut() },
              ]);
            } else {
              Alert.alert(
                'Error',
                result.error || 'Failed to deactivate account'
              );
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are You Absolutely Sure?',
              'Please type DELETE to confirm permanent deletion.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm Delete',
                  style: 'destructive',
                  onPress: async () => {
                    const result = await profileService.deleteAccount(user!.id);
                    if (result.success) {
                      Alert.alert(
                        'Account Deleted',
                        'Your account has been permanently deleted.',
                        [{ text: 'OK', onPress: () => signOut() }]
                      );
                    } else {
                      Alert.alert(
                        'Error',
                        result.error || 'Failed to delete account'
                      );
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    onPress: () => void,
    showChevron: boolean = true,
    subtitle?: string,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { backgroundColor: theme.colors.background }]}
      onPress={onPress}
      disabled={!showChevron && !rightElement}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${theme.colors.primary}10` },
        ]}>
        <Ionicons name={icon as any} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.settingSubtitle, { color: theme.colors.textMuted }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement ||
        (showChevron && (
          <Ionicons
            name='chevron-forward'
            size={20}
            color={theme.colors.textMuted}
          />
        ))}
    </TouchableOpacity>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>
        {title}
      </Text>
      <View
        style={[
          styles.sectionContent,
          { backgroundColor: theme.colors.background },
        ]}>
        {children}
      </View>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Settings */}
        {renderSection(
          'ACCOUNT SETTINGS',
          <>
            {renderSettingItem('person-outline', 'Edit Profile', () =>
              Alert.alert(
                'Coming Soon',
                'Profile editing will be available soon'
              )
            )}
            {renderSettingItem(
              'mail-outline',
              'Phone & Email',
              () =>
                Alert.alert(
                  'Coming Soon',
                  'Phone & Email editing will be available soon'
                ),
              true,
              user?.email || ''
            )}
            {renderSettingItem(
              'lock-closed-outline',
              'Password & Security',
              () =>
                Alert.alert(
                  'Coming Soon',
                  'Password change will be available soon'
                )
            )}
            {renderSettingItem(
              'shield-checkmark-outline',
              'Two-Factor Authentication',
              () => Alert.alert('Coming Soon', '2FA will be available soon'),
              true,
              'Not enabled'
            )}
          </>
        )}

        {/* Preferences */}
        {renderSection(
          'PREFERENCES',
          <>
            {renderSettingItem(
              'notifications-outline',
              'Notification Settings',
              () => {},
              false,
              undefined,
              <View style={styles.notificationSwitches}>
                <Text
                  style={[
                    styles.notificationText,
                    { color: theme.colors.textMuted },
                  ]}>
                  {Object.values(notifications).filter(Boolean).length} enabled
                </Text>
              </View>
            )}
            {renderSettingItem('eye-off-outline', 'Privacy Controls', () =>
              Alert.alert(
                'Coming Soon',
                'Privacy settings will be available soon'
              )
            )}
            {renderSettingItem('options-outline', 'Match Preferences', () =>
              navigation.navigate('PartnerPreferences')
            )}
            {renderSettingItem(
              themeMode === 'dark' ? 'moon' : 'sunny',
              'Dark Mode',
              () => {},
              false,
              undefined,
              <Switch
                value={themeMode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.primary,
                }}
                thumbColor='#ffffff'
              />
            )}
          </>
        )}

        {/* Verification */}
        {renderSection(
          'VERIFICATION',
          <>
            {renderSettingItem(
              'checkmark-circle-outline',
              'Verification Status',
              () =>
                Alert.alert(
                  'Verification Status',
                  `Your account is ${user?.verification_status}`
                ),
              true,
              user?.verification_status === 'verified'
                ? 'Verified ✓'
                : 'Pending'
            )}
            {renderSettingItem(
              'document-text-outline',
              'Re-verify Documents',
              () => navigation.navigate('VerificationUpload')
            )}
          </>
        )}

        {/* Subscription */}
        {renderSection(
          'SUBSCRIPTION',
          <>
            {renderSettingItem(
              'diamond-outline',
              'Current Plan',
              () =>
                Alert.alert(
                  'Coming Soon',
                  'Subscription management will be available soon'
                ),
              true,
              'Free'
            )}
            {renderSettingItem('receipt-outline', 'Donation History', () =>
              Alert.alert(
                'Coming Soon',
                'Donation history will be available soon'
              )
            )}
            {renderSettingItem('gift-outline', 'Support Haven', () =>
              Alert.alert('Thank You!', 'Donation page coming soon')
            )}
          </>
        )}

        {/* Support & Legal */}
        {renderSection(
          'SUPPORT & LEGAL',
          <>
            {renderSettingItem('help-circle-outline', 'Help Center', () =>
              Alert.alert(
                'Help Center',
                'Visit support.havenmatrimony.com for assistance'
              )
            )}
            {renderSettingItem('shield-outline', 'Safety Resources', () =>
              Alert.alert(
                'Safety First',
                'Never share personal financial information'
              )
            )}
            {renderSettingItem('document-outline', 'Terms of Service', () =>
              Alert.alert('Terms', 'Terms of Service will be displayed here')
            )}
            {renderSettingItem('lock-closed-outline', 'Privacy Policy', () =>
              Alert.alert('Privacy', 'Privacy Policy will be displayed here')
            )}
            {renderSettingItem(
              'information-circle-outline',
              'About Haven',
              () =>
                Alert.alert(
                  'Haven Matrimony',
                  'Version 1.0.0\n\nWhere Faith Meets Forever'
                )
            )}
          </>
        )}

        {/* Danger Zone */}
        {renderSection(
          'DANGER ZONE',
          <>
            {renderSettingItem(
              'pause-circle-outline',
              'Deactivate Account',
              handleDeactivateAccount,
              true,
              'Hide your profile temporarily'
            )}
            {renderSettingItem(
              'trash-outline',
              'Delete Account',
              handleDeleteAccount,
              true,
              'Permanently delete your account'
            )}
          </>
        )}

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[
            styles.signOutButton,
            { backgroundColor: theme.colors.error },
          ]}
          onPress={handleSignOut}>
          <Ionicons name='log-out-outline' size={24} color='#ffffff' />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.versionText, { color: theme.colors.textMuted }]}>
          Haven Matrimony v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionContent: {
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  notificationSwitches: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 14,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  signOutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
  },
});
