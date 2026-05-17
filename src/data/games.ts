import genshinBackground from '../assets/gamebackground/genshin_background.webp';
import hsrBackground from '../assets/gamebackground/hsr_background.png';
import zzzBackground from '../assets/gamebackground/zzz_background.jpg';
import wuwaBackground from '../assets/gamebackground/wuwa_background.jpg';

import genshinLogoIcon from '../assets/genshin/genshin-logo.webp';
import genshinPlannerIcon from '../assets/genshin/genshin-quest.png';
import genshinSettingsIcon from '../assets/genshin/settings-icon.webp';

export const GAME_CONFIG = [
    {
        id: 'genshin',
        name: 'Genshin Impact',
        path: '/genshin',
        bgUrl: genshinBackground,
        status: 'active',
        tags: [],
        navIcons: {
            home: genshinLogoIcon,
            planner: genshinPlannerIcon,
            settings: genshinSettingsIcon
        }
    },
    {
        id: 'hsr',
        name: 'Honkai: Star Rail',
        path: '#',
        bgUrl: hsrBackground,
        status: 'inactive',
        tags: [],
        navIcons: {}
    },
    {
        id: 'zzz',
        name: 'Zenless Zone Zero',
        path: '#',
        bgUrl: zzzBackground,
        status: 'inactive',
        tags: [],
        navIcons: {}
    },
    {
        id: 'wuwa',
        name: 'Wuthering Waves',
        path: '#',
        bgUrl: wuwaBackground,
        status: 'inactive',
        tags: [],
        navIcons: {}
    }
];