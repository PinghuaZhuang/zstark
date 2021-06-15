/*!
 * @zstark/auth 1.3.4
 */

import Cookies from 'js-cookie';
import { stringify } from 'qs';
import { pathToRegexp, match, compile } from 'path-to-regexp';
import once from 'lodash/once';

const inBrowser = typeof window !== 'undefined';
const supportsPushState = inBrowser &&
    (function () {
        const ua = window.navigator.userAgent;
        if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
            ua.indexOf('Mobile Safari') !== -1 &&
            ua.indexOf('Chrome') === -1 &&
            ua.indexOf('Windows Phone') === -1) {
            return false;
        }
        return window.history && typeof window.history.pushState === 'function';
    })();
const { history } = window;
function param2Obj(url) {
    const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
    if (!search) {
        return {};
    }
    const obj = {};
    const searchArr = search.split('&');
    searchArr.forEach(v => {
        const index = v.indexOf('=');
        if (index !== -1) {
            const name = v.substring(0, index);
            const val = v.substring(index + 1, v.length);
            obj[name] = decodeURIComponent(val);
        }
    });
    return obj;
}
function getPreEnv(env) {
    return (env !== 'production' && env.length) ? env + `.` : '';
}

var domain;

// This constructor is used to store event handlers. Instantiating this is
// faster than explicitly calling `Object.create(null)` to get a "clean" empty
// object (tested with v8 v4.9).
function EventHandlers() {}
EventHandlers.prototype = Object.create(null);

function EventEmitter() {
  EventEmitter.init.call(this);
}

// nodejs oddity
// require('events') === require('events').EventEmitter
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.usingDomains = false;

EventEmitter.prototype.domain = undefined;
EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

EventEmitter.init = function() {
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
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events, domain;
  var needDomainExit = false;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  domain = this.domain;

  // If there is no 'error' event listener then throw.
  if (doError) {
    er = arguments[1];
    if (domain) {
      if (!er)
        er = new Error('Uncaught, unspecified "error" event');
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

  if (!handler)
    return false;

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
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  if (needDomainExit)
    domain.exit();

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
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
      existing = events[type] = prepend ? [listener, existing] :
                                          [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
                            existing.length + ' ' + type + ' listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit');
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

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
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

EventEmitter.prototype.once = function once$$1(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || (list.listener && list.listener === listener)) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length; i-- > 0;) {
          if (list[i] === listener ||
              (list[i].listener && list[i].listener === listener)) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

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

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
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

  if (!events)
    ret = [];
  else {
    evlistener = events[type];
    if (!evlistener)
      ret = [];
    else if (typeof evlistener === 'function')
      ret = [evlistener.listener || evlistener];
    else
      ret = unwrapListeners(evlistener);
  }

  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
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
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, i) {
  var copy = new Array(i);
  while (i--)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

const eventEmitter = new EventEmitter.EventEmitter();
const HOOK_BEFORE = 'nehook:auth-befroe';
const HOOK_AFTER = 'nehook:auth-after';
function hook(type, handler) {
    eventEmitter.on(type, handler);
}
function createEventBefore(data) {
    return {
        type: HOOK_BEFORE,
        data,
    };
}
function createEventAfter(data) {
    return {
        type: HOOK_AFTER,
        data,
    };
}
function emit(event) {
    eventEmitter.emit(event.type, event);
}
function registerHook({ after, before }) {
    hook(HOOK_BEFORE, (e) => {
        return before && before(e);
    });
    hook(HOOK_AFTER, (e) => {
        return after && after(e);
    });
}

const NAUTH_USERID = `nauth-userid`;
// const NAUTH_DDUSERID = `nauth-dduserid`
// const NAUTH_DDUNIONID = `nauth-ddunionid`
const NAUTH_TOKEN = `nauth-token`;
const NAUTH_USERNAME = `nauth-username`;
const ENV_PRODUCTION = 'production';
const EXPIRES = 15;
function getKeyWithEnv(key, env = ENV_PRODUCTION) {
    return (env !== ENV_PRODUCTION && env.length) ? key + `-${env}` : key;
}
function setToken(token, env = ENV_PRODUCTION) {
    Cookies.set(getKeyWithEnv(NAUTH_TOKEN, env), token, { expires: EXPIRES });
}
function getToken(env = ENV_PRODUCTION, params) {
    let token = Cookies.get(getKeyWithEnv(NAUTH_TOKEN, env));
    if (!token && params && (token = params[NAUTH_TOKEN.replace(/-/g, '_')])) {
        setToken(token, env);
        return token;
    }
    return token;
}
function setUserId(userid, env = ENV_PRODUCTION) {
    Cookies.set(getKeyWithEnv(NAUTH_USERID, env), userid, { expires: EXPIRES });
}
function getUserId(env = ENV_PRODUCTION, params) {
    let userId = Cookies.get(getKeyWithEnv(NAUTH_USERID, env));
    if (!userId && params && (userId = params[NAUTH_USERID.replace(/-/g, '_')])) {
        setUserId(userId, env);
        return userId;
    }
    return userId;
}
function setUserName(username, env = ENV_PRODUCTION) {
    Cookies.set(getKeyWithEnv(NAUTH_USERNAME, env), username, { expires: EXPIRES });
}
function getUserName(env = ENV_PRODUCTION, params) {
    let username = Cookies.get(getKeyWithEnv(NAUTH_USERNAME, env));
    if (!username && params && (username = params[NAUTH_USERNAME.replace(/-/g, '_')])) {
        setUserName(username, env);
        return username;
    }
    return username;
}
function removeAll(env = ENV_PRODUCTION) {
    Cookies.remove(getKeyWithEnv(NAUTH_USERNAME, env));
    Cookies.remove(getKeyWithEnv(NAUTH_USERID, env));
    Cookies.remove(getKeyWithEnv(NAUTH_TOKEN, env));
    if (/98du.com$/.test(window.location.hostname)) {
        Cookies.remove(getKeyWithEnv(NAUTH_USERNAME, env), { domain: '.98du.com' });
        Cookies.remove(getKeyWithEnv(NAUTH_USERID, env), { domain: '.98du.com' });
        Cookies.remove(getKeyWithEnv(NAUTH_TOKEN, env), { domain: '.98du.com' });
    }
}

function createAuthError(from, to, type, message) {
    const error = new Error(message);
    // @ts-ignore
    error._isAuth = true;
    // @ts-ignore
    error.from = from;
    // @ts-ignore
    error.to = to;
    // @ts-ignore
    error.type = type;
    return error;
}

const { fetch } = window;
// 退出登录
function fetchLoginOut(env) {
    const formData = new FormData();
    const token = getToken(env);
    if (token == null) {
        console.warn(`>>> 退出登录需要使用token. token获取失败. token: ${token}`);
        return Promise.resolve({ message: '退出登录需要使用token. token获取失败', token });
    }
    formData.set('token', getToken(env).replace(`Bearer `, ''));
    return fetch(`http://${getPreEnv(env)}nadmin-java.uheixia.com/api/auth/ehr_logout`, {
        method: 'post',
        // headers: {
        //   // 'Content-Type': 'application/json',
        //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        //   Authorization: `Bearer ${token}`
        // },
        // body: JSON.stringify(params),
        body: formData,
    }).then(res => res.json());
}
// 获取用户信息
function fetchUserInfo(env, params) {
    return fetch(`http://${getPreEnv(env)}ehr-java.98du.com/api/user/getInfoById?${stringify(params)}`, {
        method: 'get',
        headers: {
            Authorization: `Bearer ${getToken(env)}`
        },
    }).then(res => res.json());
}
// 获取项目ID
function fetchEhrProject(env, params) {
    return fetch(`http://${getPreEnv(env)}ehr-java.98du.com/api/project/getProjectByUserId?${stringify(params)}`, {
        method: 'get',
        headers: {
            Authorization: `Bearer ${getToken(env)}`
        },
    }).then(res => res.json());
}

/* eslint-disable @typescript-eslint/no-use-before-define */
const AuthHandle = {
    started: false,
    path: '/login',
    start(options = {}) {
        if (!supportsPushState) {
            throw createAuthError('', '', 'before', `<<< not support history.pushState.`);
        }
        const { path, env, after, before } = options;
        this.options = options;
        this.started = true;
        this.path = path || this.path;
        this.regex = pathToRegexp(this.path);
        this.matcher = match(this.path);
        this.env = env || ((/^(127.0.0.1)|(localhost)|(localdev)|(192.168)/.test(window.location.hostname))
            ? 'localdev'
            : 'production');
        this.options.env = this.env;
        this.projectId = this.getProjectIdWitchCache();
        this.registerHook({ after: (e) => {
                if (after) {
                    return after(e);
                }
                if (this.isAuthLogin(e.data.from.path)) {
                    // 跳转到根目录
                    return (window.location.href = window.location.origin);
                }
                // 跳转到原有的地址上
                window.location.href = window.location.origin + e.data.from.fullPath;
            }, before });
        this.setupListeners();
    },
    isAuthLogin(url) {
        return this.regex ? !!this.regex.exec(url) : false;
    },
    registerHook,
    setupListeners() {
        const originPushState = history.pushState;
        const self = this;
        // 重写history.pushState, 监听路由变化, 接入统一登录
        history.pushState = (state = {}, title, url) => {
            // 监听路由是否跳转到登录界面
            if (self.isAuthLogin.call(self, url.split('?')[0])) {
                const { pathname, search } = window.location;
                const matcher = self.matcher.bind(self);
                const urlSplit = url.split('?');
                const matchRetFrom = matcher(pathname);
                const matchRetTo = matcher(urlSplit[0]);
                // route from
                const from = {
                    fullPath: pathname + search,
                    path: pathname,
                    query: param2Obj(pathname),
                    params: matchRetFrom ? matchRetFrom.params : {},
                    regex: self.regex,
                };
                // route to login
                const to = {
                    fullPath: url,
                    path: urlSplit[0],
                    query: param2Obj(url),
                    params: Object.assign(matchRetTo ? matchRetTo.params : {}, state),
                    regex: self.regex,
                };
                // 跳转前
                emit(createEventBefore({
                    from, to,
                }));
                // 更新路由
                self.updateRoute.call(self, to);
                const token = getToken(this.env, to.query);
                // 根据token决定是否跳转到统一登录
                // 根据路径前缀是否有localdev判断环境
                if (!token) {
                    return self.loginOut.call(self, to.params);
                }
                // hasToken 重定向到原有的地址
                originPushState.call(history, state, title, url);
                emit(createEventAfter({
                    userid: getUserId(this.env, to.query),
                    token,
                    username: getUserName(this.env, to.query),
                    to,
                    from,
                }));
            }
            // 没有跳转到登录页面直接跳转
            return originPushState.call(history, state, title, url);
        };
        // 第一次加载的时候
        if (this.isAuthLogin(window.location.pathname)) {
            history.pushState({}, '', window.location.pathname + window.location.search);
        }
    },
    updateRoute(route) {
        if (this.route) {
            Object.assign(this.route, route);
        }
        else {
            this.route = Object.assign({}, route);
        }
    },
    // 登录
    login(params, state = {}) {
        assertStarted();
        // 不校验token直接跳转到统一登录
        if (params === true || typeof params === 'string') {
            const next = () => this.goAuthView((typeof state === 'string' ? {} : state), typeof params === 'string' ? params : undefined);
            // 添加 onLogin 事件
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
    loginOut(params = {}, state) {
        assertStarted();
        // 调用接口退出登录
        return fetchLoginOut(this.env).then(() => {
            const next = () => {
                // 退出登录后才能清除token
                removeAll(this.env);
                // 调整到登录页面
                if (typeof params === 'string') {
                    this.goAuthView({}, params);
                }
                else {
                    this.goAuthView(params, typeof state === 'string' ? state : '');
                }
            };
            if (this.options && this.options.onLoginOut) {
                return this.options.onLoginOut(next, Object.assign({}, this.options, {
                    token: getToken(this.env)
                }));
            }
            return next();
        });
    },
    goAuthView(params = {}, query) {
        window.location.href =
            `http://${this.env !== 'production' ? this.env + '.' : ''}auth.98du.com/login` +
                `?url=${window.location.origin + this.transformPath(params)}${query ? '&' + query : ''}`;
    },
    transformPath(params = {}) {
        const toPath = compile(this.path, { encode: encodeURIComponent });
        return toPath(params);
    },
    getProjectIdWitchCache() {
        if (window.ICESTARK && window.ICESTARK.store.store.curProject) {
            const { curProject } = window.ICESTARK.store.store;
            return curProject.source.wnlProjectId;
        }
        return null;
    },
    // 获取项目ID
    getProjectId(name, params) {
        assertStarted();
        // @ice/stark-data 中保存的当前路由
        let projectId = this.getProjectIdWitchCache();
        if (projectId) {
            return Promise.resolve(projectId);
        }
        if (typeof name !== 'string') {
            return Promise.reject(new Error(`<<< getProjectId 需要name参数.`));
        }
        const env = AuthHandle.env;
        const queryStr = params ? '\\?' + stringify(params) : '';
        // ehr接口获取
        return fetchEhrProject(env, { userId: getUserId(env) }).then(({ data }) => {
            const curRouteInfo = data.find(o => {
                const reg = new RegExp(`^//${getPreEnv(env).replace(/\./g, '\\.')}${name}\\.98du\\.com${queryStr}`);
                return reg.test(o.domain) || o.domain === name;
            });
            if (!curRouteInfo)
                return null;
            projectId = (this.projectId = curRouteInfo.wnlProjectId);
            return projectId;
        });
    },
};
// 只允许执行一次
AuthHandle.start = once(AuthHandle.start.bind(AuthHandle));
// 断言是否执行了start
function assertStarted() {
    if (!AuthHandle.started) {
        if (!getToken(AuthHandle.env)) {
            throw createAuthError('', '', 'start', '<<< 无法获取Authorization, 请先执行start(). ');
        }
        else {
            console.warn(`<<< 请先执行start().`);
        }
    }
}
const _default = {
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
    getUserInfo() {
        assertStarted();
        const env = AuthHandle.env;
        return {
            token: getToken(env),
            userid: getUserId(env),
            username: getUserName(env),
        };
    },
    // 获取所有用户信息
    getUserInfoAll() {
        assertStarted();
        const env = AuthHandle.env;
        return fetchUserInfo(env, { userId: this.getUserInfo().userid });
    },
    // 获取项目ID
    getProjectId: AuthHandle.getProjectId.bind(AuthHandle),
    // 跳转到登录界面
    login: AuthHandle.login.bind(AuthHandle),
    // 退出登录
    loginOut: AuthHandle.loginOut.bind(AuthHandle),
    start: AuthHandle.start.bind(AuthHandle),
};
const start = _default.start;
const login = _default.login;
const loginOut = _default.loginOut;

export default _default;
export { start, login, loginOut };
