import React, { useState } from 'react';
import { RefreshCw, Trash2, ChevronDown, ChevronUp, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { RemittanceInfoItem, FormFieldConfig } from '../types';

interface RemittanceSectionProps {
    remittanceInfo: RemittanceInfoItem[];
    fieldConfig: FormFieldConfig[];
    onSync: () => void;
    onRemove: (id: string) => void;
    onFieldChange: (path: string, value: any) => void;
    getFieldValue: (obj: any, path: string) => any;
    formData: any;
    isFieldRequired?: (path: string) => boolean;
}

// Check how complete a remittance item's data is
const getCompletionStatus = (item: RemittanceInfoItem) => {
    const requiredFields: (keyof RemittanceInfoItem)[] = ['bankName', 'accountNumber', 'accountName', 'currency'];
    const filledCount = requiredFields.filter(f => item[f] && String(item[f]).trim() !== '').length;
    return { filled: filledCount, total: requiredFields.length, complete: filledCount === requiredFields.length };
};

// --- Inline FormField for remittance (simplified from main FormField) ---
const RemittanceFormField: React.FC<{
    field: FormFieldConfig;
    path: string;
    value: unknown;
    onChange: (path: string, value: any) => void;
}> = ({ field, path, value, onChange }) => {
    const { id, label, type, options, placeholder } = field;

    const renderLabel = () => (
        <label htmlFor={id.toString()} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
    );

    switch (type) {
        case 'text':
            return (
                <div>
                    {renderLabel()}
                    <input
                        id={id.toString()}
                        type="text"
                        value={value as string || ''}
                        onChange={e => onChange(path, e.target.value)}
                        className={field.isReadOnly
                            ? 'w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed'
                            : 'w-full px-4 py-2 border border-gray-300 rounded-lg'
                        }
                        placeholder={placeholder}
                        readOnly={!!field.isReadOnly}
                    />
                </div>
            );
        case 'radio':
            return (
                <div>
                    {renderLabel()}
                    <div className="flex items-center space-x-4 pt-1">
                        {(options as string[])?.map((opt: string) => (
                            <label key={opt} className="flex items-center cursor-pointer">
                                <input type="radio" name={`${path}-${id}`} value={opt} checked={value === opt}
                                    onChange={e => onChange(path, e.target.value)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300" />
                                <span className="ml-2 text-sm text-gray-700">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        case 'textarea':
            return (
                <div>
                    {renderLabel()}
                    <textarea
                        id={id.toString()}
                        value={value as string || ''}
                        onChange={e => onChange(path, e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder={placeholder}
                    />
                </div>
            );
        default:
            return null;
    }
};

const RemittanceSection: React.FC<RemittanceSectionProps> = ({
    remittanceInfo,
    fieldConfig,
    onSync,
    onRemove,
    onFieldChange,
    getFieldValue,
    formData,
}) => {
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

    const toggleCard = (id: string) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const expandAll = () => {
        setExpandedCards(new Set(remittanceInfo.map(i => i.id)));
    };

    const collapseAll = () => {
        setExpandedCards(new Set());
    };

    return (
        <div>
            {/* Header with sync button */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <Button onClick={onSync} variant="primary" size="sm">
                    <RefreshCw size={16} className="mr-2" /> 同步分潤主體
                </Button>
                {remittanceInfo.length > 0 && (
                    <div className="flex gap-2 ml-auto">
                        <button onClick={expandAll} className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
                            全部展開
                        </button>
                        <span className="text-gray-300">|</span>
                        <button onClick={collapseAll} className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
                            全部摺疊
                        </button>
                    </div>
                )}
            </div>

            {/* Empty state */}
            {remittanceInfo.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <Wallet size={48} className="text-gray-300 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-500 mb-2">尚無匯款資料</h4>
                    <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                        請先在「權利金比例」中設定分潤主體，<br />
                        再點擊上方「同步分潤主體」按鈕自動產生匯款欄位。
                    </p>
                </div>
            )}

            {/* Remittance Cards */}
            <div className="space-y-4">
                {remittanceInfo.map((item) => {
                    const isExpanded = expandedCards.has(item.id);
                    const status = getCompletionStatus(item);
                    const itemIndex = remittanceInfo.findIndex(f => f.id === item.id);

                    return (
                        <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                            {/* Card Header (always visible) */}
                            <div
                                className="flex items-center justify-between px-5 py-3 cursor-pointer select-none hover:bg-gray-50 transition-colors"
                                onClick={() => toggleCard(item.id)}
                            >
                                <div className="flex items-center gap-3">
                                    {isExpanded
                                        ? <ChevronUp size={18} className="text-gray-400" />
                                        : <ChevronDown size={18} className="text-gray-400" />
                                    }
                                    <span className="font-bold text-indigo-700 text-base">{item.beneficiary}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                                        {item.accountType}
                                    </span>
                                    {/* Completion badge */}
                                    {status.complete ? (
                                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 size={12} /> 資料完整
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                            <AlertCircle size={12} /> {status.filled}/{status.total} 已填寫
                                        </span>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => { e.stopPropagation(); onRemove(item.id); }}
                                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>

                            {/* Card Body (collapsible) */}
                            {isExpanded && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {fieldConfig.map((field) => {
                                            const path = `remittanceInfo.${itemIndex}.${field.id}`;
                                            const value = getFieldValue(formData, path);
                                            return (
                                                <div key={field.id as string} className={field.fullWidth ? 'lg:col-span-3' : ''}>
                                                    <RemittanceFormField
                                                        field={field}
                                                        path={path}
                                                        value={value}
                                                        onChange={onFieldChange}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RemittanceSection;
