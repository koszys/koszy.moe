import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';
import { CloudIcon } from './Icons';

interface DataManagementSectionProps {
    setToast: (toast: { type: 'success' | 'error'; message: string } | null) => void;
}

export default function DataManagementSection({ setToast }: DataManagementSectionProps) {
    const { user } = useAuth();
    const { syncLocalToCloud } = useSettings();
    const [isSyncing, setIsSyncing] = useState(false);
    const [cooldown, setCooldown] = useState(() => {
        const savedExpiration = localStorage.getItem('koszy-sync-cooldown');
        if (savedExpiration) {
            const remainingSeconds = Math.floor((parseInt(savedExpiration, 10) - Date.now()) / 1000);
            return remainingSeconds > 0 ? remainingSeconds : 0;
        }
        return 0;
    });

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (cooldown === 0) {
            localStorage.removeItem('koszy-sync-cooldown');
        }
    }, [cooldown]);

    const handleSyncClick = async () => {
        if (!user) return;
        setIsSyncing(true);
        try {
            await syncLocalToCloud();
            setToast({ type: 'success', message: 'Data synced successfully!' });

            setCooldown(10);
            localStorage.setItem('koszy-sync-cooldown', Date.now() + 10000);

        } catch {
            setToast({ type: 'error', message: 'Failed to sync data. Please try again.' });
        }
        setIsSyncing(false);
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="bg-[#1c1d21] border border-[#52525b] rounded-xl p-4 md:p-6 shadow-lg">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Data Management</h3>
            <div className="flex flex-col gap-3">

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[#18181b] border border-[#3f3f46] rounded-lg">
                    <div>
                        <p className="text-sm font-bold text-white mb-0.5">Sync Local Data to Cloud</p>
                        <p className="text-xs text-gray-300">Merge any un-synced data from this browser into your cloud account.</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleSyncClick}
                        disabled={!user || isSyncing || cooldown > 0}
                        className="px-4 py-2 bg-transparent border border-[#52525b] hover:border-blue-500 disabled:opacity-50 disabled:hover:border-[#52525b] text-gray-300 hover:text-white disabled:text-gray-500 rounded-lg text-sm font-medium transition-colors whitespace-nowrap min-w-[140px]"
                    >
                        <span className="flex items-center gap-1.5 justify-center">
                            <CloudIcon className="w-4 h-4" />
                            {isSyncing
                                ? 'Syncing...'
                                : cooldown > 0
                                    ? `Synced (${cooldown}s)`
                                    : user
                                        ? 'Sync to Cloud'
                                        : 'Sign in to Sync'
                            }
                        </span>
                    </button>
                </div>

            </div>
        </div>
    );
}
