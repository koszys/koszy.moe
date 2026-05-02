import { useState, useEffect } from 'react';
import GamePlanner from './GamePlanner';
import { fetchEvents } from '../../data/fetchEvents';
import { fetchTasks } from '../../data/fetchTasks';
import { ASSET_BASE_URL } from '../../config/constants';

// Helper to build CDN URLs
const getCdnUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${ASSET_BASE_URL}${path}`;
};

export default function PlannerContainer({ gameId, title, tags }) {
    const [combinedData, setCombinedData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPlannerData() {
            setLoading(true);
            const now = new Date();

            // Fetch both tables using the dynamic gameId
            const [tasksData, eventsData] = await Promise.all([
                fetchTasks(gameId),
                fetchEvents(gameId)
            ]);

            // Format the standard tasks
            const formattedTasks = tasksData.map(task => {
                return {
                    ...task,
                    icon: getCdnUrl(task.icon_path),
                    resetRule: task.reset_rule, 
                    label: task.label || task.tags?.[0]?.text || "Task",
                    labelBg: task.tags?.[0]?.bgColor || null,
                    labelColor: task.tags?.[0]?.textColor || null
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
                    return {
                        id: event.id,
                        type: "event",
                        tags: event.tags, 
                        title: event.name,
                        icon: getCdnUrl(event.image_path), 
                        bgImage: event.type !== 'banner' ? getCdnUrl(event.image_path) : null, 
                        
                        label: event.tags?.[0]?.text || "Event",            
                        labelBg: event.tags?.[0]?.bgColor || null, 
                        labelColor: event.tags?.[0]?.textColor || null,
                        
                        deadline: event.end,
                        
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
        }

        if (gameId) loadPlannerData();
    }, [gameId, tags]);

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