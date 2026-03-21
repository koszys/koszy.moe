// src/data/events.js

// Standardized labels as shown in your images
export const EVENT_LABELS = {
    VERSION: { text: "New Version", bgColor: "bg-red-900/40", textColor: "text-red-300" },
    WISH_1: { text: "Wish Event (P1)", bgColor: "bg-blue-900/40", textColor: "text-blue-300" },
    WISH_2: { text: "Wish Event (P2)", bgColor: "bg-purple-900/40", textColor: "text-purple-300" },
    LIMIT: { text: "Time Limit", bgColor: "bg-amber-900/40", textColor: "text-amber-300" },
    WEB: { text: "Web Event", bgColor: "bg-emerald-900/40", textColor: "text-emerald-300" },
    BONUS: { text: "Bonus Drop", bgColor: "bg-teal-900/40", textColor: "text-teal-300" },
    STREAM: { text: "Livestream", bgColor: "bg-sky-900/40", textColor: "text-sky-300" },
    };

    export const GLOBAL_EVENTS = {
    genshin: [
        {
        id: "ge_3_6_2",
        name: "Version 1.1 Phase 2: 'A New Star Approaches'",
        label: EVENT_LABELS.VERSION,
        // Date Format: YYYY-MM-DDTHH:mm:ssZ (must be UTC)
        start: "2026-03-01T00:00:00Z", // Past event
        end: "2026-04-15T12:00:00Z",   // Still active
        image: "/genshin1-1.jpg" // Optional background image
        },
        {
        id: "ge_w_childe",
        name: "Childe Gacha Banner",
        label: EVENT_LABELS.WISH_1,
        start: "2026-03-22T04:00:00Z",
        end: "2026-04-12T17:59:59Z", // active
        image: "https://paimon.moe/images/banners/1.jpg"
        },
        {
        id: "ge_teatro",
        name: "Theater Mechanicus: Stage of Wonders",
        label: EVENT_LABELS.LIMIT,
        start: "2026-03-10T10:00:00Z",
        end: "2026-03-25T11:00:00Z", // active
        image: "https://paimon.moe/images/events/ge_teatro.jpg"
        },
        {
        id: "ge_stream_1_2",
        name: "Version 1.2 Special Livestream!",
        label: EVENT_LABELS.STREAM,
        start: "2026-03-24T16:00:00Z", // Upcoming
        end: "2026-03-24T17:00:00Z",
        image: null // No image
        },
        {
        id: "ge_web_food",
        name: "Delicious Food Web Event",
        label: EVENT_LABELS.WEB,
        start: "2026-04-01T04:00:00Z", // Upcoming
        end: "2026-04-10T23:59:59Z",
        image: null
        },
    ]
};