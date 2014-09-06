application.addEventListener(Application.READY, function (e) {
    var links = application.querySelectorAll("nav a");
    links[0].setAttribute("data-selected", "selected");
    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function () {
            for (var i = 0; i < links.length; i++) {
                links[i].removeAttribute("data-selected");
            }
            this.setAttribute("data-selected", "selected");
            application.offCanvas(Transition.OFF_CANVASS_NONE); 
        });
    }
});

application.addEventListener(Card.ENTER, function (e) {
    var h1 = application.header.querySelector("h1");
    h1.innerHTML = application.currentCard.title;
});
