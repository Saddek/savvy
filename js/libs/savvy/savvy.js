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
(function(e){function N(a){a.subscribe=function(c,b){window.subscribe.call(e,c,b,a)};a.unsubscribe=function(a,b){window.unsubscribe.call(e,a,b)};a.publish=function(c){for(var b=0;b<arguments.length-1;b++);return C.apply(a,arguments)}}function s(a,c,b){try{a=a.toString()}catch(d){throw Error("A string indicating a screen ID must be passed to document.goto method.");}var f=a;-1!=f.indexOf("/")&&(f=f.substring(0,f.indexOf("/")));var k=D(f);null==k?console.error('No screen with ID of "'+f+'".'):u.call(e,
{screen:k,path:"/"+a},c,b,!1)}function D(a){for(var c=0,b=h.length;c<b;c++)if(h[c].id==a)return h[c];return null}function E(a,c){for(var b=0;b<m.length;b++)m[b].type===a&&m[b].action===c&&(m.splice(b,1),b--)}function q(a){for(var c=[],b=0;b<arguments.length-1;b++)c[b]=arguments[b+1];var d=!0;m.forEach(function(b,e,g){switch(b.screen){case window:case document.screen:b.type===a&&"function"===typeof b.action&&(d=!(!1===b.action.apply(b.screen,c)||!1===d))}});return d}function C(a){for(var c=0;c<arguments.length-
1;c++);if(a===e.READY||a===e.ENTER||a===e.EXIT||a===e.LOAD)throw Error("Illegal. Only Savvy may publish a Savvy event (i.e. Savvy.READY, Savvy.ENTER, Savvy.EXIT or Savvy.LOAD).");return q.apply(e,arguments)}function u(a,c,b,d){function f(){document.screen=a.screen.html;this.getInfo=function(){return F(a)};q(e.READY)?k.call(e):t=k}function k(){function f(){g&&(g.style.top=null,g.style.left=null,g.removeAttribute("style"),g.removeAttribute("class"),g.parentNode.removeChild(g));k.removeAttribute("class");
document.documentElement.removeAttribute("class");document.title=a.screen.title||"";d||(v=!0,window.location.hash="!"+a.path);q(e.ENTER)}t=O;document.documentElement.className="lock-scroll";var g=document.querySelector("body > object[type='application/x-savvy']"),k=a.screen.html,l=c==e.CUT?0:500;if(g){var h=D(g.getAttribute("data"));h.scroll.top=document.body.scrollTop;h.scroll.left=document.body.scrollLeft;g.className="transition "+c+(b?"-scr2":"-scr1");k.className=c+(b?"-scr1":"-scr2");document.body.appendChild(k);
k.className="transition on-stage";g.style.top=-1*h.scroll.top+"px";g.style.left=-1*h.scroll.left+"px";setTimeout(f,l)}else document.body.appendChild(k),f()}var g;G?(g=q(e.LOAD),G=!1):g=q(e.EXIT);g?f.call(e):t=f}function w(){var a=window.location.hash,c;if(""==a||"#"==a||"#!"==a)c=r;else for(var b=0,d=h.length;b<d;b++)if(RegExp("#!/"+h[b].id+"(?=/|$)").test(a)){c=h[b];break}b="";b=a.indexOf("/");b=-1==b?"/":a.substr(b);return{screen:c,path:b}}function F(a){"undefined"===typeof a&&(a=w());return{id:a.screen.id,
title:a.screen.title,isDefault:r==a.screen,path:a.path}}function P(a){Q(l(a.img));l(a.css).forEach(function(a,b,d){H(a)});l(a.html).forEach(function(a,b,d){document.body.insertAdjacentHTML("beforeend",n(a))});l(a.json).forEach(function(a,b,d){b=a["@target"];"string"==typeof b?I(a,b):console.error('No target attribute provided for JSON ("'+a+'")')});l(a.js).forEach(function(a,b,d){J(a)});R(l(a.screens.screen));delete e._eval}function H(a,c){var b=p.isRemoteUrl.test(a)||-1!=window.navigator.appVersion.indexOf("MSIE 8");
if(b&&c)throw Error("Screen styles sheets cannot be remote (e.g. http://www.examples.com/style.css). Please include remote style sheets globally.");var d;b?(d=document.createElement("link"),d.setAttribute("rel","stylesheet"),d.setAttribute("type","text/css"),d.setAttribute("href",a)):(d=document.createElement("style"),d.setAttribute("type","text/css"));c&&d.setAttribute("data-for",c);try{if(!b){var f=n(a);c&&(f=f.replace(p.css.selector,'body > object[data="'+c+'"] $1$2'));var k=a.toString().lastIndexOf("/");
if(-1!=k)var g=a.toString().substr(0,k+1),f=f.replace(p.css.noQuotes,"url("+g).replace(p.css.doubleQuotes,'url("'+g).replace(p.css.singleQuotes,"url('"+g);d.appendChild(document.createTextNode(f))}document.getElementsByTagName("head")[0].appendChild(d)}catch(e){console.error("Error appending CSS file ("+a+"): "+e.toString())}}function J(a,c){var b=K(a);try{e._eval(b,c)}catch(d){console.error(d.toString()+"("+a+")")}}function K(a){return n(a).replace(p.include,function(c,b){for(var d=a.toString().lastIndexOf("/"),
d=(a.toString().substr(0,d+1)+b).split("/"),f=1;f<d.length;)if(!(0>f)){".."==d[f]&&".."!==d[f-1]&&0<f&&(d.splice(f-1,2),f-=2);if("."===d[f]||""==d[f])d.splice(f,1),f-=1;f++}d=d.join("/");return K(d)})}function I(a,c,b){"undefined"===typeof b&&(b=window);var d;try{var f=n(a);d=JSON.parse(f)}catch(e){console.error('Cannot parse data file ("'+a+'"). Please check that the file is valid JSON <http://json.org/>.');return}try{a=d;d=b;"undefined"===typeof d&&(d=window);for(var g=c.split("."),f=0;f<g.length-
1;f++){var h=g[f];"undefined"==typeof d[h]&&(d[h]={});d=d[h]}d[g[f]]=a}catch(l){console.error("Could not create object: "+(b==window?"window.":"this.")+c)}}function Q(a){for(var c=0,b=a.length;c<b;c++){var d=new Image;d.src=a[c];S.push(d)}}function R(a){for(var c=0,b=a.length;c<b;c++){var d=document.createElement("object");d.setAttribute("data",a[c]["@id"]);d.setAttribute("type","application/x-savvy");N(d);var f={id:a[c]["@id"],title:a[c]["@title"],html:d,scroll:{top:0,left:0}};window[f.id]=f.html;
l(a[c].css).forEach(function(a,b,c){H(a,f.id)});l(a[c].html).forEach(function(a,b,c){f.html.insertAdjacentHTML("beforeend",n(a))});l(a[c].json).forEach(function(a,b,c){b=a["@target"];"string"==typeof b?(b=a.target,I(a,b,f.html)):console.error('No target attribute provided for JSON ("'+a+'")')});l(a[c].js).forEach(function(a,b,c){J(a,f.html)});void 0!==a[c]["@default"]&&(null===r?r=f:console.warn("More than one screen is set as the default in app.xml. Ignoring."));h.push(f)}if(null===r)throw"No default screen set.";
}function l(a){return[].concat(a||[])}function n(a,c){"undefined"===typeof c&&(c=!1);var b=new XMLHttpRequest;b.open("GET",a,!1);b.send();return 200!==b.status&&0!==b.status?(console.error("HTTP status "+b.status+" returned for file: "+a),null):c?b.responseXML:b.responseText}function L(a){function c(a){return/^\s*$/.test(a)?null:/^(?:true|false)$/i.test(a)?"true"===a.toLowerCase():isFinite(a)?parseFloat(a):a}var b=new M,d=0,f="";if(a.attributes&&0<a.attributes.length)for(d;d<a.attributes.length;d++){var e=
a.attributes.item(d);b["@"+e.name.toLowerCase()]=c(e.value.trim())}if(a.childNodes&&0<a.childNodes.length)for(var g,h=0;h<a.childNodes.length;h++)g=a.childNodes.item(h),4===g.nodeType?f+=g.nodeValue:3===g.nodeType?f+=g.nodeValue.trim():1!==g.nodeType||g.prefix||(0===d&&(b={}),e=g.nodeName.toLowerCase(),g=L(g),b.hasOwnProperty(e)?(b[e].constructor!==Array&&(b[e]=[b[e]]),b[e].push(g)):(b[e]=g,d++));b.constructor===M&&b.setValue(c(f));return b}var h=[],r=null,p={isRemoteUrl:/(http|ftp|https):\/\/[a-z0-9-_]+(.[a-z0-9-_]+)+([a-z0-9-.,@?^=%&;:/~+#]*[a-z0-9-@?^=%&;/~+#])?/i,
css:{singleQuotes:/url\('(?!https?:\/\/)(?!\/)/gi,doubleQuotes:/url\("(?!https?:\/\/)(?!\/)/gi,noQuotes:/url\((?!https?:\/\/)(?!['"]\/?)/gi,selector:/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/gi},include:/^#include "(.*)"$/gm},O=function(){};document["goto"]=function(a,c,b){"undefined"===typeof c&&(c=e.CUT);"undefined"===typeof b&&(b=!1);c==e.CUT&&!0===b&&(console.warn("The cut transition has no reverse variant."),b=!1);s.call(e,a,c,b)};var T=function(){return function(a,c,b){"undefined"===typeof b&&(b=window);
this.type=a;this.action=c;this.screen=b}}(),m=[];window.subscribe=function(a,c,b){"undefined"===typeof b&&(b=window);E(a,c);a=new T(a,c,b);m.push(a)};window.unsubscribe=E;window.publish=C;e.READY=new String("ready");e.ENTER=new String("enter");e.EXIT=new String("exit");e.LOAD=new String("load");e.CUT=new String("cut");e.PAN=new String("pan");var M=function(){function a(a){this._value=void 0===a?null:a}a.prototype.setValue=function(a){this._value=a};a.prototype.valueOf=function(){return this._value};
a.prototype.toString=function(){return null===this._value?"null":this._value.toString()};return a}(),x=L(n("data/app.xml",!0));if(void 0===x.app)console.error('Could not parse app.xml. "app" node missing.');else{var y="load",z=window;if("yes"==x.app["@cordova"]){var y="deviceready",z=document,A=document.createElement("script");A.setAttribute("src","cordova.js");A.setAttribute("type","text/javascript");var B=document.createElement("script");B.setAttribute("src","cordova_plugins.js");B.setAttribute("type",
"text/javascript");document.head.appendChild(A);document.head.appendChild(B)}z.addEventListener(y,function c(){z.removeEventListener(y,c);P(x.app);u.call(e,w(),e.CUT,!1,!0)},!1)}var v=!1;window.addEventListener("hashchange",function(){if(v)v=!1;else{var c=w();"object"==typeof c.screen&&u.call(e,c,e.CUT,!1,!0)}},!1);var G=!0,t=function(){};document["continue"]=function(){t.call(e)};e.getInfo=function(){return F()};var S=[]})(Savvy||(Savvy={}));
(function(e){e._eval=function(e,s){void 0===s?(window.execScript||function(e){window.eval.call(window,e)})(e):function(e){eval(e)}.call(s,e)}})(Savvy||(Savvy={}));
