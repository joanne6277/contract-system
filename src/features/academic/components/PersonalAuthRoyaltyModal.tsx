import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { PersonalAuthRoyaltyScheme, RoyaltySplit } from '../types';

// --- Helper Functions ---
const getInitialRoyaltySplit = (): RoyaltySplit => ({
    id: `rs-${Date.now()}-${Math.random()}`,
    beneficiary: '',
    percentage: '',
});

const getInitialScheme = (): PersonalAuthRoyaltyScheme => ({
    id: `pars-${Date.now()}-${Math.random()}`,
    startDate: '',
    endDate: '',
    royaltySplits: [getInitialRoyaltySplit()],
});

// --- Props ---
interface PersonalAuthRoyaltyModalProps {
    isOpen: boolean;
    onClose: () => void;
    royaltyInfo: PersonalAuthRoyaltyScheme[];
    onSave: (data: PersonalAuthRoyaltyScheme[]) => void;
}

// --- Component ---
const PersonalAuthRoyaltyModal: React.FC<PersonalAuthRoyaltyModalProps> = ({
    isOpen,
    onClose,
    royaltyInfo,
    onSave,
}) => {
    const [tempData, setTempData] = useState<PersonalAuthRoyaltyScheme[]>([]);
    const [collapsedSchemes, setCollapsedSchemes] = useState<Set<string>>(new Set());

    // Sync tempData when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setTempData(JSON.parse(JSON.stringify(royaltyInfo)));
            setCollapsedSchemes(new Set());
        }
    }, [isOpen, royaltyInfo]);

    // --- Collapse toggling ---
    const toggleSchemeCollapse = (id: string) => {
        setCollapsedSchemes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    // --- CRUD for Scheme ---
    const addScheme = () => setTempData(prev => [...prev, getInitialScheme()]);
    const removeScheme = (idx: number) => setTempData(prev => prev.filter((_, i) => i !== idx));

    // --- CRUD for RoyaltySplit ---
    const addRoyaltySplit = (schemeIndex: number) => {
        setTempData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            newData[schemeIndex].royaltySplits.push(getInitialRoyaltySplit());
            return newData;
        });
    };
    const removeRoyaltySplit = (schemeIndex: number, splitIndex: number) => {
        setTempData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            newData[schemeIndex].royaltySplits = newData[schemeIndex].royaltySplits.filter((_: any, i: number) => i !== splitIndex);
            return newData;
        });
    };

    // --- Update path ---
    const updatePath = (path: string, value: unknown) => {
        setTempData(prev => {
            const keys = path.split('.');
            const newData = JSON.parse(JSON.stringify(prev));
            let target: any = newData;
            for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
            target[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const handleSave = () => {
        onSave(tempData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="編輯權利金比例（個人授權）"
            size="full"
            footer={
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="secondary" onClick={onClose}>取消</Button>
                    <Button onClick={handleSave}>儲存權利金</Button>
                </div>
            }
        >
            <div className="space-y-6">
                <p className="text-sm text-gray-500">個人授權的權利金比例以「日期方案 + 分潤明細」為結構，不包含卷期規則。</p>

                {(tempData || []).map((scheme, sIndex) => (
                    <div key={scheme.id} className="border-2 border-indigo-200 rounded-xl overflow-hidden bg-indigo-50/30">
                        {/* Scheme Header */}
                        <div
                            className="flex justify-between items-center px-5 py-3 bg-indigo-100/60 cursor-pointer select-none"
                            onClick={() => toggleSchemeCollapse(scheme.id)}
                        >
                            <div className="flex items-center gap-3">
                                {collapsedSchemes.has(scheme.id) ? <ChevronDown size={18} className="text-indigo-600" /> : <ChevronUp size={18} className="text-indigo-600" />}
                                <h4 className="font-semibold text-indigo-700 text-base">
                                    日期方案 #{sIndex + 1}
                                    {scheme.startDate && scheme.endDate && (
                                        <span className="ml-3 text-sm font-normal text-indigo-500">
                                            ({scheme.startDate} ~ {scheme.endDate})
                                        </span>
                                    )}
                                </h4>
                            </div>
                            {tempData.length > 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeScheme(sIndex); }}
                                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                >
                                    移除此方案
                                </button>
                            )}
                        </div>

                        {/* Scheme Body */}
                        {!collapsedSchemes.has(scheme.id) && (
                            <div className="p-5 space-y-5">
                                {/* Date Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">起始日期</label>
                                        <input type="date" value={scheme.startDate}
                                            onChange={e => updatePath(`${sIndex}.startDate`, e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">結束日期</label>
                                        <input type="date" value={scheme.endDate}
                                            onChange={e => updatePath(`${sIndex}.endDate`, e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                </div>

                                {/* Royalty Splits */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-600">分潤明細</label>
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        {/* Table header */}
                                        <div className="grid grid-cols-[1fr_120px_40px] gap-3 mb-2 px-1">
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">分潤主體</span>
                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">比例 (%)</span>
                                            <span></span>
                                        </div>
                                        {/* Split rows */}
                                        {scheme.royaltySplits.map((split, splitIndex) => (
                                            <div key={split.id} className="grid grid-cols-[1fr_120px_40px] gap-3 items-center mb-2">
                                                <input
                                                    type="text"
                                                    value={split.beneficiary}
                                                    onChange={e => updatePath(`${sIndex}.royaltySplits.${splitIndex}.beneficiary`, e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                    placeholder="輸入分潤主體"
                                                />
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={split.percentage}
                                                        onChange={e => updatePath(`${sIndex}.royaltySplits.${splitIndex}.percentage`, e.target.value)}
                                                        className="w-full p-2 border border-gray-300 rounded-md pr-7 text-sm"
                                                        placeholder="0"
                                                    />
                                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 pointer-events-none">%</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeRoyaltySplit(sIndex, splitIndex)}
                                                    className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors flex justify-center"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {/* Add split */}
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            <button
                                                type="button"
                                                onClick={() => addRoyaltySplit(sIndex)}
                                                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                                            >
                                                <Plus size={16} />新增分潤明細
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Add Scheme */}
                <button
                    onClick={addScheme}
                    className="w-full py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 font-semibold border-2 border-dashed border-green-300 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={18} />新增日期方案
                </button>
            </div>
        </Modal>
    );
};

export default PersonalAuthRoyaltyModal;
