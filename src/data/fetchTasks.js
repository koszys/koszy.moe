import { supabase } from '../lib/supabase';
import { game_tags } from './labelsAndTags';

export async function fetchTasks(game) {
    const { data, error } = await supabase
        .from('game_tasks')
        .select('*')
        .eq('game', game)
        .eq('active', true);

    if (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
    
    // Map the database text strings back into your React objects
    const gameTags = game_tags[game] || {};
    return data.map(task => {
        // Split the string by comma, trim spaces, make uppercase, and find the matching objects
        const parsedTags = task.tag_key 
            ? task.tag_key.split(',').map(k => gameTags[k.trim().toUpperCase()]).filter(Boolean)
            : [gameTags.DAILY]; // Fallback to an array

        return {
            ...task,
            tags: parsedTags,
        };
    });
}