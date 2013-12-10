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
Version: 3-RC-DEV

Copyright (c) 2013 Avoca Learning
Copyright (c) 2013 Oliver Moran

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

window._screen={};var Savvy;
(function(e){function B(a,c){for(var b=0;b<m.length;b++)m[b].type===a&&m[b].action===c&&(m.splice(b,1),b--)}function s(a){for(var c=0;c<m.length;c++)m[c].screen===a&&(m.splice(c,1),c--)}function t(a,c){"undefined"===typeof c&&(c=null);var b=!0;m.forEach(function(d,f,u){d.type===a&&"function"===typeof d.action&&(b=!(!1===d.action.call(d.screen,c)||!1===b))});return b}function w(a,c){function b(){for(var c=0,b=l.length;c<b;c++)try{delete window[l[c].id]}catch(f){window[l[c].id]=null}s(window._screen);
window._screen={};O("buffer");document.getScreen().style.display="none";h(a.screen.html).forEach(function(a,c,b){document.getScreen().innerHTML+=k(a.url).data});var C=window[a.screen.id]=new P;"undefined"===typeof window[a.screen.id]&&console.error('"window.'+a.screen.id+'" could not be created.');h(a.screen.json).forEach(function(a,c,b){D(a.file.url,a.target,C)});h(a.screen.js).forEach(function(a,c,b){E(a.url,C)});this.getInfo=function(){return F(a)};t(e.READY)?d():v=d}function d(){v=Q;G(document.querySelector("article[data-role='screen']"));
for(var b=document.querySelectorAll("style[data-for='screen']"),d=0;d<b.length;d++)G(b[d]);h(a.screen.css).forEach(function(a,c,b){H(a.url,!0)});document.getScreen().setAttribute("data-role","screen");document.getScreen().style.display="block";document.title=a.screen.title||"";c||(x=!0,window.location.hash="!"+a.path);t(e.ENTER)}"undefined"===typeof c&&(c=!1);if(window._screen==window[a.screen.id])c?console.info("Request to load current screen over itself. This is usually caused by navigating back from an fragment and can be ignored."):
console.warn("Attempt to load current screen as new screen. This is unsupported behavior. Ignoring.");else{var f;I?(f=t(e.LOAD),I=!1):f=t(e.EXIT);f?b():v=b}}function y(){var a=window.location.hash,c;if(""==a||"#"==a||"#!"==a)c=q;else for(var b=0,d=l.length;b<d;b++)if(RegExp("#!/"+l[b].id+"(?=/|$)").test(a)){c=l[b];break}b="";b=a.indexOf("/");b=-1==b?"/":a.substr(b);return{screen:c,path:b}}function F(a){"undefined"===typeof a&&(a=y());return{id:a.screen.id,title:a.screen.title,isDefault:q==a.screen,
path:a.path}}function R(a){S(h(a.img));T(h(a.screens.screen));h(a.css).forEach(function(a,b,d){H(a)});h(a.html).forEach(function(a,b,d){document.body.insertAdjacentHTML("beforeend",k(a).data)});h(a.json).forEach(function(a,b,d){b=a["@target"];"string"==typeof b?D(a,b):console.error('No target attribute provided for JSON ("'+a+'")')});h(a.js).forEach(function(a,b,d){E(a)})}function H(a,c){"undefined"===typeof c&&(c=!1);var b=r.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8"),
d;b?(d=document.createElement("link"),d.setAttribute("rel","stylesheet"),d.setAttribute("type","text/css"),d.setAttribute("href",a)):(d=document.createElement("style"),d.setAttribute("type","text/css"));c&&d.setAttribute("data-for","screen");try{if(!b){var f=k(a).data,u=a.toString().lastIndexOf("/");if(-1!=u)var g=a.toString().substr(0,u+1),f=f.replace(r.css.noQuotes,"url("+g).replace(r.css.doubleQuotes,'url("'+g).replace(r.css.singleQuotes,"url('"+g);d.appendChild(document.createTextNode(f))}document.getElementsByTagName("head")[0].appendChild(d)}catch(e){console.error("Error appending CSS file ("+
a+"): "+e.toString())}}function E(a,c){var b=J(k(a));try{e._eval(b,c)}catch(d){console.error(d.toString()+"("+a+")")}}function J(a){return"string"!=typeof a.data?(console.error('Could not parse "'+a.url+'". Script files must be plain text.'),""):a.data.replace(r.includeStatement,function(c,b){for(var d=a.url,f=d.toString().lastIndexOf("/"),d=(d.toString().substr(0,f+1)+b).split("/"),f=1;f<d.length;)if(!(0>f)){".."==d[f]&&".."!==d[f-1]&&0<f&&(d.splice(f-1,2),f-=2);if("."===d[f]||""==d[f])d.splice(f,
1),f-=1;f++}d=d.join("/");return J(k(d))})}function D(a,c,b){"undefined"===typeof b&&(b=window);var d;try{var f=k(a).data;d=JSON.parse(f)}catch(u){console.error('Cannot parse data file ("'+a+'"). Please check that the file is valid JSON <http://json.org/>.');return}try{a=d;d=b;"undefined"===typeof d&&(d=window);for(var g=c.split("."),f=0;f<g.length-1;f++){var e=g[f];"undefined"==typeof d[e]&&(d[e]={});d=d[e]}d[g[f]]=a}catch(h){console.error("Could not create object: "+(b==window?"window.":"this.")+
c)}}function S(a){for(var c=0,b=a.length;c<b;c++){var d=new Image;d.src=a[c];n.add({url:d.src,data:d})}}function T(a){for(var c=0,b=a.length;c<b;c++){var d={id:a[c]["@id"],title:a[c]["@title"],html:[],css:[],js:[],json:[]};h(a[c].html).forEach(function(a,c,b){a=k(a.toString());n.add(a);d.html.push(a)});h(a[c].css).forEach(function(a,c,b){a=k(a.toString());n.add(a);d.css.push(a)});h(a[c].js).forEach(function(a,c,b){a=k(a.toString());n.add(a);d.js.push(a)});h(a[c].json).forEach(function(a,c,b){c=a["@target"];
if("string"==typeof c){var e=a.toString();a=k(e);n.add(a);d.json.push({file:a,target:c})}else console.error('No target attribute provided for JSON ("'+e+'")')});void 0!==a[c]["@default"]&&(null===q?q=d:console.warn("More than one screen is set as the default in app.xml. Ignoring."));l.push(d)}if(null===q)throw"No default screen set.";}function O(a){"undefined"===typeof a&&(a="screen");var c=document.createElement("article");c.setAttribute("data-role",a);c.style.width="100%";c.style.overflow="visible";
c.style.padding="0px";c.style.margin="0px";c.style.visibility="visible";document.body.appendChild(c)}function G(a){return a&&a.parentNode?null!==a.parentNode.removeChild(a):!1}function h(a){return[].concat(a||[])}function k(a,c){"undefined"===typeof c&&(c=!1);var b;b=n.get(a);if(null!==b.data)return b;b=new XMLHttpRequest;b.open("GET",a,!1);b.send();return 200!==b.status&&0!==b.status?(console.error("HTTP status "+b.status+" returned for file: "+a),{url:a,data:""}):b={url:a,data:c?b.responseXML:b.responseText}}
function K(a){function c(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var b=new L,d=0,f="";if(a.attributes&&0<a.attributes.length)for(d;d<a.attributes.length;d++){var e=a.attributes.item(d);b["@"+e.name.toLowerCase()]=c(e.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var g,h=0;h<a.childNodes.length;h++)g=a.childNodes.item(h),4===g.nodeType?f+=g.nodeValue:3===g.nodeType?f+=g.nodeValue.trim():1!==g.nodeType||g.prefix||(0===
d&&(b={}),e=g.nodeName.toLowerCase(),g=K(g),b.hasOwnProperty(e)?(b[e].constructor!==Array&&(b[e]=[b[e]]),b[e].push(g)):(b[e]=g,d++));b.constructor===L&&b.setValue(c(f));return b}var P=function(){function a(){window._screen=this}a.prototype.subscribe=function(a,b){e.subscribe(a,b,this)};a.prototype.unsubscribe=function(a,b){e.unsubscribe(a,b)};return a}(),M=function(){function a(c){"undefined"===typeof c&&(c=a.AUTO);this.rule=c;this._files=[]}a.prototype.add=function(c){if(this.rule!=a.NEVER&&null==
this.get(c.url).data)return this._files.push(c),c};a.prototype.get=function(a){for(var b=0,d=this._files.length;b<d;b++)if(this._files[b].url===a)return this._files[b];return{url:a,data:null}};a.AUTO="auto";a.NEVER="never";return a}(),l=[],q=null,n=new M,r={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi},
isJSIdentifier:/^[$A-Z_][0-9A-Z_$]*$/i,includeStatement:/^#include "(.*)"$/gm},Q=function(){};e.go=function(a){"undefined"===typeof a&&(a=null);if(null==a)v();else{var c=a.toString();-1!=c.indexOf("/")&&(c=c.substring(0,c.indexOf("/")));for(var b=null,d=0,f=l.length;d<f;d++)if(l[d].id==c){b=l[d];break}null==b?console.error('No screen with ID of "'+c+'".'):w({screen:b,path:"/"+a})}};document.getScreen=function(){return document.querySelector("article[data-role='buffer']")||document.querySelector("article[data-role='screen']")};
var U=function(){return function(a,c,b){"undefined"===typeof b&&(b=window);this.type=a;this.action=c;this.screen=b}}(),m=[];e.subscribe=function(a,c,b){"undefined"===typeof b&&(b=window);B(a,c);a=new U(a,c,b);m.push(a)};e.unsubscribe=B;e.READY="ready";e.ENTER="enter";e.EXIT="exit";e.LOAD="load";var L=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=function(a){this._value=a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=function(){return null===
this._value?"null":this._value.toString()};return a}(),p=K(k("data/app.xml",!0).data);if(void 0===p.app)console.error('Could not parse app.xml. "app" node missing.');else{var N="yes"==p.app["@cordova"]?"deviceready":"load";if("yes"==p.app["@cordova"]){var z=document.createElement("script");z.setAttribute("src","cordova.js");z.setAttribute("type","text/javascript");var A=document.createElement("script");A.setAttribute("src","cordova_plugins.js");A.setAttribute("type","text/javascript");document.head.appendChild(z);
document.head.appendChild(A)}window.addEventListener(N,function c(){window.removeEventListener(N,c);n.rule=void 0===p.app.cache?M.AUTO:p.app.cache;R(p.app);w(y(),!0)},!1)}var x=!1;window.addEventListener("hashchange",function(){if(x)x=!1;else{var c=y();"object"==typeof c.screen&&w(c,!0)}},!1);var I=!0,v=function(){};e.getInfo=function(){return F()}})(Savvy||(Savvy={}));
(function(e){e._eval=function(e,s){void 0===s?(window.execScript||function(e){window.eval.call(window,e)})(e):function(e){eval(e)}.call(s,e)}})(Savvy||(Savvy={}));
