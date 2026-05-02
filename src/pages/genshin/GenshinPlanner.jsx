import { useState, useEffect } from 'react';
import GamePlanner from '../../components/game/GamePlanner';
import { PLANNER_TAGS } from '../../data/genshinplanner';
import { fetchEvents } from '../../data/fetchEvents';
import { fetchTasks } from '../../data/fetchTasks';
import { ASSET_BASE_URL } from '../../config/constants';

// Helper to safely build CDN URLs
const getCdnUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${ASSET_BASE_URL}${path}`;
};

export default function GenshinPlanner() {
    const [combinedData, setCombinedData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPlannerData() {
            setLoading(true);
            const now = new Date();
            const gameId = 'genshin';

            // Fetch both tables simultaneously for maximum speed
            const [tasksData, eventsData] = await Promise.all([
                fetchTasks(gameId),
                fetchEvents(gameId)
            ]);

            // 1. Format the standard tasks (attach the CDN link)
            const formattedTasks = tasksData.map(task => ({
                ...task,
                icon: getCdnUrl(task.icon_path),
                resetRule: task.reset_rule // Map snake_case database to camelCase React prop
            }));

            // 2. Filter and format the events into tasks
            const activeEventsToTasks = eventsData
                .filter(event => {
                    const start = new Date(event.start);
                    const end = new Date(event.end);
                    return now >= start && now <= end;
                })
                .map(event => ({
                    id: event.id,
                    type: "event",
                    tag: (event.tag_key ? PLANNER_TAGS[event.tag_key.toUpperCase()] : null) 
                        || (event.type === 'banner' ? PLANNER_TAGS.WISHES : PLANNER_TAGS.EVENTS),            
                    title: event.name,
                    icon: getCdnUrl(event.image_path), 
                    bgImage: event.type !== 'banner' ? getCdnUrl(event.image_path) : null, 
                    label: event.label ? event.label.text : (event.tag ? event.tag.text : "Event"),            
                    labelBg: event.label ? event.label.bgColor : null, 
                    labelColor: event.label ? event.label.textColor : null,
                    deadline: event.end,
                    // If it's a banner, the icons inside bannerData already get mapped in GamePlanner/EventTimeline!
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
                }));

            // Combine both lists and update the UI
            setCombinedData([...formattedTasks, ...activeEventsToTasks]);
            setLoading(false);
        }

        loadPlannerData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-400 font-mono">Loading planner...</div>;

    return (
        <GamePlanner 
            gameId="genshin" 
            title="Genshin Impact Planner" 
            rawData={combinedData} 
            tags={PLANNER_TAGS} 
        />
    );
}