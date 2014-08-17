#!/usr/bin/env node

/*

   .x+=:.                  _            _                      
  z`    ^%                u            u            ..         
     .   <k              88Nu.   u.   88Nu.   u.   @L          
   .@8Ned8"       u     '88888.o888c '88888.o888c 9888i   .dL  
 .@^%8888"     us888u.   ^8888  8888  ^8888  8888 `Y888k:*888. 
x88:  `)8b. .@88 "8888"   8888  8888   8888  8888   888E  888I 
8888N=*8888 9888  9888    8888  8888   8888  8888   888E  888I 
 %8"    R88 9888  9888    8888  8888   8888  8888   888E  888I 
  @8Wou 9%  9888  9888   .8888b.888P  .8888b.888P   888E  888I 
.888888P`   9888  9888    ^Y8888*""    ^Y8888*""   x888N><888' 
`   ^"F     "888*""888"     `Y"          `Y"        "88"  888  
             ^Y"   ^Y'                                    88F  
                                                         98"   
                                                       ./"     
                                                      ~`       

   Copyright 2014 Oliver Moran

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

var t1 = new Date(); // start time

var Path = require("path");
var package = require(Path.resolve("package.json"));

// console arguments
var argv = require("yargs")
           .example("$0 init [target]", "Create an new project")
           .example("$0 [source] --out [target]", "Build an applicaiton")
           .string("out")
           .version(package.version, "version")
           .boolean("clean")
           .boolean("nocompress")
           .describe("clean", "Emtpies the target directory before the operation.")
           .describe("nocompress", "Disables HTML, CSS and JavaScript compression.")
           .describe("nocache", "Disables offline caching.")
           .check(function (argv) {
               if (typeof argv._[0] == "string" && typeof argv.out == "string") return true;
               if (argv._[0] == "init" && typeof argv._[1] == "string") return true;
               throw "";
           })
           .argv;

var FS = require("fs");
var NCP = require("ncp").ncp;
var UglifyJS = require("uglify-js");
var RMDIR = require("rimraf");
var Walk = require("walk");
var Sys = require("sys");
var Exec = require("child_process").exec;
var CleanCSS = require("clean-css");
var Handlebars = require("Handlebars");
var XML2JS = require("xml2js");
var HTMLMinify = require("html-minifier").minify;
var MKDIRP = require("mkdirp");

var banner = FS.readFileSync("banner.txt");
NCP.limit = 16;

var git = /\.git$/i;
var dot = /^\..*$/i; // any dot file
function filter(path) {
    if (path == __dirname) return false;
    if (git.test(path)) return false;
    
    var file = Path.basename(path);
    if (dot.test(file)) return false;
    return true;
}

var src, out, out_rel;

if (typeof argv.out == "string") {
    console.log(banner.toString());
    console.log("Version: " + package.version);
    console.log("---");

    src = Path.resolve(argv._[0]);
    out = Path.resolve(argv.out);
    // for some reason the walk library needs a relative path
    out_rel = Path.relative(__dirname, out);

    if (argv.clean) clean();
    else source();
} else {
    // init a directory
    var dir = Path.resolve(argv._[1]);
    if (argv.clean) {
        RMDIR(dir, function(err){
            if (err) return console.log(err);
            init();
        });
    }
    else init();
    
    function init() {
        MKDIRP(dir, function (err) {
            if (err) return console.error(err);
            NCP(Path.resolve("project"), dir, {filter: filter}, function (err) {
                if (err) return console.error(err);
                console.log("Created project at: " + dir);
            });
        });
    }
}

function clean() {
    console.log("Cleaning output directory...");
    RMDIR(out, function(err){
        if (err) return console.log(err);
        source();
    });
}

function source() {
    console.log("Copying source files...");
    MKDIRP(out, function (err) {
        if (err) return console.error(err);
        NCP(src, out, {filter: filter}, function (err) {
            if (err) return console.error(err);
            framework();
        });
    });
}

function framework() {
    console.log("Copying framework files...");
    NCP(Path.resolve("framework"), out, {filter: filter}, function (err) {
        if (err) return console.error(err);
        compile();
    });
}

var options = {
    followLinks: false,
    filters: ["savvy.framework"]
};

var typescript = /\.ts$/i;
var coffeescript = /\.coffee$/i;
var dart = /\.dart$/i;
var sass = /\.scss$/i;
var less = /\.less$/i;
var handlebars = /\.handlebars$/i;

function compile() {
    var walker = Walk.walk(out_rel, options);
    walker.on("file", function (root, file, next) {
        var cmd;
        var path = Path.join(root, file.name);
        if (typescript.test(file.name)) cmd = "tsc --declaration --target ES5 " + path;
        if (coffeescript.test(file.name)) cmd = "coffee --compile " + path;
        if (dart.test(file.name)) cmd = "dart2js " + path + " --out=" + path.substr(0, path.length - 5) + ".js";
        if (sass.test(file.name)) cmd = "sass " + path;
        if (less.test(file.name)) cmd = "lessc " + path;
        if (handlebars.test(file.name)) cmd = "handlebars " + path;

        if (cmd) {
            console.log("Compiling: " + path);
            Exec(cmd, function (error, stdout, stderr) {
                if (error) Sys.puts(stderr);
                else next();
            });
        } else next();
    });

    walker.on("end", function () {
        if (argv.nocompress) remove();
        else compress();
    });
}

var css = /\.css$/i;
var javascript = /\.js$/i;
var html = /\.html$/i;

var compressor_options = {
    sequences: true,
    properties: true,
    dead_code: true,
    drop_debugger: true,
    conditionals: true,
    comparisons: true,
    evaluate: true,
    booleans: true,
    loops: true,
    unused: true,
    hoist_funs: false,
    hoist_vars: false,
    if_return: true,
    join_vars: true,
    cascade: true,
    warnings: true,
    negate_iife: true,
    drop_console: true
};

function compress() {
    var walker = Walk.walk(out_rel, options);
    walker.on("file", function (root, file, next) {
        var cmd;
        if (css.test(file.name)) {
            // compress CSS
            var path = Path.join(root, file.name);
            console.log("Optomising: " + Path.relative(out, path));
            var source = FS.readFileSync(path);
            var minimized = new CleanCSS().minify(source);
            // FIXME: this doesn't catch any errors
            FS.writeFileSync(path, minimized);
        }
        
        if (javascript.test(file.name)) {
            // compress js
            var path = Path.join(root, file.name);
            console.log("Optomising: " + Path.relative(out, path));
            var rel = Path.relative(out, root);
            var map = Path.join(rel, file.name + ".map");
            var result;
            try {
                result = UglifyJS.minify(path, {
                    outSourceMap: map,
                    compress: compressor_options
                });
            } catch (err) {
                // FIXME: this always assumes the error is a JS parsing error
                console.log("JavaScript error: " 
                            + err.message + " ("
                            + path + ":"
                            + err.line + ":"
                            + err.col + ")");
                process.exit(-1);
            }
            FS.writeFileSync(path, result.code);
            FS.writeFileSync(path + ".map", result.map);
        }
        
        if (html.test(file.name)) {
            // compress html
            var path = Path.join(root, file.name);
            if (path != Path.join(out_rel, "index.html")) {
                // don't compress index.html because we want to keep
                // the Savvy logo and pretty mark up in that
                console.log("Optomising: " + Path.relative(out, path));
                var source = FS.readFileSync(path);
                var minimized = HTMLMinify(source.toString(), {
                    removeComments: true,
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    minifyJS: true,
                    minifyCSS: true
                });
                // FIXME: this doesn't catch any errors
                FS.writeFileSync(path, minimized);
            }
        }
        
        next();
    });
    
    walker.on("end", function () {
        remove();
    });
}

function remove() {
    var walker = Walk.walk(out_rel);
    walker.on("file", function (root, file, next) {
        var isSourceFile = (typescript.test(file.name)) 
            || (coffeescript.test(file.name))
            || (dart.test(file.name))
            || (sass.test(file.name))
            || (less.test(file.name))
            || (handlebars.test(file.name))
            || (dot.test(file.name)); // remove dot files also
        
        if (isSourceFile) {
            var path = Path.join(root, file.name);
            console.log("Removing: " + path);
            FS.unlinkSync(path);
        }
        
        next();
    });

    walker.on("end", function () {
        xml();
    });
}

function xml() {
    console.log("Preparing configuration and manifest files...");
    
    var app = Path.join(out, "app.xml");
    FS.readFile(app, function(err, data) {
        if (err) return console.error(err);
        var parser = new XML2JS.Parser();
        parser.parseString(data, function (err, result) {
            var name = (result.app.name) ? result.app.name.toString() : "Loading...";
            var description = (result.app.description) ? result.app.description.toString() : "";
            
            var author = "";
            var email = "";
            var href = "";
            if (result.app.author[0]) {
                author = result.app.author[0]._.toString();
                email = (result.app.author[0].$.email) ? result.app.author[0].$.email.toString() : "";
                href = (result.app.author[0]) ? result.app.author[0].$.href.toString() : "";
            }
            
            var author_long = author.trim();
            if (email) author_long += " <" + email.trim() + ">";
            if (href) author_long += " (" + href.trim() + ")";
            
            var html = Path.join(out, "index.html");
            var source = FS.readFileSync(html);
            var template = Handlebars.compile(source.toString());
            FS.writeFileSync(html, template({
                title: escape2(name.trim()),
                description: escape2(description.trim()),
                author: escape2(author_long.trim()),
                manifest: (argv.nocache) ? "" : "manifest.appcache"
            }));

            var config = Path.join(out, "config.xml");
            if (result.app.$.cordova.toString().toUpperCase() == "YES") {
                var id = (result.app.$.id) ? result.app.$.id : "";
                var version = (result.app.$.version) ? result.app.$.version : "";
                
                var source = FS.readFileSync(config);
                var template = Handlebars.compile(source.toString());
                FS.writeFileSync(config, template({
                    id: id,
                    version: version,
                    name: name,
                    description: description,
                    author: author,
                    email: email,
                    href: href
                }));
            } else {
                // remove config file if we are not using cordova
                FS.unlinkSync(config);
            }
            
            var cache = Path.join(out, "manifest.appcache");
            var cache_rel = Path.relative(__dirname, cache);
            if (argv.nocache) {
                // don't cache
                // remove config file if we are not using cordova
                FS.unlinkSync(cache);
                end();
            } else {
                var source = FS.readFileSync(cache);
                var template = Handlebars.compile(source.toString());
                var files = "";
                var bytes = 0;
                var c = 0;
                var walker = Walk.walk(out_rel);
                walker.on("file", function (root, file, next) {
                    var path = Path.join(root, file.name);
                    var path_rel = Path.relative(out, path);
                    if (path_rel != "manifest.appcache") {
                        // NB: don't cache the cache
                        files += path_rel + "\n";
                        c++;
                        bytes += FS.statSync(path)["size"]
                    }
                    next();
                });
                walker.on("end", function () {
                    files += "# Count: " + c + "\n";
                    files += "# Size: " + bytesToSize(bytes);
                    var version = (result.app.$.version) ? result.app.$.version : "";
                    FS.writeFileSync(cache, template({
                        timestamp: (new Date()).toISOString(),
                        version: version,
                        files: files
                    }));

                    end();
                });
            }
        });
    });
}

// http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function bytesToSize(bytes) {
    if(bytes == 0) return '0 Byte';
    var k = 1000;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

function escape2(str){
    str = str.replace("\n", " ");
    str = str.replace("\r", " ");
    str = str.replace("\"", "''");
    return str;
}

function end() {
    var t2 = new Date(); // end time
    var sec = ((t2.getTime() - t1.getTime()) / 1e3).toFixed(2);
    console.log("---");
    console.log("Compilation complete in " + sec + " seconds.");
    console.log("A release was created in:");
    console.log(out);
}
