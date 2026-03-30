import React, { useRef } from 'react';
import { Upload, Save } from 'lucide-react';
import { FloatingTOC, TagInput } from '@/components/common';
import { Button } from '@/components/ui/Button';

// 引入業務部設定檔
import { tocSections, businessFieldConfig, businessValidationRules, fieldKeyToNameMap } from '@/features/business';

// 引入型別
import type { BusinessContractData, BusinessFormFieldConfig } from '@/features/business/types';
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
        purchasingYear: new Date().getFullYear().toString()
    },
    purchaseContent: {
        mode: '',
        contractStartDate: '',
        contractEndDate: '',
        attribute: '',
        productName: [],
        amount: '',
        remarks: ''
    },
    scanFile: null
});

// --- 2. FormField 元件 ---
interface FormFieldProps {
    field: BusinessFormFieldConfig;
    path: string;
    value: unknown;
    onChange: (path: string, value: any) => void;
    isRequired?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ field, path, value, onChange, isRequired }) => {
    const { id, label, type, options, placeholder } = field;
    const renderLabel = () => (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
            {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
    );

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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={placeholder}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
            );
        case 'radio':
            return (
                <div>
                    {renderLabel()}
                    <div className="flex items-center space-x-4 pt-2">
                        {options?.map((opt) => (
                            <label key={opt} className="flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name={id}
                                    value={opt}
                                    checked={value === opt}
                                    onChange={(e) => onChange(path, e.target.value)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{opt}</span>
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder={placeholder}
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
        default:
            return null;
    }
};

// --- 3. 主元件 ---
const BusinessContract: React.FC = () => {
    const {
        formData,
        message,
        showMessage,
        handleDynamicFormChange,
        getFieldValue,
        getFileName
    } = useContractForm<BusinessContractData>(getInitialFormData());

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
        console.log('Business Contract Submitting:', formData);
        showMessage('業務合約資料已儲存！ (模擬)');
    };

    return (
        <div className="relative">
            <FloatingTOC onJump={handleTocJump} sections={tocSections} />

            <div className="max-w-7xl mx-auto">
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden">
                    <div className="p-6 border-b border-orange-100 bg-orange-50/50">
                        <h2 className="text-2xl font-bold text-gray-800">新增業務合約</h2>
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
                                        const path = `${dataKey}.${field.id}`;
                                        const value = getFieldValue(formData, path);
                                        return (
                                            <div key={field.id} className={field.fullWidth ? 'lg:col-span-3' : ''}>
                                                <FormField
                                                    field={field}
                                                    path={path}
                                                    value={value}
                                                    onChange={handleDynamicFormChange}
                                                    isRequired={isFieldRequired(path)}
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
