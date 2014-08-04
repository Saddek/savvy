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
Version: 0.3.0

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

'use strict';var Card;(function(a){a.READY="savvy-ready";a.ENTER="savvy-enter";a.EXIT="savvy-exit";a.LOAD="savvy-load"})(Card||(Card={}));var JXON;
(function(a){function n(a){function e(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var d=new h,l=0,b="";if(a.attributes&&0<a.attributes.length)for(l;l<a.attributes.length;l++){var c=a.attributes.item(l);d["@"+c.name.toLowerCase()]=e(c.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var g,m=0;m<a.childNodes.length;m++)g=a.childNodes.item(m),4===g.nodeType?b+=g.nodeValue:3===g.nodeType?b+=g.nodeValue.trim():1!==g.nodeType||g.prefix||
(0===l&&(d={}),c=g.nodeName.toLowerCase(),g=n(g),d.hasOwnProperty(c)?(d[c].constructor!==Array&&(d[c]=[d[c]]),d[c].push(g)):(d[c]=g,l++));d.constructor===h&&d.setValue(e(b));0<l&&Object.freeze(d);return d}a.parse=function(a){return n(a)};var h=function(){function a(e){this._value=void 0===e?null:e}a.prototype.setValue=function(a){this._value=a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=function(){return null===this._value?"null":this._value.toString()};return a}()})(JXON||
(JXON={}));var application;
(function(a){a.id=null;a.version=null;a.defaultPath=null;a.cards=[];a["goto"]=function(a,h){"undefined"===typeof h&&(h=Transition.CUT);if("string"==typeof a)Savvy._goto.call(Savvy,a,h);else throw"A string indicating a card ID must be passed to application.goto method.";};a.read=function(a,h){"undefined"===typeof h&&(h=!1);var f=new XMLHttpRequest;f.open("GET",a,!1);f.setRequestHeader("Cache-Control","no-store");f.send();return 200!==f.status&&0!==f.status?(console.error("HTTP status "+f.status+" returned for file: "+
a),null):h?f.responseXML:f.responseText}})(application||(application={}));var Savvy;
(function(a){a._parseJSONToTarget=function(a,h,f){"undefined"===typeof f&&(f=window);var e;try{var d=application.read(a);e=JSON.parse(d)}catch(l){console.error('Cannot parse data file ("'+a+'"). Please check that the file is valid JSON <http://json.org/>.');return}try{a=e;e=f;"undefined"===typeof e&&(e=window);for(var b=h.split("."),d=0;d<b.length-1;d++){var c=b[d];"undefined"==typeof e[c]&&(e[c]={});e=e[c]}e[b[d]]=a}catch(g){console.error("Could not create object: "+(f==window?"window.":"this.")+
h)}}})(Savvy||(Savvy={}));
(function(a){(function(n){function h(){var a=window.location.hash;return""==a||"#"==a||"#!"==a||"#!/"==a?application.defaultPath:a.substr(3)}function f(a){var d=a.indexOf("/");-1<d&&a.substr(0,d);return a}n._currentCard=null;n._ignoreHashChange=!1;window.addEventListener("hashchange",function(){if(n._ignoreHashChange)n._ignoreHashChange=!1;else{var e=h(),d=f(e),d=document.getElementById(d);application.cards.indexOf(d)&&a._goto(e,Transition.CUT,!0)}},!1);n._getPathFromURLHash=h;n._getIdForPath=f})(a.history||
(a.history={}))})(Savvy||(Savvy={}));
(function(a){function n(b){h(e(b.img));e(b.css).forEach(function(a,b,c){d(a)});e(b.html).forEach(function(a,b,c){document.body.insertAdjacentHTML("beforeend",application.read(a))});e(b.json).forEach(function(b,c,k){c=b["@target"];if("string"==typeof c)a._parseJSONToTarget(b,c);else throw Error('No target attribute provided for JSON ("'+b+'")');});e(b.js).forEach(function(a,b,c){l(a)});f(e(b.card));delete a._eval}function h(a){for(var b=0,c=a.length;b<c;b++){var k=new Image;k.src=a[b];t.push(k)}}function f(b){for(var c=
0,g=b.length;c<g;c++){var k=document.createElement("object");k.setAttribute("id",b[c]["@id"]);k.setAttribute("title",b[c]["@title"]);k.setAttribute("data","savvy:"+application.id+"/"+b[c]["@id"]);k.setAttribute("type","application/x-savvy");var m=b[c]["@id"];window[m]=k;e(b[c].css).forEach(function(a){d(a,m)});e(b[c].html).forEach(function(a){k.insertAdjacentHTML("beforeend",application.read(a))});var f=document.body.appendChild(k);f.style.top="0%";f.style.left="0%";f.style.visibility="hidden";f.style.zIndex=
"0";application.cards.push(f);e(b[c].json).forEach(function(b){var c=b["@target"];"string"==typeof c?(c=b.target,a._parseJSONToTarget(b,c,k)):console.error('No target attribute provided for JSON ("'+b+'")')});e(b[c].js).forEach(function(a){l(a,k)});void 0!==b[c]["@default"]&&(null===application.defaultPath?application.defaultPath=m:console.warn("More than one card is set as the default in app.xml. Ignoring."))}if(null===application.defaultPath)throw Error("No default card set.");}function e(a){return[].concat(a||
[])}function d(a,b){var c=p.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8");if(c&&b)throw Error("Card styles sheets cannot be remote (e.g. http://www.examples.com/style.css). Please include remote style sheets globally.");var k;c?(k=document.createElement("link"),k.setAttribute("rel","stylesheet"),k.setAttribute("type","text/css"),k.setAttribute("href",a)):(k=document.createElement("style"),k.setAttribute("type","text/css"));b&&k.setAttribute("data-for",b);try{if(!c){var e=
application.read(a);b&&(e=e.replace(p.css.body,"$1"),e=e.replace(p.css.selector,"body > object#"+b+" $1$2"));var g=a.toString().lastIndexOf("/");if(-1!=g)var d=a.toString().substr(0,g+1),e=e.replace(p.css.noQuotes,"url("+d).replace(p.css.doubleQuotes,'url("'+d).replace(p.css.singleQuotes,"url('"+d);k.appendChild(document.createTextNode(e))}document.getElementsByTagName("head")[0].appendChild(k)}catch(m){throw Error("Error appending CSS file ("+a+"): "+m.toString());}}function l(c,e){var d=b(c);try{a._eval(d,
e)}catch(k){throw Error(k.toString()+" ("+c+")");}}function b(a){return application.read(a).replace(u,function(c,e){for(var d=a.toString().lastIndexOf("/"),d=(a.toString().substr(0,d+1)+e).split("/"),g=1;g<d.length;)if(!(0>g)){".."==d[g]&&".."!==d[g-1]&&0<g&&(d.splice(g-1,2),g-=2);if("."===d[g]||""==d[g])d.splice(g,1),g-=1;g++}d=d.join("/");return b(d)})}var c=JXON.parse(application.read("app.xml",!0));if(void 0===c.app)throw Error('Could not parse app.xml. "app" node missing.');application.id=c.app["@id"]?
c.app["@id"]:"application";application.version=c.app["@version"]?c.app["@version"]:"";var g="load",m=window;if("yes"==c.app["@cordova"]){var g="deviceready",m=document,r=document.createElement("script");r.setAttribute("src","cordova.js");r.setAttribute("type","text/javascript");var q=document.createElement("script");q.setAttribute("src","cordova_plugins.js");q.setAttribute("type","text/javascript");document.head.appendChild(r);document.head.appendChild(q)}m.addEventListener(g,function s(){m.removeEventListener(g,
s);n(c.app);a._goto(a.history._getPathFromURLHash(),Transition.CUT,!0)},!1);var t=[],p={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi,body:/\bbody\b(,(?=[^}]*{)|\s*{)/gi,selector:/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/gi}},u=/^#include "(.*)"$/gm})(Savvy||(Savvy={}));
(function(a){function n(b,c,d){var m=e(b,c,d);m.initCustomEvent(Card.READY,!0,!0,b);b.to.dispatchEvent(m);m.defaultPrevented?l=h:h.call(a,b,c,d)}function h(b,c,g){l=d;b.from&&(b.from.style.visibility="hidden");b.to&&(b.to.style.visibility="visible");b.transition||(b.transition=Transition.CUT);f(b.to,b.transition.to,b.transition.toIsForemost,b.transition.duration);f(b.from,b.transition.from,!b.transition.toIsForemost,b.transition.duration);setTimeout(function(){document.title=b.to.title||"";g||(a.history._ignoreHashChange=
!0,window.location.hash="!/"+c);var d=e(b,c,g);a.history._currentCard=b.to;d.initCustomEvent(Card.ENTER,!0,!0,b);b.to.dispatchEvent(d)},b.transition.duration)}function f(a,c,d,e){if(null!=a){a.style.zIndex=d?"0":"-1";var f=" transition transition-"+e+" "+c;a.className+=f;setTimeout(function(){a.style.zIndex="0";a.className=a.className.replace(f,"")},e)}}function e(b,c,e){var f=document.createEvent("CustomEvent");l=d;f["continue"]=function(){l.call(a,b,c,e)};return f}var d=function(){},l=d;a._goto=
function(b,c,d){"undefined"===typeof c&&(c=Transition.CUT);"undefined"===typeof d&&(d=!1);var f=a.history._getIdForPath(b),h=document.getElementById(f),q=a.history._currentCard;if(-1<application.cards.indexOf(h))c={from:q,to:h,transition:c},f=e(c,b,d),null==c.from?(f.initCustomEvent(Card.LOAD,!0,!0,c),document.body.dispatchEvent(f)):(f.initCustomEvent(Card.EXIT,!0,!0,c),c.from.dispatchEvent(f)),f.defaultPrevented?l=n:n.call(a,c,b,d);else throw'No card with ID of "'+f+'".';}})(Savvy||(Savvy={}));var Transition;
(function(a){a.CUT={from:"static",to:"static",duration:0,toIsForemost:!0,inverse:a.CUT};a.COVER_LEFT={from:"static",to:"coverLeft",duration:250,toIsForemost:!0,inverse:a.UNCOVER_LEFT};a.UNCOVER_LEFT={to:"static",from:"uncoverLeft",duration:333,toIsForemost:!1,inverse:a.COVER_LEFT};a.COVER_RIGHT={from:"static",to:"coverRight",duration:250,toIsForemost:!0,inverse:a.UNCOVER_RIGHT};a.UNCOVER_RIGHT={to:"static",from:"uncoverRight",duration:333,toIsForemost:!1,inverse:a.COVER_RIGHT}})(Transition||(Transition=
{}));(function(a){a._eval=function(a,h){void 0===h?(window.execScript||function(a){window.eval.call(window,a)})(a):function(a){eval(a)}.call(h,a)}})(Savvy||(Savvy={}));
