/*
  _________                          
 /   _____/____ ___  _____  _____.__.
 \_____  \\__  \\  \/ /\  \/ <   |  |
 /        \/ __ \\   /  \   / \___  |
/_______  (____  /\_/    \_/  / ____|
        \/     \/             \/     
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

window._global={};window._screen={};var Savvy;
(function(e){function D(a,b){for(var c=0;c<n.length;c++)n[c].type===a&&n[c].action===b&&(n.splice(c,1),c--)}function s(a){for(var b=0;b<n.length;b++)n[b].screen===a&&(n.splice(b,1),b--)}function t(a,b){"undefined"===typeof b&&(b=null);var c=!0;n.forEach(function(d,f,h){d.type===a&&"function"===typeof d.action&&(c=!(!1===d.action.call(d.screen,b)||!1===c))});return c}function w(a,b){function c(){for(var b=0,c=l.length;b<c;b++)try{delete window[l[b].id]}catch(f){window[l[b].id]=null}s(window._screen);
window._screen={};y(k+"-BUFFER",u.buffer,"buffer");g(a.screen.html).forEach(function(a,b,c){e.getScreen().innerHTML+=m(a.url).data});var h=window[a.screen.id]=new M;"undefined"===typeof window[a.screen.id]&&console.error('"window.'+a.screen.id+'" could not be created.');g(a.screen.js).forEach(function(a,b,c){E(a.url,h)});this.getInfo=function(){return F(a)};t(e.READY)?d():v=d}function d(){v=N;for(z(k);z(k+"-CSS-"+f);)f--;g(a.screen.css).forEach(function(a,b,c){G(a.url)});e.getScreen().id=k;e.getScreen().setAttribute("style",
u.screen);e.getScreen().setAttribute("data-role","screen");document.title=a.screen.title||"";b||(A=!0,window.location.hash="!"+a.path);t(e.ENTER)}"undefined"===typeof b&&(b=!1);var f=B-1,h;H?(h=t(e.LOAD),H=!1):h=t(e.EXIT);h?c():v=c}function C(a){a=window.location.hash;var b;if(""==a||"#"==a||"#!"==a)b=r;else for(var c=0,d=l.length;c<d;c++)if(RegExp("#!/"+l[c].id+"(?=/|$)").test(a)){b=l[c];break}c="";c=a.indexOf("/");c=-1==c?"/":a.substr(c);return{screen:b,path:c}}function F(a){"undefined"===typeof a&&
(a=C());return{id:a.screen.id,title:a.screen.title,isDefault:r==a.screen,path:a.path}}function O(a){P(g(a.img));Q(g(a.screens.screen));g(a.css).forEach(function(a,c,d){G(a,k+"-GLOBAL-CSS-"+B++)});g(a.html).forEach(function(a,c,d){e.getGlobal().innerHTML+=m(a).data});g(a.json).forEach(function(a,c,d){c=a["@target"];if("string"==typeof c)a:{d=void 0;"undefined"===typeof d&&(d=window);var f,h=m(a).data;try{f=JSON.parse(h)}catch(e){console.error('Cannot parse data file ("'+a+'"). Only JSON or XML formats are supported.');
break a}try{a=f;f=d;"undefined"===typeof f&&(f=window);for(var g=c.split("."),h=0;h<g.length-1;h++){var x=g[h];"undefined"==typeof f[x]&&(f[x]={});f=f[x]}f[g[h]]=a}catch(k){console.error("Could not create object: "+(d==window?"window.":"this.")+c)}}else console.error('No target attribute provided for data node ("'+a+'")')});g(a.js).forEach(function(a,c,d){E(a)})}function G(a,b){var c=p.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8"),d;c?(d=document.createElement("link"),d.setAttribute("rel",
"stylesheet"),d.setAttribute("type","text/css"),d.setAttribute("href",a)):(d=document.createElement("style"),d.setAttribute("type","text/css"));d.id=void 0==b?k+"-CSS-"+B++:b;try{if(!c){var f=m(a).data,h=a.toString().lastIndexOf("/");if(-1!=h)var e=a.toString().substr(0,h+1),f=f.replace(p.css.noQuotes,"url("+e).replace(p.css.doubleQuotes,'url("'+e).replace(p.css.singleQuotes,"url('"+e);d.appendChild(document.createTextNode(f))}document.getElementsByTagName("head")[0].appendChild(d)}catch(g){console.error("Error appending CSS file ("+
a+"): "+g.toString())}}function E(a,b){var c=I(m(a));try{e._eval(c,b)}catch(d){console.error(d.toString()+"("+a+")")}}function I(a){return"string"!=typeof a.data?(console.error('Could not parse "'+a.url+'". Script files must be plain text.'),""):a.data.replace(p.includeStatement,function(b,c){for(var d=a.url,f=d.toString().lastIndexOf("/"),d=(d.toString().substr(0,f+1)+c).split("/"),f=1;f<d.length;)if(!(0>f)){".."==d[f]&&".."!==d[f-1]&&0<f&&(d.splice(f-1,2),f-=2);if("."===d[f]||""==d[f])d.splice(f,
1),f-=1;f++}d=d.join("/");return I(m(d))})}function P(a){for(var b=0,c=a.length;b<c;b++){var d=new Image;d.src=a[b];q.add({url:d.src,data:d})}}function Q(a){for(var b=0,c=a.length;b<c;b++){var d={id:a[b]["@id"],title:a[b]["@title"],html:[],js:[],data:[],css:[]};g(a[b].html).forEach(function(a,b,c){a=m(a.toString());q.add(a);d.html.push(a)});g(a[b].js).forEach(function(a,b,c){a=m(a.toString());q.add(a);d.js.push(a)});g(a[b].css).forEach(function(a,b,c){a=m(a.toString());q.add(a);d.css.push(a)});void 0!==
a[b]["@default"]&&(null===r?r=d:console.warn("More than one screen is set as the default in app.xml. Ignoring."));l.push(d)}if(null===r)throw"No default screen set.";}function y(a,b,c){z(a);var d=document.createElement("div");d.id=a;d.setAttribute("style",b);c&&d.setAttribute("data-role",c);document.body.appendChild(d)}function z(a){return(a=document.getElementById(a))&&a.parentNode?null!==a.parentNode.removeChild(a):!1}function g(a){return[].concat(a||[])}function m(a){var b;b=q.get(a);if(null!==
b.data)return b;b=new XMLHttpRequest;b.open("GET",a,!1);b.send();if(200!==b.status&&0!==b.status)return console.error("HTTP status "+b.status+" returned for file: "+a),{url:a,data:""};b=null!==b.responseXML&&p.xmlDeclaration.test(b.responseText)?b.responseXML:b.responseText;return b={url:a,data:b}}function J(a){function b(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):isFinite(Date.parse(a))?new Date(a):a}var c=new K,d=0,f="";if(a.attributes&&
0<a.attributes.length)for(d;d<a.attributes.length;d++){var e=a.attributes.item(d);c["@"+e.name.toLowerCase()]=b(e.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var g,k=0;k<a.childNodes.length;k++)g=a.childNodes.item(k),4===g.nodeType?f+=g.nodeValue:3===g.nodeType?f+=g.nodeValue.trim():1!==g.nodeType||g.prefix||(0===d&&(c={}),e=g.nodeName.toLowerCase(),g=J(g),c.hasOwnProperty(e)?(c[e].constructor!==Array&&(c[e]=[c[e]]),c[e].push(g)):(c[e]=g,d++));c.constructor===K&&c.setValue(b(f));return c}
var M=function(){function a(){window._screen=this}a.prototype.subscribe=function(a,c){e.subscribe(a,c,this)};a.prototype.unsubscribe=function(a,c){e.unsubscribe(a,c)};return a}(),L=function(){function a(b){"undefined"===typeof b&&(b=a.AUTO);this.rule=b;this._files=[]}a.prototype.add=function(b){if(this.rule!=a.NEVER&&null==this.get(b.url).data)return this._files.push(b),b};a.prototype.get=function(a){for(var c=0,d=this._files.length;c<d;c++)if(this._files[c].url===a)return this._files[c];return{url:a,
data:null}};a.AUTO="auto";a.NEVER="never";return a}(),l=[],r=null,q=new L,p={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi},isJSIdentifier:/^[$A-Z_][0-9A-Z_$]*$/i,xmlDeclaration:/^<\?xml.*\?>/i,includeStatement:/^#include "(.*)"$/gm},k="SAVVY-"+function(){function a(){return(65536*(1+Math.random())|
0).toString(16).substring(1)}return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()}(),N=function(){};e.go=function(a){"undefined"===typeof a&&(a=null);if(null==a)v();else{var b=a.toString();-1!=b.indexOf("/")&&(b=b.substring(0,b.indexOf("/")));for(var c=null,d=0,f=l.length;d<f;d++)if(l[d].id==b){c=l[d];break}null==c?console.error('No screen with ID of "'+b+'".'):w({screen:c,path:"/"+a})}};e.getGlobal=function(){return document.getElementById(k+"-GLOBAL")};e.getScreen=function(){return document.getElementById(k+
"-BUFFER")||document.getElementById(k)};var R=function(){return function(a,b,c){"undefined"===typeof c&&(c=window);this.type=a;this.action=b;this.screen=c}}(),n=[];e.subscribe=function(a,b,c){"undefined"===typeof c&&(c=window);D(a,b);a=new R(a,b,c);n.push(a)};e.unsubscribe=D;var u={global:"width:100% !important; over-flow: visible !important; padding:0px !important; margin:0px !important; visibility:visible !important; display:block !important;",buffer:"width:100% !important; over-flow: visible !important; padding:0px !important; margin:0px !important; visibility:visible !important; display:none !important;",
screen:"width:100% !important; over-flow: visible !important; padding:0px !important; margin:0px !important; visibility:visible !important; display:block !important;"},B=0;e.READY="ready";e.ENTER="enter";e.EXIT="exit";e.LOAD="load";e.start=function(){this.start=function(){console.warn("Savvy.start can only be called once.")};y(k+"-GLOBAL",u.global,"global");y(k,u.screen,"screen");var a=J(m("data/app.xml").data);if(void 0===a.app)throw'Could not parse app.xml. "app" node missing.';q.rule=void 0===
a.app.cache?L.AUTO:a.app.cache;O(a.app);w(C(),!0)};var A=!1;window.addEventListener("hashchange",function(){A?A=!1:w(C(),!0)},!1);var H=!0,v=function(){};e.getInfo=function(){return F()};var K=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=function(a){this._value=a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=function(){return null===this._value?"null":this._value.toString()};return a}()})(Savvy||(Savvy={}));
(function(e){e._eval=function(e,s){void 0===s?(window.execScript||function(e){window.eval.call(window,e)})(e):function(e){eval(e)}.call(s,e)}})(Savvy||(Savvy={}));
