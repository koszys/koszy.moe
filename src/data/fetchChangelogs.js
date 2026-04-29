import { supabase } from '../lib/supabase';

export async function fetchChangelogs(game) {
    const { data, error } =  await supabase
        .from('changelogs')
        .select('*')
        .eq('game', game)
        .order('date', { ascending: false }); // Sort by date, newest first

    if (error) {
        console.error("Error fetching changelogs:", error);
        return [];
    }

    return data;
}