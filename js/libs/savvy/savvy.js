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

Copyright (c) 2013 digisoft.tv
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

document.screen=null;var Savvy;
(function(f){function M(a){a.subscribe=function(d,b){window.subscribe.call(f,d,b,a)};a.unsubscribe=function(a,b){window.unsubscribe.call(f,a,b)};a.publish=function(d){for(var b=0;b<arguments.length-1;b++);return C.apply(a,arguments)}}function s(a){try{a=a.toString()}catch(d){throw Error("A string indicating a screen ID must be passed to document.goto method.");}var b=a;-1!=b.indexOf("/")&&(b=b.substring(0,b.indexOf("/")));var c;a:{c=0;for(var e=k.length;c<e;c++)if(k[c].id==b){c=k[c];break a}c=null}null==
c?console.error('No screen with ID of "'+b+'".'):u.call(f,{screen:c,path:"/"+a},!1)}function D(a,d){for(var b=0;b<l.length;b++)l[b].type===a&&l[b].action===d&&(l.splice(b,1),b--)}function p(a){for(var d=[],b=0;b<arguments.length-1;b++)d[b]=arguments[b+1];var c=!0;l.forEach(function(b,T,g){switch(b.screen){case window:case document.screen:b.type===a&&"function"===typeof b.action&&(c=!(!1===b.action.apply(b.screen,d)||!1===c))}});return c}function C(a){for(var d=0;d<arguments.length-1;d++);if(a===f.READY||
a===f.ENTER||a===f.EXIT||a===f.LOAD)throw Error("Illegal. Only Savvy may publish a Savvy event (i.e. Savvy.READY, Savvy.ENTER, Savvy.EXIT or Savvy.LOAD).");return p.apply(f,arguments)}function u(a,d){function b(){document.screen=a.screen.html;this.getInfo=function(){return E(a)};p(f.READY)?c.call(f):t=c}function c(){t=N;for(var b=document.querySelectorAll("body > object[type='application/x-savvy']"),c=0;c<b.length;c++){var e=b[c];e!=a.screen.html&&e.removeAttribute("data-display")}a.screen.html.setAttribute("data-display",
"visible");document.title=a.screen.title||"";d||(v=!0,window.location.hash="!"+a.path);p(f.ENTER)}var e;F?(e=p(f.LOAD),F=!1):e=p(f.EXIT);e?b.call(f):t=b}function w(){var a=window.location.hash,d;if(""==a||"#"==a||"#!"==a)d=r;else for(var b=0,c=k.length;b<c;b++)if(RegExp("#!/"+k[b].id+"(?=/|$)").test(a)){d=k[b];break}b="";b=a.indexOf("/");b=-1==b?"/":a.substr(b);return{screen:d,path:b}}function E(a){"undefined"===typeof a&&(a=w());return{id:a.screen.id,title:a.screen.title,isDefault:r==a.screen,path:a.path}}
function O(a){P(h(a.img));h(a.css).forEach(function(a,b,c){G(a)});h(a.html).forEach(function(a,b,c){document.body.insertAdjacentHTML("beforeend",m(a))});h(a.json).forEach(function(a,b,c){b=a["@target"];"string"==typeof b?H(a,b):console.error('No target attribute provided for JSON ("'+a+'")')});h(a.js).forEach(function(a,b,c){I(a)});Q(h(a.screens.screen));delete f._eval}function G(a,d){var b=n.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8");if(b&&d)throw Error("Screen styles sheets cannot be remote (e.g. http://www.examples.com/style.css). Please include remote style sheets globally.");
var c;b?(c=document.createElement("link"),c.setAttribute("rel","stylesheet"),c.setAttribute("type","text/css"),c.setAttribute("href",a)):(c=document.createElement("style"),c.setAttribute("type","text/css"));d&&c.setAttribute("data-for",d);try{if(!b){var e=m(a);d&&(e=e.replace(n.css.selector,'body > object[data="'+d+'"] $1$2'));var f=a.toString().lastIndexOf("/");if(-1!=f)var g=a.toString().substr(0,f+1),e=e.replace(n.css.noQuotes,"url("+g).replace(n.css.doubleQuotes,'url("'+g).replace(n.css.singleQuotes,
"url('"+g);c.appendChild(document.createTextNode(e))}document.getElementsByTagName("head")[0].appendChild(c)}catch(q){console.error("Error appending CSS file ("+a+"): "+q.toString())}}function I(a,d){var b=J(a);try{f._eval(b,d)}catch(c){console.error(c.toString()+"("+a+")")}}function J(a){return m(a).replace(n.include,function(d,b){for(var c=a.toString().lastIndexOf("/"),c=(a.toString().substr(0,c+1)+b).split("/"),e=1;e<c.length;)if(!(0>e)){".."==c[e]&&".."!==c[e-1]&&0<e&&(c.splice(e-1,2),e-=2);if("."===
c[e]||""==c[e])c.splice(e,1),e-=1;e++}c=c.join("/");return J(c)})}function H(a,d,b){"undefined"===typeof b&&(b=window);var c;try{var e=m(a);c=JSON.parse(e)}catch(f){console.error('Cannot parse data file ("'+a+'"). Please check that the file is valid JSON <http://json.org/>.');return}try{a=c;c=b;"undefined"===typeof c&&(c=window);for(var g=d.split("."),e=0;e<g.length-1;e++){var q=g[e];"undefined"==typeof c[q]&&(c[q]={});c=c[q]}c[g[e]]=a}catch(h){console.error("Could not create object: "+(b==window?
"window.":"this.")+d)}}function P(a){for(var d=0,b=a.length;d<b;d++){var c=new Image;c.src=a[d];R.push(c)}}function Q(a){for(var d=0,b=a.length;d<b;d++){var c=document.createElement("object");c.setAttribute("data",a[d]["@id"]);c.setAttribute("type","application/x-savvy");M(c);var e={id:a[d]["@id"],title:a[d]["@title"],html:c,scroll:{top:0,left:0}};window[e.id]=e.html;h(a[d].css).forEach(function(a,b,c){G(a,e.id)});h(a[d].html).forEach(function(a,b,c){e.html.insertAdjacentHTML("beforeend",m(a))});
h(a[d].json).forEach(function(a,b,c){b=a["@target"];"string"==typeof b?(b=a.target,H(a,b,e.html)):console.error('No target attribute provided for JSON ("'+a+'")')});h(a[d].js).forEach(function(a,b,c){I(a,e.html)});void 0!==a[d]["@default"]&&(null===r?r=e:console.warn("More than one screen is set as the default in app.xml. Ignoring."));k.push(e);document.body.appendChild(e.html)}if(null===r)throw"No default screen set.";}function h(a){return[].concat(a||[])}function m(a,d){"undefined"===typeof d&&
(d=!1);var b=new XMLHttpRequest;b.open("GET",a,!1);b.setRequestHeader("Cache-Control","no-store");b.send();return 200!==b.status&&0!==b.status?(console.error("HTTP status "+b.status+" returned for file: "+a),null):d?b.responseXML:b.responseText}function K(a){function d(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var b=new L,c=0,e="";if(a.attributes&&0<a.attributes.length)for(c;c<a.attributes.length;c++){var f=a.attributes.item(c);
b["@"+f.name.toLowerCase()]=d(f.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var g,h=0;h<a.childNodes.length;h++)g=a.childNodes.item(h),4===g.nodeType?e+=g.nodeValue:3===g.nodeType?e+=g.nodeValue.trim():1!==g.nodeType||g.prefix||(0===c&&(b={}),f=g.nodeName.toLowerCase(),g=K(g),b.hasOwnProperty(f)?(b[f].constructor!==Array&&(b[f]=[b[f]]),b[f].push(g)):(b[f]=g,c++));b.constructor===L&&b.setValue(d(e));return b}var k=[],r=null,n={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,
css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi,selector:/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/gi},include:/^#include "(.*)"$/gm},N=function(){};document["goto"]=function(a){s.call(f,a)};var S=function(){return function(a,d,b){"undefined"===typeof b&&(b=window);this.type=a;this.action=d;this.screen=b}}(),l=[];window.subscribe=function(a,d,b){"undefined"===typeof b&&(b=window);D(a,d);a=new S(a,d,b);l.push(a)};window.unsubscribe=
D;window.publish=C;f.READY=new String("ready");f.ENTER=new String("enter");f.EXIT=new String("exit");f.LOAD=new String("load");var L=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=function(a){this._value=a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=function(){return null===this._value?"null":this._value.toString()};return a}(),x=K(m("data/app.xml",!0));if(void 0===x.app)console.error('Could not parse app.xml. "app" node missing.');else{var y=
"load",z=window;if("yes"==x.app["@cordova"]){var y="deviceready",z=document,A=document.createElement("script");A.setAttribute("src","cordova.js");A.setAttribute("type","text/javascript");var B=document.createElement("script");B.setAttribute("src","cordova_plugins.js");B.setAttribute("type","text/javascript");document.head.appendChild(A);document.head.appendChild(B)}z.addEventListener(y,function d(){z.removeEventListener(y,d);O(x.app);u.call(f,w(),!0)},!1)}var v=!1;window.addEventListener("hashchange",
function(){if(v)v=!1;else{var d=w();"object"==typeof d.screen&&u.call(f,d,!0)}},!1);var F=!0,t=function(){};document["continue"]=function(){t.call(f)};f.getInfo=function(){return E()};var R=[]})(Savvy||(Savvy={}));(function(f){f._eval=function(f,s){void 0===s?(window.execScript||function(f){window.eval.call(window,f)})(f):function(f){eval(f)}.call(s,f)}})(Savvy||(Savvy={}));
