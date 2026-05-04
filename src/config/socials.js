import discordLogo from '../assets/discordlogo.png';
import kofiLogo from '../assets/kofilogo.webp';

export const SOCIAL_LINKS = {
    discord: {
        name: 'Discord',
        url: 'YOUR_DISCORD_LINK_HERE',
        icon: discordLogo,
        color: '#5865F2',
        bgClass: 'bg-[#5865F2]',
        borderClass: 'hover:border-[#5865F2]',
        shadowClass: 'hover:shadow-[0_0_15px_rgba(88,101,242,0.15)]',
    },
    kofi: {
        name: 'Ko-fi',
        url: 'YOUR_KOFI_LINK_HERE',
        icon: kofiLogo,
        color: '#ff5e5b',
        bgClass: 'bg-red-500',
        borderClass: 'hover:border-red-500',
        shadowClass: 'hover:shadow-[0_0_15px_rgba(255,94,91,0.15)]',
    },
};
