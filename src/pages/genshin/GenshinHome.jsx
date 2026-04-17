// Data Imports
import { CHANGELOG_DATA } from '../../data/changelogs/genshinchangelog';
import { ACTIVE_CODES } from '../../data/codes';
import { GLOBAL_EVENTS } from '../../data/gameevents';

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
    
    // Data Extraction (simple filtering based on the consistent game ID)
    const codes = ACTIVE_CODES[gameId];
    const events = GLOBAL_EVENTS[gameId];
    
    return (
        <div className="w-full max-w-[1200px] mx-auto pb-20">
        
        {/* SECTION 1: Standard Intro Header */}
        <GameIntro 
            text="A planner to keep up to date with new banners, events, and updates in Genshin Impact. "
        />
        
        {/* SECTION 2: Active Codes */}
        <SectionHeader title="Active Codes (Redeem Code Links)" />
        <ActiveCodes 
            codes={codes} 
            redeemUrl={redeemUrl}
        />
        
        {/* SECTION 3: Current & Upcoming Events */}
        <EventTimeline 
            rawEvents={events} 
            gameTitle={gameTitle}
            terms={{
            character: "Character",
            weapon: "Weapon",
            fourStar: "Characters",
            activeTitle: "Current Event Wishes",
            upcomingTitle: "Upcoming Event Wishes"
            }}
        />
        
        {/* SECTION 4: Changelog Section */}
        <SectionHeader title="Changelog" />
        <ChangelogSection changelogData={CHANGELOG_DATA} />

        </div>
    );
}