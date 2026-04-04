import React, { useState } from 'react';

// Components
import SectionHeader from '../components/game/SectionHeader';

// Context
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext'; 

// Assets
import driveIcon from '../assets/googledriveicon.png';

const GAME_TERMS = {
    genshin: { 
        ar: "AR", arFull: "Adventure Rank", maxAr: 60,
        wl: "WL", wlFull: "World Level", wlOptions: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        mcTitle: "Traveler", mcMale: "Aether", mcFemale: "Lumine" 
    },
    hsr: { 
        ar: "TL", arFull: "Trailblaze Level", maxAr: 70, 
        wl: "EQ Level", wlFull: "Equilibrium Level", wlOptions: ["0", "1", "2", "3", "4", "5", "6"],
        mcTitle: "Trailblazer", mcMale: "Caelus", mcFemale: "Stelle" 
    },
    wuwa: { 
        ar: "UL", arFull: "Union Level", maxAr: 80,
        wl: "SP", wlFull: "SOL3 Phase", wlOptions: ["1", "2", "3", "4", "5", "6", "7", "8"],
        mcTitle: "Rover", mcMale: "Male", mcFemale: "Female" 
    },
    zzz: {
        ar: "IL", arFull: "Inter-Knot Level", maxAr: 60,
        wl: "IR", wlFull: "Inter-Knot Reputation", wlOptions: ["Novice Proxy (0)", "Certified Proxy (1)", "Senior Proxy (2)", "Elite Proxy (3)", "Legendary Proxy (4)"],
        mcTitle: "Proxy", mcMale: "Wise", mcFemale: "Belle"
    },
    default: { 
        ar: "Level", wl: "World Level", 
        mcTitle: "Gender", mcMale: "Male", mcFemale: "Female" 
    }
};

export default function Settings({ gameId = 'genshin' }) {
    const terms = GAME_TERMS[gameId] || GAME_TERMS.genshin;
    
    const { 
        accounts, activeAccountId, setActiveAccountId, activeAccount, 
        addAccount, updateActiveAccount, deleteActiveAccount 
    } = useSettings();

    // Grab the auth state and functions
    const { user, openModal, logout } = useAuth();

    const [isRenaming, setIsRenaming] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleRenameSubmit = (e) => {
        if (e.key === 'Enter') setIsRenaming(false);
    };

    const confirmDelete = () => {
        deleteActiveAccount();
        setShowDeleteModal(false);
    };

    return (
        <div className="w-full max-w-[1000px] mx-auto pb-20 px-4 md:px-0">
            <SectionHeader title="Settings" />

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#1c1d21] border border-[#33343a] p-6 rounded-xl max-w-sm w-full shadow-2xl">
                        <h3 className="text-white font-bold text-lg mb-6">Are you sure you want to delete this account?</h3>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setShowDeleteModal(false)} 
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete} 
                                className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/60 text-red-400 border border-red-900/50 hover:border-red-500 px-5 py-2 rounded-lg font-bold transition-colors shadow-md"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Auth Account Block */}
            <div className="bg-[#24252a] border border-[#33343a] rounded-xl p-4 md:p-6 shadow-sm mb-8">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Site Account</h3>

                {user ? (
                    // Logged in state
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${user.provider === 'Discord' ? 'bg-[#5865F2]' : 'bg-blue-600'}`}>
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">{user.name}</p>
                                <p className="text-xs text-gray-400">Signed in via {user.provider}</p>
                            </div>
                        </div>
                        <button onClick={logout} className="px-4 py-2 border bg-red-900/30 hover:bg-red-900/60 text-red-400 border-red-900/50 hover:border-red-500 rounded-lg text-sm font-bold transition-colors w-max">
                            Sign Out
                        </button>
                    </div>
                ) : (
                    // Logged out state
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-bold text-white mb-1">You are not signed in.</p>
                            <p className="text-xs text-gray-400">Sign in to automatically save and sync your data.</p>
                        </div>
                        <button onClick={openModal} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 hover:border-white text-white rounded-lg text-sm font-bold transition-colors shadow-md w-full sm:w-auto">
                            Sign In
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                
                {/* Account Manager */}
                <div className="bg-[#24252a] border border-[#33343a] rounded-xl p-4 md:p-6 shadow-sm">
                    <p className="text-sm text-gray-300 mb-1">More than one account? Add it here.</p>
                    <p className="text-sm font-bold text-white mb-4">Importing will overwrite the selected account data.</p>
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <button 
                                onClick={addAccount}
                                className="flex items-center gap-1.5 bg-[#33343a] hover:bg-[#4b4c53] text-white px-3 py-1.5 rounded-md text-sm font-bold transition-colors hover:border-blue-500"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Add
                            </button>

                            <select 
                                value={activeAccountId}
                                onChange={(e) => setActiveAccountId(e.target.value)}
                                className="bg-[#1c1d21] border border-[#33343a] text-white text-sm rounded-md px-3 py-1.5 min-w-[120px] focus:outline-none focus:border-blue-500 appearance-none"
                            >
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                                ))}
                            </select>

                            <button 
                                onClick={() => setIsRenaming(!isRenaming)}
                                className="flex items-center gap-1.5 bg-transparent border border-[#33343a] hover:border-blue-500 text-gray-300 hover:text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                Rename
                            </button>

                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                disabled={accounts.length === 1}
                                className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/60 text-red-400 border border-red-900/50 hover:border-red-500 px-3 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Delete
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                            <button className="bg-transparent border hover:border-blue-500 border-[#33343a] hover:bg-[#33343a] text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Export Account</button>
                            <button className="bg-transparent border hover:border-blue-500 border-[#33343a] hover:bg-[#33343a] text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Import Account</button>
                        </div>
                    </div>

                    {/* Rename Input */}
                    {isRenaming && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            <input 
                                autoFocus
                                type="text" 
                                value={activeAccount.name}
                                onChange={(e) => updateActiveAccount('name', e.target.value)}
                                onKeyDown={handleRenameSubmit}
                                className="bg-[#1c1d21] border border-blue-500 text-white text-sm rounded-md px-3 py-1.5 w-full max-w-[256px] focus:outline-none"
                            />
                            <button onClick={() => setIsRenaming(false)} className="text-sm px-2 py-1.5 text-blue-500 hover:text-blue-300 hover:border-blue-500 font-bold">Save</button>
                        </div>
                    )}
                </div>

                {/* Account Settings */}
                <div className="bg-[#24252a] border border-[#33343a] rounded-xl p-4 md:p-6 shadow-sm">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Account Settings</h3>
                    <div className="flex flex-wrap items-end gap-4 md:gap-6">

                        {/* Account Level */}
                        <div className="flex flex-col gap-1.5">
                            {/* Custom Tooltip Wrapper */}
                            <div className="relative group/tooltip w-max">
                                <label className="text-xs text-gray-400 font-bold uppercase border-b border-dashed border-gray-500 cursor-help">
                                    {terms.ar}
                                </label>
                                {/* Tooltip Box */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#121212] border border-[#33343a] text-white text-[10px] md:text-xs font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                    {terms.arFull}
                                </div>
                            </div>
                            <input 
                                type="number" 
                                min="1"
                                max={terms.maxAr}
                                value={activeAccount.ar}
                                onChange={(e) => {
                                    let val = parseInt(e.target.value, 10);
                                    if (isNaN(val)) val = '';
                                    else if (val > terms.maxAr) val = terms.maxAr;
                                    updateActiveAccount('ar', val);
                                }}
                                className="bg-[#1c1d21] border border-[#33343a] text-white text-sm rounded-lg px-3 py-2 w-20 focus:outline-none focus:border-blue-500" 
                            />
                        </div>
                        
                        {/* World Level */}
                        <div className="flex flex-col gap-1.5">
                            {/* Custom Tooltip Wrapper */}
                            <div className="relative group/tooltip w-max">
                                <label className="text-xs text-gray-400 font-bold uppercase border-b border-dashed border-gray-500 cursor-help">
                                    {terms.wl}
                                </label>
                                {/* Tooltip Box */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#121212] border border-[#33343a] text-white text-[10px] md:text-xs font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                    {terms.wlFull}
                                </div>
                            </div>
                            <select 
                                value={activeAccount.wl}
                                onChange={(e) => updateActiveAccount('wl', e.target.value)}
                                className="bg-[#1c1d21] border border-[#33343a] text-white text-sm rounded-lg px-3 py-2 min-w-[5rem] focus:outline-none focus:border-blue-500 appearance-none"
                            >
                                {terms.wlOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Account Server */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs text-gray-400 font-bold">Server</label>
                            <select 
                                value={activeAccount.server}
                                onChange={(e) => updateActiveAccount('server', e.target.value)}
                                className="bg-[#1c1d21] border border-[#33343a] text-white text-sm rounded-lg px-3 py-2 w-32 focus:outline-none focus:border-blue-500"
                            >
                                <option value="America">America</option>
                                <option value="Europe">Europe</option>
                                <option value="Asia">Asia</option>
                            </select>
                        </div>
                        
                        {/* Dynamic Main Character Toggle */}
                        <div className="flex flex-col gap-1.5 min-w-[140px]">
                            <label className="text-xs text-gray-400 font-bold uppercase">{terms.mcTitle}</label>
                            <div className="flex items-center bg-[#1c1d21] border border-[#33343a] rounded-lg overflow-hidden h-[38px]">
                                <button 
                                    onClick={() => updateActiveAccount('gender', 'M')}
                                    className={`flex-1 h-full px-3 flex items-center justify-center text-xs font-bold transition-colors hover:border-blue-500 ${activeAccount.gender === 'M' ? 'bg-teal-600/30 text-teal-400' : 'text-gray-500 hover:text-gray-300 hover:bg-[#24252a]'}`}
                                >
                                    {terms.mcMale}
                                </button>
                                <div className="w-[1px] h-full bg-[#33343a]"></div>
                                <button 
                                    onClick={() => updateActiveAccount('gender', 'F')}
                                    className={`flex-1 h-full px-3 flex items-center justify-center text-xs font-bold transition-colors hover:border-blue-500 ${activeAccount.gender === 'F' ? 'bg-pink-600/30 text-pink-400' : 'text-gray-500 hover:text-gray-300 hover:bg-[#24252a]'}`}
                                >
                                    {terms.mcFemale}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Planner Settings */}
                {/* <div className="bg-[#24252a] border border-[#33343a] rounded-xl p-4 md:p-6 shadow-sm opacity-50 pointer-events-none">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Planner Settings (WIP)</h3>
                    ... your toggles ...
                </div>
                */}

                {/* Other Settings */}
                <div className="bg-[#24252a] border border-[#33343a] rounded-xl p-4 md:p-6 shadow-sm">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Other Settings</h3>
                    
                    {/* Hide Toggles */}
                    {/* <div className="divide-y divide-[#33343a] mb-4">
                        <Toggle label="Hide Artifacts from expanded Goals" checked={false} />
                        <Toggle label="Hide Weapons from expanded Goals" checked={false} />
                    </div> 
                    */}

                    <div className="flex flex-col gap-1.5 w-max mt-4">
                        <label className="text-xs text-gray-400 font-bold">Hour Format</label>
                        <select className="bg-[#1c1d21] border border-[#33343a] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 appearance-none pr-8">
                            <option>24 hours</option>
                            <option>12 hours</option>
                        </select>
                    </div>
                </div>

            </div>
        </div>
    );
}