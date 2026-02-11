import React from 'react';

interface CascadingSelectProps {
    options: { [key: string]: string[] };
    value: { main: string; sub: string };
    onChange: (field: 'main' | 'sub', value: string) => void;
}

export const CascadingSelect: React.FC<CascadingSelectProps> = ({ options, value, onChange }) => {
    const mainOptions = Object.keys(options);
    const subOptions = value?.main ? options[value.main] || [] : [];

    const handleMainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange('main', e.target.value);
        onChange('sub', '');
    };

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <select value={value?.main || ''} onChange={handleMainChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="">請選擇主類別</option>
                {mainOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <select value={value?.sub || ''} onChange={(e) => onChange('sub', e.target.value)} disabled={!value?.main || subOptions.length === 0} className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100">
                <option value="">請選擇子類別</option>
                {subOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
};

export default CascadingSelect;
