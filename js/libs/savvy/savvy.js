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

var Savvy;
(function(e){function A(a,c){for(var b=0;b<l.length;b++)l[b].type===a&&l[b].action===c&&(l.splice(b,1),b--)}function s(a){for(var c=0;c<l.length;c++)l[c].screen===a&&(l.splice(c,1),c--)}function t(a,c){"undefined"===typeof c&&(c=null);var b=!0;l.forEach(function(d,f,U){d.type===a&&"function"===typeof d.action&&(b=!(!1===d.action.call(d.screen,c)||!1===b))});return b}function v(a,c){function b(){for(var c=0,b=h.length;c<b;c++)try{delete window[h[c].id]}catch(f){window[h[c].id]=null}s(document.body.screen);document.body.screen=
{};N("buffer");e.getScreen().style.display="none";g(a.screen.html).forEach(function(a,c,b){e.getScreen().innerHTML+=k(a.url).data});var B=window[a.screen.id]=new O;"undefined"===typeof window[a.screen.id]&&console.error('"window.'+a.screen.id+'" could not be created.');g(a.screen.json).forEach(function(a,c,b){C(a.file.url,a.target,B)});g(a.screen.js).forEach(function(a,c,b){D(a.url,B)});this.getInfo=function(){return E(a)};t(e.READY)?d():u=d}function d(){u=P;F(document.querySelector("article[data-role='screen']"));
for(var b=document.querySelectorAll("style[data-for='screen']"),d=0;d<b.length;d++)F(b[d]);g(a.screen.css).forEach(function(a,c,b){G(a.url,!0)});e.getScreen().setAttribute("data-role","screen");e.getScreen().style.display="block";document.title=a.screen.title||"";c||(w=!0,window.location.hash="!"+a.path);t(e.ENTER)}"undefined"===typeof c&&(c=!1);if(document.body.screen==window[a.screen.id])c?console.info("Request to load current screen over itself. This is usually caused by navigating back from an fragment and can be ignored."):
console.warn("Attempt to load current screen as new screen. This is unsupported behavior. Ignoring.");else{var f;H?(f=t(e.LOAD),H=!1):f=t(e.EXIT);f?b():u=b}}function x(){var a=window.location.hash,c;if(""==a||"#"==a||"#!"==a)c=q;else for(var b=0,d=h.length;b<d;b++)if(RegExp("#!/"+h[b].id+"(?=/|$)").test(a)){c=h[b];break}b="";b=a.indexOf("/");b=-1==b?"/":a.substr(b);return{screen:c,path:b}}function E(a){"undefined"===typeof a&&(a=x());return{id:a.screen.id,title:a.screen.title,isDefault:q==a.screen,
path:a.path}}function Q(a){R(g(a.img));S(g(a.screens.screen));g(a.css).forEach(function(a,b,d){G(a)});g(a.html).forEach(function(a,b,d){document.body.insertAdjacentHTML("beforeend",k(a).data)});g(a.json).forEach(function(a,b,d){b=a["@target"];"string"==typeof b?C(a,b):console.error('No target attribute provided for JSON ("'+a+'")')});g(a.js).forEach(function(a,b,d){D(a)})}function G(a,c){"undefined"===typeof c&&(c=!1);var b=r.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8"),
d;b?(d=document.createElement("link"),d.setAttribute("rel","stylesheet"),d.setAttribute("type","text/css"),d.setAttribute("href",a)):(d=document.createElement("style"),d.setAttribute("type","text/css"));c&&d.setAttribute("data-for","screen");try{if(!b){var f=k(a).data,e=a.toString().lastIndexOf("/");if(-1!=e)var m=a.toString().substr(0,e+1),f=f.replace(r.css.noQuotes,"url("+m).replace(r.css.doubleQuotes,'url("'+m).replace(r.css.singleQuotes,"url('"+m);d.appendChild(document.createTextNode(f))}document.getElementsByTagName("head")[0].appendChild(d)}catch(g){console.error("Error appending CSS file ("+
a+"): "+g.toString())}}function D(a,c){var b=I(k(a));try{e._eval(b,c)}catch(d){console.error(d.toString()+"("+a+")")}}function I(a){return"string"!=typeof a.data?(console.error('Could not parse "'+a.url+'". Script files must be plain text.'),""):a.data.replace(r.includeStatement,function(c,b){for(var d=a.url,f=d.toString().lastIndexOf("/"),d=(d.toString().substr(0,f+1)+b).split("/"),f=1;f<d.length;)if(!(0>f)){".."==d[f]&&".."!==d[f-1]&&0<f&&(d.splice(f-1,2),f-=2);if("."===d[f]||""==d[f])d.splice(f,
1),f-=1;f++}d=d.join("/");return I(k(d))})}function C(a,c,b){"undefined"===typeof b&&(b=window);var d;try{var f=k(a).data;d=JSON.parse(f)}catch(e){console.error('Cannot parse data file ("'+a+'"). Please check that the file is valid JSON <http://json.org/>.');return}try{a=d;d=b;"undefined"===typeof d&&(d=window);for(var m=c.split("."),f=0;f<m.length-1;f++){var g=m[f];"undefined"==typeof d[g]&&(d[g]={});d=d[g]}d[m[f]]=a}catch(h){console.error("Could not create object: "+(b==window?"window.":"this.")+
c)}}function R(a){for(var c=0,b=a.length;c<b;c++){var d=new Image;d.src=a[c];n.add({url:d.src,data:d})}}function S(a){for(var c=0,b=a.length;c<b;c++){var d={id:a[c]["@id"],title:a[c]["@title"],html:[],css:[],js:[],json:[]};g(a[c].html).forEach(function(a,c,b){a=k(a.toString());n.add(a);d.html.push(a)});g(a[c].css).forEach(function(a,c,b){a=k(a.toString());n.add(a);d.css.push(a)});g(a[c].js).forEach(function(a,c,b){a=k(a.toString());n.add(a);d.js.push(a)});g(a[c].json).forEach(function(a,c,b){c=a["@target"];
if("string"==typeof c){var e=a.toString();a=k(e);n.add(a);d.json.push({file:a,target:c})}else console.error('No target attribute provided for JSON ("'+e+'")')});void 0!==a[c]["@default"]&&(null===q?q=d:console.warn("More than one screen is set as the default in app.xml. Ignoring."));h.push(d)}if(null===q)throw"No default screen set.";}function N(a){"undefined"===typeof a&&(a="screen");var c=document.createElement("article");c.setAttribute("data-role",a);c.style.width="100%";c.style.overflow="visible";
c.style.padding="0px";c.style.margin="0px";c.style.visibility="visible";document.body.appendChild(c)}function F(a){return a&&a.parentNode?null!==a.parentNode.removeChild(a):!1}function g(a){return[].concat(a||[])}function k(a,c){"undefined"===typeof c&&(c=!1);var b;b=n.get(a);if(null!==b.data)return b;b=new XMLHttpRequest;b.open("GET",a,!1);b.send();return 200!==b.status&&0!==b.status?(console.error("HTTP status "+b.status+" returned for file: "+a),{url:a,data:""}):b={url:a,data:c?b.responseXML:b.responseText}}
function J(a){function c(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var b=new K,d=0,f="";if(a.attributes&&0<a.attributes.length)for(d;d<a.attributes.length;d++){var e=a.attributes.item(d);b["@"+e.name.toLowerCase()]=c(e.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var g,h=0;h<a.childNodes.length;h++)g=a.childNodes.item(h),4===g.nodeType?f+=g.nodeValue:3===g.nodeType?f+=g.nodeValue.trim():1!==g.nodeType||g.prefix||(0===
d&&(b={}),e=g.nodeName.toLowerCase(),g=J(g),b.hasOwnProperty(e)?(b[e].constructor!==Array&&(b[e]=[b[e]]),b[e].push(g)):(b[e]=g,d++));b.constructor===K&&b.setValue(c(f));return b}var O=function(){function a(){document.body.screen=this}a.prototype.subscribe=function(a,b){e.subscribe(a,b,this)};a.prototype.unsubscribe=function(a,b){e.unsubscribe(a,b)};return a}(),L=function(){function a(c){"undefined"===typeof c&&(c=a.AUTO);this.rule=c;this._files=[]}a.prototype.add=function(c){if(this.rule!=a.NEVER&&
null==this.get(c.url).data)return this._files.push(c),c};a.prototype.get=function(a){for(var b=0,d=this._files.length;b<d;b++)if(this._files[b].url===a)return this._files[b];return{url:a,data:null}};a.AUTO="auto";a.NEVER="never";return a}(),h=[],q=null,n=new L,r={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi},
isJSIdentifier:/^[$A-Z_][0-9A-Z_$]*$/i,includeStatement:/^#include "(.*)"$/gm},P=function(){};e.go=function(a){"undefined"===typeof a&&(a=null);if(null==a)u();else{var c=a.toString();-1!=c.indexOf("/")&&(c=c.substring(0,c.indexOf("/")));for(var b=null,d=0,f=h.length;d<f;d++)if(h[d].id==c){b=h[d];break}null==b?console.error('No screen with ID of "'+c+'".'):v({screen:b,path:"/"+a})}};e.getScreen=function(){return document.querySelector("article[data-role='buffer']")||document.querySelector("article[data-role='screen']")};
var T=function(){return function(a,c,b){"undefined"===typeof b&&(b=window);this.type=a;this.action=c;this.screen=b}}(),l=[];e.subscribe=function(a,c,b){"undefined"===typeof b&&(b=window);A(a,c);a=new T(a,c,b);l.push(a)};e.unsubscribe=A;e.READY="ready";e.ENTER="enter";e.EXIT="exit";e.LOAD="load";var K=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=function(a){this._value=a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=function(){return null===
this._value?"null":this._value.toString()};return a}(),p=J(k("data/app.xml",!0).data);if(void 0===p.app)console.error('Could not parse app.xml. "app" node missing.');else{var M="yes"==p.app["@cordova"]?"deviceready":"load";if("yes"==p.app["@cordova"]){var y=document.createElement("script");y.setAttribute("src","cordova.js");y.setAttribute("type","text/javascript");var z=document.createElement("script");z.setAttribute("src","cordova_plugins.js");z.setAttribute("type","text/javascript");document.head.appendChild(y);
document.head.appendChild(z)}window.addEventListener(M,function c(){window.removeEventListener(M,c);document.body.screen={};n.rule=void 0===p.app.cache?L.AUTO:p.app.cache;Q(p.app);v(x(),!0)},!1)}var w=!1;window.addEventListener("hashchange",function(){if(w)w=!1;else{var c=x();"object"==typeof c.screen&&v(c,!0)}},!1);var H=!0,u=function(){};e.getInfo=function(){return E()}})(Savvy||(Savvy={}));
(function(e){e._eval=function(e,s){void 0===s?(window.execScript||function(e){window.eval.call(window,e)})(e):function(e){eval(e)}.call(s,e)}})(Savvy||(Savvy={}));
