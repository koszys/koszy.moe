import { useState, useRef, useEffect } from "react";
import SectionHeader from "./SectionHeader";
import { usePlanner } from "../../context/PlannerContext";
import { useSettings } from "../../context/SettingsContext";
import { useTaskCompletion } from "../../hooks/useTaskCompletion";
import { getNextReset, applyServerOffset } from "../../utils/timeCalculations";
import { TagSettingsPanel } from "./TagSettingsPanel";
import { TaskItem } from "./TaskItem";

export default function GamePlanner({ gameId, title, rawData, tags }) {
    const { checkedTasks, toggleTask, excludedTags, toggleTagExclusion, clearCompletedTask } = usePlanner();
    const { getServerResetUTC, activeAccount } = useSettings(); 
    
    const currentResetHour = getServerResetUTC();
    const server = activeAccount?.server || 'America';
    const gameCheckedTasks = checkedTasks[gameId] || {};

    // Use custom hook for task completion logic
    const { isTaskCompleted, isTaskExpired } = useTaskCompletion(gameCheckedTasks, currentResetHour, server);

    // State for UI
    const [activeTab, setActiveTab] = useState("All");
    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef(null);

    // Auto-clear expired tasks
    useEffect(() => {
        rawData.forEach((task) => {
            if (gameCheckedTasks[task.id] && isTaskExpired(task)) {
                clearCompletedTask(gameId, task.id);
            }
        });
    }, [rawData, gameCheckedTasks, currentResetHour, server, clearCompletedTask, gameId, isTaskExpired]);

    // Close settings on outside click
    useEffect(() => {
        if (!showSettings) return;

        const handleOutsideClick = (event) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setShowSettings(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [showSettings]);

    // Filter and sort logic
    const TABS = ["All", "Permanent", "Events", "Completed"];
    const allActiveTasks = rawData.filter((task) => !isTaskCompleted(task));
    const allCompletedTasks = rawData.filter((task) => isTaskCompleted(task));

    let currentList = [];
    if (activeTab === "Completed") {
        currentList = allCompletedTasks;
    } else {
        currentList = allActiveTasks;
        if (activeTab === "Permanent") {
            currentList = currentList.filter((t) => t.type === "permanent" || t.type === "task");
        }
        if (activeTab === "Events") {
            currentList = currentList.filter((t) => t.type === "event");
        }
        
        // Exclude tasks if tag or parent is excluded
        currentList = currentList.filter((t) => {
            return !t.tags.some(tag => 
                excludedTags.includes(tag.id) || 
                (tag.parentId && excludedTags.includes(tag.parentId))
            );
        });
    }

    // Add deadlines and sort
    const listWithDeadlines = currentList.map((task) => {
        let finalDeadline = null;

        if (task.resetRule) {
            finalDeadline = getNextReset(task.resetRule, currentResetHour, server);
        } else if (task.deadline) {
            finalDeadline = applyServerOffset(task.deadline, server);
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

                    <TagSettingsPanel 
                        tags={tags}
                        excludedTags={excludedTags}
                        toggleTagExclusion={toggleTagExclusion}
                        isOpen={showSettings}
                    />
                </div>
            </div>

            {/* PLANNER LIST */}
            <div className="flex flex-col gap-2">
                {listWithDeadlines.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        gameId={gameId}
                        isChecked={isTaskCompleted(task)}
                        onToggleTask={toggleTask}
                    />
                ))}

                {/* Empty list message */}
                {currentList.length === 0 && (
                    <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-[#33343a] rounded-xl bg-[#1c1d21]/80">
                        <svg className="w-16 h-16 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-300 font-bold mb-1">List is empty!</p>
                        <p className="text-gray-300 text-sm max-w-sm">There are no tasks available for this tab or all have been filtered out by your toggles.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
