import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ endDate }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const targetDate = new Date(endDate);
        
        // Initial calculation
        setTimeLeft(Math.max(0, targetDate - new Date()));

        const timerInterval = setInterval(() => {
        const now = new Date();
        const difference = targetDate - now;
        
        if (difference <= 0) {
            clearInterval(timerInterval);
            setTimeLeft(0);
        } else {
            setTimeLeft(difference);
        }
        }, 1000); // Update every second

        return () => clearInterval(timerInterval); // Cleanup on unmount
    }, [endDate]);

    if (timeLeft <= 0) {
        return <span className="text-red-500 font-bold uppercase tracking-widest text-xs">Ended</span>;
    }

    // Formatting milliseconds to d h m s
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    const formattedDays = days > 0 ? `${days}d ` : '';
    const formattedHours = hours > 0 ? `${hours.toString().padStart(2, '0')}h ` : '';
    const formattedMinutes = minutes.toString().padStart(2, '0') + 'm ';
    const formattedSeconds = seconds.toString().padStart(2, '0') + 's';

    return (
        <span className="text-white font-black tracking-tight drop-shadow-md">
        {formattedDays}{formattedHours}{formattedMinutes}{formattedSeconds}
        </span>
    );
}