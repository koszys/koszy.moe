import { useState, useEffect } from 'react';
import TimerRibbon from './TimerRibbon'; 

export default function CountdownTimer({ endDate, ribbonColor }) {
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
        return <TimerRibbon bgColor="bg-gray-600" textColor="text-white">ENDED</TimerRibbon>;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60);

    // Days and hours and Minutes if < 1 day
    let displayTime = '';
    if (days > 0) {
        displayTime = `${days}d ${hours}h`;
    } else if (hours > 0) {
        displayTime = `${hours}h ${minutes}m`;
    } else {
        displayTime = `${minutes}m`;
    }

    //  Remaining time color 
    let bgColorClass = "bg-emerald-600"; // Default Green
    if (days < 2) {
        bgColorClass = "bg-red-600";     // Red
    } else if (days < 4) {
        bgColorClass = "bg-yellow-600";  // Yellow
    }

    return (
        <TimerRibbon bgColor={ribbonColor || bgColorClass} textColor="text-white">
            {displayTime}
        </TimerRibbon>
    );
}