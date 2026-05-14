import { supabase } from '../lib/supabase';
import { game_tags, event_labels } from '../data/labelsAndTags';

export async function fetchEvents(game) {
    const { data, error } = await supabase
        .from('game_events')
        .select('*')
        .eq('game', game)
        .eq('active', true)
        .order('end', { ascending: true }); 

    if (error) {
        console.error("Error fetching events:", error);
        return [];
    }
    
    // Map through the database rows and attach the tag objects from GAME_TAGS
    const gameTags = game_tags[game] || {};
    const gameLabels = event_labels[game] || {};
    const formattedData = data.map((event) => {
        // Parse tag_key to get the tag object(s)
        const eventTags = event.tag_key 
            ? event.tag_key.split(',').map(k => gameTags[k.trim().toUpperCase()]).filter(Boolean)
            : [gameTags.EVENTS || gameTags.WISHES]; // Fallback based on event type

        // Parse label_key to get the label object
        const key = (event.label_key || '').trim().toUpperCase();
        const eventLabel = gameLabels[key] || null; // Null for event wishes/events without a specific label

        return {
            ...event,
            tags: eventTags,
            label: eventLabel
        };
    });

    return formattedData;
}