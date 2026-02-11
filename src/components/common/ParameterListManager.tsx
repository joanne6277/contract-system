import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ParameterListManagerProps {
    title: string;
    items: string[];
    newItem: string;
    setNewItem: (value: string) => void;
    onAdd: () => void;
    onRemove: (item: string) => void;
    placeholder?: string;
}

export const ParameterListManager: React.FC<ParameterListManagerProps> = ({
    title,
    items,
    newItem,
    setNewItem,
    onAdd,
    onRemove,
    placeholder = "請輸入項目名稱"
}) => {
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 p-6 bg-gray-50 border-b border-gray-100 flex items-center">
                {title}
            </h3>
            <div className="p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">新增項目</label>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                            placeholder={placeholder}
                        />
                        <Button
                            onClick={onAdd}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            <span>新增</span>
                        </Button>
                    </div>
                </div>

                <h4 className="text-base font-semibold text-gray-700 mb-3 mt-6">現有項目</h4>
                {items.length === 0 ? (
                    <p className="text-gray-500 italic py-2">目前沒有任何項目。</p>
                ) : (
                    <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        <ul className="divide-y divide-gray-100">
                            {items.map((item, index) => (
                                <li key={index} className="flex justify-between items-center py-3 group hover:bg-gray-50 px-2 rounded-md transition-colors">
                                    <span className="text-sm text-gray-800">{item}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemove(item)}
                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                                        title="移除"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
