interface Document {
    cards:HTMLElement[];
    goto(path:string):void;
    continue:Function;
}

declare document.cards;

interface IStatic {
    READY:string;
    ENTER:string;
    EXIT:string;
    LOAD:string;
}

declare var Savvy:ISavvy;

