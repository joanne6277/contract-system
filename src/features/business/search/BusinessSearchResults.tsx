/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Plus, FileText, Download, Filter, Columns, ChevronUp, ChevronDown, ArrowLeft, ArrowUpDown, X } from 'lucide-react';
import { useBatch } from '../../batch/context/BatchContext';
import { BatchSelectionCheckbox } from '../../batch/components/BatchSelectionCheckbox';
import { mockBusinessContracts } from '@/data/mockBusinessContracts';
import { Button } from '@/components/ui/Button';
import { 
    ColumnSelector, 
    CollapsibleSection,
    FilterTextInput,
    FilterSelect
} from '@/features/search/components';
import { columnConfig } from './constants';
import type { BusinessContract } from '../types';

// --- Helper Functions ---
const getFieldValue = (contract: BusinessContract, path: string): any => {
    const parts = path.split('.');
    let value: any = contract;
    for (const part of parts) {
        if (value && typeof value === 'object') {
            value = value[part];
        } else {
            return undefined;
        }
    }
    
    if (path === 'purchaseContent.contractPeriod') {
        return `${contract.purchaseContent.contractStartDate} ~ ${contract.purchaseContent.contractEndDate}`;
    }
    
    if (Array.isArray(value)) {
        return value.join(', ');
    }
    
    return value;
};

// --- 進階篩選抽屜 ---
interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeFilters: Record<string, any>;
    onFilterChange: (filters: Record<string, any>) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose, activeFilters, onFilterChange }) => {
    const handleFilterUpdate = (key: string, value: any) => {
        onFilterChange({ ...activeFilters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({});
    };

    return (
        <>
            <div 
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`} 
                onClick={onClose}
            ></div>
            
            <div 
                className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 w-80 shadow-2xl z-50 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Filter size={20} className="text-indigo-600" />
                        進階篩選
                    </h3>
                    <Button variant="ghost" size="sm" onClick={onClose}><X size={20} /></Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    <CollapsibleSection title="基本資料">
                        <div className="pt-2">
                            <FilterTextInput 
                                label="業務" 
                                value={activeFilters.salesperson || ''} 
                                onChange={(val) => handleFilterUpdate('salesperson', val)} 
                            />
                        </div>
                    </CollapsibleSection>

                    <CollapsibleSection title="採購內容">
                        <div className="space-y-4 pt-2">
                            <FilterSelect 
                                label="採購模式" 
                                value={activeFilters.mode || ''} 
                                options={['單家', '聯採']} 
                                onChange={(val) => handleFilterUpdate('mode', val)} 
                            />
                            <FilterTextInput 
                                label="屬性" 
                                value={activeFilters.attribute || ''} 
                                onChange={(val) => handleFilterUpdate('attribute', val)} 
                            />
                            <FilterTextInput 
                                label="採購項目" 
                                value={activeFilters.productName || ''} 
                                onChange={(val) => handleFilterUpdate('productName', val)} 
                            />
                        </div>
                    </CollapsibleSection>
                </div>

                <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex justify-between gap-3 backdrop-blur-sm">
                    <Button variant="secondary" onClick={clearFilters} className="w-full">清除全部</Button>
                    <Button variant="primary" onClick={onClose} className="w-full">完成</Button>
                </div>
            </div>
        </>
    );
};

const BusinessSearchResults: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSelected, selectMultiple, deselectMultiple } = useBatch();
    
    // 解析 URL Query Parameters
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword') || '';
    const dateMode = queryParams.get('dateMode') || 'effective';
    const startDate = queryParams.get('startDate') || '';
    const endDate = queryParams.get('endDate') || '';
    const rollbackDate = queryParams.get('rollbackDate') || '';

    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columnConfig.defaultVisible));
    const [displayedColumns, setDisplayedColumns] = useState<string[]>(columnConfig.defaultVisible);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isColumnSelectorOpen, setIsColumnSelectorOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [dragOverColId, setDragOverColId] = useState<string | null>(null);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // --- 拖曳相關邏輯 ---
    const handleDragStart = (e: React.DragEvent, position: number) => {
        dragItem.current = position;
    };

    const handleDragEnter = (e: React.DragEvent, position: number) => {
        dragOverItem.current = position;
        setDragOverColId(displayedColumns[position]);
    };

    const handleDrop = (e: React.DragEvent) => {
        if (dragItem.current === null || dragOverItem.current === null) return;
        const newDisplayedColumns = [...displayedColumns];
        const dragItemContent = newDisplayedColumns[dragItem.current];
        newDisplayedColumns.splice(dragItem.current, 1);
        newDisplayedColumns.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setDisplayedColumns(newDisplayedColumns);
        setDragOverColId(null);
    };

    const handleDragEnd = () => {
        setDragOverColId(null);
    };

    const filteredContracts = useMemo(() => {
        let results = [...mockBusinessContracts];

        if (keyword) {
            results = results.filter(c => 
                c.basicInfo.clientName.toLowerCase().includes(keyword.toLowerCase()) ||
                c.basicInfo.contractNo.toLowerCase().includes(keyword.toLowerCase()) ||
                c.basicInfo.salesperson.toLowerCase().includes(keyword.toLowerCase())
            );
        }
        if (startDate || endDate) {
            results = results.filter(c => {
                const contractStart = c.purchaseContent.contractStartDate;
                const contractEnd = c.purchaseContent.contractEndDate;
                const searchStart = startDate || '0000-00-00';
                const searchEnd = endDate || '9999-99-99';

                switch (dateMode) {
                    case 'starts': return contractStart >= searchStart && contractStart <= searchEnd;
                    case 'ends': return contractEnd >= searchStart && contractEnd <= searchEnd;
                    case 'effective': return contractStart <= searchEnd && contractEnd >= searchStart;
                    case 'within': return contractStart >= searchStart && contractEnd <= searchEnd;
                    default: return true;
                }
            });
        }

        if (activeFilters.salesperson) results = results.filter(c => c.basicInfo.salesperson.includes(activeFilters.salesperson));
        if (activeFilters.mode) results = results.filter(c => c.purchaseContent.mode === activeFilters.mode);
        if (activeFilters.attribute) results = results.filter(c => c.purchaseContent.attribute.includes(activeFilters.attribute));
        if (activeFilters.productName) results = results.filter(c => c.purchaseContent.productName.some(p => p.includes(activeFilters.productName)));

        if (sortConfig) {
            results.sort((a, b) => {
                const valA = getFieldValue(a, sortConfig.key);
                const valB = getFieldValue(b, sortConfig.key);
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return results;
    }, [keyword, dateMode, startDate, endDate, activeFilters, sortConfig]);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const allItems = filteredContracts
            .filter(c => c.id !== undefined)
            .map(c => ({
                id: c.id!,
                label: c.basicInfo.clientName || 'Unknown Contract',
                data: c,
                type: 'business' as any
            }));

        if (checked) {
            selectMultiple(allItems);
        } else {
            deselectMultiple(allItems.map(item => item.id));
        }
    };

    const allSelected = filteredContracts.length > 0 && filteredContracts.every(c => c.id && isSelected(c.id));
    const isIndeterminate = filteredContracts.some(c => c.id && isSelected(c.id)) && !allSelected;

    const columnsToRender = useMemo(() => {
        const allColMap = new Map(columnConfig.selectable.flatMap(g => g.columns).map(col => [col.id, col]));
        return displayedColumns.map(id => allColMap.get(id)).filter(Boolean) as { id: string, label: string }[];
    }, [displayedColumns]);

    const handleSetVisibleColumns = (newVisible: Set<string>) => {
        setVisibleColumns(newVisible);
        // 同步更新 displayedColumns，保留順序但過濾掉隱藏的，並加入新增的
        const newDisplayed = displayedColumns.filter(id => newVisible.has(id));
        const currentSet = new Set(newDisplayed);
        Array.from(newVisible).forEach(id => {
            if (!currentSet.has(id)) newDisplayed.push(id);
        });
        setDisplayedColumns(newDisplayed);
    };

    return (
        <div className="container mx-auto p-8 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">搜尋結果</h2>
                        <p className="text-sm text-gray-500 mt-1">找到 {filteredContracts.length} 筆合約</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => setIsFilterDrawerOpen(true)} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                            <Filter size={16} className="mr-2" />
                            進階篩選
                        </Button>
                        <Button variant="ghost" onClick={() => setIsColumnSelectorOpen(true)} className="border border-gray-200 text-gray-700 hover:bg-gray-50">
                            <Columns size={16} className="mr-2" />
                            篩選顯示欄位
                        </Button>
                        <Button variant="ghost" onClick={() => navigate('/business/search')} className="border border-gray-200 text-gray-700 hover:bg-gray-50">
                            返回搜尋
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left bg-gray-50 sticky left-0 z-10 w-12 border-r border-gray-200">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={allSelected}
                                        onChange={handleSelectAll}
                                        ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                                    />
                                </th>
                                {columnsToRender.map((col, index) => (
                                    <th 
                                        key={col.id} 
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnter={(e) => handleDragEnter(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-move transition-colors
                                            ${dragOverColId === col.id ? 'bg-indigo-100' : ''}`}
                                    >
                                        <button onClick={() => handleSort(col.id)} className="flex items-center gap-1 hover:text-gray-800 transition-colors">
                                            <span>{col.label}</span>
                                            {sortConfig?.key === col.id ? (
                                                sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                            ) : (
                                                <ArrowUpDown size={14} className="text-gray-300" />
                                            )}
                                        </button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredContracts.length > 0 ? (
                                filteredContracts.map(contract => (
                                    <tr 
                                        key={contract.id} 
                                        className={`${isSelected(contract.id!) ? 'bg-indigo-50' : ''} hover:bg-gray-50 transition-colors cursor-pointer`}
                                        onClick={() => navigate(`/business/maintain/${contract.id}`)}
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap sticky left-0 z-10 bg-inherit border-r border-gray-100" onClick={e => e.stopPropagation()}>
                                            <BatchSelectionCheckbox
                                                id={contract.id!}
                                                label={contract.basicInfo.clientName || 'Unknown Contract'}
                                                data={contract}
                                                type="business"
                                            />
                                        </td>
                                        {columnsToRender.map(col => (
                                            <td key={col.id} className={`px-4 py-3 whitespace-nowrap text-gray-600 transition-colors ${dragOverColId === col.id ? 'bg-indigo-50/50' : ''}`}>
                                                {col.id === 'basicInfo.clientName' ? (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/business/contract/detail/${contract.id}`);
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium text-left underline-offset-2 hover:underline"
                                                    >
                                                        {getFieldValue(contract, col.id) || '-'}
                                                    </button>
                                                ) : (
                                                    getFieldValue(contract, col.id) || '-'
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columnsToRender.length + 1} className="px-4 py-12 text-center text-gray-400">
                                        查無符合條件的合約
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <FilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} activeFilters={activeFilters} onFilterChange={setActiveFilters} />
            <ColumnSelector 
                isOpen={isColumnSelectorOpen} 
                onClose={() => setIsColumnSelectorOpen(false)} 
                visibleColumns={visibleColumns} 
                setVisibleColumns={handleSetVisibleColumns} 
                selectableColumns={columnConfig.selectable} 
                defaultVisible={columnConfig.defaultVisible} 
            />
        </div>
    );
};

export default BusinessSearchResults;
