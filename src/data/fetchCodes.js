import { supabase } from '../lib/supabase';

export async function fetchCodes(game) {
    const { data, error } = await supabase
        .from('codes')
        .select('*')
        .eq('game', game)
        .eq('is_active', true) // Only active codes
        .order('is_new', { ascending: false }); // Sort new codes to the top 

    if (error) {
        console.error("Error fetching codes:", error);
        return [];
    }
    
    return data;
}