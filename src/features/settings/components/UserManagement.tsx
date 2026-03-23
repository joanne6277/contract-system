import React, { useState, useMemo } from 'react';
import { Plus, ChevronDown, ChevronUp, ArrowUpDown, Trash2, Settings, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { User, Department, NotificationSettings } from '@/features/auth/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

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
                <Button onClick={() => handleOpenUserModal(null)}><Plus className="w-4 h-4 mr-2" />建立新使用者</Button>
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
            <Modal
                isOpen={isUserModalOpen && !!editingUser}
                onClose={() => setIsUserModalOpen(false)}
                title={editingUser?.id ? '編輯使用者權限' : '建立新使用者'}
                size="xl"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsUserModalOpen(false)}>取消</Button>
                        <Button variant="primary" onClick={handleSaveUser}>儲存設定</Button>
                    </>
                }
            >
                {editingUser && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">姓名</label><input type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">員工編號 (登入帳號)</label><input type="text" value={editingUser.employeeId} onChange={e => setEditingUser({ ...editingUser, employeeId: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-1">所屬部門</label><select value={editingUser.department} onChange={e => setEditingUser({ ...editingUser, department: e.target.value as Department })} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="學術發展部">學術發展部</option><option value="圖書服務部">圖書服務部</option><option value="所有部門">所有部門 (主管)</option></select></div>
                        </div>
                        <div className="border-t border-gray-200 pt-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">系統權限設定</h4>
                            <div className="space-y-3">
                                {[
                                    { key: 'searchExport' as const, label: '搜尋合約/匯出資料', desc: '允許搜尋合約資料及匯出報表' },
                                    { key: 'createMaintain' as const, label: '建立/維護合約', desc: '允許建立新合約及編輯既有合約' },
                                    { key: 'downloadTemplate' as const, label: '下載合約範本', desc: '允許下載合約範本文件' },
                                    { key: 'maintainTemplate' as const, label: '維護合約範本', desc: '允許上傳、編輯及刪除合約範本' },
                                    { key: 'adminOnly' as const, label: '使用者權限設定 (Admin)', desc: '允許管理系統使用者及其權限' },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200 cursor-pointer" onClick={() => setEditingUser({ ...editingUser, permissions: { ...editingUser.permissions, [item.key]: !editingUser.permissions[item.key] } })}>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{item.label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                        </div>
                                        <button
                                            type="button"
                                            className={`${editingUser.permissions[item.key] ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors flex-shrink-0`}
                                            onClick={e => { e.stopPropagation(); setEditingUser({ ...editingUser, permissions: { ...editingUser.permissions, [item.key]: !editingUser.permissions[item.key] } }); }}
                                        >
                                            <span className={`${editingUser.permissions[item.key] ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform shadow-sm`} />
                                        </button>
                                    </div>
                                ))}
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
                )}
            </Modal>

            <Modal
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                title="確認刪除使用者"
                size="sm"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setUserToDelete(null)}>取消</Button>
                        <Button variant="danger" onClick={handleDeleteUser}>確認刪除</Button>
                    </>
                }
            >
                {userToDelete && (
                    <div className="flex items-start">
                        <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mr-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <p className="text-sm text-gray-600 pt-2">您確定要刪除使用者「{userToDelete.name}」嗎？此操作無法復原。</p>
                    </div>
                )}
            </Modal>

            {message.show && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-[100] ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};
