// Every time we ender a card, set the header title to the title of the card
application.addEventListener(Card.ENTER, function (event) {
    var title = application.header.querySelector("h1");
    title.innerHTML = application.currentCard.title;
});
