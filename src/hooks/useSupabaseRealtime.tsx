import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface UseSupabaseRealtimeProps {
    tables: string | string[];
    callback: (payload: unknown) => void;
    enabled?: boolean;
}

export function useSupabaseRealtime({ tables, callback, enabled = true }: UseSupabaseRealtimeProps) {
    // We store the callback in a ref. This guarantees the listener always 
    // fires the freshest version of your function without causing infinite re-renders.
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        // If the game ID is missing, don't set up the listener
        if (!enabled) return;

        // Force 'tables' to be an array so we can loop through it
        const tableArray = Array.isArray(tables) ? tables : [tables];
        
        // Generate our unique channel name with Date.now() to prevent Strict Mode crashes
        const channelName = `realtime-${tableArray.join('-')}-${Date.now()}`;

        let channel = supabase.channel(channelName);

        // Dynamically attach a listener for every table requested
        tableArray.forEach(table => {
            channel = channel.on(
                'postgres_changes',
                { event: '*', schema: 'public', table: table },
                (payload) => {
                    console.log(`Live update detected on ${table}!`);
                    callbackRef.current(payload);
                }
            );
        });

        // Finally, subscribe to the channel
        channel.subscribe();

        // Automatically clean up when the component unmounts
        return () => {
            supabase.removeChannel(channel);
        };
    }, [tables, enabled]); // Notice we don't put the callback here!
}