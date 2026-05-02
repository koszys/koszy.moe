import { supabase } from '../lib/supabase';
import { GAME_TAGS } from './tags';

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
    const gameTags = GAME_TAGS[game] || {};
    return data.map(task => {
        // Split the string by comma, trim spaces, make uppercase, and find the matching objects
        const parsedTags = task.tag_key 
            ? task.tag_key.split(',').map(k => gameTags[k.trim().toUpperCase()]).filter(Boolean)
            : [gameTags.DAILY]; // Fallback to an array

        return {
            ...task,
            tags: parsedTags, // Changed from 'tag' to 'tags'
        };
    });
}