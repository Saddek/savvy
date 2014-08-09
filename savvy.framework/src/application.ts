module application {
    
    export var id:string = null;
    export var isCordova:boolean = false;
    export var version:string = null;
    
    export var cards:HTMLElement[] = [];
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
        var main:HTMLElement = <HTMLElement> document.body.querySelector("main");
        if (typeof left == "undefined") {
            if (main.style.left == "" || main.style.left == "0px") left = Transition.OFF_CANVASS_LEFT;
            else left = "0px";
        }
        // shortcut to handle quick toggling
        if (main.style.left == left) left = "0px";
        
        // apply the style
        main.style.left = left;
    }

}
