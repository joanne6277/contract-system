import React from 'react';
import { useBatch } from '../context/BatchContext';

interface BatchSelectionCheckboxProps {
    id: string;
    label?: string;
    className?: string;
}

export const BatchSelectionCheckbox: React.FC<BatchSelectionCheckboxProps> = ({ id, label, className = '' }) => {
    const { isSelected, toggleItem } = useBatch();
    const selected = isSelected(id);

    return (
        <input
            type="checkbox"
            checked={selected}
            onChange={(e) => {
                e.stopPropagation(); // Prevent row click events if any
                toggleItem(id, label);
            }}
            className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${className}`}
        />
    );
};
