import React from 'react';

export default function ActiveCodes({ codes, redeemUrl }) {
    if (!codes || codes.length === 0) return null;

    const sortedCodes = [...codes].sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Grid setup for columns (1 col on mobile, 2 on tablets, 3 on desktop) */}
        {sortedCodes.map((item, idx) => {
            
            // Auto-fill the code if it's a Hoyoverse link
            const link = redeemUrl.includes('hoyoverse.com') 
                ? `${redeemUrl}?code=${item.code}` 
                : redeemUrl;

            return (
                <a 
                    key={idx}
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative block bg-[#1c1d21]/80 border border-[#33343a] rounded-lg p-6 hover:border-blue-500 transition-colors group overflow-hidden"
                    title={`Redeem ${item.code}`}
                >
                    
                    {/* New label */}
                    {item.isNew && (
                    <div className="absolute top-0 right-0 bg-emerald-900/40 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-md">
                        New
                    </div>
                    )}

                    <h4 className="font-mono text-xl font-bold text-white group-hover:text-blue-500 transition-colors tracking-wide mb-2">
                    {item.code}
                    </h4>
                    <p className="text-gray-300 text-sm">
                    {item.reward}
                    </p>
                </a>
                );
            })}
        </div>
    );
}