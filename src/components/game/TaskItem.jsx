import CountdownTimer from "./timeline/CountdownTimer";
import TimerRibbon from "./timeline/TimerRibbon";

export function TaskItem({ task, gameId, isChecked, onToggleTask }) {
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
                    onChange={() => onToggleTask(gameId, task.id)}
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
                            className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full flex-shrink-0 border-[2px] border-current ${task.labelColor || task.tags?.[0]?.textColor || 'text-gray-400'} ${task.labelBg || task.tags?.[0]?.bgColor || 'bg-gray-800'}`}
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
}
