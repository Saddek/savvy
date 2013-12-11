// Savvy extends the JavaScript window with a "_screen" object that
// refers to the current screen's execution context
interface Window {
	_screen: any;
}

interface Document {
    getScreen():any
}

window._screen = {};

/**
 * The main Savvy object
 */
module Savvy {

    /**
     * Implement JavaScript's EventListener in TypeScript (appears to be missing from implementation)
     */
    interface EventListener {
        type:string;
        listener:Function;
        useCapture:Boolean;
    }


    /**
     * The File interface: used to describe files (url, data)
     */
    interface File {
        url:string;
        data:any;
    }
    
    interface JSON {
        url:string;
        target:string;
    }

    /**
     * The Screen interface: used to describe screens (id, title, html, etc.)
     */
	interface Screen {
	    id:string;
	    title:string;
	    html:string[];
        css:string[];
	    js:string[];
        json:JSON[];
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
	class ExecutionContext {
		constructor() {
			window._screen = this;
		}
        subscribe(type:string, action:() => boolean):void {
            Savvy.subscribe(type, action, this);
        }
        unsubscribe(type:string, action:() => boolean):void {
            Savvy.unsubscribe(type, action);
        }
    }

    /**
     * The Cache: this object will be a cache of files (html, js, css, xml, etc.)
     */
    class Cache {
        public static YES = "yes"; // screen files are pre-cached
        public static AUTO:string = "auto"; // screen files are cached on first load
        public static NEVER:string = "never"; // screen fiels are never cached
        rule:string;
    	private _files:File[];
    	constructor(rule:string = Cache.AUTO){
    		this.rule = rule;
	    	this._files = [];
    	}

	    add(file:File):File {
            if (this.rule != Cache.NEVER && this.get(file.url).data == null) {
                this._files.push(file);
                return file;
            }
	    }

		get(url:string):File {
			for (var i=0, ii=this._files.length; i<ii; i++) {
				if (this._files[i].url === url) {
					return this._files[i];
				}
			}

			return {url:url, data:null};
		}	    
    }

    // an array of screens in the app
	var model:Screen[] = [];
    // the default screen for the app (this will reference one in the array)
    var defaultScreen:Screen = null;
    // a cache of files used by the app (html, css, js, etc.)
	var cache:Cache = new Cache();

	// define all regexes one in a static variable to save computation time
	var regExpressions:any = {
		isRemoteUrl: new RegExp("(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?", "i"),
		css: { // used to find instances of url references in css files that need to be modified
			singleQuotes: /url\('(?!https?:\/\/)(?!\/)/gi,
        	doubleQuotes: /url\("(?!https?:\/\/)(?!\/)/gi,
        	noQuotes: /url\((?!https?:\/\/)(?!['"]\/?)/gi
		},
        isJSIdentifier: /^[$A-Z_][0-9A-Z_$]*$/i,
        includeStatement: /^#include "(.*)"$/gm
	}

    // a blank function (defined here once to save memory and time)
	var noop:Function = ():void => {};

    /**
     * Loads a screen in the app corresponding to id
     * @param path A path to a new screen. This must be a screen ID or a string beginning with a screen ID followed by a slash. Further characters may follow the slash.
     */
	export function go(path:string = null):void {
        if (path == null) {
            continueTransition();
            return;
        } else {
            var id = path.toString();
            if (id.indexOf("/") != -1) {
                id = id.substring(0, id.indexOf("/"));
            }
            var screen:Screen = null;

            // loop through screens matching hash
            for (var i=0, ii=model.length; i<ii; i++) {
                if (model[i].id == id) {
                    screen = model[i];
                    break;
                }
            }
            if (screen == null) {
                console.error("No screen with ID of \"" + id + "\".");
            } else {
                load({screen: screen, path: "/" + path});
            }
        }
	}

    /**
     * Gets the current "screen" DOM element (a DIV)
     * @returns {HTMLElement} The "screen" DOM element (a DIV)
     */
    function getScreen():any { // should be HTMLElement
        return (document.querySelector("section[data-role='buffer']") || document.querySelector("section[data-role='screen']"));
    }
    
    document.getScreen = getScreen;

    /**
     * Implements a basic subscription service:
     * Used in Savvy.subscribe() and Savvy.unsubscribe()
     */
	class Subscription {
		type:string;
		action:() => boolean;
        screen:any;
		constructor (type:string, action:() => boolean, screen:any = window){
			this.type = type;
			this.action = action;
            this.screen = screen;
		}
	}

    // An array of subscriptions
	var subscriptions:Subscription[] = [];

    /**
     * Enables an application to subscribe to Savvy events
     * @param type A String corresponding to the messages to be subscribed to
     * @param action A function to be called when the message occurs, return false to block the event
     * @param screen A screen object to associate the subscription with (usually left to default)
     */
	export function subscribe(type:string, action:() => boolean, screen:any = window):void {
        unsubscribe(type, action); // attempt to unsubscribe, so as to ensure that functions don't get called twice
		var sub = new Subscription(type, action, screen);
		subscriptions.push(sub);
	}

    /**
     * Enables an application to unsubscribe from Savvy events
     * @param type A String corresponding to the message to be unsubscibed from
     * @param action The function that is called when the subscription is called
     */
	export function unsubscribe(type:string, action:() => boolean):void {
        for (var i:number = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].type === type && subscriptions[i].action === action) {
                subscriptions.splice(i, 1);
                i--;
            }
        }
	}

    /**
     * Removes all subscriptions associated with a given screen
     * @param screen The screen to which the subscriptions to be removed belong
     */
    function unsubscribe2(screen:any):void {
        for (var i:number = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].screen === screen) {
                subscriptions.splice(i, 1);
                i--;
            }
        }
    }

    /**
     * Calls the associated function of all subscriptions for a given String
     * @param type A String corresponding to the subscription
     * @param arg An object of any kind that will be passed to subscribing functions
     * @returns {boolean} Will be false if any of the subscription functions returned false
     */
	function publish(type:string, arg:any = null):boolean {
		var ret:boolean = true;
		subscriptions.forEach((element:Subscription, index:number, array:Subscription[]):void => {
			if (element.type === type && typeof element.action === "function") {
				ret = !(element.action.call(element.screen, arg) === false || ret === false);
			}
		});
		return ret;
	}

    export var READY:string = "ready";
    export var ENTER:string = "enter";
    export var EXIT:string = "exit";
    export var LOAD:string = "load";

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

    var xmlData:any = getJXONTree(getFileFromUrl("data/app.xml", true).data);
    if (xmlData.app === undefined) {
        console.error("Could not parse app.xml. \"app\" node missing.");
    } else {
        var event:string = (xmlData.app["@cordova"] == "yes") ? "deviceready" : "load";
        if (xmlData.app["@cordova"] == "yes") {
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
        window.addEventListener(event, function deviceReadyEvent():void {
            window.removeEventListener(event, deviceReadyEvent);
            
            cache.rule = (xmlData.app.cache === undefined) ? Cache.AUTO : xmlData.app.cache;
            parseAppXML(xmlData.app);
    
            load(getRoute(), true);
        }, false);
    }

    var ignoreHashChange:boolean = false;
    window.addEventListener("hashchange", function () {
        if (ignoreHashChange) {
            ignoreHashChange = false;
        } else {
            var route:Route = getRoute();
            if (typeof route.screen == "object") {
                // don't load a route that doesn't exist
                load(route, true);
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
	function load(route:Route, preventHistory:Boolean = false):void {
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

        var resp; // we might fire Savvy.LOAD or Savvy.EXIT here, this var will contain the result
        if (isFirstLoad) {
            resp = publish(Savvy.LOAD);
            isFirstLoad = false;
        } else {
            resp = publish(Savvy.EXIT);
        }

        if (resp) { // check if that transition wasn't stalled
            prepareTransition();
        } else {
            continueTransition = prepareTransition;
        }

        function prepareTransition() {

            // kill all previous screen's JavaScript
            for(var i = 0, ii = model.length; i < ii; i++) {
                try  {
                    delete window[model[i].id];
                } catch (err) {
                    window[model[i].id] = null;
                }
            }

            unsubscribe2(window._screen); // remove all subscriptions from this screen
            window._screen = {}; // and wipe out window._sreen

            createHTMLSectionElement("buffer");
            document.getScreen().style.display = "none";

            // NB: set up HTML before JS executes so HTML DOM is accessible
            guaranteeArray(route.screen.html).forEach((url:string, index:number, array:Array):void => {
                document.getScreen().insertAdjacentHTML("beforeend", readFile(url).data);
            });

            var executionContext:ExecutionContext = window[route.screen.id] = new ExecutionContext();
            if (typeof window[route.screen.id] === "undefined") {
                console.error("\"window." + route.screen.id + "\" could not be created.");
            }
            
            // NB: set up JSON before JS executes so JSON objects are already populated
            guaranteeArray(route.screen.json).forEach((element:JSON, index:number, array:Array):void => {
                var target = element.target;
                parseJSON(element.url, target, executionContext);
            });
            
            guaranteeArray(route.screen.js).forEach((url:string, index:number, array:Array):void => {
                executeJavaScript(url, executionContext);
            });

            this.getInfo = () => {
                return getInfo2(route); // update getInfo to get current screen info
            }
            if (publish(Savvy.READY)) { // check if that transition wasn't stalled
                doTransition();
            } else {
                continueTransition = doTransition;
            }
        }

        function doTransition():void {
            continueTransition = noop;
            removeDOMNode(document.querySelector("section[data-role='screen']"));

            // remove old CSS and add new CSS
            // NB: Old CSS is removed first because developers tend to write conflicting CSS selectors
            var links:NodeList = document.querySelectorAll("style[data-for='screen']");
            for (var i = 0; i < links.length; i++) {
                removeDOMNode(links[i]);
            }

            // when using Savvy
            guaranteeArray(route.screen.css).forEach((url:string, index:number, array:Array):void => {
                appendCssToHead(url, true);
            });

            document.getScreen().setAttribute("data-role", "screen");
            document.getScreen().style.display = "block";

            document.title = (route.screen.title || "");
            if(!preventHistory) {
                ignoreHashChange = true;
                window.location.hash = "!" + route.path;
            }

            publish(Savvy.ENTER);
        }
	}

    /**
     * This function can be called to recommence the transition after it was caused
     * @type {Function}
     */
    var continueTransition:Function = ():void => {};

    /**
     * Creates a Route object for the current URL
     * @returns {{screen: Screen, path: string}}
     */
	function getRoute():Route {
		var hash:string = window.location.hash;
		var screen:Screen;
        if(hash == "" || hash == "#" || hash == "#!") {
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

    function getInfo2(route:Route = getRoute()) {
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

    	createModel(guaranteeArray(app.screens.screen));

        // NB: Do before HTML so that HTML lands formatted
		guaranteeArray(app.css).forEach((url:string, index:number, array:Array):void => {
			appendCssToHead(url);
		});

		guaranteeArray(app.html).forEach((url:string, index:number, array:Array):void => {
            document.body.insertAdjacentHTML("beforeend", readFile(url).data);
		});

        // NB: Do before JS so that data models are available to JS
        guaranteeArray(app.json).forEach((element:any, index:number, array:Array):void => {
            var target = element["@target"];
            if (typeof target == "string") {
                parseJSON(element, target);
            } else {
                console.error("No target attribute provided for JSON (\"" + element + "\")");
            }
        });

        guaranteeArray(app.js).forEach((url:string, index:number, array:Array):void => {
			executeJavaScript(url);
		});
    }

    /**
     * Attempts to appends a given CSS to the head of the HTML document.
     * On some browsers (e.g. MSIE8) the CSS has to be linked from the head. And in the cases of external CSS URLs,
     * it needs to be linked from the head. Otherwise, we prefer adding the CSS to the head.
     * @param url The URL of the CSS file
     * @param id The ID to give to the CSS link (otherwise one will be auto generated)
     */
    function appendCssToHead(url:string, isScreenCSS:boolean = false):void {
        var doLink:Boolean = (regExpressions.isRemoteUrl.test(url) || window.navigator.appVersion.indexOf("MSIE 8") != -1);
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
        if (isScreenCSS) {
            node.setAttribute("data-for", "screen");
        }
        try {
            if(!doLink) {
                var content:string = readFile(url).data;
                var i:number = url.toString().lastIndexOf("/");
                if(i != -1) {
                    var dir:string = url.toString().substr(0, i + 1);
                    content = content.replace(regExpressions.css.noQuotes,
                              "url(" + dir).replace(regExpressions.css.doubleQuotes,
                              "url(\"" + dir).replace(regExpressions.css.singleQuotes,
                              "url('" + dir);
                }
                node.appendChild(document.createTextNode(content));
            }
            document.getElementsByTagName("head")[0].appendChild(node);
        } catch(err) {
	    	console.error("Error appending CSS file (" + url + "): " + err.toString());
        }
    }

    /**
     * Loads a JavaScript file and executes it in a given ExecutionContext, otherwise with the window object
     * @param url The URL of the JavaScript to execute
     * @param context The context in which to execute the JavaScript
     */
    function executeJavaScript(url:string, context?:ExecutionContext):void {
    	var code:string = parseScriptFile(readFile(url));
        try  {
            Savvy._eval(code, context);
        } catch (err) {
	    	console.error(err.toString() + "(" + url + ")");
    	}
    }

    /**
     * A recursive method that parses a script file and honors #include directives.
     * @param file a File to parse
     * @returns a String of the parse source code
     */
    function parseScriptFile(file:File):string {
        if (typeof file.data != "string") {
            console.error("Could not parse \"" + file.url + "\". Script files must be plain text.");
            return "";
        }

        var code = file.data.replace(regExpressions.includeStatement, function(match:string, p1:string):string {
            var dir = getDirectoryFromFilePath(file.url);
            var path = resolvePath(dir + p1);
            var str:string = parseScriptFile(readFile(path));
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
    function parseJSON(url:string, target:string, context:any = window):void {
        var data:any;
        try {
            var src:any = readFile(url, true).data; // prevent caching always with JSON (presume it is an API)
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
	function preloadImages(images:string[]):void {
        for(var i = 0, ii = images.length; i < ii; i++) {
            var img = new Image();
            img.src = images[i];
            cache.add({url:img.src, data:img}); // will be rejected if rule is NEVER
        }
    }

    /**
     * Creates a model of the screens described in the app.xml. Populates the model array with Screen objects.
     * @param screens An array subset of a JXON object describing the screens Array in app.xml.
     */
    function createModel(screens:Screen[]):void {
        for(var i = 0, ii = screens.length; i < ii; i++) {
        	var screen:Screen = {
	            id: screens[i]["@id"],
	            title: screens[i]["@title"],
	            html:[],
                css:[],
	            js:[],
                json:[]
        	};

			guaranteeArray(screens[i].html).forEach((url:string, index:number, array:Screen[]):void => {
                if (cache.rule == Cache.YES) { // pre-cache?
                    var file = readFile(url);
                }
                screen.html.push(url);
			});

            guaranteeArray(screens[i].css).forEach((url:string, index:number, array:Screen[]):void => {
                if (cache.rule == Cache.YES) { // pre-cache?
                    var file = readFile(url);
                }
                screen.css.push(url);
            });

            guaranteeArray(screens[i].js).forEach((url:string, index:number, array:Screen[]):void => {
                if (cache.rule == Cache.YES) { // pre-cache?
                    var file = readFile(url);
                }
                screen.js.push(url);
            });

            guaranteeArray(screens[i].json).forEach((element:any, index:number, array:Screen[]):void => {
                var target = element["@target"];
                if (typeof target == "string") {
                    screen.json.push({url:element, target:target});
                } else {
                    console.error("No target attribute provided for JSON (\"" + element + "\")");
                }
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
            throw "No default screen set.";
        }
	}

    /**
     * Creates a HTML <savvy-screen> element and appends it to the body of the HTML document.
     * @param id The ID to give to the DIV
     * @param style The style to apply (inline) to the DIV
     */
	function createHTMLSectionElement(role:string = "screen"):void {
		var section:HTMLElement = document.createElement("section");
        section.setAttribute("data-role", role);        
        
        section.style.width = "100%";
        section.style.overflow = "visible";
        section.style.padding = "0px";
        section.style.margin = "0px";
        section.style.visibility = "visible";

		document.body.appendChild(section);
	}

    /**
     * Removes a node from the DOM by specifying its ID
     * @param id The ID of the DOM node to be removed
     * @returns {Boolean} true if the node was removed otherwise false
     */
    function removeDOMNode(node:any):Boolean {
        if(node && node.parentNode) {
            return node.parentNode.removeChild(node) !== null;
        }
        return false;
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
     * Attempts to retrieve a file from the cache otherwise reads it from a URL.
     * @param url The URL to read.
     * @param noCache A Boolean indicating that the file should be not cached if read from a URL.
     * @returns {*} A File object containing the URL and data of the file.
     */
    function readFile(url:string, noCache:boolean = false):File {
        var file:File;

        // first, try to get from cache first
        file = cache.get(url);
        if (file.data !== null) return file;
        
        file = getFileFromUrl(url);
        if (!noCache) cache.add(file);
        
        return file;
    }
    
    /**
     * Reads the file at URL and returns a File object for it.
     * @param url The URL to read.
     * @param asXML A Boolean indicating that the file should be read as an XML document.
     * @returns {*} A File object containing the URL and data of the file.
     */
	function getFileFromUrl(url:string, asXML:boolean = false):File {
		var file:File;

		// not in cache?
		var xmlhttp:XMLHttpRequest = new XMLHttpRequest(); // create the XMLHttpRequest object
		xmlhttp.open("GET", url, false);
		xmlhttp.send();
		if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
			console.error("HTTP status "+xmlhttp.status+" returned for file: " + url);
			return {url:url, data:""};
		}

		var data:any;
        if (asXML) {
            data = xmlhttp.responseXML;
        } else {
            data = xmlhttp.responseText;
        }
		file = {url:url, data:data};
		return file;
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