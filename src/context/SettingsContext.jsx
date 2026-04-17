import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    const { user } = useAuth();
    
    const [accounts, setAccounts] = useState([]);
    const [activeAccountId, setActiveAccountId] = useState('account_1');
    const [loading, setLoading] = useState(true);

    // Fetch Data (Cloud if logged in, Local if not logged in)
    useEffect(() => {
        const loadSettings = async () => {
            setLoading(true);
            if (user) {
                // Fetch from Supabase
                const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
                const { data: accountsData } = await supabase.from('game_accounts').select('*').eq('user_id', user.id);
                
                if (accountsData && accountsData.length > 0) {
                    setAccounts(accountsData);
                    setActiveAccountId(profileData?.active_account_id || accountsData[0].id);
                } else {
                    // Create default cloud account if they have none
                    const defaultAcc = { id: `acc_${Date.now()}`, user_id: user.id, name: 'Main', server: 'America', ar: 1, wl: '0', gender: 'M' };
                    await supabase.from('game_accounts').insert(defaultAcc);
                    await supabase.from('profiles').upsert({ id: user.id, active_account_id: defaultAcc.id });
                    setAccounts([defaultAcc]);
                    setActiveAccountId(defaultAcc.id);
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
            getServerResetUTC
        }}>
            {!loading && children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);