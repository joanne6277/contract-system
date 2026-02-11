// 搜尋模組專用型別定義

export interface ChangeDetail {
    field: string;
    oldValue: unknown;
    newValue: unknown;
}

export interface MaintenanceRecord {
    timestamp: string;
    userId: string;
    userName: string;
    changes: ChangeDetail[];
}

export interface SearchCriteria {
    keyword: string;
    dateMode: string;
    startDate: string;
    endDate: string;
    rollbackDate: string;
}

export interface ActiveFilters {
    [key: string]: unknown;
}

export interface MessageState {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

export interface ColumnGroup {
    group: string;
    columns: { id: string; label: string }[];
}

export interface ColumnConfig {
    defaultVisible: string[];
    selectable: ColumnGroup[];
}

export interface SortConfig {
    key: string | null;
    direction: 'ascending' | 'descending';
}
