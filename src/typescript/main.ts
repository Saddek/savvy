module Savvy {

    application["goto"] = (path:string, transition:Transition = Transition.CUT, preventHistory:boolean = false):void => {
        if (typeof path == "string") {
            goto.call(Savvy, path, transition, preventHistory);
        } else {
            throw "A string indicating a card ID must be passed to document.goto method.";
        }
    }

    var ignoreHashChange:boolean = false;
    window.addEventListener("hashchange", function () {
        if (ignoreHashChange) {
            ignoreHashChange = false;
        } else {
            var path:string = application.getRoute();
            var id:string = getIdForPath(path);
            var card = document.getElementById(id);
            if (application.cards.indexOf(card) > -1) {
                // don't load a route that doesn't exist
                application.goto(path, Transition.CUT, true);
            }
        }
    }, false);

    function getIdForPath(path:string):string {
        var i:number = path.indexOf("/");
        var id:string = (i > -1) ? path.substr(0, i) : path;
        return id;
    }
    
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
    function goto(path:string, transition:Transition = Transition.CUT, preventHistory:boolean = false):void {
        // FIXME: need to add a queuing sytem so that transitions don't get muddled up if done in quick succession
        var id:string = getIdForPath(path);
        var to:HTMLElement = document.getElementById(id);
        var from:HTMLElement = application.currentCard;
        
        if (to == from) {
            console.warn("Application was asked to go to current card. Ignoring.");
            return; // get out of here
        }

        if (application.cards.indexOf(to) > -1) {
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
            event.initCustomEvent(Application.READY, false, true, detail);
            // manually dispatch the event to everyone who sould be listening
            // this is because we want to "capture" from ancestor to descendants
            window.dispatchEvent(event);
            document.dispatchEvent(event);
            document.body.dispatchEvent(event);
            if (application.main) application.main.dispatchEvent(event);
            if (application.header) application.header.dispatchEvent(event);
            if (application.footer) application.footer.dispatchEvent(event);
            application.cards.forEach(function(card:HTMLElement){
                card.dispatchEvent(event);
            });
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
            ignoreHashChange = true;
            window.location.hash = "!/" + path;
        }

        var event:SavvyEvent = createSavvyEvent(detail, path, preventHistory);

        application.currentCard = detail.to;
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