const XLSX = require('xlsx');
const fs = require('fs');

const excelFilePath = 'c:\\Users\\Hasnain\\Desktop\\1\\intern_assignment_support_pack_dev_only_v3.xlsx';
const outputJsonPath = 'c:\\Users\\Hasnain\\Desktop\\1\\backend\\metrics_dataset.json';

try {
    const workbook = XLSX.readFile(excelFilePath);
    const result = {};

    const targetSheets = [
        'Dim_Developers',
        'Fact_Jira_Issues',
        'Fact_Pull_Requests',
        'Fact_CI_Deployments',
        'Fact_Bug_Reports'
    ];

    targetSheets.forEach(sheetName => {
        if (workbook.SheetNames.includes(sheetName)) {
            const worksheet = workbook.Sheets[sheetName];
            result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
            console.log(`Converted sheet: ${sheetName} (${result[sheetName].length} rows)`);
        }
    });

    fs.writeFileSync(outputJsonPath, JSON.stringify(result, null, 2));
    console.log(`Successfully saved dataset to ${outputJsonPath}`);
} catch (error) {
    console.error('Error converting Excel to JSON:', error.message);
}
