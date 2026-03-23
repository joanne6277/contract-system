import { useState, useCallback, useRef, useEffect } from 'react';
import { fieldKeyToNameMap, validationRules } from '../constants';

import type {
    TuFuContractData, OtherClauses, CheckboxWithTextData, EbookMagazineContract, TaiwanBookContract
} from '../types';

const MOCK_CONTRACTS: TuFuContractData[] = [{
    // ... (The mock data can be moved here or fetched from an API) ...
    id: 'mock-001',
    registrationInfo: { airitiContractNo: 'OLD-001', ebookContractNo: 'E-OLD-001', acquisitionMaintainer: '舊徵集員', asTeamMaintainer: '舊AS組員' },
    basicInfo: { publisherName: '遠古出版社', licensorPersonInCharge: '山頂洞人', licensorRep: '北京猿人', airitiSignatory: '華藝簽約代表', contractTargetType: 'ebook', contractStatus: 'yes', earlyTermination: 'no', contractStartDate: '2020-01-01', contractEndDate: '2024-12-31', autoRenewYears: '2', autoRenewTimes: '10', thereafter: 'yes', contractVersionNo: 'v0.9', contractName: '史前合約', specialPenalties: '罰寫一百遍', jurisdiction: '台北地方法院' },
    rightsInfo: { trialPercentage: { percentage: '10', details: '' }, printingPercentage: { percentage: '10', details: '' }, fullTextDigitization: { selected: 'yes', details: '' }, trialAccess: { selected: 'yes', details: '' }, tts: { selected: 'no', details: '' }, fullTextSearch: { selected: 'yes', details: '' }, dataComparison: { selected: 'yes', details: '' }, systemData: { selected: 'yes', details: '' }, captureAnalysisProcessing: { selected: 'yes', details: '' }, autoGeneration: { selected: 'yes', details: '' }, algorithmTraining: { selected: 'no', details: '' }, languageSwitching: { selected: 'yes', details: '' }, chapterPresentation: { selected: 'yes', details: '' }, chapterSales: { selected: 'yes', details: '' }, marketingModel: { selected: 'other', details: '依專案討論' }, publisherSpecs: { selected: 'no', details: '' }, doiApplication: 'by Airiti', doiFee: '50', thirdPartyAuthorization: { selected: 'yes', details: '' }, thirdPartyConsignment: { selected: 'no', details: '' }, salesChannels: { selected: 'yes', details: '' }, paymentMethodRights: { selected: 'yes', details: '' }, listingSchedule: { selected: 'yes', details: '' }, listingItems: { selected: 'yes', details: '' }, listingPlatforms: { selected: 'yes', details: '' }, tradingConditions: { selected: 'yes', details: '' }, contentPresentation: { selected: 'yes', details: '' }, serviceModel: { selected: 'yes', details: '' } },
    scopeInfo: { b2bSalesRightsToggle: 'yes', b2bAuthorizationType: '專屬', b2bSplitPercentage: { percentage: '50', details: '' }, b2bSalesRegion: '全球', b2bMinMultiple: '3', b2bRoyaltyAdjustment: 'yes', b2bPricingPower: 'yes', b2bLease: { selected: 'yes', details: '' }, b2bBuyout: { selected: 'yes', details: '' }, b2bPayPerUse: { selected: 'yes', details: '' }, b2bPda: { selected: 'no', details: '' }, b2bAlliance: { selected: 'yes', details: '' }, b2bPublicTender: { selected: 'yes', details: '' }, b2bRestrictiveTender: { selected: 'no', details: '' }, subscription: 'yes', eLibrarySalesRight: 'yes', eLibraryContractType: '包庫', eLibrarySplit: { percentage: '30', details: '' }, eLibraryPricing: '依華藝規定' },
    otherClauses: { b2cSalesRightsToggle: 'yes', b2cAuthorizationType: '非專屬', b2cSplitPercentage: { percentage: '60', details: '' }, b2cSalesRegion: '台澎金馬', b2cQuotationPrinciple: '紙本8折', b2cRoyaltyAdjustment: 'no', b2cPricingPower: 'no', b2cLease: { selected: 'yes', details: '' }, b2cBuyout: { selected: 'yes', details: '' }, b2cPayPerUse: { selected: 'yes', details: '' }, b2cVariablePriceAuth: { selected: 'yes', details: '' }, shuNiuXiong: { selected: 'yes', details: '' }, kingstone: { selected: 'yes', details: '' }, sanmin: { selected: 'yes', details: '' }, taaze: { selected: 'yes', details: '' }, trmsSalesRightsToggle: 'no', trmsSplitPercentage: { percentage: '', details: '' }, distributorPlatformToggle: 'yes', distributorSplit: { percentage: '50', details: '' }, cannotListPlatforms: '無', amazon: { selected: 'yes', details: '' }, google: { selected: 'yes', details: '' }, kobo: { selected: 'yes', details: '' }, pubu: { selected: 'yes', details: '' }, eslite: { selected: 'yes', details: '' }, pchome: { selected: 'yes', details: '' }, readmoo: { selected: 'yes', details: '' }, udn: { selected: 'yes', details: '' }, bookwalker: { selected: 'no', details: '' }, hyweb: { selected: 'yes', details: '' }, bookscom: { selected: 'yes', details: '' }, apple: { selected: 'yes', details: '' }, mybook: { selected: 'yes', details: '' }, momo: { selected: 'yes', details: '' }, twb: { selected: 'no', details: '' }, hkUe: { selected: 'no', details: '' }, ingram: { selected: 'yes', details: '' }, overdrive: { selected: 'yes', details: '' }, hami: { selected: 'yes', details: '' }, truth: { selected: 'no', details: '' }, wechat: { selected: 'no', details: '' } },
    accountingInfo: { entityType: 'private', locationType: 'domestic', billingCycle: '季結', paymentTerm: '月結90天', paymentMethod: '匯款', accountHolderName: '遠古出版社有限公司', taxId: '12345678', idNumber: '', bankName: '盤古銀行', bankCode: '001', branchName: '開天闢地分行', branchCode: '001-1', accountNumber: '9876543210', swiftCode: '', bankAddress: '', remittanceNotes: '無' },
    twBookRights: { exclusiveAuthorization: '', exclusiveConditions: '', trialTwBook: { percentage: '', details: '' }, fullTextDigitizationTwBook: '' },
    twBookAccounting: { twBookOverseasDiscount: { percentage: '', details: '' }, twBookBillingCycle: { selected: '', details: '' }, twBookPaymentMethod: { selected: '', details: '' }, twBookPaymentTerms: '', twBookAccountHolder: '', twBookPayeeInfo: { selected: '', details: '' }, twBookBankName: '', twBookBranchName: '', twBookAccountNumber: '' },
    twBookLogistics: { minimumShipmentThreshold: '', freeShippingThreshold: '', returnCycle: { selected: '', details: '' }, nonDefectiveReturnShippingFee: { selected: '', details: '' }, domesticReturnShippingFee: { selected: '', details: '' }, sampleBookDiscount: { percentage: '', details: '' }, sampleBookBillingCycle: '', authorizedSalesRegion: '', subDistribution: '' },
    twBookContact: { publisherRegion: '', contacts: [], companyPostalCode: '100', companyAddress: '台北市中正區', logisticsPostalCode: '235', logisticsAddress: '新北市中和區' },
    remarks: '這是一筆舊的合約資料，用於帶出舊資料功能展示。',
    scanFile: 'old-contract.pdf',
    createdAt: new Date('2020-01-01T00:00:00.000Z'),
    maintenanceHistory: [],
} as unknown as TuFuContractData];

const getInitialFormData = (): TuFuContractData => {
    const initialCheckboxWithText = { selected: '', details: '' };
    return {
        contractType: 'ebook_magazine',
        registrationInfo: { airitiContractNo: '', ebookContractNo: '', acquisitionMaintainer: '', asTeamMaintainer: '' },
        basicInfo: { publisherName: '', licensorPersonInCharge: '', licensorRep: '', airitiSignatory: '', contractTargetType: '', contractStatus: '', earlyTermination: '', contractStartDate: '', contractEndDate: '', autoRenewYears: '', autoRenewTimes: '', thereafter: '', contractVersionNo: '', contractName: '', specialPenalties: '', jurisdiction: '' },
        rightsInfo: {
            trialPercentage: { percentage: '', details: '' }, printingPercentage: { percentage: '', details: '' }, fullTextDigitization: { ...initialCheckboxWithText }, trialAccess: { ...initialCheckboxWithText }, tts: { ...initialCheckboxWithText }, fullTextSearch: { ...initialCheckboxWithText }, dataComparison: { ...initialCheckboxWithText }, systemData: { ...initialCheckboxWithText }, captureAnalysisProcessing: { ...initialCheckboxWithText }, autoGeneration: { ...initialCheckboxWithText }, algorithmTraining: { ...initialCheckboxWithText }, languageSwitching: { ...initialCheckboxWithText }, chapterPresentation: { ...initialCheckboxWithText }, chapterSales: { ...initialCheckboxWithText }, marketingModel: { ...initialCheckboxWithText }, publisherSpecs: { ...initialCheckboxWithText }, doiApplication: '', doiFee: '', thirdPartyAuthorization: { ...initialCheckboxWithText }, thirdPartyConsignment: { ...initialCheckboxWithText }, salesChannels: { ...initialCheckboxWithText }, paymentMethodRights: { ...initialCheckboxWithText }, listingSchedule: { ...initialCheckboxWithText }, listingItems: { ...initialCheckboxWithText }, listingPlatforms: { ...initialCheckboxWithText }, tradingConditions: { ...initialCheckboxWithText }, contentPresentation: { ...initialCheckboxWithText }, serviceModel: { ...initialCheckboxWithText },
        },
        scopeInfo: { b2bSalesRightsToggle: 'no', b2bAuthorizationType: '', b2bSplitPercentage: { percentage: '', details: '' }, b2bSalesRegion: '', b2bMinMultiple: '', b2bRoyaltyAdjustment: '', b2bPricingPower: '', b2bLease: { ...initialCheckboxWithText }, b2bBuyout: { ...initialCheckboxWithText }, b2bPayPerUse: { ...initialCheckboxWithText }, b2bPda: { ...initialCheckboxWithText }, b2bAlliance: { ...initialCheckboxWithText }, b2bPublicTender: { ...initialCheckboxWithText }, b2bRestrictiveTender: { ...initialCheckboxWithText }, subscription: '', eLibrarySalesRight: '', eLibraryContractType: '', eLibrarySplit: { percentage: '', details: '' }, eLibraryPricing: '' },
        otherClauses: { b2cSalesRightsToggle: 'no', b2cAuthorizationType: '', b2cSplitPercentage: { percentage: '', details: '' }, b2cSalesRegion: '', b2cQuotationPrinciple: '', b2cRoyaltyAdjustment: '', b2cPricingPower: '', b2cLease: { ...initialCheckboxWithText }, b2cBuyout: { ...initialCheckboxWithText }, b2cPayPerUse: { ...initialCheckboxWithText }, b2cVariablePriceAuth: { ...initialCheckboxWithText }, shuNiuXiong: { ...initialCheckboxWithText }, kingstone: { ...initialCheckboxWithText }, sanmin: { ...initialCheckboxWithText }, taaze: { ...initialCheckboxWithText }, trmsSalesRightsToggle: 'no', trmsSplitPercentage: { percentage: '', details: '' }, distributorPlatformToggle: 'no', distributorSplit: { percentage: '', details: '' }, cannotListPlatforms: '', amazon: { ...initialCheckboxWithText }, google: { ...initialCheckboxWithText }, kobo: { ...initialCheckboxWithText }, pubu: { ...initialCheckboxWithText }, eslite: { ...initialCheckboxWithText }, pchome: { ...initialCheckboxWithText }, readmoo: { ...initialCheckboxWithText }, udn: { ...initialCheckboxWithText }, bookwalker: { ...initialCheckboxWithText }, hyweb: { ...initialCheckboxWithText }, bookscom: { ...initialCheckboxWithText }, apple: { ...initialCheckboxWithText }, mybook: { ...initialCheckboxWithText }, momo: { ...initialCheckboxWithText }, twb: { ...initialCheckboxWithText }, hkUe: { ...initialCheckboxWithText }, ingram: { ...initialCheckboxWithText }, overdrive: { ...initialCheckboxWithText }, hami: { ...initialCheckboxWithText }, truth: { ...initialCheckboxWithText }, wechat: { ...initialCheckboxWithText } },
        accountingInfo: { entityType: '', locationType: '', billingCycle: '', paymentTerm: '', paymentMethod: '', accountHolderName: '', taxId: '', idNumber: '', bankName: '', branchName: '', bankCode: '', branchCode: '', accountNumber: '', swiftCode: '', bankAddress: '', remittanceNotes: '' },
        twBookRights: { exclusiveAuthorization: '', exclusiveConditions: '', trialTwBook: { percentage: '', details: '' }, fullTextDigitizationTwBook: '' },
        twBookAccounting: { twBookOverseasDiscount: { percentage: '', details: '' }, twBookBillingCycle: { selected: '', details: '' }, twBookPaymentMethod: { selected: '', details: '' }, twBookPaymentTerms: '', twBookAccountHolder: '', twBookPayeeInfo: { selected: '', details: '' }, twBookBankName: '', twBookBranchName: '', twBookAccountNumber: '' },
        twBookLogistics: { minimumShipmentThreshold: '', freeShippingThreshold: '', returnCycle: { selected: '', details: '' }, nonDefectiveReturnShippingFee: { selected: '', details: '' }, domesticReturnShippingFee: { selected: '', details: '' }, sampleBookDiscount: { percentage: '', details: '' }, sampleBookBillingCycle: '', authorizedSalesRegion: '', subDistribution: '' },
        twBookContact: { publisherRegion: '', contacts: [{ id: crypto.randomUUID(), info: '', title: [], email: '', phone: '' }], companyPostalCode: '', companyAddress: '', logisticsPostalCode: '', logisticsAddress: '' },
        remarks: '',
        scanFile: null
    } as unknown as TuFuContractData;
};

export const useDDDContractForm = () => {
    const [formData, setFormData] = useState<TuFuContractData>(getInitialFormData());
    const [message, setMessage] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
    const [platformBulkSelectState, setPlatformBulkSelectState] = useState<'yes' | 'no' | 'other' | ''>('');
    const [rightsBulkSelect, setRightsBulkSelect] = useState<'yes' | 'no' | 'other' | ''>('');
    const [importContractNo, setImportContractNo] = useState('');
    const [validationErrors, setValidationErrors] = useState<{ hard: string[] }>({ hard: [] });
    const [isValidationPanelVisible, setIsValidationPanelVisible] = useState(false);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const showMessage = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
        setMessage({ show: true, message: msg, type });
        setTimeout(() => setMessage({ show: false, message: '', type: 'success' }), 5000);
    }, []);

    const getFieldValue = (obj: any, path: string): any => {
        if (obj === undefined || obj === null) return undefined;
        return path.split('.').reduce((o, i) => o?.[i], obj);
    };

    const handleDynamicFormChange = (path: string, value: any) => {
        setFormData(prev => {
            const keys = path.split('.');
            const newFormData = JSON.parse(JSON.stringify(prev));
            let current = newFormData;
            for (let i = 0; i < keys.length - 1; i++) {
                if (current[keys[i]] === undefined) { current[keys[i]] = {}; }
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newFormData;
        });
    };

    const platformGridItems: (keyof OtherClauses)[] = [
        'amazon', 'google', 'kobo', 'pubu', 'eslite', 'pchome', 'readmoo', 'udn',
        'bookwalker', 'hyweb', 'bookscom', 'apple', 'mybook', 'momo', 'twb', 'hkUe',
        'taaze', 'ingram', 'overdrive', 'hami', 'truth', 'wechat',
    ];

    const rightsTableItems = [
        'fullTextDigitization', 'trialAccess', 'tts', 'fullTextSearch', 'dataComparison',
        'systemData', 'captureAnalysisProcessing', 'autoGeneration', 'algorithmTraining',
        'languageSwitching', 'chapterPresentation', 'chapterSales', 'marketingModel',
        'publisherSpecs', 'thirdPartyAuthorization', 'thirdPartyConsignment', 'salesChannels',
        'paymentMethodRights', 'listingSchedule', 'listingItems', 'listingPlatforms',
        'tradingConditions', 'contentPresentation', 'serviceModel'
    ];

    const handleBulkPlatformUpdate = (value: 'yes' | 'no' | 'other' | '') => {
        setFormData(prev => {
            const newFormData = JSON.parse(JSON.stringify(prev)) as EbookMagazineContract;
            platformGridItems.forEach(key => {
                const itemKey = key as keyof typeof newFormData.otherClauses;
                if (newFormData.otherClauses[itemKey]) {
                    (newFormData.otherClauses[itemKey] as CheckboxWithTextData).selected = value;
                    if (value !== 'other') {
                        (newFormData.otherClauses[itemKey] as CheckboxWithTextData).details = '';
                    }
                }
            });
            return newFormData as unknown as TuFuContractData;
        });
    };

    const handleBulkSelectClick = (value: 'yes' | 'no' | 'other') => {
        if (platformBulkSelectState === value) {
            handleBulkPlatformUpdate('');
        } else {
            handleBulkPlatformUpdate(value);
        }
    };

    const handleRightsBulkUpdate = (value: 'yes' | 'no' | 'other' | '') => {
        setFormData(prev => {
            const newFormData = JSON.parse(JSON.stringify(prev)) as EbookMagazineContract;
            rightsTableItems.forEach(key => {
                const itemKey = key as keyof typeof newFormData.rightsInfo;
                if (newFormData.rightsInfo[itemKey]) {
                    (newFormData.rightsInfo[itemKey] as CheckboxWithTextData).selected = value;
                    if (value !== 'other') {
                        (newFormData.rightsInfo[itemKey] as CheckboxWithTextData).details = '';
                    }
                }
            });
            return newFormData as unknown as TuFuContractData;
        });
    };

    const handleRightsBulkSelectClick = (value: 'yes' | 'no' | 'other') => {
        if (rightsBulkSelect === value) {
            handleRightsBulkUpdate('');
        } else {
            handleRightsBulkUpdate(value);
        }
    };

    useEffect(() => {
        if (formData.contractType === 'taiwan_book') {
            setPlatformBulkSelectState('');
            setRightsBulkSelect('');
            return;
        }
        const ebookData = formData as EbookMagazineContract;
        const platformSelections = platformGridItems.map(item => (ebookData.otherClauses[item as keyof OtherClauses] as CheckboxWithTextData)?.selected);
        if (platformSelections.length > 0) {
            const firstValue = platformSelections[0];
            const allSame = firstValue && platformSelections.every(sel => sel === firstValue);
            setPlatformBulkSelectState(allSame ? (firstValue as 'yes' | 'no' | 'other') : '');
        } else {
            setPlatformBulkSelectState('');
        }

        const rightsSelections = rightsTableItems.map(item => (ebookData.rightsInfo[item as keyof typeof ebookData.rightsInfo] as CheckboxWithTextData)?.selected);
        if (rightsSelections.length > 0 && rightsSelections[0]) {
            const firstValue = rightsSelections[0];
            const allSame = rightsSelections.every(sel => sel === firstValue);
            setRightsBulkSelect(allSame ? (firstValue as 'yes' | 'no' | 'other') : '');
        } else {
            setRightsBulkSelect('');
        }
    }, [formData]);

    const validateForm = () => {
        const missingLevel1: string[] = [];
        validationRules.hard.forEach(fieldKey => {
            const value = getFieldValue(formData, fieldKey);
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                missingLevel1.push(fieldKeyToNameMap[fieldKey]);
            }
        });
        return { missingLevel1 };
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { missingLevel1 } = validateForm();
        if (missingLevel1.length > 0) {
            setValidationErrors({ hard: missingLevel1 });
            setIsValidationPanelVisible(true);
        } else {
            console.log('Form Submitted Data:', formData);
            setIsValidationPanelVisible(false);
            showMessage('合約已成功儲存 (示範操作)。');
        }
    };

    const handleImportData = () => {
        if (!importContractNo.trim()) {
            showMessage('請輸入要帶出的舊合約「華藝合約編號」。', 'error');
            return;
        }
        const sourceContract = MOCK_CONTRACTS.find(c => c.registrationInfo.airitiContractNo === importContractNo.trim());

        if (sourceContract) {
            const importedData = JSON.parse(JSON.stringify(sourceContract));
            const initialData = getInitialFormData();
            importedData.registrationInfo = initialData.registrationInfo;
            importedData.basicInfo.contractTargetType = initialData.basicInfo.contractTargetType;
            importedData.basicInfo.contractStartDate = '';
            importedData.basicInfo.contractEndDate = '';
            delete importedData.id;
            delete importedData.createdAt;
            importedData.maintenanceHistory = [];
            importedData.scanFile = null;
            if (fileInputRef.current) { fileInputRef.current.value = ""; }
            setFormData(importedData);
            showMessage('舊合約資料帶出成功！請確認後修改。');
            setImportContractNo('');
        } else {
            showMessage('找不到對應的華藝合約編號，請確認後再試。', 'error');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, scanFile: e.target.files![0] }));
        }
    };

    const handleContactChange = (index: number, field: string, value: any) => {
        const twBookData = formData as unknown as TaiwanBookContract;
        const updatedContacts = [...(twBookData.twBookContact?.contacts || [])];
        // @ts-ignore
        updatedContacts[index][field] = value;
        handleDynamicFormChange('twBookContact.contacts', updatedContacts);
    };

    const addContact = () => {
        const twBookData = formData as unknown as TaiwanBookContract;
        const newContact = { id: crypto.randomUUID(), info: '', title: [], email: '', phone: '' };
        handleDynamicFormChange('twBookContact.contacts', [...(twBookData.twBookContact?.contacts || []), newContact]);
    };

    const removeContact = (id: string) => {
        const twBookData = formData as unknown as TaiwanBookContract;
        const updatedContacts = (twBookData.twBookContact?.contacts || []).filter(contact => contact.id !== id);
        handleDynamicFormChange('twBookContact.contacts', updatedContacts);
    };

    return {
        formData,
        message,
        platformBulkSelectState,
        rightsBulkSelect,
        importContractNo,
        validationErrors,
        isValidationPanelVisible,
        mainContentRef,
        fileInputRef,
        handleDynamicFormChange,
        handleFormSubmit,
        handleImportData,
        handleFileChange,
        handleContactChange,
        addContact,
        removeContact,
        setImportContractNo,
        setIsValidationPanelVisible,
        showMessage,
        getFieldValue,
        handleBulkSelectClick,
        handleRightsBulkSelectClick,
        getInitialFormData,
        setFormData,
    }
}
