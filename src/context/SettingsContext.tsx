import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { accountsService, tasksService, profilesService, syncService } from '../services';
import { createExportData, parseImportedData, applyImportedAccount } from '../utils/dataIO';
import { getServerResetUTC } from '../utils/timeCalculations';
import type { GameAccount, ExportData } from '../types';

interface SettingsContextValue {
    accounts: GameAccount[];
    activeAccountId: string;
    setActiveAccountId: (_id: string) => void;
    activeAccount: GameAccount | undefined;
    addAccount: () => Promise<void>;
    updateActiveAccount: (_key: string, _value: unknown) => Promise<void>;
    deleteActiveAccount: () => Promise<void>;
    getResetHour: () => number;
    syncLocalToCloud: () => Promise<void>;
    exportAccount: (_accountId: string) => Promise<ExportData | null>;
    importAccount: (_accountId: string, _importData: ExportData) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    
    const [accounts, setAccounts] = useState([]);
    const [activeAccountId, setActiveAccountId] = useState('account_1');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            if (user) {
                const profileData = await profilesService.get(user.id);
                const accountsData = await accountsService.getAll(user.id);
                
                if (accountsData && accountsData.length > 0) {
                    setAccounts(accountsData);
                    setActiveAccountId(profileData?.active_account_id || accountsData[0].id);
                } else {
                    console.log("New user detected. Migrating local data to cloud...");
                    
                    const localAccounts = JSON.parse(localStorage.getItem('koszy-accounts')) || [{ id: `acc_${Date.now()}`, name: 'Main', server: 'America', ar: 1, wl: '0', gender: 'M' }];
                    const localActiveId = localStorage.getItem('koszy-active-account') || localAccounts[0].id;
                    const localTags = JSON.parse(localStorage.getItem('koszy-excluded-tags')) || [];
                    const localTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};

                    const accountsToInsert = localAccounts.map(acc => ({ ...acc, user_id: user.id }));
                    await accountsService.createMany(accountsToInsert);

                    await profilesService.upsert({ id: user.id, active_account_id: localActiveId, excluded_tags: localTags });

                    if (Object.keys(localTasks).length > 0) {
                        await tasksService.upsertMany(localTasks, user.id);
                    }

                    setAccounts(localAccounts);
                    setActiveAccountId(localActiveId);
                }
            } else {
                const localAccounts = JSON.parse(localStorage.getItem('koszy-accounts')) || [{ id: 'account_1', name: 'Main', server: 'America', ar: 60, wl: '9', gender: 'M' }];
                const localActiveId = localStorage.getItem('koszy-active-account') || 'account_1';
                setAccounts(localAccounts);
                setActiveAccountId(localActiveId);
            }
            setLoading(false);
        };
        loadSettings();
    }, [user]);

    const changeActiveAccount = useCallback(async (newId) => {
        setActiveAccountId(newId);
        if (user) {
            await profilesService.updateActiveAccount(user.id, newId);
        } else {
            localStorage.setItem('koszy-active-account', newId);
        }
    }, [user]);

    const updateActiveAccount = useCallback(async (key, value) => {
        const updatedAccounts = accounts.map(acc => acc.id === activeAccountId ? { ...acc, [key]: value } : acc);
        setAccounts(updatedAccounts);
        
        if (user) {
            await accountsService.update(activeAccountId, { [key]: value });
        } else {
            localStorage.setItem('koszy-accounts', JSON.stringify(updatedAccounts));
        }
    }, [accounts, activeAccountId, user]);

    const addAccount = useCallback(async () => {
        const newId = `acc_${Date.now()}`;
        const newAcc = { id: newId, name: `Alt ${accounts.length + 1}`, server: 'America', ar: 1, wl: '0', gender: 'M' };
        
        if (user) {
            newAcc.user_id = user.id;
            const created = await accountsService.create(newAcc);
            if (created) {
                setAccounts(prev => [...prev, created]);
            }
        } else {
            const newAccounts = [...accounts, newAcc];
            setAccounts(newAccounts);
            localStorage.setItem('koszy-accounts', JSON.stringify(newAccounts));
        }
        
        changeActiveAccount(newId);
    }, [accounts, user, changeActiveAccount]);

    const deleteActiveAccount = useCallback(async () => {
        if (accounts.length <= 1) return;
        const newAccounts = accounts.filter(acc => acc.id !== activeAccountId);
        const nextId = newAccounts[0].id;
        
        if (user) {
            await accountsService.delete(activeAccountId);
        }
        
        setAccounts(newAccounts);
        changeActiveAccount(nextId);
        if (!user) localStorage.setItem('koszy-accounts', JSON.stringify(newAccounts));
    }, [accounts, activeAccountId, user, changeActiveAccount]);

    const syncLocalToCloud = useCallback(async () => {
        if (!user) return alert("You must be signed in to sync to the cloud.");
        
        try {
            const { accounts: localAccounts, tasks: localTasks, tags: localTags } = syncService.getLocalData();

            if (localAccounts.length > 0) {
                const accountsToUpsert = localAccounts.map(acc => ({ ...acc, user_id: user.id }));
                await accountsService.upsertMany(accountsToUpsert);
            }

            await profilesService.upsert({ id: user.id, excluded_tags: localTags });

            await tasksService.upsertMany(localTasks, user.id);

            const updatedAccounts = await accountsService.getAll(user.id);
            if (updatedAccounts) setAccounts(updatedAccounts);
            
        } catch (error) {
            console.error("Sync Error:", error);
            throw error; 
        }
    }, [user]);

    const getResetHour = useCallback(() => {
        const activeAcc = accounts.find(acc => acc.id === activeAccountId);
        const server = activeAcc?.server || 'America';
        return getServerResetUTC(server);
    }, [accounts, activeAccountId]);

    const exportAccount = useCallback(async (accountId) => {
        const account = accounts.find(acc => acc.id === accountId);
        if (!account) return null;

        let tasks = {};
        
        if (user) {
            tasks = await tasksService.getByAccountId(accountId);
        } else {
            const allTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
            tasks = allTasks[accountId] || {};
        }

        return createExportData(account, tasks);
    }, [accounts, user]);

    const importAccount = useCallback(async (accountId, importData) => {
        const { account: importedAccount, tasks: importedTasks } = parseImportedData(importData);

        const updatedAccounts = applyImportedAccount(accounts, accountId, importedAccount);
        setAccounts(updatedAccounts);

        if (user) {
            await accountsService.update(accountId, {
                name: importedAccount.name,
                server: importedAccount.server,
                ar: importedAccount.ar,
                wl: importedAccount.wl,
                gender: importedAccount.gender
            });

            await tasksService.clearAndInsert(accountId, importedTasks, user.id);
        } else {
            localStorage.setItem('koszy-accounts', JSON.stringify(updatedAccounts));
            const allTasks = JSON.parse(localStorage.getItem('koszy-checked-tasks')) || {};
            allTasks[accountId] = importedTasks;
            localStorage.setItem('koszy-checked-tasks', JSON.stringify(allTasks));
        }
    }, [accounts, user]);

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
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};