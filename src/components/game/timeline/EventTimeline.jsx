import { useState, useEffect, memo } from 'react';
import CountdownTimer from './CountdownTimer';

import { fetchEvents } from '../../../data/fetchEvents';
import { ASSET_BASE_URL } from '../../../config/constants';

// Helper to safely build CDN URLs (works for both local paths and full web URLs)
const getCdnUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${ASSET_BASE_URL}${path}`;
};

const EventCard = memo(function EventCard({ event, isCurrent }) {
    // 2. Use the helper to attach your CDN domain to the database image_path
    const fullImageUrl = getCdnUrl(event.image_path || event.image);
    const hasImage = !!fullImageUrl;
    
    // Safety check just in case it's typed as "Banner" or "banner" in the DB
    const isBanner = event.type?.toLowerCase() === 'banner';

    return (
        <div className={`relative flex items-center bg-[#1c1d21]/80 border border-[#33343a] rounded-xl p-3 min-h-[6rem] shadow-sm hover:border-[#4b4c53] transition-colors group ${!isCurrent ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`}>
        
        {/* LEFT: Event/Banner Image */}
        <div className={`flex-shrink-0 flex items-center justify-center mr-4 overflow-hidden ${
            isBanner 
            ? 'w-12 h-12 md:w-14 md:h-14 rounded-md' 
            : 'w-24 h-14 md:w-32 md:h-16 rounded-md'
        }`}>
            {hasImage && (
            <img 
                src={fullImageUrl} 
                alt={event.name} 
                className={`w-full h-full drop-shadow-md group-hover:scale-105 transition-transform ${
                isBanner ? 'object-contain' : 'object-cover'
                }`} 
            />
            )}
        </div>

        {/* MIDDLE: Content */}
        <div className="flex flex-col flex-1 justify-center min-w-0 pr-20">
            
            <div className={`flex ${isBanner ? 'items-center gap-2 mb-1.5' : 'flex-col items-start gap-1.5'}`}>
            {event.label && !isBanner && (
                <span className={`text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded w-max ${event.label.bgColor} ${event.label.textColor}`}>
                {event.label.text}
                </span>
            )}
            <h3 className="text-white font-bold text-sm md:text-base leading-tight truncate w-full">
                {event.name}
            </h3>
            </div>

            {/* BOTTOM: Character & Weapon Icons (For Banners Only) */}
            {isBanner && event.bannerData && (
            <div className="flex items-center gap-1.5 mt-2">
                
                {/* Featured Characters */}
                {event.bannerData.featuredChars?.map((char, idx) => (
                <div key={`char-${idx}`} className="relative group/tooltip flex-shrink-0">
                    <img 
                    src={getCdnUrl(char.icon)} 
                    alt={char.name} 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-orange-400 bg-orange-200/20 object-cover shadow-sm cursor-help" 
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#121212] border border-[#33343a] text-white text-xs font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {char.name}
                    </div>
                </div>
                ))}
                
                {/* Featured Weapons */}
                {event.bannerData.featuredWeapons?.map((weapon, idx) => (
                <div key={`weapon-${idx}`} className="relative group/tooltip flex-shrink-0">
                    <img 
                    src={getCdnUrl(weapon.icon)} 
                    alt={weapon.name} 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-orange-400 bg-orange-200/20 object-cover shadow-sm cursor-help" 
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#121212] border border-[#33343a] text-white text-xs font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {weapon.name}
                    </div>
                </div>
                ))}

            </div>
            )}
        </div>

        {/* RIGHT: Timer */}
        <div className="absolute top-0 right-0 z-10">
            <CountdownTimer
                endDate={isCurrent ? event.end : event.start}
                ribbonColor={!isCurrent ? 'bg-blue-500' : undefined}
                expiredLabel={!isCurrent ? 'LIVE' : 'ENDED'}
            />
        </div>

        </div>
    );
});

export default function EventTimeline({ game, type = 'all' }) {
    const [rawEvents, setRawEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentEvents, setCurrentEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    // Fetch the database data when the game ID loads
    useEffect(() => {
        async function loadEvents() {
            setLoading(true);
            const data = await fetchEvents(game);
            setRawEvents(data);
            setLoading(false);
        }

        if (game) {
            loadEvents();
        } else {
            console.warn("EventTimeline is missing the 'game' prop!");
            setLoading(false);
        }
    }, [game]);

    useEffect(() => {
        if (!rawEvents || rawEvents.length === 0) return;
        const now = new Date();
        const current = [];
        const upcoming = [];

        rawEvents.forEach(event => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);
            if (now > startDate && now < endDate) {
                current.push(event);
            } else if (now < startDate) {
                upcoming.push(event);
            }
        });

        current.sort((a, b) => new Date(a.end) - new Date(b.end));
        upcoming.sort((a, b) => new Date(a.start) - new Date(b.start));

        setCurrentEvents(current);
        setUpcomingEvents(upcoming);
    }, [rawEvents]);

    // Loading state catch
    if (loading) return <div className="text-gray-400 p-4">Loading timeline...</div>;
    if ((!currentEvents.length && !upcomingEvents.length)) return null;

    // Filter based on type prop
    const eventsToShow = type === 'current' ? currentEvents : type === 'upcoming' ? upcomingEvents : currentEvents.concat(upcomingEvents);

    if (!eventsToShow.length) return null;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {eventsToShow.map(event => {
                const isCurrent = currentEvents.some(e => e.id === event.id);
                return <EventCard key={event.id} event={event} isCurrent={isCurrent} />;
            })}
        </div>
    );
}