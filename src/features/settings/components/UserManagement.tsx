import React, { useState, useMemo } from 'react';
import { Plus, ChevronDown, ChevronUp, ArrowUpDown, Trash2, Settings, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { User, Department, NotificationSettings } from '@/features/auth/types';

interface UserManagementProps {
}

export const UserManagement: React.FC<UserManagementProps> = () => {
    const { users, setUsers, currentUser } = useAuth();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userSortColumn, setUserSortColumn] = useState<string>('employeeId');
    const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc');
    const [message, setMessage] = useState<{ show: boolean; text: string; type: 'success' | 'error' }>({ show: false, text: '', type: 'success' });

    const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
        setMessage({ show: true, text, type });
        setTimeout(() => setMessage({ show: false, text: '', type: 'success' }), 3000);
    };

    const defaultNotificationSettings: NotificationSettings = {
        enabled: true,
        reportScopeMonths: 3,
        reportFrequency: 'monthly',
        selectedTeamMembers: [],
    };

    const handleOpenUserModal = (user: User | null) => {
        if (user) {
            setEditingUser({ ...user });
        } else {
            setEditingUser({
                id: '',
                name: '',
                employeeId: '',
                email: '',
                department: '學術發展部',
                permissions: { adminOnly: false, createMaintain: false, searchExport: true, downloadTemplate: true, maintainTemplate: false, maintainParams: '不開放', landingPage: '學術發展部' },
                notificationSettings: defaultNotificationSettings,
                managerId: null
            });
        }
        setPassword('');
        setConfirmPassword('');
        setIsUserModalOpen(true);
    };

    const handleSaveUser = () => {
        if (!editingUser) return;

        if (!editingUser.id) {
            if (!password || !confirmPassword) { showMessage('請設定初始密碼', 'error'); return; }
            if (password !== confirmPassword) { showMessage('兩次輸入的密碼不一致', 'error'); return; }
        } else {
            if (password && password !== confirmPassword) { showMessage('兩次輸入的密碼不一致', 'error'); return; }
        }

        const userToSave: User = { ...editingUser };
        if (password) { userToSave.password = password; }

        if (userToSave.id) {
            setUsers(users.map(u => u.id === userToSave.id ? userToSave : u));
            showMessage('使用者權限已更新！');
        } else {
            const newUser = { ...userToSave, id: `user-${Date.now()}` };
            setUsers([...users, newUser]);
            showMessage('新使用者已成功建立！');
        }
        setIsUserModalOpen(false);
        setEditingUser(null);
    };

    const handleDeleteUser = () => {
        if (!userToDelete) return;
        setUsers(users.filter(u => u.id !== userToDelete.id));
        showMessage(`已刪除使用者：${userToDelete.name}`);
        setUserToDelete(null);
    };

    const handleUserSort = (columnKey: string) => {
        if (userSortColumn === columnKey) {
            setUserSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setUserSortColumn(columnKey);
            setUserSortDirection('asc');
        }
    };

    const sortedUsers = useMemo(() => {
        const sorted = [...users].sort((a, b) => {
            const aValue = (a as any)[userSortColumn];
            const bValue = (b as any)[userSortColumn];
            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;
            return String(aValue).localeCompare(String(bValue), 'zh-Hant');
        });
        if (userSortDirection === 'desc') {
            return sorted.reverse();
        }
        return sorted;
    }, [users, userSortColumn, userSortDirection]);

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="flex justify-between items-center mb-6">
                <div><h2 className="text-2xl font-bold text-gray-800">權限管理</h2><p className="text-gray-600 mt-1">在此建立與管理系統使用者及其權限。</p></div>
                <button onClick={() => handleOpenUserModal(null)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"><Plus className="w-4 h-4 mr-2" />建立新使用者</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {['姓名', '員工編號', '信箱', '部門權限'].map(header => {
                                const keyMap: { [key: string]: string } = { '姓名': 'name', '員工編號': 'employeeId', '信箱': 'email', '部門權限': 'department' };
                                const columnKey = keyMap[header];
                                return (
                                    <th key={columnKey} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button className="flex items-center hover:text-gray-700" onClick={() => handleUserSort(columnKey)}>
                                            <span>{header}</span>
                                            {userSortColumn === columnKey ? (
                                                userSortDirection === 'asc' ? <ChevronDown className="w-4 h-4 ml-1" /> : <ChevronUp className="w-4 h-4 ml-1" />
                                            ) : (
                                                <ArrowUpDown className="w-4 h-4 ml-1 text-gray-300" />
                                            )}
                                        </button>
                                    </th>
                                )
                            })}
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.employeeId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.department === '學術發展部' ? 'bg-blue-100 text-blue-800' : user.department === '圖書服務部' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                                        {user.department}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => handleOpenUserModal(user)} className="text-indigo-600 hover:text-indigo-900" title="編輯權限"><Settings className="w-4 h-4 inline-block" /></button>
                                    {currentUser?.id !== user.id && <button onClick={() => setUserToDelete(user)} className="text-red-600 hover:text-red-900" title="刪除"><Trash2 className="w-4 h-4 inline-block" /></button>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal & Dialogs logic here - simplified inline or reused */}
            {isUserModalOpen && editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex justify-center items-center">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200"><h3 className="text-xl font-bold text-gray-800">{editingUser.id ? '編輯使用者權限' : '建立新使用者'}</h3></div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">姓名</label><input type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">員工編號 (登入帳號)</label><input type="text" value={editingUser.employeeId} onChange={e => setEditingUser({ ...editingUser, employeeId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1">所屬部門</label><select value={editingUser.department} onChange={e => setEditingUser({ ...editingUser, department: e.target.value as Department })} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="學術發展部">學術發展部</option><option value="圖書服務部">圖書服務部</option><option value="所有部門">所有部門 (主管)</option></select></div>
                            </div>
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">系統權限設定</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={editingUser.permissions.searchExport} onChange={e => setEditingUser({ ...editingUser, permissions: { ...editingUser.permissions, searchExport: e.target.checked } })} className="h-4 w-4 text-indigo-600" /><span className="text-gray-700">搜尋合約/匯出資料</span></label>
                                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={editingUser.permissions.createMaintain} onChange={e => setEditingUser({ ...editingUser, permissions: { ...editingUser.permissions, createMaintain: e.target.checked } })} className="h-4 w-4 text-indigo-600" /><span className="text-gray-700">建立/維護合約</span></label>
                                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={editingUser.permissions.downloadTemplate} onChange={e => setEditingUser({ ...editingUser, permissions: { ...editingUser.permissions, downloadTemplate: e.target.checked } })} className="h-4 w-4 text-indigo-600" /><span className="text-gray-700">下載合約範本</span></label>
                                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={editingUser.permissions.maintainTemplate} onChange={e => setEditingUser({ ...editingUser, permissions: { ...editingUser.permissions, maintainTemplate: e.target.checked } })} className="h-4 w-4 text-indigo-600" /><span className="text-gray-700">維護合約範本</span></label>
                                    <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"><input type="checkbox" checked={editingUser.permissions.adminOnly} onChange={e => setEditingUser({ ...editingUser, permissions: { ...editingUser.permissions, adminOnly: e.target.checked } })} className="h-4 w-4 text-indigo-600" /><span className="text-gray-700">使用者權限設定 (Admin)</span></label>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">參數設定權限</label>
                                    <select value={editingUser.permissions.maintainParams} onChange={e => setEditingUser({ ...editingUser, permissions: { ...editingUser.permissions, maintainParams: e.target.value as any } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                        <option value="不開放">不開放</option>
                                        <option value="學術發展部">僅限學術發展部參數</option>
                                        <option value="圖書服務部">僅限圖書服務部參數</option>
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">登入後首頁</label>
                                    <select value={editingUser.permissions.landingPage} onChange={e => setEditingUser({ ...editingUser, permissions: { ...editingUser.permissions, landingPage: e.target.value } })} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="學術發展部">學術發展部</option><option value="圖書服務部">圖書服務部</option></select>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">{editingUser.id ? '重設密碼 (若不修改請留空)' : '設定密碼'}</h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">密碼</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="請輸入密碼" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-1">確認密碼</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="請再次輸入密碼" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end space-x-4 rounded-b-xl">
                            <button onClick={() => setIsUserModalOpen(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">取消</button>
                            <button onClick={handleSaveUser} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">儲存設定</button>
                        </div>
                    </div>
                </div>
            )}

            {userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex justify-center items-center">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-bold text-gray-900">確認刪除使用者</h3>
                                <div className="mt-2"><p className="text-sm text-gray-600">您確定要刪除使用者「{userToDelete.name}」嗎？此操作無法復原。</p></div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button type="button" onClick={handleDeleteUser} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">確認刪除</button>
                            <button type="button" onClick={() => setUserToDelete(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">取消</button>
                        </div>
                    </div>
                </div>
            )}

            {message.show && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-[100] ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};
