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
(function(e){function D(a,c){for(var b=0;b<m.length;b++)m[b].type===a&&m[b].action===c&&(m.splice(b,1),b--)}function t(a){for(var c=0;c<m.length;c++)m[c].screen===a&&(m.splice(c,1),c--)}function u(a,c){"undefined"===typeof c&&(c=null);var b=!0;m.forEach(function(d,f,k){d.type===a&&"function"===typeof d.action&&(b=!(!1===d.action.call(d.screen,c)||!1===b))});return b}function w(a,c){function b(){for(var b=0,c=h.length;b<c;b++)try{delete window[h[b].id]}catch(f){window[h[b].id]=null}t(document.body.screen);document.body.screen=
{};P(n+"-BUFFER","buffer");e.getScreen().style.display="none";g(a.screen.html).forEach(function(a,b,c){e.getScreen().innerHTML+=l(a.url).data});var k=window[a.screen.id]=new Q;"undefined"===typeof window[a.screen.id]&&console.error('"window.'+a.screen.id+'" could not be created.');g(a.screen.json).forEach(function(a,b,c){E(a.file.url,a.target,k)});g(a.screen.js).forEach(function(a,b,c){F(a.url,k)});this.getInfo=function(){return G(a)};u(e.READY)?d():v=d}function d(){v=R;for(y(n);y(n+"-CSS-"+f);)f--;
g(a.screen.css).forEach(function(a,b,c){H(a.url,n+"-CSS-"+I++)});e.getScreen().id=n;e.getScreen().setAttribute("data-role","screen");e.getScreen().style.display="block";document.title=a.screen.title||"";c||(z=!0,window.location.hash="!"+a.path);u(e.ENTER)}"undefined"===typeof c&&(c=!1);if(document.body.screen==window[a.screen.id])c?console.info("Request to load current screen over itself. This is usually caused by navigating back from an fragment and can be ignored."):console.warn("Attempt to load current screen as new screen. This is unsupported behavior. Ignoring.");
else{var f=I-1,k;J?(k=u(e.LOAD),J=!1):k=u(e.EXIT);k?b():v=b}}function A(){var a=window.location.hash,c;if(""==a||"#"==a||"#!"==a)c=r;else for(var b=0,d=h.length;b<d;b++)if(RegExp("#!/"+h[b].id+"(?=/|$)").test(a)){c=h[b];break}b="";b=a.indexOf("/");b=-1==b?"/":a.substr(b);return{screen:c,path:b}}function G(a){"undefined"===typeof a&&(a=A());return{id:a.screen.id,title:a.screen.title,isDefault:r==a.screen,path:a.path}}function S(a){T(g(a.img));U(g(a.screens.screen));g(a.css).forEach(function(a,b,d){H(a)});
g(a.html).forEach(function(a,b,d){document.body.insertAdjacentHTML("beforeend",l(a).data)});g(a.json).forEach(function(a,b,d){b=a["@target"];"string"==typeof b?E(a,b):console.error('No target attribute provided for JSON ("'+a+'")')});g(a.js).forEach(function(a,b,d){F(a)})}function H(a,c){var b=s.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8"),d;b?(d=document.createElement("link"),d.setAttribute("rel","stylesheet"),d.setAttribute("type","text/css"),d.setAttribute("href",a)):
(d=document.createElement("style"),d.setAttribute("type","text/css"));"string"==typeof c&&(d.id=c);try{if(!b){var f=l(a).data,k=a.toString().lastIndexOf("/");if(-1!=k)var x=a.toString().substr(0,k+1),f=f.replace(s.css.noQuotes,"url("+x).replace(s.css.doubleQuotes,'url("'+x).replace(s.css.singleQuotes,"url('"+x);d.appendChild(document.createTextNode(f))}document.getElementsByTagName("head")[0].appendChild(d)}catch(e){console.error("Error appending CSS file ("+a+"): "+e.toString())}}function F(a,c){var b=
K(l(a));try{e._eval(b,c)}catch(d){console.error(d.toString()+"("+a+")")}}function K(a){return"string"!=typeof a.data?(console.error('Could not parse "'+a.url+'". Script files must be plain text.'),""):a.data.replace(s.includeStatement,function(c,b){for(var d=a.url,f=d.toString().lastIndexOf("/"),d=(d.toString().substr(0,f+1)+b).split("/"),f=1;f<d.length;)if(!(0>f)){".."==d[f]&&".."!==d[f-1]&&0<f&&(d.splice(f-1,2),f-=2);if("."===d[f]||""==d[f])d.splice(f,1),f-=1;f++}d=d.join("/");return K(l(d))})}
function E(a,c,b){"undefined"===typeof b&&(b=window);var d;try{var f=l(a).data;d=JSON.parse(f)}catch(k){console.error('Cannot parse data file ("'+a+'"). Please check that the file is valid JSON <http://json.org/>.');return}try{a=d;d=b;"undefined"===typeof d&&(d=window);for(var e=c.split("."),f=0;f<e.length-1;f++){var g=e[f];"undefined"==typeof d[g]&&(d[g]={});d=d[g]}d[e[f]]=a}catch(h){console.error("Could not create object: "+(b==window?"window.":"this.")+c)}}function T(a){for(var c=0,b=a.length;c<
b;c++){var d=new Image;d.src=a[c];p.add({url:d.src,data:d})}}function U(a){for(var c=0,b=a.length;c<b;c++){var d={id:a[c]["@id"],title:a[c]["@title"],html:[],css:[],js:[],json:[]};g(a[c].html).forEach(function(a,b,c){a=l(a.toString());p.add(a);d.html.push(a)});g(a[c].css).forEach(function(a,b,c){a=l(a.toString());p.add(a);d.css.push(a)});g(a[c].js).forEach(function(a,b,c){a=l(a.toString());p.add(a);d.js.push(a)});g(a[c].json).forEach(function(a,b,c){b=a["@target"];if("string"==typeof b){var e=a.toString();
a=l(e);p.add(a);d.json.push({file:a,target:b})}else console.error('No target attribute provided for JSON ("'+e+'")')});void 0!==a[c]["@default"]&&(null===r?r=d:console.warn("More than one screen is set as the default in app.xml. Ignoring."));h.push(d)}if(null===r)throw"No default screen set.";}function P(a,c){y(a);var b=document.createElement("article");b.id=a;"string"==typeof c&&b.setAttribute("data-role",c);b.style.width="100%";b.style.overflow="visible";b.style.padding="0px";b.style.margin="0px";
b.style.visibility="visible";document.body.appendChild(b)}function y(a){return(a=document.getElementById(a))&&a.parentNode?null!==a.parentNode.removeChild(a):!1}function g(a){return[].concat(a||[])}function l(a,c){"undefined"===typeof c&&(c=!1);var b;b=p.get(a);if(null!==b.data)return b;b=new XMLHttpRequest;b.open("GET",a,!1);b.send();return 200!==b.status&&0!==b.status?(console.error("HTTP status "+b.status+" returned for file: "+a),{url:a,data:""}):b={url:a,data:c?b.responseXML:b.responseText}}
function L(a){function c(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var b=new M,d=0,f="";if(a.attributes&&0<a.attributes.length)for(d;d<a.attributes.length;d++){var e=a.attributes.item(d);b["@"+e.name.toLowerCase()]=c(e.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var g,h=0;h<a.childNodes.length;h++)g=a.childNodes.item(h),4===g.nodeType?f+=g.nodeValue:3===g.nodeType?f+=g.nodeValue.trim():1!==g.nodeType||g.prefix||(0===
d&&(b={}),e=g.nodeName.toLowerCase(),g=L(g),b.hasOwnProperty(e)?(b[e].constructor!==Array&&(b[e]=[b[e]]),b[e].push(g)):(b[e]=g,d++));b.constructor===M&&b.setValue(c(f));return b}var Q=function(){function a(){document.body.screen=this}a.prototype.subscribe=function(a,b){e.subscribe(a,b,this)};a.prototype.unsubscribe=function(a,b){e.unsubscribe(a,b)};return a}(),N=function(){function a(c){"undefined"===typeof c&&(c=a.AUTO);this.rule=c;this._files=[]}a.prototype.add=function(c){if(this.rule!=a.NEVER&&
null==this.get(c.url).data)return this._files.push(c),c};a.prototype.get=function(a){for(var b=0,d=this._files.length;b<d;b++)if(this._files[b].url===a)return this._files[b];return{url:a,data:null}};a.AUTO="auto";a.NEVER="never";return a}(),h=[],r=null,p=new N,s={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi},
isJSIdentifier:/^[$A-Z_][0-9A-Z_$]*$/i,includeStatement:/^#include "(.*)"$/gm},n="SAVVY-"+function(){function a(){return(65536*(1+Math.random())|0).toString(16).substring(1)}return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()}(),R=function(){};e.go=function(a){"undefined"===typeof a&&(a=null);if(null==a)v();else{var c=a.toString();-1!=c.indexOf("/")&&(c=c.substring(0,c.indexOf("/")));for(var b=null,d=0,e=h.length;d<e;d++)if(h[d].id==c){b=h[d];break}null==b?console.error('No screen with ID of "'+
c+'".'):w({screen:b,path:"/"+a})}};e.getScreen=function(){return document.getElementById(n+"-BUFFER")||document.getElementById(n)};var V=function(){return function(a,c,b){"undefined"===typeof b&&(b=window);this.type=a;this.action=c;this.screen=b}}(),m=[];e.subscribe=function(a,c,b){"undefined"===typeof b&&(b=window);D(a,c);a=new V(a,c,b);m.push(a)};e.unsubscribe=D;var I=0;e.READY="ready";e.ENTER="enter";e.EXIT="exit";e.LOAD="load";var M=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=
function(a){this._value=a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=function(){return null===this._value?"null":this._value.toString()};return a}(),q=L(l("data/app.xml",!0).data);if(void 0===q.app)console.error('Could not parse app.xml. "app" node missing.');else{var O="yes"==q.app["@cordova"]?"deviceready":"load";if("yes"==q.app["@cordova"]){var B=document.createElement("script");B.setAttribute("src","cordova.js");B.setAttribute("type","text/javascript");var C=document.createElement("script");
C.setAttribute("src","cordova_plugins.js");C.setAttribute("type","text/javascript");document.head.appendChild(B);document.head.appendChild(C)}window.addEventListener(O,function c(){window.removeEventListener(O,c);document.body.screen={};p.rule=void 0===q.app.cache?N.AUTO:q.app.cache;S(q.app);w(A(),!0)},!1)}var z=!1;window.addEventListener("hashchange",function(){if(z)z=!1;else{var c=A();"object"==typeof c.screen&&w(c,!0)}},!1);var J=!0,v=function(){};e.getInfo=function(){return G()}})(Savvy||(Savvy=
{}));(function(e){e._eval=function(e,t){void 0===t?(window.execScript||function(e){window.eval.call(window,e)})(e):function(e){eval(e)}.call(t,e)}})(Savvy||(Savvy={}));
