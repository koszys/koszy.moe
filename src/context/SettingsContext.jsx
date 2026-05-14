import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { createExportData, parseImportedData, applyImportedAccount, buildTaskInsertRows, sortAccounts, flattenTasksToRows } from '../utils/dataIO';
import { getServerResetUTC } from '../utils/timeCalculations';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const { user } = useAuth();
    
    const [accounts, setAccounts] = useState([]);
    const [activeAccountId, setActiveAccountId] = useState('account_1');
    const [loading, setLoading] = useState(true);

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

                    const tasksToInsert = flattenTasksToRows(localTasks, user.id);
                    
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

            const tasksToInsert = flattenTasksToRows(localTasks, user.id);
            
            if (tasksToInsert.length > 0) {
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

    const getResetHour = () => {
        const activeAcc = accounts.find(acc => acc.id === activeAccountId);
        const server = activeAcc?.server || 'America';
        return getServerResetUTC(server);
    };

    // Export single account data (account settings + task completions)
    const exportAccount = async (accountId) => {
        const account = accounts.find(acc => acc.id === accountId);
        if (!account) return null;

        let tasks = {};
        
        if (user) {
            const { data: taskRows } = await supabase.from('completed_tasks')
                .select('game_id, task_id, completed_at')
                .eq('account_id', accountId);
            
            if (taskRows) {
                taskRows.forEach(t => {
                    if (!tasks[t.game_id]) tasks[t.game_id] = {};
                    tasks[t.game_id][t.task_id] = { completedAt: t.completed_at };
                });
            }
        } else {
            const allTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
            tasks = allTasks[accountId] || {};
        }

        return createExportData(account, tasks);
    };

    // Import account data (replaces account settings + task completions)
    const importAccount = async (accountId, importData) => {
        const { account: importedAccount, tasks: importedTasks } = parseImportedData(importData);

        const updatedAccounts = applyImportedAccount(accounts, accountId, importedAccount);
        setAccounts(updatedAccounts);

        if (user) {
            await supabase.from('game_accounts').update({
                name: importedAccount.name,
                server: importedAccount.server,
                ar: importedAccount.ar,
                wl: importedAccount.wl,
                gender: importedAccount.gender
            }).eq('id', accountId);

            await supabase.from('completed_tasks').delete().eq('account_id', accountId);
            
            const tasksToInsert = buildTaskInsertRows(accountId, importedTasks, user.id);
            if (tasksToInsert.length > 0) {
                await supabase.from('completed_tasks').insert(tasksToInsert);
            }
        } else {
            localStorage.setItem('koszy-accounts', JSON.stringify(updatedAccounts));
            const allTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
            allTasks[accountId] = importedTasks;
            localStorage.setItem('koszy-checked-tasks', JSON.stringify(allTasks));
        }
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
            getResetHour,
            syncLocalToCloud,
            exportAccount,
            importAccount
        }}>
            {!loading && children}
        </SettingsContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext);