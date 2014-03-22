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
(function(b){function K(a){try{a=a.toString()}catch(l){throw Error("A string indicating a card ID must be passed to document.goto method.");}var d=a;-1!=d.indexOf("/")&&(d=d.substring(0,d.indexOf("/")));var c;a:{c=0;for(var e=m.length;c<e;c++)if(m[c].id==d){c=m[c];break a}c=null}if(null==c)throw Error('No card with ID of "'+d+'".');p.call(b,{card:c,path:"/"+a},!1)}function p(a,l){function d(){var d=document.createEvent("CustomEvent");d.continueTransition=function(){q.call(b)};d.setTransition=function(a){t=
a};d.initCustomEvent(b.READY,!0,!0,u);a.card.html.dispatchEvent(d);d.defaultPrevented?q=c:c.call(b)}function c(){q=L;k.style.visibility="visible";k.style.zIndex="1";null!=g&&(g.style.visibility="hidden",g.style.zIndex="0");switch(t){case b.FLIP:f(g,"flipOutY",500);f(k,"flipInY",500,e);break;case b.SLIDE_UP:f(g,"slideOutUp",500);f(k,"slideInUp",500,e);break;case b.SLIDE_DOWN:f(g,"slideOutDown",500);f(k,"slideInDown",500,e);break;case b.SLIDE_LEFT:f(g,"slideOutLeft",250);f(k,"slideInRight",250,e);break;
case b.SLIDE_RIGHT:f(g,"slideOutRight",250);f(k,"slideInLeft",250,e);break;case b.COVER_UP:f(g,"static",500);f(k,"slideInUp",500,e);break;case b.COVER_DOWN:f(g,"static",500);f(k,"slideInDown",500,e);break;case b.COVER_LEFT:f(g,"static",250);f(k,"slideInLeft",250,e);break;case b.COVER_RIGHT:f(g,"static",250);f(k,"slideInRight",250,e);break;case b.UNCOVER_UP:g&&(g.style.zIndex="2");setTimeout(function(){g.style.zIndex="0"},250);f(g,"slideOutUp",250,e);f(k,"static",250);break;case b.UNCOVER_DOWN:g&&
(g.style.zIndex="2");setTimeout(function(){g.style.zIndex="0"},250);f(g,"slideOutDown",250,e);f(k,"static",250);break;case b.UNCOVER_LEFT:g&&(g.style.zIndex="2");setTimeout(function(){g.style.zIndex="0"},250);f(g,"slideOutLeft",250,e);f(k,"static",250);break;case b.UNCOVER_RIGHT:g&&(g.style.zIndex="2");setTimeout(function(){g.style.zIndex="0"},250);f(g,"slideOutRight",250,e);f(k,"static",250);break;default:e.call(b)}}function e(){document.title=a.card.title||"";l||(w=!0,window.location.hash="!"+a.path);
var c=document.createEvent("CustomEvent");c.continueTransition=function(){q.call(b)};c.setTransition=function(a){t=a};C=k;c.initCustomEvent(b.ENTER,!0,!0,u);a.card.html.dispatchEvent(c)}var g=C,k=a.card.html,t=b.CUT,u={from:g,to:k},h=document.createEvent("CustomEvent");h.continueTransition=function(){q.call(b)};h.setTransition=function(a){t=a};null==g?(h.initCustomEvent(b.LOAD,!0,!0,u),document.body.dispatchEvent(h)):(h.initCustomEvent(b.EXIT,!0,!0,u),g.dispatchEvent(h));h.defaultPrevented?q=d:d.call(b)}
function f(a,l,d,c){null!=a&&(a.className+=" animated "+l,setTimeout(function(){a.className="";"function"==typeof c&&c.call(b)},d))}function D(){var a=window.location.hash,l;if(""==a||"#"==a||"#!"==a||"#!/"==a)l=v;else for(var d=0,c=m.length;d<c;d++)if(RegExp("#!/"+m[d].id+"(?=/|$)").test(a)){l=m[d];break}d="";d=a.indexOf("/");d=-1==d?"/":a.substr(d);return{card:l,path:d}}function M(a){N(h(a.img));h(a.css).forEach(function(a,d,c){E(a)});h(a.html).forEach(function(a,d,c){document.body.insertAdjacentHTML("beforeend",
r(a))});h(a.json).forEach(function(a,d,c){d=a["@target"];if("string"==typeof d)F(a,d);else throw Error('No target attribute provided for JSON ("'+a+'")');});h(a.js).forEach(function(a,d,c){G(a)});O(h(a.card));delete b._eval}function E(a,l){var d=s.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8");if(d&&l)throw Error("Card styles sheets cannot be remote (e.g. http://www.examples.com/style.css). Please include remote style sheets globally.");var c;d?(c=document.createElement("link"),
c.setAttribute("rel","stylesheet"),c.setAttribute("type","text/css"),c.setAttribute("href",a)):(c=document.createElement("style"),c.setAttribute("type","text/css"));l&&c.setAttribute("data-for",l);try{if(!d){var e=r(a);l&&(e=e.replace(s.css.selector,"body > object#"+l+" $1$2"));var g=a.toString().lastIndexOf("/");if(-1!=g)var b=a.toString().substr(0,g+1),e=e.replace(s.css.noQuotes,"url("+b).replace(s.css.doubleQuotes,'url("'+b).replace(s.css.singleQuotes,"url('"+b);c.appendChild(document.createTextNode(e))}document.getElementsByTagName("head")[0].appendChild(c)}catch(f){throw Error("Error appending CSS file ("+
a+"): "+f.toString());}}function G(a,l){var d=H(a);try{b._eval(d,l)}catch(c){throw Error(c.toString()+" ("+a+")");}}function H(a){return r(a).replace(s.include,function(b,d){for(var c=a.toString().lastIndexOf("/"),c=(a.toString().substr(0,c+1)+d).split("/"),e=1;e<c.length;)if(!(0>e)){".."==c[e]&&".."!==c[e-1]&&0<e&&(c.splice(e-1,2),e-=2);if("."===c[e]||""==c[e])c.splice(e,1),e-=1;e++}c=c.join("/");return H(c)})}function F(a,b,d){"undefined"===typeof d&&(d=window);var c;try{var e=r(a);c=JSON.parse(e)}catch(g){console.error('Cannot parse data file ("'+
a+'"). Please check that the file is valid JSON <http://json.org/>.');return}try{a=c;c=d;"undefined"===typeof c&&(c=window);for(var k=b.split("."),e=0;e<k.length-1;e++){var f=k[e];"undefined"==typeof c[f]&&(c[f]={});c=c[f]}c[k[e]]=a}catch(h){console.error("Could not create object: "+(d==window?"window.":"this.")+b)}}function N(a){for(var b=0,d=a.length;b<d;b++){var c=new Image;c.src=a[b];P.push(c)}}function O(a){for(var b=0,d=a.length;b<d;b++){var c=document.createElement("object");c.setAttribute("id",
a[b]["@id"]);c.setAttribute("data","savvy:"+x.id+"/"+a[b]["@id"]);c.setAttribute("type","application/x-savvy");var e={id:a[b]["@id"],title:a[b]["@title"],html:c};window[e.id]=e.html;h(a[b].css).forEach(function(a,c,b){E(a,e.id)});h(a[b].html).forEach(function(a,c,b){e.html.insertAdjacentHTML("beforeend",r(a))});c=document.body.appendChild(e.html);c.style.top="0%";c.style.left="0%";c.style.visibility="hidden";c.style.zIndex="0";document.cards.push(c);h(a[b].json).forEach(function(a,c,b){c=a["@target"];
"string"==typeof c?(c=a.target,F(a,c,e.html)):console.error('No target attribute provided for JSON ("'+a+'")')});h(a[b].js).forEach(function(a,c,b){G(a,e.html)});void 0!==a[b]["@default"]&&(null===v?v=e:console.warn("More than one card is set as the default in app.xml. Ignoring."));m.push(e)}if(null===v)throw Error("No default card set.");}function h(a){return[].concat(a||[])}function r(a,b){"undefined"===typeof b&&(b=!1);var d=new XMLHttpRequest;d.open("GET",a,!1);d.setRequestHeader("Cache-Control",
"no-store");d.send();return 200!==d.status&&0!==d.status?(console.error("HTTP status "+d.status+" returned for file: "+a),null):b?d.responseXML:d.responseText}function I(a){function b(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var d=new J,c=0,e="";if(a.attributes&&0<a.attributes.length)for(c;c<a.attributes.length;c++){var g=a.attributes.item(c);d["@"+g.name.toLowerCase()]=b(g.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var f,
h=0;h<a.childNodes.length;h++)f=a.childNodes.item(h),4===f.nodeType?e+=f.nodeValue:3===f.nodeType?e+=f.nodeValue.trim():1!==f.nodeType||f.prefix||(0===c&&(d={}),g=f.nodeName.toLowerCase(),f=I(f),d.hasOwnProperty(g)?(d[g].constructor!==Array&&(d[g]=[d[g]]),d[g].push(f)):(d[g]=f,c++));d.constructor===J&&d.setValue(b(e));return d}var x={id:"",version:""},m=[],v=null,C=null,s={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,
doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi,selector:/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/gi},include:/^#include "(.*)"$/gm},L=function(){};document["goto"]=function(a){K.call(b,a)};b.READY="savvy-ready";b.ENTER="savvy-enter";b.EXIT="savvy-exit";b.LOAD="savvy-load";b.CUT="savvy-cut";b.FLIP="savvy-flip";b.SLIDE_UP="savvy-slide-up";b.SLIDE_DOWN="savvy-slide-down";b.SLIDE_LEFT="savvy-slide-left";b.SLIDE_RIGHT="savvy-slide-right";b.COVER_UP="savvy-cover-up";b.COVER_DOWN=
"savvy-cover-down";b.COVER_LEFT="savvy-cover-left";b.COVER_RIGHT="savvy-cover-right";b.UNCOVER_UP="savvy-uncover-up";b.UNCOVER_DOWN="savvy-uncover-down";b.UNCOVER_LEFT="savvy-uncover-left";b.UNCOVER_RIGHT="savvy-uncover-right";var J=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=function(a){this._value=a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=function(){return null===this._value?"null":this._value.toString()};return a}(),n=I(r("app.xml",
!0));if(void 0===n.app)throw Error('Could not parse app.xml. "app" node missing.');x.id=n.app["@id"]?n.app["@id"]:"application";x.version=n.app["@version"]?n.app["@version"]:"";var y="load",z=window;if("yes"==n.app["@cordova"]){var y="deviceready",z=document,A=document.createElement("script");A.setAttribute("src","cordova.js");A.setAttribute("type","text/javascript");var B=document.createElement("script");B.setAttribute("src","cordova_plugins.js");B.setAttribute("type","text/javascript");document.head.appendChild(A);
document.head.appendChild(B)}z.addEventListener(y,function l(){z.removeEventListener(y,l);M(n.app);p.call(b,D(),!0)},!1);var w=!1;window.addEventListener("hashchange",function(){if(w)w=!1;else{var f=D();"object"==typeof f.card&&p.call(b,f,!0)}},!1);var q=function(){},P=[]})(Savvy||(Savvy={}));(function(b){b._eval=function(b,p){void 0===p?(window.execScript||function(b){window.eval.call(window,b)})(b):function(b){eval(b)}.call(p,b)}})(Savvy||(Savvy={}));
