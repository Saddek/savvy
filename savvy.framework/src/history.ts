module Savvy.history {
    // the currently selected card in document.cards
    export var _currentCard:HTMLElement = null;
    export var _ignoreHashChange:boolean = false;
    window.addEventListener("hashchange", function () {
        if (_ignoreHashChange) {
            _ignoreHashChange = false;
        } else {
            var path:string = _getPathFromURLHash();
            var id:string = _getIdForPath(path);
            var card = document.getElementById(id);
            if (document.cards.indexOf(card)) {
                // don't load a route that doesn't exist
                Savvy._goto(path, Transition.CUT, true);
            }
        }
    }, false);

	export function _getPathFromURLHash():string {
		var hash:string = window.location.hash;
        var path;
        if(hash == "" || hash == "#" || hash == "#!" || hash == "#!/") {
            path = application.defaultPath;
        } else {
			path = hash.substr(3);
        }
        
        return path;
	}
    
    export function _getIdForPath(path:string):string {
        var i:number = path.indexOf("/");
        var id:string = (i > -1) ? path.substr(0, i) : path;
        return path;
    }

    
}