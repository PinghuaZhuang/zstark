/*!
 * @zstark/auth 1.3.4
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.nestarkAuth = {})));
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

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var domain; // This constructor is used to store event handlers. Instantiating this is
  // faster than explicitly calling `Object.create(null)` to get a "clean" empty
  // object (tested with v8 v4.9).

  function EventHandlers() {}

  EventHandlers.prototype = Object.create(null);

  function EventEmitter() {
    EventEmitter.init.call(this);
  }
  // require('events') === require('events').EventEmitter

  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.usingDomains = false;
  EventEmitter.prototype.domain = undefined;
  EventEmitter.prototype._events = undefined;
  EventEmitter.prototype._maxListeners = undefined; // By default EventEmitters will print a warning if more than 10 listeners are
  // added to it. This is a useful default which helps finding memory leaks.

  EventEmitter.defaultMaxListeners = 10;

  EventEmitter.init = function () {
    this.domain = null;

    if (EventEmitter.usingDomains) {
      // if there is an active domain, then attach to it.
      if (domain.active && !(this instanceof domain.Domain)) {
        this.domain = domain.active;
      }
    }

    if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
      this._events = new EventHandlers();
      this._eventsCount = 0;
    }

    this._maxListeners = this._maxListeners || undefined;
  }; // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.


  EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    if (typeof n !== 'number' || n < 0 || isNaN(n)) throw new TypeError('"n" argument must be a positive number');
    this._maxListeners = n;
    return this;
  };

  function $getMaxListeners(that) {
    if (that._maxListeners === undefined) return EventEmitter.defaultMaxListeners;
    return that._maxListeners;
  }

  EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    return $getMaxListeners(this);
  }; // These standalone emit* functions are used to optimize calling of event
  // handlers for fast cases because emit() itself often has a variable number of
  // arguments and can be deoptimized because of that. These functions always have
  // the same number of arguments and thus do not get deoptimized, so the code
  // inside them can execute faster.


  function emitNone(handler, isFn, self) {
    if (isFn) handler.call(self);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self);
      }
    }
  }

  function emitOne(handler, isFn, self, arg1) {
    if (isFn) handler.call(self, arg1);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1);
      }
    }
  }

  function emitTwo(handler, isFn, self, arg1, arg2) {
    if (isFn) handler.call(self, arg1, arg2);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1, arg2);
      }
    }
  }

  function emitThree(handler, isFn, self, arg1, arg2, arg3) {
    if (isFn) handler.call(self, arg1, arg2, arg3);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].call(self, arg1, arg2, arg3);
      }
    }
  }

  function emitMany(handler, isFn, self, args) {
    if (isFn) handler.apply(self, args);else {
      var len = handler.length;
      var listeners = arrayClone(handler, len);

      for (var i = 0; i < len; ++i) {
        listeners[i].apply(self, args);
      }
    }
  }

  EventEmitter.prototype.emit = function emit(type) {
    var er, handler, len, args, i, events, domain;
    var needDomainExit = false;
    var doError = type === 'error';
    events = this._events;
    if (events) doError = doError && events.error == null;else if (!doError) return false;
    domain = this.domain; // If there is no 'error' event listener then throw.

    if (doError) {
      er = arguments[1];

      if (domain) {
        if (!er) er = new Error('Uncaught, unspecified "error" event');
        er.domainEmitter = this;
        er.domain = domain;
        er.domainThrown = false;
        domain.emit('error', er);
      } else if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }

      return false;
    }

    handler = events[type];
    if (!handler) return false;
    var isFn = typeof handler === 'function';
    len = arguments.length;

    switch (len) {
      // fast cases
      case 1:
        emitNone(handler, isFn, this);
        break;

      case 2:
        emitOne(handler, isFn, this, arguments[1]);
        break;

      case 3:
        emitTwo(handler, isFn, this, arguments[1], arguments[2]);
        break;

      case 4:
        emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
        break;
      // slower

      default:
        args = new Array(len - 1);

        for (i = 1; i < len; i++) {
          args[i - 1] = arguments[i];
        }

        emitMany(handler, isFn, this, args);
    }

    if (needDomainExit) domain.exit();
    return true;
  };

  function _addListener(target, type, listener, prepend) {
    var m;
    var events;
    var existing;
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    events = target._events;

    if (!events) {
      events = target._events = new EventHandlers();
      target._eventsCount = 0;
    } else {
      // To avoid recursion in the case that type === "newListener"! Before
      // adding it to the listeners, first emit "newListener".
      if (events.newListener) {
        target.emit('newListener', type, listener.listener ? listener.listener : listener); // Re-assign `events` because a newListener handler could have caused the
        // this._events to be assigned to a new object

        events = target._events;
      }

      existing = events[type];
    }

    if (!existing) {
      // Optimize the case of one listener. Don't need the extra array object.
      existing = events[type] = listener;
      ++target._eventsCount;
    } else {
      if (typeof existing === 'function') {
        // Adding the second element, need to change to array.
        existing = events[type] = prepend ? [listener, existing] : [existing, listener];
      } else {
        // If we've already got an array, just append.
        if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
      } // Check for listener leak


      if (!existing.warned) {
        m = $getMaxListeners(target);

        if (m && m > 0 && existing.length > m) {
          existing.warned = true;
          var w = new Error('Possible EventEmitter memory leak detected. ' + existing.length + ' ' + type + ' listeners added. ' + 'Use emitter.setMaxListeners() to increase limit');
          w.name = 'MaxListenersExceededWarning';
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          emitWarning(w);
        }
      }
    }

    return target;
  }

  function emitWarning(e) {
    typeof console.warn === 'function' ? console.warn(e) : console.log(e);
  }

  EventEmitter.prototype.addListener = function addListener(type, listener) {
    return _addListener(this, type, listener, false);
  };

  EventEmitter.prototype.on = EventEmitter.prototype.addListener;

  EventEmitter.prototype.prependListener = function prependListener(type, listener) {
    return _addListener(this, type, listener, true);
  };

  function _onceWrap(target, type, listener) {
    var fired = false;

    function g() {
      target.removeListener(type, g);

      if (!fired) {
        fired = true;
        listener.apply(target, arguments);
      }
    }

    g.listener = listener;
    return g;
  }

  EventEmitter.prototype.once = function once(type, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    this.on(type, _onceWrap(this, type, listener));
    return this;
  };

  EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    this.prependListener(type, _onceWrap(this, type, listener));
    return this;
  }; // emits a 'removeListener' event iff the listener was removed


  EventEmitter.prototype.removeListener = function removeListener(type, listener) {
    var list, events, position, i, originalListener;
    if (typeof listener !== 'function') throw new TypeError('"listener" argument must be a function');
    events = this._events;
    if (!events) return this;
    list = events[type];
    if (!list) return this;

    if (list === listener || list.listener && list.listener === listener) {
      if (--this._eventsCount === 0) this._events = new EventHandlers();else {
        delete events[type];
        if (events.removeListener) this.emit('removeListener', type, list.listener || listener);
      }
    } else if (typeof list !== 'function') {
      position = -1;

      for (i = list.length; i-- > 0;) {
        if (list[i] === listener || list[i].listener && list[i].listener === listener) {
          originalListener = list[i].listener;
          position = i;
          break;
        }
      }

      if (position < 0) return this;

      if (list.length === 1) {
        list[0] = undefined;

        if (--this._eventsCount === 0) {
          this._events = new EventHandlers();
          return this;
        } else {
          delete events[type];
        }
      } else {
        spliceOne(list, position);
      }

      if (events.removeListener) this.emit('removeListener', type, originalListener || listener);
    }

    return this;
  };

  EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
    var listeners, events;
    events = this._events;
    if (!events) return this; // not listening for removeListener, no need to emit

    if (!events.removeListener) {
      if (arguments.length === 0) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      } else if (events[type]) {
        if (--this._eventsCount === 0) this._events = new EventHandlers();else delete events[type];
      }

      return this;
    } // emit removeListener for all listeners on all events


    if (arguments.length === 0) {
      var keys = Object.keys(events);

      for (var i = 0, key; i < keys.length; ++i) {
        key = keys[i];
        if (key === 'removeListener') continue;
        this.removeAllListeners(key);
      }

      this.removeAllListeners('removeListener');
      this._events = new EventHandlers();
      this._eventsCount = 0;
      return this;
    }

    listeners = events[type];

    if (typeof listeners === 'function') {
      this.removeListener(type, listeners);
    } else if (listeners) {
      // LIFO order
      do {
        this.removeListener(type, listeners[listeners.length - 1]);
      } while (listeners[0]);
    }

    return this;
  };

  EventEmitter.prototype.listeners = function listeners(type) {
    var evlistener;
    var ret;
    var events = this._events;
    if (!events) ret = [];else {
      evlistener = events[type];
      if (!evlistener) ret = [];else if (typeof evlistener === 'function') ret = [evlistener.listener || evlistener];else ret = unwrapListeners(evlistener);
    }
    return ret;
  };

  EventEmitter.listenerCount = function (emitter, type) {
    if (typeof emitter.listenerCount === 'function') {
      return emitter.listenerCount(type);
    } else {
      return listenerCount.call(emitter, type);
    }
  };

  EventEmitter.prototype.listenerCount = listenerCount;

  function listenerCount(type) {
    var events = this._events;

    if (events) {
      var evlistener = events[type];

      if (typeof evlistener === 'function') {
        return 1;
      } else if (evlistener) {
        return evlistener.length;
      }
    }

    return 0;
  }

  EventEmitter.prototype.eventNames = function eventNames() {
    return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
  }; // About 1.5x faster than the two-arg version of Array#splice().


  function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
      list[i] = list[k];
    }

    list.pop();
  }

  function arrayClone(arr, i) {
    var copy = new Array(i);

    while (i--) {
      copy[i] = arr[i];
    }

    return copy;
  }

  function unwrapListeners(arr) {
    var ret = new Array(arr.length);

    for (var i = 0; i < ret.length; ++i) {
      ret[i] = arr[i].listener || arr[i];
    }

    return ret;
  }

  var events = /*#__PURE__*/Object.freeze({
    default: EventEmitter,
    EventEmitter: EventEmitter
  });

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

  var has = Object.prototype.hasOwnProperty;

  var hexTable = function () {
    var array = [];

    for (var i = 0; i < 256; ++i) {
      array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
  }();

  var compactQueue = function compactQueue(queue) {
    var obj;

    while (queue.length) {
      var item = queue.pop();
      obj = item.obj[item.prop];

      if (Array.isArray(obj)) {
        var compacted = [];

        for (var j = 0; j < obj.length; ++j) {
          if (typeof obj[j] !== 'undefined') {
            compacted.push(obj[j]);
          }
        }

        item.obj[item.prop] = compacted;
      }
    }

    return obj;
  };

  var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};

    for (var i = 0; i < source.length; ++i) {
      if (typeof source[i] !== 'undefined') {
        obj[i] = source[i];
      }
    }

    return obj;
  };

  var merge = function merge(target, source, options) {
    if (!source) {
      return target;
    }

    if (_typeof(source) !== 'object') {
      if (Array.isArray(target)) {
        target.push(source);
      } else if (_typeof(target) === 'object') {
        if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
          target[source] = true;
        }
      } else {
        return [target, source];
      }

      return target;
    }

    if (_typeof(target) !== 'object') {
      return [target].concat(source);
    }

    var mergeTarget = target;

    if (Array.isArray(target) && !Array.isArray(source)) {
      mergeTarget = arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
      source.forEach(function (item, i) {
        if (has.call(target, i)) {
          if (target[i] && _typeof(target[i]) === 'object') {
            target[i] = merge(target[i], item, options);
          } else {
            target.push(item);
          }
        } else {
          target[i] = item;
        }
      });
      return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
      var value = source[key];

      if (has.call(acc, key)) {
        acc[key] = merge(acc[key], value, options);
      } else {
        acc[key] = value;
      }

      return acc;
    }, mergeTarget);
  };

  var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
      acc[key] = source[key];
      return acc;
    }, target);
  };

  var decode = function decode(str) {
    try {
      return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
      return str;
    }
  };

  var encode = function encode(str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
      return str;
    }

    var string = typeof str === 'string' ? str : String(str);
    var out = '';

    for (var i = 0; i < string.length; ++i) {
      var c = string.charCodeAt(i);

      if (c === 0x2D // -
      || c === 0x2E // .
      || c === 0x5F // _
      || c === 0x7E // ~
      || c >= 0x30 && c <= 0x39 // 0-9
      || c >= 0x41 && c <= 0x5A // a-z
      || c >= 0x61 && c <= 0x7A // A-Z
      ) {
          out += string.charAt(i);
          continue;
        }

      if (c < 0x80) {
        out = out + hexTable[c];
        continue;
      }

      if (c < 0x800) {
        out = out + (hexTable[0xC0 | c >> 6] + hexTable[0x80 | c & 0x3F]);
        continue;
      }

      if (c < 0xD800 || c >= 0xE000) {
        out = out + (hexTable[0xE0 | c >> 12] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F]);
        continue;
      }

      i += 1;
      c = 0x10000 + ((c & 0x3FF) << 10 | string.charCodeAt(i) & 0x3FF);
      out += hexTable[0xF0 | c >> 18] + hexTable[0x80 | c >> 12 & 0x3F] + hexTable[0x80 | c >> 6 & 0x3F] + hexTable[0x80 | c & 0x3F];
    }

    return out;
  };

  var compact = function compact(value) {
    var queue = [{
      obj: {
        o: value
      },
      prop: 'o'
    }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
      var item = queue[i];
      var obj = item.obj[item.prop];
      var keys = Object.keys(obj);

      for (var j = 0; j < keys.length; ++j) {
        var key = keys[j];
        var val = obj[key];

        if (_typeof(val) === 'object' && val !== null && refs.indexOf(val) === -1) {
          queue.push({
            obj: obj,
            prop: key
          });
          refs.push(val);
        }
      }
    }

    return compactQueue(queue);
  };

  var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
  };

  var isBuffer = function isBuffer(obj) {
    if (obj === null || typeof obj === 'undefined') {
      return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
  };

  var utils = {
    arrayToObject: arrayToObject,
    assign: assign,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    merge: merge
  };

  var replace = String.prototype.replace;
  var percentTwenties = /%20/g;
  var formats = {
    'default': 'RFC3986',
    formatters: {
      RFC1738: function RFC1738(value) {
        return replace.call(value, percentTwenties, '+');
      },
      RFC3986: function RFC3986(value) {
        return value;
      }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
  };

  var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
      // eslint-disable-line func-name-matching
      return prefix + '[]';
    },
    indices: function indices(prefix, key) {
      // eslint-disable-line func-name-matching
      return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
      // eslint-disable-line func-name-matching
      return prefix;
    }
  };
  var toISO = Date.prototype.toISOString;
  var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) {
      // eslint-disable-line func-name-matching
      return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
  };

  var stringify = function stringify( // eslint-disable-line func-name-matching
  object, prefix, generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly) {
    var obj = object;

    if (typeof filter === 'function') {
      obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
      obj = serializeDate(obj);
    } else if (obj === null) {
      if (strictNullHandling) {
        return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
      }

      obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
      if (encoder) {
        var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
        return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
      }

      return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
      return values;
    }

    var objKeys;

    if (Array.isArray(filter)) {
      objKeys = filter;
    } else {
      var keys = Object.keys(obj);
      objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
      var key = objKeys[i];

      if (skipNulls && obj[key] === null) {
        continue;
      }

      if (Array.isArray(obj)) {
        values = values.concat(stringify(obj[key], generateArrayPrefix(prefix, key), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly));
      } else {
        values = values.concat(stringify(obj[key], prefix + (allowDots ? '.' + key : '[' + key + ']'), generateArrayPrefix, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly));
      }
    }

    return values;
  };

  var stringify_1 = function stringify_1(object, opts) {
    var obj = object;
    var options = opts ? utils.assign({}, opts) : {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
      throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;

    if (typeof options.format === 'undefined') {
      options.format = formats['default'];
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
      throw new TypeError('Unknown format option provided.');
    }

    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
      filter = options.filter;
      obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
      filter = options.filter;
      objKeys = filter;
    }

    var keys = [];

    if (_typeof(obj) !== 'object' || obj === null) {
      return '';
    }

    var arrayFormat;

    if (options.arrayFormat in arrayPrefixGenerators) {
      arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
      arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
      arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
      objKeys = Object.keys(obj);
    }

    if (sort) {
      objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
      var key = objKeys[i];

      if (skipNulls && obj[key] === null) {
        continue;
      }

      keys = keys.concat(stringify(obj[key], key, generateArrayPrefix, strictNullHandling, skipNulls, encode ? encoder : null, filter, sort, allowDots, serializeDate, formatter, encodeValuesOnly));
    }

    var joined = keys.join(delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';
    return joined.length > 0 ? prefix + joined : '';
  };

  var has$1 = Object.prototype.hasOwnProperty;
  var defaults$1 = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
  };

  var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);

    for (var i = 0; i < parts.length; ++i) {
      var part = parts[i];
      var bracketEqualsPos = part.indexOf(']=');
      var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;
      var key, val;

      if (pos === -1) {
        key = options.decoder(part, defaults$1.decoder);
        val = options.strictNullHandling ? null : '';
      } else {
        key = options.decoder(part.slice(0, pos), defaults$1.decoder);
        val = options.decoder(part.slice(pos + 1), defaults$1.decoder);
      }

      if (has$1.call(obj, key)) {
        obj[key] = [].concat(obj[key]).concat(val);
      } else {
        obj[key] = val;
      }
    }

    return obj;
  };

  var parseObject = function parseObject(chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
      var obj;
      var root = chain[i];

      if (root === '[]') {
        obj = [];
        obj = obj.concat(leaf);
      } else {
        obj = options.plainObjects ? Object.create(null) : {};
        var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
        var index = parseInt(cleanRoot, 10);

        if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && options.parseArrays && index <= options.arrayLimit) {
          obj = [];
          obj[index] = leaf;
        } else {
          obj[cleanRoot] = leaf;
        }
      }

      leaf = obj;
    }

    return leaf;
  };

  var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
      return;
    } // Transform dot notation to bracket notation


    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey; // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g; // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key; // Stash the parent if it exists

    var keys = [];

    if (parent) {
      // If we aren't using plain objects, optionally prefix keys
      // that would overwrite object prototype properties
      if (!options.plainObjects && has$1.call(Object.prototype, parent)) {
        if (!options.allowPrototypes) {
          return;
        }
      }

      keys.push(parent);
    } // Loop through children appending to the array until we hit depth


    var i = 0;

    while ((segment = child.exec(key)) !== null && i < options.depth) {
      i += 1;

      if (!options.plainObjects && has$1.call(Object.prototype, segment[1].slice(1, -1))) {
        if (!options.allowPrototypes) {
          return;
        }
      }

      keys.push(segment[1]);
    } // If there's a remainder, just add whatever is left


    if (segment) {
      keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
  };

  var parse = function parse(str, opts) {
    var options = opts ? utils.assign({}, opts) : {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
      throw new TypeError('Decoder has to be a function.');
    }

    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults$1.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults$1.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults$1.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults$1.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults$1.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults$1.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults$1.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults$1.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults$1.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
      return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {}; // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];
      var newObj = parseKeys(key, tempObj[key], options);
      obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
  };

  var lib = {
    formats: formats,
    parse: parse,
    stringify: stringify_1
  };

  /**
   * Tokenize input string.
   */
  function lexer(str) {
    var tokens = [];
    var i = 0;

    while (i < str.length) {
      var _char = str[i];

      if (_char === "*" || _char === "+" || _char === "?") {
        tokens.push({
          type: "MODIFIER",
          index: i,
          value: str[i++]
        });
        continue;
      }

      if (_char === "\\") {
        tokens.push({
          type: "ESCAPED_CHAR",
          index: i++,
          value: str[i++]
        });
        continue;
      }

      if (_char === "{") {
        tokens.push({
          type: "OPEN",
          index: i,
          value: str[i++]
        });
        continue;
      }

      if (_char === "}") {
        tokens.push({
          type: "CLOSE",
          index: i,
          value: str[i++]
        });
        continue;
      }

      if (_char === ":") {
        var name = "";
        var j = i + 1;

        while (j < str.length) {
          var code = str.charCodeAt(j);

          if ( // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95) {
            name += str[j++];
            continue;
          }

          break;
        }

        if (!name) throw new TypeError("Missing parameter name at " + i);
        tokens.push({
          type: "NAME",
          index: i,
          value: name
        });
        i = j;
        continue;
      }

      if (_char === "(") {
        var count = 1;
        var pattern = "";
        var j = i + 1;

        if (str[j] === "?") {
          throw new TypeError("Pattern cannot start with \"?\" at " + j);
        }

        while (j < str.length) {
          if (str[j] === "\\") {
            pattern += str[j++] + str[j++];
            continue;
          }

          if (str[j] === ")") {
            count--;

            if (count === 0) {
              j++;
              break;
            }
          } else if (str[j] === "(") {
            count++;

            if (str[j + 1] !== "?") {
              throw new TypeError("Capturing groups are not allowed at " + j);
            }
          }

          pattern += str[j++];
        }

        if (count) throw new TypeError("Unbalanced pattern at " + i);
        if (!pattern) throw new TypeError("Missing pattern at " + i);
        tokens.push({
          type: "PATTERN",
          index: i,
          value: pattern
        });
        i = j;
        continue;
      }

      tokens.push({
        type: "CHAR",
        index: i,
        value: str[i++]
      });
    }

    tokens.push({
      type: "END",
      index: i,
      value: ""
    });
    return tokens;
  }
  /**
   * Parse a string for the raw tokens.
   */


  function parse$1(str, options) {
    if (options === void 0) {
      options = {};
    }

    var tokens = lexer(str);
    var _a = options.prefixes,
        prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^" + escapeString(options.delimiter || "/#?") + "]+?";
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";

    var tryConsume = function tryConsume(type) {
      if (i < tokens.length && tokens[i].type === type) return tokens[i++].value;
    };

    var mustConsume = function mustConsume(type) {
      var value = tryConsume(type);
      if (value !== undefined) return value;
      var _a = tokens[i],
          nextType = _a.type,
          index = _a.index;
      throw new TypeError("Unexpected " + nextType + " at " + index + ", expected " + type);
    };

    var consumeText = function consumeText() {
      var result = "";
      var value; // tslint:disable-next-line

      while (value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
        result += value;
      }

      return result;
    };

    while (i < tokens.length) {
      var _char2 = tryConsume("CHAR");

      var name = tryConsume("NAME");
      var pattern = tryConsume("PATTERN");

      if (name || pattern) {
        var prefix = _char2 || "";

        if (prefixes.indexOf(prefix) === -1) {
          path += prefix;
          prefix = "";
        }

        if (path) {
          result.push(path);
          path = "";
        }

        result.push({
          name: name || key++,
          prefix: prefix,
          suffix: "",
          pattern: pattern || defaultPattern,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }

      var value = _char2 || tryConsume("ESCAPED_CHAR");

      if (value) {
        path += value;
        continue;
      }

      if (path) {
        result.push(path);
        path = "";
      }

      var open = tryConsume("OPEN");

      if (open) {
        var prefix = consumeText();
        var name_1 = tryConsume("NAME") || "";
        var pattern_1 = tryConsume("PATTERN") || "";
        var suffix = consumeText();
        mustConsume("CLOSE");
        result.push({
          name: name_1 || (pattern_1 ? key++ : ""),
          pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
          prefix: prefix,
          suffix: suffix,
          modifier: tryConsume("MODIFIER") || ""
        });
        continue;
      }

      mustConsume("END");
    }

    return result;
  }
  /**
   * Compile a string to a template function for the path.
   */

  function compile(str, options) {
    return tokensToFunction(parse$1(str, options), options);
  }
  /**
   * Expose a method for transforming tokens into the path function.
   */

  function tokensToFunction(tokens, options) {
    if (options === void 0) {
      options = {};
    }

    var reFlags = flags(options);
    var _a = options.encode,
        encode = _a === void 0 ? function (x) {
      return x;
    } : _a,
        _b = options.validate,
        validate = _b === void 0 ? true : _b; // Compile all the tokens into regexps.

    var matches = tokens.map(function (token) {
      if (_typeof(token) === "object") {
        return new RegExp("^(?:" + token.pattern + ")$", reFlags);
      }
    });
    return function (data) {
      var path = "";

      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === "string") {
          path += token;
          continue;
        }

        var value = data ? data[token.name] : undefined;
        var optional = token.modifier === "?" || token.modifier === "*";
        var repeat = token.modifier === "*" || token.modifier === "+";

        if (Array.isArray(value)) {
          if (!repeat) {
            throw new TypeError("Expected \"" + token.name + "\" to not repeat, but got an array");
          }

          if (value.length === 0) {
            if (optional) continue;
            throw new TypeError("Expected \"" + token.name + "\" to not be empty");
          }

          for (var j = 0; j < value.length; j++) {
            var segment = encode(value[j], token);

            if (validate && !matches[i].test(segment)) {
              throw new TypeError("Expected all \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
            }

            path += token.prefix + segment + token.suffix;
          }

          continue;
        }

        if (typeof value === "string" || typeof value === "number") {
          var segment = encode(String(value), token);

          if (validate && !matches[i].test(segment)) {
            throw new TypeError("Expected \"" + token.name + "\" to match \"" + token.pattern + "\", but got \"" + segment + "\"");
          }

          path += token.prefix + segment + token.suffix;
          continue;
        }

        if (optional) continue;
        var typeOfMessage = repeat ? "an array" : "a string";
        throw new TypeError("Expected \"" + token.name + "\" to be " + typeOfMessage);
      }

      return path;
    };
  }
  /**
   * Create path match function from `path-to-regexp` spec.
   */

  function match(str, options) {
    var keys = [];
    var re = pathToRegexp(str, keys, options);
    return regexpToFunction(re, keys, options);
  }
  /**
   * Create a path match function from `path-to-regexp` output.
   */

  function regexpToFunction(re, keys, options) {
    if (options === void 0) {
      options = {};
    }

    var _a = options.decode,
        decode = _a === void 0 ? function (x) {
      return x;
    } : _a;
    return function (pathname) {
      var m = re.exec(pathname);
      if (!m) return false;
      var path = m[0],
          index = m.index;
      var params = Object.create(null);

      var _loop_1 = function _loop_1(i) {
        // tslint:disable-next-line
        if (m[i] === undefined) return "continue";
        var key = keys[i - 1];

        if (key.modifier === "*" || key.modifier === "+") {
          params[key.name] = m[i].split(key.prefix + key.suffix).map(function (value) {
            return decode(value, key);
          });
        } else {
          params[key.name] = decode(m[i], key);
        }
      };

      for (var i = 1; i < m.length; i++) {
        _loop_1(i);
      }

      return {
        path: path,
        index: index,
        params: params
      };
    };
  }
  /**
   * Escape a regular expression string.
   */

  function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  }
  /**
   * Get the flags for a regexp from the options.
   */


  function flags(options) {
    return options && options.sensitive ? "" : "i";
  }
  /**
   * Pull out keys from a regexp.
   */


  function regexpToRegexp(path, keys) {
    if (!keys) return path;
    var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
    var index = 0;
    var execResult = groupsRegex.exec(path.source);

    while (execResult) {
      keys.push({
        // Use parenthesized substring match if available, index otherwise
        name: execResult[1] || index++,
        prefix: "",
        suffix: "",
        modifier: "",
        pattern: ""
      });
      execResult = groupsRegex.exec(path.source);
    }

    return path;
  }
  /**
   * Transform an array into a regexp.
   */


  function arrayToRegexp(paths, keys, options) {
    var parts = paths.map(function (path) {
      return pathToRegexp(path, keys, options).source;
    });
    return new RegExp("(?:" + parts.join("|") + ")", flags(options));
  }
  /**
   * Create a path regexp from string input.
   */


  function stringToRegexp(path, keys, options) {
    return tokensToRegexp(parse$1(path, options), keys, options);
  }
  /**
   * Expose a function for taking tokens and returning a RegExp.
   */


  function tokensToRegexp(tokens, keys, options) {
    if (options === void 0) {
      options = {};
    }

    var _a = options.strict,
        strict = _a === void 0 ? false : _a,
        _b = options.start,
        start = _b === void 0 ? true : _b,
        _c = options.end,
        end = _c === void 0 ? true : _c,
        _d = options.encode,
        encode = _d === void 0 ? function (x) {
      return x;
    } : _d;
    var endsWith = "[" + escapeString(options.endsWith || "") + "]|$";
    var delimiter = "[" + escapeString(options.delimiter || "/#?") + "]";
    var route = start ? "^" : ""; // Iterate over the tokens and create our regexp string.

    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
      var token = tokens_1[_i];

      if (typeof token === "string") {
        route += escapeString(encode(token));
      } else {
        var prefix = escapeString(encode(token.prefix));
        var suffix = escapeString(encode(token.suffix));

        if (token.pattern) {
          if (keys) keys.push(token);

          if (prefix || suffix) {
            if (token.modifier === "+" || token.modifier === "*") {
              var mod = token.modifier === "*" ? "?" : "";
              route += "(?:" + prefix + "((?:" + token.pattern + ")(?:" + suffix + prefix + "(?:" + token.pattern + "))*)" + suffix + ")" + mod;
            } else {
              route += "(?:" + prefix + "(" + token.pattern + ")" + suffix + ")" + token.modifier;
            }
          } else {
            route += "(" + token.pattern + ")" + token.modifier;
          }
        } else {
          route += "(?:" + prefix + suffix + ")" + token.modifier;
        }
      }
    }

    if (end) {
      if (!strict) route += delimiter + "?";
      route += !options.endsWith ? "$" : "(?=" + endsWith + ")";
    } else {
      var endToken = tokens[tokens.length - 1];
      var isEndDelimited = typeof endToken === "string" ? delimiter.indexOf(endToken[endToken.length - 1]) > -1 : // tslint:disable-next-line
      endToken === undefined;

      if (!strict) {
        route += "(?:" + delimiter + "(?=" + endsWith + "))?";
      }

      if (!isEndDelimited) {
        route += "(?=" + delimiter + "|" + endsWith + ")";
      }
    }

    return new RegExp(route, flags(options));
  }
  /**
   * Normalize the given path string, returning a regular expression.
   *
   * An empty array can be passed in for the keys, which will hold the
   * placeholder key descriptions. For example, using `/user/:id`, `keys` will
   * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
   */

  function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp) return regexpToRegexp(path, keys);
    if (Array.isArray(path)) return arrayToRegexp(path, keys, options);
    return stringToRegexp(path, keys, options);
  }

  var dist_es2015 = /*#__PURE__*/Object.freeze({
    parse: parse$1,
    compile: compile,
    tokensToFunction: tokensToFunction,
    match: match,
    regexpToFunction: regexpToFunction,
    tokensToRegexp: tokensToRegexp,
    pathToRegexp: pathToRegexp
  });

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;
  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */

  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}

    return index;
  }

  var _trimmedEndIndex = trimmedEndIndex;

  /** Used to match leading whitespace. */

  var reTrimStart = /^\s+/;
  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */

  function baseTrim(string) {
    return string ? string.slice(0, _trimmedEndIndex(string) + 1).replace(reTrimStart, '') : string;
  }

  var _baseTrim = baseTrim;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = _typeof(value);

    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  /** Detect free variable `global` from Node.js. */

  var freeGlobal = _typeof(commonjsGlobal) == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */

  var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;
  /** Used as a reference to the global object. */

  var root = _freeGlobal || freeSelf || Function('return this')();
  var _root = root;

  /** Built-in value references. */

  var _Symbol2 = _root.Symbol;
  var _Symbol = _Symbol2;

  /** Used for built-in method references. */

  var objectProto = Object.prototype;
  /** Used to check objects for own properties. */

  var hasOwnProperty = objectProto.hasOwnProperty;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString = objectProto.toString;
  /** Built-in value references. */

  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */

  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);

    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }

    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;
  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */

  var nativeObjectToString$1 = objectProto$1.toString;
  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */

  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */

  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';
  /** Built-in value references. */

  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;
  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */

  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }

    return symToStringTag$1 && symToStringTag$1 in Object(value) ? _getRawTag(value) : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && _typeof(value) == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */

  var symbolTag = '[object Symbol]';
  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */

  function isSymbol(value) {
    return _typeof(value) == 'symbol' || isObjectLike_1(value) && _baseGetTag(value) == symbolTag;
  }

  var isSymbol_1 = isSymbol;

  /** Used as references for various `Number` constants. */

  var NAN = 0 / 0;
  /** Used to detect bad signed hexadecimal string values. */

  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
  /** Used to detect binary string values. */

  var reIsBinary = /^0b[01]+$/i;
  /** Used to detect octal string values. */

  var reIsOctal = /^0o[0-7]+$/i;
  /** Built-in method references without a dependency on `root`. */

  var freeParseInt = parseInt;
  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */

  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }

    if (isSymbol_1(value)) {
      return NAN;
    }

    if (isObject_1(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject_1(other) ? other + '' : other;
    }

    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }

    value = _baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
  }

  var toNumber_1 = toNumber;

  /** Used as references for various `Number` constants. */

  var INFINITY = 1 / 0,
      MAX_INTEGER = 1.7976931348623157e+308;
  /**
   * Converts `value` to a finite number.
   *
   * @static
   * @memberOf _
   * @since 4.12.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted number.
   * @example
   *
   * _.toFinite(3.2);
   * // => 3.2
   *
   * _.toFinite(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toFinite(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toFinite('3.2');
   * // => 3.2
   */

  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }

    value = toNumber_1(value);

    if (value === INFINITY || value === -INFINITY) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }

    return value === value ? value : 0;
  }

  var toFinite_1 = toFinite;

  /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */

  function toInteger(value) {
    var result = toFinite_1(value),
        remainder = result % 1;
    return result === result ? remainder ? result - remainder : result : 0;
  }

  var toInteger_1 = toInteger;

  /** Error message constants. */

  var FUNC_ERROR_TEXT = 'Expected a function';
  /**
   * Creates a function that invokes `func`, with the `this` binding and arguments
   * of the created function, while it's called less than `n` times. Subsequent
   * calls to the created function return the result of the last `func` invocation.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Function
   * @param {number} n The number of calls at which `func` is no longer invoked.
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * jQuery(element).on('click', _.before(5, addContactToList));
   * // => Allows adding up to 4 contacts to the list.
   */

  function before(n, func) {
    var result;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }

    n = toInteger_1(n);
    return function () {
      if (--n > 0) {
        result = func.apply(this, arguments);
      }

      if (n <= 1) {
        func = undefined;
      }

      return result;
    };
  }

  var before_1 = before;

  /**
   * Creates a function that is restricted to invoking `func` once. Repeat calls
   * to the function return the value of the first invocation. The `func` is
   * invoked with the `this` binding and arguments of the created function.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new restricted function.
   * @example
   *
   * var initialize = _.once(createApplication);
   * initialize();
   * initialize();
   * // => `createApplication` is invoked once
   */

  function once(func) {
    return before_1(2, func);
  }

  var once_1 = once;

  var require$$0 = ( events && EventEmitter ) || events;

  var lib$1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, '__esModule', {
      value: true
    });

    function _interopDefault(ex) {
      return ex && _typeof(ex) === 'object' && 'default' in ex ? ex['default'] : ex;
    }

    var events = _interopDefault(require$$0);

    var Cookies = _interopDefault(js_cookie);

    var once = _interopDefault(once_1);

    var inBrowser = typeof window !== 'undefined';

    var supportsPushState = inBrowser && function () {
      var ua = window.navigator.userAgent;

      if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
        return false;
      }

      return window.history && typeof window.history.pushState === 'function';
    }();

    var _window = window,
        history = _window.history;

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

    function getPreEnv(env) {
      return env !== 'production' && env.length ? env + "." : '';
    }

    var eventEmitter = new events.EventEmitter();
    var HOOK_BEFORE = 'nehook:auth-befroe';
    var HOOK_AFTER = 'nehook:auth-after';

    function hook(type, handler) {
      eventEmitter.on(type, handler);
    }

    function createEventBefore(data) {
      return {
        type: HOOK_BEFORE,
        data: data
      };
    }

    function createEventAfter(data) {
      return {
        type: HOOK_AFTER,
        data: data
      };
    }

    function emit(event) {
      eventEmitter.emit(event.type, event);
    }

    function registerHook(_ref) {
      var after = _ref.after,
          before = _ref.before;
      hook(HOOK_BEFORE, function (e) {
        return before && before(e);
      });
      hook(HOOK_AFTER, function (e) {
        return after && after(e);
      });
    }

    var NAUTH_USERID = "nauth-userid"; // const NAUTH_DDUSERID = `nauth-dduserid`
    // const NAUTH_DDUNIONID = `nauth-ddunionid`

    var NAUTH_TOKEN = "nauth-token";
    var NAUTH_USERNAME = "nauth-username";
    var ENV_PRODUCTION = 'production';
    var EXPIRES = 15;

    function getKeyWithEnv(key) {
      var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ENV_PRODUCTION;
      return env !== ENV_PRODUCTION && env.length ? key + "-".concat(env) : key;
    }

    function getToken() {
      var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ENV_PRODUCTION;
      var params = arguments.length > 1 ? arguments[1] : undefined;
      var token = Cookies.get(getKeyWithEnv(NAUTH_TOKEN, env));

      if (!token && params && (token = params[NAUTH_TOKEN.replace(/-/g, '_')])) {
        setToken(token, env);
        return token;
      }

      return token;
    }

    function setToken(token) {
      var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ENV_PRODUCTION;
      Cookies.set(getKeyWithEnv(NAUTH_TOKEN, env), token, {
        expires: EXPIRES
      });
    }

    function getUserId() {
      var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ENV_PRODUCTION;
      var params = arguments.length > 1 ? arguments[1] : undefined;
      var userId = Cookies.get(getKeyWithEnv(NAUTH_USERID, env));

      if (!userId && params && (userId = params[NAUTH_USERID.replace(/-/g, '_')])) {
        setUserId(userId, env);
        return userId;
      }

      return userId;
    }

    function setUserId(userid) {
      var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ENV_PRODUCTION;
      Cookies.set(getKeyWithEnv(NAUTH_USERID, env), userid, {
        expires: EXPIRES
      });
    }

    function getUserName() {
      var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ENV_PRODUCTION;
      var params = arguments.length > 1 ? arguments[1] : undefined;
      var username = Cookies.get(getKeyWithEnv(NAUTH_USERNAME, env));

      if (!username && params && (username = params[NAUTH_USERNAME.replace(/-/g, '_')])) {
        setUserName(username, env);
        return username;
      }

      return username;
    }

    function setUserName(username) {
      var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ENV_PRODUCTION;
      Cookies.set(getKeyWithEnv(NAUTH_USERNAME, env), username, {
        expires: EXPIRES
      });
    }

    function removeAll() {
      var env = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ENV_PRODUCTION;
      Cookies.remove(getKeyWithEnv(NAUTH_USERNAME, env));
      Cookies.remove(getKeyWithEnv(NAUTH_USERID, env));
      Cookies.remove(getKeyWithEnv(NAUTH_TOKEN, env));

      if (/98du.com$/.test(window.location.hostname)) {
        Cookies.remove(getKeyWithEnv(NAUTH_USERNAME, env), {
          domain: '.98du.com'
        });
        Cookies.remove(getKeyWithEnv(NAUTH_USERID, env), {
          domain: '.98du.com'
        });
        Cookies.remove(getKeyWithEnv(NAUTH_TOKEN, env), {
          domain: '.98du.com'
        });
      }
    }

    function createAuthError(from, to, type, message) {
      var error = new Error(message); // @ts-ignore

      error._isAuth = true; // @ts-ignore

      error.from = from; // @ts-ignore

      error.to = to; // @ts-ignore

      error.type = type;
      return error;
    }

    var _window2 = window,
        fetch = _window2.fetch; // 退出登录

    function fetchLoginOut(env) {
      var formData = new FormData();
      var token = getToken(env);

      if (token == null) {
        console.warn(">>> \u9000\u51FA\u767B\u5F55\u9700\u8981\u4F7F\u7528token. token\u83B7\u53D6\u5931\u8D25. token: ".concat(token));
        return Promise.resolve({
          message: '退出登录需要使用token. token获取失败',
          token: token
        });
      }

      formData.set('token', getToken(env).replace("Bearer ", ''));
      return fetch("http://".concat(getPreEnv(env), "nadmin-java.uheixia.com/api/auth/ehr_logout"), {
        method: 'post',
        // headers: {
        //   // 'Content-Type': 'application/json',
        //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        //   Authorization: `Bearer ${token}`
        // },
        // body: JSON.stringify(params),
        body: formData
      }).then(function (res) {
        return res.json();
      });
    } // 获取用户信息


    function fetchUserInfo(env, params) {
      return fetch("http://".concat(getPreEnv(env), "ehr-java.98du.com/api/user/getInfoById?").concat(lib.stringify(params)), {
        method: 'get',
        headers: {
          Authorization: "Bearer ".concat(getToken(env))
        }
      }).then(function (res) {
        return res.json();
      });
    } // 获取项目ID


    function fetchEhrProject(env, params) {
      return fetch("http://".concat(getPreEnv(env), "ehr-java.98du.com/api/project/getProjectByUserId?").concat(lib.stringify(params)), {
        method: 'get',
        headers: {
          Authorization: "Bearer ".concat(getToken(env))
        }
      }).then(function (res) {
        return res.json();
      });
    }

    var AuthHandle = {
      started: false,
      path: '/login',
      start: function start() {
        var _this = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        if (!supportsPushState) {
          throw createAuthError('', '', 'before', "<<< not support history.pushState.");
        }

        var path = options.path,
            env = options.env,
            _after = options.after,
            before = options.before;
        this.options = options;
        this.started = true;
        this.path = path || this.path;
        this.regex = dist_es2015.pathToRegexp(this.path);
        this.matcher = dist_es2015.match(this.path);
        this.env = env || (/^(127.0.0.1)|(localhost)|(localdev)|(192.168)/.test(window.location.hostname) ? 'localdev' : 'production');
        this.options.env = this.env;
        this.projectId = this.getProjectIdWitchCache();
        this.registerHook({
          after: function after(e) {
            if (_after) {
              return _after(e);
            }

            if (_this.isAuthLogin(e.data.from.path)) {
              // 跳转到根目录
              return window.location.href = window.location.origin;
            } // 跳转到原有的地址上


            window.location.href = window.location.origin + e.data.from.fullPath;
          },
          before: before
        });
        this.setupListeners();
      },
      isAuthLogin: function isAuthLogin(url) {
        return this.regex ? !!this.regex.exec(url) : false;
      },
      registerHook: registerHook,
      setupListeners: function setupListeners() {
        var _this2 = this;

        var originPushState = history.pushState;
        var self = this; // 重写history.pushState, 监听路由变化, 接入统一登录

        history.pushState = function () {
          var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
          var title = arguments.length > 1 ? arguments[1] : undefined;
          var url = arguments.length > 2 ? arguments[2] : undefined;

          // 监听路由是否跳转到登录界面
          if (self.isAuthLogin.call(self, url.split('?')[0])) {
            var _window$location = window.location,
                pathname = _window$location.pathname,
                search = _window$location.search;
            var matcher = self.matcher.bind(self);
            var urlSplit = url.split('?');
            var matchRetFrom = matcher(pathname);
            var matchRetTo = matcher(urlSplit[0]); // route from

            var from = {
              fullPath: pathname + search,
              path: pathname,
              query: param2Obj(pathname),
              params: matchRetFrom ? matchRetFrom.params : {},
              regex: self.regex
            }; // route to login

            var to = {
              fullPath: url,
              path: urlSplit[0],
              query: param2Obj(url),
              params: Object.assign(matchRetTo ? matchRetTo.params : {}, state),
              regex: self.regex
            }; // 跳转前

            emit(createEventBefore({
              from: from,
              to: to
            })); // 更新路由

            self.updateRoute.call(self, to);
            var token = getToken(_this2.env, to.query); // 根据token决定是否跳转到统一登录
            // 根据路径前缀是否有localdev判断环境

            if (!token) {
              return self.loginOut.call(self, to.params);
            } // hasToken 重定向到原有的地址


            originPushState.call(history, state, title, url);
            emit(createEventAfter({
              userid: getUserId(_this2.env, to.query),
              token: token,
              username: getUserName(_this2.env, to.query),
              to: to,
              from: from
            }));
          } // 没有跳转到登录页面直接跳转


          return originPushState.call(history, state, title, url);
        }; // 第一次加载的时候


        if (this.isAuthLogin(window.location.pathname)) {
          history.pushState({}, '', window.location.pathname + window.location.search);
        }
      },
      updateRoute: function updateRoute(route) {
        if (this.route) {
          Object.assign(this.route, route);
        } else {
          this.route = Object.assign({}, route);
        }
      },
      // 登录
      login: function login(params) {
        var _this3 = this;

        var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        assertStarted(); // 不校验token直接跳转到统一登录

        if (params === true || typeof params === 'string') {
          var next = function next() {
            return _this3.goAuthView(typeof state === 'string' ? {} : state, typeof params === 'string' ? params : undefined);
          }; // 添加 onLogin 事件


          if (this.options && this.options.onLogin) {
            return this.options.onLogin(next, Object.assign({}, this.options, {
              token: getToken(this.env)
            }));
          }

          return next();
        }

        history.pushState(params, '', this.transformPath(params || {}) + (typeof state === 'string' ? '?' + state : ''));
      },
      // 退出登录
      loginOut: function loginOut() {
        var _this4 = this;

        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var state = arguments.length > 1 ? arguments[1] : undefined;
        assertStarted(); // 调用接口退出登录

        return fetchLoginOut(this.env).then(function () {
          var next = function next() {
            // 退出登录后才能清除token
            removeAll(_this4.env); // 调整到登录页面

            if (typeof params === 'string') {
              _this4.goAuthView({}, params);
            } else {
              _this4.goAuthView(params, typeof state === 'string' ? state : '');
            }
          };

          if (_this4.options && _this4.options.onLoginOut) {
            return _this4.options.onLoginOut(next, Object.assign({}, _this4.options, {
              token: getToken(_this4.env)
            }));
          }

          return next();
        });
      },
      goAuthView: function goAuthView() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var query = arguments.length > 1 ? arguments[1] : undefined;
        window.location.href = "http://".concat(this.env !== 'production' ? this.env + '.' : '', "auth.98du.com/login") + "?url=".concat(window.location.origin + this.transformPath(params)).concat(query ? '&' + query : '');
      },
      transformPath: function transformPath() {
        var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var toPath = dist_es2015.compile(this.path, {
          encode: encodeURIComponent
        });
        return toPath(params);
      },
      getProjectIdWitchCache: function getProjectIdWitchCache() {
        if (window.ICESTARK && window.ICESTARK.store.store.curProject) {
          var curProject = window.ICESTARK.store.store.curProject;
          return curProject.source.wnlProjectId;
        }

        return null;
      },
      // 获取项目ID
      getProjectId: function getProjectId(name, params) {
        var _this5 = this;

        assertStarted(); // @ice/stark-data 中保存的当前路由

        var projectId = this.getProjectIdWitchCache();

        if (projectId) {
          return Promise.resolve(projectId);
        }

        if (typeof name !== 'string') {
          return Promise.reject(new Error("<<< getProjectId \u9700\u8981name\u53C2\u6570."));
        }

        var env = AuthHandle.env;
        var queryStr = params ? '\\?' + lib.stringify(params) : ''; // ehr接口获取

        return fetchEhrProject(env, {
          userId: getUserId(env)
        }).then(function (_ref2) {
          var data = _ref2.data;
          var curRouteInfo = data.find(function (o) {
            var reg = new RegExp("^//".concat(getPreEnv(env).replace(/\./g, '\\.')).concat(name, "\\.98du\\.com").concat(queryStr));
            return reg.test(o.domain) || o.domain === name;
          });
          if (!curRouteInfo) return null;
          projectId = _this5.projectId = curRouteInfo.wnlProjectId;
          return projectId;
        });
      }
    }; // 只允许执行一次

    AuthHandle.start = once(AuthHandle.start.bind(AuthHandle)); // 断言是否执行了start

    function assertStarted() {
      if (!AuthHandle.started) {
        if (!getToken(AuthHandle.env)) {
          throw createAuthError('', '', 'start', '<<< 无法获取Authorization, 请先执行start(). ');
        } else {
          console.warn("<<< \u8BF7\u5148\u6267\u884Cstart().");
        }
      }
    }

    var _default = {
      version: "1.3.4",

      get token() {
        assertStarted();
        return getToken(AuthHandle.env);
      },

      get env() {
        assertStarted();
        return AuthHandle.env;
      },

      get started() {
        assertStarted();
        return AuthHandle.started;
      },

      get projectId() {
        return AuthHandle.projectId;
      },

      support: {
        get pushState() {
          return supportsPushState;
        }

      },
      // 请求钉钉的用户信息
      getUserInfo: function getUserInfo() {
        assertStarted();
        var env = AuthHandle.env;
        return {
          token: getToken(env),
          userid: getUserId(env),
          username: getUserName(env)
        };
      },
      // 获取所有用户信息
      getUserInfoAll: function getUserInfoAll() {
        assertStarted();
        var env = AuthHandle.env;
        return fetchUserInfo(env, {
          userId: this.getUserInfo().userid
        });
      },
      // 获取项目ID
      getProjectId: AuthHandle.getProjectId.bind(AuthHandle),
      // 跳转到登录界面
      login: AuthHandle.login.bind(AuthHandle),
      // 退出登录
      loginOut: AuthHandle.loginOut.bind(AuthHandle),
      start: AuthHandle.start.bind(AuthHandle)
    };
    var start = _default.start;
    var login = _default.login;
    var loginOut = _default.loginOut;
    exports.start = start;
    exports.login = login;
    exports.loginOut = loginOut;
    exports["default"] = _default;
  });
  var index = unwrapExports(lib$1);
  var lib_1$1 = lib$1.start;
  var lib_2$1 = lib$1.login;
  var lib_3$1 = lib$1.loginOut;

  exports.default = index;
  exports.start = lib_1$1;
  exports.login = lib_2$1;
  exports.loginOut = lib_3$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
