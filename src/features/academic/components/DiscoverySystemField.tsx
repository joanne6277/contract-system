import React from 'react';
import { discoveryPlatforms } from '../../../shared/constants';

interface DiscoverySystemFieldProps {
    value: any;
    onChange: (field: string, value: any) => void;
}

export const DiscoverySystemField: React.FC<DiscoverySystemFieldProps> = ({ value, onChange }) => {
    const handleCheckboxChange = (group: string, option: string) => {
        const currentValues = value[group] || [];
        const newValues = currentValues.includes(option)
            ? currentValues.filter((item: string) => item !== option)
            : [...currentValues, option];
        onChange(group, newValues);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
                {['全選', '單選', '各平台皆不上架'].map(opt => (
                    <label key={opt} className="flex items-center">
                        <input
                            type="radio"
                            name="discoverySystem_selectionType"
                            value={opt}
                            checked={value.discoverySystem_selectionType === opt}
                            onChange={(e) => onChange('discoverySystem_selectionType', e.target.value)}
                            className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                    </label>
                ))}
            </div>

            {value.discoverySystem_selectionType === '全選' && (
                <div className="pl-6 space-y-3 border-l-2 border-gray-200 ml-2">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">未來平台:</span>
                        {['含將來合作平台', '僅包含現行合作平台'].map(opt => (
                            <label key={opt} className="flex items-center text-sm">
                                <input
                                    type="radio"
                                    name="discoverySystem_futurePlatforms"
                                    value={opt}
                                    checked={value.discoverySystem_futurePlatforms === opt}
                                    onChange={e => onChange('discoverySystem_futurePlatforms', e.target.value)}
                                    className="h-4 w-4"
                                />
                                <span className="ml-1">{opt}</span>
                            </label>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-600">CN地區:</span>
                        {['含CN', '不含CN'].map(opt => (
                            <label key={opt} className="flex items-center text-sm">
                                <input
                                    type="radio"
                                    name="discoverySystem_includeCN"
                                    value={opt}
                                    checked={value.discoverySystem_includeCN === opt}
                                    onChange={e => onChange('discoverySystem_includeCN', e.target.value)}
                                    className="h-4 w-4"
                                />
                                <span className="ml-1">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {value.discoverySystem_selectionType === '單選' && (
                <div className="pl-6 grid grid-cols-2 md:grid-cols-3 gap-2 ml-2 border-l-2 border-gray-200">
                    {discoveryPlatforms.map((platform: string) => (
                        <label key={platform} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={(value.discoverySystem_platforms || []).includes(platform)}
                                onChange={() => handleCheckboxChange('discoverySystem_platforms', platform)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{platform}</span>
                        </label>
                    ))}
                </div>
            )}

            {value.discoverySystem_selectionType !== '各平台皆不上架' && (
                <div className="pt-2">
                    {['書面通知', '書面同意'].map(opt => (
                        <label key={opt} className="items-center flex mr-4">
                            <input
                                type="checkbox"
                                checked={(value.discoverySystem_consent || []).includes(opt)}
                                onChange={() => handleCheckboxChange('discoverySystem_consent', opt)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DiscoverySystemField;
