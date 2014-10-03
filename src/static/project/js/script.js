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
