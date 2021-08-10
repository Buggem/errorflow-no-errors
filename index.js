// GLOBAL VARIABLES
let canvas;
let CTX;
let winHeight;
let winWidth;

let errCtrl = 0.7;		// IT'S FINE/MEDIUM = 0.7, DEEP FRIED = 0.0 || Value should be in range of "0 >= x >= 1"
let errShaking = true;	// ON/OFF scren shaking and tearing
let errType = 0;		// 0 - everything, 1 - errors, 2 - warnings, 3 - misc


// Resize the canvas to match the window. Also used as a canvas cleaner.
function setSize() {
	winWidth = window.innerWidth;
	winHeight = window.innerHeight;
	canvas.width = winWidth;
	canvas.height = winHeight;
}


// Grab a 100-pixel-tall horizontal strip and move it left or right by 50px
function effectTearing() {
	for (let i = 0; i < 5; i++) {
		let pos_y = parseInt(Math.random() * (winHeight - 100));

		CTX.drawImage(
			canvas,
			0,
			pos_y,
			winWidth,
			100,
			(parseInt(Math.random() * 2) * 100) - 50, // (+/-)50
			pos_y,
			winWidth,
			100);
	}
}

// Add a random image to the canvas and play corresponding sound randomly
function addImage(errorX, errorY) {
	var rndgen = parseInt(Math.random() * 30);
	if (errType == 1) { var rndgen = parseInt(Math.random() * 10); }
	if (errType == 2) { var rndgen = parseInt(Math.random() * 10 + 10); }
	if (errType == 3) { var rndgen = parseInt(Math.random() * 10 + 20); }
	let rndImage = document.getElementById('img' + rndgen);
	let rndSound = document.getElementById('snd' + parseInt(rndgen / 2));
	
	// Use random XY if got 'rnd'
	if (errorX == 'rnd') {
		errorX = parseInt(Math.random() * (winWidth - rndImage.width) + Math.round(rndImage.width / 2));
		errorY = parseInt(Math.random() * (winHeight - 20 - rndImage.height) + 15);
	}
	
	if (cfgSpaceMode) { CTX.fillStyle = 'rgba(0, 0, 0, 0.2)';
	CTX.fillRect(0, 0, canvas.width, canvas.height); }
	CTX.drawImage(
		rndImage,
		errorX - Math.round(rndImage.width / 2), 
		errorY - 15 );
	rndSound.currentTime = 0;
	rndSound.play();
}

// Mouse up/down event listeners; mousedowntick is used to add images not too fast
var mousedown = false;
var mousedowntick = 4;
window.addEventListener('mousedown', function() { mousedown = true; })
window.addEventListener('mouseup', function() { mousedown = false; })

// Add random images on mousedown
function addImageOnMousedown(event) {
	mousedowntick -= 1;

	if(mousedowntick <= 0) {
		var mouseX = event.clientX;
		var mouseY = event.clientY;
		if(mousedown == true) {
			addImage(mouseX, mouseY);
		}
		mousedowntick = 4;
	}
}
window.addEventListener('mouseup', function() { mousedown = false; })

// Add random image on mouse click
function addImageOnMouseclick(event) {
	var mouseX = event.clientX;
	var mouseY = event.clientY;
	addImage(mouseX, mouseY);
}
// Temporarily bump the canvas on horizontal axis
function effectSShakeH() {
	canvas.style.left = Math.random() < 0.5 ? "-30px" : "30px";
	setTimeout(function () {
		canvas.style.left = '0px';
	}, 50);
}

// Temporarily bump the canvas on vertial axis
function effectSShakeV() {
	canvas.style.top = Math.random() < 0.5 ? "-30px" : "30px";
	setTimeout(function () {
		canvas.style.top = '0px';
	}, 50);
}


// Main loop (on interval)
function mainloop() {
	if (document.hidden === true)
		return;		// Be courteous
	if (errShaking == true) {
		if (Math.random() < 0.02 / (errCtrl + 0.4))
			effectTearing();
		if (Math.random() < 0.08 / ((errCtrl + 0.4) / 0.4))
			effectSShakeH();
		if (Math.random() < 0.04 / ((errCtrl + 0.4) / 0.4))
			effectSShakeV();
	}
	if (Math.random() > errCtrl)
		addImage('rnd');
}


// Ding when the loading screen is clicked
function dingOnClick() {
	document.getElementById("ding").currentTime = 0;
	document.getElementById("ding").play();
}


// Go to fullscreen (unused)
function goFullscreen() {
	let entirePage = document.getElementById("fullscrPage");
	if (entirePage.requestFullscreen) {
		entirePage.requestFullscreen();
	} else if (entirePage.webkitRequestFullscreen) {
		entirePage.webkitRequestFullscreen();
	} else if (entirePage.msRequestFullscreen) {
		entirePage.msRequestFullscreen();
	}
}


// Get hours and minutes for taskbar clock every 3 seconds
function updateTrayClock() {
	let trayGetTime = new Date();
	let trayGetHours = "00"
	let trayGetMinutes = "00"

	if (trayGetTime.getHours() < 10 && trayGetTime.getMinutes() < 10) {
		var trayClock = "0" + trayGetTime.getHours() + ":0" + trayGetTime.getMinutes(); }
	if (trayGetTime.getHours() >= 10 && trayGetTime.getMinutes() < 10) {
		var trayClock = trayGetTime.getHours() + ":0" + trayGetTime.getMinutes(); }
	if (trayGetTime.getHours() < 10 && trayGetTime.getMinutes() >= 10) {
		var trayClock = "0" + trayGetTime.getHours() + ":" + trayGetTime.getMinutes(); }
	if (trayGetTime.getHours() >= 10 && trayGetTime.getMinutes() >= 10) {
		var trayClock = trayGetTime.getHours() + ":" + trayGetTime.getMinutes(); }

	document.getElementById('tray-clock').innerHTML = trayClock;
}
setInterval(updateTrayClock, 3000);


// Errorification toggler
function toggleErrCtrl() {
	if(errCtrl == 0.0 && errShaking == true) { errCtrl = 1.0; errShaking = false;
		document.getElementById('tray-errCtrl').style = 'background: url("img/tray-errCtrl-off.png")';
		document.getElementById('tray-errCtrl').title = "Errorification: RELAX";
		return; }
	if(errCtrl == 1.0 && errShaking == false) { errCtrl = 0.7; errShaking = false;
		document.getElementById('tray-errCtrl').style = 'background: url("img/tray-errCtrl-low.png")';
		document.getElementById('tray-errCtrl').title = "Errorification: IT'S FINE";
		return; }
	if(errCtrl == 0.7 && errShaking == true) { errCtrl = 0.0; errShaking = false;
		document.getElementById('tray-errCtrl').style = 'background: url("img/tray-errCtrl-high.png")';
		document.getElementById('tray-errCtrl').title = "Errorification: WHAT HAPPENS";
		return; }
	if(errCtrl == 0.0 && errShaking == false) { errCtrl = 0.0; errShaking = true;
		document.getElementById('tray-errCtrl').style = 'background: url("img/tray-errCtrl-highS.png")';
		document.getElementById('tray-errCtrl').title = 'Errorification: DEEP FRIED';
		return; }
	else { errCtrl = 0.7; errShaking = true;
		document.getElementById('tray-errCtrl').style = 'background: url("img/tray-errCtrl-lowS.png")';
		document.getElementById('tray-errCtrl').title = "Errorification: MEDIUM";
		return; }
}


// Sound toggler
let cfgSound = true;
function toggleSound() { cfgSound = !cfgSound; 
	if (cfgSound) {
		for (audio of document.getElementsByTagName("audio")) { audio.muted = false; }
		document.getElementById('tray-sounds').style = 'background: url("img/tray-sounds-on.png")';
		document.getElementById('tray-sounds').title = 'Sounds: ON';
	} else {
		for (audio of document.getElementsByTagName("audio")) { audio.muted = true; }
		document.getElementById('tray-sounds').style = 'background: url("img/tray-sounds-off.png")';
		document.getElementById('tray-sounds').title = 'Sounds: OFF';
	}
}


// Error type toggler
function toggleErrType() { 
	if((errType) == 0) { errType = 1; 
		document.getElementById('tray-errType').style = 'background: url("img/tray-errType-err.png")';
		document.getElementById('tray-errType').title = 'Style: ERROR';
		return; }
	if((errType) == 1) { errType = 2; 
		document.getElementById('tray-errType').style = 'background: url("img/tray-errType-warn.png")';
		document.getElementById('tray-errType').title = 'Style: WARNING';
		return; }
	if((errType) == 2) { errType = 3; 
		document.getElementById('tray-errType').style = 'background: url("img/tray-errType-misc.png")';
		document.getElementById('tray-errType').title = 'Style: MISC';
		return; }
	else { errType = 0; 
		document.getElementById('tray-errType').style = 'background: url("img/tray-errType-all.png")';
		document.getElementById('tray-errType').title = 'Style: ALL';
		return; }
}


// SpaceMode™ toggler
let cfgSpaceMode = false;

let SpaceModeIntervalHandler = setInterval(bgSpaceMode, 50);

function bgSpaceMode() { if (cfgSpaceMode) { CTX.fillStyle = 'rgba(0, 0, 0, 0.03)'; CTX.fillRect(0, 0, canvas.width, canvas.height); } }


function toggleSpaceMode() { cfgSpaceMode = !cfgSpaceMode;
	if (cfgSpaceMode) {
		setSize();
		setTimeout(function () { if (cfgSpaceMode) { document.getElementById('fullscrPage').style = 'background: #000;'} }, 5000)
		document.getElementById('tray-clock').title = 'SpaceMode™: ON';
	} else {
		setSize();
		document.getElementById('fullscrPage').style = 'background: url("img/background.jpg")';
		document.getElementById('fullscrPage').style = 'background-size: cover;';
		document.getElementById('tray-clock').title = 'SpaceMode™: OFF';
	}
}


// Initialize all the things
function sw_init() {
	document.getElementById('loading').style = 'display: none;';
	document.getElementById('taskbar').style = 'display: block;';
	document.getElementById("welcome").currentTime = 0;
	document.getElementById("welcome").play();
	setTimeout(function () {
		canvas = document.getElementById('canvas');
		CTX = canvas.getContext("2d");
		window.addEventListener('resize', setSize);
		setSize();
		window.setInterval(mainloop, 100);
		setTimeout(function () { document.getElementById('taskbar-tooltip').style = 'display: none;'; }, 5000)
	}, 3000)
}

window.addEventListener('load', sw_init);