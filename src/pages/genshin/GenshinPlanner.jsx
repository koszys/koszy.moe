import GamePlanner from '../../components/game/GamePlanner';
import { PLANNER_DATA, PLANNER_TAGS } from '../../data/genshinplanner';
import { GLOBAL_EVENTS } from '../../data/gameevents'; 

export default function GenshinPlanner() {
    const now = new Date();

    // Automatically pull current events from the gameevents module
    const activeEventsToTasks = (GLOBAL_EVENTS.genshin || [])
        .filter(event => {
        // Only get currently active events
        const start = new Date(event.start);
        const end = new Date(event.end);
        return now >= start && now <= end;
        })
        .map(event => ({
            id: event.id, // Reuses the exact ID so checkmarks stay synced!
            type: "event",
            tag: event.tag || PLANNER_TAGS.EVENTS,            
            title: event.name,
            icon: event.image, // Uses the event image as the square icon
            // If its not a banner, use the image as a background
            bgImage: event.type !== 'banner' ? event.image : null, 

            // If the event has a specific label, use it. Otherwise, default it to something
            label: event.label ? event.label.text : (event.tag ? event.tag.text : "Event"),            
            labelBg: event.label ? event.label.bgColor : null, 
            labelColor: event.label ? event.label.textColor : null,

            deadline: event.end,
            bannerData: event.bannerData || null // Pass the banner data through for wishes, so the planner can render featured characters/weapons if needed
        }));

    // Combine manual planner tasks with the automatic events
    const combinedData = [...PLANNER_DATA.genshin, ...activeEventsToTasks];

    return (
        <GamePlanner 
        gameId="genshin" 
        title="Genshin Impact Planner" 
        rawData={combinedData} // Feed the combined list into the planner
        tags={PLANNER_TAGS} 
        />
    );
}