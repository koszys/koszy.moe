import { useAuth } from '../../context/AuthContext';

export default function LogoutModal() {
    const { isLogoutModalOpen, cancelLogout, confirmLogout } = useAuth();

    if (!isLogoutModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#09090b]/50 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={cancelLogout}></div>
            <div className="relative bg-[#18181b] border border-white/10 p-6 rounded-xl max-w-sm w-full shadow-2xl">
                <h3 className="text-white font-bold text-lg mb-6 text-center">Are you sure you want to sign out?</h3>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={cancelLogout}
                        className="px-5 py-2 text-gray-400 hover:text-white hover:border-blue-500 transition-colors font-medium border border-transparent"
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
    );
}