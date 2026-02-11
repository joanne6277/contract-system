import React from 'react';

interface TextInputProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    isRequired?: boolean;
    fieldKey?: string;
    type?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChange,
    placeholder = "請輸入...",
    isRequired,
    fieldKey,
    type = "text"
}) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}{isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder={placeholder}
        />
    </div>
);

export default TextInput;
