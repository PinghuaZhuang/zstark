/*!
 * @zstark/eslint-plugin-zstark 0.0.0
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.zstarkCustomEvent = {})));
}(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var lib = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });

    var EventAbs = /*#__PURE__*/function () {
      function EventAbs(data) {
        _classCallCheck(this, EventAbs);

        this.data = Object.assign({}, data);
      }

      _createClass(EventAbs, [{
        key: "type",
        get: function get() {
          return this.constructor.type;
        }
      }]);

      return EventAbs;
    }();
    /**
     * 事件类型
     */


    EventAbs.type = 'custom-event';

    var SensorAbs = /*#__PURE__*/function () {
      function SensorAbs(containers) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
          bubbles: true,
          cancelable: true,
          useCapture: false
        };

        _classCallCheck(this, SensorAbs);

        this.options = Object.assign({}, options);

        if (!Array.isArray(containers)) {
          this.containers = [containers];
        } else {
          this.containers = _toConsumableArray(containers);
        }
      }

      _createClass(SensorAbs, [{
        key: "type",
        get: function get() {
          return this.constructor.type;
        }
      }, {
        key: "attach",
        value: function attach() {
          console.error("<<< Please implement the attach function.", this.type);
        }
      }, {
        key: "detach",
        value: function detach() {
          console.error("<<< Please implement the detach function.", this.type);
        }
      }, {
        key: "on",
        value: function on(fn) {
          var _this = this;

          this.containers.forEach(function (element) {
            element.addEventListener(_this.type, fn, _this.options.useCapture === true);
          });
          return this;
        }
      }, {
        key: "off",
        value: function off(fn) {
          var _this2 = this;

          this.containers.forEach(function (element) {
            element.removeEventListener(_this2.type, fn, _this2.options.useCapture === true);
          });
          return this;
        }
      }, {
        key: "trigger",
        value: function trigger(element, sensorEvent) {
          if (element == null || !element.dispatchEvent) {
            console.error(">>> trigger function parameter error.", element, sensorEvent);
            return;
          }

          var event = new CustomEvent(sensorEvent.type, {
            detail: Object.assign({}, sensorEvent.data),
            bubbles: this.options.bubbles === true,
            cancelable: !(this.options.cancelable === false)
          });
          element.dispatchEvent(event);
          return this;
        }
      }]);

      return SensorAbs;
    }();

    SensorAbs.type = 'sensor';
    exports.EventAbs = EventAbs;
    exports.SensorAbs = SensorAbs;
  });
  var index = unwrapExports(lib);
  var lib_1 = lib.EventAbs;
  var lib_2 = lib.SensorAbs;

  exports.default = index;
  exports.EventAbs = lib_1;
  exports.SensorAbs = lib_2;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
