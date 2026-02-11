import React, { useState, useEffect, useMemo } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { NotificationSettings } from '@/features/auth/types';

export const PersonalNotificationSettings: React.FC = () => {
    const { currentUser, setUsers, users } = useAuth();
    const [currentSettings, setCurrentSettings] = useState<NotificationSettings | null>(null);
    const [message, setMessage] = useState<{ show: boolean; text: string; type: 'success' | 'error' }>({ show: false, text: '', type: 'success' });

    useEffect(() => {
        if (currentUser) {
            // Deep copy to avoid mutating context directly before save
            let settings = JSON.parse(JSON.stringify(currentUser.notificationSettings));

            // Ensure selectedTeamMembers exists (migration for legacy data)
            if (!settings.selectedTeamMembers || settings.selectedTeamMembers.length === 0) {
                settings.selectedTeamMembers = [currentUser.id];
            }
            setCurrentSettings(settings);
        }
    }, [currentUser]);

    const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
        setMessage({ show: true, text, type });
        setTimeout(() => setMessage({ show: false, text: '', type: 'success' }), 3000);
    };

    const handleSettingsChange = (field: keyof NotificationSettings, value: any) => {
        if (!currentSettings) return;
        setCurrentSettings({ ...currentSettings, [field]: value });
    };

    const handleMemberSelectionChange = (memberId: string) => {
        if (!currentSettings) return;

        const currentSelection = currentSettings.selectedTeamMembers || [];
        const newSelection = currentSelection.includes(memberId)
            ? currentSelection.filter(id => id !== memberId)
            : [...currentSelection, memberId];

        setCurrentSettings({ ...currentSettings, selectedTeamMembers: newSelection });
    };

    const handleSaveSettings = () => {
        if (!currentUser || !currentSettings) return;

        // In a real app, this would call an API
        const updatedUser = { ...currentUser, notificationSettings: currentSettings };
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u)); // Update global state

        showMessage('通知設定已成功儲存！');
    };

    const notificationSelectableMembers = useMemo(() => {
        if (!currentUser) return [];
        // Users can select themselves and members of their department if they are managers or generic logic
        // For now, allow selecting same department members
        const membersInDepartment = users.filter(user => {
            if (user.id === currentUser.id) return false;
            // Admin or Manager of 'All Departments' can maybe see everyone? 
            // Stick to current logic: Same department or if user is 'All Departments', see all.
            if (currentUser.department === '所有部門') return true;
            return user.department === currentUser.department;
        });

        return [currentUser, ...membersInDepartment];
    }, [currentUser, users]);

    if (!currentUser || !currentSettings) {
        return <div className="p-8 text-center text-gray-500">載入中...</div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">通知設定</h2>
            <p className="text-gray-600 mb-8">設定個人化的合約到期提醒報告。</p>

            <div className="space-y-8">
                {/* 啟用/停用 */}
                <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">啟用合約到期提醒報告</h3>
                        <p className="text-sm text-gray-500 mt-1">關閉後，您將不會收到任何自動寄送的到期提醒報告。</p>
                    </div>
                    <button
                        type="button"
                        className={`${currentSettings.enabled ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                        onClick={() => handleSettingsChange('enabled', !currentSettings.enabled)}
                    >
                        <span className={`${currentSettings.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                    </button>
                </div>

                {/* 報告內容 */}
                <div className={`p-6 border border-gray-200 rounded-lg ${!currentSettings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">報告內容設定</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">報告應包含多久內到期的合約</label>
                            <select
                                value={currentSettings.reportScopeMonths}
                                onChange={(e) => handleSettingsChange('reportScopeMonths', parseInt(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                disabled={!currentSettings.enabled}
                            >
                                <option value="1">未來 1 個月內</option>
                                <option value="3">未來 3 個月內</option>
                                <option value="6">未來 6 個月內</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">報告寄送頻率</label>
                            <div className="space-y-2">
                                <label className="flex items-center"><input type="radio" value="monthly" checked={currentSettings.reportFrequency === 'monthly'} onChange={(e) => handleSettingsChange('reportFrequency', e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" disabled={!currentSettings.enabled} /><span className="ml-3 text-sm text-gray-700">每月一次 (每月 1 號寄送)</span></label>
                                <label className="flex items-center"><input type="radio" value="bimonthly" checked={currentSettings.reportFrequency === 'bimonthly'} onChange={(e) => handleSettingsChange('reportFrequency', e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" disabled={!currentSettings.enabled} /><span className="ml-3 text-sm text-gray-700">每兩個月一次 (單數月 1 號寄送)</span></label>
                                <label className="flex items-center"><input type="radio" value="quarterly" checked={currentSettings.reportFrequency === 'quarterly'} onChange={(e) => handleSettingsChange('reportFrequency', e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" disabled={!currentSettings.enabled} /><span className="ml-3 text-sm text-gray-700">每季一次 (1, 4, 7, 10 月的 1 號寄送)</span></label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">報告對象</label>
                            <p className="text-sm text-gray-500 mb-3">請勾選您想包含在報告中的成員（可複選）。</p>
                            <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                                {notificationSelectableMembers.map(member => (
                                    <label key={member.id} className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={(currentSettings.selectedTeamMembers || []).includes(member.id)}
                                            onChange={() => handleMemberSelectionChange(member.id)}
                                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            disabled={!currentSettings.enabled}
                                        />
                                        <span className={`ml-3 text-sm text-gray-700 ${member.id === currentUser?.id ? 'font-semibold' : ''}`}>
                                            {member.id === currentUser?.id ? `我負責的合約(${currentUser.name})` : member.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-8">
                <button onClick={handleSaveSettings} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    儲存設定
                </button>
            </div>

            {message.show && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-[100] ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};
