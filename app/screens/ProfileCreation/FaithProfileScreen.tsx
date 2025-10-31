// src/screens/ProfileCreation/FaithProfileScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profile.service';
import {
  CHURCH_ATTENDANCE_FREQUENCY,
  DENOMINATIONS,
  MINISTRY_INVOLVEMENT,
} from '../../utils/constants';

export const FaithProfileScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    denomination: user?.denomination || '',
    church_name: user?.church_name || '',
    church_address: user?.church_address || '',
    years_practicing: user?.years_practicing || 0,
    is_baptized: user?.is_baptized ?? true,
    baptism_status: user?.baptism_status || 'yes',
    church_attendance_frequency: user?.church_attendance_frequency || '',
    ministry_involvement: user?.ministry_involvement || [],
  });

  const [loading, setLoading] = useState(false);
  const [showYearsInput, setShowYearsInput] = useState(false);

  const toggleMinistry = (ministry: string) => {
    const current = formData.ministry_involvement || [];
    if (current.includes(ministry)) {
      setFormData({
        ...formData,
        ministry_involvement: current.filter((m) => m !== ministry),
      });
    } else {
      setFormData({
        ...formData,
        ministry_involvement: [...current, ministry],
      });
    }
  };

  const handleContinue = async () => {
    // Validate required fields
    if (!formData.denomination) {
      Alert.alert('Required', 'Please select your denomination');
      return;
    }

    if (!formData.church_name.trim()) {
      Alert.alert('Required', 'Please enter your church name');
      return;
    }

    if (!formData.church_address.trim()) {
      Alert.alert('Required', 'Please enter your church address');
      return;
    }

    if (!formData.church_attendance_frequency) {
      Alert.alert('Required', 'Please select how often you attend church');
      return;
    }

    if (formData.years_practicing < 0) {
      Alert.alert('Invalid', 'Years practicing cannot be negative');
      return;
    }

    try {
      setLoading(true);
      const result = await profileService.updateProfile(user!.id, {
        denomination: formData.denomination,
        church_name: formData.church_name,
        church_address: formData.church_address,
        years_practicing: formData.years_practicing,
        is_baptized: formData.baptism_status === 'yes',
        baptism_status: formData.baptism_status as any,
        church_attendance_frequency: formData.church_attendance_frequency,
        ministry_involvement: formData.ministry_involvement,
      });

      if (result.success) {
        await refreshUser();
        navigation.navigate('VerificationUpload');
      } else {
        Alert.alert('Error', result.error || 'Failed to save profile');
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
          Faith & Church Life
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>
            Step 2 of 5
          </Text>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.border },
            ]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary, width: '40%' },
              ]}
            />
          </View>
        </View>

        {/* Section: Church Affiliation */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Church Affiliation
          </Text>

          {/* Denomination */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Denomination
            </Text>
            <View
              style={[
                styles.pickerWrapper,
                { borderColor: theme.colors.border },
              ]}>
              <Picker
                selectedValue={formData.denomination}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, denomination: value })
                }
                style={[styles.picker, { color: theme.colors.text }]}>
                <Picker.Item label='Select your denomination' value='' />
                {DENOMINATIONS.map((denom) => (
                  <Picker.Item key={denom} label={denom} value={denom} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Church Name */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {`Your Church's Name`}
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.colors.border, color: theme.colors.text },
              ]}
              placeholder='e.g., Redeemer Presbyterian Church'
              placeholderTextColor={theme.colors.textMuted}
              value={formData.church_name}
              onChangeText={(text) =>
                setFormData({ ...formData, church_name: text })
              }
            />
          </View>

          {/* Church Address */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Church Address
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.colors.border, color: theme.colors.text },
              ]}
              placeholder='123 Main St, Anytown, USA'
              placeholderTextColor={theme.colors.textMuted}
              value={formData.church_address}
              onChangeText={(text) =>
                setFormData({ ...formData, church_address: text })
              }
            />
          </View>
        </View>

        {/* Section: Personal Faith */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Personal Faith
          </Text>

          {/* Years Practicing */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              How long have you been a practicing Christian?
            </Text>
            <TouchableOpacity
              style={[styles.input, { borderColor: theme.colors.border }]}
              onPress={() => setShowYearsInput(true)}>
              <Text style={[styles.inputText, { color: theme.colors.text }]}>
                {formData.years_practicing} years
              </Text>
            </TouchableOpacity>
            {showYearsInput && (
              <View style={styles.sliderContainer}>
                <TextInput
                  style={[
                    styles.yearsInput,
                    {
                      borderColor: theme.colors.border,
                      color: theme.colors.text,
                    },
                  ]}
                  keyboardType='number-pad'
                  value={String(formData.years_practicing)}
                  onChangeText={(text) => {
                    const num = parseInt(text) || 0;
                    setFormData({
                      ...formData,
                      years_practicing: Math.min(num, 100),
                    });
                  }}
                  onBlur={() => setShowYearsInput(false)}
                  autoFocus
                />
              </View>
            )}
          </View>

          {/* Baptism Status */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Are you baptized?
            </Text>
            <View style={styles.baptismContainer}>
              {['yes', 'no', 'planning'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.baptismButton,
                    {
                      backgroundColor:
                        formData.baptism_status === status
                          ? theme.colors.primary
                          : 'transparent',
                      borderColor:
                        formData.baptism_status === status
                          ? theme.colors.primary
                          : theme.colors.border,
                    },
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, baptism_status: status as any })
                  }>
                  <Text
                    style={[
                      styles.baptismText,
                      {
                        color:
                          formData.baptism_status === status
                            ? '#ffffff'
                            : theme.colors.text,
                      },
                    ]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Section: Church Involvement */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Church Involvement
          </Text>

          {/* Attendance Frequency */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              How often do you attend church services?
            </Text>
            <View
              style={[
                styles.pickerWrapper,
                { borderColor: theme.colors.border },
              ]}>
              <Picker
                selectedValue={formData.church_attendance_frequency}
                onValueChange={(value: any) =>
                  setFormData({
                    ...formData,
                    church_attendance_frequency: value,
                  })
                }
                style={[styles.picker, { color: theme.colors.text }]}>
                <Picker.Item label='Select frequency' value='' />
                {CHURCH_ATTENDANCE_FREQUENCY.map((freq) => (
                  <Picker.Item key={freq} label={freq} value={freq} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Ministry Involvement */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              How are you involved in your ministry?
            </Text>
            <View style={styles.ministryGrid}>
              {MINISTRY_INVOLVEMENT.map((ministry) => {
                const isSelected =
                  formData.ministry_involvement?.includes(ministry);
                return (
                  <TouchableOpacity
                    key={ministry}
                    style={[
                      styles.ministryChip,
                      {
                        backgroundColor: isSelected
                          ? `${theme.colors.primary}20`
                          : 'transparent',
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                      },
                    ]}
                    onPress={() => toggleMinistry(ministry)}>
                    <Text
                      style={[
                        styles.ministryText,
                        {
                          color: isSelected
                            ? theme.colors.primary
                            : theme.colors.text,
                          fontWeight: isSelected ? '600' : '400',
                        },
                      ]}>
                      {ministry}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View
        style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: theme.colors.primary },
            loading && styles.buttonDisabled,
          ]}
          onPress={handleContinue}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color='#ffffff' />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
  },
  sliderContainer: {
    marginTop: 8,
  },
  yearsInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 16,
  },
  baptismContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  baptismButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  baptismText: {
    fontSize: 16,
  },
  ministryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ministryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },
  ministryText: {
    fontSize: 14,
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
  continueButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

// Note: You'll need to install this package:
// npm install @react-native-picker/picker
// or
// npx expo install @react-native-picker/picker
