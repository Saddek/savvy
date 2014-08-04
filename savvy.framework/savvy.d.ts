declare module Card {
    var READY: string;
    var ENTER: string;
    var EXIT: string;
    var LOAD: string;
}
declare module JXON {
    function parse(parent: any): any;
}
interface Document {
    cards: HTMLElement[];
    goto(path: string): void;
}
declare module application {
    var id: string;
    var version: string;
    var defaultPath: any;
    function read(url: string, asXML?: boolean): any;
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
    * The function called by document.goto
    * @param path A path to a new card. This must be a card ID or a string beginning with a card ID followed by a slash. Further characters may follow the slash.
    */
    function _goto(path: string, transition?: ITransition, preventHistory?: boolean): void;
}
interface ITransition {
    from: string;
    to: string;
    duration: number;
    inverse: ITransition;
}
declare module Transition {
    var CUT: ITransition;
    var SLIDE_LEFT: ITransition;
    var SLIDE_RIGHT: ITransition;
    var COVER_LEFT: ITransition;
    var COVER_RIGHT: ITransition;
    var UNCOVER_LEFT: ITransition;
    var UNCOVER_RIGHT: ITransition;
    var COVER_LEFT_FADE: ITransition;
    var COVER_RIGHT_FADE: ITransition;
    var UNCOVER_LEFT_FADE: ITransition;
    var UNCOVER_RIGHT_FADE: ITransition;
}
declare module Savvy {
    function _eval(code: string, context?: any): void;
}
