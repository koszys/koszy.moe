import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import kofiLogo from '../assets/kofilogo.webp';
import discordLogo from '../assets/discordlogo.png';

import Footer from './Footer';

export default function GameLayout({ gameTitle, navLinks, currentGameBgUrl }) {
    const location = useLocation();
    
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isGameSwitcherOpen, setIsGameSwitcherOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const availableGames = [
        { name: 'Genshin Impact', path: '/genshin', bgUrl: '/genshin_background.webp' },
        { name: 'Honkai: Star Rail', path: '#', bgUrl: '/hsr_background.png' },
        { name: 'Zenless Zone Zero', path: '#', bgUrl: '/zzz_background.jpg' },
        { name: 'Wuthering Waves', path: '#', bgUrl: '/wuwa_background.jpg' }
    ];

    return (
        <div className="relative flex h-screen w-full bg-[#121212] text-gray-300 font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
        
        {/* Static Background Layer for Main Content */}
        <div 
            className="absolute inset-0  bg-cover bg-center bg-no-repeat opacity-35 pointer-events-none"
            style={{ backgroundImage: currentGameBgUrl ? `url('${currentGameBgUrl}')` : 'none' }}
        />

        {/* Mobile Nav Overlay */}
        {isMobileNavOpen && (
            <div 
            className="fixed inset-0 bg-black/70 z-40 md:hidden transition-opacity" // "backdrop-blur-sm" adds a blur effect to the background
            onClick={() => setIsMobileNavOpen(false)} 
            />
        )}

        {/* Left Sidebar */}
        <aside className={`
            fixed md:static inset-y-0 left-0 z-50 bg-[#1c1d21]/80 backdrop-blur-sm border-r border-[#33343a] flex flex-col flex-shrink-0
            transition-all duration-300 ease-in-out
            ${isMobileNavOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
            ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}
        `}>
            
            {/* Sidebar Header: Logo ONLY */}
            <div className="h-16 flex items-center justify-center px-4 border-b border-[#33343a] flex-shrink-0 "> {/* bg-[#121212] can be added for a different logo background*/}
            {(!isSidebarCollapsed || isMobileNavOpen) ? (
                <Link to="/" className="text-xl font-black text-white tracking-widest overflow-hidden whitespace-nowrap w-full text-left hover:text-blue-500 transition-colors">
                KOSZY<span className="text-blue-500">.MOE</span>
                </Link>
            ) : (
                <Link to="/" className="text-xl font-black text-white tracking-widest hover:text-blue-500 transition-colors">
                K<span className="text-blue-500">.</span>
                </Link>
            )}

            {/* Mobile Close Button in Left Sidebar */}
            <button onClick={() => setIsMobileNavOpen(false)} className="md:hidden p-1 bg-gray-500/20 text-white hover:text-white hover:border-blue-500 rounded-md ml-auto">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>

            {/* Game Switcher Button In Left Sidebar */}
            <div className="p-3 border-b border-[#33343a] flex-shrink-0">
            <button 
                onClick={() => setIsGameSwitcherOpen(true)}
                className={`group relative w-full rounded-md overflow-hidden border border-[#33343a] hover:border-blue-500 transition-all shadow-md
                ${isSidebarCollapsed && !isMobileNavOpen ? 'h-12 flex items-center justify-center' : 'h-14 flex items-center'}
                `}
                title="Switch Game"
            >
                {/* Background Image Layer filling the entire container */}
                <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: currentGameBgUrl ? `url('${currentGameBgUrl}')` : 'none', backgroundColor: '#2a2b30' }}
                ></div>
                
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/90 via-[#121212]/50 to-[#121212]/20 z-10"></div>
                
                {/* Content Layer (Flexbox to handle expanded/collapsed views) */}
                <div className={`relative z-20 w-full flex items-center justify-between px-3`}>
                    <span className="font-bold text-sm text-white truncate drop-shadow-md">{gameTitle}</span>
                    {(!isSidebarCollapsed || isMobileNavOpen) && (
                        <svg className="w-4 h-4 text-white/90 drop-shadow-md flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                    )}
                </div>
            </button>
            </div>

            {/* Left Sidebar Nav Links */}
            <nav className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
            {navLinks.map((link) => {
                const isActive = location.pathname === link.path || location.pathname === link.path + '/';
                return (
                <Link 
                    key={link.name} 
                    to={link.path}
                    title={isSidebarCollapsed ? link.name : ""}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={`flex items-center rounded-md font-bold text-sm transition-all whitespace-nowrap overflow-hidden
                    ${isSidebarCollapsed && !isMobileNavOpen ? 'justify-center p-3' : 'px-4 py-3 gap-3'}
                    ${isActive 
                        ? 'bg-gray-400/20 text-white hover:text-white border border-blue-500' 
                        : 'text-gray-400 hover:bg-[#2a2b30] hover:text-white border border-transparent'}
                    `}
                >
                    <span className="text-lg flex-shrink-0">{link.icon}</span>
                    {(!isSidebarCollapsed || isMobileNavOpen) && <span>{link.name}</span>}
                </Link>
                );
            })}
            </nav>
        </aside>

        {/* Right Column (Header + Content) */}
        <div className="flex-1 flex flex-col min-w-0 relative">
            
            {/* Global Top Header */}
            <header className="h-16 flex-shrink-0 bg-[#1c1d21]/80 backdrop-blur-sm border-b border-[#33343a] flex items-center justify-between px-4 z-30 shadow-sm">
            
            <div className="flex items-center gap-2 md:gap-4">
                
                {/* Mobile Hamburger Menu */}
                <button 
                className="md:hidden p-1.5 text-white hover:text-white transition-colors hover:border-blue-500"
                onClick={() => setIsMobileNavOpen(true)}
                >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                </button>

                {/* Desktop Hamburger Collapse Toggle */}
                <button 
                className="hidden md:flex p-1.5 text-white hover:text-white rounded-md transition-colors hover:border-blue-500"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                </button>

                {/* Mobile Game Switcher Icon */}
                <button 
                className="md:hidden p-1.5 text-white hover:text-white hover:border-blue-500 transition-colors"
                onClick={() => setIsGameSwitcherOpen(true)}
                title={`Switching from ${gameTitle}`}
                >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                </button>

            </div>

            {/* Right Side Icons (Discord, Ko-fi) */}
            <div className="flex items-center gap-4">
                <a href="#" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                <img src={discordLogo} alt="Discord" className="w-full h-full object-contain" />
                </a>
                <a href="#" className="w-6 h-6 opacity-70 hover:opacity-100 transition-opacity">
                <img src={kofiLogo} alt="Ko-fi" className="w-full h-full object-contain" />
                </a>
            </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">            
                <Outlet /> 
                <Footer /> 
            </main>
        </div>

        {/* Game Switcher Drawer */}
        {isGameSwitcherOpen && (
            <div 
            className="fixed inset-0 bg-[#1c1d21]/70 z-[60] transition-opacity" // "backdrop-blur-sm" adds a blur effect to the background
            onClick={() => setIsGameSwitcherOpen(false)} 
            />
        )}
        
        <div className={`
            fixed inset-y-0 left-0 z-[70] w-[85%] sm:w-80 bg-[#1c1d21] border-r border-[#33343a] shadow-2xl
            transform transition-transform duration-300 ease-in-out flex flex-col
            ${isGameSwitcherOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="p-5 border-b border-[#33343a] flex items-center justify-between ">
            
            {/* Game Switcher Header */}
            <Link to="/" className="text-xl font-black text-white tracking-widest overflow-hidden whitespace-nowrap w-full text-left hover:text-blue-500 transition-colors">
                KOSZY<span className="text-blue-500">.MOE</span>
            </Link>

            {/* Close Button */}
            <button onClick={() => setIsGameSwitcherOpen(false)} className="p-1.5 bg-gray-500/20 text-white hover:border-blue-500 rounded-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            </div>
            
            {/* Game Options List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {availableGames.map(game => (
                <Link
                key={game.name}
                to={game.path}
                onClick={() => setIsGameSwitcherOpen(false)}
                className="relative group block h-28 rounded-md overflow-hidden border border-[#33343a] hover:border-blue-500 transition-all shadow-md"
                >
                <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${game.bgUrl}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 w-full p-3 z-20">
                    <h3 className="font-bold text-white transition-colors drop-shadow-lg">
                    {game.name}
                    </h3>
                </div>
                </Link>
            ))}
            </div>
        </div>

        </div>
    );
}