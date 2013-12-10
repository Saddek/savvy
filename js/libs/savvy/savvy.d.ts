// Extend the Document to add a screen Object
interface Window {
    _screen: any;
}

// declare screen so it is available in all contexts
declare screen;

// document.getScreen() will return the the Savvy screen article
interface Document {
    getScreen():any
}

// A static definition of Savvy module
class SavvyStatic {
	// Load a new screen
	go(id?:string):void;

	// Sub-Pub mechanism
    subscribe(type:string, action:() => bool, screen:any = window):void;
    unsubscribe(type:string, action:() => bool):void;

    READY:string;
    ENTER:string;
    EXIT:string;
    LOAD:string;
}

// Declare Savvy for use in TypeScript source
declare var Savvy:SavvyStatic;

