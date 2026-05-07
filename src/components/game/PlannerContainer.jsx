import { useState, useEffect } from 'react';
import GamePlanner from './GamePlanner';
import { fetchEvents } from '../../data/fetchEvents';
import { fetchTasks } from '../../data/fetchTasks';
import { ASSET_BASE_URL } from '../../config/constants';
import { useSupabaseRealtime } from '../../hooks/useSupabaseRealtime';

// Helper to safely build CDN URLs
const getCdnUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${ASSET_BASE_URL}${path}`;
};

export default function PlannerContainer({ gameId, title, tags }) {
    const [combinedData, setCombinedData] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadPlannerData = async () => {
        setLoading(true);
        const now = new Date();

        // Fetch both tables using the dynamic gameId
        const [tasksData, eventsData] = await Promise.all([
            fetchTasks(gameId),
            fetchEvents(gameId)
        ]);

        // Format the standard tasks
        const formattedTasks = tasksData.map(task => {
            const parsedTags = task.tag_key 
                ? task.tag_key.split(',').map(k => tags[k.trim().toUpperCase()]).filter(Boolean)
                : [tags.DAILY];

            return {
                ...task,
                icon: getCdnUrl(task.icon_path),
                resetRule: task.reset_rule, 
                tags: parsedTags,
                
                // Grab styling from the first tag in the array
                label: task.label || parsedTags[0]?.text || "Task",
                labelBg: parsedTags[0]?.bgColor || null,
                labelColor: parsedTags[0]?.textColor || null,
                
                durationLabel: task.label || parsedTags[0]?.text || "Task"
            };
        });

        // Filter and format the events into tasks
        const activeEventsToTasks = eventsData
            .filter(event => {
                const start = new Date(event.start);
                const end = new Date(event.end);
                return now >= start && now <= end;
            })
            .map(event => {
                const parsedTags = event.tag_key 
                    ? event.tag_key.split(',').map(k => tags[k.trim().toUpperCase()]).filter(Boolean)
                    : [event.type === 'banner' ? tags.WISHES : tags.EVENTS];

                return {
                    id: event.id,
                    type: "event",
                    tags: parsedTags,
                    title: event.name,
                    icon: getCdnUrl(event.image_path), 
                    bgImage: event.type !== 'banner' ? getCdnUrl(event.image_path) : null, 
                    
                    label: parsedTags[0]?.text || "Event",            
                    labelBg: parsedTags[0]?.bgColor || null, 
                    labelColor: parsedTags[0]?.textColor || null,
                    
                    deadline: event.end,
                    
                    // Reattach CDN URLs to characters and weapons if it's a banner
                    bannerData: event.bannerData ? {
                        ...event.bannerData,
                        featuredChars: event.bannerData.featuredChars?.map(char => ({
                            ...char, 
                            icon: getCdnUrl(char.icon) 
                        })),
                        featuredWeapons: event.bannerData.featuredWeapons?.map(weapon => ({
                            ...weapon, 
                            icon: getCdnUrl(weapon.icon) 
                        }))
                    } : null 
                };
            });

        setCombinedData([...formattedTasks, ...activeEventsToTasks]);
        setLoading(false);
    };

    // Fetch the initial data when the page loads or when gameId changes
    useEffect(() => {
        if (gameId) loadPlannerData();
    }, [gameId, tags]);

    // Listen to BOTH tables and re-run loadPlannerData on any change
    useSupabaseRealtime(['game_events', 'game_tasks'], loadPlannerData, !!gameId);

    if (loading) return <div className="p-8 text-center text-gray-400 font-mono">Loading planner...</div>;

    return (
        <GamePlanner 
            gameId={gameId} 
            title={title} 
            rawData={combinedData} 
            tags={tags} 
        />
    );
}