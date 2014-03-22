interface Document {
    cards:HTMLElement[];
    goto(path:string):void;
}

declare document.cards;

interface SavvyEvent extends CustomEvent {
    continueTransition:Function;
    setTransition:Function;
}

interface IStatic {
    READY:string;
    ENTER:string;
    EXIT:string;
    LOAD:string;
    
    CUT:string;
    FLIP:string;
}

declare var Savvy:ISavvy;

