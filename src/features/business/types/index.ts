// 業務部合約相關型別定義

export interface ChangeDetail {
    field: string;
    oldValue: any;
    newValue: any;
}

export interface MaintenanceRecord {
    timestamp: string;
    userId: string;
    userName: string;
    changes: ChangeDetail[];
}

export interface BusinessContract {
    id?: string;
    contractType: 'business_standard';
    basicInfo: {
        managementNo: string;
        contractNo: string;
        salesperson: string;
        clientName: string; // 採購單位
        purchasingYear: string;
        type: string[]; // 類型：合約、報價單
    };
    purchaseContent: {
        isBuyout: string; // '是' | '否'
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
    maintenanceHistory?: MaintenanceRecord[];
}

export type BusinessContractData = BusinessContract;

export interface BusinessFormFieldConfig {
    id: string;
    label: string;
    type: 'text' | 'date' | 'radio' | 'tags' | 'select' | 'textarea' | 'select-multiple' | 'checkbox';
    options?: string[];
    fullWidth?: boolean;
    placeholder?: string;
    fields?: BusinessFormFieldConfig[];
    condition?: (formData: BusinessContractData) => boolean;
    disabledCondition?: (formData: BusinessContractData) => boolean;
}

export interface BusinessParameters {
    productNames: string[];
}
