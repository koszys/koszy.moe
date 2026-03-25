export const PLANNER_TAGS = {
    RESIN: { id: "resin", text: "Resin Spend", bgColor: "bg-blue-900/40", textColor: "text-blue-300" },
    DAILY: { id: "daily", text: "Daily Routine", bgColor: "bg-emerald-900/40", textColor: "text-emerald-300" },
    WEEKLY: { id: "weekly", text: "Weekly Routine", bgColor: "bg-purple-900/40", textColor: "text-purple-300" },
    BP: { id: "bp", text: "Battle Pass", bgColor: "bg-teal-900/40", textColor: "text-teal-300" },
    EVENT_TASK: { id: "event_task", text: "Events", bgColor: "bg-amber-900/40", textColor: "text-amber-300" },
};

export const PLANNER_DATA = {
    genshin: [
        {
        id: "ge_p_commissions",
        type: "permanent",
        tag: PLANNER_TAGS.DAILY,
        title: "Daily Commissions (0/4)",
        icon: "", // Icon to the right of checkbox
        bgImage: null, // Optional background photo blend
        durationLabel: "Next Daily Reset", // Grey label for permanent tasks
        }
    ]
};