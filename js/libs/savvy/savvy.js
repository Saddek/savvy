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
(function(f){function q(){return document.querySelector("section[data-role='buffer']")||document.querySelector("section[data-role='screen']")}function r(a,c){for(var b=0;b<l.length;b++)l[b].type===a&&l[b].action===c&&(l.splice(b,1),b--)}function P(a){for(var c=0;c<l.length;c++)l[c].screen===a&&(l.splice(c,1),c--)}function s(a,c){"undefined"===typeof c&&(c=null);var b=!0;l.forEach(function(d,e,w){d.type===a&&"function"===typeof d.action&&(b=!(!1===d.action.call(d.screen,c)||!1===b))});return b}function y(a,
c){function b(){for(var c=0,b=k.length;c<b;c++)try{delete window[k[c].id]}catch(e){window[k[c].id]=null}P(window._screen);window._screen={};Q("buffer");q().style.display="none";h(a.screen.html).forEach(function(a,c,b){q().insertAdjacentHTML("beforeend",m(a).data)});var D=window[a.screen.id]=new R;"undefined"===typeof window[a.screen.id]&&console.error('"window.'+a.screen.id+'" could not be created.');h(a.screen.json).forEach(function(a,c,b){E(a.url,a.target,D)});h(a.screen.js).forEach(function(a,
c,b){F(a,D)});this.getInfo=function(){return G(a)};s(f.READY)?d():x=d}function d(){x=S;H(document.querySelector("section[data-role='screen']"));for(var b=document.querySelectorAll("style[data-for='screen'], link[data-for='screen']"),d=0;d<b.length;d++)H(b[d]);h(a.screen.css).forEach(function(a,c,b){I(a,!0)});q().setAttribute("data-role","screen");-1==window.navigator.appVersion.indexOf("MSIE 8")?T("section[data-role='screen'] { display: block !important; }",!0):q().style.display="block";document.title=
a.screen.title||"";c||(z=!0,window.location.hash="!"+a.path);s(f.ENTER)}"undefined"===typeof c&&(c=!1);var e;J?(e=s(f.LOAD),J=!1):e=s(f.EXIT);e?b():x=b}function A(){var a=window.location.hash,c;if(""==a||"#"==a||"#!"==a)c=t;else for(var b=0,d=k.length;b<d;b++)if(RegExp("#!/"+k[b].id+"(?=/|$)").test(a)){c=k[b];break}b="";b=a.indexOf("/");b=-1==b?"/":a.substr(b);return{screen:c,path:b}}function G(a){"undefined"===typeof a&&(a=A());return{id:a.screen.id,title:a.screen.title,isDefault:t==a.screen,path:a.path}}
function U(a){V(h(a.img));W(h(a.screens.screen));h(a.css).forEach(function(a,b,d){I(a)});h(a.html).forEach(function(a,b,d){document.body.insertAdjacentHTML("beforeend",m(a).data)});h(a.json).forEach(function(a,b,d){b=a["@target"];"string"==typeof b?E(a,b):console.error('No target attribute provided for JSON ("'+a+'")')});h(a.js).forEach(function(a,b,d){F(a)})}function I(a,c){"undefined"===typeof c&&(c=!1);var b=u.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8"),d;b?(d=document.createElement("link"),
d.setAttribute("rel","stylesheet"),d.setAttribute("type","text/css"),d.setAttribute("href",a)):(d=document.createElement("style"),d.setAttribute("type","text/css"));c&&d.setAttribute("data-for","screen");try{if(!b){var e=m(a).data,w=a.toString().lastIndexOf("/");if(-1!=w)var g=a.toString().substr(0,w+1),e=e.replace(u.css.noQuotes,"url("+g).replace(u.css.doubleQuotes,'url("'+g).replace(u.css.singleQuotes,"url('"+g);d.appendChild(document.createTextNode(e))}document.getElementsByTagName("head")[0].appendChild(d)}catch(f){console.error("Error appending CSS file ("+
a+"): "+f.toString())}}function T(a,c){"undefined"===typeof c&&(c=!1);var b=document.createElement("style");b.setAttribute("type","text/css");c&&b.setAttribute("data-for","screen");try{b.appendChild(document.createTextNode(a)),document.getElementsByTagName("head")[0].appendChild(b)}catch(d){console.error("Error appending CSS to head: "+d.toString())}}function F(a,c){var b=K(m(a));try{f._eval(b,c)}catch(d){console.error(d.toString()+"("+a+")")}}function K(a){return"string"!=typeof a.data?(console.error('Could not parse "'+
a.url+'". Script files must be plain text.'),""):a.data.replace(u.includeStatement,function(c,b){for(var d=a.url,e=d.toString().lastIndexOf("/"),d=(d.toString().substr(0,e+1)+b).split("/"),e=1;e<d.length;)if(!(0>e)){".."==d[e]&&".."!==d[e-1]&&0<e&&(d.splice(e-1,2),e-=2);if("."===d[e]||""==d[e])d.splice(e,1),e-=1;e++}d=d.join("/");return K(m(d))})}function E(a,c,b){"undefined"===typeof b&&(b=window);var d;try{var e=m(a,!0).data;d=JSON.parse(e)}catch(w){console.error('Cannot parse data file ("'+a+'"). Please check that the file is valid JSON <http://json.org/>.');
return}try{a=d;d=b;"undefined"===typeof d&&(d=window);for(var g=c.split("."),e=0;e<g.length-1;e++){var f=g[e];"undefined"==typeof d[f]&&(d[f]={});d=d[f]}d[g[e]]=a}catch(h){console.error("Could not create object: "+(b==window?"window.":"this.")+c)}}function V(a){for(var c=0,b=a.length;c<b;c++){var d=new Image;d.src=a[c];n.add({url:d.src,data:d})}}function W(a){for(var c=0,b=a.length;c<b;c++){var d={id:a[c]["@id"],title:a[c]["@title"],html:[],css:[],js:[],json:[]};h(a[c].html).forEach(function(a,c,
b){n.rule==v.YES&&m(a);d.html.push(a)});h(a[c].css).forEach(function(a,c,b){n.rule==v.YES&&m(a);d.css.push(a)});h(a[c].js).forEach(function(a,c,b){n.rule==v.YES&&m(a);d.js.push(a)});h(a[c].json).forEach(function(a,c,b){c=a["@target"];"string"==typeof c?d.json.push({url:a,target:c}):console.error('No target attribute provided for JSON ("'+a+'")')});void 0!==a[c]["@default"]&&(null===t?t=d:console.warn("More than one screen is set as the default in app.xml. Ignoring."));k.push(d)}if(null===t)throw"No default screen set.";
}function Q(a){"undefined"===typeof a&&(a="screen");var c=document.createElement("section");c.setAttribute("data-role",a);c.style.width="100%";c.style.overflow="visible";c.style.padding="0px";c.style.margin="0px";c.style.visibility="visible";document.body.appendChild(c)}function H(a){return a&&a.parentNode?null!==a.parentNode.removeChild(a):!1}function h(a){return[].concat(a||[])}function m(a,c){"undefined"===typeof c&&(c=!1);var b;b=n.get(a);if(null!==b.data)return b;b=L(a);c||n.add(b);return b}
function L(a,c){"undefined"===typeof c&&(c=!1);var b=new XMLHttpRequest;b.open("GET",a,!1);b.send();return 200!==b.status&&0!==b.status?(console.error("HTTP status "+b.status+" returned for file: "+a),{url:a,data:""}):{url:a,data:c?b.responseXML:b.responseText}}function M(a){function c(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var b=new N,d=0,e="";if(a.attributes&&0<a.attributes.length)for(d;d<a.attributes.length;d++){var f=a.attributes.item(d);
b["@"+f.name.toLowerCase()]=c(f.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var g,h=0;h<a.childNodes.length;h++)g=a.childNodes.item(h),4===g.nodeType?e+=g.nodeValue:3===g.nodeType?e+=g.nodeValue.trim():1!==g.nodeType||g.prefix||(0===d&&(b={}),f=g.nodeName.toLowerCase(),g=M(g),b.hasOwnProperty(f)?(b[f].constructor!==Array&&(b[f]=[b[f]]),b[f].push(g)):(b[f]=g,d++));b.constructor===N&&b.setValue(c(e));return b}var R=function(){function a(){window._screen=this}a.prototype.subscribe=function(a,
b){window.subscribe(a,b,this)};a.prototype.unsubscribe=function(a,b){window.unsubscribe(a,b)};return a}(),v=function(){function a(c){"undefined"===typeof c&&(c=a.AUTO);this.rule=c;this._files=[]}a.prototype.add=function(c){if(this.rule!=a.NEVER&&null==this.get(c.url).data)return this._files.push(c),c};a.prototype.get=function(a){for(var b=0,d=this._files.length;b<d;b++)if(this._files[b].url===a)return this._files[b];return{url:a,data:null}};a.YES="yes";a.AUTO="auto";a.NEVER="never";return a}(),k=
[],t=null,n=new v,u={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi},isJSIdentifier:/^[$A-Z_][0-9A-Z_$]*$/i,includeStatement:/^#include "(.*)"$/gm},S=function(){};document["goto"]=function(a){if("string"!=typeof a)console.warn("A string indicating a screen ID must be passed to document.goto method.");
else{var c=a;-1!=c.indexOf("/")&&(c=c.substring(0,c.indexOf("/")));for(var b=null,d=0,e=k.length;d<e;d++)if(k[d].id==c){b=k[d];break}null==b?console.error('No screen with ID of "'+c+'".'):y({screen:b,path:"/"+a})}};document.getScreen=q;var X=function(){return function(a,c,b){"undefined"===typeof b&&(b=window);this.type=a;this.action=c;this.screen=b}}(),l=[];window.subscribe=function(a,c,b){"undefined"===typeof b&&(b=window);r(a,c);a=new X(a,c,b);l.push(a)};window.unsubscribe=r;window.publish=function(a,
c){"undefined"===typeof c&&(c=null);if(a===f.READY||a===f.ENTER||a===f.EXIT||a===f.LOAD)throw Error("Illegal. Only Savvy may publish a Savvy event (i.e. Savvy.READY, Savvy.ENTER, Savvy.EXIT or Savvy.LOAD).");return s(a,c)};f.READY=new String("ready");f.ENTER=new String("enter");f.EXIT=new String("exit");f.LOAD=new String("load");var N=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=function(a){this._value=a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=
function(){return null===this._value?"null":this._value.toString()};return a}(),p=M(L("data/app.xml",!0).data);if(void 0===p.app)console.error('Could not parse app.xml. "app" node missing.');else{var O="yes"==p.app["@cordova"]?"deviceready":"load";if("yes"==p.app["@cordova"]){var B=document.createElement("script");B.setAttribute("src","cordova.js");B.setAttribute("type","text/javascript");var C=document.createElement("script");C.setAttribute("src","cordova_plugins.js");C.setAttribute("type","text/javascript");
document.head.appendChild(B);document.head.appendChild(C)}window.addEventListener(O,function c(){window.removeEventListener(O,c);n.rule=void 0===p.app.cache?v.AUTO:p.app.cache;U(p.app);y(A(),!0)},!1)}var z=!1;window.addEventListener("hashchange",function(){if(z)z=!1;else{var c=A();"object"==typeof c.screen&&y(c,!0)}},!1);var J=!0,x=function(){};document["continue"]=x;f.getInfo=function(){return G()}})(Savvy||(Savvy={}));
(function(f){f._eval=function(f,r){void 0===r?(window.execScript||function(f){window.eval.call(window,f)})(f):function(f){eval(f)}.call(r,f)}})(Savvy||(Savvy={}));
