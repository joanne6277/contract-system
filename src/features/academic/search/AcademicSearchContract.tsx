/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck - 暫時跳過型別檢查，待後續逐步重構
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, X, Search, Plus, FileText, Menu, Download, Filter, Columns, ArrowUpDown, ChevronUp } from 'lucide-react';
import { useBatch } from '../../batch/context/BatchContext';
import { BatchSelectionCheckbox } from '../../batch/components/BatchSelectionCheckbox';
import { sampleContracts } from '@/data/mockContracts';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';


// --- Helper Functions ---
import { getAcademicFieldValue as getFieldValue, fieldConfig, fieldKeyToNameMap, authorizationFormOptions, sectionIdToDataKey } from '../constants/contractFields';

// --- 學發部搜尋模組 ---

// --- 組件 Props 型別 ---
interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeFilters: Record<string, any>;
    onFilterChange: (filters: Record<string, any>) => void;
}

interface FilterRadioGroupProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

interface FilterTextInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

interface FilterSelectProps {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
}

interface FilterDateRangeProps {
    label: string;
    start: string;
    end: string;
    onStartChange: (value: string) => void;
    onEndChange: (value: string) => void;
}

interface CollapsibleSectionProps {
    title: string;
    children: ReactNode;
}

interface ColumnSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    visibleColumns: Set<string>;
    setVisibleColumns: (columns: Set<string>) => void;
}

// --- 設定與型別定義 ---

// --- 型別定義 ---
interface ChangeDetail {

    field: string;
    oldValue: any;
    newValue: any;
}

interface MaintenanceRecord {
    timestamp: string;
    userId: string;
    userName: string;
    changes: ChangeDetail[];
}

interface VolumeIdentifier {
    format: 'volume_issue' | 'year_month' | 'text';
    volume: string;
    issue: string;
    year: string;
    month: string;
    description: string;
}

interface VolumeRule {
    id: string;
    startVolumeInfo: VolumeIdentifier;
    endVolumeInfo: VolumeIdentifier;
    unit: string;
    authorProfitPercentage: string;
    agentProfitPercentage: string;
    apProfitPercentage: string;
    other: string;
}

interface DateScheme {
    id: string;
    startDate: string;
    endDate: string;
    volumeRules: VolumeRule[];
}

interface EmbargoRule {
    id: string;
    target: string;
    period: string;
}

// 加入新欄位的資料結構
interface ContractData {
    id?: string;
    contractTarget: {
        publicationId: string;
        type: string;
        title: string;
        volumeInfo: string;
        issnIsbn: string;
    };
    registrationInfo: {
        managementNo: string;
        departmentNo: string;
        departmentSubNo: string;
        collector: string;
        asResponsible: string;
        isCurrent: '是' | '否';
        contractVersion: string[];
        nonAiritiVersion: string;
    };
    basicInfo: {
        partyARep: string;
        partyBRep: string;
        contractParty: string;
        contractStartDate: string;
        contractEndDate: string;
        autoRenewYears: string;
        autoRenewFrequency: string;
        thereafter: '是' | '否';
        specialDateInfo: string;
    };
    rightsInfo: {
        authorizationFormMain: string;
        authorizationFormSub: string;
        paymentType: '有償' | '無償';
        isOpenAccess: '有' | '無';
    };
    scopeInfo: {
        thirdPartyPlatform_tws: '上_TWS' | '不上_TWS';
        thirdPartyPlatform_consent: string[];
        discoverySystem_selectionType: '全選' | '單選' | '各平台皆不上架';
        discoverySystem_futurePlatforms: '含將來合作平台' | '僅包含現行合作平台';
        discoverySystem_includeCN: '含CN' | '不含CN';
        discoverySystem_platforms: string[];
        discoverySystem_consent: string[];
        comparisonSystem: '是' | '否';
        nclClause_selectionType: '不上' | 'Embargo';
        nclClause_doNotList: string[];
        nclClause_embargoRules: EmbargoRule[];
        listingLocation: '全球用戶' | '不上CN' | '不上CN含港澳';
        status_al_cn: string;
    };
    otherClauses: {
        usageRightsWarranty: '保證+甲方賠償' | '保證+甲方不賠' | '未保證';
        userRightsProtection: '是' | '否';
        terminationClause: '是' | '否';
        forceMajeure: '是' | '否';
        confidentiality: '是' | '否';
        noOaOnOwnWebsite: '是' | '否';
        legalIssueHandling: '甲方' | '乙方' | '雙方' | '法律解決';
        manuscriptAgreementMention: '是' | '否';
        authorizationCopy: '是' | '否';
        damages_hasClause: '是' | '否';
        damages_description: string;
    };
    remittanceInfo: {
        accountType: '國內' | '海外';
        accountName: string;
        checkTitle: string;
        currency: string;
        bankName: string;
        branchName: string;
        accountNumber: string;
        accountNotes: string;
        taxId: string;
        idNumber: string;
        royaltySettlementMonth: string;
        paymentReceiptFlow: string;
    };
    terminationInfo: {
        isTerminated: '是' | '否';
        terminationReason: string;
        terminationDate: string;
        terminationMethod: string;
    };
    royaltyInfo: DateScheme[];
    remarks: string;
    scanFile?: File | string | null;
    createdAt?: Date;
    maintenanceHistory?: MaintenanceRecord[];
}

interface SearchCriteria {
    keyword: string;
    dateMode: string;
    startDate: string;
    endDate: string;
    rollbackDate: string;
}

interface ActiveFilters {
    [key: string]: any;
}


interface MessageState {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

// --- 欄位設定 ---
interface FormFieldConfig {
    id: keyof any;
    label: string;
    type: 'text' | 'date' | 'radio' | 'tags' | 'group' | 'cascading-select' | 'custom' | 'select' | 'textarea';
    options?: any;
    fullWidth?: boolean;
    placeholder?: string;
    fields?: FormFieldConfig[]; // For grouped fields
    condition?: (formData: ContractData) => boolean;
    component?: React.FC<any>;
}

// fieldConfig and authorizationFormOptions are imported

const discoveryPlatforms = ['Google Scholar', 'NAVER Academic', 'Primo', 'EBSCO EDS', 'OCLC Discovery'];
const embargoTargets = ['第三方平台', '國家圖書館', 'TOAJ'];
const embargoPeriods = ['一年', '半年', '一期'];

// --- 顯示欄位設定 ---
const columnConfig = {
    defaultVisible: [
        'contractTarget.publicationId',
        'registrationInfo.managementNo',
        'basicInfo.contractParty',
        'contractTarget.title',
        'registrationInfo.isCurrent',
        'rightsInfo.authorizationForm',
    ],
    selectable: [
        {
            group: '造冊資訊',
            columns: [
                { id: 'contractTarget.publicationId', label: 'PublicationID' },
                { id: 'registrationInfo.managementNo', label: '管理部編號' },
                { id: 'registrationInfo.departmentNo', label: '學術發展部合約編號' },
                { id: 'registrationInfo.departmentSubNo', label: '學術發展部合約子編號' },
                { id: 'registrationInfo.contractVersion', label: '合約版本' },
                { id: 'registrationInfo.collector', label: '負責徵集' },
            ]
        },
        {
            group: '基本資料',
            columns: [
                { id: 'contractTarget.title', label: '標的名稱(刊名)' },
                { id: 'basicInfo.contractParty', label: '簽約單位' },
                { id: 'registrationInfo.isCurrent', label: '現行合約' },
                { id: 'terminationInfo.isTerminated', label: '解約' },
                { id: 'terminationInfo.terminationReason', label: '解約原因' },
                { id: 'terminationInfo.terminationDate', label: '解約日期' },
                { id: 'basicInfo.contractStartDate', label: '合約起日' },
                { id: 'basicInfo.contractEndDate', label: '合約迄日' },
                { id: 'basicInfo.autoRenew', label: '自動續約' },
                { id: 'basicInfo.thereafter', label: '其後亦同' },
                { id: 'basicInfo.specialDateInfo', label: '特殊年限資訊' },
            ]
        },
        {
            group: '權利與範圍',
            columns: [
                { id: 'rightsInfo.authorizationForm', label: '授權形式' },
                { id: 'rightsInfo.paymentType', label: '有償_無償' },
                { id: 'rightsInfo.isOpenAccess', label: 'OA' },
                { id: 'royaltyInfo', label: '權利金比例' },
                { id: 'scopeInfo.thirdPartyPlatform', label: '第三方平台' },
                { id: 'scopeInfo.discoverySystem', label: '國際第三方發現系統或平台' },
                { id: 'scopeInfo.comparisonSystem', label: '比對系統' },
                { id: 'scopeInfo.nclClause', label: '不上國圖條文｜第三方平台' },
                { id: 'scopeInfo.listingLocation', label: '上架位置' },
            ]
        },
        {
            group: '其他條款',
            columns: [
                { id: 'otherClauses.usageRightsWarranty', label: '甲方義務_甲方保証有使用權利' },
                { id: 'otherClauses.userRightsProtection', label: '用戶權益保障' },
                { id: 'otherClauses.terminationClause', label: '合約終止_書目更動_終止條文' },
                { id: 'otherClauses.forceMajeure', label: '不可抗力條款' },
                { id: 'otherClauses.confidentiality', label: '保密條款' },
                { id: 'remarks.remarks', label: '備註' },
            ]
        }
    ]
};


// --- CUSTOM FIELD COMPONENTS (For fieldConfig) ---
// Note: These are needed for fieldConfig generation, even if form is removed
const ThirdPartyPlatformField = () => null;
const DiscoverySystemField = () => null;
const NclClauseField = () => null;
const DamagesField = () => null;


const FilterDrawer = ({ isOpen, onClose, activeFilters, onFilterChange }) => {
    const handleFilterChange = (key, value) => {
        const newFilters = { ...activeFilters };
        if (value === '' || value === undefined || (Array.isArray(value) && value.length === 0)) {
            delete newFilters[key];
        } else {
            newFilters[key] = value;
        }
        onFilterChange(newFilters);
    };

    const handleClear = () => {
        onFilterChange({});
    };

    const CollapsibleSection = ({ title, children }) => {
        const [isSectionOpen, setIsSectionOpen] = useState(true);
        return (
            <div className="py-4 border-b border-gray-100">
                <button onClick={() => setIsSectionOpen(!isSectionOpen)} className="w-full flex justify-between items-center text-left font-semibold text-gray-700">
                    <span>{title}</span>
                    <ChevronDown className={`transform transition-transform ${isSectionOpen ? 'rotate-180' : ''}`} size={16} />
                </button>
                {isSectionOpen && <div className="mt-4 space-y-4 pl-2">{children}</div>}
            </div>
        );
    };

    return (
        <>
            <div className={`fixed inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent pointer-events-none'}`} onClick={onClose}></div>
            <div
                className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-sm hover:bg-white transition-all duration-300 w-80 shadow-2xl z-50 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Filter size={20} className="text-indigo-600" />進階篩選</h3>
                    <Button variant="ghost" size="sm" onClick={onClose}><X size={20} /></Button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    <CollapsibleSection title="合約狀態">
                        <FilterRadioGroup label="現行合約" value={activeFilters.isCurrent || ''} options={['是', '否']} onChange={val => handleFilterChange('isCurrent', val)} />
                        <FilterRadioGroup label="其後亦同" value={activeFilters.thereafter || ''} options={['是', '否']} onChange={val => handleFilterChange('thereafter', val)} />
                        <FilterRadioGroup label="解約狀態" value={activeFilters.isTerminated || ''} options={['是', '否']} onChange={val => handleFilterChange('isTerminated', val)} />
                        <FilterDateRange label="解約日期" start={activeFilters.terminationDateStart || ''} end={activeFilters.terminationDateEnd || ''} onStartChange={val => handleFilterChange('terminationDateStart', val)} onEndChange={val => handleFilterChange('terminationDateEnd', val)} />
                    </CollapsibleSection>
                    <CollapsibleSection title="權利與範圍">
                        <FilterSelect label="授權形式 (主)" value={activeFilters.authorizationFormMain || ''} options={Object.keys(authorizationFormOptions)} onChange={val => { handleFilterChange('authorizationFormMain', val); handleFilterChange('authorizationFormSub', ''); }} />
                        {(activeFilters.authorizationFormMain && authorizationFormOptions[activeFilters.authorizationFormMain].length > 0) && (
                            <FilterSelect label="授權形式 (子)" value={activeFilters.authorizationFormSub || ''} options={authorizationFormOptions[activeFilters.authorizationFormMain]} onChange={val => handleFilterChange('authorizationFormSub', val)} />
                        )}
                        <FilterRadioGroup label="有償/無償" value={activeFilters.paymentType || ''} options={['有償', '無償']} onChange={val => handleFilterChange('paymentType', val)} />
                        <FilterRadioGroup label="OA" value={activeFilters.isOpenAccess || ''} options={['有', '無']} onChange={val => handleFilterChange('isOpenAccess', val)} />
                        <FilterRadioGroup label="上架位置" value={activeFilters.listingLocation || ''} options={['全球用戶', '不上CN', '不上CN含港澳']} onChange={val => handleFilterChange('listingLocation', val)} />
                        <FilterRadioGroup label="第三方平台 (TWS)" value={activeFilters.thirdPartyPlatform_tws || ''} options={['上_TWS', '不上_TWS']} onChange={val => handleFilterChange('thirdPartyPlatform_tws', val)} />
                        <FilterRadioGroup label="比對系統" value={activeFilters.comparisonSystem || ''} options={['是', '否']} onChange={val => handleFilterChange('comparisonSystem', val)} />
                    </CollapsibleSection>
                    <CollapsibleSection title="負責人員">
                        <FilterTextInput label="負責徵集" value={activeFilters.collector || ''} onChange={val => handleFilterChange('collector', val)} />
                        <FilterTextInput label="負責AS" value={activeFilters.asResponsible || ''} onChange={val => handleFilterChange('asResponsible', val)} />
                    </CollapsibleSection>
                    <CollapsibleSection title="合約條款">
                        <FilterRadioGroup label="用戶權益保障" value={activeFilters.userRightsProtection || ''} options={['是', '否']} onChange={val => handleFilterChange('userRightsProtection', val)} />
                        <FilterRadioGroup label="合約終止_書目更動_終止條文" value={activeFilters.terminationClause || ''} options={['是', '否']} onChange={val => handleFilterChange('terminationClause', val)} />
                        <FilterRadioGroup label="不可抗力條款" value={activeFilters.forceMajeure || ''} options={['是', '否']} onChange={val => handleFilterChange('forceMajeure', val)} />
                        <FilterRadioGroup label="保密條款" value={activeFilters.confidentiality || ''} options={['是', '否']} onChange={val => handleFilterChange('confidentiality', val)} />
                    </CollapsibleSection>
                </div>
                <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex justify-between gap-3 backdrop-blur-sm">
                    <Button variant="secondary" onClick={handleClear} className="w-full">清除全部</Button>
                    <Button variant="primary" onClick={onClose} className="w-full">完成</Button>
                </div>
            </div>
        </>
    );
};
const FilterRadioGroup = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
            <label className="flex items-center"><input type="radio" name={label} value="" checked={!value} onChange={(e) => onChange(e.target.value)} className="h-4 w-4" /><span className="ml-2 text-sm">全部</span></label>
            {options.map(opt => <label key={opt} className="flex items-center"><input type="radio" name={label} value={opt} checked={value === opt} onChange={(e) => onChange(e.target.value)} className="h-4 w-4" /><span className="ml-2 text-sm">{opt}</span></label>)}
        </div>
    </div>
);
const FilterTextInput = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md" />
    </div>
);
const FilterSelect = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md">
            <option value="">全部</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);
const FilterDateRange = ({ label, start, end, onStartChange, onEndChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <div className="space-y-2">
            <input type="date" value={start} onChange={e => onStartChange(e.target.value)} className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md" placeholder="起始日期" />
            <input type="date" value={end} onChange={e => onEndChange(e.target.value)} className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md" placeholder="結束日期" />
        </div>
    </div>
);



// fieldConfig is imported


// --- 常數與對照表 ---
const tocSections = [
    { id: 'contract-target', title: '合約標的' },
    { id: 'registration-info', title: '造冊資訊' },
    { id: 'termination-info', title: '解約' },
    { id: 'basic-info', title: '基本資料' },
    { id: 'rights-info', title: '權利內容' },
    { id: 'royalty-info', title: '權利金比例' },
    { id: 'scope-info', title: '授權範圍' },
    { id: 'other-clauses', title: '其他條款' },
    { id: 'remittance-info', title: '匯款資料' },
    { id: 'scan-file', title: '合約掃描檔' },
    { id: 'remarks', title: '備註' },
    { id: 'maintenance-history', title: '維護歷程' },
];

const volumeRuleFieldKeyToNameMap: { [key in keyof Omit<VolumeRule, 'id' | 'startVolumeInfo' | 'endVolumeInfo'>]: string } = {
    'unit': '單位(%)',
    'authorProfitPercentage': '作者(%)',
    'agentProfitPercentage': '代理商(%)',
    'apProfitPercentage': 'AP(%)',
    'other': '其他',
};

// --- 動態生成 fieldKeyToNameMap ---
// fieldKeyToNameMap is imported


// --- 新增元件 ---
const FloatingTOC: React.FC<{ onJump: (id: string) => void }> = ({ onJump }) => {
    const [isTocOpen, setIsTocOpen] = useState(false);
    if (!isTocOpen) return (<div className="fixed top-32 right-5 z-40"><button onClick={() => setIsTocOpen(true)} className="bg-white p-2.5 rounded-l-lg shadow-lg border border-gray-200 border-r-0 hover:bg-gray-50" aria-label="開啟目錄"><Menu className="w-5 h-5 text-gray-600" /></button></div>);
    return (<div className="fixed top-32 right-5 z-40 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 w-48 transition-all duration-300"><div className="flex justify-between items-center p-2 border-b border-gray-200"><h3 className="font-semibold text-sm text-gray-800">章節目錄</h3><button onClick={() => setIsTocOpen(false)} className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button></div><nav><ul className="py-1">{tocSections.map(section => (<li key={section.id}><a href={`#${section.id}`} onClick={(e) => { e.preventDefault(); onJump(section.id); }} className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors rounded-md mx-1">{section.title}</a></li>))}</ul></nav></div>);
};

const getInitialVolumeIdentifier = (): VolumeIdentifier => ({ format: 'volume_issue', volume: '', issue: '', year: '', month: '', description: '' });
const getInitialVolumeRule = (): VolumeRule => ({ id: `vr-${Date.now()}-${Math.random()}`, startVolumeInfo: getInitialVolumeIdentifier(), endVolumeInfo: getInitialVolumeIdentifier(), unit: '', authorProfitPercentage: '', agentProfitPercentage: '', apProfitPercentage: '', other: '' });
const getInitialDateScheme = (startDate: string = '', endDate: string = ''): DateScheme => ({ id: `ds-${Date.now()}-${Math.random()}`, startDate, endDate, volumeRules: [getInitialVolumeRule()], });
const getInitialFormData = (): ContractData => {
    const initialState: any = { royaltyInfo: [getInitialDateScheme()], remarks: '', scanFile: null };
    Object.keys(fieldConfig).forEach(sectionId => {
        const dataKey = sectionIdToDataKey(sectionId);
        initialState[dataKey] = {};
        fieldConfig[sectionId].forEach(field => {
            if (field.type === 'group' && field.fields) {
                field.fields.forEach(subField => { initialState[dataKey][subField.id as string] = ''; });
            } else if (field.type === 'cascading-select') {
                initialState[dataKey]['authorizationFormMain'] = '';
                initialState[dataKey]['authorizationFormSub'] = '';
            } else if (field.id === 'thirdPartyPlatform') {
                initialState[dataKey]['thirdPartyPlatform_tws'] = '上_TWS';
                initialState[dataKey]['thirdPartyPlatform_consent'] = [];
            } else if (field.id === 'discoverySystem') {
                initialState[dataKey]['discoverySystem_selectionType'] = '單選';
                initialState[dataKey]['discoverySystem_futurePlatforms'] = '含將來合作平台';
                initialState[dataKey]['discoverySystem_includeCN'] = '含CN';
                initialState[dataKey]['discoverySystem_platforms'] = [];
                initialState[dataKey]['discoverySystem_consent'] = [];
            } else if (field.id === 'nclClause') {
                initialState[dataKey]['nclClause_selectionType'] = '不上';
                initialState[dataKey]['nclClause_doNotList'] = [];
                initialState[dataKey]['nclClause_embargoRules'] = [];
            } else if (field.id === 'damages') {
                initialState[dataKey]['damages_hasClause'] = '否';
                initialState[dataKey]['damages_description'] = '';
            }
            else {
                const radioDefaults = { 'isTerminated': '否', 'isCurrent': '否', 'paymentType': '有償', 'isOpenAccess': '否', 'comparisonSystem': '否', 'userRightsProtection': '否', 'terminationClause': '否', 'forceMajeure': '否', 'confidentiality': '否', 'noOaOnOwnWebsite': '否', 'manuscriptAgreementMention': '否', 'authorizationCopy': '否', 'accountType': '國內' };
                const selectDefaults = { 'usageRightsWarranty': '保證+甲方賠償', 'legalIssueHandling': '雙方' };
                const otherDefaults = { 'listingLocation': '全球用戶' };

                if (radioDefaults[field.id as string]) {
                    initialState[dataKey][field.id as string] = radioDefaults[field.id as string];
                } else if (selectDefaults[field.id as string]) {
                    initialState[dataKey][field.id as string] = selectDefaults[field.id as string];
                } else if (otherDefaults[field.id as string]) {
                    initialState[dataKey][field.id as string] = otherDefaults[field.id as string];
                } else if (field.type === 'tags' || field.type === 'textarea') {
                    initialState[dataKey][field.id as string] = field.type === 'tags' ? [] : '';
                } else {
                    initialState[dataKey][field.id as string] = '';
                }
            }
        });
    });
    return initialState as ContractData;
};

// --- Column Selector Component ---
const ColumnSelector = ({ isOpen, onClose, visibleColumns, setVisibleColumns }) => {
    const [tempVisibleColumns, setTempVisibleColumns] = useState(new Set(visibleColumns));
    const checkboxRef = useRef<{ [key: string]: HTMLInputElement | null }>({});


    useEffect(() => {
        setTempVisibleColumns(new Set(visibleColumns));
    }, [isOpen, visibleColumns]);

    const handleToggle = (columnId) => {
        setTempVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (newSet.has(columnId)) {
                newSet.delete(columnId);
            } else {
                newSet.add(columnId);
            }
            return newSet;
        });
    };

    const handleToggleGroup = (columnsInGroup) => {
        const columnIds = columnsInGroup.map(c => c.id);
        const allSelected = columnIds.every(id => tempVisibleColumns.has(id));

        setTempVisibleColumns(prev => {
            const newSet = new Set(prev);
            if (allSelected) {
                columnIds.forEach(id => {
                    if (id !== 'contractTarget.title') {
                        newSet.delete(id);
                    }
                });
            } else {
                columnIds.forEach(id => newSet.add(id));
            }
            return newSet;
        });
    };

    const handleApply = () => {
        setVisibleColumns(tempVisibleColumns);
        onClose();
    };

    const handleReset = () => {
        setTempVisibleColumns(new Set(columnConfig.defaultVisible));
    };

    useEffect(() => {
        columnConfig.selectable.forEach(group => {
            const groupColumnIds = group.columns.map(c => c.id);
            const areAllSelected = groupColumnIds.every(id => tempVisibleColumns.has(id));
            const areSomeSelected = groupColumnIds.some(id => tempVisibleColumns.has(id));
            const checkbox = checkboxRef.current[group.group];
            if (checkbox) {
                checkbox.checked = areAllSelected;
                checkbox.indeterminate = !areAllSelected && areSomeSelected;
            }
        });
    }, [tempVisibleColumns]);


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="篩選顯示欄位"
            size="lg"
            footer={
                <div className="flex justify-between items-center w-full">
                    <Button variant="secondary" onClick={handleReset}>恢復預設</Button>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={onClose}>取消</Button>
                        <Button onClick={handleApply}>套用</Button>
                    </div>
                </div>
            }
        >
            <div className="max-h-[60vh] overflow-y-auto space-y-6">
                {columnConfig.selectable.map(group => (
                    <div key={group.group}>
                        <div className="flex items-center mb-3">
                            <input
                                type="checkbox"
                                id={`group-select-${group.group}`}
                                ref={el => checkboxRef.current[group.group] = el}
                                onChange={() => handleToggleGroup(group.columns)}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                            />
                            <label htmlFor={`group-select-${group.group}`} className="font-semibold text-gray-700 cursor-pointer">{group.group}</label>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-6">
                            {group.columns.map(col => {
                                const isDisabled = col.id === 'contractTarget.title';
                                return (
                                    <label key={col.id} className={`flex items-center p-2 rounded-md ${isDisabled ? 'cursor-not-allowed opacity-70' : 'hover:bg-gray-50 cursor-pointer'}`}>
                                        <input
                                            type="checkbox"
                                            checked={tempVisibleColumns.has(col.id)}
                                            onChange={() => handleToggle(col.id)}
                                            disabled={isDisabled}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:cursor-not-allowed"
                                        />
                                        <span className="ml-2 text-sm text-gray-800">{col.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

const AcademicDeptContractModule: React.FC = () => {
    // --- 狀態管理 ---
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<string>('search-contract');
    const [contracts, setContracts] = useState<ContractData[]>([]);
    const [rawSearchResults, setRawSearchResults] = useState<ContractData[]>([]); // Results before client-side filtering
    const [searchResults, setSearchResults] = useState<ContractData[]>([]); // Results after client-side filtering
    const [currentContract, setCurrentContract] = useState<ContractData | null>(null);
    const [message, setMessage] = useState<MessageState>({ show: false, message: '', type: 'success' });
    const mainContentRef = useRef<HTMLElement>(null);
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columnConfig.defaultVisible));
    const [expandedRoyaltyRows, setExpandedRoyaltyRows] = useState<Set<string>>(new Set());
    const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
    const [displayedColumns, setDisplayedColumns] = useState<string[]>(columnConfig.defaultVisible);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const [dragOverColId, setDragOverColId] = useState<string | null>(null);

    const currentUser = { id: 'dev-user-1', name: '開發者' };

    // --- 初始化 Effect ---
    useEffect(() => {
        // 使用 mockContracts 資料
        setContracts(sampleContracts as any);
    }, []);

    // Effect to sync royalty dates with main contract dates for new contracts
    const allColumns = useMemo(() => [...columnConfig.selectable.flatMap(g => g.columns)], []);

    useEffect(() => {
        setDisplayedColumns(prevOrder => {
            const newOrder = prevOrder.filter(id => visibleColumns.has(id));
            const currentOrderSet = new Set(newOrder);
            const addedColumns = [...visibleColumns].filter(id => !currentOrderSet.has(id));
            return [...newOrder, ...addedColumns];
        });
    }, [visibleColumns]);

    // --- Search & Filter Logic ---
    const nameToFieldKeyMap = React.useMemo(() => Object.entries(fieldKeyToNameMap).reduce((acc, [key, name]) => {
        acc[name] = key;
        return acc;
    }, {}), []);

    const getContractSnapshot = useCallback((contract, rollbackDate) => {
        const snapshot = JSON.parse(JSON.stringify(contract)); // Deep copy
        if (!rollbackDate) return snapshot;

        const targetDate = new Date(rollbackDate);
        const changesToRevert = (contract.maintenanceHistory || [])
            .filter(record => new Date(record.timestamp.split(' ')[0]) > targetDate)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        const setNestedValue = (obj, path, value) => {
            const keys = path.split('.');
            let current = obj;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
        };

        for (const record of changesToRevert) {
            for (const change of record.changes) {
                const fieldPath = nameToFieldKeyMap[change.field];
                if (fieldPath) {
                    const oldValue = (typeof change.oldValue === 'string' && change.oldValue.includes(','))
                        ? change.oldValue.split(', ')
                        : change.oldValue;
                    setNestedValue(snapshot, fieldPath, oldValue);
                } else if (change.field === '合約掃描檔') {
                    snapshot.scanFile = change.oldValue;
                }
            }
        }
        return snapshot;
    }, [nameToFieldKeyMap]);

    const handleSearch = useCallback((criteria: SearchCriteria) => {
        let results = [...contracts];
        if (criteria.rollbackDate) { results = results.map(c => getContractSnapshot(c, criteria.rollbackDate)); }
        if (criteria.keyword) { const lowerKeyword = criteria.keyword.toLowerCase(); results = results.filter(c => (c.contractTarget.publicationId?.toLowerCase().includes(lowerKeyword) || c.contractTarget.title?.toLowerCase().includes(lowerKeyword) || c.registrationInfo.managementNo?.toLowerCase().includes(lowerKeyword) || c.registrationInfo.departmentNo?.toLowerCase().includes(lowerKeyword) || c.registrationInfo.departmentSubNo?.toLowerCase().includes(lowerKeyword) || c.basicInfo.contractParty?.toLowerCase().includes(lowerKeyword))); }
        if (criteria.startDate && criteria.endDate) {
            const searchStart = new Date(criteria.startDate); const searchEnd = new Date(criteria.endDate); results = results.filter(c => {
                const contractStart = new Date(c.basicInfo.contractStartDate); const contractEnd = new Date(c.basicInfo.contractEndDate); if (!c.basicInfo.contractStartDate || !c.basicInfo.contractEndDate) return false; switch (criteria.dateMode) {
                    case 'starts': return contractStart >= searchStart && contractStart <= searchEnd;
                    case 'ends': return contractEnd >= searchStart && contractEnd <= searchEnd;
                    case 'effective': return contractStart <= searchEnd && contractEnd >= searchStart;
                    case 'within': return contractStart >= searchStart && contractEnd <= searchEnd;
                    default: return true;
                }
            });
        }
        setRawSearchResults(results); setActiveFilters({}); navigateTo('search-results');
    }, [contracts, getContractSnapshot]);

    useEffect(() => {
        let filteredData = [...rawSearchResults];
        if (Object.keys(activeFilters).length > 0) {
            filteredData = filteredData.filter(c => {
                return Object.entries(activeFilters).every(([key, value]) => {
                    if (value === '' || value === undefined) return true;
                    const check = (path, filterValue) => { const contractValue = getFieldValue(c, path); if (contractValue === undefined || contractValue === null) return false; if (typeof contractValue === 'string' && typeof filterValue === 'string') { return contractValue.toLowerCase().includes(filterValue.toLowerCase()); } return contractValue === filterValue; };
                    switch (key) {
                        case 'isCurrent': return check('registrationInfo.isCurrent', value);
                        case 'isTerminated': return check('terminationInfo.isTerminated', value);
                        case 'paymentType': return check('rightsInfo.paymentType', value);
                        case 'isOpenAccess': return check('rightsInfo.isOpenAccess', value);
                        case 'listingLocation': return check('scopeInfo.listingLocation', value);
                        case 'thirdPartyPlatform_tws': return check('scopeInfo.thirdPartyPlatform_tws', value);
                        case 'comparisonSystem': return check('scopeInfo.comparisonSystem', value);
                        case 'collector': return check('registrationInfo.collector', value);
                        case 'asResponsible': return check('registrationInfo.asResponsible', value);
                        case 'userRightsProtection': return check('otherClauses.userRightsProtection', value);
                        case 'terminationClause': return check('otherClauses.terminationClause', value);
                        case 'forceMajeure': return check('otherClauses.forceMajeure', value);
                        case 'confidentiality': return check('otherClauses.confidentiality', value);
                        case 'thereafter': return check('basicInfo.thereafter', value);
                        case 'authorizationFormMain': return check('rightsInfo.authorizationFormMain', value);
                        case 'authorizationFormSub': return check('rightsInfo.authorizationFormSub', value);
                        case 'terminationDateStart': return c.terminationInfo.terminationDate && new Date(c.terminationInfo.terminationDate) >= new Date(value);
                        case 'terminationDateEnd': return c.terminationInfo.terminationDate && new Date(c.terminationInfo.terminationDate) <= new Date(value);
                        default: return true;
                    }
                });
            });
        }
        setSearchResults(filteredData);
    }, [rawSearchResults, activeFilters]);




    const sortedSearchResults = useMemo(() => {
        let sortableItems = [...searchResults];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = getFieldValue(a, sortConfig.key);
                const bValue = getFieldValue(b, sortConfig.key);

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                let comparison = 0;
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    comparison = aValue.localeCompare(bValue, 'zh-Hant');
                } else {
                    // Safe cleanup for comparison if values are not strings (e.g. numbers, booleans)
                    const aStr = String(aValue);
                    const bStr = String(bValue);
                    // Try numeric comparison if both look like numbers
                    const aNum = parseFloat(aStr);
                    const bNum = parseFloat(bStr);

                    if (!isNaN(aNum) && !isNaN(bNum) && String(aNum) === aStr && String(bNum) === bStr) {
                        if (aNum > bNum) comparison = 1;
                        else if (aNum < bNum) comparison = -1;
                    } else {
                        // Fallback to string comparison
                        comparison = aStr.localeCompare(bStr, 'zh-Hant');
                    }
                }
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return sortableItems;
    }, [searchResults, sortConfig]);

    // --- 通用函式 ---
    const showMessage = useCallback((msg: string, type: 'success' | 'error' = 'success') => { setMessage({ show: true, message: msg, type }); setTimeout(() => setMessage({ show: false, message: '', type: 'success' }), 5000); }, []);
    const navigateTo = (pageId: string) => {
        setCurrentPage(pageId);
        mainContentRef.current?.scrollTo(0, 0);
    };

    const getFileName = (file: File | string | null | undefined): string => { if (typeof file === 'string') return file; if (file instanceof File) return file.name; return '尚未上傳檔案'; };
    const showContractDetail = (contract: ContractData) => { setCurrentContract(contract); navigateTo('contract-detail'); };

    // --- Stubbed 示意功能 ---
    const enterEditMode = () => {
        showMessage('「維護」功能僅為示意。', 'error');
    };
    const formatVolumeIdentifier = (info: VolumeIdentifier | undefined): string => { if (!info) return ''; switch (info.format) { case 'volume_issue': return `卷:${info.volume || ''}-期:${info.issue || ''}`; case 'year_month': return `年:${info.year || ''}-月:${info.month || ''}`; case 'text': return info.description || ''; default: return ''; } };

    // --- 合約操作與驗證 ---
    const handleTocJump = (id: string) => { const element = document.getElementById(id); if (element) { const offset = 100; const bodyRect = mainContentRef.current?.getBoundingClientRect().top ?? 0; const elementRect = element.getBoundingClientRect().top; const elementPosition = elementRect - bodyRect; const offsetPosition = mainContentRef.current?.scrollTop + elementPosition - offset; mainContentRef.current?.scrollTo({ top: offsetPosition, behavior: 'smooth' }); } };

    const handleDownloadHistory = (history: MaintenanceRecord[], managementNo?: string) => {
        if (!history || history.length === 0) {
            showMessage('沒有維護歷程可供下載。', 'error');
            return;
        }

        let csvContent = "\uFEFF"; // Add BOM for Excel UTF-8 compatibility
        csvContent += "時間戳,維護人員ID,維護人員名稱,變更欄位,舊資料,新資料\n";

        history.forEach(record => {
            record.changes.forEach(change => {
                const escapeCSV = (value: any) => `"${String(value || '').replace(/"/g, '""')}"`;
                const row = [
                    escapeCSV(record.timestamp),
                    escapeCSV(record.userId),
                    escapeCSV(record.userName),
                    escapeCSV(change.field),
                    escapeCSV(change.oldValue),
                    escapeCSV(change.newValue)
                ].join(',');
                csvContent += row + "\n";
            });
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `${managementNo || 'contract'}_維護歷程.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    // --- 權利金 Modal 相關函式 ---
    // --- 排序 & 拖曳函式 ---
    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleDragStart = (e: React.DragEvent, position: number) => {
        dragItem.current = position;
    };

    const handleDragEnter = (e: React.DragEvent, position: number) => {
        dragOverItem.current = position;
        const colId = displayedColumns[position];
        setDragOverColId(colId);
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
    }

    // --- 渲染函式 ---
    const renderScopeInfoDetail = (scopeInfo) => {
        if (!scopeInfo) return 'N/A';
        const formatArray = (arr) => (arr && arr.length > 0 ? arr.join(', ') : '無');
        const discoveryDetail = () => { switch (scopeInfo.discoverySystem_selectionType) { case '全選': return `全選 (${scopeInfo.discoverySystem_futurePlatforms}, ${scopeInfo.discoverySystem_includeCN})`; case '單選': return `單選: ${formatArray(scopeInfo.discoverySystem_platforms)}`; case '各平台皆不上架': return '各平台皆不上架'; default: return 'N/A'; } };
        const nclDetail = () => { if (!scopeInfo.nclClause_selectionType) return 'N/A'; switch (scopeInfo.nclClause_selectionType) { case '不上': return `不上: ${formatArray(scopeInfo.nclClause_doNotList)}`; case 'Embargo': return `Embargo: ${(scopeInfo.nclClause_embargoRules || []).map(r => `${r.target} - ${r.period}`).join('; ') || '無規則'}`; default: return 'N/A'; } };
        return (
            <div className="space-y-4 text-sm">
                <p><strong>第三方平台:</strong> {scopeInfo.thirdPartyPlatform_tws}, {formatArray(scopeInfo.thirdPartyPlatform_consent)}</p>
                <p><strong>國際第三方發現系統:</strong> {discoveryDetail()}{scopeInfo.discoverySystem_selectionType !== '各平台皆不上架' ? `, ${formatArray(scopeInfo.discoverySystem_consent)}` : ''}</p>
                <p><strong>比對系統:</strong> {scopeInfo.comparisonSystem}</p>
                <p><strong>不上國圖條文｜第三方平台:</strong> {nclDetail()}</p>
                <p><strong>上架位置:</strong> {scopeInfo.listingLocation}</p>
                <p><strong>不上AL_CN_現行狀況:</strong> {scopeInfo.status_al_cn || 'N/A'}</p>
            </div>
        );
    };

    const TruncatedText: React.FC<{ text: string; maxLength: number }> = ({ text, maxLength }) => { const displayText = text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text; return <span title={text}>{displayText || '(空白)'}</span>; };

    const { selectMultiple, deselectMultiple, isSelected } = useBatch();

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const allItems = sortedSearchResults
            .filter(c => c.id !== undefined)
            .map(c => ({
                id: c.id!,
                label: c.contractTarget?.title || 'Unknown Contract',
                data: c,
                type: 'academic' as const
            }));

        if (checked) {
            selectMultiple(allItems);
        } else {
            deselectMultiple(allItems.map(item => item.id));
        }
    };

    const allSelected = sortedSearchResults.length > 0 && sortedSearchResults.every(c => c.id && isSelected(c.id));
    const isIndeterminate = sortedSearchResults.some(c => c.id && isSelected(c.id)) && !allSelected;

    const columnsToRender = useMemo(() => {
        const columnMap = new Map(allColumns.map(c => [c.id, c]));
        return displayedColumns.map(id => columnMap.get(id)).filter(Boolean);
    }, [displayedColumns, allColumns]);

    const toggleRoyaltyRow = (contractId: string) => {
        setExpandedRoyaltyRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(contractId)) {
                newSet.delete(contractId);
            } else {
                newSet.add(contractId);
            }
            return newSet;
        });
    };

    const renderCellContent = useCallback((contract, columnId) => {
        const value = getFieldValue(contract, columnId);
        const formatArray = (arr) => (arr && arr.length > 0 ? arr.join(', ') : '無');

        switch (columnId) {
            case 'contractTarget.title': return <button onClick={() => showContractDetail(contract)} className="text-indigo-600 hover:text-indigo-900 font-medium text-left"><TruncatedText text={value} maxLength={30} /></button>;
            case 'basicInfo.autoRenew': return <TruncatedText text={`每年續 ${getFieldValue(contract, 'basicInfo.autoRenewYears') || '_'} 年, 每 ${getFieldValue(contract, 'basicInfo.autoRenewFrequency') || '_'} 年`} maxLength={20} />;
            case 'rightsInfo.authorizationForm': return <TruncatedText text={`${getFieldValue(contract, 'rightsInfo.authorizationFormMain') || ''} - ${getFieldValue(contract, 'rightsInfo.authorizationFormSub') || ''}`} maxLength={20} />;
            case 'royaltyInfo': return <button onClick={() => toggleRoyaltyRow(contract.id!)} className="px-2 py-1 text-xs text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200">查看</button>;
            case 'scopeInfo.thirdPartyPlatform': return <TruncatedText text={`${getFieldValue(contract, 'scopeInfo.thirdPartyPlatform_tws')}, ${formatArray(getFieldValue(contract, 'scopeInfo.thirdPartyPlatform_consent'))}`} maxLength={25} />;
            case 'scopeInfo.discoverySystem': return <TruncatedText text={getFieldValue(contract, 'scopeInfo.discoverySystem_selectionType') === '單選' ? formatArray(getFieldValue(contract, 'scopeInfo.discoverySystem_platforms')) : getFieldValue(contract, 'scopeInfo.discoverySystem_selectionType')} maxLength={25} />;
            case 'scopeInfo.nclClause': return <TruncatedText text={getFieldValue(contract, 'scopeInfo.nclClause_selectionType')} maxLength={25} />;
            case 'remarks.remarks': return <TruncatedText text={getFieldValue(contract, 'remarks')} maxLength={40} />;
            case 'registrationInfo.contractVersion': return <TruncatedText text={Array.isArray(value) ? value.join(', ') : value} maxLength={20} />;
            default:
                const displayValue = (value !== null && value !== undefined && value !== '') ? String(value) : '';
                return <TruncatedText text={displayValue} maxLength={20} />;
        }
    }, []);

    return (
        <div className="bg-gray-100 font-sans">
            <style>{`
            @keyframes fade-in-up {
                0% { opacity: 0; transform: translateY(20px); }
                100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.3s ease-out forwards;
            }
        `}</style>
            {['contract-detail'].includes(currentPage) && (<FloatingTOC onJump={handleTocJump} />)}

            <main ref={mainContentRef} className="container mx-auto p-8" style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
                {currentPage === 'search-contract' && (<SearchPage onSearch={handleSearch} />)}

                {currentPage === 'search-results' && (
                    <div className="w-full">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">搜尋結果</h2>
                                    <p className="text-sm text-gray-500 mt-1">找到 {searchResults.length} 筆合約</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Button variant="ghost" onClick={() => setIsFilterDrawerOpen(true)} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"><Filter size={16} className="mr-2" />進階篩選</Button>
                                    <Button variant="ghost" onClick={() => setShowColumnSelector(true)} className="border border-gray-300 text-gray-700 hover:bg-gray-50"><Columns size={16} className="mr-2" />篩選顯示欄位</Button>
                                    <Button variant="ghost" onClick={() => navigateTo('search-contract')} className="border border-gray-300 text-gray-700 hover:bg-gray-50">返回搜尋</Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 text-left bg-gray-50 sticky left-0 z-10 w-12">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    checked={allSelected}
                                                    onChange={handleSelectAll}
                                                    ref={input => { if (input) input.indeterminate = isIndeterminate; }}
                                                />
                                            </th>
                                            {columnsToRender.map((col, index) => (
                                                <th key={col.id}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, index)}
                                                    onDragEnter={(e) => handleDragEnter(e, index)}
                                                    onDragEnd={handleDragEnd}
                                                    onDrop={handleDrop}
                                                    onDragOver={(e) => e.preventDefault()}
                                                    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-move transition-colors
                                                ${dragOverColId === col.id ? 'bg-indigo-100' : ''}`}>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => col.id !== 'royaltyInfo' && requestSort(col.id)} className="flex items-center gap-1 hover:text-gray-800">
                                                            <span>{col.label}</span>
                                                            {sortConfig.key === col.id ? (
                                                                sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                                            ) : (
                                                                col.id !== 'royaltyInfo' && <ArrowUpDown size={14} className="text-gray-400" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedSearchResults.map(contract => (
                                            <React.Fragment key={contract.id}>
                                                <tr className={`${isSelected(contract.id!) ? 'bg-indigo-50' : ''} hover:bg-gray-50`}>
                                                    <td className="px-4 py-3 whitespace-nowrap sticky left-0 z-10 bg-white">
                                                        <BatchSelectionCheckbox
                                                            id={contract.id!}
                                                            label={contract.contractTarget?.title || 'Unknown Contract'}
                                                            data={contract}
                                                            type="academic"
                                                        />
                                                    </td>
                                                    {columnsToRender.map((col, index) => (
                                                        <td key={col.id} className={`px-4 py-3 whitespace-nowrap transition-colors
                                                    ${dragOverColId === col.id ? 'bg-indigo-50' : ''}`}>
                                                            {renderCellContent(contract, col.id)}
                                                        </td>
                                                    ))}
                                                </tr>
                                                {expandedRoyaltyRows.has(contract.id!) && (
                                                    <tr className="bg-indigo-50">
                                                        <td colSpan={columnsToRender.length + 1} className="p-0">
                                                            <div className="p-4">
                                                                <h4 className="font-semibold mb-2 text-indigo-800">權利金比例詳情</h4>
                                                                <div className="overflow-x-auto">
                                                                    <table className="min-w-full text-xs bg-white rounded-md">
                                                                        <thead className="bg-gray-100"><tr><th className="p-2 border">日期方案</th><th className="p-2 border">卷期規則</th><th className="p-2 border">單位(%)</th><th className="p-2 border">作者(%)</th><th className="p-2 border">代理商(%)</th><th className="p-2 border">AP(%)</th><th className="p-2 border">其他</th></tr></thead>
                                                                        <tbody>
                                                                            {(contract.royaltyInfo || []).map(scheme => (scheme.volumeRules || []).map((rule, rIndex) => (
                                                                                <tr key={rule.id}>
                                                                                    {rIndex === 0 && <td rowSpan={scheme.volumeRules.length} className="p-2 border align-top">{`${scheme.startDate || ''} ~ ${scheme.endDate || ''}`}</td>}
                                                                                    <td className="p-2 border align-top">{`${formatVolumeIdentifier(rule.startVolumeInfo)} ~ ${formatVolumeIdentifier(rule.endVolumeInfo)}`}</td><td className="p-2 border align-top">{rule.unit}</td><td className="p-2 border align-top">{rule.authorProfitPercentage}</td><td className="p-2 border align-top">{rule.agentProfitPercentage}</td><td className="p-2 border align-top">{rule.apProfitPercentage}</td><td className="p-2 border align-top">{rule.other}</td>
                                                                                </tr>
                                                                            )))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {currentPage === 'contract-detail' && currentContract && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">合約詳目: {currentContract.contractTarget?.title}</h2>
                            <div className="space-x-4">
                                <Button
                                    onClick={() => navigate(`/academic/contract/${currentContract.id}`)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                    <FileText size={16} className="mr-2" />
                                    維護
                                </Button>
                                <Button variant="ghost" onClick={() => navigateTo('search-results')} className="border border-gray-300 text-gray-700 hover:bg-gray-50">回上一頁</Button>
                            </div>
                        </div>
                        <div className="space-y-8">{tocSections.map(section => {
                            if (section.id === 'scope-info') { return <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6"><h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3>{renderScopeInfoDetail(currentContract.scopeInfo)}</div>; }
                            if (section.id === 'royalty-info') { return (<div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6"><h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3><div className="overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-2 border">日期方案</th><th className="p-2 border">卷期規則</th><th className="p-2 border">單位(%)</th><th className="p-2 border">作者(%)</th><th className="p-2 border">代理商(%)</th><th className="p-2 border">AP(%)</th><th className="p-2 border">其他</th></tr></thead><tbody className="divide-y divide-gray-200">{(currentContract.royaltyInfo || []).map((scheme, sIndex) => ((scheme.volumeRules || []).map((rule, rIndex) => (<tr key={rule.id}>{rIndex === 0 && (<td rowSpan={scheme.volumeRules.length} className="p-2 border align-top">{`${scheme.startDate || ''} ~ ${scheme.endDate || ''}`}</td>)}<td className="p-2 border align-top">{`${formatVolumeIdentifier(rule.startVolumeInfo)} ~ ${formatVolumeIdentifier(rule.endVolumeInfo)}`}</td><td className="p-2 border align-top">{rule.unit}</td><td className="p-2 border align-top">{rule.authorProfitPercentage}</td><td className="p-2 border align-top">{rule.agentProfitPercentage}</td><td className="p-2 border align-top">{rule.apProfitPercentage}</td><td className="p-2 border align-top">{rule.other}</td></tr>))))}</tbody></table></div></div>); }
                            if (section.id === 'scan-file') { return (<div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6"><h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3><div className="flex items-center gap-3 text-gray-900"><FileText size={18} /> <span>{getFileName(currentContract.scanFile)}</span></div></div>) }
                            if (section.id === 'remarks') { return (<div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6"><h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3><p className="text-gray-800 whitespace-pre-wrap">{currentContract.remarks || 'N/A'}</p></div>) }
                            if (section.id === 'maintenance-history') {
                                const history = currentContract.maintenanceHistory;
                                const hasHistory = history && history.length > 0;
                                return (
                                    <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                                            {hasHistory && (
                                                <Button
                                                    onClick={() => handleDownloadHistory(history, currentContract.registrationInfo?.managementNo)}
                                                    className="bg-green-600 text-white hover:bg-green-700 border-transparent"
                                                >
                                                    <Download size={16} className="mr-2" />
                                                    下載維護歷程
                                                </Button>
                                            )}
                                        </div>
                                        {!hasHistory ? (
                                            <p className="text-gray-500">尚無維護紀錄。</p>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full text-sm">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left font-semibold text-gray-600 w-1/5">時間戳</th>
                                                            <th className="px-4 py-2 text-left font-semibold text-gray-600 w-1/5">維護人員</th>
                                                            <th className="px-4 py-2 text-left font-semibold text-gray-600 w-3/5">變更內容</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200">
                                                        {history.map((record, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-3 align-top whitespace-nowrap text-gray-500">{record.timestamp}</td>
                                                                <td className="px-4 py-3 align-top whitespace-nowrap text-gray-500">{record.userName}</td>
                                                                <td className="px-4 py-3 align-top">
                                                                    <table className="min-w-full">
                                                                        <tbody className="divide-y divide-gray-100">
                                                                            {record.changes.map((change, cIndex) => (
                                                                                <tr key={cIndex} className="bg-white hover:bg-gray-50">
                                                                                    <td className="py-2 pr-2 font-semibold text-gray-800 w-1/3">{change.field}</td>
                                                                                    <td className="py-2 text-red-600 line-through w-1/3">{change.oldValue || '(空白)'}</td>
                                                                                    <td className="py-2 text-green-700 font-medium w-1/3">{change.newValue || '(空白)'}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            const sectionData = getFieldValue(currentContract, sectionIdToDataKey(section.id)); const fields = fieldConfig[section.id]; if (!fields) return <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6"><h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3><div className="text-gray-400 italic">此區塊無欄位資料。</div></div>;
                            return (<div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6"><h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{fields.map(field => { if (field.condition && !field.condition(currentContract)) return null; if (field.id === 'damages') { const hasClause = getFieldValue(sectionData, 'damages_hasClause'); const description = getFieldValue(sectionData, 'damages_description'); const display = `${hasClause}${hasClause === '是' && description ? `: ${description}` : ''}`; return <div key={field.id as string} className={field.fullWidth ? 'lg:col-span-3' : ''}><label className="block text-sm font-medium text-gray-500">{field.label}</label><div className="text-gray-900 mt-1">{display}</div></div> } if (field.type === 'group') { if (field.id === 'autoRenew') { const years = getFieldValue(sectionData, 'autoRenewYears') || '___'; const frequency = getFieldValue(sectionData, 'autoRenewFrequency') || '___'; return (<div key={field.id as string} className="lg:col-span-2"><label className="block text-sm font-medium text-gray-500">{field.label}</label><div className="text-gray-900 mt-1">{`自動續約 ${years} 年，每 ${frequency} 年續一次`}</div></div>); } return null; } if (field.type === 'cascading-select') { const main = getFieldValue(sectionData, 'authorizationFormMain'); const sub = getFieldValue(sectionData, 'authorizationFormSub'); const display = (main && sub) ? `${main} - ${sub}` : (main || 'N/A'); return (<div key={field.id as string} className={field.fullWidth ? 'lg:col-span-3' : ''}><label className="block text-sm font-medium text-gray-500">{field.label}</label><div className="text-gray-900 mt-1">{display}</div></div>); } const value = getFieldValue(sectionData, field.id as string); const displayValue = (value !== null && value !== undefined && value !== '') ? (Array.isArray(value) ? value.join(', ') : String(value)) : 'N/A'; return (<div key={field.id as string} className={field.fullWidth ? 'lg:col-span-3' : ''}><label className="block text-sm font-medium text-gray-500">{field.label}</label><div className="text-gray-900 mt-1">{displayValue}</div></div>); })}</div></div>);
                        })}</div></div>
                )}

            </main>

            <FilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} activeFilters={activeFilters} onFilterChange={setActiveFilters} />
            <ColumnSelector isOpen={showColumnSelector} onClose={() => setShowColumnSelector(false)} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />

            {message.show && (<div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-[100] ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{message.message}</div>)}
        </div>
    );
};


const SearchPage: React.FC<{ onSearch: (criteria: SearchCriteria) => void }> = ({ onSearch }) => {
    const navigate = useNavigate();
    const [criteria, setCriteria] = useState<SearchCriteria>({ keyword: '', dateMode: 'effective', startDate: '', endDate: '', rollbackDate: '' });
    const handleInputChange = (field: keyof SearchCriteria, value: string) => { setCriteria(prev => ({ ...prev, [field]: value })); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSearch(criteria); };
    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">搜尋合約</h2>

            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">關鍵字</label><input type="text" value={criteria.keyword} onChange={e => handleInputChange('keyword', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="搜尋 PublicationID, 刊名, 各類編號, 簽約單位..." /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">合約期間</label><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><select value={criteria.dateMode} onChange={e => handleInputChange('dateMode', e.target.value)} className="md:col-span-1 w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="effective">在此期間內有效</option><option value="starts">在此期間內開始</option><option value="ends">在此期間內到期</option><option value="within">起訖日皆在此期間內</option></select><div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center"><input type="date" value={criteria.startDate} onChange={e => handleInputChange('startDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /><input type="date" value={criteria.endDate} onChange={e => handleInputChange('endDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">回溯至 (選填)</label><input type="date" value={criteria.rollbackDate} onChange={e => handleInputChange('rollbackDate', e.target.value)} className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg" /><p className="text-xs text-gray-500 mt-1">選擇一個過去的日期，以檢視當天所有合約的歷史狀態。</p></div>
            <div className="flex justify-end"><Button type="submit"><Search size={18} className="mr-2" />執行搜尋</Button></div>
        </form>
    );
};


export default AcademicDeptContractModule as React.FC;
// 為了向後相容，也導出為 AcademicSearchContract
export { AcademicDeptContractModule as AcademicSearchContract };
