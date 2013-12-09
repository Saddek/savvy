// Extend the Document to add a screen Object
interface HTMLBodyElement {
    screen: any;
}

// A static definition of Savvy module
class SavvyStatic {
	// Get the Savvy DIVs
	getScreen():HTMLElement;

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

