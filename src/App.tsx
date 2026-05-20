import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { GAME_CONFIG } from './config/games';
import { GAME_ROUTES } from './config/gameRoutes';

import LoadingFallback from './components/ui/LoadingFallback';
import GameLayout from './components/game/GameLayout';

const Home = lazy(() => import('./pages/Home'));

function getNavLinks(game) {
  const { navIcons } = game;
  return [
    { name: 'Home', path: game.path, icon: <img src={navIcons.home} alt="Home" className="w-5 h-5 object-contain" /> },
    { name: 'Planner', path: `${game.path}/planner`, icon: <img src={navIcons.planner} alt="Planner" className="w-5 h-5 object-contain" /> },
    { name: 'Settings', path: `${game.path}/settings`, icon: <img src={navIcons.settings} alt="Settings" className="w-5 h-5 object-contain scale-150" /> }
  ];
}

export default function App() {
  const activeGames = GAME_CONFIG.filter(game => game.status === 'active');

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />

          {activeGames.map(game => {
            const routes = GAME_ROUTES[game.id];
            if (!routes) return null;
            return (
              <Route key={game.id} path={game.path} element={
                <GameLayout
                  gameTitle={game.name}
                  currentGameBgUrl={game.bgUrl}
                  navLinks={getNavLinks(game)}
                />
              }>
                <Route index element={<routes.Home />} />
                <Route path="planner" element={<routes.Planner />} />
                <Route path="settings" element={<routes.Settings gameId={game.id} />} />
              </Route>
            );
          })}
        </Routes>
      </Suspense>
    </>
  );
}