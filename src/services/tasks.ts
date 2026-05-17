import { supabase } from '../lib/supabase';
import { formatTaskRows, flattenTasksToRows } from '../utils/dataIO';

export const tasksService = {
  getByAccountId: async (accountId) => {
    const { data, error } = await supabase
      .from('completed_tasks')
      .select('game_id, task_id, completed_at')
      .eq('account_id', accountId);
    
    if (error) {
      console.error('Error fetching completed tasks:', error);
      return {};
    }
    
    return formatTaskRows(data);
  },

  getByUserId: async (userId, accountId) => {
    let query = supabase
      .from('completed_tasks')
      .select('game_id, task_id, completed_at');
    
    if (accountId) {
      query = query.eq('account_id', accountId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching completed tasks:', error);
      return {};
    }
    
    return formatTaskRows(data);
  },

  toggle: async (userId, accountId, gameId, taskId) => {
    const { data: existing } = await supabase
      .from('completed_tasks')
      .select('*')
      .match({ account_id: accountId, game_id: gameId, task_id: taskId })
      .single();
    
    if (existing) {
      const { error } = await supabase
        .from('completed_tasks')
        .delete()
        .match({ account_id: accountId, game_id: gameId, task_id: taskId });
      
      if (error) {
        console.error('Error removing task completion:', error);
        return null;
      }
      return { action: 'removed', taskId };
    } else {
      const { data, error } = await supabase
        .from('completed_tasks')
        .insert({
          user_id: userId,
          account_id: accountId,
          game_id: gameId,
          task_id: taskId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding task completion:', error);
        return null;
      }
      return { action: 'added', taskId, completedAt: data?.completed_at };
    }
  },

  remove: async (accountId, gameId, taskId) => {
    const { error } = await supabase
      .from('completed_tasks')
      .delete()
      .match({ account_id: accountId, game_id: gameId, task_id: taskId });
    
    if (error) {
      console.error('Error removing task completion:', error);
      return false;
    }
    return true;
  },

  clearAndInsert: async (accountId, tasks, userId) => {
    await supabase
      .from('completed_tasks')
      .delete()
      .eq('account_id', accountId);
    
    if (!tasks || Object.keys(tasks).length === 0) return true;
    
    const rows = flattenTasksToRows({ [accountId]: tasks }, userId);
    
    if (rows.length > 0) {
      const { error } = await supabase
        .from('completed_tasks')
        .insert(rows);
      
      if (error) {
        console.error('Error inserting tasks:', error);
        return false;
      }
    }
    return true;
  },

  upsertMany: async (tasksByAccountId, userId) => {
    const rows = flattenTasksToRows(tasksByAccountId, userId);
    
    if (rows.length === 0) return true;
    
    const { error } = await supabase
      .from('completed_tasks')
      .upsert(rows, { onConflict: 'account_id, game_id, task_id' });
    
    if (error) {
      console.error('Error upserting tasks:', error);
      return false;
    }
    return true;
  }
};