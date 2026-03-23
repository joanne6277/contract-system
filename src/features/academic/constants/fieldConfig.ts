// 學發部 - 表單欄位設定
import type { FormFieldConfig, ContractData, SearchColumn } from '../types';

import { ThirdPartyPlatformField, DiscoverySystemField, NclClauseField, DamagesField } from '../components';

export const authorizationFormOptions = {
    '非專': ['L4', 'L4臺大方案一', 'L5-1', 'L5-1臺大方案二', 'L5', 'L5臺大方案三'],
    '專屬': ['L1', 'L3'],
    '獨家': ['L2'],
    '共出編輯': [],
    '共同出版': [],
    '亞東專屬': []
};

export const fieldConfig: { [sectionId: string]: FormFieldConfig[] } = {
    'contract-target': [
        { id: 'publicationId', label: 'PublicationID', type: 'text' },
        { id: 'type', label: '類型', type: 'select', options: ['期刊', '論文集', '個人授權'] },
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
        { id: 'contractParty', label: '簽約單位', type: 'tags', fullWidth: true, placeholder: "新增單位後按 Enter..." },
        { id: 'partyARep', label: '甲方簽約代表', type: 'text', fullWidth: true },
        { id: 'partyBRep', label: '乙方簽約代表', type: 'text' },
        { id: 'contractStartDate', label: '合約起日', type: 'date' },
        { id: 'contractEndDate', label: '合約迄日', type: 'date' },
        {
            id: 'autoRenew', label: '自動續約', type: 'group', fields: [
                { id: 'autoRenewYears', label: '自動續約___年', type: 'text' },
                { id: 'autoRenewFrequency', label: '每___年續一次', type: 'text' },
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
        { id: 'terminationReason', label: '解約原因', type: 'text', condition: (formData: ContractData) => formData.contractType === 'journal_proceedings' && formData.terminationInfo?.isTerminated === '是' },
        { id: 'terminationDate', label: '解約日期', type: 'date', condition: (formData: ContractData) => formData.contractType === 'journal_proceedings' && formData.terminationInfo?.isTerminated === '是' },
        { id: 'terminationMethod', label: '解約方式', type: 'text', condition: (formData: ContractData) => formData.contractType === 'journal_proceedings' && formData.terminationInfo?.isTerminated === '是' },
    ],
    'remarks': [
        { id: 'remarks', label: '', type: 'textarea' },
    ],
    // --- 個人授權專用欄位 ---
    'pa-registration-info': [
        { id: 'publicationId', label: 'PublicationID', type: 'text' },
        { id: 'type', label: '類型', type: 'select', options: ['期刊', '論文集', '個人授權'] },
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
        { id: 'authors', label: '作者資料', type: 'custom', fullWidth: true },
        { id: 'paRemarks', label: '備註', type: 'textarea', fullWidth: true },
        { id: 'docid', label: 'docid', type: 'text' },
    ],
};

export const defaultSearchColumns: SearchColumn[] = [
    { id: 'title', name: '刊名', isDefault: true },
    { id: 'managementNo', name: '管理編號', isDefault: true },
];
