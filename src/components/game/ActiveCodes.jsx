import React from 'react';

export default function ActiveCodes({ codes, redeemUrl }) {
    if (!codes || codes.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Grid setup for columns (1 col on mobile, 2 on tablets, 3 on desktop) */}
        {codes.map((item, idx) => {
            
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
                className="block bg-[#1c1d21] border border-[#33343a] rounded-lg p-6 hover:border-blue-500 transition-colors group"
                title={`Redeem ${item.code}`}
            >
                <h4 className="font-mono text-xl font-bold text-white group-hover:text-white transition-colors tracking-wide mb-2">
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