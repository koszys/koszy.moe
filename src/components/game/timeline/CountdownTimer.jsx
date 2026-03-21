import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ endDate }) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const targetDate = new Date(endDate);
        setTimeLeft(Math.max(0, targetDate - new Date()));

        const timerInterval = setInterval(() => {
        const difference = targetDate - new Date();
        if (difference <= 0) {
            clearInterval(timerInterval);
            setTimeLeft(0);
        } else {
            setTimeLeft(difference);
        }
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [endDate]);

    if (timeLeft <= 0) {
        return <div className="bg-gray-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">Ended</div>;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);

    // Days and Hours (or Hours and Minutes if < 1 day)
    let displayTime = '';
    if (days > 0) {
        displayTime = `${days}d ${hours}h`;
    } else if (hours > 0) {
        displayTime = `${hours}h ${minutes}m`;
    } else {
        displayTime = `${minutes}m`;
    }

    return (
        <div className="bg-[#2f855a] text-white text-[11px] md:text-xs font-bold px-2 py-0.5 rounded shadow-sm tracking-wide">
        {displayTime}
        </div>
    );
}