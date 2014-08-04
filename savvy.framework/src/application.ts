interface Document {
    cards:HTMLElement[];
    goto(path:string):void;
}

document.cards = [];
document["goto"] = (path:string, transition:ITransition = Transition.CUT):void => {
    if (typeof path == "string") {
        Savvy._goto.call(Savvy, path, transition);
    } else {
        throw "A string indicating a card ID must be passed to document.goto method.";
    }
}

module application {
    export var id:string = null;
    export var version:string = null;
    export var defaultPath = null;

	export function read(url:string, asXML:boolean = false):any {
		var xmlhttp:XMLHttpRequest = new XMLHttpRequest(); // create the XMLHttpRequest object
		xmlhttp.open("GET", url, false);
        xmlhttp.setRequestHeader("Cache-Control", "no-store"); // try not to cache the response
		xmlhttp.send();
		if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
			console.error("HTTP status "+xmlhttp.status+" returned for file: " + url);
			return null;
		}

        if (asXML) {
            return xmlhttp.responseXML;
        } else {
            return xmlhttp.responseText;
        }
	}
}
