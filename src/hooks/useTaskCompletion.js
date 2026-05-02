import { useCallback } from 'react';
import { getNextResetAfter } from '../utils/timeCalculations';

// Custom hook for task completion and expiry logic
export const useTaskCompletion = (gameCheckedTasks, currentResetHour, server) => {
    const getCompletionTimestamp = useCallback((taskId) => {
        const entry = gameCheckedTasks[taskId];
        if (!entry) return null;
        if (typeof entry === 'object' && entry.completedAt) return new Date(entry.completedAt);
        return null;
    }, [gameCheckedTasks]);

    const isTaskCompleted = useCallback((task) => {
        if (!gameCheckedTasks[task.id]) return false;
        const completedAt = getCompletionTimestamp(task.id);
        if (!task.resetRule || !completedAt) return true;
        return new Date() < getNextResetAfter(completedAt, task.resetRule, currentResetHour, server);
    }, [gameCheckedTasks, currentResetHour, server, getCompletionTimestamp]);

    const isTaskExpired = useCallback((task) => {
        const completedAt = getCompletionTimestamp(task.id);
        if (!task.resetRule || !completedAt) return false;
        return new Date() >= getNextResetAfter(completedAt, task.resetRule, currentResetHour, server);
    }, [currentResetHour, server, getCompletionTimestamp]);

    return { isTaskCompleted, isTaskExpired, getCompletionTimestamp };
};
