export const EVENT_LABELS = {
    VERSION: { text: "New Version",  bgColor: "bg-teal-900/40", textColor: "text-teal-300" },
    WEB: { text: "Web Event", bgColor: "bg-emerald-900/40", textColor: "text-emerald-300" },
    STREAM: { text: "Livestream", bgColor: "bg-sky-900/40", textColor: "text-sky-300" },
    WORLD_EXPL: { text: "World Exploration", bgColor: "bg-blue-900/40", textColor: "text-blue-300" },
    LOGIN: { text: "Login Event", bgColor: "bg-blue-900/40", textColor: "text-blue-300" }, 
    TCG: { text: "TCG", bgColor: "bg-blue-900/40", textColor: "text-blue-300" }, // Genshin
};

// bgColor: "bg-emerald-900/40", textColor: "text-emerald-300"
// bgColor: "bg-sky-900/40", textColor: "text-sky-300"
// bgColor: "bg-purple-900/40", textColor: "text-purple-300"
// bgColor: "bg-amber-900/40", textColor: "text-amber-300"
// bgColor: "bg-teal-900/40", textColor: "text-teal-300"

    export const GLOBAL_EVENTS = {
    genshin: [
        {
            id: "ge_banner",
            name: "Event Wishes",
            type: "banner",
            start: "2026-03-17T04:00:00Z",
            end: "2026-04-07T17:59:59Z",
            image: "/genshin/ui-icon/genshin-wish.png", // The star icon on the left
            bannerData: {
                featuredChars: [
                { name: "Skirk", icon: "/genshin/charactericon/skirk-icon.png"},
                { name: "Escoffier", icon: "/genshin/charactericon/escoffier-icon.png" },
                ],
                featuredWeapons: [
                { name: "Azurelight", icon: "/genshin/weaponicon/azurelight-icon.png" },
                { name: "Symphonist of Scents", icon: "/genshin/weaponicon/symphonist-of-scents-icon.png" },
                ]
            }
        },
        {
            id: "ge_sightseeing",
            name: "Sightseeing With Friends",
            type: "event",
            start: "2026-03-16T10:00:00Z",
            end: "2026-03-26T03:59:00Z",
            image: "/genshin/eventimg/sightseeing_with_friends.webp",
        }
    ]
};