import React, { useState } from 'react';

// Reusing global components
import SectionHeader from '../../components/game/SectionHeader';
import CountdownTimer from '../../components/game/timeline/CountdownTimer';

// Accessing State & Data
import { usePlanner } from '../../context/PlannerContext';
import { PLANNER_DATA, PLANNER_TAGS } from '../../data/genshinplanner';

export default function GenshinPlanner() {
    const gameId = 'genshin';
    const rawData = PLANNER_DATA[gameId];
    
    // States from Context
    const { checkedGenshinPlanner, toggleGenshinCheck, excludedTags, toggleTagExclusion } = usePlanner();
    
    // Local States
    const [activeTab, setActiveTab] = useState('All'); // ['All', 'Permanent', 'Events', 'Completed']
    const [showSettings, setShowSettings] = useState(false);

    const TABS = ['All', 'Permanent', 'Events', 'Completed'];

    // === FILTERING LOGIC ===
    // 1. Separate based on checked status
    const allActiveTasks = rawData.filter(task => !checkedGenshinPlanner[task.id]);
    const allCompletedTasks = rawData.filter(task => checkedGenshinPlanner[task.id]);

    // 2. Further filter current list based on active tab and settings gear
    let currentList = [];
    if (activeTab === 'Completed') {
        currentList = allCompletedTasks;
    } else {
        currentList = allActiveTasks;
        // Apply type filter if not 'All'
        if (activeTab === 'Permanent') currentList = currentList.filter(t => t.type === 'permanent');
        if (activeTab === 'Events') currentList = currentList.filter(t => t.type === 'event');
        
        // Apply Settings Gear (Tag Exclusion)
        currentList = currentList.filter(t => !excludedTags.includes(t.tag.id));
    }

    // Count for the completed tab
    const completedCount = allCompletedTasks.length;

    return (
        <div className="w-full max-w-[1200px] mx-auto pb-20 px-4 md:px-0">
        
        <SectionHeader title="Genshin Impact Planner" />

        {/* TABS & SETTINGS HEADER */}
        <div className="flex items-center justify-between gap-4 border-b border-[#33343a] pb-4 mb-8">
            
            {/* Left: Tab Navigation */}
            <div className="flex items-center gap-1.5 md:gap-3">
            {TABS.map(tab => {
                const isActive = activeTab === tab;
                const isCompletedTab = tab === 'Completed';
                return (
                <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all whitespace-nowrap
                    ${isActive 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'text-gray-400 hover:text-white hover:bg-[#1c1d21]/40 border border-transparent'}
                    ${isCompletedTab && 'border border-[#33343a]'}
                    `}
                >
                    {tab}
                    {isCompletedTab && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white text-blue-600' : 'bg-[#33343a] text-gray-300'}`}>
                        {completedCount}
                    </span>
                    )}
                </button>
                );
            })}
            </div>

            {/* Right: Settings Gear (Tag Toggle) */}
            <div className="relative">
            <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-[#1c1d21]/40 border border-[#33343a] transition-all"
                title="Planner Settings"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            
            {/* Simple Settings Dropdown */}
            {showSettings && (
                <div className="absolute top-full right-0 mt-3 w-64 p-4 bg-[#1c1d21] border border-[#33343a] rounded-xl shadow-2xl z-50 space-y-3">
                <h4 className="text-white font-bold text-sm mb-4">Toggle Visible Tags</h4>
                {Object.values(PLANNER_TAGS).map(tag => {
                    const isHidden = excludedTags.includes(tag.id);
                    return (
                    <button 
                        key={tag.id}
                        onClick={() => toggleTagExclusion(tag.id)}
                        className={`flex items-center justify-between w-full p-2.5 rounded-lg border transition-all text-sm
                        ${isHidden ? 'bg-[#121212]/30 border-[#33343a]/50 text-gray-600' : 'bg-[#121212] border-[#33343a] text-white hover:border-blue-500'}
                        `}
                    >
                        <span className={`px-1.5 py-0.5 rounded text-xs ${isHidden ? 'bg-[#33343a] text-gray-400' : tag.bgColor + ' ' + tag.textColor}`}>
                        {tag.text}
                        </span>
                        {isHidden ? (
                        <span className="text-gray-600 text-xs">Hidden</span>
                        ) : (
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        )}
                    </button>
                    );
                })}
                <p className="text-[11px] text-gray-600 pt-2 border-t border-[#33343a]">Completed tab is not affected by tag filtering.</p>
                </div>
            )}
            </div>
        </div>

        {/* PLANNER LIST (adopting styles from eventtimeline.jsx) */}
        <div className="flex flex-col gap-3.5">
            {currentList.map(task => {
            const isChecked = checkedGenshinPlanner[task.id] || false;
            const isEvent = task.type === 'event';
            const hasImage = !!task.bgImage;

            return (
                <div 
                key={task.id} 
                // Standard Layout Structure adopting styles from timeline.jsx
                className={`relative flex items-center bg-[#1c1d21]/80 border border-[#33343a] rounded-xl p-3 shadow-sm hover:border-[#4b4c53] transition-colors group
                ${isChecked ? 'opacity-40' : 'opacity-100'}
                `}
                >
                
                {/* Optional background image blend */}
                {hasImage && (
                    <div 
                        className="absolute inset-0 bg-cover bg-center pointer-events-none mix-blend-luminosity opacity-5"
                        style={{ backgroundImage: `url('${task.bgImage}')` }}
                    />
                )}

                {/* LEFT: Custom Styled Checkbox */}
                <div className="flex items-center justify-center mr-4 z-10">
                    <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={() => toggleGenshinCheck(task.id)}
                    className="w-5 h-5 cursor-pointer rounded border-[#4b4c53] bg-[#121212] accent-blue-500 transition-colors"
                    />
                </div>
                
                {/* Icon to the right of checkbox */}
                <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center mr-4 rounded-md overflow-hidden z-10">
                    <img 
                    src={task.icon} 
                    alt="Icon" 
                    className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform" 
                    />
                </div>

                {/* MIDDLE: Content */}
                <div className="flex flex-col flex-1 justify-center min-w-0 pr-24 z-10">
                    
                    {/* Title and Optional Tag Label (like Event End, Period, TCG) */}
                    <div className={`flex ${task.label ? 'items-center gap-2 mb-1.5' : 'flex-col items-start gap-1.5'}`}>
                    {task.label && (
                        <span className={`text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded ${task.tag.bgColor} ${task.tag.textColor}`}>
                        {task.label}
                        </span>
                    )}
                    <h3 className={`font-bold text-white text-sm md:text-base leading-tight truncate w-full ${isChecked && 'line-through text-gray-600'}`}>
                        {task.title}
                    </h3>
                    </div>
                </div>

                {/* RIGHT: Time remaining pill (Absolute positioned top right) */}
                <div className="absolute top-3 right-3 z-10">
                    {isEvent && !isChecked ? (
                    // Reusing the same CountdownTimer logic from eventtimeline.jsx
                    <CountdownTimer endDate={task.deadline} />
                    ) : (
                    // Grey static label for permanent tasks or completed tasks
                    <div className="bg-[#33343a] text-gray-400 text-[11px] md:text-xs font-medium px-2 py-0.5 rounded shadow-sm tracking-wide">
                        {isChecked ? 'Completed' : (task.durationLabel || 'Daily')}
                    </div>
                    )}
                </div>

                </div>
            );
            })}

            {/* Empty State message */}
            {currentList.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-[#33343a] rounded-xl bg-[#1c1d21]/20">
                <svg className="w-16 h-16 text-gray-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-400 font-bold mb-1">List is completely empty!</p>
                <p className="text-gray-600 text-sm max-w-sm">There are no tasks available for this tab or all have been filtered out by your settings gear.</p>
            </div>
            )}
        </div>

        </div>
    );
}