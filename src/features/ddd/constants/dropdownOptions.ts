// 圖書服務部 (DDD) - 下拉選單選項
export const dropdownOptions: { [key: string]: { value: string; label: string }[] } = {
    'basicInfo.contractTargetType': [
        { value: 'ebook', label: '電子書' },
        { value: 'ejournal', label: '電子雜誌' },
        { value: 'taiwaneseBook', label: '台版書' }
    ],
    'accountingInfo.entityType': [
        { value: 'public', label: '公部門' },
        { value: 'private', label: '私部門' },
        { value: 'individual', label: '個人' }
    ],
    'twBookAccounting.twBookBillingCycle': [
        { value: 'cash', label: '付現' },
        { value: 'monthly', label: '月結' },
        { value: 'quarterly', label: '季結' },
        { value: 'semi_annually', label: '半年結' },
        { value: 'annually', label: '年結' }
    ],
    'twBookLogistics.returnCycle': [
        { value: 'semi_annually', label: '每半年退貨一次' },
        { value: 'non_returnable', label: '不可退貨' }
    ],
    'twBookLogistics.nonDefectiveReturnShippingFee': [
        { value: 'airiti', label: '華藝支付' },
        { value: 'publisher', label: '出版社支付' },
        { value: 'non_returnable', label: '不可退貨' }
    ],
    'twBookLogistics.domesticReturnShippingFee': [
        { value: 'airiti', label: '華藝支付' },
        { value: 'publisher', label: '出版社支付' },
        { value: 'non_returnable', label: '不可退貨' }
    ],
};
