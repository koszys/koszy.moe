import { PLANNER_TAGS } from "../genshinplanner";
import { EVENT_LABELS } from "./eventlabels";

const labels = EVENT_LABELS.genshin;

export const genshinEvents = [
    {
        id: "ge_banner",
        name: "Event Wishes",
        type: "banner",
        start: "2026-04-10T04:00:00",
        end: "2026-06-20T15:00:00",
        image: "/genshin/ui-icon/genshin-wish.png",
        tag: PLANNER_TAGS.WISHES,
        bannerData: {
            featuredChars: [
                { name: "Skirk", icon: "/genshin/charactericon/skirk-icon.png" },
                { name: "Escoffier", icon: "/genshin/charactericon/escoffier-icon.png" }
            ],
            featuredWeapons: [
                { name: "Azurelight", icon: "/genshin/weaponicon/azurelight-icon.png" },
                { name: "Symphonist of Scents", icon: "/genshin/weaponicon/symphonist-of-scents-icon.png" }
            ]
        }
    },
    {
        id: "ge_sightseeing",
        name: "Sightseeing With Friends",
        type: "event",
        start: "2026-03-16T10:00:00",
        end: "2026-03-26T08:59:00",
        tag: PLANNER_TAGS.EVENTS,
        image: "/genshin/eventimg/sightseeing_with_friends.webp"
    },
    {
        id: "ge_tcg",
        name: "Heated Battle Mode",
        type: "event",
        start: "2026-04-10T04:00:00",
        end: "2026-06-25T09:00:00",
        label: labels.TCG,
        tag: PLANNER_TAGS.TCG,
        image: "/genshin/eventimg/tcg.webp"
    }
];
    