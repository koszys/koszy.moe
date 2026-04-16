import React, { useState, useRef, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import CountdownTimer from "./timeline/CountdownTimer";
import TimerRibbon from "./timeline/TimerRibbon";
import { usePlanner } from "../../context/PlannerContext";
import { useSettings } from "../../context/SettingsContext";

// Time calculations for recurring tasks based on the Reset Hour and server timezone
const getNextReset = (rule, resetHourUTC, server) => {
    const now = new Date();
    let target = new Date();
    
    // Set the target to the correct UTC hour first
    target.setUTCHours(resetHourUTC, 0, 0, 0);
    if (now >= target) target.setUTCDate(target.getUTCDate() + 1);

    // Helper to get what day it CURRENTLY is in the target server's timezone
    const getServerDate = (dateObj) => {
        let offset = -5; // America
        if (server === 'Europe') offset = 1;
        if (server === 'Asia') offset = 8;
        
        // Create a temporary date shifted by the timezone to accurately check the day/date
        const shifted = new Date(dateObj.getTime() + (offset * 60 * 60 * 1000));
        return {
            day: shifted.getUTCDay(),
            date: shifted.getUTCDate()
        };
    };

    switch (rule) {
        case 'daily':
            break;
        case 'weekly': 
            while (getServerDate(target).day !== 1) { // 1 = Monday
                target.setUTCDate(target.getUTCDate() + 1);
            }
            break;
        case 'monthly': 
            while (getServerDate(target).date !== 1) {
                target.setUTCDate(target.getUTCDate() + 1);
            }
            break;
        case 'monthly-16th': 
            while (getServerDate(target).date !== 16) {
                target.setUTCDate(target.getUTCDate() + 1);
            }
            break;
        default:
            break;
    }
    return target.toISOString();
};

export default function GamePlanner({ gameId, title, rawData, tags }) {
    const { checkedTasks, toggleTask, excludedTags, toggleTagExclusion } = usePlanner();

    // Grab both the Reset Hour AND the active account server
    const { getServerResetUTC, activeAccount } = useSettings(); 
    const currentResetHour = getServerResetUTC();
    const server = activeAccount?.server || 'America';

    const gameCheckedTasks = checkedTasks[gameId] || {};

    const [activeTab, setActiveTab] = useState("All");
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef(null);

    useEffect(() => {
        if (!showSettings) return;

        const handleOutsideClick = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setShowSettings(false);
            }
        };

        if (showSettings) {
            document.addEventListener("mousedown", handleOutsideClick);
        }

        return () => document.removeEventListener("mousedown", handleOutsideClick);

    }, [showSettings]);

    const TABS = ["All", "Permanent", "Events", "Completed"];

    // FILTERING LOGIC 
    const allActiveTasks = rawData.filter((task) => !gameCheckedTasks[task.id]);
    const allCompletedTasks = rawData.filter((task) => gameCheckedTasks[task.id]);

    let currentList = [];
    if (activeTab === "Completed") {
        currentList = allCompletedTasks;
    } else {
        currentList = allActiveTasks;
        if (activeTab === "Permanent")
            currentList = currentList.filter((t) => t.type === "permanent");
        if (activeTab === "Events")
            currentList = currentList.filter((t) => t.type === "event");
        currentList = currentList.filter((t) => !excludedTags.includes(t.tag.id));
    }

    // Sort by deadline priority
    const listWithDeadlines = currentList.map((task) => {
        let finalDeadline = null;

        if (task.resetRule) {
            // Recurring task (e.g. Daily Commissions) - uses the Reset Hour setting
            finalDeadline = getNextReset(task.resetRule, currentResetHour, server);
        } else if (task.deadline) {
            // Hard deadline (e.g. an Event ending) - apply the timezone offset
            let offset = "-05:00";
            if (server === 'Europe') offset = "+01:00";
            if (server === 'Asia') offset = "+08:00";
            
            // Generate the exact UTC string for this specific server
            finalDeadline = new Date(`${task.deadline}${offset}`).toISOString();
        }

        return { ...task, finalDeadline };
    });

    listWithDeadlines.sort((a, b) => {
        if (!a.finalDeadline && !b.finalDeadline) return 0;
        if (!a.finalDeadline) return 1;
        if (!b.finalDeadline) return -1;
        return new Date(a.finalDeadline) - new Date(b.finalDeadline);
    });

    const completedCount = allCompletedTasks.length;

    return (
        <div className="w-full max-w-[1200px] mx-auto pb-20 px-4 md:px-0">
            <SectionHeader title={title} />

            {/* TABS & SETTINGS HEADER */}
            <div className="flex items-center justify-between gap-2 md:gap-4 border-b border-[#33343a] pb-4 mb-6 md:mb-8">
                
                <div className="flex items-center gap-1.5 md:gap-3 overflow-x-auto flex-1 pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab;
                        const isCompletedTab = tab === "Completed";
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap
                                ${
                                    isActive
                                        ? "bg-blue-500 text-white border border-blue-500 shadow-md"
                                        : "text-gray-400 hover:text-white hover:bg-[#1c1d21]/40 border border-transparent hover:border-blue-500"
                                }
                                ${isCompletedTab && !isActive ? "border-[#33343a]" : ""}
                                `}
                            >
                                {tab}
                                {isCompletedTab && (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? "bg-white text-blue-600" : "bg-[#33343a] text-gray-300"}`}>
                                        {completedCount}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
                
                {/* SETTINGS BUTTON */}
                <div ref={settingsRef} className="relative flex-shrink-0">
                    <button
                        onClick={() => setShowSettings((prev) => !prev)}
                        className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-[#1c1d21]/40 border border-[#33343a] hover:border-blue-500 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>

                    {showSettings && (
                        <div className="absolute top-full right-0 mt-3 w-56 md:w-64 p-3 md:p-4 bg-[#1c1d21] border border-[#33343a] rounded-xl shadow-2xl z-50 space-y-2 md:space-y-3">
                            <h4 className="text-white font-bold text-sm mb-2 md:mb-4">Toggle Visible Tags</h4>
                            {Object.values(tags).map((tag) => {
                                const isHidden = excludedTags.includes(tag.id);
                                return (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleTagExclusion(tag.id)}
                                        className={`flex items-center justify-between w-full p-2 md:p-2.5 rounded-lg border transition-all text-sm ${
                                            isHidden ? "bg-[#121212]/30 border-[#33343a]/50 text-gray-600" : "bg-[#121212] border-[#33343a] text-white hover:border-blue-500"
                                        }`}
                                    >
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] md:text-xs ${isHidden ? "bg-[#33343a] text-gray-400" : tag.bgColor + " " + tag.textColor}`}>
                                            {tag.text}
                                        </span>
                                        {!isHidden && (
                                            <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* PLANNER LIST */}
            <div className="flex flex-col gap-2">
                {listWithDeadlines.map((task) => {
                    const isChecked = gameCheckedTasks[task.id] || false;
                    const finalDeadline = task.finalDeadline;
                    const showTimer = !isChecked && finalDeadline;

                    return (
                        <div
                            key={task.id}
                            className={`relative flex items-center bg-[#1c1d21]/80 border border-[#33343a] rounded-xl p-2.5 md:p-3 shadow-sm hover:border-[#4b4c53] transition-colors group ${
                                isChecked ? "opacity-40" : "opacity-100"
                            }`}
                        >
                            <div className="flex items-center justify-center mr-2.5 md:mr-4 z-10">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleTask(gameId, task.id)}
                                    className="w-4 h-4 md:w-5 md:h-5 cursor-pointer rounded border-[#4b4c53] bg-[#121212] accent-blue-500 transition-colors"
                                />
                            </div>

                            <div className="w-7 h-8 md:w-10 md:h-12 flex-shrink-0 flex items-center justify-center mr-2.5 md:mr-4 rounded-md overflow-hidden z-10">
                                <img
                                    src={task.icon}
                                    alt="Icon"
                                    className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                                />
                            </div>
                            
                            <div className="flex flex-col flex-1 justify-center min-w-0 pr-16 md:pr-24 z-10 mt-1 md:mt-1.5">
                                <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-1.5">
                                    {task.label && (
                                        <div 
                                            title={task.label}
                                            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 border-[2px] border-current ${task.labelColor || task.tag?.textColor || 'text-gray-400'} ${task.labelBg || task.tag?.bgColor || 'bg-gray-800'}`}
                                        />
                                    )}
                                    <h3 className={`font-bold text-white text-[13px] md:text-base leading-tight truncate w-full ${isChecked && "line-through text-gray-600"}`}>
                                        {task.title}
                                    </h3>
                                </div>
                                
                                {/* BANNER DATA */}
                                {task.bannerData && (
                                    <div className={`flex items-center gap-1 md:gap-1.5 mt-1.5 md:mt-2 transition-opacity ${isChecked ? 'opacity-50 grayscale' : 'opacity-100'}`}>
                                        {task.bannerData.featuredChars?.map((char, idx) => (
                                            <div key={`char-${idx}`} className="relative group/tooltip flex-shrink-0">
                                                <img 
                                                    src={char.icon} 
                                                    alt={char.name} 
                                                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border border-orange-400 bg-orange-200/20 object-cover shadow-sm cursor-help" 
                                                />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#121212] border border-[#33343a] text-white text-[10px] md:text-xs font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                                    {char.name}
                                                </div>
                                            </div>
                                        ))}
                                        {task.bannerData.featuredWeapons?.map((weapon, idx) => (
                                            <div key={`weapon-${idx}`} className="relative group/tooltip flex-shrink-0">
                                                <img 
                                                    src={weapon.icon} 
                                                    alt={weapon.name} 
                                                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border border-orange-400 bg-orange-200/20 object-cover shadow-sm cursor-help" 
                                                />
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 bg-[#121212] border border-[#33343a] text-white text-[10px] md:text-xs font-bold rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                                    {weapon.name}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            {/* TIMER */}
                            <div className="absolute top-0 right-0 z-10">
                                {showTimer ? (
                                    <CountdownTimer endDate={finalDeadline} />
                                ) : (
                                    <TimerRibbon>
                                        {isChecked ? "Completed" : task.durationLabel || "Daily"}
                                    </TimerRibbon>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* EMPTY LIST MESSAGE */}
                {currentList.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-[#33343a] rounded-xl bg-[#1c1d21]/80">
                        <svg className="w-16 h-16 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-300 font-bold mb-1">List is empty!</p>
                        <p className="text-gray-300 text-sm max-w-sm">There are no tasks available for this tab or all have been filtered out by your settings gear.</p>
                    </div>
                )}
            </div>
        </div>
    );
}