/**
 * @author Oliver Moran
 */

var settings = amplify.store("settings") || {audio: true, lives:3, speed:0.01};

function getHiScores(){
	return amplify.store("hiscores") || [20000, 10000, 5000, 2500, 1000];
}

function updateHiScores(score){
	hiscores = getHiScores();
	for (var i=0; i<hiscores.length; i++) {
		if (score > hiscores[i]) {
			hiscores.splice(i,0,score);
			hiscores.pop();
			break;
		}
	}
	amplify.store("hiscores", hiscores);
}