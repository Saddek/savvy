/*

   .x+=:.                  _            _                      
  z`    ^%                u            u            ..         
     .   <k              88Nu.   u.   88Nu.   u.   @L          
   .@8Ned8"       u     '88888.o888c '88888.o888c 9888i   .dL  
 .@^%8888"     us888u.   ^8888  8888  ^8888  8888 `Y888k:*888. 
x88:  `)8b. .@88 "8888"   8888  8888   8888  8888   888E  888I 
8888N=*8888 9888  9888    8888  8888   8888  8888   888E  888I 
 %8"    R88 9888  9888    8888  8888   8888  8888   888E  888I 
  @8Wou 9%  9888  9888   .8888b.888P  .8888b.888P   888E  888I 
.888888P`   9888  9888    ^Y8888*""    ^Y8888*""   x888N><888' 
`   ^"F     "888*""888"     `Y"          `Y"        "88"  888  
             ^Y"   ^Y'                                    88F  
                                                         98"   
                                                       ./"     
                                                      ~`       
Version: 0.3.0

Copyright (c) 2013 digisoft.tv
Copyright (c) 2013 Oliver Moran

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var Card;
(function (Card) {
    // these are Strings so that they can be compared exactly agaisnt themselves (i.e. "ready" !== new String("ready"))
    Card.READY = "savvy-ready";
    Card.ENTER = "savvy-enter";
    Card.EXIT = "savvy-exit";
    Card.LOAD = "savvy-load";
})(Card || (Card = {}));
var JXON;
(function (JXON) {
    function parse(parent) {
        return getJXONTree(parent);
    }
    JXON.parse = parse;
    ;

    /**
    * A JXONNode class, used as a container object when parsing XML to a JavaScript object.
    */
    var JXONNode = (function () {
        function JXONNode(val) {
            this._value = (val === undefined) ? null : val;
        }
        JXONNode.prototype.setValue = function (val) {
            this._value = val;
        };
        JXONNode.prototype.valueOf = function () {
            return this._value;
        };
        JXONNode.prototype.toString = function () {
            return (this._value === null) ? "null" : this._value.toString();
        };
        return JXONNode;
    })();

    /**
    * JXON Snippet #3 - Mozilla Developer Network
    * https://developer.mozilla.org/en-US/docs/JXON
    */
    function getJXONTree(oXMLParent) {
        var vResult = new JXONNode();
        var nLength = 0;
        var sCollectedTxt = "";

        if (oXMLParent.attributes && oXMLParent.attributes.length > 0) {
            for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
                var oAttrib = oXMLParent.attributes.item(nLength);
                vResult["@" + oAttrib.name.toLowerCase()] = parseText(oAttrib.value.trim());
            }
        }
        if (oXMLParent.childNodes && oXMLParent.childNodes.length > 0) {
            for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
                oNode = oXMLParent.childNodes.item(nItem);
                if (oNode.nodeType === 4) {
                    sCollectedTxt += oNode.nodeValue;
                } else if (oNode.nodeType === 3) {
                    sCollectedTxt += oNode.nodeValue.trim();
                } else if (oNode.nodeType === 1 && !oNode.prefix) {
                    if (nLength === 0) {
                        vResult = new Object();
                    }
                    sProp = oNode.nodeName.toLowerCase();
                    vContent = getJXONTree(oNode);
                    if (vResult.hasOwnProperty(sProp)) {
                        if (vResult[sProp].constructor !== Array) {
                            vResult[sProp] = [vResult[sProp]];
                        }
                        vResult[sProp].push(vContent);
                    } else {
                        vResult[sProp] = vContent;
                        nLength++;
                    }
                }
            }
        }
        if (vResult.constructor === JXONNode) {
            vResult.setValue(parseText(sCollectedTxt));
        }
        if (nLength > 0) {
            Object.freeze(vResult);
        }
        return vResult;

        function parseText(sValue) {
            if (/^\s*$/.test(sValue)) {
                return null;
            }
            if (/^(?:true|false)$/i.test(sValue)) {
                return sValue.toLowerCase() === "true";
            }
            if (isFinite(sValue)) {
                return parseFloat(sValue);
            }

            /* if (isFinite(Date.parse(sValue))) { return new Date(sValue); } */ // produces false positives
            return sValue;
        }
    }
})(JXON || (JXON = {}));
var application;
(function (application) {
    application.id = null;
    application.isCordova = false;
    application.version = null;

    application.cards = [];
    application.defaultCard = null;
    application.currentCard = null;

    function goto(path, transition, preventHistory) {
        if (typeof transition === "undefined") { transition = Transition.CUT; }
        if (typeof preventHistory === "undefined") { preventHistory = false; }
        throw "application.goto has not been over-written. Is there a problem with the order that Savvy is built?";
    }
    application.goto = goto;

    function getRoute() {
        var hash = window.location.hash;
        var path;
        if (hash == "" || hash == "#" || hash == "#!" || hash == "#!/") {
            path = application.defaultCard.id;
        } else {
            path = hash.substr(3);
        }

        return path;
    }
    application.getRoute = getRoute;

    function offCanvas(left) {
        var main = document.body.querySelector("main");
        if (typeof left == "undefined") {
            if (main.style.left == "" || main.style.left == "0px")
                left = Transition.OFF_CANVASS_LEFT;
            else
                left = "0px";
        }

        // shortcut to handle quick toggling
        if (main.style.left == left)
            left = "0px";

        // apply the style
        main.style.left = left;
    }
    application.offCanvas = offCanvas;
})(application || (application = {}));
var Savvy;
(function (Savvy) {
    var xmlData = JXON.parse(read("app.xml", true));
    if (xmlData.app === undefined) {
        throw "Could not parse app.xml. \"app\" node missing.";
    } else {
        application.id = (xmlData.app["@id"]) ? xmlData.app["@id"] : "application";
        application.version = (xmlData.app["@version"]) ? xmlData.app["@version"] : "";
        application.isCordova = (xmlData.app["@cordova"] == "yes");

        // first assume window.load
        var event = "load";
        var element = window;
        if (application.isCordova) {
            // then modify to document.deviceready
            event = "deviceready";
            element = document;

            // add the Cordova scritps (assume these are in the root directory)
            var cordova_lib = document.createElement("script");
            cordova_lib.setAttribute("src", "cordova.js");
            cordova_lib.setAttribute("type", "text/javascript");

            var cordova_plugins = document.createElement("script");
            cordova_plugins.setAttribute("src", "cordova_plugins.js");
            cordova_plugins.setAttribute("type", "text/javascript");

            document.head.appendChild(cordova_lib);
            document.head.appendChild(cordova_plugins);
        }

        // ordinarily, Savvy will be initialised when the DOM is ready
        element.addEventListener(event, function deviceReadyEvent() {
            element.removeEventListener(event, deviceReadyEvent);

            parseAppXML(xmlData.app);

            application.goto(application.getRoute(), Transition.CUT, true);
        }, false);
    }

    /**
    * Parses the app XML creating the card model and executing global HTML, CSS, JS, etc.
    * @param app
    */
    function parseAppXML(app) {
        preloadImages(guaranteeArray(app.img));

        initNode(app, document.body);

        var main = document.createElement("main");
        document.body.appendChild(main);

        if (app.header) {
            var header = document.createElement("header");
            initNode(app.header, header);
            main.appendChild(header);
        }

        initCards(guaranteeArray(app.card), main);

        if (app.footer) {
            var footer = document.createElement("footer");
            initNode(app.footer, footer);
            main.appendChild(footer);
        }

        delete Savvy._eval; // no longer needed
    }

    /**
    * Preloads an array of images to the browser cache.
    * @param images An array of URLs to load.
    */
    var imgCache = [];
    function preloadImages(images) {
        for (var i = 0, ii = images.length; i < ii; i++) {
            var img = new Image();
            img.src = images[i];
            imgCache.push(img); // to keep in memory
        }
    }

    function initCards(cards, main) {
        var div = document.createElement("div");
        main.appendChild(div);

        for (var i = 0, ii = cards.length; i < ii; i++) {
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
                    console.warn("More than one card is set as the default in app.xml. Ignoring.");
                }
            }

            initNode(node, section, id);

            // NB: this object SHOULD NOT added to the body until ready to be shown
            div.appendChild(section);
        }

        if (application.defaultCard === null) {
            throw "No default card set.";
        }
    }

    function initNode(node, element, id) {
        guaranteeArray(node.css).forEach(function (url) {
            appendCssToHeadFromUrl(url, id);
        });

        guaranteeArray(node.html).forEach(function (url) {
            element.insertAdjacentHTML("beforeend", read(url));
        });

        guaranteeArray(node.json).forEach(function (json) {
            var target = json["@target"];
            if (typeof target == "string") {
                var context = (element == document.body) ? window : element;
                parseJSONToTarget(json, target, context);
            } else {
                console.error("No target attribute provided for JSON (\"" + element + "\")");
            }
        });

        guaranteeArray(node.js).forEach(function (url) {
            var context = (element == document.body) ? window : element;
            executeJavaScript(url, context);
        });
    }

    /**
    * Accepts an object of any kind. If the object is an array it returns an identical object. If the object is not
    * an array, it makes a new Array containing that object. If the object is falsey, it returns an empty array.
    * @param arr The object to guarantee an array from.
    * @returns {Array}
    */
    function guaranteeArray(arr) {
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
    };

    /**
    * Attempts to appends a given CSS to the head of the HTML document.
    * On some browsers (e.g. MSIE8) the CSS has to be linked from the head. And in the cases of external CSS URLs,
    * it needs to be linked from the head. Otherwise, we prefer adding the CSS to the head.
    * @param url The URL of the CSS file
    * @param isCardCSS A Boolean indicating that this CSS relates to the current screeen (optional)
    */
    function appendCssToHeadFromUrl(url, forId) {
        var doLink = (regex.isRemoteUrl.test(url) || window.navigator.appVersion.indexOf("MSIE 8") != -1);
        if (doLink && forId) {
            throw "Card styles sheets cannot be remote (e.g. http://www.examples.com/style.css). Please include remote style sheets globally.";
        }
        var node;
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
        try  {
            if (!doLink) {
                var content = read(url);
                if (forId) {
                    content = content.replace(regex.css.body, "$1");
                    content = content.replace(regex.css.selector, "body > main > div > section#" + forId + " $1$2");
                }
                var i = url.toString().lastIndexOf("/");
                if (i != -1) {
                    var dir = url.toString().substr(0, i + 1);
                    content = content.replace(regex.css.noQuotes, "url(" + dir).replace(regex.css.doubleQuotes, "url(\"" + dir).replace(regex.css.singleQuotes, "url('" + dir);
                }
                node.appendChild(document.createTextNode(content));
            }
            document.getElementsByTagName("head")[0].appendChild(node);
        } catch (err) {
            throw "Error appending CSS file (" + url + "): " + err.toString();
        }
    }

    // JAVASCRIPT //
    var include = /^#include "(.*)"$/gm;

    /**
    * Loads a JavaScript file and executes it in a given context, otherwise with the window object
    * @param url The URL of the JavaScript to execute
    * @param context The context in which to execute the JavaScript
    */
    function executeJavaScript(url, context) {
        var code = parseScriptFile(url);
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
    function parseScriptFile(url) {
        var src = read(url);

        var code = src.replace(include, function (match, p1) {
            var dir = getDirectoryFromFilePath(url);
            var url2 = resolvePath(dir + p1);
            var str = parseScriptFile(url2);
            return str;
        });

        return code;
    }

    /**
    * Returns the directory path from a file path (i.e. path to the containing directory)
    * @param path a String path to a file
    * @returns a String path to the containing directory
    */
    function getDirectoryFromFilePath(path) {
        var i = path.toString().lastIndexOf("/");
        return path.toString().substr(0, i + 1);
    }

    /**
    * Resolves a complicated path (e.g. one containing .. and .) to a simple path
    * http://stackoverflow.com/questions/17967705/how-to-use-javascript-regexp-to-resolve-relative-paths
    * @params path a String path
    * @returns a String path, which is functionally identical but simplified
    */
    function resolvePath(path) {
        var parts = path.split('/');
        var i = 1;
        while (i < parts.length) {
            // safeguard, may never happen
            if (i < 0)
                continue;

            // if current part is '..' and previous part is different, remove both
            if (parts[i] == ".." && parts[i - 1] !== '..' && i > 0) {
                parts.splice(i - 1, 2);
                i -= 2;
            }

            // if current part is '.' or '' simply remove it
            if (parts[i] === '.' || parts[i] == '') {
                parts.splice(i, 1);
                i -= 1;
            }

            i++;
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
    function parseJSONToTarget(url, target, context) {
        if (typeof context === "undefined") { context = window; }
        var data;
        try  {
            var src = read(url);
            data = JSON.parse(src);
        } catch (err) {
            console.error("Cannot parse data file (\"" + url + "\"). Please check that the file is valid JSON <http://json.org/>.");
            return;
        }

        try  {
            createObjectFromString(target, data, context);
        } catch (err) {
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
    function createObjectFromString(target, data, context) {
        if (typeof context === "undefined") { context = window; }
        var arr = target.split(".");

        for (var i = 0; i < arr.length - 1; i++) {
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
    function read(url, asXML) {
        if (typeof asXML === "undefined") { asXML = false; }
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, false);
        xmlhttp.setRequestHeader("Cache-Control", "no-store"); // try not to cache the response
        xmlhttp.send();
        if (xmlhttp.status !== 200 && xmlhttp.status !== 0) {
            console.error("HTTP status " + xmlhttp.status + " returned for file: " + url);
            return null;
        }

        if (asXML) {
            return xmlhttp.responseXML;
        } else {
            return xmlhttp.responseText;
        }
    }
})(Savvy || (Savvy = {}));
var Savvy;
(function (Savvy) {
    application["goto"] = function (path, transition, preventHistory) {
        if (typeof transition === "undefined") { transition = Transition.CUT; }
        if (typeof preventHistory === "undefined") { preventHistory = false; }
        if (typeof path == "string") {
            goto.call(Savvy, path, transition, preventHistory);
        } else {
            throw "A string indicating a card ID must be passed to document.goto method.";
        }
    };

    var ignoreHashChange = false;
    window.addEventListener("hashchange", function () {
        if (ignoreHashChange) {
            ignoreHashChange = false;
        } else {
            var path = application.getRoute();
            var id = getIdForPath(path);
            var card = document.getElementById(id);
            console.log(application.cards.indexOf(card));
            if (application.cards.indexOf(card) > -1) {
                // don't load a route that doesn't exist
                application.goto(path, Transition.CUT, true);
            }
        }
    }, false);

    function getIdForPath(path) {
        var i = path.indexOf("/");
        var id = (i > -1) ? path.substr(0, i) : path;
        return id;
    }

    // a blank function (defined here once to save memory and time)
    var noop = function () {
    };

    // This function can be called to recommence the transition after it was caused
    var continueTransition = noop;

    /**
    * The function called by document.goto
    * @param path A path to a new card. This must be a card ID or a string beginning with a card ID followed by a slash. Further characters may follow the slash.
    */
    function goto(path, transition, preventHistory) {
        if (typeof transition === "undefined") { transition = Transition.CUT; }
        if (typeof preventHistory === "undefined") { preventHistory = false; }
        var id = getIdForPath(path);
        var to = document.getElementById(id);
        var from = application.currentCard;

        if (application.cards.indexOf(to) > -1) {
            var detail = {
                from: from,
                to: to,
                transition: transition
            };
            load.call(Savvy, detail, path, preventHistory);
        } else {
            throw "No card with ID of \"" + id + "\".";
        }
    }

    /**
    * @private
    */
    function load(detail, path, preventHistory) {
        var event = createSavvyEvent(detail, path, preventHistory);

        if (detail.from == null) {
            event.initCustomEvent(Card.LOAD, true, true, detail);
            document.body.dispatchEvent(event);
        } else {
            event.initCustomEvent(Card.EXIT, true, true, detail);
            detail.from.dispatchEvent(event);
        }

        if (event.defaultPrevented) {
            continueTransition = ready;
        } else {
            ready.call(Savvy, detail, path, preventHistory); // NB: make sure 'this' is Savvy
        }
    }

    function ready(detail, path, preventHistory) {
        if (!!detail.to) {
            detail.to.style.setProperty("visibility", "hidden", "important");
            detail.to.style.setProperty("display", "block", "important");
        }

        var event = createSavvyEvent(detail, path, preventHistory);
        event.initCustomEvent(Card.READY, true, true, detail);
        detail.to.dispatchEvent(event);

        if (event.defaultPrevented) {
            continueTransition = onTransition;
        } else {
            onTransition.call(Savvy, detail, path, preventHistory); // NB: make sure 'this' is Savvy
        }
    }

    function onTransition(detail, path, preventHistory) {
        // NB: prevent accidental future transitions
        continueTransition = noop;

        if (!!detail.to)
            detail.to.style.setProperty("visibility", "visible", "important");

        // fallback to static in case something was set up wrong in the transition
        if (!detail.transition)
            detail.transition = Transition.CUT;
        applyTranstition(detail.to, detail.transition.to, detail.transition.duration);
        applyTranstition(detail.from, detail.transition.from, detail.transition.duration);
        setTimeout(function () {
            // hide from and show to
            if (!!detail.from)
                detail.from.style.removeProperty("display");
            if (!!detail.to)
                detail.to.style.removeProperty("visibility");
            onEnter.call(Savvy, detail, path, preventHistory);
        }, detail.transition.duration);
    }

    function applyTranstition(el, transition, duration) {
        if (el != null) {
            el.className += transition;
            setTimeout(function () {
                el.className = el.className.replace(transition, "");
            }, duration);
        }
    }

    function onEnter(detail, path, preventHistory) {
        document.title = (detail.to.title || "");
        if (!preventHistory) {
            ignoreHashChange = true;
            window.location.hash = "!/" + path;
        }

        var event = createSavvyEvent(detail, path, preventHistory);

        application.currentCard = detail.to;
        event.initCustomEvent(Card.ENTER, true, true, detail);
        detail.to.dispatchEvent(event);
    }

    function createSavvyEvent(detail, path, preventHistory) {
        var event = document.createEvent("CustomEvent");
        continueTransition = noop;
        event["continue"] = function () {
            continueTransition.call(Savvy, detail, path, preventHistory); // NB: make sure 'this' is Savvy
        };
        return event;
    }
})(Savvy || (Savvy = {}));
var Transition;
(function (Transition) {
    /* CUT */
    Transition.CUT = {
        from: "transition -d0ms -static",
        to: "transition -d0ms -static",
        duration: 0,
        inverse: null
    };

    /* SLIDE */
    Transition.SLIDE_LEFT = {
        from: "transition -d333ms -ease-in-out -out -left",
        to: "transition -d333ms -ease-in-out -in -left",
        duration: 333,
        inverse: null
    };

    Transition.SLIDE_RIGHT = {
        from: "transition -d500ms -ease-in-out -out -right",
        to: "transition -d500ms -ease-in-out -in -right",
        duration: 500,
        inverse: null
    };

    /* COVER */
    Transition.COVER_LEFT = {
        from: "transition -d250ms -static -lower",
        to: "transition -d250ms -ease-in-out -in -left -shadow",
        duration: 250,
        inverse: null
    };

    Transition.COVER_RIGHT = {
        from: "transition -d250ms -static -lower",
        to: "transition -d250ms -ease-in-out -in -right -shadow",
        duration: 250,
        inverse: null
    };

    /* UNCOVER */
    Transition.UNCOVER_LEFT = {
        from: "transition -d333ms -ease-in-out -out -left -shadow",
        to: "transition -d333ms -static -lower",
        duration: 333,
        inverse: null
    };

    Transition.UNCOVER_RIGHT = {
        from: "transition -d333ms -ease-in-out -out -right -shadow",
        to: "transition -d333ms -static -lower",
        duration: 333,
        inverse: null
    };

    /* COVER FADE */
    Transition.COVER_LEFT_FADE = {
        from: "transition -d1000ms -linear -out -left -fade -lower",
        to: "transition -d250ms -ease-in-out -in -left -shadow",
        duration: 250,
        inverse: null
    };

    Transition.COVER_RIGHT_FADE = {
        from: "transition -d1000ms -linear -out -right -fade -lower",
        to: "transition -d250ms -ease-in-out -in -right -shadow",
        duration: 250,
        inverse: null
    };

    /* UNCOVER FADE */
    Transition.UNCOVER_LEFT_FADE = {
        from: "transition -d333ms -ease-in-out -out -left -shadow",
        to: "transition -d333ms -linear -in -right -fade -lower",
        duration: 333,
        inverse: null
    };

    Transition.UNCOVER_RIGHT_FADE = {
        from: "transition -d333ms -ease-in-out -out -right -shadow",
        to: "transition -d333ms -linear -in -right -fade -lower",
        duration: 333,
        inverse: null
    };

    /* INVERSE */
    Transition.CUT.inverse = Transition.CUT;
    Transition.SLIDE_LEFT.inverse = Transition.SLIDE_RIGHT;
    Transition.SLIDE_RIGHT.inverse = Transition.SLIDE_LEFT;
    Transition.COVER_LEFT.inverse = Transition.UNCOVER_RIGHT;
    Transition.COVER_RIGHT.inverse = Transition.UNCOVER_LEFT;
    Transition.UNCOVER_LEFT.inverse = Transition.COVER_RIGHT;
    Transition.UNCOVER_RIGHT.inverse = Transition.COVER_LEFT;
    Transition.COVER_LEFT_FADE.inverse = Transition.UNCOVER_RIGHT_FADE;
    Transition.COVER_RIGHT_FADE.inverse = Transition.UNCOVER_LEFT_FADE;
    Transition.UNCOVER_LEFT_FADE.inverse = Transition.COVER_RIGHT_FADE;
    Transition.UNCOVER_RIGHT_FADE.inverse = Transition.COVER_LEFT_FADE;

    /* OFF-CAVAS DISTANCES */
    Transition.OFF_CANVASS_LEFT = "260px";
    Transition.OFF_CANVASS_RIGHT = "-260px";
})(Transition || (Transition = {}));
// Evaling scripts in the main Savvy block captures internal Savvy
// methods and properties in the closure. Scripts are evaluated in
// their own block in order to provide a "clean" closure
var Savvy;
(function (Savvy) {
    function _eval(code, context) {
        if (context === undefined) {
            (window.execScript || function (code) {
                window["eval"].call(window, code);
            })(code);
        } else {
            (function (code) {
                eval(code);
            }).call(context, code);
        }
    }
    Savvy._eval = _eval;
})(Savvy || (Savvy = {}));
