import React from 'react';

interface ThirdPartyPlatformFieldProps {
    value: any;
    onChange: (field: string, value: any) => void;
}

export const ThirdPartyPlatformField: React.FC<ThirdPartyPlatformFieldProps> = ({ value, onChange }) => {
    const handleTwsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange('thirdPartyPlatform_tws', e.target.value);
        if (e.target.value === '不上_TWS') {
            onChange('thirdPartyPlatform_consent', []);
        }
    };

    const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: option, checked } = e.target;
        const currentConsent = value.thirdPartyPlatform_consent || [];
        const newConsent = checked
            ? [...currentConsent, option]
            : currentConsent.filter((item: string) => item !== option);
        onChange('thirdPartyPlatform_consent', newConsent);
    };

    const isLocked = value.thirdPartyPlatform_tws === '不上_TWS';

    return (
        <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="flex items-center space-x-4 pt-2">
                {['上_TWS', '不上_TWS'].map(opt => (
                    <label key={opt} className="flex items-center">
                        <input
                            type="radio"
                            name="thirdPartyPlatform_tws"
                            value={opt}
                            checked={value.thirdPartyPlatform_tws === opt}
                            onChange={handleTwsChange}
                            className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                    </label>
                ))}
            </div>
            <div className="flex items-center space-x-4 pt-2">
                {['書面通知', '書面同意'].map(opt => (
                    <label key={opt} className={`flex items-center ${isLocked ? 'cursor-not-allowed opacity-50' : ''}`}>
                        <input
                            type="checkbox"
                            value={opt}
                            checked={!isLocked && (value.thirdPartyPlatform_consent || []).includes(opt)}
                            onChange={handleConsentChange}
                            disabled={isLocked}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default ThirdPartyPlatformField;
