module Savvy {

    var xmlData:any = JXON.parse(read("app.xml", true));
    if (xmlData.app === undefined) {
        throw "Could not parse app.xml. \"app\" node missing.";
    } else {
        application.id = (xmlData.app["@id"]) ? xmlData.app["@id"] : "application";
        application.version = (xmlData.app["@version"]) ? xmlData.app["@version"] : "";
        application.isCordova = (xmlData.app["@cordova"] == "yes");
        
        // first assume window.load
        var event:string = "load";
        var element:any = window;
        if (application.isCordova) {
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
    
            application.goto(application.getRoute(), Transition.CUT, true);
        }, false);
    }
    
    /**
     * Parses the app XML creating the card model and executing global HTML, CSS, JS, etc.
     * @param app
     */
    function parseAppXML(app:any):void {
    	preloadImages(guaranteeArray(app.img));

        // NB: Do before HTML so that HTML lands formatted
		guaranteeArray(app.css).forEach((url:string, index:number, array:string[]):void => {
			appendCssToHeadFromUrl(url);
		});

		guaranteeArray(app.html).forEach((url:string, index:number, array:string[]):void => {
            document.body.insertAdjacentHTML("beforeend", read(url));
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
        
        initCards(guaranteeArray(app.card));
        
        delete Savvy._eval; // no longer needed
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

    function initCards(cards:any):void {
        for(var i = 0, ii = cards.length; i < ii; i++) {
            // NB: this isn't added to the body until ready to be shown
            var object = document.createElement("object");
            object.setAttribute("id", cards[i]["@id"]);
            object.setAttribute("title", cards[i]["@title"]);
            object.setAttribute("data", "savvy:" + application.id + "/" + cards[i]["@id"]);
            object.setAttribute("type", "application/x-savvy");

            var id:string = cards[i]["@id"];
            var title:string = cards[i]["@title"];
            window[id] = object;

            guaranteeArray(cards[i].css).forEach((url:string):void => {
                appendCssToHeadFromUrl(url, id);
            });

			guaranteeArray(cards[i].html).forEach((url:string):void => {
                object.insertAdjacentHTML("beforeend", read(url));
			});
            
            var node:HTMLElement = <HTMLElement> document.body.appendChild(object);
            application.cards.push(node); // add to the array of cards
            if (cards[i]['@default'] !== undefined) {
                if (application.defaultCard === null) {
                    application.defaultCard = node;
                } else {
                    console.warn("More than one card is set as the default in app.xml. Ignoring.");
                }
            }
            
            guaranteeArray(cards[i].json).forEach((element:any):void => {
                var target = element["@target"];
                if (typeof target == "string") {
                    var target = element.target;
                    parseJSONToTarget(element, target, object);
                } else {
                    console.error("No target attribute provided for JSON (\"" + element + "\")");
                }
            });

            guaranteeArray(cards[i].js).forEach((url:string):void => {
                executeJavaScript(url, object);
            });
    	}

        if (application.defaultCard === null) {
            throw new Error("No default card set.");
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

    
    // CSS //
    
    // define all regexes one in a static variable to save computation time
	var regex = {
		isRemoteUrl: new RegExp("(http|ftp|https)://[a-z0-9\-_]+(\.[a-z0-9\-_]+)+([a-z0-9\-\.,@\?^=%&;:/~\+#]*[a-z0-9\-@\?^=%&;/~\+#])?", "i"),
		css: {
            // used to find instances of url references in css files that need to be modified
            // FIXME: gives a false positive for data URIs
			singleQuotes: /url\('(?!https?:\/\/)(?!\/)/gi,
        	doubleQuotes: /url\("(?!https?:\/\/)(?!\/)/gi,
        	noQuotes: /url\((?!https?:\/\/)(?!['"]\/?)/gi,
            body: /\bbody\b(,(?=[^}]*{)|\s*{)/gi,
            selector: /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/gi
		}
	}


    /**
     * Attempts to appends a given CSS to the head of the HTML document.
     * On some browsers (e.g. MSIE8) the CSS has to be linked from the head. And in the cases of external CSS URLs,
     * it needs to be linked from the head. Otherwise, we prefer adding the CSS to the head.
     * @param url The URL of the CSS file
     * @param isCardCSS A Boolean indicating that this CSS relates to the current screeen (optional)
     */
    function appendCssToHeadFromUrl(url:string, forId?:string):void {
        var doLink:Boolean = (regex.isRemoteUrl.test(url) || window.navigator.appVersion.indexOf("MSIE 8") != -1);
        if (doLink && forId) {
            throw new Error("Card styles sheets cannot be remote (e.g. http://www.examples.com/style.css). Please include remote style sheets globally.");
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
                var content:string = read(url);
                if (forId) {
                    content = content.replace(regex.css.body, "$1");
                    content = content.replace(regex.css.selector, "body > object#"+forId+" $1$2");
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

    // JAVASCRIPT //
    
    var include:RegExp = /^#include "(.*)"$/gm;
        
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
        var src:string = read(url);

        var code:string = src.replace(include, function(match:string, p1:string):string {
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

    /**
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
    
    
    /* JSON */
    
        /**
     * Parses a JSON file to a variable.
     * @param url The URL of the JSON file to load.
     * @param target The name of the variable to set with the data from the JSON file
     * @param context The object within which target should exist (defaults to window)
     */
    function parseJSONToTarget(url:string, target:string, context:any = window):void {
        var data:any;
        try {
            var src:string = read(url); // prevent caching always with JSON (presume it is an API)
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
    
    
    // read a file from a URL
    function read(url:string, asXML:boolean = false):any {
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