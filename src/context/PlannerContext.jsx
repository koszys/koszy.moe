import React, { createContext, useState, useEffect, useContext } from 'react';

const PlannerContext = createContext();

export function PlannerProvider({ children }) {
  // Universal State: Stores ALL games in one LocalStorage key
  // Format: { genshin: { task1: true }, hsr: { task2: true } }
    const [checkedTasks, setCheckedTasks] = useState(() => {
        try {
        const stored = localStorage.getItem('koszy-planner-master');
        return stored ? JSON.parse(stored) : {}; 
        } catch (e) {
        return {};
        }
    });

    const [excludedTags, setExcludedTags] = useState(() => {
        try {
        const stored = localStorage.getItem('koszy-plnr-excl');
        return stored ? JSON.parse(stored) : []; 
        } catch (e) {
        return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('koszy-planner-master', JSON.stringify(checkedTasks));
    }, [checkedTasks]);

    useEffect(() => {
        localStorage.setItem('koszy-plnr-excl', JSON.stringify(excludedTags));
    }, [excludedTags]);

    // Universal Toggle: Requires the gameId to know which bucket to update
    const toggleTask = (gameId, taskId) => {
        setCheckedTasks(prev => ({
        ...prev,
        [gameId]: {
            ...(prev[gameId] || {}), // Keep existing tasks for this game
            [taskId]: !(prev[gameId]?.[taskId]) // Flip the specific task boolean
        }
        }));
    };

    const toggleTagExclusion = (tagId) => {
        setExcludedTags(prev => 
        prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    return (
        <PlannerContext.Provider value={{ 
        checkedTasks, toggleTask, 
        excludedTags, toggleTagExclusion 
        }}>
        {children}
        </PlannerContext.Provider>
    );
}

export const usePlanner = () => useContext(PlannerContext);