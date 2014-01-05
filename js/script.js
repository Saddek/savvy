/* This script will be available on every screen as a child of the window object (see data/app.xml). */

window.addEventListener(Savvy.LOAD, function(){
	// fired once when Savvy loads first
	document.querySelector("audio").play();		
});

window.addEventListener(Savvy.READY, function(){
	// fired every time a screen "ready" event is published
});

document.addEventListener(Savvy.ENTER, function(){
	// fired every time a screen "enter" event is published
});

window.addEventListener(Savvy.EXIT, function(e){
	// fired every time a screen "exit" event is published
});