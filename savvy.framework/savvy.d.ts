declare module Card {
    var READY: string;
    var ENTER: string;
    var EXIT: string;
    var LOAD: string;
}
declare module JXON {
    function parse(parent: any): any;
}
declare module application {
    var id: string;
    var version: string;
    var defaultPath: any;
    /**
    * An array of HTMLElements that are the Cards of the Savvy application
    */
    var cards: HTMLElement[];
    function read(url: string, asXML?: boolean): any;
}
declare module Savvy {
    /**
    * Parses a JSON file to a variable.
    * @param url The URL of the JSON file to load.
    * @param target The name of the variable to set with the data from the JSON file
    * @param context The object within which target should exist (defaults to window)
    */
    function _parseJSONToTarget(url: string, target: string, context?: any): void;
}
declare module Savvy.history {
    var _currentCard: HTMLElement;
    var _ignoreHashChange: boolean;
    function _getPathFromURLHash(): string;
    function _getIdForPath(path: string): string;
}
declare module Savvy {
}
/**
* The main Savvy object
*/
declare module Savvy {
    /**
    * The function called by application.goto
    * @param path A path to a new card. This must be a card ID or a string beginning with a card ID followed by a slash. Further characters may follow the slash.
    */
    function _goto(path: string, transition?: SavvyTransition, preventHistory?: boolean): void;
}
interface SavvyTransition {
    from: string;
    to: string;
    duration: number;
    toIsForemost: Boolean;
    inverse: SavvyTransition;
}
declare module Transition {
    var CUT: SavvyTransition;
    var COVER_LEFT: SavvyTransition;
    var UNCOVER_LEFT: SavvyTransition;
    var COVER_RIGHT: SavvyTransition;
    var UNCOVER_RIGHT: SavvyTransition;
}
declare module Savvy {
    function _eval(code: string, context?: any): void;
}
