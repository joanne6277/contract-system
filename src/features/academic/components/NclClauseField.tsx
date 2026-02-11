import React from 'react';
import { X, Plus } from 'lucide-react';
import { embargoTargets, embargoPeriods } from '../../../shared/constants';

interface NclClauseFieldProps {
    value: any;
    onChange: (field: string, value: any) => void;
}

export const NclClauseField: React.FC<NclClauseFieldProps> = ({ value, onChange }) => {
    const addRule = () => {
        const newRule = { id: `embargo-${Date.now()}`, target: embargoTargets[0], period: embargoPeriods[0] };
        const updatedRules = [...(value.nclClause_embargoRules || []), newRule];
        onChange('nclClause_embargoRules', updatedRules);
    };

    const removeRule = (id: string) => {
        const updatedRules = (value.nclClause_embargoRules || []).filter((rule: { id: string }) => rule.id !== id);
        onChange('nclClause_embargoRules', updatedRules);
    };

    const updateRule = (id: string, field: string, val: string) => {
        const updatedRules = (value.nclClause_embargoRules || []).map((rule: { id: string; target: string; period: string }) =>
            rule.id === id ? { ...rule, [field]: val } : rule
        );
        onChange('nclClause_embargoRules', updatedRules);
    };

    const handleDoNotListChange = (option: string) => {
        const currentValues = value.nclClause_doNotList || [];
        const newValues = currentValues.includes(option)
            ? currentValues.filter((item: string) => item !== option)
            : [...currentValues, option];
        onChange('nclClause_doNotList', newValues);
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-6">
                {['不上', 'Embargo'].map(opt => (
                    <label key={opt} className="flex items-center">
                        <input
                            type="radio"
                            name="nclClause_selectionType"
                            value={opt}
                            checked={value.nclClause_selectionType === opt}
                            onChange={e => onChange('nclClause_selectionType', e.target.value)}
                            className="h-4 w-4 text-indigo-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">{opt}</span>
                    </label>
                ))}
            </div>

            {value.nclClause_selectionType === '不上' && (
                <div className="pl-6 ml-2 border-l-2 border-gray-200 space-y-2">
                    {['第三方平台', '國家圖書館'].map(opt => (
                        <label key={opt} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={(value.nclClause_doNotList || []).includes(opt)}
                                onChange={() => handleDoNotListChange(opt)}
                                className="h-4 w-4"
                            />
                            <span className="ml-2 text-sm text-gray-700">{opt}</span>
                        </label>
                    ))}
                </div>
            )}

            {value.nclClause_selectionType === 'Embargo' && (
                <div className="pl-6 ml-2 border-l-2 border-gray-200 space-y-3">
                    {(value.nclClause_embargoRules || []).map((rule: { id: string; target: string; period: string }) => (
                        <div key={rule.id} className="flex items-center gap-2">
                            <select
                                value={rule.target}
                                onChange={e => updateRule(rule.id, 'target', e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="">選擇對象</option>
                                {embargoTargets.map((t: string) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <select
                                value={rule.period}
                                onChange={e => updateRule(rule.id, 'period', e.target.value)}
                                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="">選擇時間</option>
                                {embargoPeriods.map((p: string) => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <button type="button" onClick={() => removeRule(rule.id)} className="text-red-500 hover:text-red-700 p-1">
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addRule} className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                        <Plus size={16} />新增 Embargo 規則
                    </button>
                </div>
            )}
        </div>
    );
};

export default NclClauseField;
