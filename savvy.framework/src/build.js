var fs = require("fs");
var sys = require("sys");
var exec = require("child_process").exec;

var banner = fs.readFileSync("banner.txt");
console.log(banner.toString());

console.log("Preparing output files");
var c = 0, t = 4;
fs.unlink("../savvy.js", noop);
fs.unlink("../savvy.min.js", noop);
fs.unlink("../savvy.d.ts", noop);
fs.unlink("../savvy.min.map", noop);
function noop(){
    c++;
    if (c == t) compile();
};

function compile() {
	console.log("Compiling using TypeScript");
    exec("tsc --declaration --target ES5 --out ../savvy.js card.ts jxon.ts application.ts init.ts main.ts transitions.ts eval.ts", function (error, stdout, stderr) {
        if (error) sys.puts(stderr);
        else compress();
    });
}

function compress() {
	console.log("Optomising using Google Closure");
    // NB: Java 7 required: https://code.google.com/p/closure-compiler/wiki/FAQ#The_compiler_crashes_with_UnsupportedClassVersionError_or_Unsupp
    // Download from: http://java.com
    exec("java -jar ../closure/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS --language_in ECMASCRIPT5_STRICT --create_source_map ../savvy.min.map --js ../savvy.js --js_output_file ../savvy.min.js",
         function (error, stdout, stderr) {
             if (error) sys.puts(stderr);
             else license();
    });
}

function license() {
	console.log("Concatenating license and source");
    
    var license = fs.readFileSync("license.txt");
    var header = "/*\n" + banner + "\n   Version: 0.3.0\n" + license + "*/\n\n";
    
    var src = fs.readFileSync("../savvy.js");
    var min = fs.readFileSync("../savvy.min.js");
    
    fs.writeFileSync("../savvy.js", header);
    fs.appendFileSync("../savvy.js", src);
    
    fs.writeFileSync("../savvy.min.js", header);
    fs.appendFileSync("../savvy.min.js", min);
}