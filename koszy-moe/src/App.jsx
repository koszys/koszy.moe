import React, { useState, useEffect } from 'react';
import GameCard from './components/GameCard';

const GAMES = [
  {
    id: 'genshin',
    name: 'Genshin Impact',
    status: 'active',
    bgUrl: '/genshin_impact_background.webp',
    link: '/genshin',
    tags: [
      { label: 'Planner', color: 'bg-blue-500/80' },
      { label: 'Timeline', color: 'bg-purple-500/80' }
    ]
  },
  {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    status: 'inactive',
    bgUrl: '/hsr_background.png'
  },
  {
    id: 'zzz',
    name: 'Zenless Zone Zero',
    status: 'inactive',
    bgUrl: '/zzz_background.jpg'
  },
  {
    id: 'wuwa',
    name: 'Wuthering Waves',
    status: 'inactive',
    bgUrl: ''
  }
];

// Automatically grab all background URLs for the randomizer
const BACKGROUNDS = GAMES.map(game => game.bgUrl);

export default function App() {
  const [currentBg, setCurrentBg] = useState(null);

  useEffect(() => {
    const savedBg = localStorage.getItem('koszy-last-bg');
    if (savedBg) {
      setCurrentBg(savedBg);
    } else {
      const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
      setCurrentBg(randomBg);
    }
  }, []);

  const handleHover = (bgUrl) => {
    setCurrentBg(bgUrl);
    localStorage.setItem('koszy-last-bg', bgUrl);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 font-sans selection:bg-blue-500 selection:text-white relative">
      
      <div 
        className="fixed inset-0 z-0 transition-all duration-700 ease-in-out bg-cover bg-center bg-no-repeat opacity-25"
        style={{ backgroundImage: currentBg ? `url(${currentBg})` : 'none' }}
      />

      <div className="relative z-10">
        <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-[#1c1d21]/90 backdrop-blur-sm border-b border-[#33343a] shadow-md">
          <div className="flex items-center gap-8">
            <div className="text-2xl font-black text-white tracking-widest cursor-pointer">
              KOSZY<span className="text-blue-500">.MOE</span>
            </div>
            <nav className="hidden md:flex space-x-6 text-sm font-semibold">
              <a href="#" className="text-white border-b-2 border-blue-500 pb-1">Home</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Global Planner</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Pinned Events</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-sm font-semibold text-gray-400 hover:text-white transition-colors hidden sm:block">Discord</button>
            <button className="text-sm font-semibold text-gray-400 hover:text-white transition-colors hidden sm:block">Ko-fi</button>
            <button className="ml-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-bold transition-colors">Sign In</button>
          </div>
        </header>

        <main className="max-w-[1200px] mx-auto p-4 md:p-6 mt-6">
          <section className="mb-10">
            <div className="relative w-full h-32 md:h-40 bg-[#1c1d21] border border-[#33343a] rounded-md overflow-hidden flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative z-10 text-center px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide uppercase">Welcome to Koszy.moe</h1>
                <p className="text-gray-400 text-sm md:text-base">Your unified tracker for daily rewards, events, and gacha banners.</p>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-blue-500 pl-3">
              Supported Games
            </h2>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAMES.map((game) => (
              <GameCard 
                key={game.id}
                name={game.name}
                status={game.status}
                bgUrl={game.bgUrl}
                link={game.link}
                tags={game.tags}
                onHover={handleHover}
              />
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}