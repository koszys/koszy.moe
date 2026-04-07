import React, { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
    // Default starting account so the app never crashes
    const defaultAccount = { 
        id: 'account_1', 
        name: 'Main', 
        server: 'America', 
        ar: 60, 
        wl: 9, 
        gender: 'M' 
    };

    // Load accounts array or set default
    const [accounts, setAccounts] = useState(() => {
        const saved = localStorage.getItem('koszy-accounts');
        return saved ? JSON.parse(saved) : [defaultAccount];
    });

    // Load active account ID
    const [activeAccountId, setActiveAccountId] = useState(() => {
        return localStorage.getItem('koszy-active-account') || 'account_1';
    });

    // Save to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('koszy-accounts', JSON.stringify(accounts));
        localStorage.setItem('koszy-active-account', activeAccountId);
    }, [accounts, activeAccountId]);

    // Helper to get the actual active account object
    const activeAccount = accounts.find(acc => acc.id === activeAccountId) || accounts[0];

    // --- ACCOUNT ACTIONS ---
    const addAccount = () => {
        const newId = `account_${Date.now()}`;
        const newAccount = { ...defaultAccount, id: newId, name: `Account ${accounts.length + 1}` };
        setAccounts([...accounts, newAccount]);
        setActiveAccountId(newId); // Auto-switch to new account
    };

    const updateActiveAccount = (key, value) => {
        setAccounts(accounts.map(acc => 
            acc.id === activeAccountId ? { ...acc, [key]: value } : acc
        ));
    };

    const deleteActiveAccount = () => {
        if (accounts.length <= 1) return; // Prevent deleting the last account
        const remaining = accounts.filter(acc => acc.id !== activeAccountId);
        setAccounts(remaining);
        setActiveAccountId(remaining[0].id); // Switch to the first available account
    };

    // Reads dynamically from the active account
    const getServerResetUTC = () => {
        switch(activeAccount.server) {
            case 'Europe': return 3; 
            case 'Asia': return 20; 
            case 'America':
            default: return 9; 
        }
    };

    return (
        <SettingsContext.Provider value={{ 
            accounts, activeAccountId, setActiveAccountId, activeAccount, 
            addAccount, updateActiveAccount, deleteActiveAccount, getServerResetUTC 
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => useContext(SettingsContext);