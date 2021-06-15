/*!
 * @zstark/utils 0.1.2
 */
/// <reference path="../typings/index.d.ts" />

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.zstarkUtils = {})));
}(this, (function (exports) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var js_cookie = createCommonjsModule(function (module, exports) {

    (function (factory) {
      var registeredInModuleLoader;

      if (typeof undefined === 'function' && undefined.amd) {
        undefined(factory);
        registeredInModuleLoader = true;
      }

      {
        module.exports = factory();
        registeredInModuleLoader = true;
      }

      if (!registeredInModuleLoader) {
        var OldCookies = window.Cookies;
        var api = window.Cookies = factory();

        api.noConflict = function () {
          window.Cookies = OldCookies;
          return api;
        };
      }
    })(function () {
      function extend() {
        var i = 0;
        var result = {};

        for (; i < arguments.length; i++) {
          var attributes = arguments[i];

          for (var key in attributes) {
            result[key] = attributes[key];
          }
        }

        return result;
      }

      function decode(s) {
        return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
      }

      function init(converter) {
        function api() {}

        function set(key, value, attributes) {
          if (typeof document === 'undefined') {
            return;
          }

          attributes = extend({
            path: '/'
          }, api.defaults, attributes);

          if (typeof attributes.expires === 'number') {
            attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
          } // We're using "expires" because "max-age" is not supported by IE


          attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

          try {
            var result = JSON.stringify(value);

            if (/^[\{\[]/.test(result)) {
              value = result;
            }
          } catch (e) {}

          value = converter.write ? converter.write(value, key) : encodeURIComponent(String(value)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
          key = encodeURIComponent(String(key)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
          var stringifiedAttributes = '';

          for (var attributeName in attributes) {
            if (!attributes[attributeName]) {
              continue;
            }

            stringifiedAttributes += '; ' + attributeName;

            if (attributes[attributeName] === true) {
              continue;
            } // Considers RFC 6265 section 5.2:
            // ...
            // 3.  If the remaining unparsed-attributes contains a %x3B (";")
            //     character:
            // Consume the characters of the unparsed-attributes up to,
            // not including, the first %x3B (";") character.
            // ...


            stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
          }

          return document.cookie = key + '=' + value + stringifiedAttributes;
        }

        function get(key, json) {
          if (typeof document === 'undefined') {
            return;
          }

          var jar = {}; // To prevent the for loop in the first place assign an empty array
          // in case there are no cookies at all.

          var cookies = document.cookie ? document.cookie.split('; ') : [];
          var i = 0;

          for (; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var cookie = parts.slice(1).join('=');

            if (!json && cookie.charAt(0) === '"') {
              cookie = cookie.slice(1, -1);
            }

            try {
              var name = decode(parts[0]);
              cookie = (converter.read || converter)(cookie, name) || decode(cookie);

              if (json) {
                try {
                  cookie = JSON.parse(cookie);
                } catch (e) {}
              }

              jar[name] = cookie;

              if (key === name) {
                break;
              }
            } catch (e) {}
          }

          return key ? jar[key] : jar;
        }

        api.set = set;

        api.get = function (key) {
          return get(key, false
          /* read as raw */
          );
        };

        api.getJSON = function (key) {
          return get(key, true
          /* read as json */
          );
        };

        api.remove = function (key, attributes) {
          set(key, '', extend(attributes, {
            expires: -1
          }));
        };

        api.defaults = {};
        api.withConverter = init;
        return api;
      }

      return init(function () {});
    });
  });

  var lib = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });

    function _interopDefault(ex) {
      return ex && _typeof(ex) === 'object' && 'default' in ex ? ex['default'] : ex;
    }

    var Cookies = _interopDefault(js_cookie);

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
          gecko: userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('KHTML') === -1,
          mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/),
          ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
          android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1,
          iPhone: userAgent.indexOf('iPhone') > -1,
          iPad: userAgent.indexOf('iPad') > -1,
          safari: userAgent.indexOf('Safari') === -1
        },
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
      };
    }

    var NAUTH_TOKEN = "nauth-token";
    /**
     * 获取url的query参数
     */

    function param2Obj(url) {
      var search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');

      if (!search) {
        return {};
      }

      var obj = {};
      var searchArr = search.split('&');
      searchArr.forEach(function (v) {
        var index = v.indexOf('=');

        if (index !== -1) {
          var name = v.substring(0, index);
          var val = v.substring(index + 1, v.length);
          obj[name] = decodeURIComponent(val);
        }
      });
      return obj;
    }
    /**
     * 获取环境变量
     */


    function getEnv() {
      return /^(127.0.0.1)|(192.168)|(localhost)|(localdev)/.test(window.location.hostname) ? 'localdev' : 'production';
    } // 目前环境只有 localdev 和 production
    // @nestark/auth 没有引用这里. 实现是一样的.


    function getKeyWithEnv(key) {
      var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getEnv();
      var template = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '{k}-{env}';
      // 只有localdev有后缀
      return env !== 'production' && env.length ? template.replace(/{k}/g, key).replace(/{env}/g, env) : key;
    }
    /**
     * 获取token
     */


    function getToken(env) {
      return Cookies.get(getKeyWithEnv(NAUTH_TOKEN, env || getEnv()));
    }
    /**
     * 创建缓存对象
     * @param { Number } length 缓存长度
     */


    function createCache(length) {
      var keys = [];
      var cacheLength = length || 50;

      function cache(key, value) {
        if (typeof key === 'function') {
          var cb = key; // @ts-ignore

          return keys.map(function (k) {
            return cb(k.replace(/\s$/, ''), cache[k + ' ']);
          });
        }

        if (keys.push(key + ' ') > cacheLength) {
          delete cache[keys.shift()];
        }

        return value == null ? cache[key + ' '] : cache[key + ' '] = value;
      }

      return cache;
    }
    /**
     * 获取 UUID
     */


    function getUUID() {
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : r & 0x3 | 0x8).toString(16);
      });
      return uuid;
    }
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

    exports.surpport = surpport;
    exports.param2Obj = param2Obj;
    exports.getEnv = getEnv;
    exports.getKeyWithEnv = getKeyWithEnv;
    exports.getToken = getToken;
    exports.createCache = createCache;
    exports.getUUID = getUUID;
    exports.requestFullScreen = requestFullScreen;
    exports.exitFullScreen = exitFullScreen;
    exports.scrollIntoView = scrollIntoView;
    exports.copyToClipboard = copyToClipboard;
    exports.download = download;
    exports.byteLengthEn = byteLengthEn;
  });
  var index = unwrapExports(lib);
  var lib_1 = lib.surpport;
  var lib_2 = lib.param2Obj;
  var lib_3 = lib.getEnv;
  var lib_4 = lib.getKeyWithEnv;
  var lib_5 = lib.getToken;
  var lib_6 = lib.createCache;
  var lib_7 = lib.getUUID;
  var lib_8 = lib.requestFullScreen;
  var lib_9 = lib.exitFullScreen;
  var lib_10 = lib.scrollIntoView;
  var lib_11 = lib.copyToClipboard;
  var lib_12 = lib.download;
  var lib_13 = lib.byteLengthEn;

  exports.default = index;
  exports.surpport = lib_1;
  exports.param2Obj = lib_2;
  exports.getEnv = lib_3;
  exports.getKeyWithEnv = lib_4;
  exports.getToken = lib_5;
  exports.createCache = lib_6;
  exports.getUUID = lib_7;
  exports.requestFullScreen = lib_8;
  exports.exitFullScreen = lib_9;
  exports.scrollIntoView = lib_10;
  exports.copyToClipboard = lib_11;
  exports.download = lib_12;
  exports.byteLengthEn = lib_13;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
