/*!
 * @zstark/utils 0.1.2
 */
/// <reference path="../typings/bom.d.ts" />

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.zstarkUtils = {})));
}(this, (function (exports) { 'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var bom = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, '__esModule', {
	    value: true
	  });
	  /**
	   * 全屏( 绑定了 F11 键 )
	   * @example 整个页面: requestFullScreen( document.documentElement );
	   * @example 某个元素: requestFullScreen( document.querySelect( '' ) )
	   * @param { Dom } element 需要全屏的对象
	   */

	  function requestFullScreen(element) {
	    element = element || document.documentElement;
	    var requestMethod = // @ts-ignore
	    element.requestFullScreen || // @ts-ignore
	    element.webkitRequestFullScreen || // @ts-ignore
	    element.mozRequestFullScreen || // @ts-ignore
	    element.msRequestFullScreen;

	    if (requestMethod) {
	      requestMethod.call(element); // @ts-ignore
	    } else if (typeof window.ActiveXObject !== 'undefined') {
	      // @ts-ignore
	      var wscript = new ActiveXObject('WScript.Shell');

	      if (wscript !== null) {
	        wscript.SendKeys('{F11}');
	      }
	    }
	  }
	  /**
	   * 退出全屏( 绑定了 F11 键 )
	   */


	  function exitFullScreen() {
	    // 判断各种浏览器，找到正确的方法
	    var exitMethod = document.exitFullscreen || // W3C
	    // @ts-ignore
	    document.mozCancelFullScreen || // Chrome等
	    // @ts-ignore
	    document.webkitExitFullscreen || // FireFox
	    // @ts-ignore
	    document.webkitExitFullscreen; // IE11

	    if (exitMethod) {
	      exitMethod.call(document); // @ts-ignore
	    } else if (typeof window.ActiveXObject !== 'undefined') {
	      // @ts-ignore
	      var wscript = new ActiveXObject('WScript.Shell');

	      if (wscript !== null) {
	        wscript.SendKeys('{F11}');
	      }
	    }
	  }

	  exports.requestFullScreen = requestFullScreen;
	  exports.exitFullScreen = exitFullScreen;
	});
	var bom$1 = unwrapExports(bom);
	var bom_1 = bom.requestFullScreen;
	var bom_2 = bom.exitFullScreen;

	exports.default = bom$1;
	exports.requestFullScreen = bom_1;
	exports.exitFullScreen = bom_2;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
