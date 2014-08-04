/**
 * The main Savvy object
 */
module Savvy {

    // a blank function (defined here once to save memory and time)
	var noop:Function = ():void => {};
    // This function can be called to recommence the transition after it was caused
    var continueTransition:Function = noop;

    interface SavvyEvent extends CustomEvent {
        "continue":Function;
    }

    /**
     * The function called by document.goto
     * @param path A path to a new card. This must be a card ID or a string beginning with a card ID followed by a slash. Further characters may follow the slash.
     */
    export function _goto(path:string, transition:ITransition = Transition.CUT, preventHistory:boolean = false):void {
        var id:string = Savvy.history._getIdForPath(path);
        var to:HTMLElement = document.getElementById(id);
        var from:HTMLElement = Savvy.history._currentCard;

        if (document.cards.indexOf(to) > -1) {
            var detail:any = {
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
	function load(detail, path:string, preventHistory:boolean):void {
        var event:SavvyEvent = createSavvyEvent(detail, path, preventHistory);
        
        if (detail.from == null) {
            event.initCustomEvent(Card.LOAD, true, true, detail);
            document.body.dispatchEvent(event);
        } else {
            event.initCustomEvent(Card.EXIT, true, true, detail);
            detail.from.dispatchEvent(event);
        }

        if (event.defaultPrevented) { // check if that transition wasn't stalled
            continueTransition = ready;
        } else {
            ready.call(Savvy, detail, path, preventHistory); // NB: make sure 'this' is Savvy
        }
	}
    
    function ready(detail:any, path:string, preventHistory:boolean) {
        if (!!detail.to) {
            detail.to.style.setProperty("visibility", "hidden", "important");
            detail.to.style.setProperty("display", "block", "important");
        }
        
        var event:SavvyEvent = createSavvyEvent(detail, path, preventHistory);
        event.initCustomEvent(Card.READY, true, true, detail);
        detail.to.dispatchEvent(event);

        if (event.defaultPrevented) { // check if that transition wasn't stalled
            continueTransition = onTransition;
        } else {
            onTransition.call(Savvy, detail, path, preventHistory); // NB: make sure 'this' is Savvy
        }
    }

    function onTransition(detail:any, path:string, preventHistory:boolean) {
        // NB: prevent accidental future transitions
        continueTransition = noop;
        
        if (!!detail.to) detail.to.style.setProperty("visibility", "visible", "important");
        
        // fallback to static in case something was set up wrong in the transition
        if (!detail.transition) detail.transition = Transition.CUT;
        applyTranstition(detail.to, detail.transition.to, detail.transition.duration);
        applyTranstition(detail.from, detail.transition.from, detail.transition.duration);
        setTimeout(function(){
            // hide from and show to
            if (!!detail.from) detail.from.style.removeProperty("display");
            if (!!detail.to) detail.to.style.removeProperty("visibility");
            onEnter.call(Savvy, detail, path, preventHistory);
        }, detail.transition.duration);
    }

    function applyTranstition(el:HTMLElement, transition:string, duration:number) {
        if (el != null) { // may be the first transition
            el.className += transition;
            setTimeout(function(){
                el.className = el.className.replace(transition, "");
            }, duration);
        }
    }

    function onEnter(detail:any, path:string, preventHistory:boolean) {
        document.title = (detail.to.title || "");
        if(!preventHistory) {
            Savvy.history._ignoreHashChange = true;
            window.location.hash = "!/" + path;
        }

        var event:SavvyEvent = createSavvyEvent(detail, path, preventHistory);

        Savvy.history._currentCard = detail.to;
        event.initCustomEvent(Card.ENTER, true, true, detail);
        detail.to.dispatchEvent(event);
    }
    
    function createSavvyEvent(detail, path, preventHistory):SavvyEvent {
        var event:SavvyEvent = <SavvyEvent> document.createEvent("CustomEvent");
        continueTransition = noop;
        event["continue"] = ():void => {
            continueTransition.call(Savvy, detail, path, preventHistory); // NB: make sure 'this' is Savvy
        }
        return event;
    }

}