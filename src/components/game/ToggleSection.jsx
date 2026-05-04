import React, { useState } from 'react';

export default function ToggleSection({ title, children, defaultOpen = true }) {
    const [isExpanded, setIsExpanded] = useState(defaultOpen);

    return (
        <div>
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer"
            >
                <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-blue-500 pl-3 mt-12 mb-6 flex items-center justify-start gap-3 hover:border-blue-400 transition-colors">
                    <span className="text-lg font-bold text-white">
                        {isExpanded ? '−' : '+'}
                    </span>
                    <span>{title}</span>
                </h2>
            </div>

            {isExpanded && <div>{children}</div>}
        </div>
    );
}
