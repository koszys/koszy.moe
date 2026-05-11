import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { GAME_CONFIG } from './data/games';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const GenshinHome = lazy(() => import('./pages/genshin/GenshinHome'));
const GenshinPlanner = lazy(() => import('./pages/genshin/GenshinPlanner'));
const Settings = lazy(() => import('./pages/Settings'));

// Components
import GameLayout from './components/GameLayout';
import AuthModal from './components/AuthModal';

// Genshin Icons
import genshinPlannerIcon from './assets/genshin/genshin-quest.png';
import genshinLogoIcon from './assets/genshin/genshin-logo.webp';
import genshinSettingsIcon from './assets/genshin/settings-icon.webp';

export default function App() {
  
  const genshinLinks = [
    { 
      name: 'Home', 
      path: '/genshin', 
      icon: <img src={genshinLogoIcon} alt="Home" className="w-5 h-5 object-contain" /> 
    },
    { 
      name: 'Planner', 
      path: '/genshin/planner', 
      icon: <img src={genshinPlannerIcon} alt="Planner" className="w-5 h-5 object-contain" /> 
    },
    {
      name: 'Settings',
      path: '/genshin/settings',
      icon: <img src={genshinSettingsIcon} alt="Settings" className="w-5 h-5 object-contain scale-150" />  
    }
  ];

  // Find the Genshin data from master config
  const genshinData = GAME_CONFIG.find(game => game.id === 'genshin');

  return (
    <>
      <AuthModal />

      <Suspense fallback={
        <div className="min-h-screen bg-[#121212] flex items-center justify-center">
          <div className="text-gray-400 text-lg">Loading...</div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/genshin" element={
            <GameLayout
              gameTitle={genshinData.name}
              currentGameBgUrl={genshinData.bgUrl}
              navLinks={genshinLinks}
            />
          }>
            <Route index element={<GenshinHome />} />
            <Route path="planner" element={<GenshinPlanner />} />
            <Route path="settings" element={<Settings gameId="genshin" />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}