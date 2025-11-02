// src/hooks/useProfile.ts
import { profileService } from '@/services/profile.service';
import { useCallback, useEffect, useState } from 'react';
import type { ProfileStats, User } from '../types';

export const useProfile = (userId: string) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadProfile();
      loadStats();
    }
  }, [userId, loadProfile, loadStats]);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const result = await profileService.getProfile(userId);
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        setError(result.error || 'Failed to load profile');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const loadStats = useCallback(async () => {
    const result = await profileService.getProfileStats(userId);
    if (result.success && result.data) {
      setStats(result.data);
    }
  }, [userId]);

  const updateProfile = async (updates: any) => {
    const result = await profileService.updateProfile(userId, updates);
    if (result.success && result.data) {
      setProfile(result.data);
      return true;
    }
    return false;
  };

  return {
    profile,
    stats,
    loading,
    error,
    updateProfile,
    refreshProfile: loadProfile,
    refreshStats: loadStats,
  };
};
