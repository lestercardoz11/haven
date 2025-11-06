// src/screens/ProfileCreation/PartnerPreferencesScreen.tsx
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profile.service';
import {
  DEALBREAKERS,
  DENOMINATIONS,
  MAX_AGE,
  MIN_AGE,
} from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PartnerPreferencesScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    preferred_age_min: user?.preferred_age_min || 21,
    preferred_age_max: user?.preferred_age_max || 35,
    preferred_location: user?.preferred_location || '',
    preferred_radius_km: user?.preferred_radius_km || 50,
    preferred_denominations: user?.preferred_denominations || [],
    must_share_denomination: user?.must_share_denomination || false,
    dealbreakers: user?.dealbreakers || [],
  });

  const [loading, setLoading] = useState(false);

  const toggleDenomination = (denomination: string) => {
    if (formData.preferred_denominations.includes(denomination)) {
      setFormData({
        ...formData,
        preferred_denominations: formData.preferred_denominations.filter(
          (d) => d !== denomination
        ),
      });
    } else {
      setFormData({
        ...formData,
        preferred_denominations: [
          ...formData.preferred_denominations,
          denomination,
        ],
      });
    }
  };

  const toggleDealbreaker = (dealbreaker: string) => {
    if (formData.dealbreakers.includes(dealbreaker)) {
      setFormData({
        ...formData,
        dealbreakers: formData.dealbreakers.filter((d) => d !== dealbreaker),
      });
    } else {
      setFormData({
        ...formData,
        dealbreakers: [...formData.dealbreakers, dealbreaker],
      });
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (formData.preferred_age_min < MIN_AGE) {
      Alert.alert('Invalid', `Minimum age must be at least ${MIN_AGE}`);
      return;
    }

    if (formData.preferred_age_max > MAX_AGE) {
      Alert.alert('Invalid', `Maximum age cannot exceed ${MAX_AGE}`);
      return;
    }

    if (formData.preferred_age_min >= formData.preferred_age_max) {
      Alert.alert('Invalid', 'Minimum age must be less than maximum age');
      return;
    }

    if (!formData.preferred_location.trim()) {
      Alert.alert('Required', 'Please enter your preferred location');
      return;
    }

    if (
      formData.preferred_denominations.length === 0 &&
      !formData.must_share_denomination
    ) {
      Alert.alert(
        'Required',
        'Please select at least one preferred denomination'
      );
      return;
    }

    try {
      setLoading(true);

      // Update profile with preferences
      const result = await profileService.updateProfile(user!.id, {
        preferred_age_min: formData.preferred_age_min,
        preferred_age_max: formData.preferred_age_max,
        preferred_location: formData.preferred_location,
        preferred_radius_km: formData.preferred_radius_km,
        preferred_denominations: formData.preferred_denominations,
        must_share_denomination: formData.must_share_denomination,
        dealbreakers: formData.dealbreakers,
      });

      if (result.success) {
        // Mark onboarding as completed
        await profileService.updateProfile(user!.id, {
          onboarding_completed: true,
        });

        await refreshUser();

        // Navigate to verification pending or main app
        if (user?.verification_status === 'pending') {
          navigation.navigate('VerificationPending');
        } else {
          // This will automatically navigate to main app through AppNavigator
          await refreshUser();
        }
      } else {
        Alert.alert('Error', result.error || 'Failed to save preferences');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

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
          Partner Preferences
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>
            Step 5 of 5
          </Text>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.border },
            ]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary, width: '100%' },
              ]}
            />
          </View>
        </View>

        {/* Basic Criteria Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Basic Criteria
          </Text>

          {/* Age Range */}
          <View style={styles.inputContainer}>
            <View style={styles.ageHeader}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Age Range
              </Text>
              <Text style={[styles.ageValue, { color: theme.colors.primary }]}>
                {formData.preferred_age_min} - {formData.preferred_age_max}{' '}
                years
              </Text>
            </View>

            {/* Min Age Slider */}
            <Text
              style={[styles.sliderLabel, { color: theme.colors.textMuted }]}>
              Minimum Age: {formData.preferred_age_min}
            </Text>
            <input
              type='range'
              min={MIN_AGE}
              max={formData.preferred_age_max - 1}
              value={formData.preferred_age_min}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferred_age_min: parseInt(e.target.value),
                })
              }
              style={{ width: '100%', marginBottom: 16 }}
            />

            {/* Max Age Slider */}
            <Text
              style={[styles.sliderLabel, { color: theme.colors.textMuted }]}>
              Maximum Age: {formData.preferred_age_max}
            </Text>
            <input
              type='range'
              min={formData.preferred_age_min + 1}
              max={MAX_AGE}
              value={formData.preferred_age_max}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferred_age_max: parseInt(e.target.value),
                })
              }
              style={{ width: '100%' }}
            />
          </View>

          {/* Location */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Location
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.colors.border, color: theme.colors.text },
              ]}
              placeholder='e.g., United States'
              placeholderTextColor={theme.colors.textMuted}
              value={formData.preferred_location}
              onChangeText={(text) =>
                setFormData({ ...formData, preferred_location: text })
              }
            />
          </View>

          {/* Radius */}
          <View style={styles.inputContainer}>
            <View style={styles.radiusHeader}>
              <Text style={[styles.label, { color: theme.colors.textMuted }]}>
                Radius
              </Text>
              <Text style={[styles.radiusValue, { color: theme.colors.text }]}>
                {formData.preferred_radius_km} km
              </Text>
            </View>
            <input
              type='range'
              min={10}
              max={500}
              step={10}
              value={formData.preferred_radius_km}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferred_radius_km: parseInt(e.target.value),
                })
              }
              style={{ width: '100%' }}
            />
          </View>
        </View>

        {/* Faith & Values Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Faith & Values
          </Text>

          {/* Denominations */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Denomination
            </Text>
            <View style={styles.chipsContainer}>
              {DENOMINATIONS.slice(0, -1).map((denomination) => {
                const isSelected =
                  formData.preferred_denominations.includes(denomination);
                return (
                  <TouchableOpacity
                    key={denomination}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.primary
                          : `${theme.colors.primary}20`,
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                    onPress={() => toggleDenomination(denomination)}>
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? '#ffffff' : theme.colors.primary,
                          fontWeight: isSelected ? '600' : '500',
                        },
                      ]}>
                      {denomination}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Must Share Denomination */}
          <View
            style={[
              styles.switchContainer,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
              },
            ]}>
            <Text style={[styles.switchLabel, { color: theme.colors.text }]}>
              Must share my denomination
            </Text>
            <Switch
              value={formData.must_share_denomination}
              onValueChange={(value) =>
                setFormData({ ...formData, must_share_denomination: value })
              }
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor='#ffffff'
            />
          </View>
        </View>

        {/* Lifestyle & Background Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Lifestyle & Background
          </Text>

          {/* Dealbreakers */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Deal-breakers (Optional)
            </Text>
            <Text
              style={[styles.helperText, { color: theme.colors.textMuted }]}>
              Select any factors that are absolute no-gos for you
            </Text>
            <View style={styles.chipsContainer}>
              {DEALBREAKERS.map((dealbreaker) => {
                const isSelected = formData.dealbreakers.includes(dealbreaker);
                return (
                  <TouchableOpacity
                    key={dealbreaker}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: isSelected
                          ? `${theme.colors.primary}20`
                          : 'transparent',
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                    onPress={() => toggleDealbreaker(dealbreaker)}>
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected
                            ? theme.colors.primary
                            : theme.colors.text,
                          fontWeight: isSelected ? '600' : '400',
                        },
                      ]}>
                      {dealbreaker}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Info Box */}
        <View
          style={[
            styles.infoBox,
            { backgroundColor: `${theme.colors.primary}10` },
          ]}>
          <Ionicons
            name='information-circle'
            size={20}
            color={theme.colors.primary}
          />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            Your profile will be reviewed for safety and authenticity before
            being visible to others.
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View
        style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
            loading && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color='#ffffff' />
          ) : (
            <Text style={styles.submitButtonText}>Submit for Review</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 120,
  },
  progressContainer: {
    padding: 16,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
  },
  ageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ageValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  sliderLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  radiusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  radiusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    gap: 12,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
