#!/usr/bin/env node

/*

   .x+=:.                  _dir            _                      
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

var FS = require("fs");
var Path = require("path");
var package = require(Path.resolve(__dirname, "package.json"));

// console arguments
var argv = require("yargs")
           .usage("Builds a Savvy project or creates an empty Savvy project.")
           .example("$0 -create [target]", "Create an empty project")
           .example("$0 --src [source] --out [target]", "Build an application")
           .example("$0 --src [source] --zip [target]", "Build an zipped application")
           .example("$0 --src [source] --port [port]", "Build an application served over HTTP.")
           .version(package.version, "version")
           .help("help")
           .string("create")
           .string("src")
           .string("out")
           .string("zip")
           .string("port")
           .boolean("clean")
           .boolean("nocompress")
           .boolean("nocache")
           .boolean("verbose")
           .boolean("warn")
           .boolean("console")
           .alias("v", "verbose")
           .describe("create", "A directory to initialise with a basic application.")
           .describe("src", "A directory containing the application source.")
           .describe("out", "A directory to build the application in.")
           .describe("zip", "A zip file to built the application in.")
           .describe("port", "A HTTP port to serve the built application from.")
           .describe("clean", "Empties the target directory before the operation.")
           .describe("nocompress", "Disables HTML, CSS and JavaScript compression.")
           .describe("nocache", "Disables offline caching.")
           .describe("warn", "Show JavaScript compilation warnings.")
           .describe("verbose", "Enable verbose logging.")
           .describe("console", "Don't strip console commands from JavaScript.")
           .check(function (argv) {
               if ("string" == typeof argv.create) return true;
               if ("string" == typeof argv.src && "string" == typeof argv.out) return true;
               if ("string" == typeof argv.src && "string" == typeof argv.zip) return true;
               if ("string" == typeof argv.src && "string" == typeof argv.port) return true;
               throw "";
           })
           .argv;

var banner = FS.readFileSync(Path.resolve(__dirname, "banner.txt"));
console.info(banner.toString());

var OS = require('os')
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
var Archiver = require("archiver");
var UUID = require('node-uuid');
var Express = require('express');
var IP = require("ip");
var gzip = require("compression");

NCP.limit = 16;

var git = /\.git$/i;
var dot = /^\..*$/i; // any dot file
var pgbomit = /^\.pgbomit$/
function filter(path) {
    // don't include the savvy CLI directory
    if (path == __dirname) return false;
    var file = Path.basename(path);
    if (dot.test(file) && !pgbomit.test(file)) return false;
    if (git.test(path)) return false;
        
    return true;
}

function log(str) {
    if (argv.verbose) console.log(str);
}

var src, out, out_rel, t1;

if (argv.create)  {
    // init a directory
    var dir = Path.resolve(argv.create);
    if (argv.clean) {
        RMDIR(dir, function(err){
            if (err) throw err;
            init();
        });
    } else init();
    
    function init() {
        MKDIRP(dir, function (err) {
            if (err) throw err;
            NCP(Path.resolve(__dirname, "project"), dir, {filter: filter}, function (err) {
                if (err) throw err;
                console.info("Created project at: " + dir);
                if (argv.src) setup();
            });
        });
    }
} else if (argv.src) setup();

function setup() {
    src = Path.resolve(argv.src);
    console.info("Building project from: " + src);
    build();
}

function build() {
    t1 = new Date(); // start time
    out = Path.join(OS.tmpdir(), UUID.v4());
    MKDIRP(out, function (err) {
        // for some reason the walk library needs a relative path
        out_rel = Path.relative(process.cwd(), out);
        source();
    });
}

function source() {
    log("Copying source files...");
    MKDIRP(out, function (err) {
        if (err) throw err;
        NCP(src, out, {filter: filter}, function (err) {
            if (err) throw err;
            framework();
        });
    });
}

function framework() {
    log("Copying framework files...");
    NCP(Path.resolve(__dirname, "framework"), out, {filter: filter}, function (err) {
        if (err) throw err;
        compile();
    });
}

var options = {
    followLinks: false,
    filters: ["savvy.framework"]
};

var typescript = /[^d]\.ts$/i;
var coffeescript = /\.coffee$/i;
var cpp = /\.cpp$/i;
var sass = /\.scss$/i;
var less = /\.less$/i;
var handlebars = /\.handlebars$/i;

function compile() {
    var walker = Walk.walk(out_rel, options);
    walker.on("file", function (root, file, next) {
        var cmd;
        var path = Path.resolve(root, file.name);
        var path2 = path.substr(0, path.lastIndexOf("."));
        
        if (typescript.test(file.name)) cmd = "tsc --declaration --target ES5 " + path + " --out " + path2 + ".js";
        if (coffeescript.test(file.name)) cmd = "coffee --compile " + path;
        if (cpp.test(file.name)) cmd = "emcc " + path + " -O2 --memory-init-file 0 -o " + path2 + ".js" ;
        if (sass.test(file.name)) cmd = "sass " + path + " " + path2 + ".css";
        if (less.test(file.name)) cmd = "lessc " + path + " " + path2 + ".css";
        if (handlebars.test(file.name)) cmd = "handlebars " + path + " --output " + path2 + ".js";

        if (cmd) {
            log("Compiling: " + Path.relative(out, path));
            Exec(cmd, function (error, stdout, stderr) {
                if (error) {
                    console.log(cmd);
                    throw stderr.toString();
                }
                next();
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
    warnings: (argv.warn || argv.verbose),
    negate_iife: true,
    drop_console: (!argv.console)
};

function compress() {
    var walker = Walk.walk(out_rel, options);
    walker.on("file", function (root, file, next) {
        var cmd;
        if (css.test(file.name)) {
            // compress CSS
            var path = Path.resolve(root, file.name);
            log("Optomising: " + Path.relative(out, path));
            var source = FS.readFileSync(path);
            var minimized = new CleanCSS().minify(source);
            // FIXME: this doesn't catch any errors
            FS.writeFileSync(path, minimized);
        }
        
        if (javascript.test(file.name)) {
            // compress js
            var path = Path.resolve(root, file.name);
            var path_rel = Path.relative(out, path);
            if (path_rel != "cordova.js") {
                log("Optomising: " + Path.relative(out, path_rel));
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
                    //        and line and column come out as undefined
                    throw "JavaScript error: " + err.message + " (" + path + ":" + err.line + ":" + err.col + ")";
                }
                FS.writeFileSync(path, result.code);
                FS.writeFileSync(path + ".map", result.map);
            }
        }
        
        if (html.test(file.name)) {
            // compress html
            var path = Path.resolve(root, file.name);
            if (path != Path.resolve(out, "index.html")) {
                // don't compress index.html because we want to keep
                // the Savvy logo and pretty mark up in that
                log("Optomising: " + Path.relative(out, path));
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
            || (cpp.test(file.name))
            || (sass.test(file.name))
            || (less.test(file.name))
            || (handlebars.test(file.name));
        
        if (isSourceFile) {
            var path = Path.join(root, file.name);
            log("Removing: " + Path.relative(out, path));
            FS.unlinkSync(path);
        }
        
        next();
    });

    walker.on("end", function () {
        xml();
    });
}

function xml() {
    log("Reading config.xml and preparing index.html...");
    
    var config = Path.join(out, "config.xml");
    FS.readFile(config, function(err, data) {
        if (err) throw err;
        var parser = new XML2JS.Parser({
            trim: true,
            normalize: true
        });
        parser.parseString(data, function (err, result) {
            var name = (result.widget.name) ? result.widget.name.toString() : "Loading...";
            var description = (result.widget.description) ? result.widget.description.toString() : "";
            
            var author = "";
            var email = "";
            var href = "";
            if (result.widget.author[0]) {
                author = result.widget.author[0]._.toString();
                email = (result.widget.author[0].$.email) ? result.widget.author[0].$.email.toString() : "";
                href = (result.widget.author[0]) ? result.widget.author[0].$.href.toString() : "";
            }
            
            var author_long = author;
            if (email) author_long += " <" + email + ">";
            if (href) author_long += " (" + href + ")";
            
            var html = Path.join(out, "index.html");
            var source = FS.readFileSync(html);
            var template = Handlebars.compile(source.toString());
            FS.writeFileSync(html, template({
                title: escape2(name),
                description: escape2(description),
                author: escape2(author_long),
                manifest: (argv.nocache) ? "" : "manifest.appcache"
            }));
    
            var version = (result.widget.$.version) ? result.widget.$.version : "";
            cache(version);
        });
    });
}

function cache(version) {
    var cache = Path.join(out, "manifest.appcache");
    var cache_rel = Path.relative(out, cache);
    if (argv.nocache) {
        // don't cache
        // remove app cache is the author doesn't want this
        FS.unlinkSync(cache);
        zip();
    } else {
        log("Generating app cache...");
        
        var source = FS.readFileSync(cache);
        var template = Handlebars.compile(source.toString());
        var fileList = [];
        var excludeList = [];
        var walker = Walk.walk(out_rel);

        walker.on("file", function (root, file, next) {
            var path = Path.join(root, file.name);
            var path_rel = Path.relative(out, path);
            if (path_rel != "manifest.appcache") {
                // NB: don't cache the cache
                fileList.push(path_rel);
            }
            if (pgbomit.test(file.name)) {
                // NB: don't cache files that will be removed
                var dir = Path.relative(out, root);
                excludeList.push(dir);
            }
            next();
        });
        walker.on("end", function () {
            var bytes = 0;
            var fileList2 = [];
            fileList.forEach(function (file) {
                var exclude = false;
                for (var i=0; i<excludeList.length; i++) {
                    if (file.indexOf(excludeList[i]) == 0) {
                        exclude = true;
                    }
                }
                if (!exclude) {
                    var path = Path.join(out, file);
                    bytes += FS.statSync(path)["size"];
                    // NB: make sure to encodeURI this (spaces have meaning in app cache)
                    fileList2.push(encodeURI(file));
                }
            });

            var files = fileList2.join("\n");
            files += "\n# Count: " + fileList2.length + "\n";
            files += "# Size: " + bytesToSize(bytes);
            FS.writeFileSync(cache, template({
                timestamp: (new Date()).toISOString(),
                version: version,
                files: files
            }));

            zip();
        });
    }
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

function zip() {
    if (argv.zip) {
        log("Creating zip package...");
        var path = Path.resolve(argv.zip);
        var output = FS.createWriteStream(path);
        output.on("close", function () {
            if (argv.clean) clean();
            else copy();
        });

        var archive = Archiver("zip");
        archive.on("error", function(err){
            throw err;
        });

        archive.pipe(output);
        archive.bulk([
            { expand: true, cwd: out, src: ['**'] }
        ]);
        archive.finalize();
    } else {
        if (argv.clean) clean();
        else copy();
    }
}

function clean() {
    if (argv.clean && argv.out) {
        log("Cleaning output directory...");
        var path = argv.out;
        RMDIR(path, function(err){
            if (err) throw err;
            copy();
        });
    } else {
        copy();
    }
}

function copy(){
    if (argv.out) {
        log("Copying build to output directory...");
        var path = Path.resolve(process.cwd(), argv.out);
        NCP(out, path, {}, function (err) {
            if (err) throw err;
            serve();
        });
    } else {
        serve();
    }
}

function serve(){
    if (argv.port) {
        log("Initialings HTTP server...");
        var server = Path.join(OS.tmpdir(), UUID.v4());
        NCP(out, server, {}, function (err) {
            if (err) throw err;

            var Express = require('express');
            var app = Express();
            app.use(gzip());
            app.get('/*', function(req, res, next){
                res.header("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
                res.header("Pragma", "no-cache"); // HTTP 1.0.
                res.header("Expires", "0"); // Proxies.
                next(); // http://expressjs.com/guide.html#passing-route control
            });
            app.use(Express.static(server));
            app.listen(argv.port);

            end();
        });
    } else {
        end();
    }
}

function end() {
    log("Removing temporary files...");
    RMDIR(out, function(err){
        if (err) throw err;
        
        var t2 = new Date(); // end time
        var sec = ((t2.getTime() - t1.getTime()) / 1e3).toFixed(2);
        console.info("Compilation complete in " + sec + " seconds.");
        if (argv.out) {
            var path = Path.resolve(argv.out);
            console.info("A build was created at: " + path);
        }
        if (argv.zip) {
            var path = Path.resolve(argv.zip);
            console.info("A zipped package was created at: " + path);
        }
        if (argv.port) { // start the server
            console.info("The build is being served at: http://" + IP.address() + ":" + argv.port + "/");
        }
    });
}