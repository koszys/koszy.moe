import { supabase } from '../lib/supabase';

export const profilesService = {
  get: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  update: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...updates })
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    return data;
  },

  updateExcludedTags: async (userId, excludedTags) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ excluded_tags: excludedTags })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating excluded tags:', error);
      return null;
    }
    return data;
  },

  updateActiveAccount: async (userId, activeAccountId) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ active_account_id: activeAccountId })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating active account:', error);
      return null;
    }
    return data;
  },

  upsert: async (profile) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting profile:', error);
      return null;
    }
    return data;
  }
};