/* This script will be available on every screen as a child of the window object (see app.xml). */

window.addEventListener(Savvy.LOAD, function(event){
	// fired once when Savvy loads first
	document.querySelector("audio").play();		
});

window.addEventListener(Savvy.READY, function(event){
    if (event.detail.to == License) {
        event.setTransition(Savvy.COVER_RIGHT);
    } else {
        event.setTransition(Savvy.UNCOVER_RIGHT);
    }
});