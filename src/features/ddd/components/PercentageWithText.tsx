import React from 'react';

interface PercentageWithTextProps {
    label: string;
    percentageValue: string;
    onPercentageChange: (val: string) => void;
    textValue: string;
    onTextChange: (val: string) => void;
    isRequired?: boolean;
    fieldKey?: string;
}

export const PercentageWithText: React.FC<PercentageWithTextProps> = ({
    label,
    percentageValue,
    onPercentageChange,
    textValue,
    onTextChange,
    isRequired,
    fieldKey
}) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}{isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative rounded-md shadow-sm w-full sm:w-32">
                <input
                    type="number"
                    value={percentageValue}
                    onChange={(e) => onPercentageChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-8"
                    placeholder="請輸入%"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                </div>
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

export default PercentageWithText;
