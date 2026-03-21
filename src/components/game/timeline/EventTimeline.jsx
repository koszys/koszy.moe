import React, { useState, useEffect } from 'react';
import SectionHeader from '../SectionHeader';
import CountdownTimer from './CountdownTimer';

export default function EventTimeline({ rawEvents, gameTitle }) {
    const [currentEvents, setCurrentEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    // Sorting and Filtering brain
    useEffect(() => {
        if (!rawEvents || rawEvents.length === 0) return;

        const now = new Date();

        // 1. Separate Current vs Upcoming
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
        // Past events are naturally filtered out here
        });

        // 2. Sorting Logic (As requested)
        
        // CURRENT: Lowest time remaining at top
        current.sort((a, b) => new Date(a.end) - new Date(b.end));
        
        // UPCOMING: Which starts the earliest
        upcoming.sort((a, b) => new Date(a.start) - new Date(b.start));

        setCurrentEvents(current);
        setUpcomingEvents(upcoming);
    }, [rawEvents]);

    // Utility Component for Rendering an Event Card (handles optional image and label)
    const EventCard = ({ event, timeString, isCurrent }) => {
        const hasImage = event.image;
        
        return (
        <div className={`relative group block rounded-md overflow-hidden border border-[#33343a] hover:border-blue-500 transition-all shadow-md
            ${hasImage ? 'h-28' : 'h-16 flex items-center bg-[#1c1d21]' }`}>
            
            {/* Optional Image Background */}
            {hasImage && (
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${event.image}')` }}
            ></div>
            )}
            
            {/* Common Overlay & Content */}
            <div className={`absolute inset-0 z-10 
            ${hasImage ? 'bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent' : 'bg-transparent' }`}>
            </div>
            
            {/* Event Labels/Content Layer */}
            <div className="absolute top-0 left-0 w-full p-3 z-20 flex flex-col h-full justify-between">
            <div className="flex items-start justify-between gap-2">
                <h3 className={`font-bold text-white group-hover:text-blue-400 transition-colors 
                ${hasImage ? 'drop-shadow-lg truncate' : 'drop-shadow-none'}`}>
                {event.name}
                </h3>
                
                {/* Standard Type Label */}
                {event.label && (
                <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-sm flex-shrink-0 
                    ${event.label.bgColor} ${event.label.textColor}`}>
                    {event.label.text}
                </span>
                )}
            </div>
            
            {/* Bottom Row (Time remaining) */}
            <div className={`${hasImage ? '' : 'text-left'}`}>
                {isCurrent ? (
                <CountdownTimer endDate={event.end} />
                ) : (
                <span className="text-gray-400 text-sm font-black">
                    Starts in: <CountdownTimer endDate={event.start} />
                </span>
                )}
            </div>
            </div>
        </div>
        );
    };

    if ((!currentEvents.length && !upcomingEvents.length)) return null;

    return (
        <section>
            {/* Current Events */}
            <SectionHeader title="Current Events" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentEvents.map(event => (
                <EventCard key={event.id} event={event} isCurrent={true} />
                ))}
                {!currentEvents.length && (
                <div className="text-gray-500 italic p-6 text-center border-2 border-dashed border-[#33343a] rounded-lg bg-[#1c1d21]/20 col-span-2">
                    No active events.
                </div>
                )}
            </div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
                <>
                <SectionHeader title="Upcoming Events" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70 hover:opacity-100 transition-opacity mt-8">
                    {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} isCurrent={false} />
                    ))}
                </div>
                </>
            )}
        </section>
    );
}