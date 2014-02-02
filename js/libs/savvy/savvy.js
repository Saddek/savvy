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

document.cards=[];var Savvy;
(function(f){function H(a){try{a=a.toString()}catch(e){throw Error("A string indicating a card ID must be passed to document.goto method.");}var b=a;-1!=b.indexOf("/")&&(b=b.substring(0,b.indexOf("/")));var c;a:{c=0;for(var d=k.length;c<d;c++)if(k[c].id==b){c=k[c];break a}c=null}if(null==c)throw Error('No card with ID of "'+b+'".');l.call(f,{card:c,path:"/"+a},!1)}function l(a,e){function b(){var b=document.createEvent("CustomEvent");b.initCustomEvent(f.READY,!0,!0,{});a.card.html.dispatchEvent(b);
b.defaultPrevented?p=c:c.call(f)}function c(){p=I;for(var b=0;b<document.cards.length;b++)document.cards[b]==a.card.html?(y=b,document.cards[b].style.visibility="visible"):document.cards[b].style.visibility="hidden";document.title=a.card.title||"";e||(s=!0,window.location.hash="!"+a.path);b=document.createEvent("CustomEvent");b.initCustomEvent(f.ENTER,!0,!0,{});a.card.html.dispatchEvent(b)}var d=document.createEvent("CustomEvent");z?(d.initCustomEvent(f.LOAD,!0,!0,{}),z=!1):d.initCustomEvent(f.EXIT,
!0,!0,{});(document.cards[y]||document.body).dispatchEvent(d);d.defaultPrevented?p=b:b.call(f)}function A(){var a=window.location.hash,e;if(""==a||"#"==a||"#!"==a||"#!/"==a)e=q;else for(var b=0,c=k.length;b<c;b++)if(RegExp("#!/"+k[b].id+"(?=/|$)").test(a)){e=k[b];break}b="";b=a.indexOf("/");b=-1==b?"/":a.substr(b);return{card:e,path:b}}function J(a){K(h(a.img));h(a.css).forEach(function(a,b,c){B(a)});h(a.html).forEach(function(a,b,c){document.body.insertAdjacentHTML("beforeend",m(a))});h(a.json).forEach(function(a,
b,c){b=a["@target"];if("string"==typeof b)C(a,b);else throw Error('No target attribute provided for JSON ("'+a+'")');});h(a.js).forEach(function(a,b,c){D(a)});L(h(a.card));delete f._eval}function B(a,e){var b=n.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8");if(b&&e)throw Error("Card styles sheets cannot be remote (e.g. http://www.examples.com/style.css). Please include remote style sheets globally.");var c;b?(c=document.createElement("link"),c.setAttribute("rel","stylesheet"),
c.setAttribute("type","text/css"),c.setAttribute("href",a)):(c=document.createElement("style"),c.setAttribute("type","text/css"));e&&c.setAttribute("data-for",e);try{if(!b){var d=m(a);e&&(d=d.replace(n.css.selector,"body > object#"+e+" $1$2"));var r=a.toString().lastIndexOf("/");if(-1!=r)var g=a.toString().substr(0,r+1),d=d.replace(n.css.noQuotes,"url("+g).replace(n.css.doubleQuotes,'url("'+g).replace(n.css.singleQuotes,"url('"+g);c.appendChild(document.createTextNode(d))}document.getElementsByTagName("head")[0].appendChild(c)}catch(f){throw Error("Error appending CSS file ("+
a+"): "+f.toString());}}function D(a,e){var b=E(a);try{f._eval(b,e)}catch(c){throw Error(c.toString()+" ("+a+")");}}function E(a){return m(a).replace(n.include,function(e,b){for(var c=a.toString().lastIndexOf("/"),c=(a.toString().substr(0,c+1)+b).split("/"),d=1;d<c.length;)if(!(0>d)){".."==c[d]&&".."!==c[d-1]&&0<d&&(c.splice(d-1,2),d-=2);if("."===c[d]||""==c[d])c.splice(d,1),d-=1;d++}c=c.join("/");return E(c)})}function C(a,e,b){"undefined"===typeof b&&(b=window);var c;try{var d=m(a);c=JSON.parse(d)}catch(r){console.error('Cannot parse data file ("'+
a+'"). Please check that the file is valid JSON <http://json.org/>.');return}try{a=c;c=b;"undefined"===typeof c&&(c=window);for(var g=e.split("."),d=0;d<g.length-1;d++){var f=g[d];"undefined"==typeof c[f]&&(c[f]={});c=c[f]}c[g[d]]=a}catch(h){console.error("Could not create object: "+(b==window?"window.":"this.")+e)}}function K(a){for(var e=0,b=a.length;e<b;e++){var c=new Image;c.src=a[e];M.push(c)}}function L(a){for(var e=0,b=a.length;e<b;e++){var c=document.createElement("object");c.setAttribute("id",
a[e]["@id"]);c.setAttribute("data","Savvy/"+a[e]["@id"]);c.setAttribute("type","application/x-savvy");var d={id:a[e]["@id"],title:a[e]["@title"],html:c};window[d.id]=d.html;h(a[e].css).forEach(function(a,b,c){B(a,d.id)});h(a[e].html).forEach(function(a,b,c){d.html.insertAdjacentHTML("beforeend",m(a))});document.cards.push(document.body.appendChild(d.html));h(a[e].json).forEach(function(a,b,c){b=a["@target"];"string"==typeof b?(b=a.target,C(a,b,d.html)):console.error('No target attribute provided for JSON ("'+
a+'")')});h(a[e].js).forEach(function(a,b,c){D(a,d.html)});void 0!==a[e]["@default"]&&(null===q?q=d:console.warn("More than one card is set as the default in app.xml. Ignoring."));k.push(d)}if(null===q)throw Error("No default card set.");}function h(a){return[].concat(a||[])}function m(a,e){"undefined"===typeof e&&(e=!1);var b=new XMLHttpRequest;b.open("GET",a,!1);b.setRequestHeader("Cache-Control","no-store");b.send();return 200!==b.status&&0!==b.status?(console.error("HTTP status "+b.status+" returned for file: "+
a),null):e?b.responseXML:b.responseText}function F(a){function e(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var b=new G,c=0,d="";if(a.attributes&&0<a.attributes.length)for(c;c<a.attributes.length;c++){var f=a.attributes.item(c);b["@"+f.name.toLowerCase()]=e(f.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var g,h=0;h<a.childNodes.length;h++)g=a.childNodes.item(h),4===g.nodeType?d+=g.nodeValue:3===g.nodeType?d+=g.nodeValue.trim():
1!==g.nodeType||g.prefix||(0===c&&(b={}),f=g.nodeName.toLowerCase(),g=F(g),b.hasOwnProperty(f)?(b[f].constructor!==Array&&(b[f]=[b[f]]),b[f].push(g)):(b[f]=g,c++));b.constructor===G&&b.setValue(e(d));return b}var k=[],q=null,y=null,n={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi,selector:/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/gi},
include:/^#include "(.*)"$/gm},I=function(){};document["goto"]=function(a){H.call(f,a)};f.READY="savvy-ready";f.ENTER="savvy-enter";f.EXIT="savvy-exit";f.LOAD="savvy-load";var G=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=function(a){this._value=a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=function(){return null===this._value?"null":this._value.toString()};return a}(),t=F(m("data/app.xml",!0));if(void 0===t.app)throw Error('Could not parse app.xml. "app" node missing.');
var u="load",v=window;if("yes"==t.app["@cordova"]){var u="deviceready",v=document,w=document.createElement("script");w.setAttribute("src","cordova.js");w.setAttribute("type","text/javascript");var x=document.createElement("script");x.setAttribute("src","cordova_plugins.js");x.setAttribute("type","text/javascript");document.head.appendChild(w);document.head.appendChild(x)}v.addEventListener(u,function e(){v.removeEventListener(u,e);J(t.app);l.call(f,A(),!0)},!1);var s=!1;window.addEventListener("hashchange",
function(){if(s)s=!1;else{var e=A();"object"==typeof e.card&&l.call(f,e,!0)}},!1);var z=!0,p=function(){};document["continue"]=function(){p.call(f)};var M=[]})(Savvy||(Savvy={}));(function(f){f._eval=function(f,l){void 0===l?(window.execScript||function(f){window.eval.call(window,f)})(f):function(f){eval(f)}.call(l,f)}})(Savvy||(Savvy={}));
