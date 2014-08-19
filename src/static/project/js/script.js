// when the application is ready, set up touch events
this.addEventListener(Application.READY, function(e) {
    var hammertime = new Hammer(application.main, {});
    hammertime.on("swipeleft", function(ev) {
        application.offCanvas("0px");
    });
    hammertime.on("swiperight", function(ev) {
        application.offCanvas(Transition.OFF_CANVASS_LEFT);
    });
});
