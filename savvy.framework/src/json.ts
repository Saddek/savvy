module Savvy {
    /**
     * Parses a JSON file to a variable.
     * @param url The URL of the JSON file to load.
     * @param target The name of the variable to set with the data from the JSON file
     * @param context The object within which target should exist (defaults to window)
     */
    export function _parseJSONToTarget(url:string, target:string, context:any = window):void {
        var data:any;
        try {
            var src:any = application.read(url); // prevent caching always with JSON (presume it is an API)
            data = JSON.parse(src);
        } catch (err) {
            console.error("Cannot parse data file (\"" + url + "\"). Please check that the file is valid JSON <http://json.org/>.");
            return;
        }
        
        try {
            createObjectFromString(target, data, context);
        } catch(err) {
            console.error("Could not create object: " + ((context == window) ? "window." : "this.") + target);
            return;
        }
    }
    
    /**
     * Finds or attempts to create an object given an ancestor object and a path to a descendant
     * @param target a String path to the descendant object (e.g. child.obj)
     * @param context an Object to act as the ancestor (defaults to window)
     * @return the child object or null if it could not be created
     */
    function createObjectFromString(target:string, data:any, context:any = window):any {
        var arr:string[] = target.split(".");
        
        for (var i:number=0; i<arr.length - 1; i++) {
            var id = arr[i];
            if (typeof context[id] == "undefined") {
                context[id] = {};
            }
            context = context[id];
        }

        context = context[arr[i]] = data;

        return context;
    }

}