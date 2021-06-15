/*!
 * @zstark/auth 1.3.4
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var events = _interopDefault(require('events'));
var Cookies = _interopDefault(require('js-cookie'));
var qs = require('qs');
var pathToRegexp = require('path-to-regexp');
var once = _interopDefault(require('lodash/once'));

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

const eventEmitter = new events.EventEmitter();
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
    return fetch(`http://${getPreEnv(env)}ehr-java.98du.com/api/user/getInfoById?${qs.stringify(params)}`, {
        method: 'get',
        headers: {
            Authorization: `Bearer ${getToken(env)}`
        },
    }).then(res => res.json());
}
// 获取项目ID
function fetchEhrProject(env, params) {
    return fetch(`http://${getPreEnv(env)}ehr-java.98du.com/api/project/getProjectByUserId?${qs.stringify(params)}`, {
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
        this.regex = pathToRegexp.pathToRegexp(this.path);
        this.matcher = pathToRegexp.match(this.path);
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
        const toPath = pathToRegexp.compile(this.path, { encode: encodeURIComponent });
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
        const queryStr = params ? '\\?' + qs.stringify(params) : '';
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

exports.start = start;
exports.login = login;
exports.loginOut = loginOut;
exports.default = _default;
