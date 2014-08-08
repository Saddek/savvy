/* This script will be available on every screen as a child of the window object (see app.xml). */

window.addEventListener(Card.LOAD, function(event){
	// fired once when Savvy loads first
	document.querySelector("audio").play();		
});

window.addEventListener(Card.READY, function(event){
    /*
    if (event.detail.to == License) {
        event.detail.transition = Transition.COVER_LEFT_FADE;
    } else {
        event.detail.transition = Transition.COVER_LEFT_FADE.inverse;
    }
    */
});