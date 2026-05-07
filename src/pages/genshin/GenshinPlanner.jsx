import PlannerContainer from '../../components/game/PlannerContainer';
import { GAME_TAGS } from '../../data/tags';

export default function GenshinPlanner() {
    return (
        <PlannerContainer 
            gameId="genshin" 
            title="Genshin Impact Planner" 
            tags={GAME_TAGS.genshin} 
        />
    );
}