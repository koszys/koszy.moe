import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Components
import GameCard from '../components/game/GameCard';
import Footer from '../components/ui/Footer';
import ChangelogSection from '../components/changelog/ChangelogSection';
import SocialCards from '../components/social/SocialCards';
import SocialButton from '../components/social/SocialButton';

// Data
import { GAME_CONFIG } from '../data/games'; 

// Context
import { useAuth } from '../context/AuthContext';

//Map backgrounds dynamically from config
const BACKGROUNDS = GAME_CONFIG.map(game => game.bgUrl);

const preloadImage = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
};

export default function Home() {
  const [currentBg, setCurrentBg] = useState(null);
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { user, openModal, triggerLogout } = useAuth();

  {/* Preload background and set when ready */}
  useEffect(() => {
    const savedBg = localStorage.getItem('koszy-last-bg');
    const bgToUse = savedBg || BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];

    preloadImage(bgToUse).then(() => {
        setCurrentBg(bgToUse);
        setIsBgLoaded(true);
    });
  }, []);

  {/* Handles scroll behavior */}
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  {/* Handles hover behavior for game cards */}
  const handleHover = (bgUrl) => {
    if (currentBg === bgUrl) return;

    setIsBgLoaded(false);
    preloadImage(bgUrl).then(() => {
        setCurrentBg(bgUrl);
        setIsBgLoaded(true);
        localStorage.setItem('koszy-last-bg', bgUrl);
    });
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 font-sans selection:bg-blue-500 selection:text-white relative">
      
     {/* Dynamic Background Layer - Only render when loaded */}
      {currentBg && (
        <div
          className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${isBgLoaded ? 'opacity-40' : 'opacity-0'}`}
          style={{ backgroundImage: `url('${currentBg}')` }}
        />
      )}

      {/* Main Content Container with higher z-index to sit above backgrounds */}
      <div className="relative z-10">

        {/* Header */}
        <header className={`sticky top-0 z-50 flex items-center justify-between px-5 py-3 transition-all duration-700 border-b ${
          scrolled 
            ? 'bg-[#1c1d21]/90 border-[#33343a] shadow-md' 
            : 'bg-transparent border-transparent'
          }`}>
        
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-2xl font-black text-white hover:text-blue-500 tracking-widest cursor-pointer"
            >
              KOSZY<span className="text-blue-500">.MOE</span>
            </Link>
            <nav className="hidden md:flex space-x-6 text-sm font-semibold">
              <a href="#" className="text-white border-b-2 border-blue-500 hover:text-white pb-1">Home</a>
              {/* <a href="#" className="text-gray-400 hover:text-white transition-colors">Global Planner</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Pinned Events</a> */}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex">
              <SocialButton type="discord" variant="full" />
            </div>

            <div className="hidden sm:flex">
              <SocialButton type="kofi" variant="full" />
            </div>

            {/* User Auth Buttons */}
            {user ? (
                <div className="relative z-50 ml-2">
                    {/* Trigger Button */}
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 bg-[#1c1d21]/80 hover:bg-[#24252a] border border-[#33343a] hover:border-gray-500 rounded-full py-1 pr-3 pl-1 transition-all"
                    >
                        {user.avatar ? (
                            <img src={user.avatar} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="text-sm font-bold text-blue-400">{user.name}</span>
                        <svg className={`w-4 h-4 text-blue-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                        <>
                            {/* Invisible background overlay to close menu when clicking outside */}
                            <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                            
                            <div className="absolute right-0 mt-2 w-48 bg-[#1c1d21] border border-[#33343a] hover:border-blue-500 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col">
                                <button 
                                    onClick={() => { setIsUserMenuOpen(false); triggerLogout(); }} 
                                    className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-[#24252a] hover:border-transparent transition-colors text-left w-full"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <button 
                    onClick={openModal} 
                    className="ml-2 px-5 py-2 bg-blue-500 border border-transparent hover:bg-transparent hover:border-blue-500 text-white rounded text-sm font-bold transition-colors shadow-md"
                >
                    Sign In
                </button>
            )}
          </div>

        </header>

        {/* Main Page */}
        <main className="max-w-[1200px] mx-auto p-4 md:p-6 mt-6">

          {/* Intro */}
          <section className="mb-10">
            <div className="relative w-full h-32 md:h-40 flex items-center justify-center group cursor-pointer">
              <div className="relative z-10 text-center px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide uppercase"> KOSZY<span className="text-blue-500">.MOE</span></h1>
                <p className="text-white text-sm md:text-base">
                  Your tracker for dailies, events, and other content for your gacha games. 
                  This is currently being maintained solo so I would appreciate any support and feedback!
                </p>
              </div>
            </div>
          </section>

          {/* Supported Games */}
          <div className="flex items-center justify-between mb-6">
            <h2 className=" text-xl font-bold text-white uppercase tracking-wider border-l-4 border-blue-500 pl-3">
              Supported Games
            </h2>
          </div>

          {/* Game Cards Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAME_CONFIG.map((game) => (
              <GameCard 
                key={game.id}
                name={game.name}
                status={game.status}
                bgUrl={game.bgUrl}
                link={game.path}
                tags={game.tags}
                onHover={handleHover}
              />
            ))}
          </section>

          {/* Community & Support Section */}
          <SocialCards />
          
          {/* Upcoming Features */}
          <section className="mt-16">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-yellow-500 pl-3 mb-6">
              Upcoming Features
            </h2>
            <div className="space-y-4">
              <div className="bg-[#1c1d21]/70 border border-[#33343a] rounded-lg p-6">
                <h4 className="text-white font-bold mb-2">✓ Multi-Account Support</h4>
                <p className="text-gray-350 text-sm">Track multiple accounts across different platforms with ease.</p>
              </div>
              <div className="bg-[#1c1d21]/70 border border-[#33343a] rounded-lg p-6">
                <h4 className="text-white font-bold mb-2">✓ Push Notifications</h4>
                <p className="text-gray-350 text-sm">Get real-time alerts for event resets and important milestones.</p>
              </div>
            </div>
          </section>
        
          {/* Changelog */}
          <ChangelogSection game="main" />

          {/* Getting Started */}
          {/* <section className="mt-16 mb-20">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-green-500 pl-3 mb-6">
              Getting Started
            </h2>
            <div className="bg-[#1c1d21]/40 border border-[#33343a] rounded-lg p-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Select Your Games</h4>
                    <p className="text-gray-400 text-sm">Choose which gacha games you play from our supported list above.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Set Up Your Dashboard</h4>
                    <p className="text-gray-400 text-sm">Customize your daily checklist and pin your most important events.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                  <div>
                    <h4 className="text-white font-bold mb-1">Stay on Top of Events</h4>
                    <p className="text-gray-400 text-sm">Never miss a daily reset, event deadline, or limited-time reward again.</p>
                  </div>
                </div>
              </div>
            </div>
          </section> */}

          {/* Footer */}
          <Footer />

        </main>
      </div>
    </div>
  );
}