/*!
 * @nestark/utils 0.1.1
 */
/// <reference path="../typings/dom.d.ts" />

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

	var dom = createCommonjsModule(function (module, exports) {

	  Object.defineProperty(exports, '__esModule', {
	    value: true
	  });
	  /**
	   * 滚动到目标DOM位置上
	   * @param { HTMLElement } container 滚动的容器
	   * @param { HTMLElement } selected 滚动到的目标DOM
	   */

	  var scrollIntoView = function scrollIntoView(container, selected) {
	    // if ( Vue.prototype.$isServer ) return;
	    if (!selected) {
	      container.scrollTop = 0;
	      return;
	    }

	    var offsetParents = [];
	    var pointer = selected.offsetParent;

	    while (pointer && container !== pointer && container.contains(pointer)) {
	      offsetParents.push(pointer);
	      pointer = pointer.offsetParent;
	    }

	    var top = selected.offsetTop + offsetParents.reduce(function (prev, curr) {
	      return prev + curr.offsetTop;
	    }, 0);
	    var bottom = top + selected.offsetHeight;
	    var viewRectTop = container.scrollTop;
	    var viewRectBottom = viewRectTop + container.clientHeight;

	    if (top < viewRectTop) {
	      container.scrollTop = top;
	    } else if (bottom > viewRectBottom) {
	      container.scrollTop = bottom - container.clientHeight;
	    }
	  };
	  /**
	   * 拷贝文本到剪切板
	   * @param { String } text 要拷贝的文本
	   */


	  function copyToClipboard(text) {
	    if (text == null || text === '') return;
	    var textArea = document.createElement('textarea');
	    textArea.value = text;
	    textArea.focus();
	    Object.assign(textArea.style, {
	      position: 'fixed',
	      top: '-10000px',
	      left: '-10000px',
	      'z-index': -1,
	      width: '100px'
	    });
	    document.body.append(textArea);

	    try {
	      textArea.select();
	      var ret = document.execCommand('copy');
	      document.body.removeChild(textArea);

	      if (!ret) {
	        console.log(">>> \u62F7\u8D1D\u6587\u672C\u672A\u9009\u4E2D\u6587\u672C.");
	      }
	    } catch (error) {
	      console.error('<<< 改浏览器不支持 execCommand(\'copy\') 方法.');
	    }
	  }
	  /**
	   * A标签下载下载
	   * @description 跨域后重命名无效
	   * @param { String } href 下载路径
	   * @param { String } name 下载后重命名
	   */


	  function download(href) {
	    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "download.xlsx";
	    var eleLink = document.createElement('a');
	    eleLink.download = name;
	    eleLink.href = href;
	    eleLink.click();
	    return eleLink;
	  }

	  exports.scrollIntoView = scrollIntoView;
	  exports.copyToClipboard = copyToClipboard;
	  exports.download = download;
	});
	var dom$1 = unwrapExports(dom);
	var dom_1 = dom.scrollIntoView;
	var dom_2 = dom.copyToClipboard;
	var dom_3 = dom.download;

	exports.default = dom$1;
	exports.scrollIntoView = dom_1;
	exports.copyToClipboard = dom_2;
	exports.download = dom_3;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
