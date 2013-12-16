/* This script will be available on every screen as a child of the window object (see data/app.xml). */

window.subscribe(Savvy.LOAD, function(){
	// fired once when Savvy loads first
});

window.subscribe(Savvy.READY, function(){
	// fired every time a screen "ready" event is published
});

window.subscribe(Savvy.ENTER, function(){
	// fired every time a screen "enter" event is published
});

window.subscribe(Savvy.EXIT, function(){
	// fired every time a screen "exit" event is published
});