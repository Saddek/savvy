interface Document {
    screen:HTMLElement;
    goto(path:string):void;
    continue:Function;
}

document.screen = null;

/**
 * The main Savvy object
 */
module Savvy {

    /**
     * The Screen interface: used to describe screens (id, title, html, etc.)
     */
	interface Screen {
	    id:string;
	    title:string;
        html:HTMLElement;
	}

    /**
     * The Route interface: used to store the route data (path and screen data) being called
     */
	interface Route {
		screen:Screen;
		path:string;
	}

    /**
     * The ExecutionContext: this is the object that will be populated and executed each screen's JavaScript
     */
	function extendHTMLElementAsExecutionContext(element:HTMLElement) {
        // FIXME: is this needed?
    }

    // an array of screens in the app
	var model:Screen[] = [];
    // the default screen for the app (this will reference one in the array)
    var defaultScreen:Screen = null;

	// define all regexes one in a static variable to save computation time
	var regex = {
		isRemoteUrl: new RegExp("(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?", "i"),
		css: {
            // used to find instances of url references in css files that need to be modified
            // FIXME: gives a false positive for data URIs
			singleQuotes: /url\('(?!https?:\/\/)(?!\/)/gi,
        	doubleQuotes: /url\("(?!https?:\/\/)(?!\/)/gi,
        	noQuotes: /url\((?!https?:\/\/)(?!['"]\/?)/gi,
            selector: /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/gi
		},
        include: /^#include "(.*)"$/gm
	}

    // a blank function (defined here once to save memory and time)
	var noop:Function = ():void => {};

    /**
     * Loads a screen in the app corresponding to id
     * @param path A path to a new screen. This must be a screen ID or a string beginning with a screen ID followed by a slash. Further characters may follow the slash.
     */
    document["goto"] = (path:string):void => {
        goto2.call(Savvy, path);
    }

    /**
     * The function called by document.goto
     * @param path A path to a new screen. This must be a screen ID or a string beginning with a screen ID followed by a slash. Further characters may follow the slash.
     */
    function goto2(path:string):void {
        try {
            // normalise
            path = path.toString();
        } catch (err) {
            throw new Error("A string indicating a screen ID must be passed to document.goto method.");
            return;
        }

        var id = path;
        if (id.indexOf("/") != -1) {
            id = id.substring(0, id.indexOf("/"));
        }
        var screen:Screen = getScreenWithID(id);

        if (screen == null) {
            throw new Error("No screen with ID of \"" + id + "\".");
        } else {
            load.call(Savvy, {screen: screen, path: "/" + path}, false);
        }
	}
    
    /*
     * Searches the model for a screen of a particular ID
     * @param id A String ID for a screen
     * @returns {Screen} the Screen for the given ID or null
     */
    function getScreenWithID(id:string):Screen {
        // loop through screens matching hash
        for (var i=0, ii=model.length; i<ii; i++) {
            if (model[i].id == id) {
                return model[i];
            }
        }
        return null;
    }

    // these are Strings so that they can be compared exactly agaisnt themselves (i.e. "ready" !== new String("ready"))
    export var READY:string = "savvy-ready";
    export var ENTER:string = "savvy-enter";
    export var EXIT:string = "savvy-exit";
    export var LOAD:string = "savvy-load";    
    /**
     * A JXONNode class, used as a container object when parsing XML to a JavaScript object.
     */
    class JXONNode {
        private _value:any;
        constructor(val?:any) {
            this._value = (val === undefined) ? null : val;
        }
        setValue(val:any):void {
            this._value = val;
        }
        valueOf():any {
            return this._value;
        }
        toString():any {
            return (this._value === null) ? "null" : this._value.toString();
        }
    }

    var xmlData:any = getJXONTree(readFile("data/app.xml", true));
    if (xmlData.app === undefined) {
        throw new Error("Could not parse app.xml. \"app\" node missing.");
    } else {
        // first assume window.load
        var event:string = "load";
        var element:any = window;
        if (xmlData.app["@cordova"] == "yes") {
            // then modify to document.deviceready
            event = "deviceready";
            element = document;

            // add the Cordova scritps (assume these are in the root directory)
            var cordova_lib:HTMLElement = document.createElement("script");
            cordova_lib.setAttribute("src", "cordova.js");
            cordova_lib.setAttribute("type", "text/javascript");

            var cordova_plugins:HTMLElement = document.createElement("script");
            cordova_plugins.setAttribute("src", "cordova_plugins.js");
            cordova_plugins.setAttribute("type", "text/javascript");

            document.head.appendChild(cordova_lib);
            document.head.appendChild(cordova_plugins);
        }

        // ordinarily, Savvy will be initialised when the DOM is ready
        element.addEventListener(event, function deviceReadyEvent():void {
            element.removeEventListener(event, deviceReadyEvent);
            
            parseAppXML(xmlData.app);
    
            load.call(Savvy, getRouteFromURLHash(), true);
        }, false);
    }

    var ignoreHashChange:boolean = false;
    window.addEventListener("hashchange", function () {
        if (ignoreHashChange) {
            ignoreHashChange = false;
        } else {
            var route:Route = getRouteFromURLHash();
            if (typeof route.screen == "object") {
                // don't load a route that doesn't exist
                load.call(Savvy, route, true);
            }
        }
    }, false);

    // a flag to say this is the first load (signal to fire Savvy.LOAD)
    var isFirstLoad:Boolean = true;

    /**
     * This function does the heavy lifting it loads the HTML, CSS and JS for a given route
     * @param route A route object, containing the path and data of the screen data
     * @param preventHistory A Boolean (optional), if false the hash element of the URL will not be updated
     * @private
     */
	function load(route:Route, preventHistory:boolean):void {
        /* FIXME: this needs to be thought through more. There are cases when a screen will be loaded upon itself (e.g. if the REST path changes).
        if (route.path == Savvy.getInfo().path) {
            if (preventHistory) {
                console.info("Request to load current URI over itself. This is usually caused by navigating back from an fragment. Ignoring.");
            } else {
                console.warn("Attempt to load current URI as new screen. This is unsupported behavior. Ignoring.");
            }
            return;
        }
        */

        var event:CustomEvent = <CustomEvent> document.createEvent("CustomEvent"); // we might fire Savvy.LOAD or Savvy.EXIT here, this var will contain the result
        if (isFirstLoad) {
            event.initCustomEvent(Savvy.LOAD, true, true, {});
            isFirstLoad = false;
        } else {
            event.initCustomEvent(Savvy.EXIT, true, true, {});
        }
        (document.screen || document.body).dispatchEvent(event);

        if (event.defaultPrevented) { // check if that transition wasn't stalled
            continueTransition = prepareTransition;
        } else {
            prepareTransition.call(Savvy); // NB: make sure 'this' is Savvy
        }

        function prepareTransition() {
            document.screen = route.screen.html;
            
            this.getInfo = () => {
                return getInfo2(route); // update getInfo to get current screen info
            }

            var event:CustomEvent = <CustomEvent> document.createEvent("CustomEvent");
            event.initCustomEvent(Savvy.READY, true, true, {});
            route.screen.html.dispatchEvent(event);
            
            if (event.defaultPrevented) { // check if that transition wasn't stalled
                continueTransition = doTransition;
            } else {
                doTransition.call(Savvy); // NB: make sure 'this' is Savvy
            }
        }

        function doTransition():void {
            continueTransition = noop;

            // hide all screens, except the one to be nagivated to (just in case it's already visible)
            var screens:NodeList = document.querySelectorAll("body > object[type='application/x-savvy']");
            for (var i=0; i<screens.length; i++) {
                var el:HTMLElement = <HTMLElement> screens[i];
                if (el == route.screen.html) continue;
                el.removeAttribute("data-display");
            }
            
            route.screen.html.setAttribute("data-display", "visible");
           
            document.title = (route.screen.title || "");
            if(!preventHistory) {
                ignoreHashChange = true;
                window.location.hash = "!" + route.path;
            }

            var event:CustomEvent = <CustomEvent> document.createEvent("CustomEvent");
            event.initCustomEvent(Savvy.ENTER, true, true, {});
            route.screen.html.dispatchEvent(event);
        }
	}

    /**
     * This function can be called to recommence the transition after it was caused
     * @type {Function}
     */
    var continueTransition:Function = ():void => {};
    
    // expose API to allow continuation (NB: a simple reference to continueTransition doesn't work)
    document["continue"] = function(){
        continueTransition.call(Savvy);
    }

    /**
     * Creates a Route object for the current URL
     * @returns {{screen: Screen, path: string}}
     */
	function getRouteFromURLHash():Route {
		var hash:string = window.location.hash;
		var screen:Screen;
        if(hash == "" || hash == "#" || hash == "#!" || hash == "#!/") {
            screen = defaultScreen;
        } else {
			// loop through screens matching hash
			for (var i=0, ii=model.length; i<ii; i++) {
				if ((new RegExp("#!/"+model[i].id+"(?=\/|$)")).test(hash)) {
					screen = model[i];
					break;
				}
			}
        }

		var path:string = "";
		var i:number = hash.indexOf("/");
		if (i == -1) {
			path = "/";
		} else {
			path = hash.substr(i)
		}

		return {screen: screen, path: path};
	}

    export function getInfo():any{
        return getInfo2();
    }

    function getInfo2(route:Route = getRouteFromURLHash()) {
        return {
            id: route.screen.id,
            title: route.screen.title,
            isDefault:  defaultScreen == route.screen,
            path: route.path
        }
    }

    /**
     * Parses the app XML creating the screen model and executing global HTML, CSS, JS, etc.
     * @param app
     */
    function parseAppXML(app:any):void {
    	preloadImages(guaranteeArray(app.img));

        // NB: Do before HTML so that HTML lands formatted
		guaranteeArray(app.css).forEach((url:string, index:number, array:string[]):void => {
			appendCssToHeadFromUrl(url);
		});

		guaranteeArray(app.html).forEach((url:string, index:number, array:string[]):void => {
            document.body.insertAdjacentHTML("beforeend", readFile(url));
		});

        // NB: Do before JS so that data models are available to JS
        guaranteeArray(app.json).forEach((element:any, index:number, array:any[]):void => {
            var target = element["@target"];
            if (typeof target == "string") {
                parseJSONToTarget(element, target);
            } else {
                throw new Error("No target attribute provided for JSON (\"" + element + "\")");
            }
        });

        guaranteeArray(app.js).forEach((url:string, index:number, array:string[]):void => {
			executeJavaScript(url);
		});
        
        createModel(guaranteeArray(app.screens.screen));
        
        delete Savvy._eval; // no longer needed
    }

    /**
     * Attempts to appends a given CSS to the head of the HTML document.
     * On some browsers (e.g. MSIE8) the CSS has to be linked from the head. And in the cases of external CSS URLs,
     * it needs to be linked from the head. Otherwise, we prefer adding the CSS to the head.
     * @param url The URL of the CSS file
     * @param isScreenCSS A Boolean indicating that this CSS relates to the current screeen (optional)
     */
    function appendCssToHeadFromUrl(url:string, forId?:string):void {
        var doLink:Boolean = (regex.isRemoteUrl.test(url) || window.navigator.appVersion.indexOf("MSIE 8") != -1);
        if (doLink && forId) {
            throw new Error("Screen styles sheets cannot be remote (e.g. http://www.examples.com/style.css). Please include remote style sheets globally.");
        }
        var node:HTMLElement;
        if (doLink) {
            node = document.createElement("link");
            node.setAttribute("rel", "stylesheet");
            node.setAttribute("type", "text/css");
            node.setAttribute("href", url);
        } else {
            node = document.createElement("style");
            node.setAttribute("type", "text/css");
        }
        if (forId) {
            node.setAttribute("data-for", forId);
        }
        try {
            if(!doLink) {
                var content:string = readFile(url);
                if (forId) {
                    content = content.replace(regex.css.selector, "body > object[data=\""+forId+"\"] $1$2");
                }
                var i:number = url.toString().lastIndexOf("/");
                if(i != -1) {
                    var dir:string = url.toString().substr(0, i + 1);
                    content = content.replace(regex.css.noQuotes,
                              "url(" + dir).replace(regex.css.doubleQuotes,
                              "url(\"" + dir).replace(regex.css.singleQuotes,
                              "url('" + dir);
                }
                node.appendChild(document.createTextNode(content));
            }
            document.getElementsByTagName("head")[0].appendChild(node);
        } catch(err) {
	    	throw new Error("Error appending CSS file (" + url + "): " + err.toString());
        }
    }
    
    /**
     * Loads a JavaScript file and executes it in a given context, otherwise with the window object
     * @param url The URL of the JavaScript to execute
     * @param context The context in which to execute the JavaScript
     */
    function executeJavaScript(url:string, context?:any):void {
    	var code:string = parseScriptFile(url);
        try  {
            Savvy._eval(code, context);
        } catch (err) {
	    	throw new Error(err.toString() + " (" + url + ")");
    	}
    }

    /**
     * A recursive method that parses a script file and honors #include directives.
     * @param file a File to parse
     * @returns a String of the parse source code
     */
    function parseScriptFile(url):string {
        var src = readFile(url);

        var code = src.replace(regex.include, function(match:string, p1:string):string {
            var dir = getDirectoryFromFilePath(url);
            var url2 = resolvePath(dir + p1);
            var str:string = parseScriptFile(url2);
            return str;
        });

        return code;
    }

    /**
     * Returns the directory path from a file path (i.e. path to the containing directory)
     * @param path a String path to a file
     * @returns a String path to the containing directory
     */
    function getDirectoryFromFilePath(path:string):string {
        var i:number = path.toString().lastIndexOf("/");
        return path.toString().substr(0, i + 1);
    }

    /*
     * Resolves a complicated path (e.g. one containing .. and .) to a simple path
     * http://stackoverflow.com/questions/17967705/how-to-use-javascript-regexp-to-resolve-relative-paths
     * @params path a String path
     * @returns a String path, which is functionally identical but simplified
     */
    function resolvePath(path:string):string {
        var parts:string[] = path.split('/');
        var i:number = 1;
        while (i < parts.length) {
            // safeguard, may never happen
            if (i < 0) continue;
            
            // if current part is '..' and previous part is different, remove both
            if (parts[i] == ".." && parts[i-1] !== '..' && i > 0) {
                parts.splice(i-1, 2);
                i -= 2;
            }

            // if current part is '.' or '' simply remove it
            if (parts[i] === '.' || parts[i] == '') {
                parts.splice(i, 1);
                i -= 1;
            }

            i++
        }
        return parts.join('/');
    }


    /**
     * Parses a JSON file to a variable.
     * @param url The URL of the JSON file to load.
     * @param target The name of the variable to set with the data from the JSON file
     * @param context The object within which target should exist (defaults to window)
     */
    function parseJSONToTarget(url:string, target:string, context:any = window):void {
        var data:any;
        try {
            var src:any = readFile(url); // prevent caching always with JSON (presume it is an API)
            data = JSON.parse(src);
        } catch (err) {
            console.error("Cannot parse data file (\"" + url + "\"). Please check that the file is valid JSON <http://json.org/>.");
            return;
        }
        
        try {
            createObjectFromString(target, data, context);
        } catch(err) {
            console.error("Could not create object: " + ((context == window) ? "window." : "this.") + target);
            return;
        }
    }
    
    /**
     * Finds or attempts to create an object given an ancestor object and a path to a descendant
     * @param target a String path to the descendant object (e.g. child.obj)
     * @param context an Object to act as the ancestor (defaults to window)
     * @return the child object or null if it could not be created
     */
    function createObjectFromString(target:string, data:any, context:any = window):any {
        var arr:string[] = target.split(".");
        
        for (var i:number=0; i<arr.length - 1; i++) {
            var id = arr[i];
            if (typeof context[id] == "undefined") {
                context[id] = {};
            }
            context = context[id];
        }

        context = context[arr[i]] = data;

        return context;
    }

    /**
     * Preloads an array of images to the browser cache.
     * @param images An array of URLs to load.
     */
    var imgCache:HTMLImageElement[] = [];
	function preloadImages(images:string[]):void {
        for(var i = 0, ii = images.length; i < ii; i++) {
            var img = new Image();
            img.src = images[i];
            imgCache.push(img); // to keep in memory
        }
    }

    /**
     * Creates a model of the screens described in the app.xml. Populates the model array with Screen objects.
     * @param screens An array subset of a JXON object describing the screens Array in app.xml.
     */
    function createModel(screens:any):void {
        for(var i = 0, ii = screens.length; i < ii; i++) {
            // NB: this isn't added to the body until ready to be shown
            var htmlObject = document.createElement("object");
            htmlObject.setAttribute("data", screens[i]["@id"]);
            htmlObject.setAttribute("type", "application/x-savvy");

            extendHTMLElementAsExecutionContext(htmlObject);
            
            var screen:Screen = {
	            id: screens[i]["@id"],
	            title: screens[i]["@title"],
	            html:htmlObject,
                scroll: {
                    top: 0,
                    left: 0
                }
        	};

            window[screen.id] = screen.html;

            guaranteeArray(screens[i].css).forEach((url:string, index:number, array:Screen[]):void => {
                appendCssToHeadFromUrl(url, screen.id);
            });

			guaranteeArray(screens[i].html).forEach((url:string, index:number, array:Screen[]):void => {
                screen.html.insertAdjacentHTML("beforeend", readFile(url));
			});
            document.body.appendChild(screen.html);

            guaranteeArray(screens[i].json).forEach((element:any, index:number, array:Screen[]):void => {
                var target = element["@target"];
                if (typeof target == "string") {
                    var target = element.target;
                    parseJSONToTarget(element, target, screen.html);
                } else {
                    console.error("No target attribute provided for JSON (\"" + element + "\")");
                }
            });

            guaranteeArray(screens[i].js).forEach((url:string, index:number, array:Screen[]):void => {
                executeJavaScript(url, screen.html);
            });

            if (screens[i]['@default'] !== undefined) {
                if (defaultScreen === null) {
                    defaultScreen = screen;
                } else {
                    console.warn("More than one screen is set as the default in app.xml. Ignoring.");
                }
            }

            model.push(screen);
    	}

        if (defaultScreen === null) {
            throw new Error("No default screen set.");
        }
	}

    /**
     * Accepts an object of any kind. If the object is an array it returns an identical object. If the object is not
     * an array, it makes a new Array containing that object. If the object is falsey, it returns an empty array.
     * @param arr The object to guarantee an array from.
     * @returns {Array}
     */
	function guaranteeArray(arr:any):any {
		return [].concat(arr || []);
	}

    /**
     * Reads the file at URL and returns a File object for it.
     * @param url The URL to read.
     * @param asXML A Boolean indicating that the file should be read as an XML document.
     * @returns {*} A String or XML object containing the URL and data of the file.
     */
	function readFile(url:string, asXML:boolean = false):any {
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

	/**
	 * JXON Snippet #3 - Mozilla Developer Network
	 * https://developer.mozilla.org/en-US/docs/JXON
	 */
	function getJXONTree(oXMLParent:any):JXONNode {
		var vResult:any = new JXONNode();
		var nLength:number = 0;
		var sCollectedTxt:string = "";
		
		if (oXMLParent.attributes && oXMLParent.attributes.length > 0) { // oXMLParent.hasAttributes()
			for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
				var oAttrib = oXMLParent.attributes.item(nLength);
				vResult["@" + oAttrib.name.toLowerCase()] = parseText(oAttrib.value.trim());
			}
		}
		if (oXMLParent.childNodes && oXMLParent.childNodes.length > 0) { // oXMLParent.hasChildNodes()
			for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
				oNode = oXMLParent.childNodes.item(nItem);
				if (oNode.nodeType === 4) { sCollectedTxt += oNode.nodeValue; } /* nodeType is "CDATASection" (4) */
				else if (oNode.nodeType === 3) { sCollectedTxt += oNode.nodeValue.trim(); } /* nodeType is "Text" (3) */
				else if (oNode.nodeType === 1 && !oNode.prefix) { /* nodeType is "Element" (1) */
					if (nLength === 0) { vResult = new Object(); }
					sProp = oNode.nodeName.toLowerCase();
					vContent = getJXONTree(oNode);
					if (vResult.hasOwnProperty(sProp)) {
						if (vResult[sProp].constructor !== Array) { vResult[sProp] = [vResult[sProp]]; }
						vResult[sProp].push(vContent);
					} else { vResult[sProp] = vContent; nLength++; }
				}
			}
		}
		if (vResult.constructor === JXONNode) {
			vResult.setValue(parseText(sCollectedTxt));
		}
		/* if (nLength > 0) { Object.freeze(vResult); } */
		return vResult;
		
		function parseText(sValue):any {
			if (/^\s*$/.test(sValue)) { return null; }
			if (/^(?:true|false)$/i.test(sValue)) { return sValue.toLowerCase() === "true"; }
			if (isFinite(sValue)) { return parseFloat(sValue); }
			/* if (isFinite(Date.parse(sValue))) { return new Date(sValue); } */ // produces false positives
			return sValue;
		}
	}

}

// Evaling scripts in the main Savvy block captures internal Savvy
// methods and properties in the closure. Scripts are evaluated in
// their own block in order to provide a "clean" closure
module Savvy {
    export function _eval(code:string, context?:any):void {
        if (context === undefined) {
            (window.execScript || function (code:string):void {
                window["eval"].call(window, code);
            })(code);
        } else {
            (function(code){
                eval(code);
            }).call(context, code);
        }
    }
}