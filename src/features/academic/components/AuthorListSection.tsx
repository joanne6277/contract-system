import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, User, Users, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { AuthorInfo } from '../types';

interface AuthorListSectionProps {
    authors: AuthorInfo[];
    beneficiaries?: string[]; // 新增建議選項清單
    onAdd: () => void;
    onRemove: (id: string) => void;
    onFieldChange: (id: string, field: keyof AuthorInfo, value: string) => void;
}

const AuthorListSection: React.FC<AuthorListSectionProps> = ({
    authors,
    beneficiaries = [],
    onAdd,
    onRemove,
    onFieldChange,
}) => {
    const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set(authors.length > 0 ? [authors[0].id] : []));

    const toggleCard = (id: string) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const expandAll = () => {
        setExpandedCards(new Set(authors.map(i => i.id)));
    };

    const collapseAll = () => {
        setExpandedCards(new Set());
    };

    const datalistId = "beneficiary-suggestions";

    return (
        <div className="space-y-4">
            {/* Suggestions DataList */}
            <datalist id={datalistId}>
                {beneficiaries.map((name, i) => (
                    <option key={`${name}-${i}`} value={name} />
                ))}
            </datalist>

            {/* Header with add button */}
            <div className="flex flex-wrap items-center gap-3 mb-2">
                <Button onClick={onAdd} variant="primary" size="sm" type="button">
                    <Plus size={16} className="mr-2" /> 新增作者
                </Button>
                {authors.length > 0 && (
                    <div className="flex gap-2 ml-auto">
                        <button type="button" onClick={expandAll} className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
                            全部展開
                        </button>
                        <span className="text-gray-300">|</span>
                        <button type="button" onClick={collapseAll} className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
                            全部摺疊
                        </button>
                    </div>
                )}
            </div>

            {/* Empty state */}
            {authors.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <Users size={48} className="text-gray-300 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-500 mb-2">尚無作者資料</h4>
                    <p className="text-sm text-gray-400 max-w-md leading-relaxed">
                        點擊上方「新增作者」按鈕來新增作者資訊。
                    </p>
                </div>
            )}

            {/* Author Cards */}
            <div className="space-y-3">
                {authors.map((author, index) => {
                    const isExpanded = expandedCards.has(author.id);

                    return (
                        <div key={author.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                            {/* Card Header (always visible) */}
                            <div
                                className="flex items-center justify-between px-5 py-3 cursor-pointer select-none hover:bg-gray-50 transition-colors"
                                onClick={() => toggleCard(author.id)}
                            >
                                <div className="flex items-center gap-3">
                                    {isExpanded
                                        ? <ChevronUp size={18} className="text-gray-400" />
                                        : <ChevronDown size={18} className="text-gray-400" />
                                    }
                                    <span className="font-bold text-indigo-700 text-base">
                                        {author.name || `作者 ${index + 1}`}
                                    </span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); onRemove(author.id); }}
                                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>

                            {/* Card Body (collapsible) */}
                            {isExpanded && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-100 bg-gray-50/30">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                                <User size={12} /> 作者姓名 <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                list={datalistId}
                                                value={author.name}
                                                onChange={(e) => onFieldChange(author.id, 'name', e.target.value)}
                                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                                placeholder="請輸入姓名或從建議選擇"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                                <Mail size={12} /> Email
                                            </label>
                                            <input
                                                type="email"
                                                value={author.email}
                                                onChange={(e) => onFieldChange(author.id, 'email', e.target.value)}
                                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                                placeholder="example@mail.com"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                                <Phone size={12} /> 電話
                                            </label>
                                            <input
                                                type="text"
                                                value={author.phone}
                                                onChange={(e) => onFieldChange(author.id, 'phone', e.target.value)}
                                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                                placeholder="0912-345-678"
                                            />
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                                <MapPin size={12} /> 地址
                                            </label>
                                            <input
                                                type="text"
                                                value={author.address}
                                                onChange={(e) => onFieldChange(author.id, 'address', e.target.value)}
                                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                                placeholder="請輸入通訊地址"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AuthorListSection;
