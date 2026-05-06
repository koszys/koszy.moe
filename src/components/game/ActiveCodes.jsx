import React, { useEffect, useState } from 'react';
import { fetchCodes } from '../../data/fetchCodes';
import { Copy, Check } from 'lucide-react';
import { useSupabaseRealtime } from '../../hooks/useSupabaseRealtime';

export default function ActiveCodes({ game, redeemUrl }) {
    const [codes, setCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);

    const hasRedeemLink = typeof redeemUrl === 'string' && redeemUrl.trim().length > 0;

    useEffect(() => {
        if (game) {
            async function loadCodes() {
                setLoading(true);
                const data = await fetchCodes(game);
                setCodes(data);
                setLoading(false);
            }
            loadCodes();
        }
    }, [game]);

    // Listen to 'game_codes', run loadCodes on change, only if game exists
    useSupabaseRealtime('codes', async () => {
        const data = await fetchCodes(game);
        setCodes(data);
    }, !!game);

    const copyCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 1200);
        } catch (error) {
            console.error('Failed to copy code:', error);
        }
    };

    if (loading) return <div className="text-gray-400 p-4">Loading codes...</div>;
    if (!codes || codes.length === 0) return null;

    // Sort logic - using is_new from database
    const sortedCodes = [...codes].sort((a, b) => {
        if (a.is_new && !b.is_new) return -1;
        if (!a.is_new && b.is_new) return 1;
        return 0;
    });

    return (
        <div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {sortedCodes.map((item, idx) => {
                    const redeemLink = hasRedeemLink
                        ? redeemUrl.includes('hoyoverse.com')
                            ? `${redeemUrl}?code=${item.code}`
                            : redeemUrl
                        : null;

                    return (
                        <div
                            key={item.id || idx}
                            className="relative bg-[#1c1d21]/80 border border-[#33343a] hover:border-[#4b4c53] rounded-lg p-4 sm:p-6 transition-colors group overflow-hidden"
                        >
                            {/* TOP RIGHT RIBBON */}
                            {item.is_new && (
                                <div className="absolute top-0 right-0 bg-emerald-900/40 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-md">
                                    New
                                </div>
                            )}

                            {/* CODE TEXT */}
                            <div className="mb-1 sm:mb-2">
                                {hasRedeemLink ? (
                                    <a
                                        href={redeemLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block min-w-0 truncate font-mono text-base sm:text-xl font-bold text-white hover:text-blue-300 transition-colors tracking-wide underline underline-offset-4 decoration-blue-500/50 hover:decoration-blue-400"
                                        title={item.code} 
                                    >
                                        {item.code}
                                    </a>
                                ) : (
                                    <span 
                                        className="block min-w-0 truncate font-mono text-base sm:text-xl font-bold text-white tracking-wide"
                                        title={item.code}
                                    >
                                        {item.code}
                                    </span>
                                )}
                            </div>
                            
                            {/* REWARD TEXT */}
                            <p 
                                className="text-gray-300 text-xs sm:text-sm pr-10 line-clamp-2 sm:line-clamp-3"
                                title={item.reward}
                            >
                                {item.reward}
                            </p>

                            {/* BOTTOM RIGHT COPY BUTTON */}
                            <button
                                type="button"
                                onClick={() => copyCode(item.code)}
                                title="Copy code"
                                className="absolute bottom-0 right-0 inline-flex items-center justify-center bg-white/10 p-2 sm:p-2.5 text-gray-300 transition-colors hover:bg-white/20 hover:text-white rounded-tl-lg"
                            >
                                {copiedCode === item.code ? (
                                    <Check className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400" strokeWidth={3} />
                                ) : (
                                    <Copy className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}