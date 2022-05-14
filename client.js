// The callback function the JSONP request will execute to load data from API
var numberOfScroll = parseInt(decodeURIComponent(window.location.hash.slice(1)));

var spreadsheetArraySave = [];

function handleClientLoad() {
	gapi.load('client', init);
}

async function init() {
	// 2. Initialize the JavaScript client library.
	await gapi.client.init({
		discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4']
	});
	makeApiCall();
}

function makeApiCall() {
	var params = {
		spreadsheetId: '1hc6l9UsYI1rfutEgkqSQRCGUZbkPw_A1lf8YJBvty8o',
		key: 'AIzaSyBy2jY3BguaGbmokAGQx8ccLiHN-D9VsRE',
		ranges: 'Sheet1'
	};

	var request = gapi.client.sheets.spreadsheets.values.batchGet(params);
	request.then(function (response) {
		doData(response.result);
	}, function (reason) {
		console.error('error: ' + reason.result.error.message);
	});
}

function doData(data) {
	console.log(data)
	// Final results will be stored here	
	var results = [];

	// Get all entries from spreadsheet
	var entries = data.valueRanges[0].values;

	// // Set initial previous row, so we can check if the data in the current cell is from a new row
	// var previousRow = 0;

	// // Iterate all entries in the spreadsheet
	// for (var i = 0; i < entries.length; i++) {
	// 	// check what was the latest row we added to our result array, then load it to local variable
	// 	var latestRow = results[results.length - 1];

	// 	// get current cell
	// 	var cell = entries[i];

	// 	// get text from current cell
	// 	var text = cell.content.$t;

	// 	// get the current row
	// 	var row = cell.gs$cell.row;

	// 	// Determine if the current cell is in the latestRow or is a new row
	// 	if (row > previousRow) {
	// 		// this is a new row, create new array for this row
	// 		var newRow = [];

	// 		// add the cell text to this new row array  
	// 		newRow.push(text);

	// 		// store the new row array in the final results array
	// 		results.push(newRow);

	// 		// Increment the previous row, since we added a new row to the final results array
	// 		previousRow++;
	// 	} else {
	// 		// This cell is in an existing row we already added to the results array, add text to this existing row
	// 		latestRow.push(text);
	// 	}

	// }

	// entries.shift()

	handleResults(entries);
}

// Do what ever you please with the final array
function handleResults(spreadsheetArray) {
	console.log(spreadsheetArray);
	spreadsheetArraySave = spreadsheetArray;
	row = numberOfScroll || spreadsheetArraySave.length - 1;
	console.log(numberOfScroll);
	if (row <= 1) {
		document.getElementById("leftArrow").style.opacity = 0;
		document.getElementById("leftArrow").style.visibility = "hidden";
	}
	if (row >= (spreadsheetArraySave.length - 1)) {
		document.getElementById("rightArrow").style.opacity = 0;
		document.getElementById("rightArrow").style.visibility = "hidden";
	}
	loadImage(row);
}

function loadImage(row) {
	document.getElementById("image").src = spreadsheetArraySave[row][2];
	document.getElementById("imageBackground").style.backgroundImage = "url(" + spreadsheetArraySave[row][2] + ")";
	document.getElementById("caption").innerHTML = spreadsheetArraySave[row][1];
	document.getElementById("caption").style.top = (Math.floor(Math.random() * (1 + 80 - 20)) + 20) + "%";
	document.getElementById("caption").style.left = (Math.floor(Math.random() * (1 + 80 - 20)) + 20) + "%";
}

function rightArrow() {
	var numberOfScroll = parseInt(decodeURIComponent(window.location.hash.slice(1)));
	if(numberOfScroll == spreadsheetArraySave.length - 1) {
		return;
	}
	row = numberOfScroll || spreadsheetArraySave.length - 1;
	row++;
	window.location.hash = encodeURIComponent(row);
	loadImage(row);
	if (row > 1) {
		document.getElementById("leftArrow").style.opacity = 100;
		document.getElementById("leftArrow").style.visibility = "visible";
	}
	if (row >= (spreadsheetArraySave.length - 1)) {
		document.getElementById("rightArrow").style.opacity = 0;
		document.getElementById("rightArrow").style.visibility = "hidden";
	}
}

function leftArrow() {
	var numberOfScroll = parseInt(decodeURIComponent(window.location.hash.slice(1)));
	if(numberOfScroll == 1) {
		return;
	}
	row = numberOfScroll || spreadsheetArraySave.length - 1;
	row--;
	window.location.hash = encodeURIComponent(row);
	loadImage(row);
	if (row <= 1) {
		document.getElementById("leftArrow").style.opacity = 0;
		document.getElementById("leftArrow").style.visibility = "hidden";
	}
	if (row < (spreadsheetArraySave.length - 1)) {
		document.getElementById("rightArrow").style.opacity = 100;
		document.getElementById("rightArrow").style.visibility = "visible";
	}
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("about");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
	modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
	modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}