import PlannerContainer from '../../components/game/PlannerContainer';
import { PLANNER_TAGS } from '../../data/genshinplanner';

export default function GenshinPlanner() {
    return (
        <PlannerContainer 
            gameId="genshin" 
            title="Genshin Impact Planner" 
            tags={PLANNER_TAGS} 
        />
    );
}