module Application {
    export var READY:string = "savvy-load";
}

interface HTMLCardElement extends HTMLElement {
    getElementById(id:string):Element;
    getElementsByName(name:string):NodeList;
}

// extend the Navigator interface so that TypeScript
// knows about the standalone property
interface Navigator {
    standalone:boolean;
}

module application {
    
    export var id:string = null;
    export var isCordova:boolean = false;
    export var version:string = null;
    
    export var name:string = null;
    export var description:string = null;
    export var author:any = {
        name: null,
        email: null,
        href: null
    }
    
    export var cards:HTMLCardElement[] = [];
    export var header:HTMLCardElement = null;
    export var footer:HTMLCardElement = null;
    export var main:HTMLCardElement = null;
    export var defaultCard:HTMLCardElement = null;
    export var currentCard:HTMLCardElement = null;
    
    export function goto(path:string, transition:Transition = Transition.CUT, preventHistory:boolean = false):void {
        throw "application.goto has not been over-written. Is there a problem with the order that Savvy is built?";
    }
    
    export function getRoute():string {
        var hash:string = window.location.hash;
        var path:string;
        if(hash == "" || hash == "#" || hash == "#!" || hash == "#!/") {
            path = application.defaultCard.id;
        } else {
            path = hash.substr(3);
        }

        return path;
    }
    
    export function offCanvas(left?:string):void {
        if (typeof left == "undefined") {
            left = (main.style.left == "" || main.style.left == Transition.OFF_CANVASS_NONE)
                ? Transition.OFF_CANVASS_LEFT
                : Transition.OFF_CANVASS_NONE;
        }
        
        // apply the style
        main.style.left = left;
    }
    
    // listen for updates over the application cache
    if (window.applicationCache && window.navigator.standalone) {
        window.applicationCache.addEventListener("updateready", function() {
            var message:string = "A new version of "
                + (("string" == typeof application.name) ? application.name : "this application")
                + " is available. Do you want to update now?";
            var url:string = window.location.protocol + "//" + window.location.host + window.location.pathname;
            if (confirm(message)) {
                document.body.style.display = "none"; // hide the body for prettiness sake while the app reloads
                window.location.replace(url);
            }
        });
    }
    /* Psuedo methods to mimic the interaction of the standard HTML Document */
    
    export function getElementById(id):Element {
        return document.body.querySelector("#" + id);
    }
    
    export function querySelector(selector):Element {
        return document.body.querySelector(selector);
    }
    
    export function querySelectorAll(selector):NodeList {
        return document.body.querySelectorAll(selector);
    }
    
    export function getElementsByName(name):NodeList {
        return document.body.getElementsByTagName(name);
    }
    
    export function addEventListener(type:string, listener:any, useCapture:boolean):void {
        return window.addEventListener(type, listener, useCapture);
    }

    export function removeEventListener(type:string, listener:any, useCapture?:boolean):void {
        return window.removeEventListener(type, listener, useCapture);
    }

}
