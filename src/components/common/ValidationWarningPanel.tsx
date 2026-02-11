import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ValidationWarningPanelProps {
    isVisible: boolean;
    hardMissing: string[];
    onJumpToField: (fieldTitle: string) => void;
    onClose: () => void;
}

export const ValidationWarningPanel: React.FC<ValidationWarningPanelProps> = ({
    isVisible,
    hardMissing,
    onJumpToField,
    onClose
}) => {
    if (!isVisible || hardMissing.length === 0) return null;

    return (
        <div className="fixed bottom-8 right-8 w-96 max-w-[calc(100vw-4rem)] bg-white rounded-xl shadow-2xl z-50 border-t-4 border-red-500 transition-all duration-300">
            <div className="flex items-start p-4 border-b border-gray-200">
                <div className="flex-shrink-0 mr-4 p-2 rounded-full bg-red-100">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-red-800">無法儲存，請完成以下必填欄位</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 h-auto">
                    <X className="w-5 h-5" />
                </Button>
            </div>
            <div className="p-4 max-h-48 overflow-y-auto">
                <div className="mb-4">
                    <h4 className="text-sm font-bold text-red-700 mb-2">必須填寫</h4>
                    <div className="flex flex-wrap gap-2">
                        {hardMissing.map(item => (
                            <Button
                                key={item}
                                size="sm"
                                onClick={() => onJumpToField(item)}
                                className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 h-auto font-normal shadow-none border-0"
                            >
                                {item}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-4 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
                <Button onClick={onClose} variant="secondary">
                    返回修改
                </Button>
            </div>
        </div>
    );
};

export default ValidationWarningPanel;
