module Application {
    export var READY:string = "savvy-load";
}

// extend the Navigator interface so that TypeScript
// knows about the standalone property
interface Navigator {
    standalone:boolean;
}

module application {
    
    export var name:string = null;
    export var id:string = null;
    export var isCordova:boolean = false;
    export var version:string = null;
    
    export var cards:HTMLElement[] = [];
    export var header:HTMLElement = null;
    export var footer:HTMLElement = null;
    export var main:HTMLElement = null;
    export var defaultCard:HTMLElement = null;
    export var currentCard:HTMLElement = null;
    
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
