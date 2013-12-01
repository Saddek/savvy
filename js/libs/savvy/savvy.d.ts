// Extend the window object to add the _screen Object
interface Window {
    _screen: any;
}

// Declare _screen for use in TypeScript source
declare var _screen: any;

// A static definition of Savvy module
class SavvyStatic {
	// Get the Savvy DIVs
	getScreen():HTMLElement;
	getGlobal():HTMLElement;

    // Initialise Savvy (can only be called once)
    start():void;

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

