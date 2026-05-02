import { supabase } from '../lib/supabase';
import { GAME_TAGS } from '../data/tags'; 

export async function fetchEvents(game) {
    const { data, error } = await supabase
        .from('game_events')
        .select('*')
        .eq('game', game)
        .order('end', { ascending: true }); 

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }
    
    // Map through the database rows and attach the tag objects from GAME_TAGS
    const gameTags = GAME_TAGS[game] || {};
    const formattedData = data.map((event) => {
        
        // Parse tag_key to get the tag object(s)
        const eventTags = event.tag_key 
            ? event.tag_key.split(',').map(k => gameTags[k.trim().toUpperCase()]).filter(Boolean)
            : [gameTags.EVENTS || gameTags.WISHES]; // Fallback based on event type

        return {
            ...event,
            tags: eventTags
        };
    });

    return formattedData;
}