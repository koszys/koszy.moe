import { genshinEvents } from "./genshinevents";
import { hsrEvents } from "./hsrevents";
import { zzzEvents } from "./zzzevents";
import { wuwaEvents } from "./wuwaevents";
import { EVENT_LABELS } from "./eventlabels";

export const GLOBAL_EVENTS = {
    genshin: genshinEvents,
    hsr: hsrEvents,
    zzz: zzzEvents,
    wuwa: wuwaEvents
};

export {
    EVENT_LABELS,
    genshinEvents,
    hsrEvents,
    zzzEvents,
    wuwaEvents
};
