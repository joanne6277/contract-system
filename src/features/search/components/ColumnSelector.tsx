import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
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

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="篩選顯示欄位"
            size="lg"
            footer={
                <div className="flex justify-between items-center w-full">
                    <Button variant="secondary" onClick={handleReset}>恢復預設</Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}>取消</Button>
                        <Button onClick={handleApply}>套用</Button>
                    </div>
                </div>
            }
        >
            <div className="max-h-[60vh] overflow-y-auto space-y-6 scrollbar-thin">
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
        </Modal>
    );
};
