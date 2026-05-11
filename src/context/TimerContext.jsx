import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
const TimerContext = createContext();

export function TimerProvider({ children }) {
    const [, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const getTimeLeft = useCallback((endDate) => {
        return Math.max(0, new Date(endDate) - new Date());
    }, []);

    return (
        <TimerContext.Provider value={{ getTimeLeft }}>
            {children}
        </TimerContext.Provider>
    );
}

export const useTimer = () => useContext(TimerContext);