import React from 'react';

interface DropdownWithTextProps {
    label: string;
    selectedValue: string;
    onSelectChange: (val: string) => void;
    textValue: string;
    onTextChange: (val: string) => void;
    options: { value: string; label: string }[];
    isRequired?: boolean;
    fieldKey?: string;
}

export const DropdownWithText: React.FC<DropdownWithTextProps> = ({
    label,
    selectedValue,
    onSelectChange,
    textValue,
    onTextChange,
    options = [],
    isRequired,
    fieldKey
}) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}{isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <select
                value={selectedValue}
                onChange={(e) => onSelectChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto"
            >
                <option value="">請選擇</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <input
                type="text"
                value={textValue}
                onChange={(e) => onTextChange(e.target.value)}
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="請填寫備註或條件..."
            />
        </div>
    </div>
);

export default DropdownWithText;
