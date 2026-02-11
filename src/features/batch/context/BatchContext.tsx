import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface BatchItem {
    id: string;
    label: string;
    type?: 'academic' | 'ddd';
    data?: any;
}

interface BatchContextType {
    selectedItems: Map<string, BatchItem>; // Store Map<ID, Item>
    selectedIds: Set<string>; // Helper for quick lookup
    toggleItem: (id: string, label?: string, data?: any, type?: 'academic' | 'ddd') => void;
    selectMultiple: (items: BatchItem[]) => void;
    deselectMultiple: (ids: string[]) => void;
    clearSelection: () => void;
    selectionCount: number;
    isSelected: (id: string) => boolean;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

export const BatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Store as a Map to keep metadata (like label/name)
    const [selectedItemsMap, setSelectedItemsMap] = useState<Map<string, BatchItem>>(new Map());

    const toggleItem = useCallback((id: string, label: string = id, data?: any, type?: 'academic' | 'ddd') => {
        setSelectedItemsMap(prev => {
            const newMap = new Map(prev);
            if (newMap.has(id)) {
                newMap.delete(id);
            } else {
                newMap.set(id, { id, label, data, type });
            }
            return newMap;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedItemsMap(new Map());
    }, []);

    const isSelected = useCallback((id: string) => selectedItemsMap.has(id), [selectedItemsMap]);

    const selectMultiple = useCallback((items: BatchItem[]) => {
        setSelectedItemsMap(prev => {
            const newMap = new Map(prev);
            items.forEach(item => newMap.set(item.id, item));
            return newMap;
        });
    }, []);

    const deselectMultiple = useCallback((ids: string[]) => {
        setSelectedItemsMap(prev => {
            const newMap = new Map(prev);
            ids.forEach(id => newMap.delete(id));
            return newMap;
        });
    }, []);

    // Derived Set for easy consumption by consumers who only care about IDs/State
    const selectedIds = new Set(selectedItemsMap.keys());

    const value = {
        selectedItems: selectedItemsMap,
        selectedIds,
        toggleItem,
        selectMultiple,
        deselectMultiple,
        clearSelection,
        selectionCount: selectedItemsMap.size,
        isSelected
    };

    return (
        <BatchContext.Provider value={value}>
            {children}
        </BatchContext.Provider>
    );
};

export const useBatch = () => {
    const context = useContext(BatchContext);
    if (!context) {
        throw new Error('useBatch must be used within a BatchProvider');
    }
    return context;
};
