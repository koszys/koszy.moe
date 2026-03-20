import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import GenshinHome from './pages/genshin/GenshinHome';
import GenshinPlanner from './pages/genshin/GenshinPlanner';

// Components
import GameLayout from './components/GameLayout';

// Genshin Icons
import genshinPlannerIcon from './assets/genshin/genshin-quest.png';
import genshinLogoIcon from './assets/genshin/genshin-logo.webp'

export default function App() {
  
  // Genshin Sidebar Links
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

  return (
    <Routes>
      {/* The Main Hub */}
      <Route path="/" element={<Home />} />
      
      {/* Genshin Route: Passing the background URL as a prop */}
      <Route path="/genshin" element={
        <GameLayout 
          gameTitle="Genshin Impact" 
          currentGameBgUrl="/genshin_background.webp"
          navLinks={genshinLinks} 
        />
      }>
        <Route index element={<GenshinHome />} />
        <Route path="planner" element={<GenshinPlanner />} />
        {/* <Route path="/privacy" element={<Privacy />} /> */}
      </Route>

    </Routes>
  );
}