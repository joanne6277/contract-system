import React, { useState, useRef, useEffect } from 'react';
import { useBatch } from '../context/BatchContext';
import { getAcademicFieldValue, fieldKeyToNameMap as academicFieldMap, orderedFieldKeys as academicOrderedKeys } from '@/features/academic/constants/contractFields';
import { getTuFuFieldValue, fieldKeyToNameMap as dddFieldMap, orderedFieldKeys as dddOrderedKeys } from '@/features/ddd/constants/contractFields';
import { FileText, X, Download, RotateCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import ExcelJS from 'exceljs';
import { BatchMaintainModal } from './BatchMaintainModal';

export const BatchCart: React.FC = () => {
    const { selectionCount, clearSelection, selectedItems, toggleItem } = useBatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isMaintainModalOpen, setIsMaintainModalOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleExport = async () => {
        const workbook = new ExcelJS.Workbook();

        // Group items by type
        const academicItems = Array.from(selectedItems.values()).filter(item => item.type === 'academic');
        const dddItems = Array.from(selectedItems.values()).filter(item => item.type === 'ddd');
        // Handle items without type (legacy or fallback)
        const unknownItems = Array.from(selectedItems.values()).filter(item => !item.type);

        // Function to create sheet
        const createSheet = (sheetName: string, items: any[], fieldMap: { [key: string]: string }, getValue: (obj: any, path: string) => any, orderedKeys: string[]) => {
            const worksheet = workbook.addWorksheet(sheetName);

            // Define columns from orderedKeys
            const columns = [
                { header: 'ID', key: 'id', width: 20 },
                ...orderedKeys.map(key => ({
                    header: fieldMap[key],
                    key: key,
                    width: 20
                }))
            ];
            worksheet.columns = columns;

            // Add rows
            items.forEach(item => {
                if (!item.data) {
                    // Fallback if data is missing
                    worksheet.addRow({ id: item.id, label: item.label });
                    return;
                }

                const rowData: any = { id: item.id };
                orderedKeys.forEach(key => {
                    const value = getValue(item.data, key);
                    // Format arrays or objects if needed
                    if (Array.isArray(value)) {
                        rowData[key] = value.join(', ');
                    } else if (typeof value === 'object' && value !== null) {
                        rowData[key] = JSON.stringify(value);
                    } else {
                        rowData[key] = value;
                    }
                });
                worksheet.addRow(rowData);
            });
        };

        // Create Academic Sheet
        if (academicItems.length > 0) {
            createSheet('Academic Contracts', academicItems, academicFieldMap, getAcademicFieldValue, academicOrderedKeys);
        }

        // Create DDD Sheet
        if (dddItems.length > 0) {
            createSheet('DDD Contracts', dddItems, dddFieldMap, getTuFuFieldValue, dddOrderedKeys);
        }

        // Create Basic Sheet for unknown types
        if (unknownItems.length > 0) {
            const worksheet = workbook.addWorksheet('Other Items');
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 20 },
                { header: 'Label', key: 'label', width: 40 }
            ];
            unknownItems.forEach(item => {
                worksheet.addRow({ id: item.id, label: item.label });
            });
        }

        // Write to buffer and trigger download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `batch_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        anchor.click();
        window.URL.revokeObjectURL(url);

        setIsOpen(false);
    };

    const handleBatchMaintain = () => {
        setIsMaintainModalOpen(true);
        setIsOpen(false);
    };

    const handleClear = () => {
        clearSelection();
        setIsOpen(false);
    };

    const handleRemoveItem = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        toggleItem(id);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Icon - Made smaller (p-1) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors relative"
            >
                <div className="relative">
                    <FileText className="h-6 w-6" />
                    {selectionCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] flex items-center justify-center border-2 border-white">
                            {selectionCount}
                        </span>
                    )}
                </div>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
                        <span className="font-semibold text-gray-800">批次清單</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto p-4 custom-scrollbar">
                        {selectionCount > 0 ? (
                            <ul className="space-y-2">
                                {Array.from(selectedItems.values()).map((item) => (
                                    <li key={item.id} className="group flex justify-between items-center text-gray-600 text-sm py-2 px-3 border border-transparent hover:border-gray-200 hover:bg-gray-50 rounded transition-all">
                                        <span className="truncate pr-2" title={item.label || item.id}>
                                            {item.label || item.id}
                                        </span>
                                        <button
                                            onClick={(e) => handleRemoveItem(item.id, e)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                            title="移除此項目"
                                        >
                                            <X size={14} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                尚未選取任何項目
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50/30">
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                                onClick={handleExport}
                                disabled={selectionCount === 0}
                            >
                                <Download size={16} className="mr-2" />
                                匯出
                            </Button>
                            <Button
                                variant="secondary"
                                className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700"
                                onClick={handleBatchMaintain}
                                disabled={selectionCount === 0}
                            >
                                <RotateCw size={16} className="mr-2" />
                                維護
                            </Button>
                        </div>
                        <Button
                            className="w-full bg-red-500 hover:bg-red-600 text-white border-none shadow-sm h-11"
                            onClick={handleClear}
                            disabled={selectionCount === 0}
                        >
                            <Trash2 size={16} className="mr-2" />
                            全部清除
                        </Button>
                    </div>
                </div>
            )}

            {/* Batch Maintain Modal */}
            <BatchMaintainModal
                isOpen={isMaintainModalOpen}
                onClose={() => setIsMaintainModalOpen(false)}
            />
        </div>
    );
};
