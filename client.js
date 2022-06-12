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

	handleResults(entries);
}

var elem = document.querySelector('.carousel');
var flkty = new Flickity( elem, {
  // options
  lazyLoad: true,
  pageDots: false
});

flkty.resize();

window.addEventListener('resize', function(event){
    flkty.resize();
	document.getElementsByClassName('flickity-viewport')[0].style.height = window.innerHeight;
});

flkty.on( 'settle', function( index ) {
	window.location.hash = encodeURIComponent(index + 1);
});

// Do what ever you please with the final array
function handleResults(spreadsheetArray) {
	console.log(spreadsheetArray);
	row = numberOfScroll || spreadsheetArraySave.length - 1;
	console.log(numberOfScroll);
	for (let i = spreadsheetArray.length - 1; i > 0; i--) {
		var element = spreadsheetArray[i];
		var carouselCell = document.createElement("div");
		carouselCell.classList.add('carousel-cell');

		var timestamp = document.createElement("div");
		timestamp.classList.add('timestamp');
		timestamp.innerHTML = element[0];
		carouselCell.appendChild(timestamp);

		var caption = document.createElement("div");
		caption.classList.add('caption');
		caption.innerHTML = element[1];
		carouselCell.appendChild(caption);
		
		var image = document.createElement("img");
		image.classList.add('carousel-cell-image');
		image.dataset.flickityLazyload = element[2];
		carouselCell.appendChild(image);
		
		flkty.prepend(carouselCell);
		caption.style.top = "clamp(0px, calc(" + (Math.floor(Math.random() * (1 + 80 - 20)) + 20) + "% - " + (caption.clientHeight / 2) + "px), " + caption.clientHeight + "px)";
		caption.style.left = "calc(max(calc(" + (Math.floor(Math.random() * (1 + 80 - 20)) + 20) + "% - " + (caption.clientWidth / 2) + "px), 0px)"; //have to do this here bc otherwise the div isnt visible and clientHeight and clientWidth returns 0
	}
	// loadImage(row);
	flkty.select( parseInt(decodeURIComponent(window.location.hash.slice(1))) - 1, false, true )
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