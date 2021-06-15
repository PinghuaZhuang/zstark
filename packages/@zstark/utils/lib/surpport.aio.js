/*!
 * @zstark/utils 0.1.2
 */
/// <reference path="../typings/surpport.d.ts" />

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.nestarkUtils = {})));
}(this, (function (exports) { 'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var surpport_1 = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, '__esModule', {
	    value: true
	  });
	  var inBrowser = typeof window !== 'undefined';

	  var supportsPushState = inBrowser && function () {
	    var ua = window.navigator.userAgent;

	    if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
	      return false;
	    }

	    return window.history && typeof window.history.pushState === 'function';
	  }();

	  var surpport = {
	    inBrowser: inBrowser,
	    pushState: supportsPushState
	  };

	  if (inBrowser) {
	    var _navigator = navigator,
	        userAgent = _navigator.userAgent;
	    surpport.browser = {
	      version: {
	        trident: userAgent.indexOf('Trident') > -1,
	        presto: userAgent.indexOf('Presto') > -1,
	        webKit: userAgent.indexOf('AppleWebKit') > -1,
	        gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') == -1,
	        mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/),
	        ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
	        android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1,
	        iPhone: userAgent.indexOf('iPhone') > -1,
	        iPad: userAgent.indexOf('iPad') > -1,
	        safari: userAgent.indexOf('Safari') == -1
	      },
	      language: (navigator.browserLanguage || navigator.language).toLowerCase()
	    };
	  }

	  exports.inBrowser = inBrowser;
	  exports.supportsPushState = supportsPushState;
	  exports.surpport = surpport;
	});
	var surpport = unwrapExports(surpport_1);
	var surpport_2 = surpport_1.inBrowser;
	var surpport_3 = surpport_1.supportsPushState;
	var surpport_4 = surpport_1.surpport;

	exports.default = surpport;
	exports.inBrowser = surpport_2;
	exports.supportsPushState = surpport_3;
	exports.surpport = surpport_4;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
