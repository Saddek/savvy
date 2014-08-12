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

var FS = require("fs");
var Path = require("path");
var NCP = require("ncp").ncp;
var UglifyJS = require("uglify-js");
var RMDIR = require("rimraf");
var Walk = require("walk");
var Sys = require("sys");
var Exec = require("child_process").exec;
var CleanCSS = require("clean-css");
var Handlebars = require("Handlebars");
var XML2JS = require("xml2js");
var HTMLMinify = require('html-minifier').minify;

var banner = FS.readFileSync("banner.txt");
var package = require("./package.json");
console.log(banner.toString());
console.log("Version: " + package.version);
console.log("---");

var release = Path.join(__dirname, "release");
var release_rel = Path.relative(__dirname, release);

var t1 = new Date(); // start time

NCP.limit = 16;

console.log("Cleaning release directory...");
RMDIR(release, function(err){
    if (err) return console.log(err);
    source();
});

var git = /\.git$/;

function filter(filename) {
    if (filename == __dirname) return false;
    if (git.test(filename)) return false;
    return true;
}

function source() {
    console.log("Copying source files...");
    NCP("../", release, {filter: filter}, function (err) {
        if (err) return console.error(err);
        framework();
    });
}

function framework() {
    console.log("Copying framework files...");
    NCP("./framework", release, {filter: filter}, function (err) {
        if (err) return console.error(err);
        xml();
    });
}

function xml() {
    var app = Path.join(Path.join(release, "/data"), "app.xml");
    
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
            
            var html = Path.join(release, "/index.html");
            var source = FS.readFileSync(html);
            var template = Handlebars.compile(source.toString());
            FS.writeFileSync(html, template({
                title: escape2(name.trim()),
                description: escape2(description.trim()),
                author: escape2(author_long.trim())
            }));

            var config = Path.join(release, "/config.xml");
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

            compile();
        });
    });
}

function escape2(str){
    str = str.replace("\n", " ");
    str = str.replace("\r", " ");
    str = str.replace("\"", "''");
    return str;
}

var options = {
    followLinks: false,
    filters: ["savvy.framework"]
};

var typescript = /\.ts$/;
var coffeescript = /\.coffee$/;
var dart = /\.dart$/;
var sass = /\.scss$/;
var less = /\.less$/;
var handlebars = /\.handlebars$/;

function compile() {
    var walker = Walk.walk(release_rel, options);
    walker.on("file", function (root, file, next) {
        var cmd;
        var path = Path.join(root, file.name);
        if (typescript.test(file.name)) cmd = "tsc --declaration --target ES5 " + path;
        if (coffeescript.test(file.name)) cmd = "coffee --compile " + path;
        if (dart.test(file.name)) cmd = "dart2js " + path + " --out=" + path.substr(0, path.length - 5) + ".js";
        if (sass.test(file.name)) cmd = "sass --style compressed " + path;
        if (less.test(file.name)) cmd = "lessc -x " + path;
        if (handlebars.test(file.name)) cmd = "handlebars " + path;

        if (cmd) {
            console.log("Compiling: " + path);
            Exec(cmd, function (error, stdout, stderr) {
                if (error) sys.puts(stderr);
                else next();
            });
        } else next();
    });

    walker.on("end", function () {
        compress();
    });
}

var css = /\.css$/;
var javascript = /\.js$/;
var html = /\.html$/;

function compress() {
    var walker = Walk.walk(release_rel, options);
    walker.on("file", function (root, file, next) {
        var cmd;
        if (css.test(file.name)) {
            // compress CSS
            var path = Path.join(root, file.name);
            console.log("Optomising: " + path);
            var source = FS.readFileSync(path);
            var minimized = new CleanCSS().minify(source);
            // FIXME: this doesn't catch any errors
            FS.writeFileSync(path, minimized);
        }
        
        if (javascript.test(file.name)) {
            // compress js
            var path = Path.join(root, file.name);
            console.log("Optomising: " + path);
            var rel = Path.relative(release, root);
            var map = Path.join(rel, file.name + ".map");
            var result;
            try {
                result = UglifyJS.minify(path, { outSourceMap: map });
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
            if (path != Path.join(release_rel, "index.html")) {
                // don't compress index.html because we want to keep
                // the Savvy logo and pretty mark up in that
                console.log("Optomising: " + path);
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
        clean();
    });
}

function clean() {
    var walker = Walk.walk(release_rel, options);
    walker.on("file", function (root, file, next) {
        var isSourceFile = (typescript.test(file.name)) 
            || (coffeescript.test(file.name))
            || (dart.test(file.name))
            || (sass.test(file.name))
            || (less.test(file.name));
        
        if (isSourceFile) {
            var path = Path.join(root, file.name);
            console.log("Removing: " + path);
            FS.unlinkSync(path);
        }
        
        next();
    });

    walker.on("end", function () {
        end();
    });
}

function end() {
    var t2 = new Date(); // end time
    var sec = ((t2.getTime() - t1.getTime()) / 1e3).toFixed(2);
    console.log("---");
    console.log("Compilation complete in " + sec + " seconds.");
    console.log("A release was created in:");
    console.log(release);
}