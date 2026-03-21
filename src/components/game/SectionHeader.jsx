import React from 'react';

export default function SectionHeader({ title }) {
    return (
        <h2 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-blue-500 pl-3 mt-12 mb-6">
        {title}
        </h2>
    );
}