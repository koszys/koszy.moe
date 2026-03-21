import React from 'react';

import ChangelogSection from '../../components/ChangelogSection';

import { CHANGELOG_DATA } from '../../data/changelogs/genshinchangelog';  

export default function GenshinHome() {
    return (
        <div className="w-full max-w-[1200px] mx-auto">
        {/* ... other Genshin Home content will go here ... */}
        
        <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-blue-500 pl-3 mt-12 mb-2">
            Changelog
        </h2>
        <ChangelogSection changelogData={CHANGELOG_DATA} />
        </div>
    );
}