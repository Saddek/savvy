// when the application is ready, set up touch events
application.addEventListener(Application.READY, function(e) {
    var hammertime = new Hammer(application.main, {});
    hammertime.on("swipeleft", function(ev) {
        application.offCanvas("0px");
    });
    hammertime.on("swiperight", function(ev) {
        application.offCanvas(Transition.OFF_CANVASS_LEFT);
    });
    
    var links = application.querySelectorAll("nav a");
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function () {
            application.offCanvas("0px"); 
        });
    }
});
