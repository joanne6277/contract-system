import React, { useState, useEffect, useRef } from 'react';
import { X, Columns } from 'lucide-react';
import type { ColumnGroup } from '../types';

interface ColumnSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    visibleColumns: Set<string>;
    setVisibleColumns: (columns: Set<string>) => void;
    selectableColumns: ColumnGroup[];
    defaultVisible: string[];
    lockedColumn?: string; // 鎖定不可取消的欄位
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
    isOpen, onClose, visibleColumns, setVisibleColumns, selectableColumns, defaultVisible, lockedColumn
}) => {
    const [tempVisibleColumns, setTempVisibleColumns] = useState(new Set(visibleColumns));
    const checkboxRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

    useEffect(() => {
        setTempVisibleColumns(new Set(visibleColumns));
    }, [isOpen, visibleColumns]);

    const handleToggle = (columnId: string) => {
        if (columnId === lockedColumn) return;
        setTempVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(columnId)) {
                newSet.delete(columnId);
            } else {
                newSet.add(columnId);
            }
            return newSet;
        });
    };

    const handleToggleGroup = (columnsInGroup: { id: string; label: string }[]) => {
        const columnIds = columnsInGroup.map(c => c.id);
        const allSelected = columnIds.every(id => tempVisibleColumns.has(id));

        setTempVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (allSelected) {
                columnIds.forEach(id => {
                    if (id !== lockedColumn) {
                        newSet.delete(id);
                    }
                });
            } else {
                columnIds.forEach(id => newSet.add(id));
            }
            return newSet;
        });
    };

    const handleApply = () => {
        setVisibleColumns(tempVisibleColumns);
        onClose();
    };

    const handleReset = () => {
        setTempVisibleColumns(new Set(defaultVisible));
    };

    useEffect(() => {
        selectableColumns.forEach(group => {
            const groupColumnIds = group.columns.map(c => c.id);
            const areAllSelected = groupColumnIds.every(id => tempVisibleColumns.has(id));
            const areSomeSelected = groupColumnIds.some(id => tempVisibleColumns.has(id));
            const checkbox = checkboxRef.current[group.group];
            if (checkbox) {
                checkbox.checked = areAllSelected;
                checkbox.indeterminate = !areAllSelected && areSomeSelected;
            }
        });
    }, [tempVisibleColumns, selectableColumns]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black bg-opacity-60">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Columns size={20} /> 篩選顯示欄位
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X /></button>
                </div>
                <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
                    {selectableColumns.map(group => (
                        <div key={group.group}>
                            <div className="flex items-center mb-3">
                                <input
                                    type="checkbox"
                                    id={`group-select-${group.group}`}
                                    ref={el => { checkboxRef.current[group.group] = el; }}
                                    onChange={() => handleToggleGroup(group.columns)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                                />
                                <label htmlFor={`group-select-${group.group}`} className="font-semibold text-gray-700 cursor-pointer">
                                    {group.group}
                                </label>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-6">
                                {group.columns.map(col => {
                                    const isDisabled = col.id === lockedColumn;
                                    return (
                                        <label key={col.id} className={`flex items-center p-2 rounded-md ${isDisabled ? 'cursor-not-allowed opacity-70' : 'hover:bg-gray-50 cursor-pointer'}`}>
                                            <input
                                                type="checkbox"
                                                checked={tempVisibleColumns.has(col.id)}
                                                onChange={() => handleToggle(col.id)}
                                                disabled={isDisabled}
                                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:cursor-not-allowed"
                                            />
                                            <span className="ml-2 text-sm text-gray-800">{col.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                    <button onClick={handleReset} className="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                        恢復預設
                    </button>
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-4 py-2 border rounded-lg text-sm">取消</button>
                        <button onClick={handleApply} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">套用</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
