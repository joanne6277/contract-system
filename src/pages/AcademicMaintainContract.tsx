
import React, { useState, useEffect, useRef } from 'react';
import { Save, RefreshCw, Trash2, Plus, Upload, Download } from 'lucide-react';
import { FloatingTOC, TagInput, CascadingSelect } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
// 引入設定檔
import { useParams } from 'react-router-dom';
import { sampleContracts } from '@/data/mockContracts';
import { tocSections, fieldConfig } from '@/features/academic/constants';
// 引入型別
import type { ContractData, RoyaltySplit, VolumeRule, DateScheme, RemittanceInfoItem, VolumeIdentifier, FormFieldConfig } from '@/features/academic/types';
// 引入自定義 Hook
import { useContractForm } from '@/shared/hooks';
import { exportMaintenanceHistory } from '@/features/academic/utils/exportUtils';
import { fieldNameToKeyMap } from '@/features/academic/constants/contractFields';


// --- 1. 輔助函式與初始資料 (Helper Functions & Initial Data) ---
const getInitialRoyaltySplit = (): RoyaltySplit => ({
    id: `rs-${Date.now()}-${Math.random()}`,
    beneficiary: '',
    percentage: '',
});

const getInitialVolumeIdentifier = (): VolumeIdentifier => ({ format: 'volume_issue', volume: '', issue: '', year: '', month: '', description: '' });

const getInitialVolumeRule = (): VolumeRule => ({
    id: `vr-${Date.now()}-${Math.random()}`,
    startVolumeInfo: getInitialVolumeIdentifier(),
    endVolumeInfo: getInitialVolumeIdentifier(),
    royaltySplits: [getInitialRoyaltySplit()],
});

const getInitialDateScheme = (startDate: string = '', endDate: string = ''): DateScheme => ({
    id: `ds-${Date.now()}-${Math.random()}`, startDate, endDate, volumeRules: [getInitialVolumeRule()]
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
}

// --- 2. FormField 元件 ---
const FormField: React.FC<FormFieldProps> = ({ field, path, value, onChange }) => {
    const { id, label, type, options, placeholder, component: CustomComponent } = field;
    const renderLabel = () => <label htmlFor={id.toString()} className={`block text-sm font-medium text-gray-700 ${type !== 'textarea' ? 'mb-2' : ''}`}>{label}</label>;

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
const AcademicMaintainContract: React.FC = () => {
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

    const { id } = useParams<{ id: string }>();

    // Load data for Edit Mode
    useEffect(() => {
        if (id) {
            const foundContract = sampleContracts.find(c => c.id === id);
            if (foundContract) {
                const loadedData = JSON.parse(JSON.stringify(foundContract));
                if (!loadedData.remittanceInfo) loadedData.remittanceInfo = [];
                if (!loadedData.royaltyInfo) loadedData.royaltyInfo = [getInitialDateScheme()];
                setFormData(loadedData);
            } else {
                showMessage('找不到指定的合約資料', 'error');
            }
        }
    }, [id, setFormData, showMessage]);

    const [isRoyaltyModalOpen, setIsRoyaltyModalOpen] = useState(false);
    const [tempRoyaltyInfo, setTempRoyaltyInfo] = useState<DateScheme[]>([]);

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
    }, [formData.basicInfo, setFormData, formData.royaltyInfo]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Update Submitting:', formData);
        showMessage('合約資料已成功儲存！');
    };

    const openRoyaltyModal = () => {
        setTempRoyaltyInfo(JSON.parse(JSON.stringify(formData.royaltyInfo)));
        setIsRoyaltyModalOpen(true);
    };
    const closeRoyaltyModal = () => setIsRoyaltyModalOpen(false);
    const saveRoyaltyChanges = () => {
        setFormData(prev => ({ ...prev, royaltyInfo: tempRoyaltyInfo }));
        closeRoyaltyModal();
    };
    const handleTempRoyaltyChange = (path: string, value: any) => {
        setTempRoyaltyInfo(prev => {
            const keys = path.split('.');
            const newInfo = JSON.parse(JSON.stringify(prev));
            let target = newInfo;
            for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
            target[keys[keys.length - 1]] = value;
            return newInfo;
        });
    };
    const addDateScheme = () => setTempRoyaltyInfo(prev => [...prev, getInitialDateScheme()]);
    const removeDateScheme = (idx: number) => setTempRoyaltyInfo(prev => prev.filter((_, i) => i !== idx));

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

    const handleExportHistory = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const history = (formData as any).maintenanceHistory || [];
        if (history.length === 0) {
            showMessage('此合約尚無維護歷程可匯出。', 'error');
            return;
        }
        exportMaintenanceHistory(history, formData.contractTarget.title || 'Contract', formData, fieldNameToKeyMap);
        showMessage('維護歷程匯出成功！');
    };

    // --- JSX Render ---
    return (
        <div className="relative">
            <FloatingTOC onJump={handleTocJump} sections={tocSections} />

            <div ref={mainContentRef} className="max-w-7xl mx-auto">
                {/* Header (No Import) */}
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
                    <div className="p-6 border-b border-indigo-100 bg-indigo-50/50">
                        <div className="p-6 border-b border-indigo-100 bg-indigo-50/50 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">維護合約</h2>
                            <Button variant="secondary" onClick={handleExportHistory} className="bg-white border-green-500 text-green-600 hover:bg-green-50">
                                <Download size={18} className="mr-2" /> 匯出維護歷程
                            </Button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    {tocSections.map(section => {
                        const dataKey = section.id.replace(/-(\w)/g, (_, c) => c.toUpperCase()) as keyof ContractData;

                        if (section.id === 'royalty-info') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <Button onClick={openRoyaltyModal} variant="ghost" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200">編輯權利金規則</Button>
                                </div>
                            );
                        }
                        if (section.id === 'remittance-info') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <Button onClick={syncBeneficiariesToRemittance} className="mb-4"><RefreshCw size={16} className="mr-2" /> 同步分潤主體</Button>
                                    <div className="space-y-4">
                                        {formData.remittanceInfo.map((item) => (
                                            <div key={item.id} className="p-4 border rounded bg-gray-50">
                                                <div className="flex justify-between mb-2">
                                                    <div className="font-bold text-indigo-700">{item.beneficiary}</div>
                                                    <Button variant="ghost" size="sm" onClick={() => handleRemoveRemittanceItem(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 size={16} /></Button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {fieldConfig['remittance-info'].map((field) => {
                                                        const path = `remittanceInfo.${formData.remittanceInfo.findIndex(f => f.id === item.id)}.${field.id}`;
                                                        const value = getFieldValue(formData, path);
                                                        return (
                                                            <div key={field.id as string} className={field.fullWidth ? 'lg:col-span-3' : ''}>
                                                                <FormField
                                                                    field={field}
                                                                    path={path}
                                                                    value={value}
                                                                    onChange={handleDynamicFormChange}
                                                                />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                                        if (['group', 'cascading-select', 'custom'].includes(field.type)) {
                                            value = getFieldValue(formData, dataKey as string);
                                        }
                                        const containerClass = field.fullWidth ? 'lg:col-span-3' : (field.type === 'group' ? 'lg:col-span-2' : '');

                                        return (
                                            <div key={field.id as string} className={containerClass}>
                                                <FormField field={field} path={path} value={value} onChange={handleDynamicFormChange} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex justify-end gap-4 mt-8 pb-8">
                        <Button variant="secondary" type="button" onClick={() => window.history.back()}>取消</Button>
                        <Button type="submit"><Save size={18} className="mr-2" /> 儲存變更</Button>
                    </div>
                </form>
            </div>

            <Modal
                isOpen={isRoyaltyModalOpen}
                onClose={closeRoyaltyModal}
                title="編輯權利金"
                size="xl"
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="secondary" onClick={closeRoyaltyModal}>取消</Button>
                        <Button onClick={saveRoyaltyChanges}>確認修改</Button>
                    </div>
                }
            >
                <div className="flex-1 overflow-y-auto max-h-[70vh]">
                    {tempRoyaltyInfo.map((scheme, idx) => (
                        <div key={scheme.id} className="border p-4 rounded-lg mb-4 bg-gray-50">
                            <h4 className="font-bold mb-2 text-gray-800">日期方案 {idx + 1}</h4>
                            <div className="flex gap-4 mb-2 items-center">
                                <input type="date" value={scheme.startDate} onChange={e => handleTempRoyaltyChange(`${idx}.startDate`, e.target.value)} className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
                                <span className="self-center text-gray-500">至</span>
                                <input type="date" value={scheme.endDate} onChange={e => handleTempRoyaltyChange(`${idx}.endDate`, e.target.value)} className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
                                <Button variant="ghost" size="sm" onClick={() => removeDateScheme(idx)} className="text-red-500 hover:text-red-700 hover:bg-red-50 ml-auto"><Trash2 size={16} /></Button>
                            </div>
                            <div className="text-sm text-gray-500 italic">（卷期規則設定區塊...）</div>
                        </div>
                    ))}
                    <Button variant="ghost" onClick={addDateScheme} className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"><Plus size={16} className="mr-2" /> 新增日期方案</Button>
                </div>
            </Modal>

            {message.show && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-100 ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default AcademicMaintainContract;
