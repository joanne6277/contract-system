/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-nocheck - 暫時跳過型別檢查，待後續逐步重構
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, X, Search, Plus, FileText, Menu, AlertTriangle, Filter, Columns, ArrowUpDown, ChevronUp, Download } from 'lucide-react';
import { FloatingTOC } from '@/components/common';
import { useBatch } from '../../batch/context/BatchContext';
import { BatchSelectionCheckbox } from '../../batch/components/BatchSelectionCheckbox';
import { mockDDDContracts } from '@/data/mockDDDContracts';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';


// --- Helper Functions ---
import { getTuFuFieldValue as getFieldValue, fieldKeyToNameMap } from '../constants/contractFields';

// --- 圖服部搜尋合約模組 ---

// --- 組件 Props 型別 ---
interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    activeFilters: Record<string, any>;
    onFilterChange: (filters: Record<string, any>) => void;
    searchContractType: string;
}

interface FilterRadioGroupProps {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
}

interface FilterTextInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

interface FilterRangeInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholderStart?: string;
    placeholderEnd?: string;
}

interface CollapsibleSectionProps {
    title: string;
    children: ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

interface ColumnSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    visibleColumns: Set<string>;
    setVisibleColumns: (columns: Set<string>) => void;
}

interface MultiSelectPillFilterProps {
    label: string;
    value: { platform: string; state: string }[];
    onChange: (value: { platform: string; state: string }[]) => void;
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

interface ContractData {
    id?: string;
    registrationInfo: {
        airitiContractNo: string;
        ebookContractNo: string;
        acquisitionMaintainer: string;
        asTeamMaintainer: string;
    };
    basicInfo: {
        publisherName: string;
        licensorPersonInCharge: string;
        licensorRep: string;
        airitiSignatory: string;
        contractTargetType: string;
        contractStatus: string;
        earlyTermination: string;
        contractStartDate: string;
        contractEndDate: string;
        autoRenewYears: string;
        autoRenewTimes: string;
        thereafter: string;
        contractVersionNo: string;
        contractName: string;
        specialPenalties: string;
        jurisdiction: string;
    };
    rightsInfo: { // [電子書]書籍基本權利
        trialPercentage: string;
        printingPercentage: string;
        fullTextDigitization: boolean;
        trialAccess: boolean;
        tts: boolean;
        fullTextSearch: boolean;
        dataComparison: boolean;
        systemData: boolean;
        captureAnalysisProcessing: boolean;
        autoGeneration: boolean;
        algorithmTraining: boolean;
        languageSwitching: boolean;
        chapterPresentation: boolean;
        chapterSales: boolean;
        marketingModel: string;
        publisherSpecs: string;
        doiApplication: boolean;
        doiFee: string;
        thirdPartyAuthorization: boolean;
        thirdPartyConsignment: boolean;
        salesChannels: string[];
        paymentMethodRights: string[];
        listingSchedule: string;
        listingItems: string;
        listingPlatforms: string[];
        tradingConditions: string;
        contentPresentation: string;
        serviceModel: string;
    };
    scopeInfo: { // [電子書]2B銷售權利
        b2bSalesRightsToggle: string;
        b2bAuthorizationType: string;
        b2bSplitPercentage: string;
        b2bSalesRegion: string;
        b2bMinMultiple: string;
        b2bRoyaltyAdjustment: string;
        b2bPricingPower: string;
        b2bLease: boolean;
        b2bBuyout: boolean;
        b2bPayPerUse: boolean;
        b2bPda: boolean;
        b2bAlliance: boolean;
        b2bPublicTender: boolean;
        b2bRestrictiveTender: boolean;
        subscription: string;
        eLibrarySalesRight: string;
        eLibraryContractType: string;
        eLibrarySplit: string;
        eLibraryPricing: string;
    };
    otherClauses: { // [電子書]2C銷售權利
        b2cSalesRightsToggle: string;
        b2cAuthorizationType: string;
        b2cSplitPercentage: string;
        b2cSalesRegion: string;
        b2cQuotationPrinciple: string;
        b2cRoyaltyAdjustment: string;
        b2cPricingPower: string;
        b2cLease: boolean;
        b2cBuyout: boolean;
        b2cPayPerUse: boolean;
        b2cVariablePriceAuth: boolean;
        shuNiuXiong: boolean;
        kingstone: boolean;
        sanmin: boolean;
        taaze: boolean;
        shuNiuReserved: string;
        trmsSalesRightsToggle: string;
        trmsSplitPercentage: string;
        distributorPlatformToggle: string;
        distributorSplit: string;
        cannotListPlatforms: string;
        amazon: boolean;
        google: boolean;
        kobo: boolean;
        pubu: boolean;
        eslite: boolean;
        pchome: boolean;
        readmoo: boolean;
        udn: boolean;
        bookwalker: boolean;
        hyweb: boolean;
        bookscom: boolean;
        apple: boolean;
        mybook: boolean;
        momo: boolean;
        twb: boolean;
        hkUe: boolean;
        ingram: boolean;
        overdrive: boolean;
        hami: boolean;
        truth: boolean;
        wechat: boolean;
        distributorReserved: string;
    };
    accountingInfo: {
        entityType: string;
        locationType: string;
        billingCycle: string;
        paymentTerm: string;
        paymentMethod: string;
        accountHolderName: string;
        taxId: string;
        idNumber: string;
        bankName: string;
        bankCode: string;
        branchName: string;
        branchCode: string;
        accountNumber: string;
        swiftCode: string;
        bankAddress: string;
        remittanceNotes: string;
    };
    twBookRights: {
        exclusiveAuthorization: string;
        exclusiveConditions: string;
        trialTwBook: boolean;
        fullTextDigitizationTwBook: string;
    };
    twBookAccounting: {
        twBookOverseasDiscount: string;
        twBookBillingCycle: string;
        twBookPaymentMethod: string;
        twBookPaymentTerms: string;
        twBookAccountHolder: string;
        twBookPayeeInfo: string;
        twBookBankName: string;
        twBookBranchName: string;
        twBookAccountNumber: string;
    };
    twBookLogistics: {
        minimumShipmentThreshold: string;
        freeShippingThreshold: string;
        returnCycle: string;
        nonDefectiveReturnShippingFee: string;
        domesticReturnShippingFee: string;
        sampleBookDiscount: string;
        sampleBookBillingCycle: string;
        authorizedSalesRegion: string;
        subDistribution: string;
    };
    twBookContact: {
        publisherRegion: string;
        contactPersonInfo: string;
        contactPersonTitle: string;
        contactPersonEmail: string;
        contactPersonPhone: string;
        companyPostalCode: string;
        companyAddress: string;
        logisticsPostalCode: string;
        logisticsAddress: string;
    };
    remarks: string;
    scanFile?: File | string | null;
    createdAt?: Date;
    maintenanceHistory?: MaintenanceRecord[];
}

interface SearchCriteria {
    keyword: string;
    contractTargetType: string;
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

const sectionIdToDataKey = (id: string): keyof ContractData => {
    const key = id.replace(/-(\w)/g, (_, c) => c.toUpperCase());
    return key as keyof ContractData;
}

// --- 常數與對照表 ---
const tocSections = [
    { id: 'registration-info', title: '造冊資訊' },
    { id: 'basic-info', title: '基本資料' },
    { id: 'rights-info', title: '[電子書]書籍基本權利' },
    { id: 'scope-info', title: '[電子書]2B銷售權利' },
    { id: 'other-clauses', title: '[電子書]2C銷售權利' },
    { id: 'accounting-info', title: '[電子書]帳務相關資訊' },
    { id: 'tw-book-rights', title: '[台版書]基本權利' },
    { id: 'tw-book-accounting', title: '[台版書]採購/帳務相關' },
    { id: 'tw-book-logistics', title: '[台版書]採購/集貨相關' },
    { id: 'tw-book-contact', title: '[台版書]窗口資訊' },
    { id: 'scan-file', title: '合約掃描檔' },
    { id: 'remarks', title: '備註' },
    { id: 'maintenance-history', title: '維護歷程' },
];

// fieldKeyToNameMap is imported

const dropdownOptions: { [key: string]: { value: string; label: string }[] } = {
    'basicInfo.contractTargetType': [
        { value: 'ebook', label: '電子書' },
        { value: 'ejournal', label: '電子雜誌' },
        { value: 'taiwan_book', label: '台版書' }
    ],
    'accountingInfo.entityType': [
        { value: 'public', label: '公部門' },
        { value: 'private', label: '私部門' },
        { value: 'individual', label: '個人' }
    ],
    'twBookAccounting.twBookBillingCycle': [
        { value: 'cash', label: '付現' },
        { value: 'monthly', label: '月結' },
        { value: 'quarterly', label: '季結' },
        { value: 'semi_annually', label: '半年結' },
        { value: 'annually', label: '年結' }
    ],
    'twBookLogistics.returnCycle': [{ value: 'semi_annually', label: '每半年退貨一次' }, { value: 'non_returnable', label: '不可退貨' }],
    'twBookLogistics.nonDefectiveReturnShippingFee': [{ value: 'airiti', label: '華藝支付' }, { value: 'publisher', label: '出版社支付' }, { value: 'non_returnable', label: '不可退貨' }],
    'twBookLogistics.domesticReturnShippingFee': [{ value: 'airiti', label: '華藝支付' }, { value: 'publisher', label: '出版社支付' }, { value: 'non_returnable', label: '不可退貨' }],
};

const radioOptions: { [key: string]: { value: string, label: string }[] } = {
    'basicInfo.contractStatus': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'basicInfo.earlyTermination': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'accountingInfo.locationType': [{ value: 'domestic', label: '國內單位' }, { value: 'international', label: '國外單位' }],
    'basicInfo.thereafter': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'scopeInfo.b2bSalesRightsToggle': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }, { value: 'by_title', label: 'by title' }],
    'scopeInfo.b2bRoyaltyAdjustment': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'scopeInfo.b2bPricingPower': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'scopeInfo.subscription': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'scopeInfo.eLibrarySalesRight': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'otherClauses.b2cSalesRightsToggle': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }, { value: 'by_title', label: 'by title' }],
    'otherClauses.b2cRoyaltyAdjustment': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'otherClauses.b2cPricingPower': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'otherClauses.trmsSalesRightsToggle': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }, { value: 'by_title', label: 'by title' }],
    'otherClauses.distributorPlatformToggle': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }, { value: 'by_title', label: 'by title' }],
    'twBookRights.exclusiveAuthorization': [{ value: 'exclusive', label: '專屬' }, { value: 'non_exclusive', label: '非專屬' }],
    'twBookRights.fullTextDigitizationTwBook': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'twBookAccounting.twBookPaymentMethod': [{ value: 'remittance', label: '匯款' }, { value: 'check', label: '支票' }],
    'twBookAccounting.twBookPayeeInfo': [{ value: 'remittance', label: '銀行' }, { value: 'check', label: '郵局' }],
    'twBookLogistics.subDistribution': [{ value: 'yes', label: '是' }, { value: 'no', label: '否' }],
    'twBookContact.publisherRegion': [{ value: 'domestic', label: '國內' }, { value: 'overseas', label: '海外' }],
};

const allPlatforms = [
    { id: 'shuNiuXiong', label: '灰熊' }, { id: 'kingstone', label: '金石堂' }, { id: 'sanmin', label: '三民' }, { id: 'taaze', label: '讀冊' },
    { id: 'amazon', label: 'Amazon' }, { id: 'google', label: 'Google' }, { id: 'kobo', label: 'Kobo' },
    { id: 'pubu', label: 'Pubu' }, { id: 'eslite', label: '誠品(Pubu串接)' }, { id: 'pchome', label: 'PCHOME(Pubu串接)' },
    { id: 'readmoo', label: 'Readmoo' }, { id: 'udn', label: 'UDN' }, { id: 'bookwalker', label: '台灣漫讀BOOKWALKER' },
    { id: 'hyweb', label: '凌網' }, { id: 'bookscom', label: '博客來' }, { id: 'apple', label: 'Apple' },
    { id: 'mybook', label: 'Mybook' }, { id: 'momo', label: 'MOMO' }, { id: 'twb', label: 'TWB' },
    { id: 'hkUe', label: '香港聯合電子' }, { id: 'ingram', label: 'Ingram' }, { id: 'overdrive', label: 'Overdrive' },
    { id: 'hami', label: 'Hami' }, { id: 'truth', label: '恩道' }, { id: 'wechat', label: '微信' }
];

const searchContractTypeOptions = [
    { value: 'e-content', label: '電子書/電子雜誌' },
    { value: 'taiwan_book', label: '台版書' }
];

// --- 顯示欄位設定 ---
const columnConfig = {
    defaultVisible: [
        'registrationInfo.airitiContractNo',
        'registrationInfo.ebookContractNo',
        'basicInfo.publisherName',
        'basicInfo.contractStatus',
        'basicInfo.earlyTermination',
        'basicInfo.contractDateRange',
        'scopeInfo.b2bSalesRightsToggle',
        'otherClauses.b2cSalesRightsToggle',
        'otherClauses.shuNiuXiong',
        'otherClauses.trmsSalesRightsToggle',
        'otherClauses.distributorPlatformToggle',
        'twBookAccounting.twBookOverseasDiscount',
    ],
    selectable: [
        {
            group: '造冊資訊',
            columns: [
                { id: 'registrationInfo.airitiContractNo', label: '華藝合約編號' },
                { id: 'registrationInfo.ebookContractNo', label: '【圖書服務部】合約編號' },
                { id: 'registrationInfo.acquisitionMaintainer', label: '徵集維護人員' },
                { id: 'registrationInfo.asTeamMaintainer', label: 'as組維護人員' },
            ]
        },
        {
            group: '基本資料',
            columns: [
                { id: 'basicInfo.publisherName', label: '出版單位名稱' },
                { id: 'basicInfo.airitiSignatory', label: '華藝簽約人員' },
                { id: 'basicInfo.contractTargetType', label: '合約標的類型' },
                { id: 'basicInfo.contractStatus', label: '合作中' },
                { id: 'basicInfo.earlyTermination', label: '解約' },
                { id: 'basicInfo.contractDateRange', label: '合約起訖日' },
                { id: 'basicInfo.autoRenewYears', label: '自動續約年' },
                { id: 'basicInfo.autoRenewTimes', label: '自動續約次數' },
                { id: 'basicInfo.thereafter', label: '其後亦同' },
                { id: 'basicInfo.contractVersionNo', label: '合約版本號' },
                { id: 'basicInfo.specialPenalties', label: '出版社自訂特殊罰責' },
            ]
        },
        {
            group: '電子書權利 (通用)',
            columns: [
                { id: 'rightsInfo.fullTextDigitization', label: '全文數位化' },
                { id: 'rightsInfo.trialAccess', label: '試用權限' },
                { id: 'rightsInfo.tts', label: 'TTS' },
                { id: 'rightsInfo.thirdPartyAuthorization', label: '第三方授權' },
                { id: 'rightsInfo.thirdPartyConsignment', label: '第三方代銷' },
                { id: 'rightsInfo.doiApplication', label: 'DOI申請' },
            ]
        },
        {
            group: '電子書權利 (B2B)',
            columns: [
                { id: 'scopeInfo.b2bSalesRightsToggle', label: 'B2B銷售權利' },
                { id: 'scopeInfo.b2bAuthorizationType', label: 'B2B授權類型' },
            ]
        },
        {
            group: '電子書權利 (B2C)',
            columns: [
                { id: 'otherClauses.b2cSalesRightsToggle', label: 'B2C銷售權利' },
                { id: 'otherClauses.b2cAuthorizationType', label: 'B2C授權類型' },
                { id: 'otherClauses.shuNiuXiong', label: '灰熊' },
                { id: 'otherClauses.kingstone', label: '金石堂' },
                { id: 'otherClauses.sanmin', label: '三民' },
                { id: 'otherClauses.taaze', label: '讀冊' },
                { id: 'otherClauses.trmsSalesRightsToggle', label: 'TRMS銷售權利' },
                { id: 'otherClauses.distributorPlatformToggle', label: '經銷平台上架權' },
                { id: 'otherClauses.platformRightsStatus', label: '平台權利狀態' },
            ]
        },
        {
            group: '台版書採購/帳務相關',
            columns: [
                { id: 'twBookAccounting.twBookOverseasDiscount', label: '台版書海外供貨折扣(含稅)' },
                { id: 'twBookAccounting.twBookPaymentMethod', label: '貨款付款方式' },
                { id: 'twBookAccounting.twBookPaymentTerms', label: '貨款支付時間(票期)' },
                { id: 'twBookAccounting.twBookAccountHolder', label: '戶名/抬頭' },
                { id: 'twBookAccounting.twBookPayeeInfo', label: '收款單位' },
                { id: 'twBookAccounting.twBookBankName', label: '銀行名稱' },
                { id: 'twBookAccounting.twBookBranchName', label: '分行/支局' },
                { id: 'twBookAccounting.twBookAccountNumber', label: '帳號' },
            ]
        }
    ]
};

const taiwaneseBookColumnConfig = {
    defaultVisible: [
        'basicInfo.contractStatus',
        'registrationInfo.ebookContractNo',
        'basicInfo.publisherName',
        'registrationInfo.airitiContractNo',
        'basicInfo.contractDateRange',
        'twBookAccounting.twBookOverseasDiscount',
    ],
    selectable: [
        {
            group: '造冊資訊',
            columns: [
                { id: 'registrationInfo.acquisitionMaintainer', label: '徵集維護人員' },
                { id: 'registrationInfo.asTeamMaintainer', label: 'as組維護人員' },
                { id: 'basicInfo.contractStatus', label: '合約狀態' },
                { id: 'registrationInfo.ebookContractNo', label: '【圖服部】台版書合約編號' },
            ]
        },
        {
            group: '基本資訊',
            columns: [
                { id: 'basicInfo.contractVersionNo', label: '合約版本號' },
                { id: 'basicInfo.publisherName', label: '出版單位名稱' },
                { id: 'basicInfo.airitiSignatory', label: '華藝簽約人員' },
                { id: 'registrationInfo.airitiContractNo', label: '華藝合約編號' },
                { id: 'basicInfo.contractDateRange', label: '合約起訖日' },
                { id: 'basicInfo.autoRenewYears', label: '自動續約年' },
                { id: 'basicInfo.autoRenewTimes', label: '自動續約次數' },
                { id: 'basicInfo.thereafter', label: '其後亦同' },
            ]
        },
        {
            group: '帳務相關',
            columns: [
                { id: 'twBookAccounting.twBookOverseasDiscount', label: '台版書海外供貨折扣(含稅)' },
                { id: 'twBookAccounting.twBookPaymentMethod', label: '貨款付款方式' },
                { id: 'twBookAccounting.twBookPaymentTerms', label: '貨款支付時間(票期)' },
                { id: 'twBookAccounting.twBookAccountHolder', label: '戶名/抬頭' },
                { id: 'twBookAccounting.twBookPayeeInfo', label: '收款單位' },
                { id: 'twBookAccounting.twBookBankName', label: '銀行名稱' },
                { id: 'twBookAccounting.twBookBranchName', label: '分行/支局' },
                { id: 'twBookAccounting.twBookAccountNumber', label: '帳號' },
            ]
        }
    ]
};

// --- ADVANCED FILTER COMPONENTS ---
const PlatformConditionModal = ({ isOpen, onClose, onAddCondition, existingConditions }) => {
    const [platform, setPlatform] = useState('');
    const [state, setState] = useState('true');

    const availablePlatforms = useMemo(() => {
        const existingPlatformIds = new Set(existingConditions.map(c => c.platform));
        return allPlatforms.filter(p => !existingPlatformIds.has(p.id));
    }, [existingConditions]);

    useEffect(() => {
        if (availablePlatforms.length > 0) {
            setPlatform(availablePlatforms[0].id);
        } else {
            setPlatform('');
        }
    }, [availablePlatforms]);

    const handleSubmit = () => {
        if (platform) {
            onAddCondition({ platform, state });
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="新增平台條件"
            size="sm"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>取消</Button>
                    <Button onClick={handleSubmit} disabled={!platform}>新增</Button>
                </>
            }
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">平台名稱</label>
                    <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md">
                        {availablePlatforms.length > 0 ? (
                            availablePlatforms.map(p => <option key={p.id} value={p.id}>{p.label}</option>)
                        ) : (
                            <option disabled>沒有可用的平台</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">狀態</label>
                    <div className="flex gap-4">
                        <label className="flex items-center"><input type="radio" value="true" checked={state === 'true'} onChange={e => setState(e.target.value)} className="h-4 w-4" /><span className="ml-2 text-sm">是</span></label>
                        <label className="flex items-center"><input type="radio" value="false" checked={state === 'false'} onChange={e => setState(e.target.value)} className="h-4 w-4" /><span className="ml-2 text-sm">否</span></label>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const MultiSelectPillFilter = ({ label, value, onChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddCondition = (newCondition) => {
        onChange([...value, newCondition]);
    };

    const handleRemoveCondition = (platformToRemove) => {
        onChange(value.filter(c => c.platform !== platformToRemove));
    };

    const getPlatformLabel = (platformId) => allPlatforms.find(p => p.id === platformId)?.label || platformId;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
            <div className="p-2 border rounded-md min-h-[40px]">
                <div className="flex flex-wrap gap-2">
                    {value.map(condition => (
                        <span key={condition.platform} className="flex items-center gap-1.5 bg-indigo-100 text-indigo-800 text-sm font-medium px-2 py-0.5 rounded-full">
                            {getPlatformLabel(condition.platform)}: {condition.state === 'true' ? '是' : '否'}
                            <button onClick={() => handleRemoveCondition(condition.platform)} className="text-indigo-500 hover:text-indigo-800">
                                <X size={14} />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(true)} className="mt-2 text-indigo-600 hover:text-indigo-800">
                <Plus size={16} className="mr-1" /> 新增平台條件
            </Button>
            <PlatformConditionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddCondition={handleAddCondition}
                existingConditions={value}
            />
        </div>
    );
};


// --- FORM & UI COMPONENTS ---
const CollapsibleSection = ({ title, children, isOpen, onToggle }) => {
    return (
        <div className="py-4 border-b border-gray-100">
            <button onClick={onToggle} className="w-full flex justify-between items-center text-left font-semibold text-gray-700">
                <span>{title}</span>
                <ChevronDown className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
            </button>
            {isOpen && <div className="mt-4 space-y-4 pl-2">{children}</div>}
        </div>
    );
};

const FilterDrawer = ({ isOpen, onClose, activeFilters, onFilterChange, searchContractType }) => {
    const handleFilterChange = (key, value) => {
        const newFilters = { ...activeFilters };
        if (value === '' || value === undefined || (Array.isArray(value) && value.length === 0)) {
            delete newFilters[key];
        } else {
            newFilters[key] = value;
        }
        onFilterChange(newFilters);
    };

    const handleClear = () => { onFilterChange({}); };

    const [openSections, setOpenSections] = useState({
        registration: true,
        basicInfo: true,
        rightsAccounting: true,
        ebookRights: false,
        sales2b: false,
        sales2c: false,
        twBook: false,
    });

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    const booleanOptions = [{ value: 'true', label: '是' }, { value: 'false', label: '否' }];

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
                    {searchContractType === 'taiwan_book' ? (
                        <>
                            <CollapsibleSection title="造冊資訊" isOpen={openSections.registration !== false} onToggle={() => toggleSection('registration')}>
                                <FilterTextInput label="徵集維護人員" value={activeFilters.acquisitionMaintainer || ''} onChange={val => handleFilterChange('acquisitionMaintainer', val)} />
                                <FilterTextInput label="AS組維護人員" value={activeFilters.asTeamMaintainer || ''} onChange={val => handleFilterChange('asTeamMaintainer', val)} />
                                <FilterRadioGroup label="合約狀態" value={activeFilters.contractStatus || ''} options={radioOptions['basicInfo.contractStatus']} onChange={val => handleFilterChange('contractStatus', val)} />
                            </CollapsibleSection>
                            <CollapsibleSection title="基本資訊" isOpen={openSections.basicInfo !== false} onToggle={() => toggleSection('basicInfo')}>
                                <FilterTextInput label="合約版本號" value={activeFilters.contractVersionNo || ''} onChange={val => handleFilterChange('contractVersionNo', val)} />
                                <FilterTextInput label="合約名稱" value={activeFilters.contractName || ''} onChange={val => handleFilterChange('contractName', val)} />
                                <FilterTextInput label="自動續約年" value={activeFilters.autoRenewYears || ''} onChange={val => handleFilterChange('autoRenewYears', val)} />
                                <FilterTextInput label="自動續約次數" value={activeFilters.autoRenewTimes || ''} onChange={val => handleFilterChange('autoRenewTimes', val)} />
                                <FilterRadioGroup label="其後亦同" value={activeFilters.thereafter || ''} options={radioOptions['basicInfo.thereafter']} onChange={val => handleFilterChange('thereafter', val)} />
                            </CollapsibleSection>
                            <CollapsibleSection title="權利/帳務" isOpen={openSections.rightsAccounting !== false} onToggle={() => toggleSection('rightsAccounting')}>
                                <FilterRadioGroup label="全文數位化" value={activeFilters.fullTextDigitizationTwBook || ''} options={radioOptions['twBookRights.fullTextDigitizationTwBook']} onChange={val => handleFilterChange('fullTextDigitizationTwBook', val)} />
                                <FilterRangeInput
                                    label="台版書海外供貨折扣(含稅)"
                                    value={activeFilters.twBookOverseasDiscount || ''}
                                    onChange={val => handleFilterChange('twBookOverseasDiscount', val)}
                                    placeholderStart="起始值"
                                    placeholderEnd="結束值"
                                />
                            </CollapsibleSection>
                        </>
                    ) : (
                        <>
                            <CollapsibleSection title="基本資料" isOpen={openSections.basicInfo} onToggle={() => toggleSection('basicInfo')}>
                                <FilterTextInput label="徵集維護人員" value={activeFilters.acquisitionMaintainer || ''} onChange={val => handleFilterChange('acquisitionMaintainer', val)} />
                                <FilterTextInput label="AS組維護人員" value={activeFilters.asTeamMaintainer || ''} onChange={val => handleFilterChange('asTeamMaintainer', val)} />
                                <FilterRadioGroup label="合作中" value={activeFilters.contractStatus || ''} options={radioOptions['basicInfo.contractStatus']} onChange={val => handleFilterChange('contractStatus', val)} />
                                <FilterRadioGroup label="解約" value={activeFilters.earlyTermination || ''} options={radioOptions['basicInfo.earlyTermination']} onChange={val => handleFilterChange('earlyTermination', val)} />
                                <FilterTextInput label="自動續約年" value={activeFilters.autoRenewYears || ''} onChange={val => handleFilterChange('autoRenewYears', val)} />
                                <FilterTextInput label="自動續約次數" value={activeFilters.autoRenewTimes || ''} onChange={val => handleFilterChange('autoRenewTimes', val)} />
                                <FilterRadioGroup label="其後亦同" value={activeFilters.thereafter || ''} options={radioOptions['basicInfo.thereafter']} onChange={val => handleFilterChange('thereafter', val)} />
                                <FilterTextInput label="合約版本號" value={activeFilters.contractVersionNo || ''} onChange={val => handleFilterChange('contractVersionNo', val)} />
                                <FilterTextInput label="合約名稱" value={activeFilters.contractName || ''} onChange={val => handleFilterChange('contractName', val)} />
                            </CollapsibleSection>

                            <>
                                <CollapsibleSection title="電子書基本權利" isOpen={openSections.ebookRights} onToggle={() => toggleSection('ebookRights')}>
                                    <FilterRadioGroup label="全文數位化" value={activeFilters.fullTextDigitization || ''} options={booleanOptions} onChange={val => handleFilterChange('fullTextDigitization', val)} />
                                    <FilterRadioGroup label="試用權限" value={activeFilters.trialAccess || ''} options={booleanOptions} onChange={val => handleFilterChange('trialAccess', val)} />
                                    <FilterRadioGroup label="TTS" value={activeFilters.tts || ''} options={booleanOptions} onChange={val => handleFilterChange('tts', val)} />
                                    <FilterRadioGroup label="第三方授權" value={activeFilters.thirdPartyAuthorization || ''} options={booleanOptions} onChange={val => handleFilterChange('thirdPartyAuthorization', val)} />
                                    <FilterRadioGroup label="第三方代銷" value={activeFilters.thirdPartyConsignment || ''} options={booleanOptions} onChange={val => handleFilterChange('thirdPartyConsignment', val)} />
                                    <FilterRadioGroup label="DOI申請" value={activeFilters.doiApplication || ''} options={booleanOptions} onChange={val => handleFilterChange('doiApplication', val)} />
                                </CollapsibleSection>
                                <CollapsibleSection title="2B銷售權利" isOpen={openSections.sales2b} onToggle={() => toggleSection('sales2b')}>
                                    <FilterRadioGroup label="B2B銷售權利" value={activeFilters.b2bSalesRightsToggle || ''} options={radioOptions['scopeInfo.b2bSalesRightsToggle']} onChange={val => handleFilterChange('b2bSalesRightsToggle', val)} />
                                    <FilterTextInput label="B2B授權類型" value={activeFilters.b2bAuthorizationType || ''} onChange={val => handleFilterChange('b2bAuthorizationType', val)} />
                                    <FilterRadioGroup label="電子館合銷售權利" value={activeFilters.eLibrarySalesRight || ''} options={radioOptions['scopeInfo.eLibrarySalesRight']} onChange={val => handleFilterChange('eLibrarySalesRight', val)} />
                                </CollapsibleSection>
                                <CollapsibleSection title="2C銷售權利" isOpen={openSections.sales2c} onToggle={() => toggleSection('sales2c')}>
                                    <FilterRadioGroup label="B2C銷售權利" value={activeFilters.b2cSalesRightsToggle || ''} options={radioOptions['otherClauses.b2cSalesRightsToggle']} onChange={val => handleFilterChange('b2cSalesRightsToggle', val)} />
                                    <FilterTextInput label="B2C授權類型" value={activeFilters.b2cAuthorizationType || ''} onChange={val => handleFilterChange('b2cAuthorizationType', val)} />
                                    <FilterRadioGroup label="TRMS銷售權利" value={activeFilters.trmsSalesRightsToggle || ''} options={radioOptions['otherClauses.trmsSalesRightsToggle']} onChange={val => handleFilterChange('trmsSalesRightsToggle', val)} />
                                    <FilterRadioGroup label="經銷平台上架權" value={activeFilters.distributorPlatformToggle || ''} options={radioOptions['otherClauses.distributorPlatformToggle']} onChange={val => handleFilterChange('distributorPlatformToggle', val)} />
                                    <MultiSelectPillFilter
                                        label="平台權利狀態"
                                        value={activeFilters.platformRights || []}
                                        onChange={val => handleFilterChange('platformRights', val)}
                                    />
                                </CollapsibleSection>
                            </>
                        </>
                    )}
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
            {options.map(opt => <label key={opt.value} className="flex items-center"><input type="radio" name={label} value={opt.value} checked={value === opt.value} onChange={(e) => onChange(e.target.value)} className="h-4 w-4" /><span className="ml-2 text-sm">{opt.label}</span></label>)}
        </div>
    </div>
);
const FilterTextInput = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
        <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md" />
    </div>
);

const FilterRangeInput = ({ label, value, onChange, placeholderStart, placeholderEnd }) => {
    const [start, end] = (value || '').split('-');

    const handleStartChange = (e) => {
        const newStart = e.target.value;
        onChange(`${newStart}-${end || ''}`);
    };

    const handleEndChange = (e) => {
        const newEnd = e.target.value;
        onChange(`${start || ''}-${newEnd}`);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={start || ''}
                    onChange={handleStartChange}
                    className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md"
                    placeholder={placeholderStart}
                />
                <span className="text-gray-500">-</span>
                <input
                    type="number"
                    value={end || ''}
                    onChange={handleEndChange}
                    className="w-full text-sm px-3 py-1.5 border border-gray-300 rounded-md"
                    placeholder={placeholderEnd}
                />
            </div>
        </div>
    );
};

const ColumnSelector = ({ isOpen, onClose, visibleColumns, setVisibleColumns, selectableColumns, searchContractType }) => {
    const [tempVisibleColumns, setTempVisibleColumns] = useState(new Set(visibleColumns));
    const checkboxRef = useRef<{ [key: string]: HTMLInputElement | null }>({});

    useEffect(() => { setTempVisibleColumns(new Set(visibleColumns)); }, [isOpen, visibleColumns]);

    const handleToggle = (columnId) => {
        if (columnId === 'basicInfo.publisherName') return;
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
                    if (id !== 'basicInfo.publisherName') {
                        newSet.delete(id);
                    }
                });
            } else {
                columnIds.forEach(id => newSet.add(id));
            }
            return newSet;
        });
    };

    const handleApply = () => { setVisibleColumns(tempVisibleColumns); onClose(); };
    const handleReset = () => {
        const defaults = searchContractType === 'taiwan_book'
            ? taiwaneseBookColumnConfig.defaultVisible
            : columnConfig.defaultVisible;
        setTempVisibleColumns(new Set(defaults));
    };

    useEffect(() => {
        selectableColumns.forEach(group => {
            const groupColumnIds = group.columns.map(c => c.id);
            const areAllSelected = groupColumnIds.every(id => tempVisibleColumns.has(id));
            const areSomeSelected = groupColumnIds.some(id => tempVisibleColumns.has(id));
            const checkbox = checkboxRef.current[group.group];
            if (checkbox) {
                checkbox.checked = areAllSelected;
                checkbox.indeterminate = !areAllSelected && areSomeSelected;
            }
        });
    }, [tempVisibleColumns, selectableColumns]);

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
                {selectableColumns.map(group => (
                    <div key={group.group}>
                        <div className="flex items-center mb-3">
                            <input type="checkbox" id={`group-select-${group.group}`} ref={el => checkboxRef.current[group.group] = el} onChange={() => handleToggleGroup(group.columns)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2" />
                            <label htmlFor={`group-select-${group.group}`} className="font-semibold text-gray-700 cursor-pointer">{group.group}</label>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pl-6">
                            {group.columns.map(col => (
                                <label key={col.id} className={`flex items-center p-2 rounded-md ${col.id === 'basicInfo.publisherName' ? 'cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}>
                                    <input type="checkbox" checked={tempVisibleColumns.has(col.id)} onChange={() => handleToggle(col.id)} disabled={col.id === 'basicInfo.publisherName'} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed" />
                                    <span className={`ml-2 text-sm ${col.id === 'basicInfo.publisherName' ? 'text-gray-500' : 'text-gray-800'}`}>{col.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

const DDDSearchContract: React.FC = () => {
    // --- 狀態管理 ---
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState<string>('search-contract');
    const [contracts, setContracts] = useState<ContractData[]>([]);
    const [rawSearchResults, setRawSearchResults] = useState<ContractData[]>([]);
    const [searchResults, setSearchResults] = useState<ContractData[]>([]);
    const [currentContract, setCurrentContract] = useState<ContractData | null>(null);
    const [message, setMessage] = useState<MessageState>({ show: false, message: '', type: 'success' });
    const showMessage = useCallback((text: string, type: 'success' | 'error' = 'success') => { setMessage({ show: true, message: text, type }); setTimeout(() => setMessage(prev => ({ ...prev, show: false })), 3000); }, []);
    const mainContentRef = useRef<HTMLElement>(null);
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
    const [showColumnSelector, setShowColumnSelector] = useState(false);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columnConfig.defaultVisible));
    const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' });
    const [displayedColumns, setDisplayedColumns] = useState<string[]>(columnConfig.defaultVisible);
    const { selectMultiple, deselectMultiple, isSelected } = useBatch();
    // const { setSelectedContractIds } = useBatch(); // Wait, this isn't exposed by useBatch per context analysis, commenting out to prevent crash
    const [searchContractType, setSearchContractType] = useState('');
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const [dragOverColId, setDragOverColId] = useState<string | null>(null);
    const [lastSearchCriteria, setLastSearchCriteria] = useState<any>(null);

    // --- 初始化 Effect ---
    useEffect(() => {
        // 使用 mockDDDContracts 資料
        console.log('DDD Contracts Initialized:', mockDDDContracts.length);
        setContracts(mockDDDContracts as any);
    }, [],);

    useEffect(() => {
        console.log('TuFu Contracts State Updated:', contracts.length);
    }, [contracts]);

    const allColumns = useMemo(() => {
        const generic = columnConfig.selectable.flatMap(g => g.columns);
        const tw = taiwaneseBookColumnConfig.selectable.flatMap(g => g.columns);
        const unique = new Map();
        generic.forEach(c => unique.set(c.id, c));
        tw.forEach(c => unique.set(c.id, c));
        return Array.from(unique.values());
    }, []);
    useEffect(() => { setDisplayedColumns(prevOrder => { const newOrder = prevOrder.filter(id => visibleColumns.has(id)); const currentOrderSet = new Set(newOrder); const addedColumns = [...visibleColumns].filter(id => !currentOrderSet.has(id)); return [...newOrder, ...addedColumns]; }); }, [visibleColumns]);

    const filteredTocSections = useMemo(() => {
        if (currentPage === 'contract-detail' && currentContract) {
            const type = currentContract.basicInfo.contractTargetType;
            if (type === 'taiwan_book') {
                return tocSections.filter(s => !s.title.includes('[電子書]'));
            }
            if (['ebook', 'ejournal'].includes(type)) {
                return tocSections.filter(s => !s.title.includes('[台版書]'));
            }
        }
        return tocSections;
    }, [currentContract, currentPage]);



    // --- Search & Filter Logic ---
    const handleSearch = useCallback((criteria: SearchCriteria) => {
        console.log('handleSearch called with:', criteria);

        if (criteria.contractTargetType !== searchContractType) {
            setSearchContractType(criteria.contractTargetType);
            if (criteria.contractTargetType === 'taiwan_book') {
                setVisibleColumns(new Set(taiwaneseBookColumnConfig.defaultVisible));
                setDisplayedColumns([...taiwaneseBookColumnConfig.defaultVisible]);
            } else {
                setVisibleColumns(new Set(columnConfig.defaultVisible));
                setDisplayedColumns([...columnConfig.defaultVisible]);
            }
        }

        let results = [...contracts];

        // ... rest of logic

        if (criteria.contractTargetType) {
            if (criteria.contractTargetType === 'e-content') {
                results = results.filter(c => ['ebook', 'ejournal'].includes(c.basicInfo.contractTargetType));
            } else {
                results = results.filter(c => c.basicInfo.contractTargetType === criteria.contractTargetType);
            }
        }
        console.log('After type filter:', results.length);

        if (criteria.keyword) {
            const lowerKeyword = criteria.keyword.toLowerCase();
            results = results.filter(c => (
                c.registrationInfo.airitiContractNo?.toLowerCase().includes(lowerKeyword) ||
                c.basicInfo.publisherName?.toLowerCase().includes(lowerKeyword) ||
                c.basicInfo.contractName?.toLowerCase().includes(lowerKeyword)
            ));
        }
        console.log('After keyword filter:', results.length);

        // ...

        setRawSearchResults(results); // This was at line 1085
        setActiveFilters({});
        navigateTo('search-results');
    }, [contracts]);




    useEffect(() => {
        let filteredData = [...rawSearchResults];
        if (Object.keys(activeFilters).length > 0) {
            filteredData = filteredData.filter(c => {
                return Object.entries(activeFilters).every(([key, value]) => {
                    if (value === '' || value === undefined) return true;
                    const check = (path, filterValue) => { const contractValue = getFieldValue(c, path); if (contractValue === undefined || contractValue === null) return false; if (typeof contractValue === 'string' && typeof filterValue === 'string') { return contractValue.toLowerCase().includes(filterValue.toLowerCase()); } return String(contractValue) === String(filterValue); };
                    const checkBoolean = (path, filterValue) => { const contractValue = getFieldValue(c, path); return String(contractValue) === filterValue; };

                    switch (key) {
                        // 基本資料
                        case 'acquisitionMaintainer': return check('registrationInfo.acquisitionMaintainer', value);
                        case 'asTeamMaintainer': return check('registrationInfo.asTeamMaintainer', value);
                        case 'contractStatus': return check('basicInfo.contractStatus', value);
                        case 'terminated': return check('basicInfo.terminated', value);
                        case 'autoRenewYears': return check('basicInfo.autoRenewYears', value);
                        case 'autoRenewTimes': return check('basicInfo.autoRenewTimes', value);
                        case 'thereafter': return check('basicInfo.thereafter', value);
                        case 'contractVersionNo': return check('basicInfo.contractVersionNo', value);
                        case 'contractName': return check('basicInfo.contractName', value);

                        // 電子書基本權利
                        case 'fullTextDigitization': return checkBoolean('rightsInfo.fullTextDigitization', value);
                        case 'trialAccess': return checkBoolean('rightsInfo.trialAccess', value);
                        case 'tts': return checkBoolean('rightsInfo.tts', value);
                        case 'thirdPartyAuthorization': return checkBoolean('rightsInfo.thirdPartyAuthorization', value);
                        case 'thirdPartyConsignment': return checkBoolean('rightsInfo.thirdPartyConsignment', value);
                        case 'doiApplication': return checkBoolean('rightsInfo.doiApplication', value);

                        // 2B銷售權利
                        case 'b2bSalesRightsToggle': return check('scopeInfo.b2bSalesRightsToggle', value);
                        case 'b2bAuthorizationType': return check('scopeInfo.b2bAuthorizationType', value);
                        case 'eLibrarySalesRight': return check('scopeInfo.eLibrarySalesRight', value);

                        // 2C銷售權利
                        case 'b2cSalesRightsToggle': return check('otherClauses.b2cSalesRightsToggle', value);
                        case 'b2cAuthorizationType': return check('otherClauses.b2cAuthorizationType', value);
                        case 'platformRights':
                            if (!Array.isArray(value) || value.length === 0) return true;
                            return value.every(condition => {
                                const contractValue = getFieldValue(c, `otherClauses.${condition.platform}`);
                                return String(contractValue) === condition.state;
                            });
                        case 'trmsSalesRightsToggle': return check('otherClauses.trmsSalesRightsToggle', value);
                        case 'distributorPlatformToggle': return check('otherClauses.distributorPlatformToggle', value);

                        // 台版書
                        case 'fullTextDigitizationTwBook': return check('twBookRights.fullTextDigitizationTwBook', value);
                        case 'twBookOverseasDiscount': {
                            const valueStr = String(value);
                            if (!valueStr || valueStr === '-') return true;

                            const [startStr, endStr] = valueStr.split('-');

                            if (startStr === '' && endStr === '') return true;

                            const start = startStr !== '' ? parseFloat(startStr) : -Infinity;
                            const end = endStr !== '' ? parseFloat(endStr) : Infinity;

                            if (isNaN(start) && isNaN(end)) return true;

                            const contractValueRaw = getFieldValue(c, 'twBookAccounting.twBookOverseasDiscount');
                            if (contractValueRaw === undefined || contractValueRaw === null || contractValueRaw === '') return false;

                            const contractValue = parseFloat(String(contractValueRaw).replace(/[^0-9.]/g, ''));
                            if (isNaN(contractValue)) return false;

                            return contractValue >= start && contractValue <= end;
                        }

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
    const navigateTo = (pageId: string) => {
        console.log('Navigating to:', pageId);
        setCurrentPage(pageId);
        mainContentRef.current?.scrollTo(0, 0);
    };

    const getFileName = (file: File | string | null | undefined): string => { if (typeof file === 'string') return file; if (file instanceof File) return file.name; return '尚未上傳檔案'; };
    const showContractDetail = useCallback((contract: ContractData) => { setCurrentContract(contract); navigateTo('contract-detail'); }, []);

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        const allItems = sortedSearchResults
            .filter(c => c.id !== undefined)
            .map(c => ({
                id: c.id!,
                label: c.basicInfo.publisherName || 'Unknown Publisher',
                data: c,
                type: 'ddd' as const
            }));

        if (checked) {
            selectMultiple(allItems);
        } else {
            deselectMultiple(allItems.map(item => item.id));
        }
    };

    const filteredSelectableColumns = useMemo(() => {
        if (searchContractType === 'taiwan_book') {
            return taiwaneseBookColumnConfig.selectable;
        }
        if (!searchContractType) return columnConfig.selectable;
        if (searchContractType === 'e-content') {
            return columnConfig.selectable.filter(group => group.group !== '台版書採購/帳務相關');
        }
        return columnConfig.selectable;
    }, [searchContractType]);

    const handleTocJump = (id: string) => { const element = document.getElementById(id); if (element) { const offset = 100; const bodyRect = mainContentRef.current?.getBoundingClientRect().top ?? 0; const elementRect = element.getBoundingClientRect().top; const elementPosition = elementRect - bodyRect; const offsetPosition = mainContentRef.current?.scrollTop + elementPosition - offset; mainContentRef.current?.scrollTo({ top: offsetPosition, behavior: 'smooth' }); } };



    // --- 下載維護歷程 ---
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

    // --- 排序 & 拖曳函式 ---
    const requestSort = (key: string) => { let direction: 'ascending' | 'descending' = 'ascending'; if (sortConfig.key === key && sortConfig.direction === 'ascending') { direction = 'descending'; } setSortConfig({ key, direction }); };
    const handleDragStart = (e: React.DragEvent, position: number) => { dragItem.current = position; };
    const handleDragEnter = (e: React.DragEvent, position: number) => { dragOverItem.current = position; const colId = displayedColumns[position]; setDragOverColId(colId); };
    const handleDrop = (e: React.DragEvent) => { if (dragItem.current === null || dragOverItem.current === null) return; const newDisplayedColumns = [...displayedColumns]; const dragItemContent = newDisplayedColumns[dragItem.current]; newDisplayedColumns.splice(dragItem.current, 1); newDisplayedColumns.splice(dragOverItem.current, 0, dragItemContent); dragItem.current = null; dragOverItem.current = null; setDisplayedColumns(newDisplayedColumns); setDragOverColId(null); };
    const handleDragEnd = () => { setDragOverColId(null); }

    // --- 渲染函式 ---
    const TruncatedText: React.FC<{ text: string; maxLength: number }> = ({ text, maxLength }) => { const displayText = text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text; return <span title={text}>{displayText || '(空白)'}</span>; };
    const columnsToRender = useMemo(() => { const columnMap = new Map(allColumns.map(c => [c.id, c])); return displayedColumns.map(id => columnMap.get(id)).filter(Boolean); }, [displayedColumns, allColumns]);
    const renderCellContent = useCallback((contract, columnId) => {
        const value = getFieldValue(contract, columnId);
        const getLabelForValue = (optionsKey: string, value: string) => {
            const options = dropdownOptions[optionsKey] || radioOptions[optionsKey] || [];
            return options.find(opt => opt.value === value)?.label || value;
        }

        // Helper for boolean values
        const formatBoolean = (boolValue) => {
            if (typeof boolValue !== 'boolean') return getLabelForValue(columnId, boolValue);
            return boolValue ? '是' : '否';
        }

        switch (columnId) {
            case 'basicInfo.publisherName':
                return <button onClick={() => showContractDetail(contract)} className="text-indigo-600 hover:text-indigo-900 font-medium text-left"><TruncatedText text={value} maxLength={30} /></button>;

            case 'basicInfo.contractTargetType':
                return <TruncatedText text={getLabelForValue('basicInfo.contractTargetType', value)} maxLength={20} />;

            case 'basicInfo.contractStatus':
                return <TruncatedText text={getLabelForValue('basicInfo.contractStatus', value)} maxLength={20} />;

            case 'basicInfo.earlyTermination':
                return <TruncatedText text={getLabelForValue('basicInfo.earlyTermination', value)} maxLength={20} />;

            case 'basicInfo.contractDateRange':
                const startDate = contract.basicInfo.contractStartDate || 'N/A';
                const endDate = contract.basicInfo.contractEndDate || 'N/A';
                return <TruncatedText text={`${startDate} ~ ${endDate}`} maxLength={30} />;

            case 'otherClauses.platformRightsStatus':
                const enabledPlatforms = allPlatforms
                    .filter(p => getFieldValue(contract, `otherClauses.${p.id}`) === true)
                    .map(p => p.label);
                return <TruncatedText text={enabledPlatforms.join(', ')} maxLength={40} />;

            // Boolean fields
            case 'rightsInfo.fullTextDigitization':
            case 'rightsInfo.trialAccess':
            case 'rightsInfo.tts':
            case 'rightsInfo.thirdPartyAuthorization':
            case 'rightsInfo.thirdPartyConsignment':
            case 'rightsInfo.doiApplication':
            case 'otherClauses.shuNiuXiong':
            case 'otherClauses.kingstone':
            case 'otherClauses.sanmin':
            case 'otherClauses.taaze':
                return <TruncatedText text={formatBoolean(value)} maxLength={20} />;

            // Fields with options (radio/dropdown)
            case 'basicInfo.thereafter':
            case 'scopeInfo.b2bSalesRightsToggle':
            case 'otherClauses.b2cSalesRightsToggle':
            case 'otherClauses.trmsSalesRightsToggle':
            case 'otherClauses.distributorPlatformToggle':
            case 'twBookAccounting.twBookPaymentMethod':
            case 'twBookAccounting.twBookPayeeInfo':
                return <TruncatedText text={getLabelForValue(columnId, value)} maxLength={20} />;

            default:
                const displayValue = (value !== null && value !== undefined && value !== '') ? String(value) : '';
                return <TruncatedText text={displayValue} maxLength={20} />;
        }
    }, [showContractDetail]);

    return (
        <div className="bg-gray-100 font-sans">
            <main ref={mainContentRef} className="container mx-auto p-8" style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>


                {currentPage === 'search-contract' && (<SearchPage onSearch={handleSearch} />)}

                {currentPage === 'search-results' && (
                    <div className="w-full">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div><h2 className="text-2xl font-bold text-gray-800">搜尋結果</h2><p className="text-sm text-gray-500 mt-1">找到 {searchResults.length} 筆合約</p></div>
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
                                            <th scope="col" className="sticky left-0 bg-gray-50 z-20 px-4 py-3">
                                                <input type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    checked={sortedSearchResults.length > 0 && sortedSearchResults.every(c => c.id && isSelected(c.id))}
                                                    onChange={handleSelectAll}
                                                    ref={input => { if (input) input.indeterminate = sortedSearchResults.some(c => c.id && isSelected(c.id)) && !(sortedSearchResults.length > 0 && sortedSearchResults.every(c => c.id && isSelected(c.id))); }}
                                                />
                                            </th>
                                            {columnsToRender.map((col, index) => (
                                                <th key={col.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-move transition-colors ${dragOverColId === col.id ? 'bg-indigo-100' : ''}`}>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => requestSort(col.id)} className="flex items-center gap-1 hover:text-gray-800">
                                                            <span>{col.label}</span>
                                                            {sortConfig.key === col.id ? (sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : (<ArrowUpDown size={14} className="text-gray-400" />)}
                                                        </button>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">{sortedSearchResults.map(contract => (<tr key={contract.id} onClick={() => showContractDetail(contract)} className={`${isSelected(contract.id!) ? 'bg-indigo-50' : ''} hover:bg-gray-50 cursor-pointer`}>
                                        <td className={`sticky left-0 z-10 px-4 py-3 whitespace-nowrap ${isSelected(contract.id!) ? 'bg-indigo-50' : 'bg-white'}`}>
                                            <BatchSelectionCheckbox
                                                id={contract.id!}
                                                label={contract.basicInfo.publisherName || 'Unknown Publisher'}
                                                data={contract}
                                                type='ddd'
                                            />
                                        </td>
                                        {columnsToRender.map((col) => (<td key={col.id} className={`px-4 py-3 whitespace-nowrap transition-colors ${dragOverColId === col.id ? 'bg-indigo-50' : ''}`}>{renderCellContent(contract, col.id)}</td>))}
                                    </tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {currentPage === 'contract-detail' && currentContract && (
                    <div className="bg-white rounded-xl shadow-lg p-8 relative">
                        <FloatingTOC
                            onJump={handleTocJump}
                            sections={filteredTocSections.map(s => ({ id: s.id, label: s.title }))}
                        />
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">合約詳目: {currentContract.basicInfo.publisherName}</h2>
                            <div className="space-x-4">
                                <Button
                                    onClick={() => navigate(`/ddd/contract/${currentContract.id}`)}
                                    className="bg-orange-500 hover:bg-orange-600 text-white"
                                >
                                    <FileText size={16} className="mr-2" />
                                    維護
                                </Button>
                                <Button variant="ghost" onClick={() => navigateTo('search-results')} className="border border-gray-300 text-gray-700 hover:bg-gray-50">回上一頁</Button>
                            </div>
                        </div>
                        <div className="space-y-8">
                            {filteredTocSections.map(section => {
                                if (section.id === 'maintenance-history') {
                                    return (
                                        <div key={section.id} id="maintenance-history" className="border border-gray-200 rounded-lg">
                                            <div className="p-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
                                                    {currentContract.maintenanceHistory && currentContract.maintenanceHistory.length > 0 && (
                                                        <Button
                                                            onClick={() => handleDownloadHistory(currentContract.maintenanceHistory!, currentContract.registrationInfo?.airitiContractNo)}
                                                            size="sm"
                                                            className="bg-green-600 text-white hover:bg-green-700 border-transparent"
                                                        >
                                                            <Download size={16} className="mr-2" />
                                                            下載維護歷程
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間戳</th>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">維護人員</th>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">欄位</th>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">變更前</th>
                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">變更後</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {currentContract.maintenanceHistory && currentContract.maintenanceHistory.length > 0 ? (
                                                                currentContract.maintenanceHistory.flatMap((record, index) =>
                                                                    record.changes.map((change, cIndex) => (
                                                                        <tr key={`${index}-${cIndex}`}>
                                                                            <td className="px-4 py-3 whitespace-nowrap">{record.timestamp}</td>
                                                                            <td className="px-4 py-3 whitespace-nowrap">{record.userName} ({record.userId})</td>
                                                                            <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{change.field}</td>
                                                                            <td className="px-4 py-3 whitespace-nowrap text-red-600">{`"${change.oldValue}"`}</td>
                                                                            <td className="px-4 py-3 whitespace-nowrap text-green-600">{`"${change.newValue}"`}</td>
                                                                        </tr>
                                                                    ))
                                                                )
                                                            ) : (
                                                                <tr>
                                                                    <td colSpan="5" className="px-4 py-3 text-center text-gray-500">無維護歷程。</td>
                                                                </tr>
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                if (section.id === 'scan-file') {
                                    return (
                                        <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3>
                                            <div className="flex items-center gap-3 text-gray-900"><FileText size={18} /> <span>{getFileName(currentContract.scanFile)}</span></div>
                                        </div>
                                    )
                                }
                                if (section.id === 'remarks') {
                                    return (
                                        <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3>
                                            <p className="text-gray-800 whitespace-pre-wrap">{currentContract.remarks || 'N/A'}</p>
                                        </div>
                                    )
                                }

                                return (
                                    <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {Object.entries(fieldKeyToNameMap)
                                                .filter(([key]) => key.startsWith(sectionIdToDataKey(section.id)))
                                                .map(([key, label]) => {
                                                    const value = getFieldValue(currentContract, key);
                                                    const allOptions = { ...dropdownOptions, ...radioOptions };
                                                    let displayValue = (value !== null && value !== undefined && value !== '') ? String(value) : 'N/A';
                                                    if (typeof value === 'boolean') displayValue = value ? '是' : '否';
                                                    if (allOptions[key]) displayValue = allOptions[key].find(o => o.value === value)?.label || 'N/A';
                                                    return (<div key={key}><label className="block text-sm font-medium text-gray-500">{label}</label><div className="text-gray-900 mt-1">{displayValue}</div></div>);
                                                })
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            <FilterDrawer isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} activeFilters={activeFilters} onFilterChange={setActiveFilters} searchContractType={searchContractType} />
            <ColumnSelector isOpen={showColumnSelector} onClose={() => setShowColumnSelector(false)} visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} selectableColumns={filteredSelectableColumns} searchContractType={searchContractType} />

            {message.show && (<div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-[100] ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{message.message}</div>)}
        </div>
    );
};

const SearchPage: React.FC<{ onSearch: (criteria: SearchCriteria) => void }> = ({ onSearch }) => {
    const navigate = useNavigate();
    const [criteria, setCriteria] = useState<SearchCriteria>({ keyword: '', contractTargetType: '', dateMode: 'effective', startDate: '', endDate: '', rollbackDate: '' });
    const handleInputChange = (field: keyof SearchCriteria, value: string) => { setCriteria(prev => ({ ...prev, [field]: value })); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSearch(criteria); };
    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">搜尋合約</h2>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">關鍵字</label><input type="text" value={criteria.keyword} onChange={e => handleInputChange('keyword', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="搜尋華藝合約編號, 出版單位, 合約名稱..." /></div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">合約標的類型 <span className="text-red-500">*</span></label>
                    <select value={criteria.contractTargetType} onChange={e => handleInputChange('contractTargetType', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                        <option value="" disabled>請選擇類型</option>
                        {searchContractTypeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">合約期間</label><div className="grid grid-cols-1 md:grid-cols-4 gap-4"><select value={criteria.dateMode} onChange={e => handleInputChange('dateMode', e.target.value)} className="md:col-span-1 w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="effective">在此期間內有效</option><option value="starts">在此期間內開始</option><option value="ends">在此期間內到期</option><option value="within">起訖日皆在此期間內</option></select><div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center"><input type="date" value={criteria.startDate} onChange={e => handleInputChange('startDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /><input type="date" value={criteria.endDate} onChange={e => handleInputChange('endDate', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-2">回溯至 (選填)</label><input type="date" value={criteria.rollbackDate} onChange={e => handleInputChange('rollbackDate', e.target.value)} className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg" /><p className="text-xs text-gray-500 mt-1">選擇一個過去的日期，以檢視當天所有合約的歷史狀態。</p></div>
            <div className="flex justify-end"><Button type="submit" disabled={!criteria.contractTargetType}><Search size={18} className="mr-2" />執行搜尋</Button></div>
        </form>
    );
};

export default DDDSearchContract;