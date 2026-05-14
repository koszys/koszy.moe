import { accountsService } from './accounts';
import { tasksService } from './tasks';
import { profilesService } from './profiles';
import { sortAccounts } from '../utils/dataIO';

export const syncService = {
  localToCloud: async (userId) => {
    const localAccounts = JSON.parse(localStorage.getItem('koszy-accounts')) || [];
    const localTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
    const localTags = JSON.parse(localStorage.getItem('koszy-excluded-tags')) || [];
    const localActiveId = localStorage.getItem('koszy-active-account');

    const accountsToUpsert = localAccounts.map(acc => ({ ...acc, user_id: userId }));
    await accountsService.upsertMany(accountsToUpsert);

    await profilesService.upsert({
      id: userId,
      excluded_tags: localTags,
      active_account_id: localActiveId || localAccounts[0]?.id
    });

    await tasksService.upsertMany(localTasks, userId);

    const { data: updatedAccounts } = await supabase.from('game_accounts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    
    return updatedAccounts ? sortAccounts(updatedAccounts) : [];
  },

  getLocalData: () => {
    return {
      accounts: JSON.parse(localStorage.getItem('koszy-accounts')) || [],
      tasks: JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {},
      tags: JSON.parse(localStorage.getItem('koszy-excluded-tags')) || [],
      activeId: localStorage.getItem('koszy-active-account')
    };
  },

  setLocalAccounts: (accounts) => {
    localStorage.setItem('koszy-accounts', JSON.stringify(accounts));
  },

  setLocalActiveAccount: (activeId) => {
    localStorage.setItem('koszy-active-account', activeId);
  },

  setLocalTasks: (tasks) => {
    localStorage.setItem('koszy-checked-tasks', JSON.stringify(tasks));
  },

  setLocalExcludedTags: (tags) => {
    localStorage.setItem('koszy-excluded-tags', JSON.stringify(tags));
  }
};

import { supabase } from '../lib/supabase';