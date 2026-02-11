import React from 'react';

interface CheckboxWithTextProps {
    label: string;
    radioValue: string;
    onRadioChange: (val: string) => void;
    textValue: string;
    onTextChange: (val: string) => void;
    radioOptions?: { value: string; label: string }[];
    isRequired?: boolean;
    fieldKey?: string;
}

export const CheckboxWithText: React.FC<CheckboxWithTextProps> = ({
    label,
    radioValue,
    onRadioChange,
    textValue,
    onTextChange,
    radioOptions = [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    isRequired,
    fieldKey
}) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}{isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-4 pt-1">
                {radioOptions.map(opt => (
                    <label key={opt.value} className="flex items-center">
                        <input
                            type="radio"
                            name={`${fieldKey}-${label}`}
                            value={opt.value}
                            checked={radioValue === opt.value}
                            onChange={(e) => onRadioChange(e.target.value)}
                            className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
                    </label>
                ))}
            </div>
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

export default CheckboxWithText;
