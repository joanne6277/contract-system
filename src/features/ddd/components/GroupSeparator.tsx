import React from 'react';

interface GroupSeparatorProps {
    title: string;
}

export const GroupSeparator: React.FC<GroupSeparatorProps> = ({ title }) => (
    <div className="flex items-center col-span-1 md:col-span-2 lg:col-span-3 pt-4 pb-2">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-sm font-semibold text-gray-600">{title}</span>
        <div className="flex-grow border-t border-gray-200"></div>
    </div>
);

export default GroupSeparator;
