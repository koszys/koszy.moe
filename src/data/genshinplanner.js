export const PLANNER_TAGS = {
    PERMANENT: { id: "permanent", text: "Permanent", bgColor: "bg-orange-900/40", textColor: "text-orange-400" },
    EVENTS: { id: "events", text: "Events", bgColor: "bg-amber-900/40", textColor: "text-amber-300" },
    WISHES: { id: "wishes", text: "Event Wishes", bgColor: "bg-pink-900/40", textColor: "text-pink-300" },
    CHECK_IN: { id: "checkin", text: "Check In", bgColor: "bg-sky-900/40", textColor: "text-sky-300" },
    TCG: { id: "tcg", text: "TCG", bgColor: "bg-teal-900/40", textColor: "text-teal-300" },
    QUEST: { id: "quest", text: "Quests", bgColor: "bg-blue-900/40", textColor: "text-blue-300" },
    WORLD_EXPL: { id: "world_exploration", text: "World Exploration", bgColor: "bg-green-900/40", textColor: "text-green-300" },
    DAILY: { id: "daily", text: "Daily", bgColor: "bg-purple-900/40", textColor: "text-purple-300" }
};
    

    // bgColor: "bg-emerald-900/40", textColor: "text-emerald-300"
    // bgColor: "bg-sky-900/40", textColor: "text-sky-300"
    // bgColor: "bg-purple-900/40", textColor: "text-purple-300"
    // bgColor: "bg-amber-900/40", textColor: "text-amber-300"
    // bgColor: "bg-teal-900/40", textColor: "text-teal-300"

export const PLANNER_DATA = {
    genshin: [
        {
            id: "daily_commissions",
            type: "task",
            tag: PLANNER_TAGS.DAILY,
            label: "Daily",
            title: "Daily Commissions",
            icon: "/genshin/ui-icon/dailycomm-icon.png",
            resetRule: "daily",
            
        },
        {
            id: "abyss",
            type: "permanent",
            tag: PLANNER_TAGS.PERMANENT,
            label: "Permanent",
            title: "Spiral Abyss",
            icon: "/genshin/ui-icon/abyss-icon.png",
            resetRule: "monthly-16th",  
        }
    ]
};