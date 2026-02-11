import React from 'react';

interface RadioWithOtherInputProps {
    label: string;
    radioValue: string;
    onRadioChange: (val: string) => void;
    textValue: string;
    onTextChange: (val: string) => void;
    isRequired?: boolean;
    fieldKey?: string;
}

export const RadioWithOtherInput: React.FC<RadioWithOtherInputProps> = ({
    label,
    radioValue,
    onRadioChange,
    textValue,
    onTextChange,
    isRequired,
    fieldKey
}) => {
    const handleRadioChange = (value: string) => {
        onRadioChange(value);
        if (value !== 'other') {
            onTextChange('');
        }
    };

    return (
        <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}{isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-wrap">
                <div className="flex items-center space-x-4 pt-1">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name={`${fieldKey}-${label}`}
                            value="yes"
                            checked={radioValue === 'yes'}
                            onChange={(e) => handleRadioChange(e.target.value)}
                            className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">是</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name={`${fieldKey}-${label}`}
                            value="no"
                            checked={radioValue === 'no'}
                            onChange={(e) => handleRadioChange(e.target.value)}
                            className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">否</span>
                    </label>
                </div>
                <div className="flex items-center pt-1 flex-1 min-w-[250px]">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="radio"
                            name={`${fieldKey}-${label}`}
                            value="other"
                            checked={radioValue === 'other'}
                            onChange={(e) => handleRadioChange(e.target.value)}
                            className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">其他</span>
                    </label>
                    <input
                        type="text"
                        value={textValue}
                        onChange={(e) => onTextChange(e.target.value)}
                        onFocus={() => { if (radioValue !== 'other') handleRadioChange('other') }}
                        className="ml-2 w-full flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="請填寫備註或條件..."
                    />
                </div>
            </div>
        </div>
    );
};

export default RadioWithOtherInput;
