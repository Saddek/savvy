/**
 * @author Oliver Moran
 */

this.subscribe(Savvy.READY, function ready(){
	Savvy.getScreen().innerHTML = Handlebars.compile(Savvy.getScreen().innerHTML)(l10n.en);
});

for (var i=0, hiscores = getHiScores(), ii=hiscores.length; i<ii; i++) {
	$("#scores").append('<li>'+hiscores[i]+"</li>");
}