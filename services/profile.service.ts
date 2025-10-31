// src/services/profile.service.ts
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { ApiResponse } from '../types/common.types';
import { ProfileUpdateData } from '../types/profile.types';
import { User, VerificationDocument } from '../types/user.types';
import { calculateProfileCompletion } from '../utils/helpers';
import { supabase } from './supabase';

class ProfileService {
  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updates: ProfileUpdateData
  ): Promise<ApiResponse<User>> {
    try {
      // Calculate new completion percentage
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const updatedProfile = { ...currentProfile, ...updates };
      const completionPercentage = calculateProfileCompletion(updatedProfile);

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          profile_completion_percentage: completionPercentage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(
    userId: string,
    uri: string
  ): Promise<ApiResponse<string>> {
    try {
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        return { success: false, error: 'File does not exist' };
      }

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });

      // Generate unique filename
      const fileExt = uri.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `profile_photos/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, decode(base64), {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('user-uploads').getPublicUrl(filePath);

      // Update profile with photo URL
      await this.updateProfile(userId, { profile_photo_url: publicUrl });

      return { success: true, data: publicUrl };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Pick and upload profile photo
   */
  async pickAndUploadPhoto(userId: string): Promise<ApiResponse<string>> {
    try {
      // Request permission
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        return {
          success: false,
          error: 'Permission to access photos was denied',
        };
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return { success: false, error: 'Photo selection cancelled' };
      }

      // Upload photo
      return await this.uploadProfilePhoto(userId, result.assets[0].uri);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Upload verification document
   */
  async uploadVerificationDocument(
    userId: string,
    documentType: VerificationDocument['document_type'],
    uri: string
  ): Promise<ApiResponse<VerificationDocument>> {
    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64',
      });

      // Generate unique filename
      const fileExt = uri.split('.').pop();
      const fileName = `${userId}_${documentType}_${Date.now()}.${fileExt}`;
      const filePath = `verification_documents/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, decode(base64), {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (uploadError) {
        return { success: false, error: uploadError.message };
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('user-uploads').getPublicUrl(filePath);

      // Save document record
      const { data, error } = await supabase
        .from('verification_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          file_url: publicUrl,
          file_name: fileName,
          verification_status: 'pending',
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit profile for verification
   */
  async submitForVerification(userId: string): Promise<ApiResponse<void>> {
    try {
      // Check if all required documents are uploaded
      const { data: documents } = await supabase
        .from('verification_documents')
        .select('document_type')
        .eq('user_id', userId);

      const requiredDocs = ['government_id_front', 'government_id_back'];
      const uploadedTypes = documents?.map((d) => d.document_type) || [];
      const hasAllRequired = requiredDocs.every((type) =>
        uploadedTypes.includes(type)
      );

      if (!hasAllRequired) {
        return {
          success: false,
          error: 'Please upload both sides of your government ID',
        };
      }

      // Update verification status
      const { error } = await supabase
        .from('profiles')
        .update({
          verification_status: 'under_review',
          verification_submitted_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get profile statistics
   */
  async getProfileStats(userId: string): Promise<ApiResponse<any>> {
    try {
      // Get profile views count
      const { count: viewsCount } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('viewed_profile_id', userId);

      // Get interests received
      const { count: interestsReceived } = await supabase
        .from('interests')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId);

      // Get interests sent
      const { count: interestsSent } = await supabase
        .from('interests')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', userId);

      // Get matches count
      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'connected');

      return {
        success: true,
        data: {
          profile_views: viewsCount || 0,
          interests_received: interestsReceived || 0,
          interests_sent: interestsSent || 0,
          matches_count: matchesCount || 0,
        },
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Deactivate account
   */
  async deactivateAccount(userId: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Delete account permanently
   */
  async deleteAccount(userId: string): Promise<ApiResponse<void>> {
    try {
      // This will cascade delete all related data due to foreign keys
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

// Helper function to decode base64
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const profileService = new ProfileService();
