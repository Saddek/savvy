module Savvy {

    var config:any = JXON.parse(read("config.xml", true));
    if (config.widget === undefined) {
        throw "Could not parse config.xml. \"widget\" node missing.";
    } else {
        application.id = (config.widget["@id"]) ? config.widget["@id"] : null;
        application.version = (config.widget["@version"]) ? config.widget["@version"] : null;
        application.isCordova = (config.widget["@cordova"] == "yes");
        
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
            
            parseWidgetXML(config.widget["savvy:deck"]);
    
            setTimeout(function(){
                // FIXME: why doesn't the header and footer CSS apply immediately?
                setCardsCSS(); // force the card css to fill the screen
                // remove all the fouc prevention styles
                var styles:NodeList = document.querySelectorAll("style[data-fouc='true']");
                for (var i=0; i < styles.length; i++) {
                    styles[i].parentNode.removeChild(styles[i]);
                }
                application.goto(application.getRoute(), Transition.CUT, true);
            }, 250); // 250ms delay

        }, false);
    }
    
    /**
     * Parses the a deck from config.xml, creating the card model and executing global HTML, CSS, JS, etc.
     * @param deck
     */
    function parseWidgetXML(deck:any):void {
    	preloadImages(guaranteeArray(deck.img));

        initNode(deck, document.body);
        
        application.main = document.createElement("main");
        document.body.appendChild(application.main);
        
        if (deck.header) {
            application.header = document.createElement("header");
            initNode(deck.header, application.header);
            application.main.appendChild(application.header);
        }

        initCards(guaranteeArray(deck.card), application.main);
        
        if (deck.footer) {
            application.footer = document.createElement("footer");
            initNode(deck.footer, application.footer);
            application.main.appendChild(application.footer);
        }
        
        // programatically set the card height based on the header and footer
        window.addEventListener("resize", setCardsCSS);
        
        delete Savvy._eval; // no longer needed
    }
    
    function setCardsCSS():void {
        var height = parseInt(window.getComputedStyle(document.body).height);
        var top = 0;
        if (application.header) {
            top = parseInt(window.getComputedStyle(application.header).height);
            height -= top;
        }
        if (application.footer) {
            height -= parseInt(window.getComputedStyle(application.footer).height);
        }
        application.cards.forEach(function (card) {
            card.style.top = top + "px";
            card.style.height = height + "px";
        });
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

    function initCards(cards:any, main:HTMLElement):void {
        for(var i = 0, ii = cards.length; i < ii; i++) {
            
            var node = cards[i];
            var id = node["@id"];
            var title = node["@title"];
            
            var section = document.createElement("section");
            section.setAttribute("id", id);
            section.setAttribute("title", title);

            window[id] = section;

            application.cards.push(section); // add to the array of cards
            if (node['@default'] !== undefined) {
                if (application.defaultCard === null) {
                    application.defaultCard = section;
                } else {
                    console.warn("More than one card is set as the default in config.xml. Ignoring.");
                }
            }
            
            initNode(node, section, id);
        
            // NB: this object SHOULD NOT added to the body until ready to be shown
            main.appendChild(section);
    	}

        if (application.defaultCard === null) {
            throw "No default card set.";
        }
	}
    
    function initNode(node:any, element:HTMLElement, id?:string):void {
        guaranteeArray(node.css).forEach((url:string):void => {
            appendCssToHeadFromUrl(url, id);
        });

        guaranteeArray(node.html).forEach((url:string):void => {
            element.insertAdjacentHTML("beforeend", read(url));
        });

        guaranteeArray(node.json).forEach((json:any):void => {
            var target = json["@target"];
            if (typeof target == "string") {
                var context:any = (element == document.body) ? <any> window : <any> element;
                parseJSONToTarget(json, target, context);
            } else {
                console.error("No target attribute provided for JSON (\"" + element + "\")");
            }
        });

        guaranteeArray(node.js).forEach((url:string):void => {
            var context:any = (element == document.body) ? <any> window : <any> element;
            executeJavaScript(url, context);
        });
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
            url: {
                singleQuotes: /url\('(?!https?:\/\/)(?!\/)/gi,
                doubleQuotes: /url\("(?!https?:\/\/)(?!\/)/gi,
                noQuotes: /url\((?!https?:\/\/)(?!['"]\/?)/gi
            },
            card: /\bcard\b(,(?=[^}]*{)|\s*{)/gi,
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
        var isAbsolute:boolean = regex.isRemoteUrl.test(url);
        if (isAbsolute && forId) {
            throw "Card styles sheets cannot be remote (e.g. http://www.examples.com/style.css). Please include remote style sheets globally.";
        }
        if (isAbsolute) {
            var node:HTMLElement;
            node = document.createElement("link");
            node.setAttribute("rel", "stylesheet");
            node.setAttribute("type", "text/css");
            node.setAttribute("href", url);
            document.querySelector("head").appendChild(node);
        } else {
            var node:HTMLElement;
            node = document.createElement("style");
            node.setAttribute("type", "text/css");
            var content:string = read(url);
            if (forId) {
                content = content.replace(regex.css.selector, "body > main > section#"+forId+" $1$2");
                content = content.replace(regex.css.card, "$1");
            }
            var i:number = url.toString().lastIndexOf("/");
            if(i != -1) {
                var dir:string = url.toString().substr(0, i + 1);
                content = content.replace(regex.css.url.noQuotes, "url(" + dir)
                          .replace(regex.css.url.doubleQuotes, "url(\"" + dir)
                          .replace(regex.css.url.singleQuotes, "url('" + dir);
            }
            node.appendChild(document.createTextNode(content));
            document.querySelector("head").appendChild(node);
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
	    	throw err.toString() + " (" + url + ")";
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