import React, { createContext, useState, useEffect, useContext } from 'react';

const PlannerContext = createContext();

export function PlannerProvider({ children }) {
    // 1. Initial State: Read from LocalStorage or default to empty
    const [checkedGenshinPlanner, setCheckedGenshinPlanner] = useState(() => {
        try {
        const stored = localStorage.getItem('koszy-plnr-gi');
        return stored ? JSON.parse(stored) : {}; // Object map: { id: boolean }
        } catch (e) {
        console.error("Error reading planner data:", e);
        return {};
        }
    });

    // 2. Settings: Which tags should be FILTERED OUT
    const [excludedTags, setExcludedTags] = useState(() => {
        try {
        const stored = localStorage.getItem('koszy-plnr-excl');
        return stored ? JSON.parse(stored) : []; // Array of tag IDs to hide
        } catch (e) {
        return [];
        }
    });

    // 3. Save to LocalStorage whenever either state changes
    useEffect(() => {
        localStorage.setItem('koszy-plnr-gi', JSON.stringify(checkedGenshinPlanner));
    }, [checkedGenshinPlanner]);

    useEffect(() => {
        localStorage.setItem('koszy-plnr-excl', JSON.stringify(excludedTags));
    }, [excludedTags]);

    // 4. Action: Toggle checking an item
    const toggleGenshinCheck = (id) => {
        setCheckedGenshinPlanner(prev => ({
        ...prev,
        [id]: !prev[id] // Invert the boolean
        }));
    };

    // 5. Action: Toggle tag exclusion
    const toggleTagExclusion = (tagId) => {
        setExcludedTags(prev => 
        prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );
    };

    // Provide everything to the app
    return (
        <PlannerContext.Provider value={{ 
        checkedGenshinPlanner, toggleGenshinCheck, 
        excludedTags, toggleTagExclusion 
        }}>
        {children}
        </PlannerContext.Provider>
    );
}

// Custom Hook for easy access
export const usePlanner = () => useContext(PlannerContext);