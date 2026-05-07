import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const { user } = useAuth();
    
    const [accounts, setAccounts] = useState([]);
    const [activeAccountId, setActiveAccountId] = useState('account_1');
    const [loading, setLoading] = useState(true);

    const sortAccounts = (accountList) => {
        return [...accountList].sort((a, b) => {
            if (a.created_at && b.created_at) {
                return new Date(a.created_at) - new Date(b.created_at);
            }
            if (a.created_at) return -1;
            if (b.created_at) return 1;
            return 0;
        });
    };

    // Fetch Data & Handle First-Time Migration
    useEffect(() => {
        const loadSettings = async () => {
            if (user) {
                const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                const { data: accountsData } = await supabase.from('game_accounts').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
                
                if (accountsData && accountsData.length > 0) {
                    // Existing users, load cloud data normally
                    setAccounts(sortAccounts(accountsData));
                    setActiveAccountId(profileData?.active_account_id || accountsData[0].id);
                } else {
                    // For a new user, migrate local guest data to the cloud
                    console.log("New user detected. Migrating local data to cloud...");
                    
                    // Grab local data (or use defaults if empty)
                    const localAccounts = JSON.parse(localStorage.getItem('koszy-accounts')) || [{ id: `acc_${Date.now()}`, name: 'Main', server: 'America', ar: 1, wl: '0', gender: 'M' }];
                    const localActiveId = localStorage.getItem('koszy-active-account') || localAccounts[0].id;
                    const localTags = JSON.parse(localStorage.getItem('koszy-excluded-tags')) || [];
                    const localTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};

                    // Push Accounts
                    const accountsToInsert = localAccounts.map(acc => ({ ...acc, user_id: user.id }));
                    await supabase.from('game_accounts').insert(accountsToInsert);

                    // Push Profile & Tags
                    await supabase.from('profiles').upsert({ id: user.id, active_account_id: localActiveId, excluded_tags: localTags });

                    // Push Tasks (Flattening the nested object into SQL rows)
                    const tasksToInsert = [];
                    Object.keys(localTasks).forEach(accId => {
                        Object.keys(localTasks[accId]).forEach(gameId => {
                            Object.keys(localTasks[accId][gameId]).forEach(taskId => {
                                if (localTasks[accId][gameId][taskId]) {
                                    tasksToInsert.push({ user_id: user.id, account_id: accId, game_id: gameId, task_id: taskId });
                                }
                            });
                        });
                    });
                    
                    if (tasksToInsert.length > 0) {
                        await supabase.from('completed_tasks').insert(tasksToInsert);
                    }

                    // Set the state
                    setAccounts(localAccounts);
                    setActiveAccountId(localActiveId);
                }
            } else {
                // Fetch from LocalStorage
                const localAccounts = JSON.parse(localStorage.getItem('koszy-accounts')) || [{ id: 'account_1', name: 'Main', server: 'America', ar: 60, wl: '9', gender: 'M' }];
                const localActiveId = localStorage.getItem('koszy-active-account') || 'account_1';
                setAccounts(localAccounts);
                setActiveAccountId(localActiveId);
            }
            setLoading(false);
        };
        loadSettings();
    }, [user]);

    // Save Active Account ID changes
    const changeActiveAccount = async (newId) => {
        setActiveAccountId(newId);
        if (user) {
            await supabase.from('profiles').upsert({ id: user.id, active_account_id: newId });
        } else {
            localStorage.setItem('koszy-active-account', newId);
        }
    };

    // Update Account Details (AR, Server, WL)
    const updateActiveAccount = async (key, value) => {
        const updatedAccounts = accounts.map(acc => acc.id === activeAccountId ? { ...acc, [key]: value } : acc);
        setAccounts(updatedAccounts);
        
        if (user) {
            await supabase.from('game_accounts').update({ [key]: value }).eq('id', activeAccountId);
        } else {
            localStorage.setItem('koszy-accounts', JSON.stringify(updatedAccounts));
        }
    };

    // Add New Account
    const addAccount = async () => {
        const newId = `acc_${Date.now()}`;
        const newAcc = { id: newId, name: `Alt ${accounts.length + 1}`, server: 'America', ar: 1, wl: '0', gender: 'M' };
        
        if (user) {
            newAcc.user_id = user.id;
            await supabase.from('game_accounts').insert(newAcc);
        }
        
        const newAccounts = [...accounts, newAcc];
        setAccounts(newAccounts);
        changeActiveAccount(newId);
        if (!user) localStorage.setItem('koszy-accounts', JSON.stringify(newAccounts));
    };

    // Delete Account
    const deleteActiveAccount = async () => {
        if (accounts.length <= 1) return;
        const newAccounts = accounts.filter(acc => acc.id !== activeAccountId);
        const nextId = newAccounts[0].id;
        
        if (user) {
            await supabase.from('game_accounts').delete().eq('id', activeAccountId);
        }
        
        setAccounts(newAccounts);
        changeActiveAccount(nextId);
        if (!user) localStorage.setItem('koszy-accounts', JSON.stringify(newAccounts));
    };

    // Manual Cloud Sync
    const syncLocalToCloud = async () => {
        if (!user) return alert("You must be signed in to sync to the cloud.");
        
        try {
            const localAccounts = JSON.parse(localStorage.getItem('koszy-accounts')) || [];
            const localTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
            const localTags = JSON.parse(localStorage.getItem('koszy-excluded-tags')) || [];

            // Sync Accounts
            if (localAccounts.length > 0) {
                const accountsToUpsert = localAccounts.map(acc => ({ ...acc, user_id: user.id }));
                await supabase.from('game_accounts').upsert(accountsToUpsert);
            }

            // Sync Profile & Tags
            await supabase.from('profiles').upsert({ id: user.id, excluded_tags: localTags });

            // Sync Tasks
            const tasksToInsert = [];
            Object.keys(localTasks).forEach(accId => {
                Object.keys(localTasks[accId]).forEach(gameId => {
                    Object.keys(localTasks[accId][gameId]).forEach(taskId => {
                        if (localTasks[accId][gameId][taskId]) {
                            tasksToInsert.push({ user_id: user.id, account_id: accId, game_id: gameId, task_id: taskId });
                        }
                    });
                });
            });
            
            if (tasksToInsert.length > 0) {
                // Upsert on the unique constraint to avoid duplicate errors
                await supabase.from('completed_tasks').upsert(tasksToInsert, { onConflict: 'account_id, game_id, task_id' });
            }

            // Refresh state to show merged data
            const { data: updatedAccounts } = await supabase.from('game_accounts').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
            if (updatedAccounts) setAccounts(sortAccounts(updatedAccounts));
            
        } catch (error) {
            console.error("Sync Error:", error);
            throw error; 
        } 
    };

    // Helper: UTC Reset Math
    const getServerResetUTC = () => {
        const activeAcc = accounts.find(acc => acc.id === activeAccountId);
        const server = activeAcc?.server || 'America';
        if (server === 'Europe') return 3;
        if (server === 'Asia') return 20;
        return 9; // America default
    };

    const activeAccount = accounts.find(acc => acc.id === activeAccountId) || accounts[0];

    return (
        <SettingsContext.Provider value={{ 
            accounts, 
            activeAccountId, 
            setActiveAccountId: changeActiveAccount, 
            activeAccount, 
            addAccount, 
            updateActiveAccount, 
            deleteActiveAccount,
            getServerResetUTC,
            syncLocalToCloud
        }}>
            {!loading && children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);