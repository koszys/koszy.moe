import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';
import { tasksService, profilesService } from '../services';

const PlannerContext = createContext();

export function PlannerProvider({ children }) {
    const { user } = useAuth();
    const { activeAccountId } = useSettings();
    
    const [checkedTasks, setCheckedTasks] = useState({});
    const [excludedTags, setExcludedTags] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const loadPlannerData = async () => {
            if (!activeAccountId) return;

            setCheckedTasks({});

            if (user) {
                const profile = await profilesService.get(user.id);
                
                if (isMounted) {
                    setExcludedTags(profile?.excluded_tags || []);
                }

                const tasks = await tasksService.getByAccountId(activeAccountId);
                
                if (isMounted) {
                    setCheckedTasks(tasks);
                }
            } else {
                const allLocalTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
                
                if (isMounted) {
                    setCheckedTasks(allLocalTasks[activeAccountId] || {});
                    setExcludedTags(JSON.parse(localStorage.getItem('koszy-excluded-tags')) || []);
                }
            }
        };
        
        loadPlannerData();

        return () => {
            isMounted = false;
        };
    }, [user, activeAccountId]);

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

        if (user) {
            await tasksService.toggle(user.id, activeAccountId, gameId, taskId);
        } else {
            const masterLocal = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
            masterLocal[activeAccountId] = newCheckedTasks;
            localStorage.setItem('koszy-checked-tasks', JSON.stringify(masterLocal));
        }
    }, [checkedTasks, user, activeAccountId]);

    const clearCompletedTask = useCallback(async (gameId, taskId) => {
        if (!checkedTasks[gameId]?.[taskId]) return;

        const newGameState = { ...checkedTasks[gameId] };
        delete newGameState[taskId];

        const newCheckedTasks = { ...checkedTasks, [gameId]: newGameState };
        setCheckedTasks(newCheckedTasks);

        if (user) {
            await tasksService.remove(activeAccountId, gameId, taskId);
        } else {
            const masterLocal = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
            masterLocal[activeAccountId] = newCheckedTasks;
            localStorage.setItem('koszy-checked-tasks', JSON.stringify(masterLocal));
        }
    }, [checkedTasks, user, activeAccountId]);

    const toggleTagExclusion = useCallback(async (tagId) => {
        const isExcluded = excludedTags.includes(tagId);
        const newTags = isExcluded ? excludedTags.filter(id => id !== tagId) : [...excludedTags, tagId];
        
        setExcludedTags(newTags);

        if (user) {
            await profilesService.updateExcludedTags(user.id, newTags);
        } else {
            localStorage.setItem('koszy-excluded-tags', JSON.stringify(newTags));
        }
    }, [excludedTags, user]);

    return (
        <PlannerContext.Provider value={{ checkedTasks, toggleTask, clearCompletedTask, excludedTags, toggleTagExclusion }}>
            {children}
        </PlannerContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePlanner = () => useContext(PlannerContext);