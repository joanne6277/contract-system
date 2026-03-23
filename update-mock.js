import fs from 'fs';

const dataFile = 'd:/Projects/contract system/src/data/mockContracts.ts';
let code = fs.readFileSync(dataFile, 'utf8');

// Match each object in the array
code = code.replace(/    \{\s+id: '(\d+)',([\s\S]*?)\n    \}(?=,|\n\])/g, (match, idStr, innerBody) => {
    let id = parseInt(idStr);
    let contractType = id <= 10 ? "'journal_proceedings'" : "'personal_auth'";

    // Insert contractType right after id
    let newInner = `\n        contractType: ${contractType},${innerBody}`;

    if (id <= 10) {
        // Journal Proceedings: keep everything
        return `    {\n        id: '${idStr}',${newInner}\n    }`;
    } else {
        // Personal Auth: remove unused fields
        newInner = newInner.replace(/contractTarget:\s+\{[\s\S]*?\},/g, '');
        newInner = newInner.replace(/registrationInfo:\s+\{[\s\S]*?\},/g, '');
        newInner = newInner.replace(/basicInfo:\s+\{[\s\S]*?\},/g, '');
        newInner = newInner.replace(/rightsInfo:\s+\{[\s\S]*?\},/g, '');
        newInner = newInner.replace(/scopeInfo:\s+\{[\s\S]*?\},/g, '');
        newInner = newInner.replace(/otherClauses:\s+\{[\s\S]*?\},/g, '');
        newInner = newInner.replace(/remittanceInfo:\s+\[[\s\S]*?\],/g, '');
        newInner = newInner.replace(/terminationInfo:\s+\{[\s\S]*?\},/g, '');
        newInner = newInner.replace(/royaltyInfo:\s+\[[\s\S]*?\],/g, '');

        // Uncomment specific fields
        newInner = newInner.replace(/\/\/ 個人授權專用欄位\s+personalAuthInfo\?:/g, 'personalAuthInfo:');
        newInner = newInner.replace(/personalAuthRoyaltyInfo\?:/g, 'personalAuthRoyaltyInfo:');

        return `    {\n        id: '${idStr}',${newInner}\n    }`;
    }
});

fs.writeFileSync(dataFile, code);
console.log('Done');
