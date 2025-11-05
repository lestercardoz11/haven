// src/screens/RegistrationScreen.tsx
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import {
  getPasswordStrength,
  validateEmail,
  validatePhone,
} from '@/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export const RegistrationScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    date_of_birth: new Date(),
    gender: '' as 'male' | 'female' | '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeAge, setAgreeAge] = useState(false);
  const [isChristian, setIsChristian] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);

  const handleRegister = async () => {
    // Validate all fields
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.password ||
      !formData.gender
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      Alert.alert('Error', emailValidation.error);
      return;
    }

    if (formData.phone) {
      const phoneValidation = validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        Alert.alert('Error', phoneValidation.error);
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (passwordStrength.strength === 'weak') {
      Alert.alert('Weak Password', 'Please choose a stronger password');
      return;
    }

    if (!agreeAge) {
      Alert.alert('Error', 'You must be 21+ to join Haven');
      return;
    }

    if (!isChristian) {
      Alert.alert('Error', 'You must be a Christian to join Haven');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the Terms & Privacy Policy');
      return;
    }

    try {
      setLoading(true);
      await signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth.toISOString().split('T')[0],
        gender: formData.gender,
        marriage_intent_verified: agreeAge,
        is_christian_verified: isChristian,
      });
      // Navigation will be handled by AuthContext
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Join Our Community
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
            Create an account to find your faithful partner.
          </Text>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Full Name
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { borderColor: theme.colors.border },
              ]}>
              <Ionicons
                name='person-outline'
                size={20}
                color={theme.colors.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder='Enter your full name'
                placeholderTextColor={theme.colors.textMuted}
                value={formData.full_name}
                onChangeText={(text) =>
                  setFormData({ ...formData, full_name: text })
                }
                autoCapitalize='words'
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Email
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { borderColor: theme.colors.border },
              ]}>
              <Ionicons
                name='mail-outline'
                size={20}
                color={theme.colors.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder='Enter your email address'
                placeholderTextColor={theme.colors.textMuted}
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
                keyboardType='email-address'
                autoCapitalize='none'
                autoComplete='email'
              />
            </View>
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Phone (Optional)
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { borderColor: theme.colors.border },
              ]}>
              <Ionicons
                name='call-outline'
                size={20}
                color={theme.colors.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder='Enter your phone number'
                placeholderTextColor={theme.colors.textMuted}
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
                keyboardType='phone-pad'
                autoComplete='tel'
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { borderColor: theme.colors.border },
              ]}>
              <Ionicons
                name='lock-closed-outline'
                size={20}
                color={theme.colors.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text, flex: 1 }]}
                placeholder='Create a password'
                placeholderTextColor={theme.colors.textMuted}
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
                secureTextEntry={!showPassword}
                autoCapitalize='none'
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Password Strength */}
            {formData.password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthFill,
                      {
                        width: `${passwordStrength.percentage}%`,
                        backgroundColor:
                          passwordStrength.strength === 'weak'
                            ? '#D0021B'
                            : passwordStrength.strength === 'medium'
                            ? '#F5A623'
                            : '#4CD964',
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.strengthText,
                    {
                      color:
                        passwordStrength.strength === 'weak'
                          ? '#D0021B'
                          : passwordStrength.strength === 'medium'
                          ? '#F5A623'
                          : '#4CD964',
                    },
                  ]}>
                  {passwordStrength.strength.charAt(0).toUpperCase() +
                    passwordStrength.strength.slice(1)}
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Confirm Password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { borderColor: theme.colors.border },
              ]}>
              <Ionicons
                name='lock-closed-outline'
                size={20}
                color={theme.colors.textMuted}
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text, flex: 1 }]}
                placeholder='Confirm your password'
                placeholderTextColor={theme.colors.textMuted}
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                secureTextEntry={!showConfirmPassword}
                autoCapitalize='none'
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={theme.colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

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
                    },
                  ]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Checkboxes */}
          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreeAge(!agreeAge)}>
              <View
                style={[
                  styles.checkboxBox,
                  {
                    backgroundColor: agreeAge
                      ? theme.colors.primary
                      : 'transparent',
                    borderColor: theme.colors.border,
                  },
                ]}>
                {agreeAge && (
                  <Ionicons name='checkmark' size={16} color='#ffffff' />
                )}
              </View>
              <Text style={[styles.checkboxText, { color: theme.colors.text }]}>
                I am 21+ and seeking marriage.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setIsChristian(!isChristian)}>
              <View
                style={[
                  styles.checkboxBox,
                  {
                    backgroundColor: isChristian
                      ? theme.colors.primary
                      : 'transparent',
                    borderColor: theme.colors.border,
                  },
                ]}>
                {isChristian && (
                  <Ionicons name='checkmark' size={16} color='#ffffff' />
                )}
              </View>
              <Text style={[styles.checkboxText, { color: theme.colors.text }]}>
                I am a Christian.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setAgreeTerms(!agreeTerms)}>
              <View
                style={[
                  styles.checkboxBox,
                  {
                    backgroundColor: agreeTerms
                      ? theme.colors.primary
                      : 'transparent',
                    borderColor: theme.colors.border,
                  },
                ]}>
                {agreeTerms && (
                  <Ionicons name='checkmark' size={16} color='#ffffff' />
                )}
              </View>
              <Text style={[styles.checkboxText, { color: theme.colors.text }]}>
                I agree to the{' '}
                <Text style={{ color: theme.colors.primary }}>Terms</Text> &{' '}
                <Text style={{ color: theme.colors.primary }}>
                  Privacy Policy
                </Text>
                .
              </Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: theme.colors.primary },
              loading && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color='#ffffff' />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text
              style={[styles.signInText, { color: theme.colors.textMuted }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text
                style={[styles.signInLink, { color: theme.colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkboxContainer: {
    marginBottom: 24,
    gap: 16,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
  },
  continueButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: 14,
  },
  signInLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
