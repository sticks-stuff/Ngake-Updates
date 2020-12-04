require('dotenv').config();
var nodemailer = require('nodemailer');
var imgur = require('imgur');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PWORD
  }
});

var mailOptions = {
  from: process.env.EMAIL,
  to: 'stickman391@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

// transporter.sendMail(mailOptions, function(error, info){
  // if (error) {
    // console.log(error);
  // } else {
    // console.log('Email sent: ' + info.response);
  // }
// }); 

const notifier = require('mail-notifier');

const imapNotif = {
  user: process.env.EMAIL,
  password: process.env.PWORD,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  tlsOptions : {
	rejectUnauthorized: false
  }
};

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
}());

const n = notifier(imapNotif);
n.on('end', () => n.start()) // session closed
n.on('mail', function(mail){
	// console.log(mail.subject);
	// console.log(mail);
	// console.log(mail.attachments);
	// console.log(mail.attachments[0].content);
	
	// console.log(typeof(mail.date));
	
	console.log("New Mail! " + mail.subject);
	console.log("From " + mail.from[0].address);
	if(mail.attachments !== undefined)
	{
		let bufferOriginal = Buffer.from(mail.attachments[0].content);
		console.log("Uploading to imgur...");
		imgur.setAPIUrl('https://api.imgur.com/3/');
		imgur.uploadBase64(bufferOriginal.toString('base64'))
		.then(function (json) {
			console.log("Uploaded! URL is " + json.data.link);
			var timestamp = parseInt(new Date(mail.date).getTime());
			console.log("Timestamp is " + timestamp);
			(async function() {
				const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
				if(mail.subject == '')
				{
					await sheet.addRow({ Timestamp: timestamp, Caption: "(no caption)", URL: json.data.link });
				} else {
					await sheet.addRow({ Timestamp: timestamp, Caption: mail.subject, URL: json.data.link });
				}
			}());
		})
		.catch(function (err) {
			if(err.message === 'File is over the size limit')
			{
				//TODO: Compress image before uploading so that the user does not have to compress it themselves
				console.error(err.message);
				var mailOptions = {
				  from: process.env.EMAIL,
				  to: mail.from[0].address,
				  subject: 'File over size limit!!',
				  text: 'The most recent file you\'ve attempted to upload is over the imgur 10MB size limit! Please consider compressing your image and trying again'
				};
				transporter.sendMail(mailOptions, function(error, info){
				  if (error) {
					console.log(error);
				  } else {
					console.log('Email sent: ' + info.response);
				  }
				}); 
			} else {
				console.log("Error uploading to imgur!");
				console.error(err.message);
			}
		});
	} else {
		console.log("No attachments in message! Ignoring");
	}
});
n.start();