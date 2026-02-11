// 使用者相關型別定義
export interface User {
    id: string;
    name: string;
    employeeId: string;
    email: string;
    department: string;
    password?: string; // Should be hashed in real DB, plain text for mock
    permissions: {
        adminOnly: boolean;
        createMaintain: boolean;
        searchExport: boolean;
        downloadTemplate: boolean;
        maintainTemplate: boolean;
        maintainParams: string;
        landingPage: string;
    };
    notificationSettings: {
        enabled: boolean;
        reportScopeMonths: number;
        reportFrequency: string;
        selectedTeamMembers: string[];
    };
}
