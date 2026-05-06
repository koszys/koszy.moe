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
            {/* {!hasRedeemLink && (
                <div className="mb-4 rounded-lg border border-[#33343a] bg-[#14151a]/80 p-4 text-sm text-gray-300">
                    No redeem link is available for this game. Copy the code below and redeem it manually on the official site.
                </div>
            )} */}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Grid setup for columns (2 cols on mobile, 3 on desktop) */}
                {sortedCodes.map((item, idx) => {
                    const redeemLink = hasRedeemLink
                        ? redeemUrl.includes('hoyoverse.com')
                            ? `${redeemUrl}?code=${item.code}`
                            : redeemUrl
                        : null;

                    return (
                        <div
                            key={item.id || idx}
                            className="relative bg-[#1c1d21]/80 border border-[#33343a] hover:border-[#4b4c53] rounded-lg p-6  transition-colors group overflow-hidden"
                        >
                            {item.is_new && (
                                <div className="absolute top-0 right-0 bg-emerald-900/40 text-emerald-300 text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-md">
                                    New
                                </div>
                            )}

                            <div className="flex items-center gap-3 mb-2">
                                {hasRedeemLink ? (
                                    <a
                                        href={redeemLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-mono text-xl font-bold text-white hover:text-blue-300 transition-colors tracking-wide underline underline-offset-4 decoration-blue-500/50 hover:decoration-blue-400"
                                    >
                                        {item.code}
                                    </a>
                                ) : (
                                    <span className="font-mono text-xl font-bold text-white tracking-wide">
                                        {item.code}
                                    </span>
                                )}

                                <button
                                    type="button"
                                    onClick={() => copyCode(item.code)}
                                    title="Copy code"
                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-white/10 p-1.5 text-white transition hover:bg-white/20 hover:border-blue-500"
                                >
                                    {copiedCode === item.code ? (
                                        <Check className="h-4 w-4 text-emerald-400" strokeWidth={3} />
                                    ) : (
                                        <Copy className="h-4 w-4 text-gray-300" strokeWidth={2} />
                                    )}
                                </button>
                            </div>
                            
                            <p className="text-gray-300 text-sm">
                                {item.reward}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}