interface Document {
    screen:HTMLElement;
    goto(path:string):void;
    continue:Function;
}

declare document.screen;

interface IStatic {
    READY:string;
    ENTER:string;
    EXIT:string;
    LOAD:string;
}

declare var Savvy:ISavvy;

