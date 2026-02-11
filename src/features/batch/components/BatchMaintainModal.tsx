import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useBatch } from '../context/BatchContext';

interface BatchMaintainModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BatchMaintainModal: React.FC<BatchMaintainModalProps> = ({ isOpen, onClose }) => {
    const { selectionCount, clearSelection } = useBatch();
    const [asResponsible, setAsResponsible] = useState('');
    const [collector, setCollector] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = () => {
        // Mock API call
        console.log('Batch maintaining items:', { asResponsible, collector });

        // Show success message
        setMessage({ type: 'success', text: `已成功更新 ${selectionCount} 筆合約的維護資訊` });

        // Reset form and close after delay
        setTimeout(() => {
            setMessage(null);
            setAsResponsible('');
            setCollector('');
            clearSelection();
            onClose();
        }, 1500);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`批次維護 (${selectionCount} 筆)`}
            size="md"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>取消</Button>
                    <Button onClick={handleSubmit} disabled={!asResponsible && !collector}>
                        確認更新
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {message && (
                    <div className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                {!message && (
                    <>
                        <p className="text-gray-500 text-sm">
                            請輸入欲批次更新的欄位內容。若欄位留空則不會變更該欄位。
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    負責AS
                                </label>
                                <input
                                    type="text"
                                    value={asResponsible}
                                    onChange={(e) => setAsResponsible(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                                    placeholder="輸入負責AS人員..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    負責徵集
                                </label>
                                <input
                                    type="text"
                                    value={collector}
                                    onChange={(e) => setCollector(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                                    placeholder="輸入負責徵集人員..."
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};
