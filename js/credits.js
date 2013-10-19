/**
 * @author Oliver Moran
 */

this.subscribe(Savvy.READY, function ready(){
    Savvy.getScreen().innerHTML = Handlebars.compile(Savvy.getScreen().innerHTML)(l10n.en);
});

this.subscribe(Savvy.ENTER, function(){
    // screen shown
});


this.subscribe(Savvy.EXIT, function(){
    // show loading screen?
});
