import { lazy } from 'react';

interface GameRouteEntry {
    Home: ReturnType<typeof lazy>;
    Planner: ReturnType<typeof lazy>;
    Settings: ReturnType<typeof lazy>;
}

export const GAME_ROUTES: Record<string, GameRouteEntry | null> = {
    genshin: {
        Home: lazy(() => import('../pages/genshin/GenshinHome')),
        Planner: lazy(() => import('../pages/genshin/GenshinPlanner')),
        Settings: lazy(() => import('../pages/Settings')),
    },
    hsr: null,
    zzz: null,
    wuwa: null,
};
