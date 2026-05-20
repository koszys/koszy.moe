export default function SectionHeader({ title, onToggle, isExpanded, isToggleable }) {
    return (
        <div
            onClick={isToggleable ? onToggle : undefined}
            className={isToggleable ? "cursor-pointer sm:cursor-default" : ""}
        >
            <h2 className="text-xl font-bold text-white uppercase tracking-wider pl-3 mt-12 mb-6 flex items-center justify-between relative">
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                <span>{title}</span>
                {isToggleable && (
                    <span className="sm:hidden text-sm font-normal text-gray-400">
                        {isExpanded ? '−' : '+'}
                    </span>
                )}
            </h2>
        </div>
    );
}