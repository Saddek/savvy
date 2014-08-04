interface SavvyTransition {
    from:string;
    to:string;
    duration:number;
    toIsForemost:Boolean;
    inverse:SavvyTransition;
}

module Transition {
    
    export var CUT:SavvyTransition = {
        from: "static",
        to: "static",
        duration: 0,
        toIsForemost: true,
        inverse:Transition.CUT
    }

    export var COVER_LEFT:SavvyTransition = {
        from: "static",
        to: "coverLeft",
        duration: 250,
        toIsForemost: true,
        inverse: Transition.UNCOVER_LEFT
    }

    export var UNCOVER_LEFT:SavvyTransition = {
        to: "static",
        from: "uncoverLeft",
        duration: 333,
        toIsForemost: false,
        inverse: Transition.COVER_LEFT
    }

    export var COVER_RIGHT:SavvyTransition = {
        from: "static",
        to: "coverRight",
        duration: 250,
        toIsForemost: true,
        inverse: Transition.UNCOVER_RIGHT
    }

    export var UNCOVER_RIGHT:SavvyTransition = {
        to: "static",
        from: "uncoverRight",
        duration: 333,
        toIsForemost: false,
        inverse: Transition.COVER_RIGHT
    }

}