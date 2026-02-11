import React from 'react';

interface RadioOnlyProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options?: { value: string; label: string }[];
    isRequired?: boolean;
    fieldKey?: string;
}

export const RadioOnly: React.FC<RadioOnlyProps> = ({
    label,
    value,
    onChange,
    options = [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    isRequired,
    fieldKey
}) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}{isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex items-center space-x-4 pt-1">
            {options.map(opt => (
                <label key={opt.value} className="flex items-center">
                    <input
                        type="radio"
                        name={`${fieldKey}-${label}`}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
                </label>
            ))}
        </div>
    </div>
);

export default RadioOnly;
