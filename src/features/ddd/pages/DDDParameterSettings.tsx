import React, { useState } from 'react';
import { ParameterListManager } from '@/components/common';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const DDDParameterSettings: React.FC = () => {
    const { currentUser } = useAuth();
    const canMaintainParams = currentUser?.permissions.maintainParams;
    const isTufuAdmin = canMaintainParams === '圖書服務部' || currentUser?.permissions.adminOnly;

    // 圖書服務部 (DDD) 參數
    const [bookUnionPartners, setBookUnionPartners] = useState<string[]>(['灰熊', '金石堂', '讀冊', '三民', '博客來(專案)']);
    const [distributionPlatforms, setDistributionPlatforms] = useState<string[]>([
        'Amazon', 'Google', 'Kobo', 'Pubu', '誠品(Pubu串接)', 'PCHOME(Pubu串接)',
        'Readmoo', 'UDN', '台灣漫讀BOOKWALKER', '凌網', '博客來', 'Apple',
        'Mybook', 'MOMO', 'TWB', '香港聯合電子', 'Ingram', 'Overdrive',
        'Hami', '恩道', '微信'
    ]);
    const [contractVersions, setContractVersions] = useState<string[]>(['v1.0 (舊)', 'v2.0 (標準)', 'v2.1 (A 補充)', 'v3.0 (2025新版)']);
    const [contractNames, setContractNames] = useState<string[]>(['標準授權合約', '獨家代理合約', '保密協議(NDA)', '有聲書授權合約']);

    // 輸入狀態
    const [newUnionPartner, setNewUnionPartner] = useState('');
    const [newPlatformPartner, setNewPlatformPartner] = useState('');
    const [newContractVersion, setNewContractVersion] = useState('');
    const [newContractName, setNewContractName] = useState('');

    if (!isTufuAdmin) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-xl shadow-sm">
                您沒有權限存取圖書服務部參數設定頁面。
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">參數設定 (圖書服務部)</h2>
                <p className="text-gray-500 text-sm">管理圖書服務部系統各項下拉選單與選項參數</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ParameterListManager
                    title="圖書聯堡廠商"
                    items={bookUnionPartners}
                    newItem={newUnionPartner}
                    setNewItem={setNewUnionPartner}
                    onAdd={() => {
                        if (newUnionPartner && !bookUnionPartners.includes(newUnionPartner)) {
                            setBookUnionPartners([...bookUnionPartners, newUnionPartner]);
                            setNewUnionPartner('');
                        }
                    }}
                    onRemove={(item) => setBookUnionPartners(prev => prev.filter(i => i !== item))}
                />
                <ParameterListManager
                    title="經銷平台"
                    items={distributionPlatforms}
                    newItem={newPlatformPartner}
                    setNewItem={setNewPlatformPartner}
                    onAdd={() => {
                        if (newPlatformPartner && !distributionPlatforms.includes(newPlatformPartner)) {
                            setDistributionPlatforms([...distributionPlatforms, newPlatformPartner]);
                            setNewPlatformPartner('');
                        }
                    }}
                    onRemove={(item) => setDistributionPlatforms(prev => prev.filter(i => i !== item))}
                />
                <ParameterListManager
                    title="合約版本"
                    items={contractVersions}
                    newItem={newContractVersion}
                    setNewItem={setNewContractVersion}
                    onAdd={() => {
                        if (newContractVersion && !contractVersions.includes(newContractVersion)) {
                            setContractVersions([...contractVersions, newContractVersion]);
                            setNewContractVersion('');
                        }
                    }}
                    onRemove={(item) => setContractVersions(prev => prev.filter(i => i !== item))}
                />
                <ParameterListManager
                    title="合約名稱"
                    items={contractNames}
                    newItem={newContractName}
                    setNewItem={setNewContractName}
                    onAdd={() => {
                        if (newContractName && !contractNames.includes(newContractName)) {
                            setContractNames([...contractNames, newContractName]);
                            setNewContractName('');
                        }
                    }}
                    onRemove={(item) => setContractNames(prev => prev.filter(i => i !== item))}
                />
            </div>
        </div>
    );
};
