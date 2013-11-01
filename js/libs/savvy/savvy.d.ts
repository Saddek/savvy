// Extend the window object to add the _global and _screen Objects
interface Window {
    _global: any;
    _screen: any;
    subscribe(type:string, action:() => bool, screen:any):void;
    unsubscribe(type:string, action:() => bool):void;
    getInfo();
}

// Declare _global and _screen for use in TypeScript source
declare var _global: any;
declare var _screen: any;

// A static definition of Savvy module
class SavvyStatic {
	// Get the Savvy DIVs
	getScreen():HTMLElement;
	getGlobal():HTMLElement;

	// Load a new screen
	go(id?:string):void;

	// Sub-Pub mechanism
    subscribe(type:string, action:() => bool, screen:any = window):void;
    unsubscribe(type:string, action:() => bool):void;
    publish(type:string, arg:any = null):bool;

    READY:string;
    ENTER:string;
    EXIT:string;
    LOAD:string;
}

// Declare Savvy for use in TypeScript source
declare var Savvy:SavvyStatic;

