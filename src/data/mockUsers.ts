// Mock 使用者資料
import type { User } from '../shared/types';

export const sampleUsers: User[] = [
    {
        id: 'user-1',
        name: '王大明 (Admin)',
        employeeId: '12345',
        email: 'admin@example.com',
        department: '學術發展部',
        password: '0000',
        permissions: {
            adminOnly: true,
            createMaintain: true,
            searchExport: true,
            downloadTemplate: true,
            maintainTemplate: true,
            maintainParams: '學術發展部',
            landingPage: '學術發展部'
        },
        notificationSettings: {
            enabled: true,
            reportScopeMonths: 6,
            reportFrequency: 'monthly',
            selectedTeamMembers: ['user-1']
        }
    },
    {
        id: 'user-2',
        name: '李小美 (DDD)',
        employeeId: 'ddd001',
        email: 'ddd@example.com',
        department: '圖書服務部',
        password: '0000',
        permissions: {
            adminOnly: false,
            createMaintain: true,
            searchExport: true,
            downloadTemplate: true,
            maintainTemplate: true,
            maintainParams: '圖書服務部',
            landingPage: '圖書服務部'
        },
        notificationSettings: {
            enabled: true,
            reportScopeMonths: 6,
            reportFrequency: 'monthly',
            selectedTeamMembers: ['user-2']
        }
    },
];
