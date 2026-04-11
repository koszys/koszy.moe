import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
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

    // Logout 
    const triggerLogout = () => setIsLogoutModalOpen(true);
    const cancelLogout = () => setIsLogoutModalOpen(false);

    const confirmLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error("Logout Error:", error.message);
        setIsLogoutModalOpen(false); // Close modal after logging out
    };

    // Auth 
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
            triggerLogout, 
            loginWithGoogle, 
            loginWithDiscord
        }}>
            {loading ? (
                <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white font-bold">
                    Connecting...
                </div>
            ) : (
                <>
                    {children}

                    {isLogoutModalOpen && (
                        <div className="fixed inset-0 bg-black/80 z-[150] flex items-center justify-center p-4">
                            <div className="absolute inset-0" onClick={cancelLogout}></div>
                            <div className="relative bg-[#1c1d21] border border-[#33343a] p-6 rounded-xl max-w-sm w-full shadow-2xl">
                                <h3 className="text-white font-bold text-lg mb-6 text-center">Are you sure you want to sign out?</h3>
                                <div className="flex gap-3 justify-center">
                                    <button 
                                        onClick={cancelLogout} 
                                        className="px-5 py-2 text-gray-400 hover:text-white hover:border-blue-500 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmLogout} 
                                        className="bg-red-900/30 hover:bg-red-900/60 text-red-400 border border-red-900/50 hover:border-red-500 px-6 py-2 rounded-lg font-bold transition-colors shadow-md"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);