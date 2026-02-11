import React from 'react';

interface FilterSelectProps {
    label: string;
    value: string;
    options: string[] | { value: string; label: string }[];
    onChange: (value: string) => void;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md"
        >
            <option value="">全部</option>
            {options.map(opt => {
                const optValue = typeof opt === 'string' ? opt : opt.value;
                const optLabel = typeof opt === 'string' ? opt : opt.label;
                return <option key={optValue} value={optValue}>{optLabel}</option>;
            })}
        </select>
    </div>
);
