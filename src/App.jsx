import React, { useState, useEffect } from 'react';
import GameCard from './components/GameCard';
import kofiLogo from './assets/kofilogo.webp';
import discordLogo from './assets/discordlogo.png';

const GAMES = [
  {
    id: 'genshin',
    name: 'Genshin Impact',
    status: 'active',
    bgUrl: '/genshin_impact_background.webp',
    link: '/genshin',
    tags: [
      //{ label: 'Planner', color: 'bg-blue-500/80' },
      //{ label: 'Timeline', color: 'bg-purple-500/80' }
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
    bgUrl: '/wuwa_background.jpg'
  }
];

// Automatically grab all background URLs for the randomizer
const BACKGROUNDS = GAMES.map(game => game.bgUrl);

export default function App() {
  const [currentBg, setCurrentBg] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedBg = localStorage.getItem('koszy-last-bg');
    if (savedBg) {
      setCurrentBg(savedBg);
    } else {
      const randomBg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
      setCurrentBg(randomBg);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHover = (bgUrl) => {
    setCurrentBg(bgUrl);
    localStorage.setItem('koszy-last-bg', bgUrl);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-300 font-sans selection:bg-blue-500 selection:text-white relative">
      
     {/* Dynamic Background Layers */}
      {BACKGROUNDS.map((bg) => (
        <div 
          key={bg}
          className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700 ease-in-out ${
            currentBg === bg ? 'opacity-25' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${bg}')` }}
        />
      ))}

      {/* Header */}
      <div className="relative z-10">
        <header className={`sticky top-0 z-50 flex items-center justify-between px-5 py-3 transition-all duration-700 border-b ${
          scrolled 
            ? 'bg-[#1c1d21]/90 border-[#33343a] shadow-md' 
            : 'bg-transparent border-transparent'
        }`}>
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
            <button className="flex hidden items-center gap-2 text-sm font-semibold text-white hover:text-white transition-colors sm:flex bg-[#5865F2] hover:bg-inherit hover:border-[#5865F2] px-3 py-2 rounded">
              <img src={discordLogo} alt="Discord" className="w-5 h-5" />
              <span>Discord</span>
            </button>

            <button className="flex hidden items-center gap-2 text-sm font-semibold text-white hover:text-white transition-colors sm:flex  bg-red-500 hover:bg-inherit hover:border-red-500 px-3 py-2 rounded">
              <img src={kofiLogo} alt="Ko-fi" className="w-6 h-5" />
              <span>Ko-fi</span>
            </button>

            <button className="ml-2 px-5 py-2 bg-blue-500 hover:bg-inherit hover:border-blue-500 text-white rounded text-sm font-bold transition-colors">Sign In</button>
          </div>

        </header>

        {/* <div className="relative z-10">
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
            <button className="text-sm font-semibold text-white hover:text-white transition-colors hidden sm:block bg-red-500">Ko-fi</button>
            <button className="ml-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-bold transition-colors">Sign In</button>
          </div>
        </header> */}

        {/* Hero Section */}
        <main className="max-w-[1200px] mx-auto p-4 md:p-6 mt-6">
          <section className="mb-10">
            <div className="relative w-full h-32 md:h-40 flex items-center justify-center group cursor-pointer">
              <div className="relative z-10 text-center px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide uppercase"> KOSZY<span className="text-blue-500">.MOE</span></h1>
                <p className="text-gray-400 text-sm md:text-base">
                  Your tracker for dailies, events, and other content for your gacha games. 
                  This is currently being maintained solo so I would appreciate any support and feedback!
                </p>
              </div>
            </div>
          </section>

          {/* <main className="max-w-[1200px] mx-auto p-4 md:p-6 mt-6">
          <section className="mb-10">
            <div className="relative w-full h-32 md:h-40 bg-[#1c1d21] border border-[#33343a] rounded-md overflow-hidden flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0  bg-gradient-to-r from-blue-900/20 to-purple-900/20 group-hover:scale-105 transition-transform duration-500"></div> {}
              <div className="relative z-10 text-center px-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-wide uppercase"> KOSZY<span className="text-blue-500">.MOE</span></h1>
                <p className="text-gray-400 text-sm md:text-base">
                  Your tracker for dailies, events, and other content for your gacha games. 
                  This is currently being maintained solo so I would appreciate any support and feedback!
                </p>
              </div>
            </div>
          </section> */}

          {/* Supported Games */}
          <div className="flex items-center justify-between mb-6">
            <h2 className=" text-xl font-bold text-white uppercase tracking-wider border-l-4 border-blue-500 pl-3">
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

          {/* Community & Support Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 mt-10">
            
            {/* Discord Card */}
            <div className="bg-[#1c1d21]/40 border border-[#33343a] rounded-md p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-all duration-300 hover:shadow-[0_0_15px_rgba(88,101,242,0.15)]">
              <div className="w-16 h-16 flex-shrink-0  rounded-full flex items-center justify-center p-3">
                <img src={discordLogo} alt="Discord" className="w-full h-full object-contain" />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-2">Join the Community</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Join the discord server to share feedback, suggest features, and talk with other users! I appreciate any help on maintaining and improving the planner, so feel free to reach out if you want to contribute. Thank you!
                </p>
                <a
                  href="YOUR_DISCORD_LINK_HERE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#5865F2] border border-transparent hover:bg-inherit hover:border-[#5865F2] text-white hover:text-white text-sm font-bold rounded transition-colors"
                >
                  <img src={discordLogo} alt="Discord" className="w-5 h-5" />
                  <span>Discord</span>
                </a>
              </div>
            </div>

            {/* Ko-fi Card */}
            <div className="bg-[#1c1d21]/40 border border-[#33343a] rounded-md p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,94,91,0.15)]">
              <div className="w-16 h-16 flex-shrink-0 rounded-full flex items-center justify-center p-3">
                <img src={kofiLogo} alt="Ko-fi" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-white mb-2">Support the Project</h3>
                <p className="text-gray-400 text-sm mb-4">
                  koszy.moe currently runs ad-free and is being maintained by one person (me lol). If this planner helps you out with dailies and stuff, consider supporting me on Ko-fi. I appreciate it!
                </p>
                <a
                  href="YOUR_KOFI_LINK_HERE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 bg-red-500 border border-transparent hover:bg-inherit hover:border-red-500 text-white hover:text-white text-sm font-bold rounded transition-colors"
                >
                  <img src={kofiLogo} alt="Ko-fi" className="w-6 h-5" />
                  <span>Support on Ko-fi</span>
                </a>
              </div>
            </div>
          </section>
          
          {/* Upcoming Features */}
          <section className="mt-16">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-yellow-500 pl-3 mb-6">
              Upcoming Features
            </h2>
            <div className="space-y-4">
              <div className="bg-[#1c1d21]/40 border border-[#33343a] rounded-lg p-6">
                <h4 className="text-white font-bold mb-2">✓ Multi-Account Support</h4>
                <p className="text-gray-400 text-sm">Track multiple accounts across different platforms with ease.</p>
              </div>
              <div className="bg-[#1c1d21]/40 border border-[#33343a] rounded-lg p-6">
                <h4 className="text-white font-bold mb-2">✓ Push Notifications</h4>
                <p className="text-gray-400 text-sm">Get real-time alerts for event resets and important milestones.</p>
              </div>
            </div>
          </section>
          
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

        </main>
      </div>
    </div>
  );
}