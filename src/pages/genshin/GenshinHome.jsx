// Standardized Components
import ChangelogSection from '../../components/ChangelogSection';
import SectionHeader from '../../components/game/SectionHeader';
import GameIntro from '../../components/game/GameIntro';
import ActiveCodes from '../../components/game/ActiveCodes';
import EventTimeline from '../../components/game/timeline/EventTimeline';

export default function GenshinHome() {
    const gameId = 'genshin';
    const gameTitle = 'Genshin Impact';
    
    // Custom URL (can be moved to games.js later)
    const redeemUrl = 'https://genshin.hoyoverse.com/en/gift'; 
    
    return (
        <div className="w-full max-w-[1200px] mx-auto pb-20">
        
        {/* Intro Header */}
        <GameIntro 
            text="A planner to keep up to date with new banners, events, and updates in Genshin Impact. "
        />
        
        {/* Active Codes */}
        <SectionHeader title="Active Codes (Redeem Code Links)" />
        <ActiveCodes 
            game={gameId}  
            redeemUrl={redeemUrl}
        />
        
        {/* Current & Upcoming Events */}
        <EventTimeline 
            game={gameId}
            gameTitle={gameTitle}
            terms={{
            character: "Character",
            weapon: "Weapon",
            fourStar: "Characters",
            activeTitle: "Current Event Wishes",
            upcomingTitle: "Upcoming Event Wishes"
            }}
        />
        
        {/* Changelog Section */}
        <SectionHeader title="Changelog" />
        <ChangelogSection game={gameId} />

        </div>
    );
}