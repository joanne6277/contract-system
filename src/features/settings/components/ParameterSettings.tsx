import React, { useState } from 'react';
import { ParameterListManager } from '@/components/common';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const ParameterSettings: React.FC = () => {
    const { currentUser } = useAuth();

    // 學發部參數
    const [xuefaContractVersions, setXuefaContractVersions] = useState<string[]>(['20220101', '20250401']);
    const [discoveryPlatforms, setDiscoveryPlatforms] = useState<string[]>(['Google Scholar', 'NAVER Academic', 'Primo', 'EBSCO EDS', 'OCLC Discovery']);

    // 輸入狀態
    const [newXuefaVersion, setNewXuefaVersion] = useState('');
    const [newDiscoveryPlatform, setNewDiscoveryPlatform] = useState('');

    // 權限檢查
    const canMaintainParams = currentUser?.permissions.maintainParams;
    // const isTufuAdmin = canMaintainParams === '圖書服務部'; // Removed
    const isXuefaAdmin = canMaintainParams === '學術發展部';

    if (!canMaintainParams || canMaintainParams === '不開放') {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">
                您沒有權限存取此頁面。
            </div>
        );
    }

    if (!isXuefaAdmin) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">
                您沒有權限存取學術發展部參數設定頁面。
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">參數設定 (學術發展部)</h2>
                <p className="text-gray-500 text-sm">管理學術發展部系統各項下拉選單與選項參數</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ParameterListManager
                    title="合約版本號 (學術發展部)"
                    items={xuefaContractVersions}
                    newItem={newXuefaVersion}
                    setNewItem={setNewXuefaVersion}
                    onAdd={() => {
                        if (newXuefaVersion && !xuefaContractVersions.includes(newXuefaVersion)) {
                            setXuefaContractVersions([...xuefaContractVersions, newXuefaVersion]);
                            setNewXuefaVersion('');
                        }
                    }}
                    onRemove={(item) => setXuefaContractVersions(prev => prev.filter(i => i !== item))}
                />
                <ParameterListManager
                    title="發現平台 (學術發展部)"
                    items={discoveryPlatforms}
                    newItem={newDiscoveryPlatform}
                    setNewItem={setNewDiscoveryPlatform}
                    onAdd={() => {
                        if (newDiscoveryPlatform && !discoveryPlatforms.includes(newDiscoveryPlatform)) {
                            setDiscoveryPlatforms([...discoveryPlatforms, newDiscoveryPlatform]);
                            setNewDiscoveryPlatform('');
                        }
                    }}
                    onRemove={(item) => setDiscoveryPlatforms(prev => prev.filter(i => i !== item))}
                />
            </div>
        </div>
    );
};
