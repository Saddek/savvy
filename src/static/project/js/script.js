application.addEventListener(Application.READY, highlightFooterButton);
application.addEventListener(Card.EXIT, highlightFooterButton);

function highlightFooterButton(event) {
    var buttons = application.footer.querySelectorAll("button");
    
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.color = null;
    }
    
    var button = [Home, Code].indexOf(event.detail.to);
    buttons[button].style.color = "#6CCAEC";
}
                             
application.addEventListener(Card.ENTER, function (event) {
    var title = application.header.querySelector("h1");
    title.innerHTML = application.currentCard.title;
});
