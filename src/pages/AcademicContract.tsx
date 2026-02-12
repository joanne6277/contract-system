
import React, { useState, useEffect, useRef } from 'react';
import { Upload, Save, Download } from 'lucide-react';
import { FloatingTOC, TagInput, CascadingSelect } from '@/components/common';
import { Button } from '@/components/ui/Button';

// 引入設定檔
import { tocSections, fieldConfig } from '@/features/academic/constants';
import { validationRules } from '@/features/academic/constants/validationRules';
import { fieldKeyToNameMap } from '@/features/academic/constants/contractFields';

// 引入型別
import type { ContractData, DateScheme, RemittanceInfoItem, VolumeIdentifier, FormFieldConfig } from '@/features/academic/types';
// 引入自定義 Hook
import { useContractForm } from '@/shared/hooks';
import { useFormValidation } from '@/shared/hooks/useFormValidation';
import { ValidationWarningPanel } from '@/components/common';
// 引入學發部專用元件
import { RoyaltyModal, RemittanceSection } from '@/features/academic/components';


// --- 1. 輔助函式與初始資料 (Helper Functions & Initial Data) ---
const getInitialVolumeIdentifier = (): VolumeIdentifier => ({ format: 'volume_issue', volume: '', issue: '', year: '', month: '', description: '' });

const getInitialDateScheme = (startDate: string = '', endDate: string = ''): DateScheme => ({
    id: `ds-${Date.now()}-${Math.random()}`,
    startDate,
    endDate,
    volumeRules: [{
        id: `vr-${Date.now()}-${Math.random()}`,
        startVolumeInfo: getInitialVolumeIdentifier(),
        endVolumeInfo: getInitialVolumeIdentifier(),
        royaltySplits: [{ id: `rs-${Date.now()}-${Math.random()}`, beneficiary: '', percentage: '' }],
    }],
});

const getInitialRemittanceInfoItem = (beneficiary: string): RemittanceInfoItem => ({
    id: `remit-${Date.now()}-${Math.random()}`,
    beneficiary: beneficiary,
    accountType: '國內',
    accountName: '',
    checkTitle: '',
    currency: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    accountNotes: '',
    taxId: '',
    idNumber: '',
    royaltySettlementMonth: '',
    paymentReceiptFlow: '',
});

const getInitialFormData = (): ContractData => {
    return {
        contractTarget: { publicationId: '', type: '', title: '', volumeInfo: '', issnIsbn: '' },
        registrationInfo: { managementNo: '', departmentNo: '', departmentSubNo: '', collector: '', asResponsible: '', isCurrent: '否', contractVersion: [], nonAiritiVersion: '' },
        basicInfo: { partyARep: '', partyBRep: '', contractParty: [], contractStartDate: '', contractEndDate: '', autoRenewYears: '', autoRenewFrequency: '', thereafter: '否', specialDateInfo: '' },
        rightsInfo: { authorizationFormMain: '', authorizationFormSub: '', paymentType: '有償', isOpenAccess: '無' },
        scopeInfo: { thirdPartyPlatform_tws: '上_TWS', thirdPartyPlatform_consent: [], discoverySystem_selectionType: '單選', discoverySystem_futurePlatforms: '含將來合作平台', discoverySystem_includeCN: '含CN', discoverySystem_platforms: [], discoverySystem_consent: [], comparisonSystem: '否', nclClause_selectionType: '不上', nclClause_doNotList: [], nclClause_embargoRules: [], listingLocation: '全球用戶', status_al_cn: '' },
        otherClauses: { usageRightsWarranty: '保證+甲方賠償', userRightsProtection: '否', terminationClause: '否', forceMajeure: '否', confidentiality: '否', noOaOnOwnWebsite: '否', legalIssueHandling: '雙方', manuscriptAgreementMention: '否', authorizationCopy: '否', damages_hasClause: '否', damages_description: '' },
        terminationInfo: { isTerminated: '否', terminationReason: '', terminationDate: '', terminationMethod: '' },
        royaltyInfo: [getInitialDateScheme()],
        remittanceInfo: [],
        remarks: '',
        scanFile: null
    };
};

// Define an interface for FormField props
interface FormFieldProps {
    field: FormFieldConfig;
    path: string;
    value: unknown;
    onChange: (path: string, value: any) => void;
    isRequired?: boolean;
}

// --- 2. FormField 元件 ---
// (此元件仍保留在頁面層級，因為它依賴具體的 UI Component)
const FormField: React.FC<FormFieldProps> = ({ field, path, value, onChange, isRequired }) => {
    const { id, label, type, options, placeholder, component: CustomComponent } = field;
    const renderLabel = () => <label htmlFor={id.toString()} className={`block text-sm font-medium text-gray-700 ${type !== 'textarea' ? 'mb-2' : ''}`}>{label} {isRequired && <span className="text-red-500 ml-1">*</span>}</label>;

    if (type === 'custom' && CustomComponent) {
        const handleChange = (fieldId: string, fieldValue: any) => {
            const parentPath = path.substring(0, path.lastIndexOf('.'));
            onChange(`${parentPath}.${fieldId}`, fieldValue);
        }
        return (
            <div>
                {renderLabel()}
                <CustomComponent value={value} onChange={handleChange} />
            </div>
        );
    }

    switch (type) {
        case 'text': return <div>{renderLabel()}<input id={id.toString()} type="text" value={value as string || ''} onChange={(e) => onChange(path, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder={placeholder} {...(field.isReadOnly ? { readOnly: true } : {})} /></div>;
        case 'date': return <div>{renderLabel()}<input id={id.toString()} type="date" value={value as string || ''} onChange={(e) => onChange(path, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>;
        case 'radio': return <div>{renderLabel()}<div className="flex items-center space-x-4 pt-2">{(options as string[])?.map((opt: string) => <label key={opt} className="flex items-center"><input type="radio" name={id.toString()} value={opt} checked={value === opt} onChange={(e) => onChange(path, e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" /><span className="ml-2 text-sm text-gray-700">{opt}</span></label>)}</div></div>;
        case 'select': return <div>{renderLabel()}<select id={id.toString()} value={value as string || ''} onChange={(e) => onChange(path, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="">請選擇</option>{(options as string[])?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}</select></div>;
        case 'textarea': return <div>{renderLabel()}<textarea id={id.toString()} value={value as string || ''} onChange={(e) => onChange(path, e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder={placeholder}></textarea></div>;
        case 'tags': return <div>{renderLabel()}<TagInput value={value as string[]} onChange={(tags) => onChange(path, tags)} placeholder={placeholder} /></div>;
        case 'cascading-select':
            const cascValue = value as { authorizationFormMain: string, authorizationFormSub: string };
            return (
                <div>
                    {renderLabel()}
                    <CascadingSelect
                        options={options as { [key: string]: string[] }}
                        value={{ main: cascValue?.authorizationFormMain, sub: cascValue?.authorizationFormSub }}
                        onChange={(field, val) => {
                            const parentPath = path.substring(0, path.lastIndexOf('.'));
                            const fieldKey = field === 'main' ? 'authorizationFormMain' : 'authorizationFormSub';
                            onChange(`${parentPath}.${fieldKey}`, val);
                        }}
                    />
                </div>
            );
        case 'group':
            const groupValue = value as { autoRenewYears: string, autoRenewFrequency: string };
            if (id === 'autoRenew') return (
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700">自動續約</span>
                        <input type="text" placeholder="年" value={(groupValue && groupValue.autoRenewYears) || ''} onChange={e => onChange(`${path.substring(0, path.lastIndexOf('.'))}.autoRenewYears`, e.target.value)} className="w-20 px-2 py-2 border border-gray-300 rounded-lg" />
                        <span className="text-gray-700">年，每</span>
                        <input type="text" placeholder="年" value={(groupValue && groupValue.autoRenewFrequency) || ''} onChange={e => onChange(`${path.substring(0, path.lastIndexOf('.'))}.autoRenewFrequency`, e.target.value)} className="w-20 px-2 py-2 border border-gray-300 rounded-lg" />
                        <span className="text-gray-700">續一次</span>
                    </div>
                </div>
            );
            return null;
        default: return null;
    }
};

// --- 3. 主元件 ---
const AcademicContract: React.FC = () => {
    // 使用自定義 Hook
    const {
        formData,
        setFormData,
        message,
        showMessage,
        handleDynamicFormChange,
        getFieldValue,
        getFileName
    } = useContractForm<ContractData>(getInitialFormData());

    const {
        validationErrors,
        isValidationPanelVisible,
        setIsValidationPanelVisible,
        handleValidation,
        isFieldRequired
    } = useFormValidation(formData, validationRules, fieldKeyToNameMap, getFieldValue);

    // const { id } = useParams<{ id: string }>();
    const isEditMode = false; // Forced to new mode

    // Load data for Edit Mode - REMOVED for New Contract Only
    /*
    useEffect(() => {
        if (isEditMode) {
             // ...
        }
    }, [id, isEditMode, setFormData, showMessage]);
    */

    // --- 狀態管理 (保留頁面特有狀態) ---
    const [contracts] = useState<ContractData[]>(() => {
        const sample = getInitialFormData();
        sample.registrationInfo.managementNo = 'MGT-001';
        sample.contractTarget.title = '範例合約一';
        return [sample];
    });
    const [isRoyaltyModalOpen, setIsRoyaltyModalOpen] = useState(false);
    const [importMgmtNo, setImportMgmtNo] = useState('');

    const mainContentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 日期連動邏輯
    useEffect(() => {
        const { contractStartDate, contractEndDate } = formData.basicInfo;
        const royaltyInfo = formData.royaltyInfo;
        if (contractStartDate && contractEndDate && royaltyInfo && royaltyInfo.length === 1) {
            const firstScheme = royaltyInfo[0];
            const isSchemeEmpty = !firstScheme.startDate && !firstScheme.endDate;
            if (isSchemeEmpty) {
                setFormData(prev => {
                    const newFormData = JSON.parse(JSON.stringify(prev));
                    newFormData.royaltyInfo[0].startDate = contractStartDate;
                    newFormData.royaltyInfo[0].endDate = contractEndDate;
                    return newFormData;
                });
            }
        }
    }, [formData.basicInfo, setFormData, formData.royaltyInfo]); // Added missing dependencies

    // --- 頁面專屬邏輯 (匯入、提交、Modal) ---
    const handleImportData = () => {
        if (!importMgmtNo.trim()) {
            showMessage('請輸入要匯入的舊合約管理部編號。', 'error');
            return;
        }
        const sourceContract = contracts.find(c => c.registrationInfo.managementNo === importMgmtNo.trim());

        if (sourceContract) {
            const importedData = JSON.parse(JSON.stringify(sourceContract));

            importedData.basicInfo.contractStartDate = '';
            importedData.basicInfo.contractEndDate = '';
            importedData.registrationInfo.managementNo = '';
            importedData.scanFile = null;

            setFormData(importedData);
            showMessage('舊合約資料匯入成功！請確認後修改。');
            setImportMgmtNo('');
        } else {
            showMessage('找不到對應的管理部編號，請確認後再試。', 'error');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, scanFile: e.target.files![0] }));
        }
    };

    const handleTocJump = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleJumpToField = (fieldTitle: string) => {
        // Find key by name
        const fieldKey = Object.keys(fieldKeyToNameMap).find(key => fieldKeyToNameMap[key] === fieldTitle);
        if (!fieldKey) return;

        // Try to find element with specific attribute or by id
        // In this implementation FormField uses id={id} which is just the short ID. 
        // We might need to adjust FormField to put full path as ID or data attribute.
        // For now, let's try to infer the ID from the last part of the key
        const lastPart = fieldKey.split('.').pop();
        if (!lastPart) return;

        const element = document.getElementById(lastPart); // FormField uses id={id.toString()}

        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-offset-2', 'ring-blue-500', 'transition-shadow', 'duration-300', 'rounded-lg');
            setTimeout(() => { element.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500', 'rounded-lg'); }, 2500);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!handleValidation()) {
            showMessage('請檢查必填欄位。', 'error');
            return;
        }

        console.log('Submitting:', formData);
        showMessage('合約資料已成功儲存！');
    };

    const openRoyaltyModal = () => setIsRoyaltyModalOpen(true);
    const closeRoyaltyModal = () => setIsRoyaltyModalOpen(false);
    const saveRoyaltyChanges = (data: DateScheme[]) => {
        setFormData(prev => ({ ...prev, royaltyInfo: data }));
    };

    const syncBeneficiariesToRemittance = () => {
        const allBeneficiaries = new Set<string>();
        formData.royaltyInfo.forEach(scheme => scheme.volumeRules.forEach(rule => rule.royaltySplits.forEach(split => {
            if (split.beneficiary.trim()) allBeneficiaries.add(split.beneficiary.trim());
        })));

        setFormData(prev => {
            const newRemittanceInfo = [...prev.remittanceInfo];
            const existing = new Set(newRemittanceInfo.map(i => i.beneficiary));
            allBeneficiaries.forEach(b => { if (!existing.has(b)) newRemittanceInfo.push(getInitialRemittanceInfoItem(b)); });
            return { ...prev, remittanceInfo: newRemittanceInfo.filter(i => allBeneficiaries.has(i.beneficiary)) };
        });
        showMessage(`已同步 ${allBeneficiaries.size} 筆分潤主體。`);
    };

    const handleRemoveRemittanceItem = (id: string) => {
        setFormData(prev => ({
            ...prev,
            remittanceInfo: prev.remittanceInfo.filter(item => item.id !== id)
        }));
        showMessage('匯款資料已移除。');
    };

    // --- JSX Render ---
    return (
        <div className="relative">
            <FloatingTOC onJump={handleTocJump} sections={tocSections} />

            <div ref={mainContentRef} className="max-w-7xl mx-auto">
                {/* Header & Import Section */}
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
                    <div className="p-6 border-b border-indigo-100 bg-indigo-50/50">
                        <div className="p-6 border-b border-indigo-100 bg-indigo-50/50">
                            <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? '維護合約' : '新增合約'}</h2>
                        </div>
                    </div>
                    {!isEditMode && (
                        <div className="p-6 bg-indigo-50/30">
                            <div className="flex flex-col gap-3">
                                <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                    <Download size={18} className="text-indigo-600" /> 帶出舊資料
                                </h3>
                                <p className="text-sm text-gray-600">若新合約內容與舊合約大致相同，可輸入舊合約的「管理部編號」快速帶入資料。(此功能僅為演示，請輸入 'OLD-001')</p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                                    <input
                                        type="text"
                                        value={importMgmtNo}
                                        onChange={(e) => setImportMgmtNo(e.target.value)}
                                        className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="輸入舊合約的管理部編號..."
                                    />
                                    <Button type="button" onClick={handleImportData} className="w-full sm:w-auto" variant="primary">
                                        帶出
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    {tocSections.map(section => {
                        const dataKey = section.id.replace(/-(\w)/g, (_, c) => c.toUpperCase()) as keyof ContractData;

                        // 特殊區塊渲染
                        if (section.id === 'royalty-info') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <Button onClick={openRoyaltyModal} variant="ghost" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200">編輯權利金規則</Button>
                                    {/* Royalty summary */}
                                    {formData.royaltyInfo.length > 0 && formData.royaltyInfo.some(s => s.startDate || s.endDate) && (
                                        <div className="mt-3 text-sm text-gray-500">
                                            已設定 {formData.royaltyInfo.length} 個日期方案，
                                            共 {formData.royaltyInfo.reduce((sum, s) => sum + s.volumeRules.length, 0)} 組卷期規則
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        if (section.id === 'remittance-info') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <RemittanceSection
                                        remittanceInfo={formData.remittanceInfo}
                                        fieldConfig={fieldConfig['remittance-info']}
                                        onSync={syncBeneficiariesToRemittance}
                                        onRemove={handleRemoveRemittanceItem}
                                        onFieldChange={handleDynamicFormChange}
                                        getFieldValue={getFieldValue}
                                        formData={formData}
                                    />
                                </div>
                            );
                        }
                        if (section.id === 'scan-file') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <div className="flex items-center gap-4">
                                        <Button variant="secondary" onClick={() => fileInputRef.current?.click()}><Upload size={16} className="mr-2" /> 選擇檔案</Button>
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                                        <span className="text-sm text-gray-600">{getFileName(formData.scanFile)}</span>
                                    </div>
                                </div>
                            );
                        }

                        // 一般欄位渲染
                        const fields = fieldConfig[section.id];
                        if (!fields) return null;

                        return (
                            <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {fields.map(field => {
                                        if (field.condition && !field.condition(formData)) return null;
                                        const path = `${dataKey}.${field.id}`;
                                        let value = getFieldValue(formData, path);
                                        // 特殊欄位類型需傳入整個物件
                                        if (['group', 'cascading-select', 'custom'].includes(field.type)) {
                                            value = getFieldValue(formData, dataKey as string);
                                        }
                                        const containerClass = field.fullWidth ? 'lg:col-span-3' : (field.type === 'group' ? 'lg:col-span-2' : '');

                                        return (
                                            <div key={field.id as string} className={containerClass}>
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

                    <div className="flex justify-end gap-4 mt-8 pb-8">
                        <Button variant="secondary" type="button" onClick={() => window.history.back()}>取消</Button>
                        <Button type="submit"><Save size={18} className="mr-2" /> {isEditMode ? '儲存變更' : '儲存合約'}</Button>
                    </div>
                </form>
            </div>

            {/* Royalty Modal */}
            <RoyaltyModal
                isOpen={isRoyaltyModalOpen}
                onClose={closeRoyaltyModal}
                royaltyInfo={formData.royaltyInfo}
                onSave={saveRoyaltyChanges}
                contractParties={formData.basicInfo.contractParty || []}
            />

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

export default AcademicContract;