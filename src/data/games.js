import genshinBackground from '../assets/gamebackground/genshin_background.webp';
import hsrBackground from '../assets/gamebackground/hsr_background.png';
import zzzBackground from '../assets/gamebackground/zzz_background.jpg';
import wuwaBackground from '../assets/gamebackground/wuwa_background.jpg';

export const GAME_CONFIG = [
    {
        id: 'genshin',
        name: 'Genshin Impact',
        path: '/genshin',
        bgUrl: genshinBackground, // Change this once to update all 
        status: 'active',
        tags: []
    },
    {
        id: 'hsr',
        name: 'Honkai: Star Rail',
        path: '#',
        bgUrl: hsrBackground,
        status: 'inactive',
        tags: []
    },
    {
        id: 'zzz',
        name: 'Zenless Zone Zero',
        path: '#',
        bgUrl: zzzBackground,
        status: 'inactive',
        tags: []
    },
    {
        id: 'wuwa',
        name: 'Wuthering Waves',
        path: '#',
        bgUrl: wuwaBackground,
        status: 'inactive',
        tags: []
    }
];