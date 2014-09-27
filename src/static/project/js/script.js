// Every time we ender a card, set the header title to the title of the card
application.addEventListener(Card.ENTER, function (event) {
    var title = application.header.querySelector("h1");
    title.innerHTML = application.currentCard.title;
});

// When the application starts (Application.READY) and everytime we exit 
// a card, set the correctly highlighted footer button
application.addEventListener(Application.READY, highlightFooterButton);
application.addEventListener(Card.EXIT, highlightFooterButton);

// sets the correctly highlighted footer button
function highlightFooterButton(event) {
    var buttons = application.footer.querySelectorAll("button");
    
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].removeAttribute("data-selected");
    }
    
    var button = [Home, Cordova].indexOf(event.detail.to);
    buttons[button].setAttribute("data-selected", "true");
}

// When the application starts, apply a basic swipe listener to
// open of close the off-canvas element
application.addEventListener(Application.READY, function (event) {
    var x, t;
    application.main.addEventListener("touchstart", function(e){
        if (e.changedTouches) {
            x = e.changedTouches[0].screenX;
            t = new Date().getTime();
        }
    });

    application.main.addEventListener("touchend", function(e){
        if (e.changedTouches) {
            var d = e.changedTouches[0].screenX - x;
            var e = (new Date().getTime()) - t;

            if (Math.abs(d) < 50) return;
            if (e > 300) return;
            if (d < 0) application.offCanvas(Transition.OFF_CANVASS_NONE);
            else application.offCanvas(Transition.OFF_CANVASS_LEFT);
        }
    });
});
