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

var fs = require("fs");
var path = require("path");
var sys = require("sys");
var exec = require("child_process").exec;
var package = require(path.resolve("package.json"));

var rmdir = require("rimraf");
var mkdirp = require("mkdirp");
var ncp = require("ncp").ncp;
var uglify = require("uglify-js");

// console arguments
var argv = require("yargs")
           .usage("$0 init [--themes] [--noclean]")
           .version(package.version, "version")
           .help("help")
           .boolean("nocompress", "Don't compress the code.")
           .boolean("themes", "Only build the theme's directory")
           .boolean("noclean", "Don't clean any the target directory")
           .argv;

var location = {};
location.dist = path.resolve("dist");
location.src = path.resolve("src");
location.banner = path.join(location.dist, "banner.txt");
location.copyright = path.join(location.dist, "copyright.txt");

var compress = {
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
    drop_console: false
};

ncp.limit = 16;

function filter(filename) {
    var git = /\.git$/;
    var sass = /\.scss$/;
    if (git.test(filename)) return false;
    if (sass.test(filename)) return false;
    return true;
}

if (argv.themes) {
    if (argv.noclean) theme();
    else cleanTheme();
} else {
    if (argv.noclean) static();
    else clean();
}

function clean() {
    console.log("Cleaning dist directory...");
    rmdir(location.dist, function(err){
        if (err) return console.log(err);
        static();
    });
}

function static() {
    console.log("Copying static files...");
    var static = path.join(location.src, "static");
    ncp(static, location.dist, {}, function (err) {
        if (err) return console.error(err);
        pack();
    });
}

function pack() {
    var file = path.join(location.dist, "package.json");
    var _package = require(file);
    package.dependencies = _package.dependencies;
    package.main = _package.main;
    package.bin = _package.bin;
    package.preferGlobal = _package.preferGlobal;
    
    var json = JSON.stringify(package, null, 4);
    fs.writeFile(file, json, function (err) {
        if (err) return console.log(err);
        typescript();
    }); 
}

function typescript() {
	console.log("Compiling TypeScript files...");
    
    var typescript = path.join(location.src, "typescript");
    var ts = [
        "card.ts",
        "jxon.ts",
        "application.ts",
        "init.ts",
        "main.ts",
        "transitions.ts",
        "eval.ts"
    ];
    
    var js = path.join(location.dist, "framework", "savvy.framework", "savvy.js");
    var cmd = "tsc --declaration --target ES5 --out " + js;
    ts.forEach(function (file) {
        cmd += " " + path.join(typescript, file);
    });
    
    exec(cmd, function (error, stdout, stderr) {
        if (error) return sys.puts(stderr);
        sass();
    });
}

function sass() {
	console.log("Compiling Sass files...");
    
    var scss = path.join(location.src, "sass", "savvy.scss");
    var css = path.join(location.dist, "framework", "savvy.framework", "savvy.min.css");
    var cmd = "sass --style compressed " + scss + " " + css;
    exec(cmd, function (error, stdout, stderr) {
        if (error) sys.puts(stderr);
        else ugly();
    });
}

function ugly() {
    var js = path.join(location.dist, "framework", "savvy.framework", "savvy.js");
    var min = path.join(location.dist, "framework", "savvy.framework", "savvy.min.js");
    var map = path.join(location.dist, "framework", "savvy.framework", "savvy.min.js.map");
    
    if (argv.nocompress) {
        fs.renameSync(js, min); // simply rename js to min.js
        fs.writeFile(map, ""); // touch a map file
        license();
    } else {
        console.log("Optomising JavaScript using UglifyJS...");
        var result;
        try {
            result = uglify.minify(js, {
                outSourceMap: "savvy.min.js.map",
                compress: compress
            });
        } catch (err) {
            // FIXME: this always assumes the error is a JS parsing error
            //        and line and column come out as undefined
            console.log("JavaScript error: " 
                        + err.message + " ("
                        + path + ":"
                        + err.line + ":"
                        + err.col + ")");
            process.exit(-1);
        }

        fs.writeFileSync(min, result.code);
        fs.writeFileSync(map, result.map);
        fs.unlinkSync(js);
        license();
    }
}

function license() {
	console.log("Concatenating license and framework release files...");

    var banner = fs.readFileSync(location.banner);
    var license = fs.readFileSync(location.copyright);
    var header = "/*\n" + banner + "\n   Version: " + package.version + "\n" + license + "*/\n\n";
    
    var min = path.join(location.dist, "framework", "savvy.framework", "savvy.min.js");
    var css = path.join(location.dist, "framework", "savvy.framework", "savvy.min.css");
    
    prepend(min, header);
    prepend(css, header);
    
    themes();
}

function prepend(file, src) {
    var content = fs.readFileSync(file);
    fs.writeFileSync(file, src);
    fs.appendFileSync(file, content);
}

function cleanTheme() {
    console.log("Cleaning themes directory...");
    var dir = path.join(location.dist, "framework", "savvy.framework", "themes");
    rmdir(dir, function(err){
        if (err) return console.log(err);
        themes();
    });
}

function themes() {
    console.log("Compiling themes...");
    var dir = path.join(location.src, "themes");
    var themes = fs.readdirSync(dir).filter(function (file) {
        return fs.statSync(path.join(dir, file)).isDirectory() && file.substr(0, 1) != ".";
    });

    themes.forEach(function (theme) {
        var out_dir = path.join(location.dist, "framework", "savvy.framework", "themes", theme);
        var in_dir = path.join(dir, theme);
        
        mkdirp(out_dir, function (err) {
            if (err) return console.error(err)
            
            var scss = path.join(in_dir, "style.scss");
            var css = path.join(out_dir, "style.min.css");
            var cmd = "sass " + scss + " " + css + " --style compressed";
            
            exec(cmd, function (error, stdout, stderr) {
                if (error) return sys.puts(stderr);
                ncp(in_dir, out_dir, {filter: filter}, function (err) {
                    if (err) return console.error(err);
                });
            });
        });

    });
}
