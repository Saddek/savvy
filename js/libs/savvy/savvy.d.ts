// Extend the Document to add a screen Object
interface Window {
    _screen: any;
    // Sub-Pub mechanism
    subscribe(type:string, action:() => boolean, screen?:any):void;
    unsubscribe(type:string, action:() => boolean):void;
    publish(type:string, arg?:any):boolean;
}

// declare _screen so it is available in all contexts
declare _screen;

// document.getScreen() will return the the Savvy screen article
interface Document {
    getScreen():any;
    goto():void;
}

// A static definition of Savvy module
class SavvyStatic {
    READY:string;
    ENTER:string;
    EXIT:string;
    LOAD:string;
}

// Declare Savvy for use in TypeScript source
declare var Savvy:SavvyStatic;

