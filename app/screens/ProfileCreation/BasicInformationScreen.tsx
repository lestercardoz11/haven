// src/screens/ProfileCreation/BasicInformationScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { calculateAge, validateDateOfBirth } from '../../utils/validation';

export const BasicInformationScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    date_of_birth: new Date(),
    gender: user?.gender || '',
    current_location: '',
    profile_photo_url: user?.profile_photo_url || '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date_of_birth: selectedDate });
    }
  };

  const handlePhotoUpload = async () => {
    try {
      setUploadingPhoto(true);
      const result = await profileService.pickAndUploadPhoto(user!.id);

      if (result.success && result.data) {
        setFormData({ ...formData, profile_photo_url: result.data });
        Alert.alert('Success', 'Profile photo uploaded successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to upload photo');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleContinue = async () => {
    // Validate
    if (!formData.profile_photo_url) {
      Alert.alert('Required', 'Please upload a profile photo');
      return;
    }

    const dobValidation = validateDateOfBirth(
      formData.date_of_birth.toISOString().split('T')[0]
    );
    if (!dobValidation.isValid) {
      Alert.alert('Error', dobValidation.error);
      return;
    }

    if (!formData.gender) {
      Alert.alert('Required', 'Please select your gender');
      return;
    }

    if (!formData.current_location.trim()) {
      Alert.alert('Required', 'Please enter your current location');
      return;
    }

    try {
      setLoading(true);
      const result = await profileService.updateProfile(user!.id, {
        date_of_birth: formData.date_of_birth.toISOString().split('T')[0],
        gender: formData.gender as 'male' | 'female',
        current_location: formData.current_location,
        profile_photo_url: formData.profile_photo_url,
      });

      if (result.success) {
        await refreshUser();
        navigation.navigate('FaithProfile');
      } else {
        Alert.alert('Error', result.error || 'Failed to save profile');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const age = calculateAge(formData.date_of_birth.toISOString().split('T')[0]);

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
          Create Your Profile
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressText, { color: theme.colors.text }]}>
              Step 1 of 5
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
                { backgroundColor: theme.colors.primary, width: '20%' },
              ]}
            />
          </View>
          <Text
            style={[styles.progressLabel, { color: theme.colors.textMuted }]}>
            Personal Details
          </Text>
        </View>

        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            {formData.profile_photo_url ? (
              <Image
                source={{ uri: formData.profile_photo_url }}
                style={styles.profilePhoto}
              />
            ) : (
              <View
                style={[
                  styles.photoPlaceholder,
                  { backgroundColor: theme.colors.border },
                ]}>
                <Ionicons
                  name='camera'
                  size={48}
                  color={theme.colors.textMuted}
                />
              </View>
            )}
          </View>
          <Text style={[styles.photoTitle, { color: theme.colors.text }]}>
            Add a Profile Photo
          </Text>
          <TouchableOpacity
            style={[
              styles.uploadButton,
              { backgroundColor: `${theme.colors.primary}20` },
            ]}
            onPress={handlePhotoUpload}
            disabled={uploadingPhoto}>
            {uploadingPhoto ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Text
                style={[
                  styles.uploadButtonText,
                  { color: theme.colors.primary },
                ]}>
                Upload Photo
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Date of Birth */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Date of Birth
            </Text>
            <TouchableOpacity
              style={[styles.dateInput, { borderColor: theme.colors.border }]}
              onPress={() => setShowDatePicker(true)}>
              <Text style={[styles.dateText, { color: theme.colors.text }]}>
                {formData.date_of_birth.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <Ionicons
                name='calendar-outline'
                size={20}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
            {age >= 21 && (
              <Text
                style={[styles.helperText, { color: theme.colors.success }]}>
                Age: {age} years old ✓
              </Text>
            )}
            {age < 21 &&
              formData.date_of_birth.getFullYear() !==
                new Date().getFullYear() && (
                <Text
                  style={[styles.helperText, { color: theme.colors.error }]}>
                  You must be at least 21 years old to join
                </Text>
              )}
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.date_of_birth}
              mode='date'
              display='spinner'
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1924, 0, 1)}
            />
          )}

          {/* Gender */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Gender
            </Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  {
                    backgroundColor:
                      formData.gender === 'male'
                        ? `${theme.colors.primary}20`
                        : 'transparent',
                    borderColor:
                      formData.gender === 'male'
                        ? theme.colors.primary
                        : theme.colors.border,
                    borderWidth: formData.gender === 'male' ? 2 : 1,
                  },
                ]}
                onPress={() => setFormData({ ...formData, gender: 'male' })}>
                <Text
                  style={[
                    styles.genderText,
                    {
                      color:
                        formData.gender === 'male'
                          ? theme.colors.primary
                          : theme.colors.text,
                      fontWeight: formData.gender === 'male' ? '700' : '500',
                    },
                  ]}>
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.genderButton,
                  {
                    backgroundColor:
                      formData.gender === 'female'
                        ? `${theme.colors.primary}20`
                        : 'transparent',
                    borderColor:
                      formData.gender === 'female'
                        ? theme.colors.primary
                        : theme.colors.border,
                    borderWidth: formData.gender === 'female' ? 2 : 1,
                  },
                ]}
                onPress={() => setFormData({ ...formData, gender: 'female' })}>
                <Text
                  style={[
                    styles.genderText,
                    {
                      color:
                        formData.gender === 'female'
                          ? theme.colors.primary
                          : theme.colors.text,
                      fontWeight: formData.gender === 'female' ? '700' : '500',
                    },
                  ]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Current Location */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Current Location
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { borderColor: theme.colors.border },
              ]}>
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder='e.g. City, Country'
                placeholderTextColor={theme.colors.textMuted}
                value={formData.current_location}
                onChangeText={(text) =>
                  setFormData({ ...formData, current_location: text })
                }
              />
              <Ionicons
                name='location-outline'
                size={20}
                color={theme.colors.textMuted}
              />
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
    paddingBottom: 100,
  },
  progressContainer: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '500',
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
  progressLabel: {
    fontSize: 14,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  photoContainer: {
    marginBottom: 16,
  },
  profilePhoto: {
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  photoPlaceholder: {
    width: 128,
    height: 128,
    borderRadius: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  uploadButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  formContainer: {
    paddingHorizontal: 16,
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  dateText: {
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderText: {
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
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
