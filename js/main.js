window.addEventListener(Card.READY, function(e) {
    console.log(application.header);
    application.header.querySelector("#off-canvas").style.display =
        (e.detail.to == Home) ? "inline" : "none";
    application.header.querySelector("#back-arrow").style.display =
        (e.detail.to == License) ? "inline" : "none";
    
    application.header.querySelector("#title").innerHTML = e.detail.to.id;
});

window.addEventListener(Card.LOAD, function(e) {
    var hammertime = new Hammer(application.main, {});
    hammertime.on('swipe', function(ev) {
        application.offCanvas();
    });
});