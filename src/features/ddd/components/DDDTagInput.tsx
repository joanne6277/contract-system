import React, { useState } from 'react';
import { X } from 'lucide-react';

interface DDDTagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    suggestions?: string[];
    label: string;
    fieldKey?: string;
}

export const DDDTagInput: React.FC<DDDTagInputProps> = ({
    tags,
    setTags,
    suggestions,
    label,
    fieldKey
}) => {
    const [inputValue, setInputValue] = useState('');

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
        }
        setInputValue('');
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        }
    };

    return (
        <div data-fieldkey={fieldKey}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg bg-white">
                {tags.map(tag => (
                    <div key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-1 rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-indigo-500 hover:text-indigo-700">
                            <X size={14} />
                        </button>
                    </div>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow p-1 outline-none bg-transparent"
                    placeholder="輸入後按 Enter 新增..."
                />
            </div>
            {suggestions && suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500 mr-2">建議:</span>
                    {suggestions.map(suggestion => (
                        <button
                            type="button"
                            key={suggestion}
                            onClick={() => addTag(suggestion)}
                            className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-md hover:bg-gray-300 transition-colors"
                        >
                            + {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DDDTagInput;
