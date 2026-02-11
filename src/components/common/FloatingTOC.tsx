import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface TocSection {
    id: string;
    label: string;
}

interface FloatingTOCProps {
    onJump: (id: string) => void;
    sections?: TocSection[];
}

const FloatingTOC: React.FC<FloatingTOCProps> = ({ onJump, sections = [] }) => {
    const [isTocOpen, setIsTocOpen] = useState(false);

    // 如果目錄是關閉的，只顯示一個小按鈕
    if (!isTocOpen) {
        return (
            <div className="fixed top-32 right-5 z-40">
                <button
                    onClick={() => setIsTocOpen(true)}
                    className="bg-white p-2.5 rounded-l-lg shadow-lg border border-gray-200 border-r-0 hover:bg-gray-50 transition-colors"
                    aria-label="開啟目錄"
                    title="開啟章節目錄"
                >
                    <Menu className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        )
    }

    // 如果目錄是開啟的，顯示完整清單
    return (
        <div className="fixed top-32 right-5 z-40 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 w-48 transition-all duration-300 animate-in fade-in slide-in-from-right-5">
            <div className="flex justify-between items-center p-3 border-b border-gray-200">
                <h3 className="font-semibold text-sm text-gray-800">章節目錄</h3>
                <button
                    onClick={() => setIsTocOpen(false)}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <nav>
                <ul className="py-2">
                    {sections.map((section) => (
                        <li key={section.id}>
                            <a
                                href={`#${section.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onJump(section.id);
                                }}
                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors mx-1 rounded-md"
                            >
                                {section.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default FloatingTOC;
