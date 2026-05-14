import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const triggerLogout = () => setIsLogoutModalOpen(true);
    const cancelLogout = () => setIsLogoutModalOpen(false);

    const confirmLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout Error:", error.message);
        setIsLogoutModalOpen(false);
    };

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

    const formattedUser = user ? {
        id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.custom_claims?.global_name || 'Traveler',
        email: user.email,
        avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || user.user_metadata?.custom_claims?.avatar_url,
        identities: user.identities
    } : null;

    return (
        <AuthContext.Provider value={{ 
            user: formattedUser, 
            isModalOpen, 
            openModal, 
            closeModal, 
            isLogoutModalOpen,
            triggerLogout,
            cancelLogout,
            confirmLogout,
            loginWithGoogle, 
            loginWithDiscord,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);