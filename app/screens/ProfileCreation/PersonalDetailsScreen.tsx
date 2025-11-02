// src/screens/ProfileCreation/PersonalDetailsScreen.tsx
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/services/profile.service';
import {
  EDUCATION_LEVELS,
  HOBBIES,
  LANGUAGES,
  MAX_HEIGHT_CM,
  MIN_HEIGHT_CM,
} from '@/utils/constants';
import { cmToFeetInches } from '@/utils/helpers';
import { validateLength, validateRequired } from '@/utils/validation';
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

export const PersonalDetailsScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState({
    education_level: user?.education_level || '',
    profession: user?.profession || '',
    height_cm: user?.height_cm || 170,
    about_me: user?.about_me || '',
    hobbies: user?.hobbies || [],
    languages_spoken: user?.languages_spoken || ['English'],
  });

  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(formData.about_me.length);

  const toggleHobby = (hobby: string) => {
    if (formData.hobbies.includes(hobby)) {
      setFormData({
        ...formData,
        hobbies: formData.hobbies.filter((h) => h !== hobby),
      });
    } else {
      setFormData({
        ...formData,
        hobbies: [...formData.hobbies, hobby],
      });
    }
  };

  const toggleLanguage = (language: string) => {
    if (formData.languages_spoken.includes(language)) {
      // Don't allow removing if it's the last language
      if (formData.languages_spoken.length === 1) {
        Alert.alert('Required', 'You must have at least one language');
        return;
      }
      setFormData({
        ...formData,
        languages_spoken: formData.languages_spoken.filter(
          (l) => l !== language
        ),
      });
    } else {
      setFormData({
        ...formData,
        languages_spoken: [...formData.languages_spoken, language],
      });
    }
  };

  const handleContinue = async () => {
    // Validation
    const eduValidation = validateRequired(
      formData.education_level,
      'Education level'
    );
    if (!eduValidation.isValid) {
      Alert.alert('Required', eduValidation.error);
      return;
    }

    const profValidation = validateRequired(formData.profession, 'Profession');
    if (!profValidation.isValid) {
      Alert.alert('Required', profValidation.error);
      return;
    }

    const aboutValidation = validateLength(
      formData.about_me,
      50,
      500,
      'About Me'
    );
    if (!aboutValidation.isValid) {
      Alert.alert('Invalid', aboutValidation.error);
      return;
    }

    if (formData.hobbies.length === 0) {
      Alert.alert('Required', 'Please select at least one hobby or interest');
      return;
    }

    try {
      setLoading(true);
      const result = await profileService.updateProfile(user!.id, {
        education_level: formData.education_level,
        profession: formData.profession,
        height_cm: formData.height_cm,
        about_me: formData.about_me,
        hobbies: formData.hobbies,
        languages_spoken: formData.languages_spoken,
      });

      if (result.success) {
        await refreshUser();
        navigation.navigate('PartnerPreferences');
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
          A Little More About You
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>
            Step 4 of 5
          </Text>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.border },
            ]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary, width: '80%' },
              ]}
            />
          </View>
        </View>

        {/* Professional Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Professional Details
          </Text>

          {/* Education */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Education Level
            </Text>
            <View
              style={[
                styles.pickerWrapper,
                { borderColor: theme.colors.border },
              ]}>
              <Picker
                selectedValue={formData.education_level}
                onValueChange={(value) =>
                  setFormData({ ...formData, education_level: value })
                }
                style={[styles.picker, { color: theme.colors.text }]}>
                <Picker.Item label='Select your education' value='' />
                {EDUCATION_LEVELS.map((level) => (
                  <Picker.Item key={level} label={level} value={level} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Profession */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Profession / Occupation
            </Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: theme.colors.border, color: theme.colors.text },
              ]}
              placeholder='e.g., Software Engineer'
              placeholderTextColor={theme.colors.textMuted}
              value={formData.profession}
              onChangeText={(text) =>
                setFormData({ ...formData, profession: text })
              }
            />
          </View>
        </View>

        {/* Physical Attributes Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Physical Attributes
          </Text>

          {/* Height */}
          <View style={styles.inputContainer}>
            <View style={styles.heightHeader}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Height
              </Text>
              <Text
                style={[styles.heightValue, { color: theme.colors.primary }]}>
                {cmToFeetInches(formData.height_cm)}
              </Text>
            </View>
            <View style={styles.sliderContainer}>
              <input
                type='range'
                min={MIN_HEIGHT_CM}
                max={MAX_HEIGHT_CM}
                value={formData.height_cm}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    height_cm: parseInt(e.target.value),
                  })
                }
                style={{
                  width: '100%',
                  height: 8,
                  borderRadius: 4,
                  background: `linear-gradient(to right, ${
                    theme.colors.primary
                  } 0%, ${theme.colors.primary} ${
                    ((formData.height_cm - MIN_HEIGHT_CM) /
                      (MAX_HEIGHT_CM - MIN_HEIGHT_CM)) *
                    100
                  }%, ${theme.colors.border} ${
                    ((formData.height_cm - MIN_HEIGHT_CM) /
                      (MAX_HEIGHT_CM - MIN_HEIGHT_CM)) *
                    100
                  }%, ${theme.colors.border} 100%)`,
                }}
              />
              <View style={styles.heightRange}>
                <Text
                  style={[styles.rangeText, { color: theme.colors.textMuted }]}>
                  {cmToFeetInches(MIN_HEIGHT_CM)}
                </Text>
                <Text
                  style={[styles.rangeText, { color: theme.colors.textMuted }]}>
                  {cmToFeetInches(MAX_HEIGHT_CM)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* About You Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About You
          </Text>

          {/* About Me */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              About Me
            </Text>
            <Text
              style={[styles.helperText, { color: theme.colors.textMuted }]}>
              {`Share a bit about your values, personality, and what you're looking for.`}
            </Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                placeholder='Tell us about yourself...'
                placeholderTextColor={theme.colors.textMuted}
                value={formData.about_me}
                onChangeText={(text) => {
                  if (text.length <= 500) {
                    setFormData({ ...formData, about_me: text });
                    setCharCount(text.length);
                  }
                }}
                multiline
                numberOfLines={5}
                maxLength={500}
              />
              <Text
                style={[styles.charCount, { color: theme.colors.textMuted }]}>
                {charCount}/500
              </Text>
            </View>
          </View>

          {/* Hobbies */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Hobbies & Interests
            </Text>
            <View style={styles.chipsContainer}>
              {HOBBIES.map((hobby) => {
                const isSelected = formData.hobbies.includes(hobby);
                return (
                  <TouchableOpacity
                    key={hobby}
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
                    onPress={() => toggleHobby(hobby)}>
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
                      {hobby}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Languages */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Languages Spoken
            </Text>
            <View style={styles.languagesList}>
              {LANGUAGES.slice(0, -1).map((language) => {
                const isSelected = formData.languages_spoken.includes(language);
                return (
                  <TouchableOpacity
                    key={language}
                    style={[
                      styles.languageItem,
                      {
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.border,
                        backgroundColor: isSelected
                          ? `${theme.colors.primary}10`
                          : theme.colors.background,
                      },
                    ]}
                    onPress={() => toggleLanguage(language)}>
                    <View
                      style={[
                        styles.checkbox,
                        {
                          backgroundColor: isSelected
                            ? theme.colors.primary
                            : 'transparent',
                          borderColor: theme.colors.border,
                        },
                      ]}>
                      {isSelected && (
                        <Ionicons name='checkmark' size={16} color='#ffffff' />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.languageText,
                        { color: theme.colors.text },
                      ]}>
                      {language}
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
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
  },
  heightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heightValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  sliderContainer: {
    paddingVertical: 16,
  },
  heightRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rangeText: {
    fontSize: 12,
  },
  textAreaContainer: {
    position: 'relative',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontSize: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  languagesList: {
    gap: 8,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
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
