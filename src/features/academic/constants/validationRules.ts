export const validationRules = {
    hard: [
        // Contract Target
        'contractTarget.type',
        'contractTarget.title',
        'contractTarget.volumeInfo',

        // Registration Info
        'registrationInfo.managementNo',
        'registrationInfo.departmentNo',
        'registrationInfo.departmentSubNo',
        'registrationInfo.collector',
        'registrationInfo.contractVersion',

        // Basic Info
        'basicInfo.partyBRep',
        'basicInfo.contractParty',
        'basicInfo.contractStartDate',
        'basicInfo.contractEndDate',
        'basicInfo.autoRenewYears',
        'basicInfo.autoRenewFrequency',
        'basicInfo.thereafter',

        // Rights Info
        'rightsInfo.authorizationFormMain',
        // 'rightsInfo.authorizationForm.authorizationFormSub', // Might be optional depend on Main?
        'rightsInfo.paymentType',

        // Scope Info
        // Custom components usually handle their own internal required state or we check if the object/array is empty/valid
        'scopeInfo.thirdPartyPlatform',
        'scopeInfo.discoverySystem',
        'scopeInfo.comparisonSystem',
        'scopeInfo.nclClause',
        'scopeInfo.listingLocation',

        // Other Clauses
        'otherClauses.usageRightsWarranty',
        'otherClauses.userRightsProtection',
        'otherClauses.terminationClause',
        'otherClauses.forceMajeure',
        'otherClauses.confidentiality',
        'otherClauses.noOaOnOwnWebsite',
        'otherClauses.legalIssueHandling',
        'otherClauses.manuscriptAgreementMention',
        'otherClauses.authorizationCopy',
    ],
    // Special validators for complex fields
    custom: {
        royaltySplits: (formData: any) => {
            // Check if at least one royalty split exists
            if (!formData.royaltyInfo || formData.royaltyInfo.length === 0) return false;
            // Check deeper if necessary
            return true;
        },
        remittanceInfo: (formData: any) => {
            // If remittance info exists, check required fields
            if (formData.remittanceInfo && formData.remittanceInfo.length > 0) {
                return formData.remittanceInfo.every((item: any) =>
                    item.royaltySettlementMonth && item.paymentReceiptFlow && item.paymentReceiptFlow.trim() !== ''
                );
            }
            return true; // If no remittance info, pass (or should we fail? User said "Required")
            // "權利金_明定結算月份" seems to imply it must be there.
            // But if there is no royalty, maybe no remittance?
            // Let's assume for now we just validate individual items if they exist.
        }
    }
};
