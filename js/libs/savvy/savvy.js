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
(function(f){function G(a){try{a=a.toString()}catch(e){throw Error("A string indicating a card ID must be passed to document.goto method.");}var c=a;-1!=c.indexOf("/")&&(c=c.substring(0,c.indexOf("/")));var b;a:{b=0;for(var d=k.length;b<d;b++)if(k[b].id==c){b=k[b];break a}b=null}if(null==b)throw Error('No card with ID of "'+c+'".');l.call(f,{card:b,path:"/"+a},!1)}function l(a,e){function c(){var c=document.createEvent("CustomEvent");c.initCustomEvent(f.READY,!0,!0,{});a.card.html.dispatchEvent(c);
c.defaultPrevented?p=b:b.call(f)}function b(){p=H;for(var b=0;b<document.cards.length;b++)document.cards[b]==a.card.html?(s=b,document.cards[b].style.visibility="visible"):document.cards[b].style.visibility="hidden";document.title=a.card.title||"";e||(t=!0,window.location.hash="!"+a.path);b=document.createEvent("CustomEvent");b.initCustomEvent(f.ENTER,!0,!0,{});a.card.html.dispatchEvent(b)}var d=document.createEvent("CustomEvent");null==s?(d.initCustomEvent(f.LOAD,!0,!0,{}),document.body.dispatchEvent(d)):
(d.initCustomEvent(f.EXIT,!0,!0,{}),document.cards[s].dispatchEvent(d));d.defaultPrevented?p=c:c.call(f)}function z(){var a=window.location.hash,e;if(""==a||"#"==a||"#!"==a||"#!/"==a)e=q;else for(var c=0,b=k.length;c<b;c++)if(RegExp("#!/"+k[c].id+"(?=/|$)").test(a)){e=k[c];break}c="";c=a.indexOf("/");c=-1==c?"/":a.substr(c);return{card:e,path:c}}function I(a){J(h(a.img));h(a.css).forEach(function(a,c,b){A(a)});h(a.html).forEach(function(a,c,b){document.body.insertAdjacentHTML("beforeend",m(a))});
h(a.json).forEach(function(a,c,b){c=a["@target"];if("string"==typeof c)B(a,c);else throw Error('No target attribute provided for JSON ("'+a+'")');});h(a.js).forEach(function(a,c,b){C(a)});K(h(a.card));delete f._eval}function A(a,e){var c=n.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8");if(c&&e)throw Error("Card styles sheets cannot be remote (e.g. http://www.examples.com/style.css). Please include remote style sheets globally.");var b;c?(b=document.createElement("link"),b.setAttribute("rel",
"stylesheet"),b.setAttribute("type","text/css"),b.setAttribute("href",a)):(b=document.createElement("style"),b.setAttribute("type","text/css"));e&&b.setAttribute("data-for",e);try{if(!c){var d=m(a);e&&(d=d.replace(n.css.selector,"body > object#"+e+" $1$2"));var r=a.toString().lastIndexOf("/");if(-1!=r)var g=a.toString().substr(0,r+1),d=d.replace(n.css.noQuotes,"url("+g).replace(n.css.doubleQuotes,'url("'+g).replace(n.css.singleQuotes,"url('"+g);b.appendChild(document.createTextNode(d))}document.getElementsByTagName("head")[0].appendChild(b)}catch(f){throw Error("Error appending CSS file ("+
a+"): "+f.toString());}}function C(a,e){var c=D(a);try{f._eval(c,e)}catch(b){throw Error(b.toString()+" ("+a+")");}}function D(a){return m(a).replace(n.include,function(e,c){for(var b=a.toString().lastIndexOf("/"),b=(a.toString().substr(0,b+1)+c).split("/"),d=1;d<b.length;)if(!(0>d)){".."==b[d]&&".."!==b[d-1]&&0<d&&(b.splice(d-1,2),d-=2);if("."===b[d]||""==b[d])b.splice(d,1),d-=1;d++}b=b.join("/");return D(b)})}function B(a,e,c){"undefined"===typeof c&&(c=window);var b;try{var d=m(a);b=JSON.parse(d)}catch(r){console.error('Cannot parse data file ("'+
a+'"). Please check that the file is valid JSON <http://json.org/>.');return}try{a=b;b=c;"undefined"===typeof b&&(b=window);for(var g=e.split("."),d=0;d<g.length-1;d++){var f=g[d];"undefined"==typeof b[f]&&(b[f]={});b=b[f]}b[g[d]]=a}catch(h){console.error("Could not create object: "+(c==window?"window.":"this.")+e)}}function J(a){for(var e=0,c=a.length;e<c;e++){var b=new Image;b.src=a[e];L.push(b)}}function K(a){for(var e=0,c=a.length;e<c;e++){var b=document.createElement("object");b.setAttribute("id",
a[e]["@id"]);b.setAttribute("data","Savvy/"+a[e]["@id"]);b.setAttribute("type","application/x-savvy");var d={id:a[e]["@id"],title:a[e]["@title"],html:b};window[d.id]=d.html;h(a[e].css).forEach(function(a,b,c){A(a,d.id)});h(a[e].html).forEach(function(a,b,c){d.html.insertAdjacentHTML("beforeend",m(a))});b=document.body.appendChild(d.html);document.cards.push(b);b.style.top="0%";b.style.left="0%";b.style.zIndex=e.toString();h(a[e].json).forEach(function(a,b,c){b=a["@target"];"string"==typeof b?(b=a.target,
B(a,b,d.html)):console.error('No target attribute provided for JSON ("'+a+'")')});h(a[e].js).forEach(function(a,b,c){C(a,d.html)});void 0!==a[e]["@default"]&&(null===q?q=d:console.warn("More than one card is set as the default in app.xml. Ignoring."));k.push(d)}if(null===q)throw Error("No default card set.");}function h(a){return[].concat(a||[])}function m(a,e){"undefined"===typeof e&&(e=!1);var c=new XMLHttpRequest;c.open("GET",a,!1);c.setRequestHeader("Cache-Control","no-store");c.send();return 200!==
c.status&&0!==c.status?(console.error("HTTP status "+c.status+" returned for file: "+a),null):e?c.responseXML:c.responseText}function E(a){function e(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var c=new F,b=0,d="";if(a.attributes&&0<a.attributes.length)for(b;b<a.attributes.length;b++){var f=a.attributes.item(b);c["@"+f.name.toLowerCase()]=e(f.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var g,h=0;h<a.childNodes.length;h++)g=
a.childNodes.item(h),4===g.nodeType?d+=g.nodeValue:3===g.nodeType?d+=g.nodeValue.trim():1!==g.nodeType||g.prefix||(0===b&&(c={}),f=g.nodeName.toLowerCase(),g=E(g),c.hasOwnProperty(f)?(c[f].constructor!==Array&&(c[f]=[c[f]]),c[f].push(g)):(c[f]=g,b++));c.constructor===F&&c.setValue(e(d));return c}var k=[],q=null,s=null,n={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,
noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi,selector:/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/gi},include:/^#include "(.*)"$/gm},H=function(){};document["goto"]=function(a){G.call(f,a)};f.READY="savvy-ready";f.ENTER="savvy-enter";f.EXIT="savvy-exit";f.LOAD="savvy-load";var F=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=function(a){this._value=a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=function(){return null===this._value?"null":this._value.toString()};
return a}(),u=E(m("data/app.xml",!0));if(void 0===u.app)throw Error('Could not parse app.xml. "app" node missing.');var v="load",w=window;if("yes"==u.app["@cordova"]){var v="deviceready",w=document,x=document.createElement("script");x.setAttribute("src","cordova.js");x.setAttribute("type","text/javascript");var y=document.createElement("script");y.setAttribute("src","cordova_plugins.js");y.setAttribute("type","text/javascript");document.head.appendChild(x);document.head.appendChild(y)}w.addEventListener(v,
function e(){w.removeEventListener(v,e);I(u.app);l.call(f,z(),!0)},!1);var t=!1;window.addEventListener("hashchange",function(){if(t)t=!1;else{var e=z();"object"==typeof e.card&&l.call(f,e,!0)}},!1);var p=function(){};document["continue"]=function(){p.call(f)};var L=[]})(Savvy||(Savvy={}));(function(f){f._eval=function(f,l){void 0===l?(window.execScript||function(f){window.eval.call(window,f)})(f):function(f){eval(f)}.call(l,f)}})(Savvy||(Savvy={}));
