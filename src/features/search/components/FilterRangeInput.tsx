import React from 'react';

interface FilterRangeInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholderStart?: string;
    placeholderEnd?: string;
}

export const FilterRangeInput: React.FC<FilterRangeInputProps> = ({
    label, value, onChange, placeholderStart = '起始值', placeholderEnd = '結束值'
}) => {
    const [start, end] = (value || '').split('-');

    const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStart = e.target.value;
        onChange(`${newStart}-${end || ''}`);
    };

    const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEnd = e.target.value;
        onChange(`${start || ''}-${newEnd}`);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={start || ''}
                    onChange={handleStartChange}
                    className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md"
                    placeholder={placeholderStart}
                />
                <span className="text-gray-500">-</span>
                <input
                    type="number"
                    value={end || ''}
                    onChange={handleEndChange}
                    className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md"
                    placeholder={placeholderEnd}
                />
            </div>
        </div>
    );
};
