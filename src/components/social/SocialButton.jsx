import { SOCIAL_LINKS } from '../../config/socials';

export default function SocialButton({ type, variant = 'full' }) {
    const social = SOCIAL_LINKS[type];

    if (!social) {
        console.warn(`Unknown social type: ${type}`);
        return null;
    }

    const isIconOnly = variant === 'icon';
    const imageClass = type === 'kofi' ? 'w-6 h-5' : 'w-5 h-5';

    return (
        <a
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 ${
            isIconOnly
            ? `px-3 py-2 ${social.bgClass} border border-transparent hover:bg-inherit ${social.borderClass} text-white hover:text-white text-sm rounded transition-colors`
            : `px-5 py-2 ${social.bgClass} border border-transparent hover:bg-inherit ${social.borderClass} text-white hover:text-white text-sm font-bold rounded transition-colors`
        }`}
        title={social.name}
        >
        <img src={social.icon} alt={social.name} className={imageClass} />
        {!isIconOnly && <span>{isIconOnly ? '' : social.name}</span>}
        </a>
    );
}
