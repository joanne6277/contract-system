export const columnConfig = {
    defaultVisible: [
        'basicInfo.contractNo',
        'basicInfo.clientName',
        'purchaseContent.mode',
        'purchaseContent.contractPeriod', // 履約期間 (custom field derived from startDate and endDate)
        'purchaseContent.productName',
        'purchaseContent.amount',
    ],
    selectable: [
        {
            group: '基本資料',
            columns: [
                { id: 'basicInfo.contractNo', label: '合約編號' },
                { id: 'basicInfo.managementNo', label: '管理部編號' },
                { id: 'basicInfo.clientName', label: '採購單位' },
                { id: 'basicInfo.salesperson', label: '業務' },
                { id: 'basicInfo.purchasingYear', label: '採購年份' },
            ]
        },
        {
            group: '採購內容',
            columns: [
                { id: 'purchaseContent.mode', label: '採購模式' },
                { id: 'purchaseContent.contractPeriod', label: '履約期間' },
                { id: 'purchaseContent.contractStartDate', label: '履約起始日' },
                { id: 'purchaseContent.contractEndDate', label: '履約結束日' },
                { id: 'purchaseContent.attribute', label: '屬性' },
                { id: 'purchaseContent.productName', label: '採購產品項目' },
                { id: 'purchaseContent.amount', label: '採購金額' },
                { id: 'purchaseContent.remarks', label: '備註' },
            ]
        }
    ]
};
