// src/screens/ProfileCreation/VerificationUploadScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profile.service';

type DocType =
  | 'government_id_front'
  | 'government_id_back'
  | 'church_letter'
  | 'baptism_certificate';

export const VerificationUploadScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [documents, setDocuments] = useState<{
    [key in DocType]?: string;
  }>({});

  const [uploading, setUploading] = useState<DocType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [faithDocType, setFaithDocType] = useState<
    'church_letter' | 'baptism_certificate'
  >('church_letter');

  const pickDocument = async (type: DocType) => {
    try {
      setUploading(type);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
      });

      if (result.canceled) {
        setUploading(null);
        return;
      }

      const file = result.assets[0];

      // Upload to Supabase
      const uploadResult = await profileService.uploadVerificationDocument(
        user!.id,
        type,
        file.uri
      );

      if (uploadResult.success && uploadResult.data) {
        setDocuments({ ...documents, [type]: uploadResult.data.file_url });
        Alert.alert('Success', 'Document uploaded successfully!');
      } else {
        Alert.alert('Error', uploadResult.error || 'Failed to upload document');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async () => {
    if (!documents.government_id_front || !documents.government_id_back) {
      Alert.alert('Required', 'Please upload both sides of your government ID');
      return;
    }

    try {
      setSubmitting(true);
      const result = await profileService.submitForVerification(user!.id);

      if (result.success) {
        Alert.alert(
          'Submitted!',
          'Your documents have been submitted for verification. This usually takes 24-48 hours.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PersonalDetails'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Error',
          result.error || 'Failed to submit for verification'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderUploadCard = (
    type: DocType,
    title: string,
    description: string,
    required: boolean = true
  ) => {
    const uploaded = documents[type];
    const isUploading = uploading === type;

    return (
      <View style={styles.uploadCard}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            {title}{' '}
            {required && <Text style={{ color: theme.colors.error }}>*</Text>}
          </Text>
          <Text
            style={[styles.cardDescription, { color: theme.colors.textMuted }]}>
            {description}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.uploadArea,
            {
              borderColor: uploaded
                ? theme.colors.success
                : theme.colors.border,
              backgroundColor: uploaded
                ? `${theme.colors.success}10`
                : theme.colors.background,
            },
          ]}
          onPress={() => pickDocument(type)}
          disabled={isUploading}>
          {isUploading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : uploaded ? (
            <>
              <Ionicons
                name='checkmark-circle'
                size={40}
                color={theme.colors.success}
              />
              <Text
                style={[styles.uploadedText, { color: theme.colors.success }]}>
                Uploaded Successfully
              </Text>
            </>
          ) : (
            <>
              <Ionicons
                name='cloud-upload-outline'
                size={40}
                color={theme.colors.textMuted}
              />
              <Text
                style={[styles.uploadText, { color: theme.colors.textMuted }]}>
                Tap to Upload
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
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
          Complete Your Verification
        </Text>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons
            name='information-circle-outline'
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={[styles.progressText, { color: theme.colors.text }]}>
            Step 3 of 5
          </Text>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.border },
            ]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.colors.primary, width: '60%' },
              ]}
            />
          </View>
          <Text
            style={[styles.progressLabel, { color: theme.colors.textMuted }]}>
            Document Upload
          </Text>
        </View>

        {/* Government ID */}
        <View style={styles.section}>
          {renderUploadCard(
            'government_id_front',
            'Government Issued ID',
            "Upload the front of your Driver's License or Passport.",
            true
          )}
          {renderUploadCard(
            'government_id_back',
            'ID Back Side',
            'Upload the back of your ID.',
            true
          )}
        </View>

        {/* Faith Documents */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Proof of Faith
          </Text>
          <Text style={[styles.sectionDesc, { color: theme.colors.textMuted }]}>
            Upload a letter from your pastor or your baptism certificate.
          </Text>

          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                faithDocType === 'church_letter' && styles.toggleButtonActive,
                {
                  backgroundColor:
                    faithDocType === 'church_letter'
                      ? '#ffffff'
                      : 'transparent',
                },
              ]}
              onPress={() => setFaithDocType('church_letter')}>
              <Text
                style={[
                  styles.toggleText,
                  {
                    color:
                      faithDocType === 'church_letter'
                        ? theme.colors.primary
                        : theme.colors.textMuted,
                  },
                ]}>
                Church Letter
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                faithDocType === 'baptism_certificate' &&
                  styles.toggleButtonActive,
                {
                  backgroundColor:
                    faithDocType === 'baptism_certificate'
                      ? '#ffffff'
                      : 'transparent',
                },
              ]}
              onPress={() => setFaithDocType('baptism_certificate')}>
              <Text
                style={[
                  styles.toggleText,
                  {
                    color:
                      faithDocType === 'baptism_certificate'
                        ? theme.colors.primary
                        : theme.colors.textMuted,
                  },
                ]}>
                Baptism Certificate
              </Text>
            </TouchableOpacity>
          </View>

          {renderUploadCard(
            faithDocType,
            faithDocType === 'church_letter'
              ? 'Church Letter'
              : 'Baptism Certificate',
            `Upload your ${
              faithDocType === 'church_letter'
                ? 'church letter'
                : 'baptism certificate'
            }.`,
            false
          )}
        </View>

        {/* Info */}
        <View
          style={[
            styles.infoBox,
            { backgroundColor: `${theme.colors.primary}10` },
          ]}>
          <Ionicons name='lock-closed' size={20} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.text }]}>
            Your information is encrypted and secure.
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
            (!documents.government_id_front ||
              !documents.government_id_back ||
              submitting) &&
              styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={
            !documents.government_id_front ||
            !documents.government_id_back ||
            submitting
          }>
          {submitting ? (
            <ActivityIndicator color='#ffffff' />
          ) : (
            <Text style={styles.submitButtonText}>Submit for Verification</Text>
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
  infoButton: {
    padding: 8,
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
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 14,
    marginBottom: 16,
  },
  uploadCard: {
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
  },
  uploadArea: {
    height: 120,
    borderWidth: 2,
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  uploadedText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
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
    opacity: 0.5,
  },
});
