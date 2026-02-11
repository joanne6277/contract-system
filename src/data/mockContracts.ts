// Mock 合約資料
import type { ContractData } from '../features/academic/types';

export const sampleContracts: ContractData[] = [
    {
        id: '1',
        contractTarget: {
            publicationId: 'P12345',
            type: '期刊',
            title: '臺灣教育研究期刊',
            volumeInfo: '第15卷第3期',
            issnIsbn: '1028-8708'
        },
        registrationInfo: {
            managementNo: 'MGT-001',
            departmentNo: 'XF-2024-001',
            departmentSubNo: 'SUB-01',
            collector: '張志明',
            asResponsible: '李佳穎',
            isCurrent: '是',
            contractVersion: ['v1.0', 'v1.1'],
            nonAiritiVersion: ''
        },
        basicInfo: {
            partyARep: '王大明',
            partyBRep: '陳小華',
            contractParty: ['國立臺灣師範大學'],
            contractStartDate: '2024-01-01',
            contractEndDate: '2026-12-31',
            autoRenewYears: '1',
            autoRenewFrequency: '2',
            thereafter: '是',
            specialDateInfo: ''
        },
        rightsInfo: {
            authorizationFormMain: '非專',
            authorizationFormSub: 'L4',
            paymentType: '有償',
            isOpenAccess: '無'
        },
        scopeInfo: {
            thirdPartyPlatform_tws: '上_TWS',
            thirdPartyPlatform_consent: [],
            discoverySystem_selectionType: '單選',
            discoverySystem_futurePlatforms: '含將來合作平台',
            discoverySystem_includeCN: '含CN',
            discoverySystem_platforms: ['Google Scholar'],
            discoverySystem_consent: [],
            comparisonSystem: '否',
            nclClause_selectionType: '不上',
            nclClause_doNotList: [],
            nclClause_embargoRules: [],
            listingLocation: '全球用戶',
            status_al_cn: ''
        },
        otherClauses: {
            usageRightsWarranty: '保證+甲方賠償',
            userRightsProtection: '否',
            terminationClause: '否',
            forceMajeure: '否',
            confidentiality: '否',
            noOaOnOwnWebsite: '否',
            legalIssueHandling: '雙方',
            manuscriptAgreementMention: '否',
            authorizationCopy: '否',
            damages_hasClause: '否',
            damages_description: ''
        },
        remittanceInfo: [],
        terminationInfo: {
            isTerminated: '否',
            terminationReason: '',
            terminationDate: '',
            terminationMethod: ''
        },
        royaltyInfo: [],
        remarks: '',
        createdAt: new Date('2024-01-01'),
        maintenanceHistory: [
            {
                timestamp: '2024-01-10 09:30:00',
                userId: 'Admin001',
                userName: '系統管理員',
                changes: [
                    { field: '合約結束日期', oldValue: '2025-12-31', newValue: '2026-12-31' },
                    { field: '自動續約年限', oldValue: '0', newValue: '1' }
                ]
            }
        ]
    },
    {
        id: '2',
        contractTarget: {
            publicationId: 'P23456',
            type: '期刊',
            title: '中華心理學刊',
            volumeInfo: '第62卷第1期',
            issnIsbn: '1013-9656'
        },
        registrationInfo: {
            managementNo: 'MGT-002',
            departmentNo: 'XF-2024-002',
            departmentSubNo: 'SUB-02',
            collector: '林美玲',
            asResponsible: '陳建宏',
            isCurrent: '是',
            contractVersion: ['v2.0'],
            nonAiritiVersion: ''
        },
        basicInfo: {
            partyARep: '黃子軒',
            partyBRep: '吳雅琪',
            contractParty: ['中華心理學會'],
            contractStartDate: '2023-06-01',
            contractEndDate: '2025-05-31',
            autoRenewYears: '2',
            autoRenewFrequency: '1',
            thereafter: '是',
            specialDateInfo: ''
        },
        rightsInfo: {
            authorizationFormMain: '專',
            authorizationFormSub: 'L1',
            paymentType: '有償',
            isOpenAccess: '無'
        },
        scopeInfo: {
            thirdPartyPlatform_tws: '上_TWS',
            thirdPartyPlatform_consent: ['EBSCO'],
            discoverySystem_selectionType: '全選',
            discoverySystem_futurePlatforms: '含將來合作平台',
            discoverySystem_includeCN: '含CN',
            discoverySystem_platforms: ['Google Scholar', 'Scopus'],
            discoverySystem_consent: [],
            comparisonSystem: '是',
            nclClause_selectionType: 'Embargo',
            nclClause_doNotList: [],
            nclClause_embargoRules: [{ id: 'e1', target: '全文', period: '6個月' }],
            listingLocation: '全球用戶',
            status_al_cn: ''
        },
        otherClauses: {
            usageRightsWarranty: '保證+甲方賠償',
            userRightsProtection: '是',
            terminationClause: '是',
            forceMajeure: '是',
            confidentiality: '是',
            noOaOnOwnWebsite: '否',
            legalIssueHandling: '法律解決',
            manuscriptAgreementMention: '否',
            authorizationCopy: '是',
            damages_hasClause: '是',
            damages_description: '違約金上限為合約總金額之20%'
        },
        remittanceInfo: [],
        terminationInfo: {
            isTerminated: '否',
            terminationReason: '',
            terminationDate: '',
            terminationMethod: ''
        },
        royaltyInfo: [],
        remarks: '重點合作期刊',
        createdAt: new Date('2023-06-01'),
        maintenanceHistory: []
    },
    {
        id: '3',
        contractTarget: {
            publicationId: 'P34567',
            type: '期刊',
            title: '管理學報',
            volumeInfo: '第40卷第4期',
            issnIsbn: '0255-9838'
        },
        registrationInfo: {
            managementNo: 'MGT-003',
            departmentNo: 'XF-2023-015',
            departmentSubNo: 'SUB-03',
            collector: '王俊傑',
            asResponsible: '蔡宜芳',
            isCurrent: '是',
            contractVersion: ['v1.5'],
            nonAiritiVersion: ''
        },
        basicInfo: {
            partyARep: '劉曉明',
            partyBRep: '周婷婷',
            contractParty: ['中華民國管理科學學會'],
            contractStartDate: '2023-01-01',
            contractEndDate: '2024-12-31',
            autoRenewYears: '1',
            autoRenewFrequency: '3',
            thereafter: '否',
            specialDateInfo: ''
        },
        rightsInfo: {
            authorizationFormMain: '非專',
            authorizationFormSub: 'L2',
            paymentType: '無償',
            isOpenAccess: '有'
        },
        scopeInfo: {
            thirdPartyPlatform_tws: '不上_TWS',
            thirdPartyPlatform_consent: [],
            discoverySystem_selectionType: '單選',
            discoverySystem_futurePlatforms: '僅包含現行合作平台',
            discoverySystem_includeCN: '不含CN',
            discoverySystem_platforms: ['Google Scholar'],
            discoverySystem_consent: [],
            comparisonSystem: '否',
            nclClause_selectionType: '不上',
            nclClause_doNotList: [],
            nclClause_embargoRules: [],
            listingLocation: '不上CN',
            status_al_cn: ''
        },
        otherClauses: {
            usageRightsWarranty: '未保證',
            userRightsProtection: '否',
            terminationClause: '是',
            forceMajeure: '是',
            confidentiality: '否',
            noOaOnOwnWebsite: '是',
            legalIssueHandling: '甲方',
            manuscriptAgreementMention: '是',
            authorizationCopy: '否',
            damages_hasClause: '否',
            damages_description: ''
        },
        remittanceInfo: [],
        terminationInfo: {
            isTerminated: '否',
            terminationReason: '',
            terminationDate: '',
            terminationMethod: ''
        },
        royaltyInfo: [],
        remarks: 'OA期刊，無須付費',
        createdAt: new Date('2023-01-01'),
        maintenanceHistory: []
    },
    {
        id: '4',
        contractTarget: {
            publicationId: 'P45678',
            type: '期刊',
            title: '資訊管理學報',
            volumeInfo: '第30卷第2期',
            issnIsbn: '1023-6538'
        },
        registrationInfo: {
            managementNo: 'MGT-004',
            departmentNo: 'XF-2024-008',
            departmentSubNo: 'SUB-04',
            collector: '陳怡君',
            asResponsible: '林志偉',
            isCurrent: '是',
            contractVersion: ['v3.0'],
            nonAiritiVersion: ''
        },
        basicInfo: {
            partyARep: '張家豪',
            partyBRep: '李雅婷',
            contractParty: ['中華民國資訊管理學會'],
            contractStartDate: '2024-03-01',
            contractEndDate: '2027-02-28',
            autoRenewYears: '1',
            autoRenewFrequency: '2',
            thereafter: '是',
            specialDateInfo: ''
        },
        rightsInfo: {
            authorizationFormMain: '專',
            authorizationFormSub: 'L3',
            paymentType: '有償',
            isOpenAccess: '無'
        },
        scopeInfo: {
            thirdPartyPlatform_tws: '上_TWS',
            thirdPartyPlatform_consent: ['ProQuest', 'EBSCO'],
            discoverySystem_selectionType: '全選',
            discoverySystem_futurePlatforms: '含將來合作平台',
            discoverySystem_includeCN: '含CN',
            discoverySystem_platforms: ['Google Scholar', 'Scopus', 'Web of Science'],
            discoverySystem_consent: [],
            comparisonSystem: '是',
            nclClause_selectionType: 'Embargo',
            nclClause_doNotList: [],
            nclClause_embargoRules: [{ id: 'e2', target: '全文', period: '12個月' }],
            listingLocation: '全球用戶',
            status_al_cn: ''
        },
        otherClauses: {
            usageRightsWarranty: '保證+甲方賠償',
            userRightsProtection: '是',
            terminationClause: '是',
            forceMajeure: '是',
            confidentiality: '是',
            noOaOnOwnWebsite: '否',
            legalIssueHandling: '雙方',
            manuscriptAgreementMention: '是',
            authorizationCopy: '是',
            damages_hasClause: '是',
            damages_description: '依實際損失計算'
        },
        remittanceInfo: [],
        terminationInfo: {
            isTerminated: '否',
            terminationReason: '',
            terminationDate: '',
            terminationMethod: ''
        },
        royaltyInfo: [],
        remarks: 'TSSCI核心期刊',
        createdAt: new Date('2024-03-01'),
        maintenanceHistory: []
    },
    {
        id: '5',
        contractTarget: {
            publicationId: 'P56789',
            type: '期刊',
            title: '護理雜誌',
            volumeInfo: '第70卷第5期',
            issnIsbn: '0047-262X'
        },
        registrationInfo: {
            managementNo: 'MGT-005',
            departmentNo: 'XF-2023-022',
            departmentSubNo: 'SUB-05',
            collector: '黃雅芬',
            asResponsible: '周建民',
            isCurrent: '是',
            contractVersion: ['v2.1'],
            nonAiritiVersion: ''
        },
        basicInfo: {
            partyARep: '吳明德',
            partyBRep: '鄭美惠',
            contractParty: ['臺灣護理學會'],
            contractStartDate: '2023-07-01',
            contractEndDate: '2025-06-30',
            autoRenewYears: '2',
            autoRenewFrequency: '1',
            thereafter: '是',
            specialDateInfo: ''
        },
        rightsInfo: {
            authorizationFormMain: '非專',
            authorizationFormSub: 'L4',
            paymentType: '有償',
            isOpenAccess: '無'
        },
        scopeInfo: {
            thirdPartyPlatform_tws: '上_TWS',
            thirdPartyPlatform_consent: [],
            discoverySystem_selectionType: '單選',
            discoverySystem_futurePlatforms: '含將來合作平台',
            discoverySystem_includeCN: '含CN',
            discoverySystem_platforms: ['PubMed', 'CINAHL'],
            discoverySystem_consent: [],
            comparisonSystem: '否',
            nclClause_selectionType: '不上',
            nclClause_doNotList: [],
            nclClause_embargoRules: [],
            listingLocation: '全球用戶',
            status_al_cn: ''
        },
        otherClauses: {
            usageRightsWarranty: '保證+甲方不賠',
            userRightsProtection: '否',
            terminationClause: '是',
            forceMajeure: '否',
            confidentiality: '否',
            noOaOnOwnWebsite: '否',
            legalIssueHandling: '乙方',
            manuscriptAgreementMention: '否',
            authorizationCopy: '否',
            damages_hasClause: '否',
            damages_description: ''
        },
        remittanceInfo: [],
        terminationInfo: {
            isTerminated: '否',
            terminationReason: '',
            terminationDate: '',
            terminationMethod: ''
        },
        royaltyInfo: [],
        remarks: '醫護領域重要期刊',
        createdAt: new Date('2023-07-01'),
        maintenanceHistory: []
    },
    {
        id: '6',
        contractTarget: {
            publicationId: 'P67890',
            type: '期刊',
            title: '法學論叢',
            volumeInfo: '第42卷第1期',
            issnIsbn: '0800-0926'
        },
        registrationInfo: {
            managementNo: 'MGT-006',
            departmentNo: 'XF-2024-011',
            departmentSubNo: 'SUB-06',
            collector: '趙文宏',
            asResponsible: '吳佳蓉',
            isCurrent: '是',
            contractVersion: ['v1.0'],
            nonAiritiVersion: ''
        },
        basicInfo: {
            partyARep: '孫立群',
            partyBRep: '許淑芬',
            contractParty: ['國立臺灣大學法律學院'],
            contractStartDate: '2024-02-01',
            contractEndDate: '2026-01-31',
            autoRenewYears: '1',
            autoRenewFrequency: '2',
            thereafter: '是',
            specialDateInfo: ''
        },
        rightsInfo: {
            authorizationFormMain: '專',
            authorizationFormSub: 'L2',
            paymentType: '有償',
            isOpenAccess: '無'
        },
        scopeInfo: {
            thirdPartyPlatform_tws: '上_TWS',
            thirdPartyPlatform_consent: ['Westlaw'],
            discoverySystem_selectionType: '全選',
            discoverySystem_futurePlatforms: '含將來合作平台',
            discoverySystem_includeCN: '不含CN',
            discoverySystem_platforms: ['Google Scholar', 'HeinOnline'],
            discoverySystem_consent: [],
            comparisonSystem: '是',
            nclClause_selectionType: 'Embargo',
            nclClause_doNotList: [],
            nclClause_embargoRules: [{ id: 'e3', target: '全文', period: '24個月' }],
            listingLocation: '不上CN含港澳',
            status_al_cn: ''
        },
        otherClauses: {
            usageRightsWarranty: '保證+甲方賠償',
            userRightsProtection: '是',
            terminationClause: '是',
            forceMajeure: '是',
            confidentiality: '是',
            noOaOnOwnWebsite: '是',
            legalIssueHandling: '法律解決',
            manuscriptAgreementMention: '是',
            authorizationCopy: '是',
            damages_hasClause: '是',
            damages_description: '每篇論文新台幣5萬元'
        },
        remittanceInfo: [],
        terminationInfo: {
            isTerminated: '否',
            terminationReason: '',
            terminationDate: '',
            terminationMethod: ''
        },
        royaltyInfo: [],
        remarks: '法律領域頂尖期刊',
        createdAt: new Date('2024-02-01'),
        maintenanceHistory: []
    },
    {
        id: '7',
        contractTarget: {
            publicationId: 'P78901',
            type: '期刊',
            title: '經濟論文叢刊',
            volumeInfo: '第51卷第3期',
            issnIsbn: '1018-161X'
        },
        registrationInfo: {
            managementNo: 'MGT-007',
            departmentNo: 'XF-2023-030',
            departmentSubNo: 'SUB-07',
            collector: '鄭雅文',
            asResponsible: '陳俊宇',
            isCurrent: '是',
            contractVersion: ['v1.2'],
            nonAiritiVersion: ''
        },
        basicInfo: {
            partyARep: '林家宏',
            partyBRep: '許志豪',
            contractParty: ['國立臺灣大學經濟學系'],
            contractStartDate: '2023-09-01',
            contractEndDate: '2025-08-31',
            autoRenewYears: '1',
            autoRenewFrequency: '2',
            thereafter: '是',
            specialDateInfo: ''
        },
        rightsInfo: {
            authorizationFormMain: '非專',
            authorizationFormSub: 'L3',
            paymentType: '有償',
            isOpenAccess: '無'
        },
        scopeInfo: {
            thirdPartyPlatform_tws: '上_TWS',
            thirdPartyPlatform_consent: ['EconLit'],
            discoverySystem_selectionType: '單選',
            discoverySystem_futurePlatforms: '含將來合作平台',
            discoverySystem_includeCN: '含CN',
            discoverySystem_platforms: ['Google Scholar', 'RePEc'],
            discoverySystem_consent: [],
            comparisonSystem: '是',
            nclClause_selectionType: '不上',
            nclClause_doNotList: [],
            nclClause_embargoRules: [],
            listingLocation: '全球用戶',
            status_al_cn: ''
        },
        otherClauses: {
            usageRightsWarranty: '保證+甲方賠償',
            userRightsProtection: '是',
            terminationClause: '否',
            forceMajeure: '是',
            confidentiality: '否',
            noOaOnOwnWebsite: '否',
            legalIssueHandling: '雙方',
            manuscriptAgreementMention: '否',
            authorizationCopy: '是',
            damages_hasClause: '否',
            damages_description: ''
        },
        remittanceInfo: [],
        terminationInfo: {
            isTerminated: '否',
            terminationReason: '',
            terminationDate: '',
            terminationMethod: ''
        },
        royaltyInfo: [],
        remarks: 'TSSCI經濟學門A級期刊',
        createdAt: new Date('2023-09-01'),
        maintenanceHistory: []
    },
    {
        id: '8',
        contractTarget: {
            publicationId: 'P89012',
            type: '期刊',
            title: '政治科學論叢',
            volumeInfo: '第95期',
            issnIsbn: '1726-9350'
        },
        registrationInfo: {
            managementNo: 'MGT-008',
            departmentNo: 'XF-2024-005',
            departmentSubNo: 'SUB-08',
            collector: '蔡明志',
            asResponsible: '王淑娟',
            isCurrent: '是',
            contractVersion: ['v2.0'],
            nonAiritiVersion: ''
        },
        basicInfo: {
            partyARep: '胡建國',
            partyBRep: '楊雅惠',
            contractParty: ['國立臺灣大學政治學系'],
            contractStartDate: '2024-04-01',
            contractEndDate: '2026-03-31',
            autoRenewYears: '2',
            autoRenewFrequency: '1',
            thereafter: '是',
            specialDateInfo: ''
        },
        rightsInfo: {
            authorizationFormMain: '專',
            authorizationFormSub: 'L1',
            paymentType: '有償',
            isOpenAccess: '無'
        },
        scopeInfo: {
            thirdPartyPlatform_tws: '上_TWS',
            thirdPartyPlatform_consent: [],
            discoverySystem_selectionType: '全選',
            discoverySystem_futurePlatforms: '含將來合作平台',
            discoverySystem_includeCN: '含CN',
            discoverySystem_platforms: ['Google Scholar', 'Scopus'],
            discoverySystem_consent: [],
            comparisonSystem: '是',
            nclClause_selectionType: 'Embargo',
            nclClause_doNotList: [],
            nclClause_embargoRules: [{ id: 'e4', target: '全文', period: '6個月' }],
            listingLocation: '全球用戶',
            status_al_cn: ''
        },
        otherClauses: {
            usageRightsWarranty: '保證+甲方賠償',
            userRightsProtection: '是',
            terminationClause: '是',
            forceMajeure: '是',
            confidentiality: '是',
            noOaOnOwnWebsite: '否',
            legalIssueHandling: '法律解決',
            manuscriptAgreementMention: '是',
            authorizationCopy: '是',
            damages_hasClause: '是',
            damages_description: '合約金額兩倍'
        },
        remittanceInfo: [],
        terminationInfo: {
            isTerminated: '否',
            terminationReason: '',
            terminationDate: '',
            terminationMethod: ''
        },
        royaltyInfo: [],
        remarks: '',
        createdAt: new Date('2024-04-01'),
        maintenanceHistory: []
    },
    {
        id: '9',
        contractTarget: {
            publicationId: 'P90123',
            type: '期刊',
            title: '社會學研究',
            volumeInfo: '第48卷第2期',
            issnIsbn: '0257-0246'
        },
        registrationInfo: {
            managementNo: 'MGT-009',
            departmentNo: 'XF-2023-018',
            departmentSubNo: 'SUB-09',
            collector: '劉芳宜',
            asResponsible: '張育誠',
            isCurrent: '是',
            contractVersion: ['v1.0'],
            nonAiritiVersion: ''
        },
        basicInfo: {
            partyARep: '謝明輝',
            partyBRep: '林佩瑩',
            contractParty: ['中央研究院社會學研究所'],
            contractStartDate: '2023-05-01',
            contractEndDate: '2025-04-30',
            autoRenewYears: '1',
            autoRenewFrequency: '3',
            thereafter: '是',
            specialDateInfo: ''
        },
        rightsInfo: {
            authorizationFormMain: '非專',
            authorizationFormSub: 'L4',
            paymentType: '無償',
            isOpenAccess: '有'
        },
        scopeInfo: {
            thirdPartyPlatform_tws: '上_TWS',
            thirdPartyPlatform_consent: [],
            discoverySystem_selectionType: '單選',
            discoverySystem_futurePlatforms: '僅包含現行合作平台',
            discoverySystem_includeCN: '含CN',
            discoverySystem_platforms: ['Google Scholar'],
            discoverySystem_consent: [],
            comparisonSystem: '否',
            nclClause_selectionType: '不上',
            nclClause_doNotList: [],
            nclClause_embargoRules: [],
            listingLocation: '全球用戶',
            status_al_cn: ''
        },
        otherClauses: {
            usageRightsWarranty: '未保證',
            userRightsProtection: '否',
            terminationClause: '否',
            forceMajeure: '是',
            confidentiality: '否',
            noOaOnOwnWebsite: '否',
            legalIssueHandling: '甲方',
            manuscriptAgreementMention: '否',
            authorizationCopy: '否',
            damages_hasClause: '否',
            damages_description: ''
        },
        remittanceInfo: [],
        terminationInfo: {
            isTerminated: '否',
            terminationReason: '',
            terminationDate: '',
            terminationMethod: ''
        },
        royaltyInfo: [],
        remarks: 'OA期刊，中研院出版',
        createdAt: new Date('2023-05-01'),
        maintenanceHistory: []
    },
    {
        id: '10',
        contractTarget: {
            publicationId: 'P01234',
            type: '期刊',
            title: '歷史語言研究所集刊',
            volumeInfo: '第94本第4分',
            issnIsbn: '1012-4195'
        },
        registrationInfo: {
            managementNo: 'MGT-010',
            departmentNo: 'XF-2024-003',
            departmentSubNo: 'SUB-10',
            collector: '高明遠',
            asResponsible: '周慧芬',
            isCurrent: '是',
            contractVersion: ['v1.5'],
            nonAiritiVersion: ''
        },
        basicInfo: {
            partyARep: '廖建宏',
            partyBRep: '曾雅慧',
            contractParty: ['中央研究院歷史語言研究所'],
            contractStartDate: '2024-01-15',
            contractEndDate: '2026-01-14',
            autoRenewYears: '2',
            autoRenewFrequency: '2',
            thereafter: '是',
            specialDateInfo: ''
        },
        rightsInfo: {
            authorizationFormMain: '專',
            authorizationFormSub: 'L2',
            paymentType: '有償',
            isOpenAccess: '無'
        },
        scopeInfo: {
            thirdPartyPlatform_tws: '上_TWS',
            thirdPartyPlatform_consent: ['JSTOR'],
            discoverySystem_selectionType: '全選',
            discoverySystem_futurePlatforms: '含將來合作平台',
            discoverySystem_includeCN: '含CN',
            discoverySystem_platforms: ['Google Scholar', 'Scopus'],
            discoverySystem_consent: [],
            comparisonSystem: '是',
            nclClause_selectionType: 'Embargo',
            nclClause_doNotList: [],
            nclClause_embargoRules: [{ id: 'e5', target: '全文', period: '18個月' }],
            listingLocation: '全球用戶',
            status_al_cn: ''
        },
        otherClauses: {
            usageRightsWarranty: '保證+甲方賠償',
            userRightsProtection: '是',
            terminationClause: '是',
            forceMajeure: '是',
            confidentiality: '是',
            noOaOnOwnWebsite: '是',
            legalIssueHandling: '雙方',
            manuscriptAgreementMention: '是',
            authorizationCopy: '是',
            damages_hasClause: '是',
            damages_description: '依合約條款處理'
        },
        remittanceInfo: [],
        terminationInfo: {
            isTerminated: '否',
            terminationReason: '',
            terminationDate: '',
            terminationMethod: ''
        },
        royaltyInfo: [],
        remarks: '中研院人文社會科學重要期刊',
        createdAt: new Date('2024-01-15'),
        maintenanceHistory: []
    },
];
