/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Edit } from 'lucide-react';
import { mockBusinessContracts } from '@/data/mockBusinessContracts';
import { Button } from '@/components/ui/Button';
import { FloatingTOC } from '@/components/common';
import { tocSections } from '../constants/tocSections';
import { fieldKeyToNameMap } from '../constants/contractFields';
import type { BusinessContract } from '../types';

const BusinessContractDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const mainContentRef = useRef<HTMLDivElement>(null);

    const contract = useMemo(() => {
        return mockBusinessContracts.find(c => c.id === id);
    }, [id]);

    if (!contract) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-gray-500 text-lg">找不到該筆合約資料</p>
                <Button onClick={() => navigate('/business/search/results')} className="mt-4">返回列表</Button>
            </div>
        );
    }

    const handleTocJump = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = window.pageYOffset + elementPosition - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    const renderFieldValue = (sectionId: string, fieldId: string) => {
        const dataKey = (sectionId === 'basic-info' ? 'basicInfo' : 'purchaseContent') as keyof BusinessContract;
        const data = contract[dataKey as 'basicInfo' | 'purchaseContent'];
        const value = (data as any)[fieldId];

        if (Array.isArray(value)) return value.join(', ');
        return value || '-';
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <FloatingTOC onJump={handleTocJump} sections={tocSections} />
            
            <div className="container mx-auto p-8 max-w-5xl" ref={mainContentRef}>
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">
                            合約詳目: {contract.basicInfo.clientName}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <Button 
                            variant="secondary" 
                            onClick={() => navigate(`/business/maintain/${id}`)}
                            className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200"
                        >
                            <Edit size={16} className="mr-2" />
                            維護合約
                        </Button>
                        <Button variant="ghost" onClick={() => navigate(-1)} className="border border-gray-300">
                            返回列表
                        </Button>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {tocSections.map(section => (
                        <div 
                            key={section.id} 
                            id={section.id} 
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
                            </div>
                            <div className="p-6">
                                {section.id === 'scan-file' ? (
                                    <div className="flex items-center gap-3 text-blue-600">
                                        <FileText size={20} />
                                        <span className="font-medium">尚未上傳掃描檔</span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                        {/* 這裡簡單對應欄位，實際應根據 fieldConfig 渲染 */}
                                        {section.id === 'basic-info' && (
                                            <>
                                                <DetailItem label="管理部編號" value={contract.basicInfo.managementNo} />
                                                <DetailItem label="合約編號" value={contract.basicInfo.contractNo} />
                                                <DetailItem label="業務" value={contract.basicInfo.salesperson} />
                                                <DetailItem label="採購單位" value={contract.basicInfo.clientName} />
                                                <DetailItem label="採購年份" value={contract.basicInfo.purchasingYear} />
                                            </>
                                        )}
                                        {section.id === 'purchase-content' && (
                                            <>
                                                <DetailItem label="採購模式" value={contract.purchaseContent.mode} />
                                                <DetailItem label="履約期間" value={`${contract.purchaseContent.contractStartDate} ~ ${contract.purchaseContent.contractEndDate}`} />
                                                <DetailItem label="屬性" value={contract.purchaseContent.attribute} />
                                                <DetailItem label="採購產品項目" value={contract.purchaseContent.productName.join(', ')} />
                                                <DetailItem label="採購金額" value={contract.purchaseContent.amount} />
                                            </>
                                        )}
                                        {section.id === 'remarks' && (
                                            <div className="col-span-2">
                                                <p className="text-gray-800 whitespace-pre-wrap">{contract.purchaseContent.remarks || '無備註'}</p>
                                            </div>
                                        )}
                                        {/* 其他章節暫顯示 N/A 或依此類推 */}
                                        {!['basic-info', 'purchase-content', 'remarks', 'scan-file'].includes(section.id) && (
                                            <p className="text-gray-400 italic">尚無資料</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base text-gray-800 font-medium">{value || '-'}</p>
    </div>
);

export default BusinessContractDetail;
