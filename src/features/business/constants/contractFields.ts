import type { BusinessContractData } from '../types';

export const sectionIdToDataKey = (sectionId: string): keyof BusinessContractData | null => {
    switch (sectionId) {
        case 'basic-info': return 'basicInfo';
        case 'purchase-content': return 'purchaseContent';
        default: return null;
    }
};

export const fieldKeyToNameMap: { [key: string]: string } = {
    managementNo: '管理部編號',
    contractNo: '合約編號',
    salesperson: '業務',
    clientName: '採購單位',
    purchasingYear: '採購年份',
    mode: '模式',
    contractStartDate: '履約起始日',
    contractEndDate: '履約結束日',
    attribute: '屬性',
    productName: '採購產品項目',
    amount: '採購金額',
    remarks: '備註',
};
