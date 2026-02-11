export type Department = '學術發展部' | '圖書服務部' | '所有部門';

export interface PermissionSet {
    adminOnly: boolean;
    createMaintain: boolean;
    searchExport: boolean;
    downloadTemplate: boolean;
    maintainTemplate: boolean;
    maintainParams: '學術發展部' | '圖書服務部' | '不開放';
    landingPage: string;
}

export interface NotificationSettings {
    enabled: boolean;
    reportScopeMonths: number;
    reportFrequency: 'monthly' | 'bimonthly' | 'quarterly';
    selectedTeamMembers: string[];
}

export interface User {
    id: string;
    name: string;
    employeeId: string;
    email: string;
    department: Department;
    permissions: PermissionSet;
    notificationSettings: NotificationSettings;
    managerId?: string | null;
    password?: string;
}
