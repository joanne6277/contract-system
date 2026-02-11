import ExcelJS from 'exceljs';

interface MaintenanceHistoryItem {
    timestamp: string;
    userId: string;
    userName: string;
    changes: {
        field: string;
        oldValue: string;
        newValue: string;
    }[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exportMaintenanceHistory = async (history: MaintenanceHistoryItem[], contractTitle: string, currentContractData: any, fieldNameToKeyMap: { [name: string]: string }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('維護歷程');

    // 1. Sort history by timestamp descending (Newest first)
    // The history from mock data might not be sorted, so we sort it to be safe.
    // However, usually logs are appended. If we want to go back in time, we start from current.
    // Let's assume history[0] is the oldest...? No, typically log is append, so last is newest.
    // But UI usually shows newest on top.
    // Let's sort by date descending to be sure.
    const sortedHistory = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 2. Reconstruct states
    // We start with current data and revert changes to get previous states.
    // currentState (initially currentContractData) represents the state AFTER the change at index i.
    // We apply "revert" (set field to oldValue) to get the state BEFORE the change at index i.
    // This state BEFORE index i becomes the "After" state for index i+1 (if proceeding chronologically backwards).

    // Deep clone helper
    const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

    // Helper to set nested value by path
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setValueByPath = (obj: any, path: string, value: any) => {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
    };

    let currentState = deepClone(currentContractData);

    const reconstructedHistory = sortedHistory.map(item => {
        const afterState = deepClone(currentState);

        // Revert changes to get beforeState
        if (item.changes) {
            item.changes.forEach(change => {
                const fieldKey = fieldNameToKeyMap[change.field];
                if (fieldKey) {
                    setValueByPath(currentState, fieldKey, change.oldValue);
                }
            });
        }

        const beforeState = deepClone(currentState);

        return {
            ...item,
            beforeState,
            afterState
        };
    });

    // 3. Generate Excel
    // Define columns
    worksheet.columns = [
        { header: '時間戳記', key: 'timestamp', width: 20 },
        { header: '維護人員', key: 'userName', width: 15 },
        { header: '欄位名稱', key: 'field', width: 25 },
        { header: '修改前內容', key: 'oldValue', width: 30 },
        { header: '修改後內容', key: 'newValue', width: 30 },
        { header: '完整合約內容(修改前)', key: 'fullBefore', width: 50 },
        { header: '完整合約內容(修改後)', key: 'fullAfter', width: 50 },
    ];

    // Style the header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Add rows
    reconstructedHistory.forEach(item => {
        if (item.changes && item.changes.length > 0) {
            item.changes.forEach(change => {
                const row = worksheet.addRow({
                    timestamp: item.timestamp,
                    userName: item.userName,
                    field: change.field,
                    oldValue: change.oldValue,
                    newValue: change.newValue,
                    fullBefore: JSON.stringify(item.beforeState, null, 2),
                    fullAfter: JSON.stringify(item.afterState, null, 2)
                });

                // Enable text wrap
                row.getCell('oldValue').alignment = { wrapText: true, vertical: 'top' };
                row.getCell('newValue').alignment = { wrapText: true, vertical: 'top' };
                row.getCell('fullBefore').alignment = { wrapText: true, vertical: 'top' };
                row.getCell('fullAfter').alignment = { wrapText: true, vertical: 'top' };
            });
        }
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create download link
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${contractTitle}_維護歷程_完整版.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
};
