!function(e,o){if("object"==typeof exports&&"object"==typeof module)module.exports=o();else if("function"==typeof define&&define.amd)define([],o);else{var n=o();for(var t in n)("object"==typeof exports?exports:e)[t]=n[t]}}(this,function(){return function(e){function o(t){if(n[t])return n[t].exports;var r=n[t]={exports:{},id:t,loaded:!1};return e[t].call(r.exports,r,r.exports,o),r.loaded=!0,r.exports}var n={};return o.m=e,o.c=n,o.p="",o(0)}([function(e,o){"use strict";function n(e){function o(){x=!0}function n(t){if(!x){b||(b=t,d(o));var r=(t-b)/e,i=m(r);c(i,r,o),r<1?requestAnimationFrame(n):v()}}var f=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=f.onStart,d=void 0===a?u:a,s=f.onFrame,c=void 0===s?u:s,p=f.onEnd,v=void 0===p?u:p,l=f.easing,m=void 0===l?i:l;if("number"!=typeof e)throw new TypeError(t);if(e<=0)throw new RangeError(r);var x=!1,b=void 0;return function(){return requestAnimationFrame(n),o}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=n;var t="duration must be a positive non-zero number",r=t,i=function(e){return e},u=function(){}}])});