// src/hooks/useMatches.ts
import { useEffect, useState } from 'react';
import { matchingService } from '../services/matching.service';
import { Match } from '../types/matching.types';

export const useMatches = (userId: string) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadMatches();
    }
  }, [userId]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const result = await matchingService.getMatches(userId);
      if (result.success && result.data) {
        setMatches(result.data);
      } else {
        setError(result.error || 'Failed to load matches');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPotentialMatches = async (filters?: any) => {
    const result = await matchingService.getPotentialMatches(userId, filters);
    if (result.success && result.data) {
      return result.data;
    }
    return [];
  };

  const sendInterest = async (receiverId: string, message?: string) => {
    const result = await matchingService.sendInterest(
      userId,
      receiverId,
      message
    );
    return result.success;
  };

  return {
    matches,
    loading,
    error,
    refreshMatches: loadMatches,
    getPotentialMatches,
    sendInterest,
  };
};
