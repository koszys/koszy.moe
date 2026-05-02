import { supabase } from '../lib/supabase';
import { PLANNER_TAGS } from './genshinplanner';

export async function fetchTasks(game) {
    const { data, error } = await supabase
        .from('game_tasks')
        .select('*')
        .eq('game', game);

    if (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
    
    // Map the database text strings back into your React objects
    return data.map(task => {
        // Split the string by comma, trim spaces, make uppercase, and find the matching objects
        const parsedTags = task.tag_key 
            ? task.tag_key.split(',').map(k => PLANNER_TAGS[k.trim().toUpperCase()]).filter(Boolean)
            : [PLANNER_TAGS.DAILY]; // Fallback to an array

        return {
            ...task,
            tags: parsedTags, // Changed from 'tag' to 'tags'
        };
    });
}