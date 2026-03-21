import React, { useState } from 'react';
import ChangelogItem from './ChangelogItem';

export default function ChangelogSection({ changelogData }) {
    const [showChangelog, setShowChangelog] = useState(false);
    const [visibleCount, setVisibleCount] = useState(4);

    // Safety check in case no data is passed
    if (!changelogData || changelogData.length === 0) return null;

    return (
        <section className="mt-10 mb-20">
        <button 
            onClick={() => {
            setShowChangelog(!showChangelog);
            if (!showChangelog) setVisibleCount(4); 
            }}
            className="flex items-center gap-2 text-white hover:text-white transition-colors text-sm font-bold uppercase tracking-widest bg-[#1c1d21]/40 border border-[#33343a] px-4 py-2 rounded mb-6"
        >
            {showChangelog ? '− Hide Changelog' : '+ View Changelog'}
        </button>

        {showChangelog && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-[#1c1d21]/40 border border-[#33343a] rounded-lg p-6 space-y-6">
                {changelogData.slice(0, visibleCount).map((entry, idx) => (
                <div key={idx} className={idx !== 0 ? "border-t border-[#33343a] pt-6" : ""}>
                    <ChangelogItem 
                    version={entry.version} 
                    date={entry.date} 
                    changes={entry.changes} 
                    />
                </div>
                ))}

                <div className="flex flex-wrap gap-4 pt-2">
                {visibleCount < changelogData.length && (
                    <button
                    onClick={() => setVisibleCount(prev => prev + 4)}
                    className="flex items-center gap-2 text-white hover:text-white transition-colors text-sm font-bold uppercase tracking-widest bg-[#1c1d21]/60 border border-[#33343a] px-4 py-2 rounded"
                    >
                    ↓ Show more
                    </button>
                )}

                {visibleCount > 4 && (
                    <button
                    onClick={() => setVisibleCount(prev => Math.max(4, prev - 4))}
                    className="flex items-center gap-2 text-white hover:text-white transition-colors text-sm font-bold uppercase tracking-widest bg-[#1c1d21]/60 border border-[#33343a] px-4 py-2 rounded"
                    >
                    ↑ Show less
                    </button>
                )}

                <button
                    onClick={() => {
                    setShowChangelog(false);
                    setVisibleCount(4);
                    }}
                    className="flex items-center gap-2 text-white hover:text-white transition-colors text-sm font-bold uppercase tracking-widest bg-[#1c1d21]/60 border border-[#33343a] px-4 py-2 rounded"
                >
                    × Hide Changelog
                </button>
                </div>
            </div>
            </div>
        )}
        </section>
    );
}