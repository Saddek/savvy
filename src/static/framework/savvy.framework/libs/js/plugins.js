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

   Copyright 2014 Oliver Moran

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/

// Monkey patches for various JavaScript objects (required for older browsers)

// Create the console object if it doesn't exist
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

// Monkey patch window.addEventListener and window.removeEventListener on IE8
window.addEventListener||(window.addEventListener=function(a,b,c){window.attachEvent("on"+a,b,c)});
window.removeEventListener||(window.removeEventListener=function(a,b,c){window.detachEvent("on"+a,b,c)});

// Creates a standard JSON serialiser/de-serialiser, if it does not exist already:
// - https://github.com/douglascrockford/JSON-js
// - http://json.org/
"object"!==typeof JSON&&(JSON={});
(function(){function l(a){return 10>a?"0"+a:a}function q(a){r.lastIndex=0;return r.test(a)?'"'+a.replace(r,function(a){var c=t[a];return"string"===typeof c?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function n(a,k){var c,d,h,p,g=e,f,b=k[a];b&&("object"===typeof b&&"function"===typeof b.toJSON)&&(b=b.toJSON(a));"function"===typeof j&&(b=j.call(k,a,b));switch(typeof b){case "string":return q(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);
case "object":if(!b)return"null";e+=m;f=[];if("[object Array]"===Object.prototype.toString.apply(b)){p=b.length;for(c=0;c<p;c+=1)f[c]=n(c,b)||"null";h=0===f.length?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if(j&&"object"===typeof j){p=j.length;for(c=0;c<p;c+=1)"string"===typeof j[c]&&(d=j[c],(h=n(d,b))&&f.push(q(d)+(e?": ":":")+h))}else for(d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=n(d,b))&&f.push(q(d)+(e?": ":":")+h);h=0===f.length?"{}":e?"{\n"+e+f.join(",\n"+
e)+"\n"+g+"}":"{"+f.join(",")+"}";e=g;return h}}"function"!==typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+l(this.getUTCMonth()+1)+"-"+l(this.getUTCDate())+"T"+l(this.getUTCHours())+":"+l(this.getUTCMinutes())+":"+l(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var s=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
r=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,m,t={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},j;"function"!==typeof JSON.stringify&&(JSON.stringify=function(a,k,c){var d;m=e="";if("number"===typeof c)for(d=0;d<c;d+=1)m+=" ";else"string"===typeof c&&(m=c);if((j=k)&&"function"!==typeof k&&("object"!==typeof k||"number"!==typeof k.length))throw Error("JSON.stringify");return n("",{"":a})});
"function"!==typeof JSON.parse&&(JSON.parse=function(a,e){function c(a,d){var g,f,b=a[d];if(b&&"object"===typeof b)for(g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),void 0!==f?b[g]=f:delete b[g]);return e.call(a,d,b)}var d;a=String(a);s.lastIndex=0;s.test(a)&&(a=a.replace(s,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),"function"===typeof e?c({"":d},""):d;throw new SyntaxError("JSON.parse");})})();

// Prevent iOS body overscoll
if(window.navigator.standalone){var canScrollRight=function(a){return a.scrollLeft!=a.scrollWidth-a.getBoundingClientRect().width},canScrollLeft=function(a){return 0!=a.scrollLeft},canScrollDown=function(a){return a.scrollTop!=a.scrollHeight-a.getBoundingClientRect().height},canScrollUp=function(a){return 0!=a.scrollTop},canScrollHorizontal=function(a){return a.scrollWidth>a.getBoundingClientRect().width},canScrollVertical=function(a){return a.scrollHeight>a.getBoundingClientRect().height},isScrollable= function(a){var c=window.getComputedStyle(a).overflowX;a=window.getComputedStyle(a).overflowY;return"auto"==c||"scroll"==c||"auto"==a||"scroll"==a},isOnWhiteList=function(a){switch(a.constructor){case HTMLInputElement:return"range"==a.type;case HTMLAudioElement:return!0;default:return!1}},start={x:0,y:0};document.addEventListener("touchstart",function(a){start.x=a.touches[0].screenX;start.y=a.touches[0].screenY});document.addEventListener("touchmove",function(a){for(var c=a.touches[0].screenX-start.x, d=a.touches[0].screenY-start.y,b=a.target;b!=document.documentElement;){if(!isScrollable(b)){if(isOnWhiteList(b))return}else if(canScrollVertical(b)&&Math.abs(d)>Math.abs(c)){if(0<d&&canScrollUp(b)||0>d&&canScrollDown(b))return}else if(canScrollHorizontal(b)&&Math.abs(c)>Math.abs(d)&&(0<c&&canScrollLeft(b)||0>c&&canScrollRight(b)))return;b=b.parentNode}a.preventDefault()})};

// iOS7 cannot open browser windows, so over-ride window.open to inform user of this
navigator.userAgent.match(/(iPad|iPhone);.*CPU.*OS 7_\d/i)&&window.navigator.standalone&&(window.open=function(b,a){"_self"!=a&&alert("Unfortunately, iOS 7 cannot open Safari from standalone web apps. Please report this bug at: http://bugreport.apple.com")});

// Enable scrolling on Android < 3.0
if(0<=navigator.userAgent.indexOf("Android")){var from=navigator.userAgent.indexOf("Android")+8,version=navigator.userAgent.substr(from,5);if(3>parseFloat(version)){var isScrollable=function(a){var b=window.getComputedStyle(a).overflowX;a=window.getComputedStyle(a).overflowY;return"auto"==b||"scroll"==b||"auto"==a||"scroll"==a},sample={x:0,y:0},velocity={x:0,y:0},point={x:0,y:0},sampleTime=new Date,i,obj;document.addEventListener("touchstart",function(a){clearInterval(i);point.x=a.touches[0].screenX; point.y=a.touches[0].screenY;sample.x=point.x;sample.y=point.y;velocity.x=0;velocity.y=0;for(obj=a.target;obj!=document.documentElement&&!isScrollable(obj);)obj=obj.parentNode});document.addEventListener("touchmove",function(a){var b=a.touches[0].screenX-point.x,c=a.touches[0].screenY-point.y;point.x=a.touches[0].screenX;point.y=a.touches[0].screenY;(new Date).getTime()>sampleTime.getTime()+100&&(velocity.x=point.x-sample.x,velocity.y=point.y-sample.y,sample.x=point.x,sample.y=point.y);isScrollable(obj)&& (obj.scrollLeft-=b,obj.scrollTop-=c,a.preventDefault())});document.addEventListener("touchend",function(a){i=setInterval(function(){velocity.x*=.9;velocity.y*=.9;obj.scrollLeft-=velocity.x;obj.scrollTop-=velocity.y;10>Math.abs(velocity.x)&&10>Math.abs(velocity.y)&&clearInterval(i)},1E3/24)})}};

// Add a "svg" class to the HTML tag if device supports SVG
"undefined"!=typeof SVGSVGElement&&(document.documentElement.className+=" svg");

// Thumbs.js - 0.6.0 - Polyfills touch events on desktops
// Copyright (c) 2010 Michael Brooks - MIT License
// http://mwbrooks.github.io/thumbs.js/download/thumbs.0.6.0.min.js
(function(c){try{document.createEvent("TouchEvent");return}catch(f){}var d={mousedown:"touchstart",mouseup:"touchend",mousemove:"touchmove"};var a=function(){for(var e in d){document.body.addEventListener(e,function(i){var h=b(d[i.type],i);i.target.dispatchEvent(h);var g=i.target["on"+d[i.type]];if(typeof g==="function"){g(i)}},false)}};var b=function(g,i){var h=document.createEvent("MouseEvents");h.initMouseEvent(g,i.bubbles,i.cancelable,i.view,i.detail,i.screenX,i.screenY,i.clientX,i.clientY,i.ctrlKey,i.altKey,i.shiftKey,i.metaKey,i.button,i.relatedTarget);return h};if(document.readyState==="complete"||document.readyState==="loaded"){a()}else{c.addEventListener("load",a,false)}})(window);