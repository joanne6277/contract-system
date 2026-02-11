import { useState, useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldValueGetter = (obj: any, path: string) => any;

interface ValidationRules {
    hard: string[];
    custom?: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: (formData: any) => boolean;
    };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFormValidation = <T extends Record<string, any>>(
    formData: T,
    rules: ValidationRules,
    fieldKeyToNameMap: { [key: string]: string },
    getFieldValue: FieldValueGetter
) => {
    const [validationErrors, setValidationErrors] = useState<{ hard: string[] }>({ hard: [] });
    const [isValidationPanelVisible, setIsValidationPanelVisible] = useState(false);

    const validateForm = useCallback(() => {
        const missingLevel1: string[] = [];

        // 1. Check Hard Rules (Simple existence check)
        rules.hard.forEach(fieldKey => {
            const value = getFieldValue(formData, fieldKey);

            // Basic "is not empty" check
            let isValid = true;
            if (value === undefined || value === null) {
                isValid = false;
            } else if (typeof value === 'string') {
                if (value.trim() === '') isValid = false;
            } else if (Array.isArray(value)) {
                if (value.length === 0) isValid = false;
            } else if (typeof value === 'object') {
                // For custom component objects (like ThirdPartyPlatform), sometimes they are just objects
                // We might need specific checks, but for now object existence is the baseline.
                // If it's a required object field but empty inside, the value itself is likely not null.
                // Ideally `getFieldValue` should return the "value" we want to check.
                // If the value is an empty object {}, it might be considered valid in JS but invalid for form.
                if (Object.keys(value).length === 0) isValid = false;
            }

            if (!isValid) {
                // Use map to get human readable name, fallback to key
                const name = fieldKeyToNameMap[fieldKey] || fieldKey;
                missingLevel1.push(name);
            }
        });

        // 2. Check Custom Rules
        if (rules.custom) {
            Object.entries(rules.custom).forEach(([ruleName, validator]) => {
                if (!validator(formData)) {
                    // For custom rules, we might want a specific error message.
                    // Assuming ruleName is a key in fieldMap or we append a manual message.
                    const name = fieldKeyToNameMap[ruleName] || ruleName;
                    missingLevel1.push(name);
                }
            });
        }

        return { missingLevel1 };
    }, [formData, rules, fieldKeyToNameMap, getFieldValue]);

    const handleValidation = useCallback(() => {
        const { missingLevel1 } = validateForm();
        if (missingLevel1.length > 0) {
            setValidationErrors({ hard: missingLevel1 });
            setIsValidationPanelVisible(true);
            return false;
        }
        setIsValidationPanelVisible(false);
        setValidationErrors({ hard: [] });
        return true;
    }, [validateForm]);

    // Helper to check if a specific field is required (for UI display)
    const isFieldRequired = useCallback((fieldKey: string) => {
        return rules.hard.includes(fieldKey);
    }, [rules]);

    return {
        validationErrors,
        isValidationPanelVisible,
        setIsValidationPanelVisible,
        validateForm,
        handleValidation,
        isFieldRequired
    };
};
