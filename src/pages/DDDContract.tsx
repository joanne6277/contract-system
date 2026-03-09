// import { useParams } from 'react-router-dom';
// import { mockTuFuContracts } from '@/data/mockTuFuContracts';
import { Plus, Upload, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FloatingTOC, ValidationWarningPanel } from '@/components/common';
import {
    AddressInput, DDDTagInput, RadioWithOtherInput,
    TextInput, PercentageWithText, RadioOnly
} from '@/features/ddd/components';
import {
    dddTocSections, fieldKeyToNameMap, dropdownOptions, radioOptions,
    checkboxOptions, validationRules
} from '@/features/ddd/constants';
import { useDDDContractForm } from '@/features/ddd/hooks';
import type { OtherClauses, CheckboxWithTextData, EbookMagazineContract, TaiwanBookContract } from '@/features/ddd/types';



const DDDContract: React.FC = () => {
    const {
        formData,
        message,
        importContractNo,
        validationErrors,
        isValidationPanelVisible,
        mainContentRef,
        fileInputRef,
        handleDynamicFormChange,
        handleFormSubmit,
        handleImportData,
        handleFileChange,
        handleContactChange,
        addContact,
        removeContact,
        setImportContractNo,
        setIsValidationPanelVisible,
        showMessage,
        getFieldValue,
        handleRightsBulkSelectClick,
        getInitialFormData,
        rightsBulkSelect,
    } = useDDDContractForm();

    // const { id } = useParams<{ id: string }>();
    const isEditMode = false; // Forced to new mode

    // Load data for Edit Mode - REMOVED
    /*
    useEffect(() => {
        if (isEditMode) {
            // ...
        }
    }, [id, isEditMode, setFormData, showMessage]);
    */




    const getFileName = (file: File | string | null | undefined): string => {
        if (typeof file === 'string') return file;
        if (file instanceof File) return file.name;
        return '';
    };

    const handleTocJump = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const fieldNameToKeyMap = Object.fromEntries(Object.entries(fieldKeyToNameMap).map(([key, name]) => [name, key]));

    const handleJumpToField = (fieldTitle: string) => {
        const fieldKey = fieldNameToKeyMap[fieldTitle];
        if (!fieldKey) return;
        const element = mainContentRef.current?.querySelector(`[data-fieldkey="${fieldKey}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const target = element.querySelector('input, select, textarea, div.border-dashed') || element;
            target.classList.add('ring-2', 'ring-offset-2', 'ring-blue-500', 'transition-shadow', 'duration-300', 'rounded-lg');
            setTimeout(() => { target.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500', 'rounded-lg'); }, 2500);
        }
    };

    const renderField = (key: string) => {
        const isRequired = validationRules.hard.includes(key);
        const fieldName = fieldKeyToNameMap[key];
        const value = getFieldValue(formData, key) || '';
        const inputType = (fieldName.includes('日期') || fieldName.includes('起日') || fieldName.includes('迄日')) ? 'date' : 'text';
        const selectOptions = dropdownOptions[key];
        const radioBtnOptions = radioOptions[key];
        const checkboxGroupOptions = checkboxOptions[key];

        if (selectOptions) { return (<div data-fieldkey={key}><label className="block text-sm font-medium text-gray-700 mb-2">{fieldName}{isRequired && <span className="text-red-500 ml-1">*</span>}</label><select value={value} onChange={(e) => handleDynamicFormChange(key, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="">請選擇</option>{selectOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>); }
        if (radioBtnOptions) { return (<div data-fieldkey={key}><label className="block text-sm font-medium text-gray-700 mb-2">{fieldName}{isRequired && <span className="text-red-500 ml-1">*</span>}</label><div className="flex items-center space-x-4 pt-2">{radioBtnOptions.map(opt => (<label key={opt.value} className="flex items-center"><input type="radio" name={`${key}-${opt.value}`} value={opt.value} checked={value === opt.value} onChange={(e) => handleDynamicFormChange(key, e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" /><span className="ml-2 text-sm text-gray-700">{opt.label}</span></label>))}</div></div>); }
        if (checkboxGroupOptions) {
            return (
                <div className="col-span-1 md:col-span-2 lg:col-span-3" data-fieldkey={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{fieldName}{isRequired && <span className="text-red-500 ml-1">*</span>}</label>
                    <div className="flex items-center flex-wrap gap-4 pt-2">
                        {checkboxGroupOptions.map(opt => (
                            <label key={opt.key} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={(value as string[]).includes(opt.key)}
                                    onChange={e => {
                                        const currentValues = Array.isArray(value) ? value : [];
                                        const newValues = e.target.checked ? [...currentValues, opt.key] : currentValues.filter(k => k !== opt.key);
                                        handleDynamicFormChange(key, newValues);
                                    }}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-700">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            );
        }
        return (<div data-fieldkey={key}><label className="block text-sm font-medium text-gray-700 mb-2">{fieldName}{isRequired && <span className="text-red-500 ml-1">*</span>}</label><input type={inputType} value={value} onChange={(e) => handleDynamicFormChange(key, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>)
    };

    const formLayouts: { [key: string]: string[][] } = {
        'registration-info': [['registrationInfo.airitiContractNo', 'registrationInfo.ebookContractNo'], ['registrationInfo.acquisitionMaintainer', 'registrationInfo.asTeamMaintainer']],
        'basic-info': [['basicInfo.contractTargetType', 'basicInfo.contractStatus', 'basicInfo.earlyTermination'], ['basicInfo.publisherName', 'basicInfo.licensorPersonInCharge'], ['basicInfo.licensorRep', 'basicInfo.airitiSignatory'], ['basicInfo.contractStartDate', 'basicInfo.contractEndDate'], ['basicInfo.autoRenewYears', 'basicInfo.autoRenewTimes', 'basicInfo.thereafter'], ['basicInfo.contractVersionNo', 'basicInfo.contractName'], ['basicInfo.specialPenalties', 'basicInfo.jurisdiction']],
        'rights-info': [['rightsInfo.trialPercentage'], ['rightsInfo.printingPercentage'], ['rightsInfo.doiApplication'], ['rightsInfo.doiFee']],
        'scope-info': [['scopeInfo.b2bSalesRightsToggle']],
        'other-clauses': [],
        'accounting-info': [['accountingInfo.entityType', 'accountingInfo.locationType'], ['accountingInfo.billingCycle', 'accountingInfo.paymentTerm'], ['accountingInfo.paymentMethod', 'accountingInfo.idNumber'], ['accountingInfo.accountHolderName', 'accountingInfo.taxId'], ['accountingInfo.bankName', 'accountingInfo.bankCode'], ['accountingInfo.branchName', 'accountingInfo.branchCode'], ['accountingInfo.accountNumber', 'accountingInfo.swiftCode'], ['accountingInfo.bankAddress'], ['accountingInfo.remittanceNotes']],
        'tw-book-rights': [['twBookRights.exclusiveAuthorization'], ['twBookRights.exclusiveConditions'], ['twBookRights.trialTwBook'], ['twBookRights.fullTextDigitizationTwBook']],
        'tw-book-accounting': [['twBookAccounting.twBookOverseasDiscount'], ['twBookAccounting.twBookBillingCycle'], ['twBookAccounting.twBookPaymentMethod'], ['twBookAccounting.twBookPaymentTerms'], ['twBookAccounting.twBookAccountHolder'], ['twBookAccounting.twBookPayeeInfo'], ['twBookAccounting.twBookBankName'], ['twBookAccounting.twBookBranchName'], ['twBookAccounting.twBookAccountNumber']],
        'tw-book-logistics': [['twBookLogistics.minimumShipmentThreshold'], ['twBookLogistics.freeShippingThreshold'], ['twBookLogistics.returnCycle'], ['twBookLogistics.nonDefectiveReturnShippingFee'], ['twBookLogistics.domesticReturnShippingFee'], ['twBookLogistics.sampleBookDiscount'], ['twBookLogistics.sampleBookBillingCycle'], ['twBookLogistics.authorizedSalesRegion'], ['twBookLogistics.subDistribution']],
        'tw-book-contact': [['twBookContact.publisherRegion']],
    };

    const rightsTableItems = [
        'fullTextDigitization', 'trialAccess', 'tts', 'fullTextSearch', 'dataComparison',
        'systemData', 'captureAnalysisProcessing', 'autoGeneration', 'algorithmTraining',
        'languageSwitching', 'chapterPresentation', 'chapterSales', 'marketingModel',
        'publisherSpecs', 'thirdPartyAuthorization', 'thirdPartyConsignment', 'salesChannels',
        'paymentMethodRights', 'listingSchedule', 'listingItems', 'listingPlatforms',
        'tradingConditions', 'contentPresentation', 'serviceModel'
    ];

    const platformGridItems: (keyof OtherClauses)[] = [
        'amazon', 'google', 'kobo', 'pubu', 'eslite', 'pchome', 'readmoo', 'udn',
        'bookwalker', 'hyweb', 'bookscom', 'apple', 'mybook', 'momo', 'twb', 'hkUe',
        'taaze', 'ingram', 'overdrive', 'hami', 'truth', 'wechat',
    ];

    const contractType = formData.basicInfo.contractTargetType;
    const visibleTocSections = dddTocSections.filter(section => {
        const isEbookSection = ['rights-info', 'scope-info', 'other-clauses', 'accounting-info'].includes(section.id);
        const isTwBookSection = ['tw-book-rights', 'tw-book-accounting', 'tw-book-logistics', 'tw-book-contact'].includes(section.id);
        if (contractType && (contractType === 'ebook' || contractType === 'ejournal') && isTwBookSection) return false;
        if (contractType === 'taiwan_book' && isEbookSection) return false;
        return true;
    });

    const ebookData = formData as EbookMagazineContract;
    const twBookData = formData as TaiwanBookContract;

    return (
        <div className="bg-gray-100 relative">
            <FloatingTOC onJump={handleTocJump} sections={visibleTocSections.map(s => ({ id: s.id, label: s.label }))} />

            <div ref={mainContentRef} className="max-w-7xl mx-auto">
                {/* Header & Import Section */}
                <div className="mb-8 bg-white rounded-xl shadow-sm border border-indigo-100 overflow-hidden">
                    <div className="p-6 border-b border-indigo-100 bg-indigo-50/50">
                        <div className="p-6 border-b border-indigo-100 bg-indigo-50/50">
                            <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? '維護合約' : '新增合約'}</h2>
                        </div>
                    </div>
                    {!isEditMode && (
                        <div className="p-6 bg-indigo-50/30">
                            <div className="flex flex-col gap-3">
                                <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                    <Download size={18} className="text-indigo-600" /> 帶出舊資料
                                </h3>
                                <p className="text-sm text-gray-600">若新合約內容與舊合約大致相同，可輸入舊合約的「華藝合約編號」快速帶入資料。(此功能僅為演示，請輸入 'OLD-001')</p>
                                <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                                    <input type="text" value={importContractNo} onChange={(e) => setImportContractNo(e.target.value)} className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="輸入舊合約的華藝合約編號..." />
                                    <Button type="button" onClick={handleImportData} className="w-full sm:w-auto" variant="primary">帶出</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-8 pb-20">
                    {visibleTocSections.map(section => {
                        if (section.id === 'rights-info') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <PercentageWithText fieldKey="rightsInfo.trialPercentage" label={fieldKeyToNameMap['rightsInfo.trialPercentage']} percentageValue={ebookData.rightsInfo.trialPercentage.percentage} onPercentageChange={v => handleDynamicFormChange('rightsInfo.trialPercentage.percentage', v)} textValue={ebookData.rightsInfo.trialPercentage.details} onTextChange={v => handleDynamicFormChange('rightsInfo.trialPercentage.details', v)} />
                                            <PercentageWithText fieldKey="rightsInfo.printingPercentage" label={fieldKeyToNameMap['rightsInfo.printingPercentage']} percentageValue={ebookData.rightsInfo.printingPercentage.percentage} onPercentageChange={v => handleDynamicFormChange('rightsInfo.printingPercentage.percentage', v)} textValue={ebookData.rightsInfo.printingPercentage.details} onTextChange={v => handleDynamicFormChange('rightsInfo.printingPercentage.details', v)} />
                                        </div>
                                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">權利項目</th><th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">是</th><th scope="col" className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">否</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">其他 / 備註</th></tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    <tr className="bg-gray-50"><td className="px-6 py-3 whitespace-nowrap text-sm font-semibold text-gray-700">全選</td><td className="px-2 py-3 text-center"><input type="radio" name="rights-bulk-select" onClick={() => handleRightsBulkSelectClick('yes')} checked={rightsBulkSelect === 'yes'} onChange={() => { }} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" aria-label="全選為 是" /></td><td className="px-2 py-3 text-center"><input type="radio" name="rights-bulk-select" onClick={() => handleRightsBulkSelectClick('no')} checked={rightsBulkSelect === 'no'} onChange={() => { }} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" aria-label="全選為 否" /></td><td className="px-6 py-3"><div className="flex items-center"><input type="radio" name="rights-bulk-select" onClick={() => handleRightsBulkSelectClick('other')} checked={rightsBulkSelect === 'other'} onChange={() => { }} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer" aria-label="全選為 其他" /><span className="ml-2 text-gray-400 italic">（選擇此項以套用"其他"）</span></div></td></tr>
                                                    {rightsTableItems.map(item => {
                                                        const key = `rightsInfo.${item}`;
                                                        const fieldData = getFieldValue(formData, key);
                                                        const handleRadioChange = (value: string) => { handleDynamicFormChange(`${key}.selected`, value); if (value !== 'other') { handleDynamicFormChange(`${key}.details`, ''); } };
                                                        return (
                                                            <tr key={key} data-fieldkey={key}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fieldKeyToNameMap[key]}</td><td className="px-2 py-4 text-center"><input type="radio" name={key} value="yes" checked={fieldData.selected === 'yes'} onChange={e => handleRadioChange(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" /></td><td className="px-2 py-4 text-center"><input type="radio" name={key} value="no" checked={fieldData.selected === 'no'} onChange={e => handleRadioChange(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" /></td><td className="px-6 py-4"><div className="flex items-center"><input type="radio" name={key} value="other" checked={fieldData.selected === 'other'} onChange={e => handleRadioChange(e.target.value)} className="h-4 w-4 text-indigo-600 border-gray-300" /><input type="text" value={fieldData.details} onChange={e => handleDynamicFormChange(`${key}.details`, e.target.value)} onFocus={() => { if (fieldData.selected !== 'other') handleRadioChange('other') }} className="ml-2 w-full px-3 py-1 border border-gray-300 rounded-md" placeholder="請填寫備註或條件..." /></div></td></tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"><TextInput fieldKey="rightsInfo.doiApplication" label={fieldKeyToNameMap['rightsInfo.doiApplication']} value={ebookData.rightsInfo.doiApplication} onChange={v => handleDynamicFormChange('rightsInfo.doiApplication', v)} /><TextInput fieldKey="rightsInfo.doiFee" label={fieldKeyToNameMap['rightsInfo.doiFee']} value={ebookData.rightsInfo.doiFee} onChange={v => handleDynamicFormChange('rightsInfo.doiFee', v)} /></div>
                                    </div>
                                </div>
                            );
                        }

                        const layout = formLayouts[section.id];
                        if (!layout) return null;
                        if (section.id === 'scope-info') {
                            const showSubItems = ebookData.scopeInfo.b2bSalesRightsToggle === 'yes' || ebookData.scopeInfo.b2bSalesRightsToggle === 'by_title';
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white"><h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3><div className="space-y-4"><div className="grid grid-cols-1 gap-4" data-fieldkey="scopeInfo.b2bSalesRightsToggle">{renderField('scopeInfo.b2bSalesRightsToggle')}</div>{showSubItems && (<div className="space-y-4 transition-all duration-300"><TextInput fieldKey="scopeInfo.b2bAuthorizationType" label={fieldKeyToNameMap['scopeInfo.b2bAuthorizationType']} value={ebookData.scopeInfo.b2bAuthorizationType} onChange={v => handleDynamicFormChange('scopeInfo.b2bAuthorizationType', v)} /><PercentageWithText fieldKey="scopeInfo.b2bSplitPercentage" label={fieldKeyToNameMap['scopeInfo.b2bSplitPercentage']} percentageValue={ebookData.scopeInfo.b2bSplitPercentage.percentage} onPercentageChange={v => handleDynamicFormChange('scopeInfo.b2bSplitPercentage.percentage', v)} textValue={ebookData.scopeInfo.b2bSplitPercentage.details} onTextChange={v => handleDynamicFormChange('scopeInfo.b2bSplitPercentage.details', v)} /><TextInput fieldKey="scopeInfo.b2bSalesRegion" label={fieldKeyToNameMap['scopeInfo.b2bSalesRegion']} value={ebookData.scopeInfo.b2bSalesRegion} onChange={v => handleDynamicFormChange('scopeInfo.b2bSalesRegion', v)} /><TextInput fieldKey="scopeInfo.b2bMinMultiple" label={fieldKeyToNameMap['scopeInfo.b2bMinMultiple']} value={ebookData.scopeInfo.b2bMinMultiple} onChange={v => handleDynamicFormChange('scopeInfo.b2bMinMultiple', v)} /><RadioOnly fieldKey="scopeInfo.b2bRoyaltyAdjustment" label={fieldKeyToNameMap['scopeInfo.b2bRoyaltyAdjustment']} value={ebookData.scopeInfo.b2bRoyaltyAdjustment} onChange={v => handleDynamicFormChange('scopeInfo.b2bRoyaltyAdjustment', v)} options={radioOptions['scopeInfo.b2bRoyaltyAdjustment']} /><RadioOnly fieldKey="scopeInfo.b2bPricingPower" label={fieldKeyToNameMap['scopeInfo.b2bPricingPower']} value={ebookData.scopeInfo.b2bPricingPower} onChange={v => handleDynamicFormChange('scopeInfo.b2bPricingPower', v)} options={radioOptions['scopeInfo.b2bPricingPower']} /></div>)}</div></div>
                            )
                        }

                        if (section.id === 'other-clauses') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <div className="space-y-4">
                                        <div data-fieldkey="otherClauses.b2cSalesRightsToggle">{renderField('otherClauses.b2cSalesRightsToggle')}</div>
                                        {(ebookData.otherClauses.b2cSalesRightsToggle === 'yes' || ebookData.otherClauses.b2cSalesRightsToggle === 'by_title') && (
                                            <div className="space-y-4">
                                                <TextInput fieldKey="otherClauses.b2cAuthorizationType" label={fieldKeyToNameMap['otherClauses.b2cAuthorizationType']} value={ebookData.otherClauses.b2cAuthorizationType} onChange={value => handleDynamicFormChange('otherClauses.b2cAuthorizationType', value)} />
                                                <PercentageWithText fieldKey="otherClauses.b2cSplitPercentage" label={fieldKeyToNameMap['otherClauses.b2cSplitPercentage']} percentageValue={ebookData.otherClauses.b2cSplitPercentage.percentage} onPercentageChange={value => handleDynamicFormChange('otherClauses.b2cSplitPercentage.percentage', value)} textValue={ebookData.otherClauses.b2cSplitPercentage.details} onTextChange={value => handleDynamicFormChange('otherClauses.b2cSplitPercentage.details', value)} />
                                                {['shuNiuXiong', 'kingstone', 'sanmin', 'taaze'].map(item => <RadioWithOtherInput fieldKey={`otherClauses.${item}`} key={item} label={fieldKeyToNameMap[`otherClauses.${item}`]} radioValue={(ebookData.otherClauses[item as keyof OtherClauses] as CheckboxWithTextData).selected} textValue={(ebookData.otherClauses[item as keyof OtherClauses] as CheckboxWithTextData).details} onRadioChange={value => handleDynamicFormChange(`otherClauses.${item}.selected`, value)} onTextChange={value => handleDynamicFormChange(`otherClauses.${item}.details`, value)} />)}
                                                <div data-fieldkey="otherClauses.distributorPlatformToggle">{renderField('otherClauses.distributorPlatformToggle')}</div>
                                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                                    <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">平台名稱</th><th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">是</th><th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase">否</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">其他/備註</th></tr></thead>
                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                            {platformGridItems.map(item => { const key = `otherClauses.${item}`; const fieldData = getFieldValue(formData, key); return (<tr key={key} data-fieldkey={key}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fieldKeyToNameMap[key]}</td><td className="px-2 py-4 text-center"><input type="radio" name={key} value="yes" checked={fieldData.selected === 'yes'} onChange={e => handleDynamicFormChange(`${key}.selected`, e.target.value)} /></td><td className="px-2 py-4 text-center"><input type="radio" name={key} value="no" checked={fieldData.selected === 'no'} onChange={e => handleDynamicFormChange(`${key}.selected`, e.target.value)} /></td><td className="px-6 py-4"><input type="text" value={fieldData.details} onChange={e => handleDynamicFormChange(`${key}.details`, e.target.value)} className="w-full border rounded px-2 py-1" /></td></tr>) })}
                                                        </tbody></table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        if (section.id === 'tw-book-contact') {
                            return (
                                <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                    <div className="space-y-6">
                                        <RadioOnly fieldKey="twBookContact.publisherRegion" label={fieldKeyToNameMap['twBookContact.publisherRegion']} value={twBookData.twBookContact.publisherRegion} onChange={value => handleDynamicFormChange('twBookContact.publisherRegion', value)} options={radioOptions['twBookContact.publisherRegion']} />
                                        <div className="space-y-4">
                                            {twBookData.twBookContact.contacts.map((contact, index) => (
                                                <div key={contact.id} className="p-4 border border-gray-200 rounded-lg relative space-y-4 bg-gray-50/50">
                                                    {twBookData.twBookContact.contacts.length > 1 && (<Button variant="ghost" size="sm" type="button" onClick={() => removeContact(contact.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 h-auto"><Trash2 size={16} /></Button>)}
                                                    <TextInput fieldKey={`contactPersonInfo-${index}`} label={fieldKeyToNameMap['twBookContact.contactPersonInfo']} value={contact.info} onChange={value => handleContactChange(index, 'info', value)} />
                                                    <DDDTagInput fieldKey={`contactPersonTitle-${index}`} label={fieldKeyToNameMap['twBookContact.contactPersonTitle']} tags={contact.title} setTags={newTags => handleContactChange(index, 'title', newTags)} suggestions={['負責人', '簽約者', '集貨', '報品', '窗口']} />
                                                    <TextInput fieldKey={`contactPersonEmail-${index}`} type="email" label={fieldKeyToNameMap['twBookContact.contactPersonEmail']} value={contact.email} onChange={value => handleContactChange(index, 'email', value)} />
                                                    <TextInput fieldKey={`contactPersonPhone-${index}`} type="tel" label={fieldKeyToNameMap['twBookContact.contactPersonPhone']} value={contact.phone} onChange={value => handleContactChange(index, 'phone', value)} />
                                                </div>
                                            ))}
                                            <Button type="button" onClick={addContact} variant="ghost" className="mt-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100"><Plus size={16} className="mr-2" /> 新增聯絡人</Button>
                                        </div>
                                        <AddressInput fieldKey="twBookContact.companyAddress" label={fieldKeyToNameMap['twBookContact.companyAddress']} postalCode={twBookData.twBookContact.companyPostalCode} onPostalCodeChange={value => handleDynamicFormChange('twBookContact.companyPostalCode', value)} address={twBookData.twBookContact.companyAddress} onAddressChange={value => handleDynamicFormChange('twBookContact.companyAddress', value)} />
                                        <AddressInput fieldKey="twBookContact.logisticsAddress" label={fieldKeyToNameMap['twBookContact.logisticsAddress']} postalCode={twBookData.twBookContact.logisticsPostalCode} onPostalCodeChange={value => handleDynamicFormChange('twBookContact.logisticsPostalCode', value)} address={twBookData.twBookContact.logisticsAddress} onAddressChange={value => handleDynamicFormChange('twBookContact.logisticsAddress', value)} />
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={section.id} id={section.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">{section.label}</h3>
                                {layout.length === 0 ? (<p className="text-gray-500">此區塊目前沒有欄位。</p>) : (
                                    <div className="space-y-4">
                                        {layout.map((row, rowIndex) => {
                                            const gridColsClass = row.length === 3 ? 'md:grid-cols-3' : (row.length === 2 ? 'md:grid-cols-2' : 'grid-cols-1');
                                            return (
                                                <div key={rowIndex} className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
                                                    {row.map(fieldKey => (
                                                        <div key={fieldKey}>{renderField(fieldKey)}</div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div id="scan-file" className="border border-gray-200 rounded-lg p-6 bg-white" data-fieldkey="scanFile"><h3 className="text-lg font-semibold text-gray-800 mb-4">合約掃描檔</h3>{formData.scanFile ? (<div className="flex items-center justify-between px-4 py-2 bg-gray-50 border rounded-lg text-gray-900"><span>{getFileName(formData.scanFile)}</span><Button variant="ghost" size="sm" type="button" onClick={() => handleDynamicFormChange('scanFile', null)} className="text-red-500 hover:text-red-700 hover:bg-red-50">移除</Button></div>) : (<div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 cursor-pointer" onClick={() => fileInputRef.current?.click()}><Upload className="mx-auto h-12 w-12 text-gray-400" /><p className="mt-2 text-sm text-gray-600">點擊此處上傳檔案</p><p className="text-xs text-gray-500">支援 PDF, PNG, JPG 等格式</p><input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} /></div>)}</div>
                    <div id="remarks" className="border border-gray-200 rounded-lg p-6 bg-white" data-fieldkey="remarks"><h3 className="text-lg font-semibold text-gray-800 mb-4">備註</h3><textarea value={formData.remarks} onChange={(e) => handleDynamicFormChange('remarks', e.target.value)} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="請輸入備註資訊..." /></div>

                    <div className="flex justify-end gap-4 mt-8 pb-8">
                        <Button type="button" variant="secondary" onClick={() => { if (isEditMode) window.history.back(); else { getInitialFormData(); mainContentRef.current?.scrollTo(0, 0); showMessage('已清除所有欄位。'); } }}>取消</Button>
                        <Button type="submit"><Plus className="w-4 h-4 mr-2" />{isEditMode ? '儲存變更' : '建立新合約'}</Button>
                    </div>
                </form>
            </div>
            <ValidationWarningPanel isVisible={isValidationPanelVisible} hardMissing={validationErrors.hard} onJumpToField={handleJumpToField} onClose={() => setIsValidationPanelVisible(false)} />
            {message.show && (<div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg text-white shadow-lg z-[100] ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>{message.message}</div>)}
        </div>
    );
};

export default DDDContract;
