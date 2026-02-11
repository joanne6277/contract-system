import { useState, useCallback } from 'react';

// 定義通用的 Message 狀態介面
export interface MessageState {
  show: boolean;
  text: string;
  type: 'success' | 'error';
}

// 定義通用的 Hook 回傳介面
interface UseContractFormReturn<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  message: MessageState;
  showMessage: (text: string, type?: 'success' | 'error') => void;
  handleDynamicFormChange: (path: string, value: unknown) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFieldValue: (obj: any, path: string) => any;
  getFileName: (file: File | string | null | undefined) => string;
}

export const useContractForm = <T>(initialState: T): UseContractFormReturn<T> => {
  const [formData, setFormData] = useState<T>(initialState);
  const [message, setMessage] = useState<MessageState>({ show: false, text: '', type: 'success' });

  // 顯示訊息
  const showMessage = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ show: true, text, type });
    setTimeout(() => setMessage({ show: false, text: '', type: 'success' }), 5000);
  }, []);

  // 動態更新表單欄位 (支援巢狀路徑，如 "basicInfo.partyARep")
  const handleDynamicFormChange = useCallback((path: string, value: unknown) => {
    setFormData(prev => {
      // 深拷貝，避免直接修改 state
      const newFormData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      // 遍歷路徑直到最後一層
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = newFormData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // 設定值
      current[keys[keys.length - 1]] = value;
      return newFormData;
    });
  }, []);

  // 取得欄位值 (支援巢狀路徑)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getFieldValue = useCallback((obj: any, path: string) => {
    if (!obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }, []);

  // 取得檔案名稱顯示字串
  const getFileName = useCallback((file: File | string | null | undefined): string => {
    if (!file) return '尚未上傳檔案';
    if (typeof file === 'string') return file;
    return file.name;
  }, []);

  return {
    formData,
    setFormData,
    message,
    showMessage,
    handleDynamicFormChange,
    getFieldValue,
    getFileName,
  };
};