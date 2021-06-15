/*!
 * @zstark/utils 0.1.2
 */
/// <reference path="../typings/string.d.ts" />

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

	var string = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, '__esModule', {
	    value: true
	  });
	  /**
	   * 获取字符字节长度
	   * @param { String } str 目标字符串
	   */

	  function byteLengthEn(str) {
	    if (typeof str !== 'string') return 0;
	    var b = 0;

	    for (var i = str.length - 1; i >= 0; i--) {
	      if (str.charCodeAt(i) > 255) {
	        b += 2;
	      } else {
	        b++;
	      }
	    }

	    return b;
	  }

	  exports.byteLengthEn = byteLengthEn;
	});
	var string$1 = unwrapExports(string);
	var string_1 = string.byteLengthEn;

	exports.default = string$1;
	exports.byteLengthEn = string_1;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
