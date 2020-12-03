const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./ngake-updates-93c8802d8d88.json'); // the file saved above


// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet('1hc6l9UsYI1rfutEgkqSQRCGUZbkPw_A1lf8YJBvty8o');
(async function() {
await doc.useServiceAccountAuth(creds);

await doc.loadInfo(); // loads document properties and worksheets
console.log(doc.title);
 
const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
console.log(sheet.title);
console.log(sheet.rowCount);

await sheet.addRow({ Timestamp: Date.now(), Caption: 'Penis', URL: 'abc.xyz' });

const rows = await sheet.getRows();
console.log(rows.length); 

console.log(rows[rows.length - 1].Timestamp);
console.log(rows[rows.length - 1].Caption);
console.log(rows[rows.length - 1].URL);

}());