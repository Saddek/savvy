// Evaling scripts in the main Savvy block captures internal Savvy
// methods and properties in the closure. Scripts are evaluated in
// their own block in order to provide a "clean" closure
module Savvy {
    export function _eval(code:string, context?:any, url?:string):void {
        if (context === undefined) {
            (window.execScript || function (code:string):void {
                try {
                    window["eval"].call(window, code);
                } catch(err) {
                    logError(err, url);
                }
            })(code);
        } else {
            (function(code){
                try {
                    eval(code);
                } catch(err) {
                    logError(err, url);
                }
            }).call(context, code);
        }
    }
    
    function logError(err:Error, url?:string):void {
        var message = err.name + ": " + err.name;
        if (url) message += " (" + url + ")";
        console.error(message);
    }
}