/**
 * @author Oliver Moran
 */

this.subscribe(Savvy.READY, function ready(){
	Savvy.getScreen().innerHTML = Handlebars.compile(Savvy.getScreen().innerHTML)(l10n.en);
});

var speeds = [0.005, 0.01, 0.02, 0.03];
updateMenu();

_screen.onAudioClick = onAudioClick;
_screen.onLivesClick = onLivesClick;
_screen.onSpeedClick = onSpeedClick;

function onAudioClick(){
	settings.audio = !settings.audio;
	amplify.store("settings", settings);
	updateMenu();
}

function onLivesClick(){
	settings.lives++;
	if (settings.lives > 9) settings.lives = 1;
	amplify.store("settings", settings);
	updateMenu();
}

function onSpeedClick(){
	for (var i=0; i<speeds.length; i++){
		if (settings.speed == speeds[i]) {
			settings.speed = speeds[i+1];
			if (settings.speed == undefined) settings.speed = speeds[0];
			break;
		}
	}
	if (i == speeds.length) settings.speed = speeds[0]; // something went wrong
	amplify.store("settings", settings);
	updateMenu();
}

function updateMenu(){
	$("#audio").text((settings.audio) ? l10n.en.on : l10n.en.off);
	$("#lives").text(settings.lives);
	$("#speed").text(speedString());
}

function speedString(){
	switch(settings.speed) {
		case speeds[0]:
			return l10n.en.easy;
			break;
		case speeds[1]:
			return l10n.en.hard;
			break;
		case speeds[2]:
			return l10n.en.very_hard;
			break;
		case speeds[3]:
			return l10n.en.insane;
			break;
		default:
			return "???";
	}
}