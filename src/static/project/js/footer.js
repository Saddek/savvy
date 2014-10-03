// When the application starts (Application.READY) and everytime we exit 
// a card, set the correctly highlighted footer button
application.addEventListener(Application.READY, highlightFooterButton);
application.addEventListener(Card.ENTER, highlightFooterButton);

// sets the correctly highlighted footer button
function highlightFooterButton(event) {
    application.footer.getElementById("card1-button").setAttribute("data-selected",
        application.currentCard == Card1);
    application.footer.getElementById("card2-button").setAttribute("data-selected",
        application.currentCard == Card2);
}
