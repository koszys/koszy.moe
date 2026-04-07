import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // null means logged out
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Dummy login functions for testing the UI
    const loginWithGoogle = () => {
        setUser({ name: 'koszy', provider: 'Google' });
        closeModal();
    };

    const loginWithDiscord = () => {
        setUser({ name: 'koszy2', provider: 'Discord' });
        closeModal();
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ 
            user, isModalOpen, openModal, closeModal, 
            loginWithGoogle, loginWithDiscord, logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);