import React from 'react';

interface FilterTextInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const FilterTextInput: React.FC<FilterTextInputProps> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md"
            placeholder={placeholder}
        />
    </div>
);
