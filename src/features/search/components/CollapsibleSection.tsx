import React, { useState } from 'react';
import type { ReactNode } from 'react';

import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title, children, defaultOpen = true
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="py-4 border-b">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center text-left font-semibold text-gray-700"
            >
                <span>{title}</span>
                <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
            </button>
            {isOpen && <div className="mt-4 space-y-4 pl-2">{children}</div>}
        </div>
    );
};

interface ControlledCollapsibleSectionProps {
    title: string;
    children: ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

export const ControlledCollapsibleSection: React.FC<ControlledCollapsibleSectionProps> = ({
    title, children, isOpen, onToggle
}) => {
    return (
        <div className="py-4 border-b">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center text-left font-semibold text-gray-700"
            >
                <span>{title}</span>
                <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
            </button>
            {isOpen && <div className="mt-4 space-y-4 pl-2">{children}</div>}
        </div>
    );
};
