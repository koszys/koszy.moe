import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';

const PlannerContext = createContext();

export function PlannerProvider({ children }) {
    const { user } = useAuth();
    const { activeAccountId } = useSettings();
    
    const [checkedTasks, setCheckedTasks] = useState({});
    const [excludedTags, setExcludedTags] = useState([]);

    // Fetch Tasks & Tags based on the active account
    useEffect(() => {
        let isMounted = true; // Prevents race conditions

        const loadPlannerData = async () => {
            if (!activeAccountId) return;

            // Stops old account data from leaking visually
            setCheckedTasks({});

            if (user) {
                // Fetch tags from profiles
                const { data: profile } = await supabase.from('profiles').select('excluded_tags').eq('id', user.id).single();
                
                if (isMounted) {
                    setExcludedTags(profile?.excluded_tags || []);
                }

                // Fetch checked tasks for this specific account
                const { data: tasks } = await supabase.from('completed_tasks')
                    .select('game_id, task_id, completed_at') // Note: Using completed_at from our previous fix!
                    .eq('account_id', activeAccountId);
                
                // Rebuild the { genshin: { daily_commissions: { completedAt } } } format for the UI
                const formattedTasks = {};
                tasks?.forEach(t => {
                    if (!formattedTasks[t.game_id]) formattedTasks[t.game_id] = {};
                    formattedTasks[t.game_id][t.task_id] = { completedAt: t.completed_at };
                });
                
                // Only set state if the user hasnt switched accounts again during the fetch
                if (isMounted) {
                    setCheckedTasks(formattedTasks);
                }
            } else {
                // Fetch from LocalStorage
                const allLocalTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
                
                if (isMounted) {
                    setCheckedTasks(allLocalTasks[activeAccountId] || {});
                    setExcludedTags(JSON.parse(localStorage.getItem('koszy-excluded-tags')) || []);
                }
            }
        };
        
        loadPlannerData();

        // If activeAccountId changes, this invalidates the old fetch
        return () => {
            isMounted = false;
        };
    }, [user, activeAccountId]);

    // Toggle Task (Insert/Delete Row)
    const toggleTask = async (gameId, taskId) => {
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
            if (!isCurrentlyChecked) {
                await supabase.from('completed_tasks').insert({
                    user_id: user.id, account_id: activeAccountId, game_id: gameId, task_id: taskId
                });
            } else {
                await supabase.from('completed_tasks')
                    .delete()
                    .match({ account_id: activeAccountId, game_id: gameId, task_id: taskId });
            }
        } else {
            // LocalStorage requires fetching the whole master object to update one account
            const masterLocal = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
            masterLocal[activeAccountId] = newCheckedTasks;
            localStorage.setItem('koszy-checked-tasks', JSON.stringify(masterLocal));
        }
    };

    const clearCompletedTask = async (gameId, taskId) => {
        if (!checkedTasks[gameId]?.[taskId]) return;

        const newGameState = { ...checkedTasks[gameId] };
        delete newGameState[taskId];

        const newCheckedTasks = { ...checkedTasks, [gameId]: newGameState };
        setCheckedTasks(newCheckedTasks);

        if (user) {
            await supabase.from('completed_tasks')
                .delete()
                .match({ account_id: activeAccountId, game_id: gameId, task_id: taskId });
        } else {
            const masterLocal = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
            masterLocal[activeAccountId] = newCheckedTasks;
            localStorage.setItem('koszy-checked-tasks', JSON.stringify(masterLocal));
        }
    };

    // Toggle Tag Exclusion
    const toggleTagExclusion = async (tagId) => {
        const isExcluded = excludedTags.includes(tagId);
        const newTags = isExcluded ? excludedTags.filter(id => id !== tagId) : [...excludedTags, tagId];
        
        setExcludedTags(newTags);

        if (user) {
            await supabase.from('profiles').update({ excluded_tags: newTags }).eq('id', user.id);
        } else {
            localStorage.setItem('koszy-excluded-tags', JSON.stringify(newTags));
        }
    };

    return (
        <PlannerContext.Provider value={{ checkedTasks, toggleTask, clearCompletedTask, excludedTags, toggleTagExclusion }}>
            {children}
        </PlannerContext.Provider>
    );
}

export const usePlanner = () => useContext(PlannerContext);