define("chat",["react","react-dom","lodash"],function(e,t,n){return function(e){function t(t){for(var n,r,a=t[0],i=t[1],c=0,l=[];c<a.length;c++)r=a[c],o[r]&&l.push(o[r][0]),o[r]=0;for(n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n]);for(u&&u(t);l.length;)l.shift()()}var n={},o={0:0};function r(t){if(n[t])return n[t].exports;var o=n[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.e=function(e){var t=[],n=o[e];if(0!==n)if(n)t.push(n[2]);else{var a=new Promise(function(t,r){n=o[e]=[t,r]});t.push(n[2]=a);var i,c=document.getElementsByTagName("head")[0],u=document.createElement("script");u.charset="utf-8",u.timeout=120,r.nc&&u.setAttribute("nonce",r.nc),u.src=function(e){return r.p+""+({2:"chat-app",3:"vendors~chat-app"}[e]||e)+".chunk.js"}(e),i=function(t){u.onerror=u.onload=null,clearTimeout(l);var n=o[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src,i=new Error("Loading chunk "+e+" failed.\n("+r+": "+a+")");i.type=r,i.request=a,n[1](i)}o[e]=void 0}};var l=setTimeout(function(){i({type:"timeout",target:u})},12e4);u.onerror=u.onload=i,c.appendChild(u)}return Promise.all(t)},r.m=e,r.c=n,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r.oe=function(e){throw console.error(e),e};var a=window.webpackJsonpchat=window.webpackJsonpchat||[],i=a.push.bind(a);a.push=t,a=a.slice();for(var c=0;c<a.length;c++)t(a[c]);var u=i;return r(r.s=376)}({0:function(t,n){t.exports=e},2:function(e,n){e.exports=t},205:function(e,t,n){var o,r;void 0===(r="function"==typeof(o=function(e){"use strict";function t(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,o)}return n}function n(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(c){if("object"!==o(c))throw new Error("single-spa-react requires a configuration object");var u=function(e){for(var o=1;o<arguments.length;o++){var r=null!=arguments[o]?arguments[o]:{};o%2?t(r,!0).forEach(function(t){n(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):t(r).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}({},a,{},c);if(!u.React)throw new Error("single-spa-react must be passed opts.React");if(!u.ReactDOM)throw new Error("single-spa-react must be passed opts.ReactDOM");if(!u.rootComponent&&!u.loadRootComponent)throw new Error("single-spa-react must be passed opts.rootComponent or opts.loadRootComponent");!r&&u.React.createContext&&(e.SingleSpaContext=r=u.React.createContext());var l={bootstrap:function(e,t){return e.rootComponent?Promise.resolve():e.loadRootComponent(t).then(function(t){e.rootComponent=t})}.bind(null,u),mount:function(e,t){return new Promise(function(n,o){!e.suppressComponentDidCatchWarning&&function(e){if(!(e&&"string"==typeof e.version&&e.version.indexOf(".")>=0))return!1;var t=e.version.slice(0,e.version.indexOf("."));try{return Number(t)>=16}catch(e){return!1}}(e.React)&&(e.rootComponent.prototype?e.rootComponent.prototype.componentDidCatch||console.warn("single-spa-react: ".concat(t.name||t.appName||t.childAppName,"'s rootComponent should implement componentDidCatch to avoid accidentally unmounting the entire single-spa application.")):console.warn("single-spa-react: ".concat(t.name||t.appName||t.childAppName,"'s rootComponent does not have a prototype.  If using a functional component, wrap it in an error boundary or other class that implements componentDidCatch to avoid accidentally unmounting the entire single-spa application")));var a=function(e,t){return(t=t&&t.customProps?t.customProps:t).domElement?function(){return t.domElement}:t.domElementGetter?t.domElementGetter:e.domElementGetter?e.domElementGetter:function(e){var t=e.appName||e.name;if(!t)throw Error("single-spa-react was not given an application name as a prop, so it can't make a unique dom element container for the react application");var n="single-spa-application:".concat(t);return function(){var e=document.getElementById(n);return e||((e=document.createElement("div")).id=n,document.body.appendChild(e)),e}}(t)}(e,t);if("function"!=typeof a)throw new Error("single-spa-react: the domElementGetter for react application '".concat(t.appName||t.name,"' is not a function"));var c=e.React.createElement(e.rootComponent,t),u=r?e.React.createElement(r.Provider,{value:t},c):c,l=function(e,t){var n=a();if(!n)throw new Error("single-spa-react: domElementGetter function for application '".concat(t.appName||t.name,"' did not return a valid dom element. Please pass a valid domElement or domElementGetter via opts or props"));return n}(0,t);i({elementToRender:u,domElement:l,whenFinished:function(){n(this)},opts:e}),e.domElements[t.name]=l})}.bind(null,u),unmount:function(e,t){return Promise.resolve().then(function(){e.ReactDOM.unmountComponentAtNode(e.domElements[t.name]),delete e.domElements[t.name]})}.bind(null,u)};return u.parcelCanUpdate&&(l.update=function(e,t){return new Promise(function(n,o){var a=e.React.createElement(e.rootComponent,t);i({elementToRender:r?e.React.createElement(r.Provider,{value:t},a):a,domElement:e.domElements[t.name],whenFinished:function(){n(this)},opts:e})})}.bind(null,u)),l},e.SingleSpaContext=void 0;var r=null;e.SingleSpaContext=r;var a={React:null,ReactDOM:null,rootComponent:null,loadRootComponent:null,suppressComponentDidCatchWarning:!1,domElements:{},domElementGetter:null,parcelCanUpdate:!0};function i(e){var t=e.opts,n=e.elementToRender,o=e.domElement,r=e.whenFinished;return"createRoot"===t.renderType?t.ReactDOM.createRoot(o).render(n,r):"createBlockingRoot"===t.renderType?t.ReactDOM.createBlockingRoot(o).render(n,r):"hydrate"===t.renderType?t.ReactDOM.hydrate(n,o,r):t.ReactDOM.render(n,o,r)}})?o.apply(t,[t]):o)||(e.exports=r)},206:function(e,t){e.exports=n},376:function(e,t,n){"use strict";n.r(t);var o=n(0),r=n.n(o),a=n(2),i=n.n(a),c=n(205),u=n.n(c),l=n(206);function p(){return Promise.all([window.System.resolve("@portal/exception_403")]).then(function(e){var t=function(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e)){var n=[],o=!0,r=!1,a=void 0;try{for(var i,c=e[Symbol.iterator]();!(o=(i=c.next()).done)&&(n.push(i.value),!t||n.length!==t);o=!0);}catch(e){r=!0,a=e}finally{try{o||null==c.return||c.return()}finally{if(r)throw a}}return n}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}(e,1)[0],o=t.slice(0,t.lastIndexOf("/")+1);return n.p=o,!0})}n.d(t,"bootstrap",function(){return m}),n.d(t,"mount",function(){return d}),n.d(t,"unmount",function(){return f}),n.d(t,"unload",function(){return y});var s=u()({React:r.a,ReactDOM:i.a,loadRootComponent:function(){return Promise.all([n.e(3),n.e(2)]).then(n.bind(null,374)).then(Object(l.property)("default"))},domElementGetter:function(){var e=document.getElementById("chat");return e||((e=document.createElement("div")).id="chat",document.body.appendChild(e)),e}}),m=[function(){return p()},s.bootstrap],d=[s.mount],f=[s.unmount],y=[s.unload]}})});