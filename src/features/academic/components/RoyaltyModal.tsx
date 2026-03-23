import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import type { DateScheme, VolumeRule, VolumeIdentifier, RoyaltySplit } from '../types';

// --- Helper Functions ---
const getInitialRoyaltySplit = (): RoyaltySplit => ({
    id: `rs-${Date.now()}-${Math.random()}`,
    beneficiary: '',
    percentage: '',
});

const getInitialVolumeIdentifier = (): VolumeIdentifier => ({
    format: 'volume_issue', volume: '', issue: '', year: '', month: '', description: ''
});

const getInitialVolumeRule = (): VolumeRule => ({
    id: `vr-${Date.now()}-${Math.random()}`,
    startVolumeInfo: getInitialVolumeIdentifier(),
    endVolumeInfo: getInitialVolumeIdentifier(),
    royaltySplits: [getInitialRoyaltySplit()],
});

const getInitialDateScheme = (): DateScheme => ({
    id: `ds-${Date.now()}-${Math.random()}`,
    startDate: '',
    endDate: '',
    volumeRules: [getInitialVolumeRule()],
});

// --- Props ---
interface RoyaltyModalProps {
    isOpen: boolean;
    onClose: () => void;
    royaltyInfo: DateScheme[];
    onSave: (data: DateScheme[]) => void;
    contractParties: string[];
}

// --- Component ---
const RoyaltyModal: React.FC<RoyaltyModalProps> = ({
    isOpen,
    onClose,
    royaltyInfo,
    onSave,
    contractParties,
}) => {
    const [tempData, setTempData] = useState<DateScheme[]>([]);
    const [collapsedSchemes, setCollapsedSchemes] = useState<Set<string>>(new Set());

    // Sync tempData when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setTempData(JSON.parse(JSON.stringify(royaltyInfo)));
            setCollapsedSchemes(new Set());
        }
    }, [isOpen, royaltyInfo]);

    // --- Deep path updater ---
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

    // --- Collapse toggling ---
    const toggleSchemeCollapse = (id: string) => {
        setCollapsedSchemes(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    // --- CRUD for DateScheme ---
    const addDateScheme = () => setTempData(prev => [...prev, getInitialDateScheme()]);
    const removeDateScheme = (idx: number) => setTempData(prev => prev.filter((_, i) => i !== idx));

    // --- CRUD for VolumeRule ---
    const addVolumeRule = (schemeIndex: number) => {
        setTempData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            newData[schemeIndex].volumeRules.push(getInitialVolumeRule());
            return newData;
        });
    };
    const removeVolumeRule = (schemeIndex: number, ruleIndex: number) => {
        setTempData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            newData[schemeIndex].volumeRules = newData[schemeIndex].volumeRules.filter((_: any, i: number) => i !== ruleIndex);
            return newData;
        });
    };

    // --- CRUD for RoyaltySplit ---
    const addRoyaltySplit = (schemeIndex: number, ruleIndex: number) => {
        setTempData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            newData[schemeIndex].volumeRules[ruleIndex].royaltySplits.push(getInitialRoyaltySplit());
            return newData;
        });
    };
    const removeRoyaltySplit = (schemeIndex: number, ruleIndex: number, splitIndex: number) => {
        setTempData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            newData[schemeIndex].volumeRules[ruleIndex].royaltySplits =
                newData[schemeIndex].volumeRules[ruleIndex].royaltySplits.filter((_: any, i: number) => i !== splitIndex);
            return newData;
        });
    };

    // --- Format sync: when start format changes, auto-sync end format ---
    const handleStartFormatChange = (schemeIndex: number, ruleIndex: number, newFormat: string) => {
        setTempData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            newData[schemeIndex].volumeRules[ruleIndex].startVolumeInfo.format = newFormat;
            newData[schemeIndex].volumeRules[ruleIndex].endVolumeInfo.format = newFormat;
            return newData;
        });
    };



    // --- Volume input renderer ---
    const renderVolumeInputs = (basePath: string, volumeInfo: VolumeIdentifier, isStart: boolean, schemeIndex?: number, ruleIndex?: number) => {
        const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            if (isStart && schemeIndex !== undefined && ruleIndex !== undefined) {
                handleStartFormatChange(schemeIndex, ruleIndex, e.target.value);
            } else {
                updatePath(`${basePath}.format`, e.target.value);
            }
        };

        return (
            <div className="space-y-2">
                <select
                    value={volumeInfo.format}
                    onChange={handleFormatChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                    <option value="volume_issue">卷/期</option>
                    <option value="year_month">年/月</option>
                    <option value="text">文字描述</option>
                </select>

                {volumeInfo.format === 'volume_issue' && (
                    <div className="flex gap-2">
                        <input type="text" placeholder="卷" value={volumeInfo.volume}
                            onChange={e => updatePath(`${basePath}.volume`, e.target.value)}
                            className="w-1/2 p-2 border border-gray-300 rounded-md text-sm" />
                        <input type="text" placeholder="期" value={volumeInfo.issue}
                            onChange={e => updatePath(`${basePath}.issue`, e.target.value)}
                            className="w-1/2 p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                )}
                {volumeInfo.format === 'year_month' && (
                    <div className="flex gap-2">
                        <input type="text" placeholder="年" value={volumeInfo.year}
                            onChange={e => updatePath(`${basePath}.year`, e.target.value)}
                            className="w-1/2 p-2 border border-gray-300 rounded-md text-sm" />
                        <input type="text" placeholder="月" value={volumeInfo.month}
                            onChange={e => updatePath(`${basePath}.month`, e.target.value)}
                            className="w-1/2 p-2 border border-gray-300 rounded-md text-sm" />
                    </div>
                )}
                {volumeInfo.format === 'text' && (
                    <input type="text" placeholder="描述" value={volumeInfo.description}
                        onChange={e => updatePath(`${basePath}.description`, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm" />
                )}
            </div>
        );
    };

    const handleSave = () => {
        onSave(tempData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="編輯權利金比例"
            size="full"
            footer={
                <div className="flex justify-end gap-3 w-full">
                    <Button variant="secondary" onClick={onClose}>取消</Button>
                    <Button onClick={handleSave}>儲存權利金</Button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Datalist for beneficiary autocomplete */}
                <datalist id="beneficiary-list">
                    {(contractParties || []).map(rep => (
                        <option key={rep} value={rep} />
                    ))}
                </datalist>

                {(tempData || []).map((scheme, sIndex) => (
                    <div key={scheme.id} className="border-2 border-indigo-200 rounded-xl overflow-hidden bg-indigo-50/30">
                        {/* DateScheme Header */}
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
                                    onClick={(e) => { e.stopPropagation(); removeDateScheme(sIndex); }}
                                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                >
                                    移除此方案
                                </button>
                            )}
                        </div>

                        {/* DateScheme Body */}
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

                                {/* VolumeRules */}
                                {scheme.volumeRules.map((rule, rIndex) => (
                                    <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <h5 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>
                                                卷期規則 #{rIndex + 1}
                                            </h5>
                                            {scheme.volumeRules.length > 1 && (
                                                <button onClick={() => removeVolumeRule(sIndex, rIndex)}
                                                    className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors">
                                                    移除此規則
                                                </button>
                                            )}
                                        </div>

                                        {/* Volume range */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">起始卷期</label>
                                                {renderVolumeInputs(
                                                    `${sIndex}.volumeRules.${rIndex}.startVolumeInfo`,
                                                    rule.startVolumeInfo,
                                                    true,
                                                    sIndex,
                                                    rIndex
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-1">結束卷期</label>
                                                {renderVolumeInputs(
                                                    `${sIndex}.volumeRules.${rIndex}.endVolumeInfo`,
                                                    rule.endVolumeInfo,
                                                    false
                                                )}
                                            </div>
                                        </div>

                                        {/* Royalty Splits - Table-like layout */}
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
                                                {rule.royaltySplits.map((split, splitIndex) => (
                                                    <div key={split.id} className="grid grid-cols-[1fr_120px_40px] gap-3 items-center mb-2">
                                                        <input
                                                            type="text"
                                                            list="beneficiary-list"
                                                            value={split.beneficiary}
                                                            onChange={e => updatePath(`${sIndex}.volumeRules.${rIndex}.royaltySplits.${splitIndex}.beneficiary`, e.target.value)}
                                                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                                                            placeholder="選擇或輸入主體"
                                                        />
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                value={split.percentage}
                                                                onChange={e => updatePath(`${sIndex}.volumeRules.${rIndex}.royaltySplits.${splitIndex}.percentage`, e.target.value)}
                                                                className="w-full p-2 border border-gray-300 rounded-md pr-7 text-sm"
                                                                placeholder="0"
                                                            />
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 pointer-events-none">%</span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRoyaltySplit(sIndex, rIndex, splitIndex)}
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
                                                        onClick={() => addRoyaltySplit(sIndex, rIndex)}
                                                        className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                                                    >
                                                        <Plus size={16} />新增分潤明細
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Volume Rule */}
                                <button
                                    onClick={() => addVolumeRule(sIndex)}
                                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                                >
                                    <Plus size={16} />新增卷期規則
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {/* Add Date Scheme */}
                <button
                    onClick={addDateScheme}
                    className="w-full py-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 font-semibold border-2 border-dashed border-green-300 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus size={18} />新增日期方案
                </button>
            </div>
        </Modal>
    );
};

export default RoyaltyModal;
