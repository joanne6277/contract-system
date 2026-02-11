// 圖書服務部 (DDD) - 驗證規則
export const checkboxOptions: { [key: string]: { key: string; label: string }[] } = {};

export const validationRules = {
    hard: [
        'registrationInfo.airitiContractNo',
        'registrationInfo.ebookContractNo',
        'registrationInfo.acquisitionMaintainer',
        'basicInfo.earlyTermination',
        'basicInfo.publisherName',
        'basicInfo.contractStartDate',
        'basicInfo.contractEndDate',
        'basicInfo.thereafter',
        'basicInfo.contractVersionNo',
        'basicInfo.contractName',
    ],
};
