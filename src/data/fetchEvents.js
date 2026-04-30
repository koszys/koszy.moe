import { supabase } from '../lib/supabase';
import { EVENT_LABELS } from '../data/gameevents/eventlabels'; 

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
    
    // Map through the database rows and attach the local styling objects
    const formattedData = data.map((event) => {
        
        // If the database has a label_key (e.g., "TCG"), grab the matching colors for this game
        let labelObject = null;
        if (event.label_key && EVENT_LABELS[game]) {
            labelObject = EVENT_LABELS[game][event.label_key];
        }

        return {
            ...event,
            label: labelObject 
        };
    });

    return formattedData;
}