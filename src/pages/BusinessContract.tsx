import React, { useRef, useEffect, useState } from 'react';
import { Upload, Save } from 'lucide-react';
import { FloatingTOC, TagInput } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { useParams } from 'react-router-dom';
import { mockBusinessContracts } from '@/data/mockBusinessContracts';

// 引入業務部設定檔
import { tocSections, businessFieldConfig, businessValidationRules, fieldKeyToNameMap } from '@/features/business';

// 引入型別
import type { BusinessContractData, BusinessFormFieldConfig, MaintenanceRecord, ChangeDetail } from '@/features/business/types';
// 引入自定義 Hook
import { useContractForm } from '@/shared/hooks';
import { useFormValidation } from '@/shared/hooks/useFormValidation';
import { ValidationWarningPanel } from '@/components/common';

// --- 1. 初始資料 ---
const getInitialFormData = (): BusinessContractData => ({
    contractType: 'business_standard',
    basicInfo: {
        managementNo: '',
        contractNo: '',
        salesperson: '',
        clientName: '',
        purchasingYear: new Date().getFullYear().toString(),
        type: []
    },
    purchaseContent: {
        isBuyout: '否',
        mode: '',
        contractStartDate: '',
        contractEndDate: '',
        attribute: '',
        productName: [],
        amount: '',
        remarks: ''
    },
    scanFile: null,
    maintenanceHistory: []
});

// --- 2. FormField 元件 ---
// ... (FormField component remains the same, I'll skip re-writing it in the tool call if possible, but the instruction says 'complete content' for write_file, wait, I'm using replace)
// I will include the FormField to be safe.
interface FormFieldProps {
    field: BusinessFormFieldConfig;
    path: string;
    value: unknown;
    onChange: (path: string, value: any) => void;
    isRequired?: boolean;
    disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ field, path, value, onChange, isRequired, disabled }) => {
    const { id, label, type, options, placeholder } = field;
    const renderLabel = () => (
        <label htmlFor={id} className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
            {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
    );

    const inputClassName = `w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : ''}`;

    switch (type) {
        case 'text':
            return (
                <div>
                    {renderLabel()}
                    <input
                        id={id}
                        type="text"
                        value={value as string || ''}
                        onChange={(e) => onChange(path, e.target.value)}
                        className={inputClassName}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                </div>
            );
        case 'date':
            return (
                <div>
                    {renderLabel()}
                    <input
                        id={id}
                        type="date"
                        value={value as string || ''}
                        onChange={(e) => onChange(path, e.target.value)}
                        className={inputClassName}
                        disabled={disabled}
                    />
                </div>
            );
        case 'radio':
            return (
                <div>
                    {renderLabel()}
                    <div className="flex items-center space-x-4 pt-2">
                        {options?.map((opt) => (
                            <label key={opt} className={`flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                <input
                                    type="radio"
                                    name={id}
                                    value={opt}
                                    checked={value === opt}
                                    onChange={(e) => onChange(path, e.target.value)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    disabled={disabled}
                                />
                                <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        case 'select':
            return (
                <div>
                    {renderLabel()}
                    <select
                        id={id}
                        value={value as string || ''}
                        onChange={(e) => onChange(path, e.target.value)}
                        className={inputClassName}
                        disabled={disabled}
                    >
                        <option value="">請選擇</option>
                        {options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            );
        case 'textarea':
            return (
                <div>
                    {renderLabel()}
                    <textarea
                        id={id}
                        value={value as string || ''}
                        onChange={(e) => onChange(path, e.target.value)}
                        rows={4}
                        className={inputClassName}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                </div>
            );
        case 'tags':
            return (
                <div>
                    {renderLabel()}
                    <TagInput value={value as string[]} onChange={(tags) => onChange(path, tags)} placeholder={placeholder} />
                </div>
            );
        case 'checkbox':
            const checkboxValues = (value as string[]) || [];
            return (
                <div>
                    {renderLabel()}
                    <div className="flex items-center space-x-4 pt-2">
                        {options?.map((opt) => (
                            <label key={opt} className={`flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                <input
                                    type="checkbox"
                                    checked={checkboxValues.includes(opt)}
                                    onChange={(e) => {
                                        const newValues = e.target.checked
                                            ? [...checkboxValues, opt]
                                            : checkboxValues.filter((v) => v !== opt);
                                        onChange(path, newValues);
                                    }}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    disabled={disabled}
                                />
                                <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        case 'select-multiple':
            // 模擬從參數讀取的產品項目
            const productOptions = ['CEPS', 'CETD', 'SYMSKAN', 'ABC', 'PRO', 'AL', 'AE', 'CEPS生醫'];
            const selectedValues = (value as string[]) || [];

            return (
                <div className="lg:col-span-3">
                    {renderLabel()}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-5 border border-gray-200 rounded-xl bg-gray-50/50 shadow-sm">
                        {productOptions.map((opt) => (
                            <label key={opt} className={`flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-white transition-all cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}>
                                <input
                                    type="checkbox"
                                    checked={selectedValues.includes(opt)}
                                    disabled={disabled}
                                    onChange={(e) => {
                                        const newValues = e.target.checked
                                            ? [...selectedValues, opt]
                                            : selectedValues.filter((v) => v !== opt);
                                        onChange(path, newValues);
                                    }}
                                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition-colors"
                                />
                                <span className="text-sm font-medium text-gray-700">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        default:
            return null;
    }
};

// --- 3. 主元件 ---
const BusinessContract: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const {
        formData,
        setFormData,
        message,
        showMessage,
        handleDynamicFormChange,
        getFieldValue,
        getFileName
    } = useContractForm<BusinessContractData>(getInitialFormData());

    const [originalData, setOriginalData] = useState<BusinessContractData | null>(null);

    // Load data for Edit Mode
    useEffect(() => {
        if (id) {
            const foundContract = mockBusinessContracts.find(c => c.id === id);
            if (foundContract) {
                const loadedData = JSON.parse(JSON.stringify(foundContract));
                setFormData(loadedData);
                setOriginalData(JSON.parse(JSON.stringify(foundContract)));
            } else {
                showMessage('找不到指定的業務合約資料', 'error');
            }
        }
    }, [id, setFormData, showMessage]);

    const {
        validationErrors,
        isValidationPanelVisible,
        setIsValidationPanelVisible,
        handleValidation,
        isFieldRequired
    } = useFormValidation(formData, businessValidationRules, fieldKeyToNameMap, getFieldValue);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleDynamicFormChange('scanFile', e.target.files[0]);
        }
    };

    const handleTocJump = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleJumpToField = (fieldTitle: string) => {
        const fieldKey = Object.keys(fieldKeyToNameMap).find(key => fieldKeyToNameMap[key] === fieldTitle);
        if (!fieldKey) return;
        const lastPart = fieldKey.split('.').pop();
        if (!lastPart) return;

        const element = document.getElementById(lastPart);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-offset-2', 'ring-blue-500', 'transition-all', 'duration-300');
            setTimeout(() => { element.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500'); }, 2500);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!handleValidation()) {
            showMessage('請檢查必填欄位。', 'error');
            return;
        }

        // --- 產生維護紀錄 ---
        const now = new Date();
        const timestamp = now.getFullYear() + '-' + 
            String(now.getMonth() + 1).padStart(2, '0') + '-' + 
            String(now.getDate()).padStart(2, '0') + ' ' + 
            String(now.getHours()).padStart(2, '0') + ':' + 
            String(now.getMinutes()).padStart(2, '0') + ':' + 
            String(now.getSeconds()).padStart(2, '0');

        const newRecord: MaintenanceRecord = {
            timestamp,
            userId: 'Current_User_ID', // 實際應從 AuthContext 取得
            userName: '當前使用者',
            changes: []
        };

        if (!isEditMode) {
            newRecord.changes.push({
                field: '合約建檔',
                oldValue: null,
                newValue: '初始資料建檔'
            });
        } else if (originalData) {
            // 比較變更
            Object.keys(fieldKeyToNameMap).forEach(path => {
                const oldValue = getFieldValue(originalData, path);
                const newValue = getFieldValue(formData, path);
                
                // 簡單比較，對於陣列(如產品項目)需要特殊處理
                const isDifferent = Array.isArray(oldValue) 
                    ? JSON.stringify([...oldValue].sort()) !== JSON.stringify([...(newValue || [])].sort())
                    : oldValue !== newValue;

                if (isDifferent) {
                    newRecord.changes.push({
                        field: fieldKeyToNameMap[path],
                        oldValue: oldValue === null || oldValue === undefined || oldValue === '' ? '(無)' : String(oldValue),
                        newValue: newValue === null || newValue === undefined || newValue === '' ? '(無)' : String(newValue)
                    });
                }
            });
        }

        const updatedFormData = {
            ...formData,
            maintenanceHistory: [newRecord, ...(formData.maintenanceHistory || [])]
        };

        console.log('Business Contract Submitting with History:', updatedFormData);
        showMessage(isEditMode ? '業務合約資料已更新，並留下修改紀錄！' : '業務合約資料已儲存，並建立初始紀錄！');
        
        // 如果是編輯模式，更新 originalData 避免重複觸發
        if (isEditMode) {
            setOriginalData(JSON.parse(JSON.stringify(updatedFormData)));
            setFormData(updatedFormData);
        }
    };

    return (
        <div className="relative">
            <FloatingTOC onJump={handleTocJump} sections={tocSections} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
                    <div className="p-6 border-b border-orange-100 bg-orange-50/50">
                        <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? '維護業務合約' : '新增業務合約'}</h2>
                        <p className="text-sm text-gray-500 mt-1">請填寫下方合約資訊，標註星號為必填項目。</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    {tocSections.map(section => {
                        if (section.id === 'scan-file') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <div className="flex items-center gap-4">
                                        <Button variant="secondary" type="button" onClick={() => fileInputRef.current?.click()}>
                                            <Upload size={16} className="mr-2" /> 選擇檔案
                                        </Button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                        <span className="text-sm text-gray-600">{getFileName(formData.scanFile)}</span>
                                    </div>
                                </div>
                            );
                        }

                        if (section.id === 'remarks') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <textarea
                                        value={formData.purchaseContent.remarks}
                                        onChange={(e) => handleDynamicFormChange('purchaseContent.remarks', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        placeholder="請輸入備註資訊..."
                                    />
                                </div>
                            );
                        }

                        const fields = businessFieldConfig[section.id];
                        const dataKey = section.id.replace(/-(\w)/g, (_, c) => c.toUpperCase());

                        return (
                            <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {fields?.map(field => {
                                        // 檢查顯示條件
                                        if (field.condition && !field.condition(formData)) {
                                            return null;
                                        }

                                        const path = `${dataKey}.${field.id}`;
                                        const value = getFieldValue(formData, path);
                                        const isDisabled = field.disabledCondition ? field.disabledCondition(formData) : false;

                                        return (
                                            <div key={field.id} className={field.fullWidth ? 'lg:col-span-3' : ''}>
                                                <FormField
                                                    field={field}
                                                    path={path}
                                                    value={value}
                                                    onChange={handleDynamicFormChange}
                                                    isRequired={isFieldRequired(path)}
                                                    disabled={isDisabled}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-end gap-4 mt-8">
                        <Button variant="secondary" type="button" onClick={() => window.history.back()}>取消</Button>
                        <Button type="submit"><Save size={18} className="mr-2" /> 儲存合約</Button>
                    </div>
                </form>
            </div>

            {message.show && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-[100] ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {message.text}
                </div>
            )}

            <ValidationWarningPanel
                isVisible={isValidationPanelVisible}
                hardMissing={validationErrors.hard}
                onJumpToField={handleJumpToField}
                onClose={() => setIsValidationPanelVisible(false)}
            />
        </div>
    );
};

export default BusinessContract;
