import { useState, useEffect, useCallback } from 'react';
import { accountsService } from '../services/accounts';
import { sortAccounts } from '../utils/dataIO';

export const useAccounts = (userId) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAccounts = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await accountsService.getAll(userId);
      setAccounts(sortAccounts(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const addAccount = useCallback(async (newAccount) => {
    if (!userId) return null;
    
    const account = { ...newAccount, user_id: userId };
    const created = await accountsService.create(account);
    
    if (created) {
      setAccounts(prev => sortAccounts([...prev, created]));
      return created;
    }
    return null;
  }, [userId]);

  const updateAccount = useCallback(async (id, updates) => {
    const updated = await accountsService.update(id, updates);
    
    if (updated) {
      setAccounts(prev => sortAccounts(prev.map(acc => acc.id === id ? updated : acc)));
      return updated;
    }
    return null;
  }, []);

  const deleteAccount = useCallback(async (id) => {
    const success = await accountsService.delete(id);
    
    if (success) {
      setAccounts(prev => prev.filter(acc => acc.id !== id));
      return true;
    }
    return false;
  }, []);

  return {
    accounts,
    loading,
    error,
    refetch: fetchAccounts,
    addAccount,
    updateAccount,
    deleteAccount
  };
};