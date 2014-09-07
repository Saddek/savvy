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
    
    var button = [Home, Code].indexOf(event.detail.to);
    buttons[button].setAttribute("data-selected", "true");
}
                
// Every time we ender a card, set the header title to the title of the card
application.addEventListener(Card.ENTER, function (event) {
    var title = application.header.querySelector("h1");
    title.innerHTML = application.currentCard.title;
});
