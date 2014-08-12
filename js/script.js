// when the application loads, set up touch events
this.addEventListener(Application.LOAD, function(e) {
    var hammertime = new Hammer(application.main, {});
    hammertime.on("swipeleft", function(ev) {
        application.offCanvas("0px");
    });
    hammertime.on("swiperight", function(ev) {
        application.offCanvas(Transition.OFF_CANVASS_LEFT);
    });
});

// each time a card is ready, update the header nav button
this.addEventListener(Card.READY, function(e) {
    application.header.querySelector("#off-canvas").style.display =
        (e.detail.to == Home) ? "inline" : "none";
    application.header.querySelector("#back-arrow").style.display =
        (e.detail.to == License) ? "inline" : "none";
    
    application.header.querySelector("#title").innerHTML = e.detail.to.id;
});
