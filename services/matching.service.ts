// src/services/matching.service.ts
import { ApiResponse } from '@/types/common.types';
import { Interest, Match, MatchFilters } from '@/types/matching.types';
import { MatchStatus, User } from '@/types/user.types';
import { calculateAge } from '@/utils/validation';
import { supabase } from './supabase';

class MatchingService {
  /**
   * Calculate match score between two users
   */
  private calculateMatchScore(user1: User, user2: User): number {
    let score = 0;

    // Denomination match (30 points)
    if (user1.denomination === user2.denomination) {
      score += 30;
    } else if (
      user1.preferred_denominations?.includes(user2.denomination || '') ||
      user2.preferred_denominations?.includes(user1.denomination || '')
    ) {
      score += 15;
    }

    // Church attendance alignment (15 points)
    if (
      user1.church_attendance_frequency === user2.church_attendance_frequency
    ) {
      score += 15;
    }

    // Ministry involvement overlap (10 points)
    const commonMinistries =
      user1.ministry_involvement?.filter((m) =>
        user2.ministry_involvement?.includes(m)
      ).length || 0;
    score += Math.min(commonMinistries * 2, 10);

    // Education level compatibility (10 points)
    if (user1.education_level === user2.education_level) {
      score += 10;
    }

    // Hobbies overlap (10 points)
    const commonHobbies =
      user1.hobbies?.filter((h) => user2.hobbies?.includes(h)).length || 0;
    score += Math.min(commonHobbies * 2, 10);

    // Language compatibility (10 points)
    const commonLanguages =
      user1.languages_spoken?.filter((l) => user2.languages_spoken?.includes(l))
        .length || 0;
    score += Math.min(commonLanguages * 3, 10);

    // Age preference match (15 points)
    const user1Age = calculateAge(user1.date_of_birth);
    const user2Age = calculateAge(user2.date_of_birth);

    if (
      user1Age >= (user2.preferred_age_min || 0) &&
      user1Age <= (user2.preferred_age_max || 100) &&
      user2Age >= (user1.preferred_age_min || 0) &&
      user2Age <= (user1.preferred_age_max || 100)
    ) {
      score += 15;
    }

    return Math.min(score, 100);
  }

  /**
   * Get potential matches for a user
   */
  async getPotentialMatches(
    userId: string,
    filters?: MatchFilters
  ): Promise<ApiResponse<Match[]>> {
    try {
      // Get current user
      const { data: currentUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!currentUser) {
        return { success: false, error: 'User not found' };
      }

      // Build query for potential matches
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('is_active', true)
        .eq('verification_status', 'verified')
        .eq('is_christian_verified', true)
        .eq('marriage_intent_verified', true)
        .neq('id', userId)
        .neq('gender', currentUser.gender); // Opposite gender

      // Apply age filters
      const minAge = filters?.age_min || currentUser.preferred_age_min || 21;
      const maxAge = filters?.age_max || currentUser.preferred_age_max || 100;
      const today = new Date();
      const maxDate = new Date(
        today.getFullYear() - minAge,
        today.getMonth(),
        today.getDate()
      );
      const minDate = new Date(
        today.getFullYear() - maxAge,
        today.getMonth(),
        today.getDate()
      );

      query = query.gte('date_of_birth', minDate.toISOString());
      query = query.lte('date_of_birth', maxDate.toISOString());

      // Apply denomination filter
      if (filters?.denominations && filters.denominations.length > 0) {
        query = query.in('denomination', filters.denominations);
      } else if (
        currentUser.must_share_denomination &&
        currentUser.denomination
      ) {
        query = query.eq('denomination', currentUser.denomination);
      }

      const { data: potentialMatches, error } = await query;

      if (error) {
        return { success: false, error: error.message };
      }

      // Apply location filter
      if (filters?.location) {
        const [lat, lon] = filters.location.split(',').map(parseFloat);
        const radius = filters.radius_km || currentUser.preferred_radius_km || 50;

        const distance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
          const R = 6371; // Radius of the earth in km
          const dLat = (lat2 - lat1) * (Math.PI / 180);
          const dLon = (lon2 - lon1) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
              Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return R * c;
        };

        potentialMatches = potentialMatches?.filter((user) => {
          if (!user.current_location) return false;
          const [userLat, userLon] = user.current_location
            .split(',')
            .map(parseFloat);
          return distance(lat, lon, userLat, userLon) <= radius;
        });
      }

      // Get existing matches to exclude
      const { data: existingMatches } = await supabase
        .from('matches')
        .select('matched_user_id')
        .eq('user_id', userId);

      const existingMatchIds =
        existingMatches?.map((m) => m.matched_user_id) || [];

      // Filter out existing matches and calculate scores
      const matches: Match[] =
        potentialMatches
          ?.filter((user) => !existingMatchIds.includes(user.id))
          .map((user) => ({
            id: crypto.randomUUID(),
            user_id: userId,
            matched_user_id: user.id,
            match_score: this.calculateMatchScore(currentUser, user),
            match_date: new Date().toISOString(),
            status: 'new' as MatchStatus,
            created_at: new Date().toISOString(),
            matched_user: user,
          }))
          .sort((a, b) => b.match_score - a.match_score) || [];

      return { success: true, data: matches };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get user's matches
   */
  async getMatches(
    userId: string,
    status?: string
  ): Promise<ApiResponse<Match[]>> {
    try {
      let query = supabase
        .from('matches')
        .select(
          `
          *,
          matched_user:profiles!matches_matched_user_id_fkey(*)
        `
        )
        .eq('user_id', userId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('match_date', {
        ascending: false,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Send interest to a user
   */
  async sendInterest(
    senderId: string,
    receiverId: string,
    message?: string
  ): Promise<ApiResponse<Interest>> {
    try {
      // Check if interest already exists
      const { data: existing } = await supabase
        .from('interests')
        .select('*')
        .eq('sender_id', senderId)
        .eq('receiver_id', receiverId)
        .single();

      if (existing) {
        return { success: false, error: 'Interest already sent' };
      }

      // Create interest
      const { data, error } = await supabase
        .from('interests')
        .insert({
          sender_id: senderId,
          receiver_id: receiverId,
          message,
          status: 'pending',
        })
        .select(
          `
          *,
          sender:profiles!interests_sender_id_fkey(*),
          receiver:profiles!interests_receiver_id_fkey(*)
        `
        )
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
   * Respond to interest
   */
  async respondToInterest(
    interestId: string,
    accept: boolean
  ): Promise<ApiResponse<Interest>> {
    try {
      const status = accept ? 'accepted' : 'rejected';

      const { data, error } = await supabase
        .from('interests')
        .update({
          status,
          responded_at: new Date().toISOString(),
        })
        .eq('id', interestId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // If accepted, create a match and conversation
      if (accept) {
        await this.createMatch(data.sender_id, data.receiver_id);
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Create a match between two users
   */
  private async createMatch(user1Id: string, user2Id: string): Promise<void> {
    // Create conversation
    await supabase
      .from('conversations')
      .insert({
        participant_1_id: user1Id,
        participant_2_id: user2Id,
      })
      .select()
      .single();

    // Update matches to connected status
    await supabase
      .from('matches')
      .update({ status: 'connected' })
      .eq('user_id', user1Id)
      .eq('matched_user_id', user2Id);

    await supabase
      .from('matches')
      .update({ status: 'connected' })
      .eq('user_id', user2Id)
      .eq('matched_user_id', user1Id);
  }

  /**
   * Pass on a match
   */
  async passMatch(
    userId: string,
    matchedUserId: string
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ status: 'passed' })
        .eq('user_id', userId)
        .eq('matched_user_id', matchedUserId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Record profile view
   */
  async recordProfileView(
    viewerId: string,
    viewedProfileId: string
  ): Promise<void> {
    await supabase.from('profile_views').insert({
      viewer_id: viewerId,
      viewed_profile_id: viewedProfileId,
    });
  }

  /**
   * Block a user
   */
  async blockUser(
    blockerId: string,
    blockedUserId: string
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from('blocked_users').insert({
        blocker_id: blockerId,
        blocked_user_id: blockedUserId,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Report a user
   */
  async reportUser(
    reporterId: string,
    reportedUserId: string,
    reason: string,
    description?: string
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.from('reports').insert({
        reporter_id: reporterId,
        reported_user_id: reportedUserId,
        reason,
        description,
        status: 'pending',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}

export const matchingService = new MatchingService();
