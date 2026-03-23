// 圖書服務部 (DDD) 合約相關型別定義
import type { CheckboxWithTextData, DropdownWithTextData, PercentageWithTextData } from '../../../shared/types';


export interface ScopeInfo {
    b2bSalesRightsToggle: 'yes' | 'no' | 'by_title' | '';
    b2bAuthorizationType: string;
    b2bSplitPercentage: PercentageWithTextData;
    b2bSalesRegion: string;
    b2bMinMultiple: string;
    b2bRoyaltyAdjustment: 'yes' | 'no' | '';
    b2bPricingPower: 'yes' | 'no' | '';
    b2bLease: CheckboxWithTextData;
    b2bBuyout: CheckboxWithTextData;
    b2bPayPerUse: CheckboxWithTextData;
    b2bPda: CheckboxWithTextData;
    b2bAlliance: CheckboxWithTextData;
    b2bPublicTender: CheckboxWithTextData;
    b2bRestrictiveTender: CheckboxWithTextData;
    subscription: 'yes' | 'no' | '';
    eLibrarySalesRight: 'yes' | 'no' | '';
    eLibraryContractType: string;
    eLibrarySplit: PercentageWithTextData;
    eLibraryPricing: string;
}

export interface OtherClauses {
    b2cSalesRightsToggle: 'yes' | 'no' | 'by_title' | '';
    b2cAuthorizationType: string;
    b2cSplitPercentage: PercentageWithTextData;
    b2cSalesRegion: string;
    b2cQuotationPrinciple: string;
    b2cRoyaltyAdjustment: 'yes' | 'no' | '';
    b2cPricingPower: 'yes' | 'no' | '';
    b2cLease: CheckboxWithTextData;
    b2cBuyout: CheckboxWithTextData;
    b2cPayPerUse: CheckboxWithTextData;
    b2cVariablePriceAuth: CheckboxWithTextData;
    shuNiuXiong: CheckboxWithTextData;
    kingstone: CheckboxWithTextData;
    sanmin: CheckboxWithTextData;
    taaze: CheckboxWithTextData;
    trmsSalesRightsToggle: 'yes' | 'no' | 'by_title' | '';
    trmsSplitPercentage: PercentageWithTextData;
    distributorPlatformToggle: 'yes' | 'no' | 'by_title' | '';
    distributorSplit: PercentageWithTextData;
    cannotListPlatforms: string;
    amazon: CheckboxWithTextData;
    google: CheckboxWithTextData;
    kobo: CheckboxWithTextData;
    pubu: CheckboxWithTextData;
    eslite: CheckboxWithTextData;
    pchome: CheckboxWithTextData;
    readmoo: CheckboxWithTextData;
    udn: CheckboxWithTextData;
    bookwalker: CheckboxWithTextData;
    hyweb: CheckboxWithTextData;
    bookscom: CheckboxWithTextData;
    apple: CheckboxWithTextData;
    mybook: CheckboxWithTextData;
    momo: CheckboxWithTextData;
    twb: CheckboxWithTextData;
    hkUe: CheckboxWithTextData;
    ingram: CheckboxWithTextData;
    overdrive: CheckboxWithTextData;
    hami: CheckboxWithTextData;
    truth: CheckboxWithTextData;
    wechat: CheckboxWithTextData;
}

export interface TaiwaneseBookRights {
    exclusiveAuthorization: 'exclusive' | 'non_exclusive' | '';
    exclusiveConditions: string;
    trialTwBook: PercentageWithTextData;
    fullTextDigitizationTwBook: 'yes' | 'no' | '';
}

export interface TaiwaneseBookAccounting {
    twBookOverseasDiscount: PercentageWithTextData;
    twBookBillingCycle: DropdownWithTextData;
    twBookPaymentMethod: CheckboxWithTextData;
    twBookPaymentTerms: string;
    twBookAccountHolder: string;
    twBookPayeeInfo: CheckboxWithTextData;
    twBookBankName: string;
    twBookBranchName: string;
    twBookAccountNumber: string;
}

export interface TaiwaneseBookLogistics {
    minimumShipmentThreshold: string;
    freeShippingThreshold: string;
    returnCycle: DropdownWithTextData;
    nonDefectiveReturnShippingFee: DropdownWithTextData;
    domesticReturnShippingFee: DropdownWithTextData;
    sampleBookDiscount: PercentageWithTextData;
    sampleBookBillingCycle: string;
    authorizedSalesRegion: string;
    subDistribution: 'yes' | 'no' | '';
}

export interface ContactPerson {
    id: string;
    info: string;
    title: string[];
    email: string;
    phone: string;
}

export interface TaiwaneseBookContact {
    publisherRegion: 'domestic' | 'overseas' | '';
    contacts: ContactPerson[];
    companyPostalCode: string;
    companyAddress: string;
    logisticsPostalCode: string;
    logisticsAddress: string;
}

// 圖書服務部 (DDD) 專用的 ContractData
export type DDDContractType = 'ebook_magazine' | 'taiwan_book';

export interface BaseDDDContract {
    id?: string;
    contractType: DDDContractType;
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
    remarks: string;
    scanFile?: File | string | null;
    createdAt?: Date;
    maintenanceHistory?: unknown[];
}

export interface EbookMagazineContract extends BaseDDDContract {
    contractType: 'ebook_magazine';
    rightsInfo: {
        trialPercentage: PercentageWithTextData;
        printingPercentage: PercentageWithTextData;
        fullTextDigitization: CheckboxWithTextData;
        trialAccess: CheckboxWithTextData;
        tts: CheckboxWithTextData;
        fullTextSearch: CheckboxWithTextData;
        dataComparison: CheckboxWithTextData;
        systemData: CheckboxWithTextData;
        captureAnalysisProcessing: CheckboxWithTextData;
        autoGeneration: CheckboxWithTextData;
        algorithmTraining: CheckboxWithTextData;
        languageSwitching: CheckboxWithTextData;
        chapterPresentation: CheckboxWithTextData;
        chapterSales: CheckboxWithTextData;
        marketingModel: CheckboxWithTextData;
        publisherSpecs: CheckboxWithTextData;
        doiApplication: string;
        doiFee: string;
        thirdPartyAuthorization: CheckboxWithTextData;
        thirdPartyConsignment: CheckboxWithTextData;
        salesChannels: CheckboxWithTextData;
        paymentMethodRights: CheckboxWithTextData;
        listingSchedule: CheckboxWithTextData;
        listingItems: CheckboxWithTextData;
        listingPlatforms: CheckboxWithTextData;
        tradingConditions: CheckboxWithTextData;
        contentPresentation: CheckboxWithTextData;
        serviceModel: CheckboxWithTextData;
    };
    scopeInfo: ScopeInfo;
    otherClauses: OtherClauses;
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
}

export interface TaiwanBookContract extends BaseDDDContract {
    contractType: 'taiwan_book';
    twBookRights: TaiwaneseBookRights;
    twBookAccounting: TaiwaneseBookAccounting;
    twBookLogistics: TaiwaneseBookLogistics;
    twBookContact: TaiwaneseBookContact;
}

export type TuFuContractData = EbookMagazineContract | TaiwanBookContract;

// 重新導出共用型別
export type { CheckboxWithTextData, DropdownWithTextData, PercentageWithTextData } from '../../../shared/types';
