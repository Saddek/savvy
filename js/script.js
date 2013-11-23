/* This script will be available on every screen as a child of the window object (see data/app.xml). */

Savvy.subscribe(Savvy.LOAD, function(){
	// fired once when Savvy loads first
});

Savvy.subscribe(Savvy.READY, function(){
	// fired every time a screen "ready" event is published
});

Savvy.subscribe(Savvy.ENTER, function(){
	// fired every time a screen "enter" event is published
});

Savvy.subscribe(Savvy.EXIT, function(){
	// fired every time a screen "exit" event is published
});