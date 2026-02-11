// 學發部合約相關型別定義
import type React from 'react';

export interface VolumeIdentifier {
    format: 'volume_issue' | 'year_month' | 'text';
    volume: string;
    issue: string;
    year: string;
    month: string;
    description: string;
}

export interface RoyaltySplit {
    id: string;
    beneficiary: string;
    percentage: string;
}

export interface VolumeRule {
    id: string;
    startVolumeInfo: VolumeIdentifier;
    endVolumeInfo: VolumeIdentifier;
    royaltySplits: RoyaltySplit[];
}

export interface DateScheme {
    id: string;
    startDate: string;
    endDate: string;
    volumeRules: VolumeRule[];
}

export interface EmbargoRule {
    id: string;
    target: string;
    period: string;
}

export interface RemittanceInfoItem {
    id: string;
    beneficiary: string;
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
}

// 學發部 ContractData
export interface ContractData {
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
        contractParty: string[];
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
    remittanceInfo: RemittanceInfoItem[];
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
    maintenanceHistory?: unknown[];
}

export interface SearchColumn {
    id: string;
    name: string;
    isDefault: boolean;
}

export interface FormFieldConfig {
    id: string;
    label: string;
    type: 'text' | 'date' | 'radio' | 'tags' | 'group' | 'cascading-select' | 'custom' | 'select' | 'textarea';
    options?: string[] | { [key: string]: string[] };
    fullWidth?: boolean;
    placeholder?: string;
    fields?: FormFieldConfig[];
    condition?: (formData: ContractData) => boolean;
    component?: React.ComponentType<any>;
    isReadOnly?: boolean;
}
