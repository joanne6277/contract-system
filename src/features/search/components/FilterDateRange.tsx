import React from 'react';

interface FilterDateRangeProps {
    label: string;
    start: string;
    end: string;
    onStartChange: (value: string) => void;
    onEndChange: (value: string) => void;
}

export const FilterDateRange: React.FC<FilterDateRangeProps> = ({ label, start, end, onStartChange, onEndChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <div className="space-y-2">
            <input
                type="date"
                value={start}
                onChange={e => onStartChange(e.target.value)}
                className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md"
                placeholder="起始日期"
            />
            <input
                type="date"
                value={end}
                onChange={e => onEndChange(e.target.value)}
                className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md"
                placeholder="結束日期"
            />
        </div>
    </div>
);
