import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { GAME_CONFIG } from './data/games'; 

// Pages
import Home from './pages/Home';
import GenshinHome from './pages/genshin/GenshinHome';
import GenshinPlanner from './pages/genshin/GenshinPlanner';

// Components
import GameLayout from './components/GameLayout';

// Genshin Icons
import genshinPlannerIcon from './assets/genshin/genshin-quest.png';
import genshinLogoIcon from './assets/genshin/genshin-logo.webp';

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
    }
  ];

  // Find the Genshin data from master config
  const genshinData = GAME_CONFIG.find(game => game.id === 'genshin');

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/genshin" element={
        <GameLayout 
          gameTitle={genshinData.name} 
          currentGameBgUrl={genshinData.bgUrl} // Pulls dynamically from games.js
          navLinks={genshinLinks} 
        />
      }>
        <Route index element={<GenshinHome />} />
        <Route path="planner" element={<GenshinPlanner />} />
      </Route>
    </Routes>
  );
}