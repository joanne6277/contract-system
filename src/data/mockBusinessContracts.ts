import type { BusinessContract } from '../features/business/types';

export const mockBusinessContracts: BusinessContract[] = [
    {
        id: 'B001',
        contractType: 'business_standard',
        basicInfo: {
            managementNo: 'BUS-2024-001',
            contractNo: 'CON-2024-001',
            salesperson: '張小明',
            clientName: '國立臺灣大學',
            purchasingYear: '2024'
        },
        purchaseContent: {
            mode: '單家',
            contractStartDate: '2024-01-01',
            contractEndDate: '2024-12-31',
            attribute: '學校',
            productName: ['電子書資料庫', '期刊系統'],
            amount: '500,000',
            remarks: '年度續約'
        },
        createdAt: new Date('2024-01-01')
    },
    {
        id: 'B002',
        contractType: 'business_standard',
        basicInfo: {
            managementNo: 'BUS-2024-002',
            contractNo: 'CON-2024-002',
            salesperson: '李美華',
            clientName: '臺北市立圖書館',
            purchasingYear: '2024'
        },
        purchaseContent: {
            mode: '聯採',
            contractStartDate: '2024-02-01',
            contractEndDate: '2025-01-31',
            attribute: '公圖',
            productName: ['數位內容服務'],
            amount: '1,200,000',
            remarks: '三年專案第一年'
        },
        createdAt: new Date('2024-02-01')
    },
    {
        id: 'B003',
        contractType: 'business_standard',
        basicInfo: {
            managementNo: 'BUS-2023-015',
            contractNo: 'CON-2023-088',
            salesperson: '王大同',
            clientName: '臺北榮民總醫院',
            purchasingYear: '2023'
        },
        purchaseContent: {
            mode: '單家',
            contractStartDate: '2023-06-01',
            contractEndDate: '2024-05-31',
            attribute: '醫院',
            productName: ['醫學資料庫', '臨床指引'],
            amount: '850,000',
            remarks: ''
        },
        createdAt: new Date('2023-06-01')
    },
    {
        id: 'B004',
        contractType: 'business_standard',
        basicInfo: {
            managementNo: 'BUS-2024-010',
            contractNo: 'CON-2024-045',
            salesperson: '張小明',
            clientName: '國立成功大學',
            purchasingYear: '2024'
        },
        purchaseContent: {
            mode: '單家',
            contractStartDate: '2024-03-15',
            contractEndDate: '2025-03-14',
            attribute: '學校',
            productName: ['全文資料庫'],
            amount: '300,000',
            remarks: ''
        },
        createdAt: new Date('2024-03-15')
    }
];
