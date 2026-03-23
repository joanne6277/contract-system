/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

// --- Helper Functions ---
export const getAcademicFieldValue = (obj: any, path: string): any => {
    if (obj === undefined || obj === null) return undefined;

    // Handle virtual/composite columns for sorting
    if (path === 'rightsInfo.authorizationForm') return obj.rightsInfo?.authorizationFormMain;

    return path.split('.').reduce((o, i) => o?.[i], obj);
};

// --- Form Field Config Interface ---
interface FormFieldConfig {
    id: keyof any;
    label: string;
    type: 'text' | 'date' | 'radio' | 'tags' | 'group' | 'cascading-select' | 'custom' | 'select' | 'textarea';
    options?: any;
    fullWidth?: boolean;
    placeholder?: string;
    fields?: FormFieldConfig[]; // For grouped fields
    condition?: (formData: any) => boolean;
    component?: React.FC<any>;
    isReadOnly?: boolean;
}

// --- Helper to convert section ID to data key ---
export const sectionIdToDataKey = (id: string): string => {
    // 個人授權章節統一對應到 personalAuthInfo
    if (id.startsWith('pa-')) return 'personalAuthInfo';
    const key = id.replace(/-(\w)/g, (_, c) => c.toUpperCase());
    return key;
}

// --- Options Constants ---
export const authorizationFormOptions = {
    '非專': ['L4', 'L4臺大方案一', 'L5-1', 'L5-1臺大方案二', 'L5', 'L5臺大方案三'],
    '專屬': ['L1', 'L3'],
    '獨家': ['L2'],
    '共出編輯': [],
    '共同出版': [],
    '亞東專屬': []
};

// --- Custom Field Components (Placeholders for config generation) ---
const ThirdPartyPlatformField = () => null;
const DiscoverySystemField = () => null;
const NclClauseField = () => null;
const DamagesField = () => null;

// --- Field Configuration ---
export const fieldConfig: { [sectionId: string]: FormFieldConfig[] } = {
    'contract-target': [
        { id: 'publicationId', label: 'PublicationID', type: 'text' },
        { id: 'type', label: '類型', type: 'text' },
        { id: 'title', label: '刊名', type: 'text' },
        { id: 'volumeInfo', label: '起始卷期', type: 'text' },
        { id: 'issnIsbn', label: 'ISSN/ISBN', type: 'text' },
    ],
    'registration-info': [
        { id: 'isCurrent', label: '現行合約', type: 'radio', options: ['是', '否'] },
        { id: 'managementNo', label: '管理部編號', type: 'text' },
        { id: 'departmentNo', label: '學術發展部合約編號', type: 'text' },
        { id: 'departmentSubNo', label: '學術發展部合約子編號', type: 'text' },
        { id: 'collector', label: '負責徵集', type: 'text' },
        { id: 'asResponsible', label: '負責AS', type: 'text' },
        { id: 'contractVersion', label: '合約版本', type: 'select', options: ['20240102', '20250101'], fullWidth: true },
        { id: 'nonAiritiVersion', label: '非華藝版本號', type: 'text', fullWidth: true },
    ],
    'basic-info': [
        { id: 'contractParty', label: '簽約單位', type: 'tags', fullWidth: true, placeholder: '新增單位後按 Enter...' },
        { id: 'partyARep', label: '甲方簽約代表', type: 'text' },
        { id: 'partyBRep', label: '乙方簽約代表', type: 'text' },
        { id: 'contractStartDate', label: '合約起日', type: 'date' },
        { id: 'contractEndDate', label: '合約迄日', type: 'date' },
        {
            id: 'autoRenew', label: '自動續約', type: 'group', fields: [
                { id: 'autoRenewYears', label: '自動續約___年', type: 'text' },
                { id: 'autoRenewFrequency', label: '每___年續 einmal', type: 'text' },
            ]
        },
        { id: 'thereafter', label: '其後亦同', type: 'radio', options: ['是', '否'] },
        { id: 'specialDateInfo', label: '特殊年限資訊', type: 'text', fullWidth: true },
    ],
    'rights-info': [
        { id: 'authorizationForm', label: '授權形式', type: 'cascading-select', options: authorizationFormOptions, fullWidth: true },
        { id: 'paymentType', label: '有償_無償', type: 'radio', options: ['有償', '無償'] },
        { id: 'isOpenAccess', label: 'OA', type: 'radio', options: ['有', '無'] },
    ],
    'scope-info': [
        { id: 'thirdPartyPlatform', label: '第三方平台', type: 'custom', component: ThirdPartyPlatformField, fullWidth: true },
        { id: 'discoverySystem', label: '國際第三方發現系統或平台', type: 'custom', component: DiscoverySystemField, fullWidth: true },
        { id: 'comparisonSystem', label: '比對系統', type: 'radio', options: ['是', '否'] },
        { id: 'nclClause', label: '不上國圖條文｜第三方平台', type: 'custom', component: NclClauseField, fullWidth: true },
        { id: 'listingLocation', label: '上架位置', type: 'radio', options: ['全球用戶', '不上CN', '不上CN含港澳'] },
        { id: 'status_al_cn', label: '不上AL_CN_現行狀況', type: 'text', fullWidth: true },
    ],
    'other-clauses': [
        { id: 'usageRightsWarranty', label: '甲方義務_甲方保証有使用權利', type: 'select', options: ['保證+甲方賠償', '保證+甲方不賠', '未保證'] },
        { id: 'userRightsProtection', label: '用戶權益保障', type: 'radio', options: ['是', '否'] },
        { id: 'terminationClause', label: '合約終止_書目更動_終止條文', type: 'radio', options: ['是', '否'] },
        { id: 'forceMajeure', label: '不可抗力條款', type: 'radio', options: ['是', '否'] },
        { id: 'confidentiality', label: '保密條款', type: 'radio', options: ['是', '否'] },
        { id: 'noOaOnOwnWebsite', label: '自有網站不OA條文', type: 'radio', options: ['是', '否'] },
        { id: 'legalIssueHandling', label: '法律問題處理', type: 'select', options: ['甲方', '乙方', '雙方', '法律解決'] },
        { id: 'manuscriptAgreementMention', label: '甲方義務_稿約明文規定', type: 'radio', options: ['是', '否'] },
        { id: 'authorizationCopy', label: '甲方義務_收授權書_影本', type: 'radio', options: ['是', '否'] },
        { id: 'damages', label: '損害賠償', type: 'custom', component: DamagesField, fullWidth: true },
    ],
    'remittance-info': [
        { id: 'beneficiary', label: '分潤主體', type: 'text', fullWidth: true, isReadOnly: true },
        { id: 'accountType', label: '帳戶類別', type: 'radio', options: ['國內', '海外'] },
        { id: 'accountName', label: '戶名', type: 'text' },
        { id: 'checkTitle', label: '支票抬頭', type: 'text' },
        { id: 'currency', label: '幣別', type: 'text' },
        { id: 'bankName', label: '銀行名稱', type: 'text' },
        { id: 'branchName', label: '分行名稱', type: 'text' },
        { id: 'accountNumber', label: '帳號', type: 'text' },
        { id: 'accountNotes', label: '帳號密碼_帳戶備註', type: 'text', fullWidth: true },
        { id: 'taxId', label: '統一編號', type: 'text' },
        { id: 'idNumber', label: '身份證字號', type: 'text' },
        { id: 'royaltySettlementMonth', label: '權利金_明定結算月份', type: 'text' },
        { id: 'paymentReceiptFlow', label: '權利金_先給錢_後給收據', type: 'text' },
    ],
    'termination-info': [
        { id: 'isTerminated', label: '解約', type: 'radio', options: ['是', '否'] },
        { id: 'terminationReason', label: '解約原因', type: 'text', condition: formData => formData.terminationInfo?.isTerminated === '是' },
        { id: 'terminationDate', label: '解約日期', type: 'date', condition: formData => formData.terminationInfo?.isTerminated === '是' },
        { id: 'terminationMethod', label: '解約方式', type: 'text', condition: formData => formData.terminationInfo?.isTerminated === '是' },
    ],
    'remarks': [
        { id: 'remarks', label: '', type: 'textarea' },
    ],
    // --- 個人授權專用欄位 ---
    'pa-registration-info': [
        { id: 'publicationId', label: 'PublicationID', type: 'text' },
        { id: 'type', label: '類型', type: 'text', isReadOnly: true },
        { id: 'contractNo', label: '合約編號', type: 'text' },
        { id: 'journalName', label: '期刊名稱', type: 'text' },
        { id: 'volumeIssue', label: '卷期', type: 'text' },
        { id: 'articleTitle', label: '論文名稱_內容', type: 'text', fullWidth: true },
    ],
    'pa-rights-info': [
        { id: 'authorizationDate', label: '授權書日期', type: 'date' },
        { id: 'authorizationStatus', label: '授權狀態_提領方式', type: 'select', options: ['非專個人領取', '非專無償', '個人領取', '捐贈慈善基金會'] },
        { id: 'authorizationRegion', label: '授權地區', type: 'select', options: ['不上CN', '不上CN_含港澳', '全球用戶'] },
        { id: 'royaltyUid', label: '權利金掛UID', type: 'text' },
    ],
    'pa-other-info': [
        { id: 'authorName', label: '作者姓名', type: 'text' },
        { id: 'paRemarks', label: '備註', type: 'textarea', fullWidth: true },
        { id: 'email', label: 'Email', type: 'text' },
        { id: 'phone', label: '電話', type: 'text' },
        { id: 'address', label: '地址', type: 'text', fullWidth: true },
        { id: 'docid', label: 'docid', type: 'text' },
    ],
};

// --- Field Key to Name Map ---
export const fieldKeyToNameMap: { [key: string]: string } = {
    'rightsInfo.authorizationFormMain': '授權形式 (主)',
    'rightsInfo.authorizationFormSub': '授權形式 (子)',
    'scopeInfo.thirdPartyPlatform_tws': '第三方平台 TWS',
    'scopeInfo.thirdPartyPlatform_consent': '第三方平台 書面同意/通知',
    'scopeInfo.discoverySystem_selectionType': '國際第三方發現系統 選擇類型',
    'scopeInfo.discoverySystem_futurePlatforms': '國際第三方發現系統 將來平台',
    'scopeInfo.discoverySystem_includeCN': '國際第三方發現系統 CN',
    'scopeInfo.discoverySystem_platforms': '國際第三方發現系統 平台',
    'scopeInfo.discoverySystem_consent': '國際第三方發現系統 書面同意/通知',
    'scopeInfo.comparisonSystem': '比對系統',
    'scopeInfo.nclClause_selectionType': '不上國圖條文 選擇類型',
    'scopeInfo.nclClause_doNotList': '不上國圖條文 不上列表',
    'scopeInfo.nclClause_embargoRules': '不上國圖條文 Embargo規則',
    'scopeInfo.listingLocation': '上架位置',
    'scopeInfo.status_al_cn': '不上AL_CN_現行狀況',
    'scopeInfo.thirdPartyPlatform': '第三方平台',
    'scopeInfo.discoverySystem': '國際第三方發現系統或平台',
    'scopeInfo.nclClause': '不上國圖條文｜第三方平台',
    'otherClauses.damages_hasClause': '損害賠償 (是否)',
    'otherClauses.damages_description': '損害賠償 (說明)',
    'otherClauses.damages': '損害賠償',
    'remarks.remarks': '備註',
    // 個人授權欄位
    'personalAuthInfo.publicationId': 'PublicationID (個人授權)',
    'personalAuthInfo.type': '類型 (個人授權)',
    'personalAuthInfo.contractNo': '合約編號',
    'personalAuthInfo.journalName': '期刊名稱',
    'personalAuthInfo.volumeIssue': '卷期',
    'personalAuthInfo.articleTitle': '論文名稱_內容',
    'personalAuthInfo.authorizationDate': '授權書日期',
    'personalAuthInfo.authorizationStatus': '授權狀態_提領方式',
    'personalAuthInfo.authorizationRegion': '授權地區',
    'personalAuthInfo.royaltyUid': '權利金掛UID',
    'personalAuthInfo.authorName': '作者姓名',
    'personalAuthInfo.paRemarks': '備註 (個人授權)',
    'personalAuthInfo.email': 'Email',
    'personalAuthInfo.phone': '電話',
    'personalAuthInfo.address': '地址',
    'personalAuthInfo.docid': 'docid',
};

// Initialize the map and ordered keys from config
export const orderedFieldKeys: string[] = [];

Object.keys(fieldConfig).forEach(sectionId => {
    const dataKey = sectionIdToDataKey(sectionId);
    fieldConfig[sectionId].forEach(field => {
        if (field.type === 'group' && field.fields) {
            field.fields.forEach(subField => {
                const key = `${dataKey}.${String(subField.id)}`;
                fieldKeyToNameMap[key] = subField.label;
                orderedFieldKeys.push(key);
            });
        } else if (field.type !== 'cascading-select' && field.type !== 'custom') {
            const key = `${dataKey}.${String(field.id)}`;
            fieldKeyToNameMap[key] = field.label;
            orderedFieldKeys.push(key);
        }
    });
});

// Reverse map for history reconstruction
export const fieldNameToKeyMap: { [name: string]: string } = Object.entries(fieldKeyToNameMap).reduce((acc, [key, name]) => {
    acc[name] = key;
    return acc;
}, {} as { [name: string]: string });
