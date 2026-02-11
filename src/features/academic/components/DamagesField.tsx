import React from 'react';

interface DamagesFieldProps {
    value: any;
    onChange: (field: string, value: any) => void;
}

export const DamagesField: React.FC<DamagesFieldProps> = ({ value, onChange }) => {
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange('damages_hasClause', newValue);
        if (newValue === '否') {
            onChange('damages_description', '');
        }
    };

    const isLocked = value.damages_hasClause === '否';

    return (
        <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex items-center space-x-4 pt-2">
                {['是', '否'].map(opt => (
                    <label key={opt} className="flex items-center">
                        <input
                            type="radio"
                            name="damages_hasClause"
                            value={opt}
                            checked={value.damages_hasClause === opt}
                            onChange={handleRadioChange}
                            className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                    </label>
                ))}
            </div>
            <input
                type="text"
                value={value.damages_description || ''}
                onChange={(e) => onChange('damages_description', e.target.value)}
                disabled={isLocked}
                className="w-full grow px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder={isLocked ? '' : '請說明'}
            />
        </div>
    );
};

export default DamagesField;
