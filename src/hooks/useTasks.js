import { useState, useEffect, useCallback } from 'react';
import { tasksService } from '../services/tasks';

export const useTasks = (userId, accountId) => {
  const [checkedTasks, setCheckedTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!accountId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let tasks;
      if (userId) {
        tasks = await tasksService.getByAccountId(accountId);
      } else {
        const localTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
        tasks = localTasks[accountId] || {};
      }
      setCheckedTasks(tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, accountId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggleTask = useCallback(async (gameId, taskId) => {
    const isCurrentlyChecked = !!checkedTasks[gameId]?.[taskId];
    
    const newGameState = { ...checkedTasks[gameId] };
    if (isCurrentlyChecked) {
      delete newGameState[taskId];
    } else {
      newGameState[taskId] = { completedAt: new Date().toISOString() };
    }
    
    const newCheckedTasks = { ...checkedTasks, [gameId]: newGameState };
    setCheckedTasks(newCheckedTasks);

    if (userId) {
      await tasksService.toggle(userId, accountId, gameId, taskId);
    } else {
      const masterLocal = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
      masterLocal[accountId] = newCheckedTasks;
      localStorage.setItem('koszy-checked-tasks', JSON.stringify(masterLocal));
    }
  }, [checkedTasks, userId, accountId]);

  const clearCompletedTask = useCallback(async (gameId, taskId) => {
    if (!checkedTasks[gameId]?.[taskId]) return;

    const newGameState = { ...checkedTasks[gameId] };
    delete newGameState[taskId];

    const newCheckedTasks = { ...checkedTasks, [gameId]: newGameState };
    setCheckedTasks(newCheckedTasks);

    if (userId) {
      await tasksService.remove(accountId, gameId, taskId);
    } else {
      const masterLocal = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
      masterLocal[accountId] = newCheckedTasks;
      localStorage.setItem('koszy-checked-tasks', JSON.stringify(masterLocal));
    }
  }, [checkedTasks, userId, accountId]);

  return {
    checkedTasks,
    loading,
    error,
    refetch: fetchTasks,
    toggleTask,
    clearCompletedTask
  };
};