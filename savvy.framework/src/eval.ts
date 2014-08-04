// Evaling scripts in the main Savvy block captures internal Savvy
// methods and properties in the closure. Scripts are evaluated in
// their own block in order to provide a "clean" closure
module Savvy {
    export function _eval(code:string, context?:any):void {
        if (context === undefined) {
            (window.execScript || function (code:string):void {
                window["eval"].call(window, code);
            })(code);
        } else {
            (function(code){
                eval(code);
            }).call(context, code);
        }
    }
}