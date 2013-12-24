/* This script will be executed only on the Home screen (see data/app.xml). */

var audio = document.querySelector("audio");
var img = document.querySelector("img");

this.subscribe(Savvy.READY, function(){
	// fired when the "ready" event is published to the Home screen
	window.addEventListener("resize", scalePirateImage);
	document.getElementById("version").innerHTML = config.version;
});

this.subscribe(Savvy.ENTER, function(){
	// fired when the "enter" event is published to the Home screen
	scalePirateImage();
	setPirateImageOpacity();
	img.onclick = playPause;
	if (typeof audio.paused == "boolean") {
		img.style.cursor = "pointer";
	}
});

this.subscribe(Savvy.EXIT, function(){
	// fired when the "exit" event is published to the Home screen
	window.removeEventListener("resize", scalePirateImage);
});

function scalePirateImage(){
	var height = (document.body.getBoundingClientRect().height - 200);
	img.style.height = height + "px";
}

function playPause(){
	if (audio.paused) {
		audio.play();
	} else {
		audio.pause();
	}
	
	setPirateImageOpacity();
}

function setPirateImageOpacity(){
	img.style.opacity = (audio.paused) ? 0.25 : 1;
}