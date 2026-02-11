import React from 'react';

interface AddressInputProps {
    postalCode: string;
    onPostalCodeChange: (val: string) => void;
    address: string;
    onAddressChange: (val: string) => void;
    label: string;
    isRequired?: boolean;
    fieldKey?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({
    postalCode,
    onPostalCodeChange,
    address,
    onAddressChange,
    label,
    isRequired,
    fieldKey
}) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={fieldKey}>
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}{isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <input
                type="text"
                value={postalCode}
                onChange={(e) => onPostalCodeChange(e.target.value)}
                className="w-full sm:w-24 px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="郵遞區號"
            />
            <input
                type="text"
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
                className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="地址"
            />
        </div>
    </div>
);

export default AddressInput;
