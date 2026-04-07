import React, { useState } from 'react';
import { ParameterListManager } from '@/components/common';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const BusinessParameterSettings: React.FC = () => {
    const { currentUser } = useAuth();

    // 業務部參數 - 預設採購產品項目
    const [productNames, setProductNames] = useState<string[]>([
        'CEPS', 'CETD', 'SYMSKAN', 'ABC', 'PRO', 'AL', 'AE', 'CEPS生醫'
    ]);

    // 輸入狀態
    const [newProductName, setNewProductName] = useState('');

    // 權限檢查
    const canMaintainParams = currentUser?.permissions.maintainParams;
    const isAdmin = currentUser?.permissions.adminOnly;
    const isBusinessAdmin = canMaintainParams === '業務部' || isAdmin;

    if (!canMaintainParams || (canMaintainParams === '不開放' && !isAdmin)) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">
                您沒有權限存取此頁面。
            </div>
        );
    }

    if (!isBusinessAdmin) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">
                您沒有權限存取業務部參數設定頁面。
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-orange-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">參數設定 (業務部)</h2>
                <p className="text-gray-500 text-sm">管理業務部系統各項下拉選單與選項參數</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ParameterListManager
                    title="採購產品項目 (業務部)"
                    items={productNames}
                    newItem={newProductName}
                    setNewItem={setNewProductName}
                    onAdd={() => {
                        if (newProductName && !productNames.includes(newProductName)) {
                            setProductNames([...productNames, newProductName]);
                            setNewProductName('');
                        }
                    }}
                    onRemove={(item) => setProductNames(prev => prev.filter(i => i !== item))}
                />
            </div>
        </div>
    );
};

export default BusinessParameterSettings;
