import { supabase } from '../lib/supabase';

export const accountsService = {
  getAll: async (userId) => {
    const { data, error } = await supabase
      .from('game_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching accounts:', error);
      return [];
    }
    return data || [];
  },

  getById: async (id) => {
    const { data, error } = await supabase
      .from('game_accounts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching account:', error);
      return null;
    }
    return data;
  },

  create: async (account) => {
    const { data, error } = await supabase
      .from('game_accounts')
      .insert(account)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating account:', error);
      return null;
    }
    return data;
  },

  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('game_accounts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating account:', error);
      return null;
    }
    return data;
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('game_accounts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting account:', error);
      return false;
    }
    return true;
  },

  upsertMany: async (accounts) => {
    if (!accounts.length) return true;
    
    const { error } = await supabase
      .from('game_accounts')
      .upsert(accounts, { onConflict: 'id' });
    
    if (error) {
      console.error('Error upserting accounts:', error);
      return false;
    }
    return true;
  },

  createMany: async (accounts) => {
    if (!accounts.length) return true;
    
    const { error } = await supabase
      .from('game_accounts')
      .insert(accounts);
    
    if (error) {
      console.error('Error creating accounts:', error);
      return false;
    }
    return true;
  }
};