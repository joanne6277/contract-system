import React, { useState } from 'react';
import { Upload, Archive, RefreshCcw, Trash2, ChevronDown } from 'lucide-react';
import type { Template } from '@/features/settings/types'; // Reuse types for now
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export const DDDTemplateManagement: React.FC = () => {
    const { currentUser } = useAuth();
    // TuFu specific initial data (mock)
    const [templates, setTemplates] = useState<Template[]>([
        { id: 'tf-1', name: '圖書採購合約範本', version: '1.0', lastModified: '2024-09-01', file: '圖書採購合約範本_v1.0.docx', status: 'current' },
        { id: 'tf-2', name: '電子書授權合約', version: '2.0', lastModified: '2024-08-15', file: '電子書授權合約_v2.0.pdf', status: 'current' },
    ]);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState<{ name: string, version: string, file: File | null, status: 'current' | 'past' }>({ name: '', version: '', file: null, status: 'current' });
    const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null);
    const [templateToToggle, setTemplateToToggle] = useState<Template | null>(null);
    const [isPastTemplatesExpanded, setIsPastTemplatesExpanded] = useState(false);
    const [message, setMessage] = useState<{ show: boolean; text: string; type: 'success' | 'error' }>({ show: false, text: '', type: 'success' });

    const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
        setMessage({ show: true, text, type });
        setTimeout(() => setMessage({ show: false, text: '', type: 'success' }), 3000);
    };

    const handleOpenTemplateModal = () => {
        setNewTemplate({ name: '', version: '', file: null, status: 'current' });
        setIsTemplateModalOpen(true);
    };

    const handleTemplateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewTemplate(prev => ({ ...prev, file: e.target.files![0] }));
        }
    };

    const handleSaveTemplate = () => {
        if (!newTemplate.name || !newTemplate.version || !newTemplate.file) {
            showMessage('請填寫所有欄位並上傳檔案', 'error');
            return;
        }
        const newEntry: Template = {
            id: `tf-${Date.now()}`,
            name: newTemplate.name,
            version: newTemplate.version,
            file: newTemplate.file,
            lastModified: new Date().toISOString().split('T')[0],
            status: 'current'
        };
        setTemplates(prev => [...prev, newEntry].sort((a, b) => b.lastModified.localeCompare(a.lastModified)));
        showMessage('新範本已成功上傳！');
        setIsTemplateModalOpen(false);
    };

    const handleToggleTemplateStatus = () => {
        if (!templateToToggle) return;
        const newStatus: 'current' | 'past' = templateToToggle.status === 'current' ? 'past' : 'current';
        setTemplates(templates.map(t => t.id === templateToToggle.id ? { ...t, status: newStatus, lastModified: new Date().toISOString().split('T')[0] } : t).sort((a, b) => b.lastModified.localeCompare(a.lastModified)));
        showMessage(`範本已移至${newStatus === 'past' ? '過往' : '現行'}`);
        setTemplateToToggle(null);
    };

    const confirmDeleteTemplate = () => {
        if (!templateToDelete) return;
        setTemplates(templates.filter(t => t.id !== templateToDelete.id));
        showMessage(`已刪除範本：${templateToDelete.name}`);
        setTemplateToDelete(null);
    };

    const getFileName = (file: File | string | null | undefined): string => {
        if (typeof file === 'string') return file;
        if (file instanceof File) return file.name;
        return '';
    };

    const TemplateTable: React.FC<{ templates: Template[]; currentUser: any; onToggleStatus: (template: Template) => void; onDelete: (template: Template) => void; }> = ({ templates, currentUser, onToggleStatus, onDelete }) => {
        if (templates.length === 0) {
            return <p className="text-gray-500 text-center py-4">此區塊無任何範本。</p>;
        }
        return (
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">範本名稱</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">版本號</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最後修改日期</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {templates.map(template => (
                            <tr key={template.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => showMessage(`開始下載 ${getFileName(template.file)}...`)} className="text-indigo-600 hover:text-indigo-900 hover:underline">{template.name}</button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.version}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.lastModified}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {currentUser?.permissions.maintainTemplate && (
                                        <>
                                            {template.status === 'current'
                                                ? <Button variant="ghost" size="sm" onClick={() => onToggleStatus(template)} title="封存"><Archive className="w-4 h-4" /></Button>
                                                : <Button variant="ghost" size="sm" onClick={() => onToggleStatus(template)} title="還原" className="text-green-600 hover:text-green-800"><RefreshCcw className="w-4 h-4" /></Button>
                                            }
                                            <Button variant="ghost" size="sm" onClick={() => onDelete(template)} title="刪除" className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="flex justify-between items-center mb-6">
                <div><h2 className="text-2xl font-bold text-gray-800">範本管理 (圖服部)</h2><p className="text-gray-600 mt-1">集中管理與下載圖服部合約範本。</p></div>
                {currentUser?.permissions.maintainTemplate && (
                    <Button onClick={handleOpenTemplateModal}>
                        <Upload className="w-4 h-4 mr-2" />上傳新範本
                    </Button>
                )}
            </div>
            <div className="space-y-8">
                <div><h3 className="text-xl font-semibold text-gray-800 mb-4">現行範本</h3><TemplateTable templates={templates.filter(t => t.status === 'current')} currentUser={currentUser} onToggleStatus={setTemplateToToggle} onDelete={setTemplateToDelete} /></div>
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">過往範本</h3>
                        <button
                            onClick={() => setIsPastTemplatesExpanded(!isPastTemplatesExpanded)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isPastTemplatesExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                    {isPastTemplatesExpanded && (
                        <TemplateTable templates={templates.filter(t => t.status === 'past')} currentUser={currentUser} onToggleStatus={setTemplateToToggle} onDelete={setTemplateToDelete} />
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            <Modal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                title="上傳新範本"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsTemplateModalOpen(false)}>取消</Button>
                        <Button variant="primary" onClick={handleSaveTemplate}>上傳</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">範本名稱</label><input type="text" value={newTemplate.name} onChange={e => setNewTemplate(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="例如：圖書採購合約" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">版本號</label><input type="text" value={newTemplate.version} onChange={e => setNewTemplate(prev => ({ ...prev, version: e.target.value }))} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="例如：v1.0" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">範本檔案</label><input type="file" onChange={handleTemplateFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" /></div>
                </div>
            </Modal>

            {/* Delete/Toggle Confirmation Modal */}
            <Modal
                isOpen={!!(templateToToggle || templateToDelete)}
                onClose={() => { setTemplateToDelete(null); setTemplateToToggle(null); }}
                title={templateToDelete ? '確認刪除' : '確認狀態變更'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => { setTemplateToDelete(null); setTemplateToToggle(null); }}>取消</Button>
                        <Button
                            variant={templateToDelete ? 'danger' : 'primary'}
                            onClick={templateToDelete ? confirmDeleteTemplate : handleToggleTemplateStatus}
                        >
                            確認
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-gray-600">
                    {templateToDelete ? `確定刪除「${templateToDelete.name}」？此操作無法復原。` : `確定將「${templateToToggle?.name}」移至${templateToToggle?.status === 'current' ? '過往' : '現行'}範本？`}
                </p>
            </Modal>

            {message.show && (
                <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-[100] ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};
