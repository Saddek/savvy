// Savvy extends the JavaScript window object with two new objects _global and _screen
// _gobal can be used to set variables available across screens
// _screen can be used to set variables available during the session of the current screen only
interface Window {
	_global: any;
	_screen: any;
}

window._global = {};
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

    /**
     * The Screen interface: used to describe screens (id, title, html, etc.)
     */
	interface Screen {
	    id:string;
	    title:string;
	    html:File[];
	    js:File[];
	    css:File[];
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
        subscribe(type:string, action:() => bool, screen:any = this):void {
            Savvy.subscribe(type, action, screen);
        }
        unsubscribe(type:string, action:() => bool) {
            Savvy.unsubscribe(type, action);
        }
    }

    /**
     * The Cache: this object will be a cache of files (html, js, css, xml, etc.)
     */
    class Cache {
    	public static AUTO:string = "auto";
        public static NEVER:string = "never";
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
        xmlDeclaration: /^<\?xml.*\?>/i
	}

    // generate a GUID for use by DOM IDs etc.
	var savvy_id:string = "SAVVY-" + guid();
    // a blank function (defined here once to save memory and time)
	var noop:Function = ():void => {};

    /**
     * Generates a pseudo GUID
     * @returns {string} A pseudo GUID
     */
    function guid():string {
        function S4():string {
            return (((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }

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
                console.error("No screen with ID of \"%s\".", id);
            } else {
                load({screen: screen, path: "/" + path});
            }
        }
	}

    /**
     * Gets the "global" DOM element (a DIV)
     * @returns {HTMLElement} The "global" DOM element (a DIV)
     */
    export function getGlobal():HTMLElement {
        return document.getElementById(savvy_id + "-GLOBAL");
    }

    /**
     * Gets the current "screen" DOM element (a DIV)
     * @returns {HTMLElement} The "screen" DOM element (a DIV)
     */
    export function getScreen():HTMLElement {
        return (document.getElementById(savvy_id + "-BUFFER") || document.getElementById(savvy_id));
    }

    /**
     * Implements a basic subscription service:
     * Used in Savvy.subscribe() and Savvy.unsubscribe()
     */
	class Subscription {
		type:string;
		action:() => bool;
        screen:any;
		constructor (type:string, action:() => bool, screen:any = window){
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
	export function subscribe(type:string, action:() => bool, screen:any = window):void {
        unsubscribe(type, action); // attempt to unsubscribe, so as to ensure that functions don't get called twice
		var sub = new Subscription(type, action, screen);
		subscriptions.push(sub);
	}

    /**
     * Enables an application to unsubscribe from Savvy events
     * @param type A String corresponding to the message to be unsubscibed from
     * @param action The function that is called when the subscription is called
     */
	export function unsubscribe(type:string, action:() => bool):void {
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
	function publish(type:string, arg:any = null):bool {
		var ret:bool = true;
		subscriptions.forEach((element:Subscription, index:number, array:Subscription[]):void => {
			if (element.type === type && typeof element.action === "function") {
				ret = !(element.action.call(element.screen, arg) === false || ret === false);
			}
		});
		return ret;
	}

    // the style for DIVs that will be used by Savvy
    var baseDivStyle:string = "width:100% !important; over-flow: visible !important; "
                            + "padding:0px !important; margin:0px !important; visibility:visible !important;";
    var divStyles:any = {
        global: baseDivStyle + " display:block !important;",
        buffer: baseDivStyle + " display:none !important;",
        screen: baseDivStyle + " display:block !important;"
    };

    // a counter to keep track of CSS links added to the HTML page
    var cssCounter:number = 0;

    export var READY:string = "ready";
    export var ENTER:string = "enter";
    export var EXIT:string = "exit";
    export var LOAD:string = "load";

    export function start():void {
        Savvy.start = function():void {
            console.warn("Savvy.start can only be called once.");
            return;
        }
        createHTMLDivElement(savvy_id + "-GLOBAL", divStyles.global);
        createHTMLDivElement(savvy_id, divStyles.screen);
        var xmlData:any = getJXONTree(readFile("data/app.xml").data);
        if (xmlData.app === undefined) {
            throw "Could not parse app.xml. \"app\" node missing.";
        }
        cache.rule = (xmlData.app.cache === undefined) ? Cache.AUTO : xmlData.app.cache;
        parseAppXML(xmlData.app);

        load(getRoute(), true);
    }

    var ignoreHashChange:bool = false;
    window.addEventListener("hashchange", function () {
        if (ignoreHashChange) {
            ignoreHashChange = false;
        } else {
            load(getRoute(), true);
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
        var limit:number = cssCounter - 1;

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

            createHTMLDivElement(savvy_id + "-BUFFER", divStyles.buffer);

            guaranteeArray(route.screen.html).forEach((element:File, index:number, array:Array):void => {
                Savvy.getScreen().innerHTML += readFile(element.url).data;
            });

            var executionContext:ExecutionContext = window[route.screen.id] = new ExecutionContext();
            if(typeof window[route.screen.id] === "undefined") {
                console.warn("\"window." + route.screen.id + "\" could not be created.");
            }
            guaranteeArray(route.screen.js).forEach((element:File, index:number, array:Array):void => {
                executeJavaScript(element.url, executionContext);
            });

            Savvy.getInfo = () => {
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
            removeDOMNode(savvy_id);

            // remove old CSS and add new CSS
            while(removeDOMNode(savvy_id + "-CSS-" + limit)) {
                limit--;
            }
            // NB: Old CSS is removed first because developers tend to write conflicting CSS selectors
            // when using Savvy
            guaranteeArray(route.screen.css).forEach((element:File, index:number, array:Array):void => {
                appendCssToHead(element.url);
            });

            Savvy.getScreen().id = savvy_id;
            Savvy.getScreen().setAttribute("style", divStyles.screen);
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
	function getRoute(id?:string):Route {
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

		guaranteeArray(app.css).forEach((element:string, index:number, array:Array):void => {
			appendCssToHead(element, savvy_id + "-GLOBAL-CSS-" + cssCounter++);
		});

		guaranteeArray(app.html).forEach((element:string, index:number, array:Array):void => {
			Savvy.getGlobal().innerHTML += readFile(element).data;
		});

        guaranteeArray(app.json).forEach((element:any, index:number, array:Array):void => {
            var name = element["@name"];
            if (!name) {
                name = element.toString();
                name = name.substr(name.lastIndexOf("/") + 1);
                if (name.indexOf(".") > -1) {
                    name = name.substr(0, name.indexOf("."));
                }
            }
            parseData(element, name);
        });

        guaranteeArray(app.js).forEach((element:string, index:number, array:Array):void => {
			executeJavaScript(element);
		});
    }

    /**
     * Attempts to appends a given CSS to the head of the HTML document.
     * On some browsers (e.g. MSIE8) the CSS has to be linked from the head. And in the cases of external CSS URLs,
     * it needs to be linked from the head. Otherwise, we prefer adding the CSS to the head.
     * @param url The URL of the CSS file
     * @param id The ID to give to the CSS link (otherwise one will be auto generated)
     */
    function appendCssToHead(url:string, id?:string):void {
        var doLink:Boolean = (regExpressions.isRemoteUrl.test(url) || (window.navigator.appVersion.indexOf("MSIE 8") != -1));
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
        if (id == undefined) {
    		node.id = savvy_id + "-CSS-" + cssCounter++;
        } else {
            node.id = id;
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
	    	console.error("Error appending CSS file (%s): %s ", url, err.toString());
        }
    }

    /**
     * Loads a JavaScript file and executes it in a given ExecutionContext, otherwise with the window object
     * @param url The URL of the JavaScript to execute
     * @param context The context in which to execute the JavaScript
     */
    function executeJavaScript(url:string, context?:ExecutionContext):void {
    	var code:string = readFile(url).data;
        try  {
        	if (context === undefined) {
	            (window.execScript || function (code:string):void {
	                window["eval"].call(window, code);
	            })(code);
        	} else {
	            (function(code){
	            	eval(code);
	            }).call(context, code);
        	}
        } catch (err) {
	    	console.error("%s (%s)", err.toString(), url);
    	}
    }

    /**
     * Parses a JSON or XML file to a variable.
     * @param url The URL of the JSON or XML file to load.
     * @param target The name of the variable to set with the data from the JSON or XML file
     * @param context The object within which target should exist (defaults to window)
     */
    function parseData(url:string, target:string, context:any = window):void {
        if (!regExpressions.isJSIdentifier.test(target)) {
            console.error("Cannot parse data file, %s. \"%s\" is not a valid JavaScript identifier.", url, target)
            return;
        }

    	var src:any = readFile(url).data;
    	var data:any;

    	try {
			if (src.constructor === Document) {
		    	data = getJXONTree(src);
			} else {
	    		data = JSON.parse(src);
			}
		} catch (err) {
			console.error("Cannot parse data file (%s). Only JSON or XML formats are supported.", url)
			return;
		}

        try  {
        	context[target] = data;
        } catch (err) {
	    	console.error("Could not set data loaded from %s.", url);
    	}
    }

    /**
     * Preloads an array of images to the browser cache.
     * @param images An array of URLs to load.
     */
	function preloadImages(images:Array):void {
        for(var i = 0, ii = images.length; i < ii; i++) {
            var img = new Image();
            img.src = images[i];
            cache.add({url:img.src, data:img});
        }
    }

    /**
     * Creates a model of the screens described in the app.xml. Populates the model array with Screen objects.
     * @param screens An array subset of a JXON object describing the screens Array in app.xml.
     */
    function createModel(screens:Array):void {
        for(var i = 0, ii = screens.length; i < ii; i++) {
        	var screen:Screen = {
	            id: screens[i]["@id"],
	            title: screens[i]["@title"],
	            html:[],
	            js:[],
                data:[],
	            css:[]
        	};

			guaranteeArray(screens[i].html).forEach((element:string, index:number, array:Array):void => {
				var url:string = element.toString();
                var file = readFile(url);
                cache.add(file);
                screen.html.push(file);
			});

			guaranteeArray(screens[i].js).forEach((element:string, index:number, array:Array):void => {
                var url:string = element.toString();
                var file = readFile(url);
                cache.add(file);
                screen.js.push(file);
			});

			guaranteeArray(screens[i].css).forEach((element:string, index:number, array:Array):void => {
                var url:string = element.toString();
                var file = readFile(url);
                cache.add(file);
                screen.css.push(file);
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
     * Creates a HTML DIV and appends it to the body of the HTML document.
     * @param id The ID to give to the DIV
     * @param style The style to apply (inline) to the DIV
     */
	function createHTMLDivElement(id:string, style:string):void {
        removeDOMNode(id); // remove in case one exists already
		var div:HTMLElement = document.createElement("div");
		div.id = id;
		div.setAttribute("style", style);
		document.body.appendChild(div);
	}

    /**
     * Removes a node from the DOM by specifying its ID
     * @param id The ID of the DOM node to be removed
     * @returns {Boolean} true if the node was removed otherwise false
     */
    function removeDOMNode(id):Boolean {
        var node = document.getElementById(id);
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
     * Reads the file at URL and returns a File object for it.
     * @param url The URL to read.
     * @returns {*} A File object containing the URL and data of the file.
     */
	function readFile(url:string):File {
		var file:File;

		// first, try to get from cache first
		file = cache.get(url);
		if (file.data !== null) return file;

		// not in cache?
		var xmlhttp:XMLHttpRequest = new XMLHttpRequest(); // create the XMLHttpRequest object
		xmlhttp.open("GET", url, false);
		//xmlhttp.responseType = responseType || "text";
		xmlhttp.send();
		if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
			console.warn("HTTP status "+xmlhttp.status+" returned for file: " + url);
			return {url:url, data:""};
		}


		var data:any;
		if (xmlhttp.responseXML !== null
            && regExpressions.xmlDeclaration.test(xmlhttp.responseText)) {
			data = xmlhttp.responseXML;
		} else {
			data = xmlhttp.responseText;
		}

		file = {url:url, data:data};

		return file;
	}

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
			if (isFinite(Date.parse(sValue))) { return new Date(sValue); }
			return sValue;
		}
	}

}