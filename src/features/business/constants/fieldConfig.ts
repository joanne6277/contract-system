import type { BusinessContractData, BusinessFormFieldConfig } from '../types';

export const businessFieldConfig: { [key: string]: BusinessFormFieldConfig[] } = {
    'basic-info': [
        { id: 'managementNo', label: '管理部編號', type: 'text', placeholder: '例: BUS-2024-001' },
        { id: 'contractNo', label: '合約編號', type: 'text' },
        { id: 'salesperson', label: '業務', type: 'text' },
        { id: 'clientName', label: '採購單位', type: 'text', fullWidth: true },
        { id: 'purchasingYear', label: '採購年份', type: 'text', placeholder: '例: 2024' },
    ],
    'purchase-content': [
        { id: 'mode', label: '採購模式', type: 'select', options: ['單家', '聯採'] },
        { id: 'isBuyout', label: '買斷', type: 'radio', options: ['是', '否'] },
        { id: 'contractStartDate', label: '履約起始日', type: 'date' },
        { id: 'contractEndDate', 
          label: '履約結束日', 
          type: 'date',
          disabledCondition: (formData: BusinessContractData) => formData.purchaseContent?.isBuyout === '是'
        },
        { id: 'attribute', label: '屬性', type: 'tags', placeholder: '輸入屬性後按 Enter...', options: ['機構', '醫院', '學校', '公圖'] },
        { id: 'amount', label: '採購金額', type: 'text' },
        { id: 'productName', label: '採購產品項目', type: 'select-multiple', placeholder: '請選擇產品項目...', fullWidth: true},
        { id: 'remarks', label: '備註', type: 'textarea', fullWidth: true },
    ],
};
