export function TagSettingsPanel({ tags, excludedTags, toggleTagExclusion, isOpen }) {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full right-0 mt-3 w-56 md:w-64 p-3 md:p-4 bg-[#1c1d21] border border-[#33343a] rounded-xl shadow-2xl z-50 space-y-2 md:space-y-3">
            <h4 className="text-white font-bold text-sm mb-2 md:mb-4">Toggle Visible Tags</h4>
            
            {/* Only grab the tags that DO NOT have a parent */}
            {Object.values(tags).filter(tag => !tag.parentId).map((parentTag) => {
                const isParentHidden = excludedTags.includes(parentTag.id);
                
                {/* Find any children that belong to this specific parent */}
                const childTags = Object.values(tags).filter(t => t.parentId === parentTag.id);

                return (
                    <div key={parentTag.id} className="flex flex-col gap-1.5">
                        {/* PARENT BUTTON */}
                        <button
                            onClick={() => toggleTagExclusion(parentTag.id)}
                            className={`flex items-center justify-between w-full p-2 md:p-2.5 rounded-lg border transition-all text-sm ${
                                isParentHidden ? "bg-[#121212]/30 border-[#33343a]/50 text-gray-600" : "bg-[#121212] border-[#33343a] text-white hover:border-blue-500"
                            }`}
                        >
                            <span className={`px-1.5 py-0.5 rounded text-[10px] md:text-xs ${isParentHidden ? "bg-[#33343a] text-gray-400" : parentTag.bgColor + " " + parentTag.textColor}`}>
                                {parentTag.text}
                            </span>
                            {!isParentHidden && (
                                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>

                        {/* CHILD BUTTONS (Indented underneath parent) */}
                        {childTags.length > 0 && (
                            <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-[#33343a] ml-2 mt-0.5">
                                {childTags.map(childTag => {
                                    const isChildHidden = isParentHidden || excludedTags.includes(childTag.id);
                                    
                                    return (
                                        <button
                                            key={childTag.id}
                                            onClick={() => !isParentHidden && toggleTagExclusion(childTag.id)}
                                            className={`flex items-center justify-between w-full p-1.5 md:p-2 rounded-lg border transition-all text-sm ${
                                                isChildHidden 
                                                    ? "bg-[#121212]/30 border-[#33343a]/50 text-gray-600" 
                                                    : "bg-[#121212] border-[#33343a] text-white hover:border-blue-500"
                                            } ${isParentHidden ? "cursor-not-allowed opacity-50" : ""}`}
                                        >
                                            <span className={`px-1.5 py-0.5 rounded text-[10px] md:text-xs ${isChildHidden ? "bg-[#33343a] text-gray-400" : childTag.bgColor + " " + childTag.textColor}`}>
                                                {childTag.text}
                                            </span>
                                            {!isChildHidden && (
                                                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
