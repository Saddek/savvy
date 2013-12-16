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
(function(e){function Q(a){try{a=a.toString()}catch(c){throw Error("A string indicating a screen ID must be passed to document.goto method.");}var b=a;-1!=b.indexOf("/")&&(b=b.substring(0,b.indexOf("/")));for(var d=null,f=0,B=k.length;f<B;f++)if(k[f].id==b){d=k[f];break}null==d?console.error('No screen with ID of "'+b+'".'):w.call(e,{screen:d,path:"/"+a})}function n(){return document.querySelector("section[data-role='buffer']")||document.querySelector("section[data-role='screen']")}function C(a,c){for(var b=
0;b<l.length;b++)l[b].type===a&&l[b].action===c&&(l.splice(b,1),b--)}function R(a){for(var c=0;c<l.length;c++)l[c].screen===a&&(l.splice(c,1),c--)}function r(a){for(var c=[],b=0;b<arguments.length-1;b++)c[b]=arguments[b+1];var d=!0;l.forEach(function(b,B,h){b.type===a&&"function"===typeof b.action&&(d=!(!1===b.action.apply(b.screen,c)||!1===d))});return d}function D(a){for(var c=0;c<arguments.length-1;c++);if(a===e.READY||a===e.ENTER||a===e.EXIT||a===e.LOAD)throw Error("Illegal. Only Savvy may publish a Savvy event (i.e. Savvy.READY, Savvy.ENTER, Savvy.EXIT or Savvy.LOAD).");
return r.apply(e,arguments)}function w(a,c){function b(){for(var b=0,c=k.length;b<c;b++)try{delete window[k[b].id]}catch(f){window[k[b].id]=null}R(window._screen);window._screen={};S("buffer");n().style.display="none";g(a.screen.html).forEach(function(a,b,c){n().insertAdjacentHTML("beforeend",m(a).data)});var E=window[a.screen.id]=new T;"undefined"===typeof window[a.screen.id]&&console.error('"window.'+a.screen.id+'" could not be created.');g(a.screen.json).forEach(function(a,b,c){F(a.url,a.target,
E)});g(a.screen.js).forEach(function(a,b,c){G(a,E)});this.getInfo=function(){return H(a)};r(e.READY)?d.call(e):v=d}function d(){v=U;I(document.querySelector("section[data-role='screen']"));for(var b=document.querySelectorAll("style[data-for='screen'], link[data-for='screen']"),d=0;d<b.length;d++)I(b[d]);g(a.screen.css).forEach(function(a,b,c){J(a,!0)});n().setAttribute("data-role","screen");-1==window.navigator.appVersion.indexOf("MSIE 8")?V("section[data-role='screen'] { display: block !important; }",
!0):n().style.display="block";document.title=a.screen.title||"";c||(x=!0,window.location.hash="!"+a.path);r(e.ENTER)}"undefined"===typeof c&&(c=!1);var f;K?(f=r(e.LOAD),K=!1):f=r(e.EXIT);f?b.call(e):v=b}function y(){var a=window.location.hash,c;if(""==a||"#"==a||"#!"==a)c=s;else for(var b=0,d=k.length;b<d;b++)if(RegExp("#!/"+k[b].id+"(?=/|$)").test(a)){c=k[b];break}b="";b=a.indexOf("/");b=-1==b?"/":a.substr(b);return{screen:c,path:b}}function H(a){"undefined"===typeof a&&(a=y());return{id:a.screen.id,
title:a.screen.title,isDefault:s==a.screen,path:a.path}}function W(a){X(g(a.img));Y(g(a.screens.screen));g(a.css).forEach(function(a,b,d){J(a)});g(a.html).forEach(function(a,b,d){document.body.insertAdjacentHTML("beforeend",m(a).data)});g(a.json).forEach(function(a,b,d){b=a["@target"];"string"==typeof b?F(a,b):console.error('No target attribute provided for JSON ("'+a+'")')});g(a.js).forEach(function(a,b,d){G(a)})}function J(a,c){"undefined"===typeof c&&(c=!1);var b=t.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8"),
d;b?(d=document.createElement("link"),d.setAttribute("rel","stylesheet"),d.setAttribute("type","text/css"),d.setAttribute("href",a)):(d=document.createElement("style"),d.setAttribute("type","text/css"));c&&d.setAttribute("data-for","screen");try{if(!b){var f=m(a).data,e=a.toString().lastIndexOf("/");if(-1!=e)var h=a.toString().substr(0,e+1),f=f.replace(t.css.noQuotes,"url("+h).replace(t.css.doubleQuotes,'url("'+h).replace(t.css.singleQuotes,"url('"+h);d.appendChild(document.createTextNode(f))}document.getElementsByTagName("head")[0].appendChild(d)}catch(g){console.error("Error appending CSS file ("+
a+"): "+g.toString())}}function V(a,c){"undefined"===typeof c&&(c=!1);var b=document.createElement("style");b.setAttribute("type","text/css");c&&b.setAttribute("data-for","screen");try{b.appendChild(document.createTextNode(a)),document.getElementsByTagName("head")[0].appendChild(b)}catch(d){console.error("Error appending CSS to head: "+d.toString())}}function G(a,c){var b=L(m(a));try{e._eval(b,c)}catch(d){console.error(d.toString()+"("+a+")")}}function L(a){return"string"!=typeof a.data?(console.error('Could not parse "'+
a.url+'". Script files must be plain text.'),""):a.data.replace(t.includeStatement,function(c,b){for(var d=a.url,f=d.toString().lastIndexOf("/"),d=(d.toString().substr(0,f+1)+b).split("/"),f=1;f<d.length;)if(!(0>f)){".."==d[f]&&".."!==d[f-1]&&0<f&&(d.splice(f-1,2),f-=2);if("."===d[f]||""==d[f])d.splice(f,1),f-=1;f++}d=d.join("/");return L(m(d))})}function F(a,c,b){"undefined"===typeof b&&(b=window);var d;try{var f=m(a,!0).data;d=JSON.parse(f)}catch(e){console.error('Cannot parse data file ("'+a+'"). Please check that the file is valid JSON <http://json.org/>.');
return}try{a=d;d=b;"undefined"===typeof d&&(d=window);for(var h=c.split("."),f=0;f<h.length-1;f++){var g=h[f];"undefined"==typeof d[g]&&(d[g]={});d=d[g]}d[h[f]]=a}catch(k){console.error("Could not create object: "+(b==window?"window.":"this.")+c)}}function X(a){for(var c=0,b=a.length;c<b;c++){var d=new Image;d.src=a[c];p.add({url:d.src,data:d})}}function Y(a){for(var c=0,b=a.length;c<b;c++){var d={id:a[c]["@id"],title:a[c]["@title"],html:[],css:[],js:[],json:[]};g(a[c].html).forEach(function(a,b,
c){p.rule==u.YES&&m(a);d.html.push(a)});g(a[c].css).forEach(function(a,b,c){p.rule==u.YES&&m(a);d.css.push(a)});g(a[c].js).forEach(function(a,b,c){p.rule==u.YES&&m(a);d.js.push(a)});g(a[c].json).forEach(function(a,b,c){b=a["@target"];"string"==typeof b?d.json.push({url:a,target:b}):console.error('No target attribute provided for JSON ("'+a+'")')});void 0!==a[c]["@default"]&&(null===s?s=d:console.warn("More than one screen is set as the default in app.xml. Ignoring."));k.push(d)}if(null===s)throw"No default screen set.";
}function S(a){"undefined"===typeof a&&(a="screen");var c=document.createElement("section");c.setAttribute("data-role",a);c.style.width="100%";c.style.overflow="visible";c.style.padding="0px";c.style.margin="0px";c.style.visibility="visible";document.body.appendChild(c)}function I(a){return a&&a.parentNode?null!==a.parentNode.removeChild(a):!1}function g(a){return[].concat(a||[])}function m(a,c){"undefined"===typeof c&&(c=!1);var b;b=p.get(a);if(null!==b.data)return b;b=M(a);c||p.add(b);return b}
function M(a,c){"undefined"===typeof c&&(c=!1);var b=new XMLHttpRequest;b.open("GET",a,!1);b.send();return 200!==b.status&&0!==b.status?(console.error("HTTP status "+b.status+" returned for file: "+a),{url:a,data:""}):{url:a,data:c?b.responseXML:b.responseText}}function N(a){function c(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var b=new O,d=0,f="";if(a.attributes&&0<a.attributes.length)for(d;d<a.attributes.length;d++){var e=a.attributes.item(d);
b["@"+e.name.toLowerCase()]=c(e.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var h,g=0;g<a.childNodes.length;g++)h=a.childNodes.item(g),4===h.nodeType?f+=h.nodeValue:3===h.nodeType?f+=h.nodeValue.trim():1!==h.nodeType||h.prefix||(0===d&&(b={}),e=h.nodeName.toLowerCase(),h=N(h),b.hasOwnProperty(e)?(b[e].constructor!==Array&&(b[e]=[b[e]]),b[e].push(h)):(b[e]=h,d++));b.constructor===O&&b.setValue(c(f));return b}var T=function(){function a(){window._screen=this}a.prototype.subscribe=function(a,
b){window.subscribe.call(e,a,b,this)};a.prototype.unsubscribe=function(a,b){window.unsubscribe.call(e,a,b)};a.prototype.publish=function(a){for(var b=0;b<arguments.length-1;b++);return D.apply(this,arguments)};return a}(),u=function(){function a(c){"undefined"===typeof c&&(c=a.AUTO);this.rule=c;this._files=[]}a.prototype.add=function(c){if(this.rule!=a.NEVER&&null==this.get(c.url).data)return this._files.push(c),c};a.prototype.get=function(a){for(var b=0,d=this._files.length;b<d;b++)if(this._files[b].url===
a)return this._files[b];return{url:a,data:null}};a.YES="yes";a.AUTO="auto";a.NEVER="never";return a}(),k=[],s=null,p=new u,t={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi},isJSIdentifier:/^[$A-Z_][0-9A-Z_$]*$/i,includeStatement:/^#include "(.*)"$/gm},U=function(){};document["goto"]=function(a){Q.call(e,
a)};document.getScreen=n;var Z=function(){return function(a,c,b){"undefined"===typeof b&&(b=window);this.type=a;this.action=c;this.screen=b}}(),l=[];window.subscribe=function(a,c,b){"undefined"===typeof b&&(b=window);C(a,c);a=new Z(a,c,b);l.push(a)};window.unsubscribe=C;window.publish=D;e.READY=new String("ready");e.ENTER=new String("enter");e.EXIT=new String("exit");e.LOAD=new String("load");var O=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=function(a){this._value=
a};a.prototype.valueOf=function(){return this._value};a.prototype.toString=function(){return null===this._value?"null":this._value.toString()};return a}(),q=N(M("data/app.xml",!0).data);if(void 0===q.app)console.error('Could not parse app.xml. "app" node missing.');else{var P="yes"==q.app["@cordova"]?"deviceready":"load";if("yes"==q.app["@cordova"]){var z=document.createElement("script");z.setAttribute("src","cordova.js");z.setAttribute("type","text/javascript");var A=document.createElement("script");
A.setAttribute("src","cordova_plugins.js");A.setAttribute("type","text/javascript");document.head.appendChild(z);document.head.appendChild(A)}window.addEventListener(P,function c(){window.removeEventListener(P,c);p.rule=void 0===q.app.cache?u.AUTO:q.app.cache;W(q.app);w.call(e,y(),!0)},!1)}var x=!1;window.addEventListener("hashchange",function(){if(x)x=!1;else{var c=y();"object"==typeof c.screen&&w.call(e,c,!0)}},!1);var K=!0,v=function(){};document["continue"]=function(){v.call(e)};e.getInfo=function(){return H()}})(Savvy||
(Savvy={}));(function(e){e._eval=function(e,n){void 0===n?(window.execScript||function(e){window.eval.call(window,e)})(e):function(e){eval(e)}.call(n,e)}})(Savvy||(Savvy={}));
