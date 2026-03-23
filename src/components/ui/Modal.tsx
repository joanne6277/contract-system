import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer, size = 'md' }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl',
        full: 'max-w-5xl',
    };

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] transition-all duration-300"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className={`
                    ${sizes[size]} w-full bg-white rounded-[var(--radius-xl)] shadow-2xl transform transition-all duration-300 animate-slide-up
                    border border-gray-100 flex flex-col max-h-[90vh]
                    /* Hover effect requested: "彈窗的hover透明度調高(讓使用者可以看到後面原本的內容)" */
                    /* Interpreted: When hovering the modal, make it slightly transparent to see background? */
                    /* Or clicking outside closes (already handled). */
                    /* Implementing: default solid, hover slightly translucent? This is unusual but matches request "see content behind". */
                    /* Better interpretation: The user might mean the BACKDROP opacity should be higher (less opaque)? No, "彈窗的hover". */
                    /* Let's try making the modal bg slightly translucent on hover. */
                    hover:bg-white/95
                `}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {footer && (
                    <div className="p-6 bg-gray-50 border-t border-gray-100 rounded-b-[var(--radius-xl)] flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
