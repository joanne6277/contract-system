/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const BusinessSearchContract: React.FC = () => {
    const navigate = useNavigate();
    
    const [criteria, setCriteria] = useState({
        keyword: '',
        isBuyout: '',
        dateMode: 'effective',
        startDate: '',
        endDate: '',
        rollbackDate: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setCriteria(prev => ({ ...prev, [field]: value }));
    };

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const params = new URLSearchParams();
        if (criteria.keyword) params.append('keyword', criteria.keyword);
        if (criteria.isBuyout) params.append('isBuyout', criteria.isBuyout);
        if (criteria.dateMode) params.append('dateMode', criteria.dateMode);
        if (criteria.startDate) params.append('startDate', criteria.startDate);
        if (criteria.endDate && criteria.isBuyout !== '是') params.append('endDate', criteria.endDate);
        if (criteria.rollbackDate) params.append('rollbackDate', criteria.rollbackDate);
        
        navigate(`/business/search/results?${params.toString()}`);
    };

    return (
        <div className="container mx-auto p-8">
            <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">搜尋合約</h2>
                </div>

                {/* Keyword Search */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">關鍵字</label>
                        <input
                            type="text"
                            placeholder="搜尋 採購單位名稱, 合約編號, 業務..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={criteria.keyword}
                            onChange={(e) => handleInputChange('keyword', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">買斷</label>
                        <select
                            value={criteria.isBuyout}
                            onChange={(e) => handleInputChange('isBuyout', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="">全部</option>
                            <option value="是">是</option>
                            <option value="否">否</option>
                        </select>
                    </div>
                </div>

                {/* Date Range Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">合約期間</label>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select 
                            value={criteria.dateMode} 
                            onChange={e => handleInputChange('dateMode', e.target.value)} 
                            className="md:col-span-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="effective">在此期間內有效</option>
                            <option value="starts">在此期間內開始</option>
                            {criteria.isBuyout !== '是' && <option value="ends">在此期間內到期</option>}
                            {criteria.isBuyout !== '是' && <option value="within">起訖日皆在此期間內</option>}
                        </select>
                        <div className="md:col-span-3 flex items-center gap-4">
                            <input 
                                type="date" 
                                value={criteria.startDate} 
                                onChange={e => handleInputChange('startDate', e.target.value)} 
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                            {criteria.isBuyout !== '是' && (
                                <>
                                    <span className="text-gray-500">至</span>
                                    <input 
                                        type="date" 
                                        value={criteria.endDate} 
                                        onChange={e => handleInputChange('endDate', e.target.value)} 
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rollback Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">回溯至 (選填)</label>
                    <input
                        type="date"
                        value={criteria.rollbackDate}
                        onChange={(e) => handleInputChange('rollbackDate', e.target.value)}
                        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-1">選擇一個過去的日期，以檢視當天所有合約的歷史狀態。</p>
                </div>

                {/* Search Button */}
                <div className="flex justify-end">
                    <Button type="submit">
                        <Search size={18} className="mr-2" />
                        執行搜尋
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BusinessSearchContract;
