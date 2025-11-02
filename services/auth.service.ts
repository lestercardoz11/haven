// src/services/auth.service.ts
import { ApiResponse } from '@/types/common.types';
import type { User } from '@/types/user.types';
import {
  calculateAge,
  validateEmail,
  validatePassword,
  validatePhone,
} from '@/utils/validation';
import { supabase } from './supabase';

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  date_of_birth: string;
  gender: 'male' | 'female';
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<ApiResponse<User>> {
    try {
      // Validate all fields
      const emailValidation = validateEmail(data.email);
      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.error };
      }

      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.error };
      }

      if (data.phone) {
        const phoneValidation = validatePhone(data.phone);
        if (!phoneValidation.isValid) {
          return { success: false, error: phoneValidation.error };
        }
      }

      // Check age requirement (must be 21+)
      const age = calculateAge(data.date_of_birth);
      if (age < 21) {
        return {
          success: false,
          error: 'You must be at least 21 years old to join Haven.',
        };
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to create user account' };
      }

      // Create profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: data.email,
          full_name: data.full_name,
          phone: data.phone,
          date_of_birth: data.date_of_birth,
          gender: data.gender,
          current_location: '',
          verification_status: 'pending',
          is_christian_verified: false,
          marriage_intent_verified: false,
          profile_completion_percentage: 15,
          onboarding_completed: false,
        })
        .select()
        .single();

      if (profileError) {
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { success: false, error: profileError.message };
      }

      return { success: true, data: profileData };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  }

  /**
   * Sign in existing user
   */
  async signIn(data: SignInData): Promise<ApiResponse<User>> {
    try {
      const emailValidation = validateEmail(data.email);
      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.error };
      }

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        return { success: false, error: 'Invalid email or password' };
      }

      if (!authData.user) {
        return { success: false, error: 'Failed to sign in' };
      }

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        return { success: false, error: 'Failed to fetch user profile' };
      }

      // Check if user is flagged or inactive
      if (profileData.is_flagged) {
        await this.signOut();
        return {
          success: false,
          error: 'Your account has been flagged. Please contact support.',
        };
      }

      if (!profileData.is_active) {
        await this.signOut();
        return {
          success: false,
          error: 'Your account has been deactivated.',
        };
      }

      // Update last active
      await supabase
        .from('profiles')
        .update({ last_active_at: new Date().toISOString() })
        .eq('id', authData.user.id);

      return { success: true, data: profileData };
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign in failed' };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Sign out failed' };
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    return { data: data.session, error };
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return { success: false, error: 'Failed to fetch user profile' };
      }

      return { success: true, data: profileData };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get current user',
      };
    }
  }

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<ApiResponse<void>> {
    try {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.error };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'havenmatrimony://reset-password',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password reset failed',
      };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<ApiResponse<void>> {
    try {
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.error };
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Password update failed',
      };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Verify marriage intent through questionnaire
   */
  async verifyMarriageIntent(
    userId: string,
    answers: any[]
  ): Promise<ApiResponse<boolean>> {
    try {
      // Check if answers demonstrate genuine marriage intent
      // This is a simplified check - you'd implement more sophisticated logic
      const requiredPositiveAnswers = answers.filter(
        (a) =>
          a.answer.includes('marriage') ||
          a.answer.includes('lifetime') ||
          a.answer.includes('committed')
      );

      const isVerified = requiredPositiveAnswers.length >= 3;

      // Update user profile
      await supabase
        .from('profiles')
        .update({ marriage_intent_verified: isVerified })
        .eq('id', userId);

      if (!isVerified) {
        // Flag user for review
        await supabase
          .from('profiles')
          .update({
            is_flagged: true,
            flag_reason: 'Marriage intent verification failed',
          })
          .eq('id', userId);
      }

      return { success: true, data: isVerified };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify Christian faith through questionnaire
   */
  async verifyChristianFaith(
    userId: string,
    answers: any[]
  ): Promise<ApiResponse<boolean>> {
    try {
      // Check if answers demonstrate genuine Christian faith
      // This is a simplified check - implement more sophisticated validation
      const faithIndicators = [
        'jesus',
        'christ',
        'salvation',
        'gospel',
        'scripture',
        'bible',
        'church',
        'baptism',
        'prayer',
        'god',
      ];

      const validAnswers = answers.filter((a) => {
        const answerText = String(a.answer).toLowerCase();
        return faithIndicators.some((indicator) =>
          answerText.includes(indicator)
        );
      });

      const isVerified = validAnswers.length >= 4;

      // Update user profile
      await supabase
        .from('profiles')
        .update({ is_christian_verified: isVerified })
        .eq('id', userId);

      if (!isVerified) {
        // Flag user for review
        await supabase
          .from('profiles')
          .update({
            is_flagged: true,
            flag_reason: 'Christian faith verification failed',
          })
          .eq('id', userId);
      }

      return { success: true, data: isVerified };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const authService = new AuthService();
