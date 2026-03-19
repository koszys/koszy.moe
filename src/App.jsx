import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import GenshinHome from './pages/genshin/GenshinHome';
import GenshinPlanner from './pages/genshin/GenshinPlanner';

// Components
import GameLayout from './components/GameLayout';

export default function App() {
  
  // Define the sidebar links for Genshin here
  // You can easily swap the icons out for actual <img> tags of the seelies later!
  const genshinLinks = [
    { name: 'Home', path: '/genshin', icon: '🏠' },
    { name: 'Planner', path: '/genshin/planner', icon: '📅' }
  ];

  return (
    <Routes>
      {/* The Main Hub */}
      <Route path="/" element={<Home />} />
      
      {/* Updated Genshin Route: Passing the background URL as a prop */}
      <Route path="/genshin" element={
        <GameLayout 
          gameTitle="Genshin Impact" 
          currentGameBgUrl="/genshin_impact_background.webp" // <-- Pass the public image here
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