// Get the server's timezone offset
const getServerOffset = (server) => {
    let offset = -5; // America
    if (server === 'Europe') offset = 1;
    if (server === 'Asia') offset = 8;
    return offset;
};

// Helper to get the current day/date in a specific server's timezone
const getServerDate = (dateObj, server) => {
    const offset = getServerOffset(server);
    const shifted = new Date(dateObj.getTime() + (offset * 60 * 60 * 1000));
    return {
        day: shifted.getUTCDay(),
        date: shifted.getUTCDate()
    };
};

// Calculate the next reset time for a recurring task
export const getNextReset = (rule, resetHourUTC, server) => {
    const now = new Date();
    let target = new Date();
    
    target.setUTCHours(resetHourUTC, 0, 0, 0);
    if (now >= target) target.setUTCDate(target.getUTCDate() + 1);

    switch (rule) {
        case 'daily':
            break;
        case 'weekly': 
            while (getServerDate(target, server).day !== 1) {
                target.setUTCDate(target.getUTCDate() + 1);
            }
            break;
        case 'monthly': 
            while (getServerDate(target, server).date !== 1) {
                target.setUTCDate(target.getUTCDate() + 1);
            }
            break;
        case 'monthly-16th': 
            while (getServerDate(target, server).date !== 16) {
                target.setUTCDate(target.getUTCDate() + 1);
            }
            break;
        default:
            break;
    }
    return target.toISOString();
};

// Calculate the next reset after a given completion date
export const getNextResetAfter = (baseDate, rule, resetHourUTC, server) => {
    const target = new Date(baseDate);
    target.setUTCHours(resetHourUTC, 0, 0, 0);
    if (target <= baseDate) target.setUTCDate(target.getUTCDate() + 1);

    switch (rule) {
        case 'daily':
            break;
        case 'weekly':
            while (getServerDate(target, server).day !== 1) {
                target.setUTCDate(target.getUTCDate() + 1);
            }
            break;
        case 'monthly':
            while (getServerDate(target, server).date !== 1) {
                target.setUTCDate(target.getUTCDate() + 1);
            }
            break;
        case 'monthly-16th':
            while (getServerDate(target, server).date !== 16) {
                target.setUTCDate(target.getUTCDate() + 1);
            }
            break;
        default:
            break;
    }

    return target;
};

// Apply timezone offset to a deadline
export const applyServerOffset = (deadline, server) => {
    let offset = "-05:00";
    if (server === 'Europe') offset = "+01:00";
    if (server === 'Asia') offset = "+08:00";
    
    const cleanDeadline = deadline.split('+')[0].replace('Z', '');
    return new Date(`${cleanDeadline}${offset}`).toISOString();
};
