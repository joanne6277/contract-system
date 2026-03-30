// 業務部合約相關型別定義

export interface BusinessContract {
    id?: string;
    contractType: 'business_standard';
    basicInfo: {
        managementNo: string;
        contractNo: string;
        salesperson: string;
        clientName: string; // 採購單位
        purchasingYear: string;
    };
    purchaseContent: {
        mode: string;
        contractStartDate: string;
        contractEndDate: string;
        attribute: string;
        productName: string[]; // 採購產品項目
        amount: string;
        remarks: string;
    };
    scanFile?: File | string | null;
    createdAt?: Date;
}

export type BusinessContractData = BusinessContract;

export interface BusinessFormFieldConfig {
    id: string;
    label: string;
    type: 'text' | 'date' | 'radio' | 'tags' | 'select' | 'textarea';
    options?: string[];
    fullWidth?: boolean;
    placeholder?: string;
    fields?: BusinessFormFieldConfig[];
    condition?: (formData: BusinessContractData) => boolean;
}
