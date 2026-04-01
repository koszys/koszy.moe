import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSettings } from './SettingsContext';

const PlannerContext = createContext();

export function PlannerProvider({ children }) {
    // Grab the active account from settings context
    const { activeAccountId } = useSettings();

    // Load ALL checked tasks for ALL accounts
    const [allCheckedTasks, setAllCheckedTasks] = useState(() => {
        const saved = localStorage.getItem('koszy-checked-tasks');
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed;
        }
        return {};
    });

    // Load excluded tags (Global for all accounts currently)
    const [excludedTags, setExcludedTags] = useState(() => {
        const saved = localStorage.getItem('koszy-excluded-tags');
        return saved ? JSON.parse(saved) : [];
    });

    // Save tasks and tags whenever they change
    useEffect(() => {
        localStorage.setItem('koszy-checked-tasks', JSON.stringify(allCheckedTasks));
    }, [allCheckedTasks]);

    useEffect(() => {
        localStorage.setItem('koszy-excluded-tags', JSON.stringify(excludedTags));
    }, [excludedTags]);

    // Pass down the data for the ACTIVE account
    const checkedTasks = allCheckedTasks[activeAccountId] || {};

    // Update the toggle function to save the task under the correct account
    const toggleTask = (gameId, taskId) => {
        setAllCheckedTasks(prev => {
            // Get the current accounts data (or empty object)
            const accountData = prev[activeAccountId] || {};
            // Get the current games data within that account (or empty object)
            const gameData = accountData[gameId] || {};
            
            const isCurrentlyChecked = !!gameData[taskId];
            
            return {
                ...prev, // Keep other accounts exactly the same
                [activeAccountId]: {
                    ...accountData, // Keep other games in this account exactly the same
                    [gameId]: {
                        ...gameData,
                        [taskId]: !isCurrentlyChecked // Flip the checkbox
                    }
                }
            };
        });
    };

    const toggleTagExclusion = (tagId) => {
        setExcludedTags(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId)
                : [...prev, tagId]
        );
    };

    return (
        <PlannerContext.Provider value={{ 
            checkedTasks, 
            toggleTask, 
            excludedTags, 
            toggleTagExclusion 
        }}>
            {children}
        </PlannerContext.Provider>
    );
}

export const usePlanner = () => useContext(PlannerContext);