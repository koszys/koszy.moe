import { useState, useEffect, useCallback } from 'react';
import { profilesService } from '../services/profiles';
import type { Profile } from '../types';

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await profilesService.get(userId);
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the profile.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates) => {
    if (!userId) return null;
    
    const updated = await profilesService.update(userId, updates);
    
    if (updated) {
      setProfile(updated);
      return updated;
    }
    return null;
  }, [userId]);

  const updateActiveAccountId = useCallback(async (activeAccountId) => {
    if (!userId) return null;
    
    const updated = await profilesService.updateActiveAccount(userId, activeAccountId);
    
    if (updated) {
      setProfile(updated);
      return updated;
    }
    return null;
  }, [userId]);

  const updateExcludedTags = useCallback(async (excludedTags) => {
    if (!userId) return null;
    
    const updated = await profilesService.updateExcludedTags(userId, excludedTags);
    
    if (updated) {
      setProfile(updated);
      return updated;
    }
    return null;
  }, [userId]);

  return {
    profile,
    activeAccountId: profile?.active_account_id,
    excludedTags: profile?.excluded_tags || [],
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
    updateActiveAccountId,
    updateExcludedTags
  };
};