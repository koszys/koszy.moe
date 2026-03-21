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
        id: "ge_skirk_banner",
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
        }
    ]
};