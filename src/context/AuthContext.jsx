import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase'; 

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if the user is already logged in when the app loads
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Set up a listener for when they log in or log out
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Auth functions
    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.href }
        });
        if (error) console.error("Google Login Error:", error.message);
    };

    const loginWithDiscord = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: { redirectTo: window.location.href }
        });
        if (error) console.error("Discord Login Error:", error.message);
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout Error:", error.message);
    };

    const formattedUser = user ? {
        id: user.id,
        // Google uses 'full_name', Discord uses 'custom_claims.global_name'
        name: user.user_metadata?.full_name || user.user_metadata?.custom_claims?.global_name || 'Traveler',
        email: user.email,
        // Capitalize the provider name (e.g., 'google' -> 'Google')
        provider: user.app_metadata?.provider.charAt(0).toUpperCase() + user.app_metadata?.provider.slice(1),
        avatar: user.user_metadata?.avatar_url
    } : null;

    return (
        <AuthContext.Provider value={{ 
            user: formattedUser, 
            isModalOpen, 
            openModal, 
            closeModal, 
            loginWithGoogle, 
            loginWithDiscord, 
            logout 
        }}>
            {/* Dont render the app until we know if they are logged in or not */}
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);