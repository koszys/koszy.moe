// Standardized Components
import ChangelogSection from '../../components/changelog/ChangelogSection';
import ToggleSection from '../../components/game/ToggleSection';
import GameIntro from '../../components/game/GameIntro';
import ActiveCodes from '../../components/game/ActiveCodes';
import EventTimeline from '../../components/game/timeline/EventTimeline';

export default function GenshinHome() {
    const gameId = 'genshin';
    
    // Custom URL (can be moved to games.js later)
    const redeemUrl = 'https://genshin.hoyoverse.com/en/gift'; 
    
    return (
        <div className="w-full max-w-[1200px] mx-auto pb-20">
        
        {/* Intro Header */}
        <GameIntro 
            text="A planner to keep up to date with new banners, events, and updates in Genshin Impact. "
        />
        
        {/* Active Codes */}
        <ToggleSection title="Active Codes (Redeem Code Links)" defaultOpen={true}>
            <ActiveCodes 
                game={gameId}  
                redeemUrl={redeemUrl}
            />
        </ToggleSection>
        
        {/* Current Events */}
        <ToggleSection title="Current Events" defaultOpen={true}>
            <EventTimeline 
                game={gameId}
                type="current"
            />
        </ToggleSection>
        
        {/* Upcoming Events */}
        <ToggleSection title="Upcoming Events" defaultOpen={true}>
            <EventTimeline 
                game={gameId}
                type="upcoming"
            />
        </ToggleSection>
        
        {/* Changelog Section */}
        <section className="mt-12">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-blue-500 pl-3 mb-6">
                Changelog
            </h2>
            <ChangelogSection game={gameId} />
        </section>

        </div>
    );
}