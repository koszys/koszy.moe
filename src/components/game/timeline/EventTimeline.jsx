import React, { useState, useEffect } from 'react';
import SectionHeader from '../SectionHeader';
import CountdownTimer from './CountdownTimer';

const EventCard = ({ event, isCurrent }) => {
    const hasImage = !!event.image;
    const isBanner = event.type === 'banner';

    return (
        <div className="relative flex items-center bg-[#1c1d21]/80 border border-[#33343a] rounded-xl p-3 h-24 shadow-sm hover:border-[#4b4c53] transition-colors group">
        
        {/* LEFT: Event/Banner Icon */}
        <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 flex items-center justify-center mr-4 rounded-md overflow-hidden">
            {hasImage && (
            <img 
                src={event.image} 
                alt="Event Icon" 
                className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
            />
            )}
        </div>

        {/* MIDDLE: Content */}
        <div className="flex flex-col flex-1 justify-center min-w-0 pr-16">
            
            {/* Title and Optional Tag (like "TCG") */}
            <div className="flex items-center gap-2 mb-1.5">
            {event.label && !isBanner && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${event.label.bgColor} ${event.label.textColor}`}>
                {event.label.text}
                </span>
            )}
            <h3 className="text-white font-bold text-sm md:text-base leading-tight truncate">
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
                    src={char.icon} 
                    alt={char.name} 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-orange-400 bg-orange-200/20 object-cover shadow-sm cursor-help" 
                    />
                    {/* Custom Styled Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#121212] border border-[#33343a] text-white text-xs font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {char.name}
                    </div>
                </div>
                ))}
                
                {/* Featured Weapons */}
                {event.bannerData.featuredWeapons?.map((weapon, idx) => (
                <div key={`weapon-${idx}`} className="relative group/tooltip flex-shrink-0">
                    <img 
                    src={weapon.icon} 
                    alt={weapon.name} 
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-orange-400 bg-orange-200/20 object-cover shadow-sm cursor-help" 
                    />
                    {/* Custom Styled Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#121212] border border-[#33343a] text-white text-xs font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                    {weapon.name}
                    </div>
                </div>
                ))}

            </div>
            )}
        </div>

        {/* RIGHT: Absolute positioned Timer Pill */}
        <div className="absolute top-3 right-3">
            <CountdownTimer endDate={isCurrent ? event.end : event.start} />
        </div>

        </div>
    );
    };

    export default function EventTimeline({ rawEvents }) {
    const [currentEvents, setCurrentEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

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

    if ((!currentEvents.length && !upcomingEvents.length)) return null;

    return (
        <section>
        <SectionHeader title="Current Events" />
        {/* Standard 2-Column Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-8">
            {currentEvents.map(event => <EventCard key={event.id} event={event} isCurrent={true} />)}
        </div>

        {upcomingEvents.length > 0 && (
            <>
            <SectionHeader title="Upcoming Events" />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 opacity-70 hover:opacity-100 transition-opacity mt-8">
                {upcomingEvents.map(event => <EventCard key={event.id} event={event} isCurrent={false} />)}
            </div>
            </>
        )}
        </section>
    );
}