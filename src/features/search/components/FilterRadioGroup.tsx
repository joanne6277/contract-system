import React from 'react';

interface FilterRadioGroupProps {
    label: string;
    value: string;
    options: string[] | { value: string; label: string }[];
    onChange: (value: string) => void;
}

export const FilterRadioGroup: React.FC<FilterRadioGroupProps> = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
            <label className="flex items-center">
                <input type="radio" name={label} value="" checked={!value} onChange={(e) => onChange(e.target.value)} className="h-4 w-4" />
                <span className="ml-2 text-sm">全部</span>
            </label>
            {options.map(opt => {
                const optValue = typeof opt === 'string' ? opt : opt.value;
                const optLabel = typeof opt === 'string' ? opt : opt.label;
                return (
                    <label key={optValue} className="flex items-center">
                        <input type="radio" name={label} value={optValue} checked={value === optValue} onChange={(e) => onChange(e.target.value)} className="h-4 w-4" />
                        <span className="ml-2 text-sm">{optLabel}</span>
                    </label>
                );
            })}
        </div>
    </div>
);
