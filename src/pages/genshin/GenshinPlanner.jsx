import PlannerContainer from '../../components/game/PlannerContainer';
import { game_tags } from '../../data/labelsAndTags';

export default function GenshinPlanner() {
    return (
        <PlannerContainer 
            gameId="genshin" 
            title="Genshin Impact Planner" 
            tags={GAME_TAGS.genshin} 
        />
    );
}