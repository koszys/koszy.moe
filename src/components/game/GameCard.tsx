import { memo } from 'react';
import { Link } from 'react-router-dom';

interface GameCardProps {
    name: string;
    status: string;
    bgUrl: string;
    link?: string;
    tags: Array<{ label: string; color: string }>;
    onHover: (_bgUrl: string) => void;
}

export default memo(function GameCard({ name, status, bgUrl, link, tags, onHover }: GameCardProps) {
    const isActive = status === 'active';

    if (isActive && link) {
        return (
            <Link 
                to={link}
                onMouseEnter={() => onHover(bgUrl)}
                className="relative block h-48 bg-[#1c1d21] border border-[#33343a] hover:-translate-y-1 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] rounded-md overflow-hidden transition-all duration-300 group"
            >
                {renderCardContent()}
            </Link>
        );
    }

    return (
        <div 
            onMouseEnter={() => onHover(bgUrl)}
            className="relative block h-48 bg-[#1c1d21] border border-[#33343a] opacity-60 cursor-not-allowed hover:opacity-100 hover:border-gray-500 rounded-md overflow-hidden transition-all duration-300"
        >
            {renderCardContent()}
        </div>
    );

    function renderCardContent() {
        return (
            <>
                <div 
                    className={`absolute inset-0 bg-cover bg-center ${isActive ? 'transition-transform duration-500 group-hover:scale-105' : ''}`}
                    style={{ backgroundImage: `url('${bgUrl}')` }}
                ></div>
                
                <div className={`absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/${isActive ? '60' : '80'} to-[#121212]/${isActive ? '0' : '30'}`}></div>
                
                <div className="absolute bottom-0 left-0 w-full p-4 z-20">
                    <h3 className={`text-xl font-bold mb-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>{name}</h3>
                    
                    {isActive ? (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag, index) => (
                        <span key={index} className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white rounded-sm ${tag.color}`}>
                            {tag.label}
                        </span>
                        ))}
                    </div>
                    ) : (
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Coming Soon</p>
                    )}
                </div>
            </>
        );
    }
});