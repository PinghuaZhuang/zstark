/* eslint-disable @typescript-eslint/no-use-before-define */
import { pathToRegexp, match, compile, MatchFunction } from 'path-to-regexp'
import { history, param2Obj, supportsPushState, getPreEnv } from './utils'
import { registerHook, createEventBefore, createEventAfter, emit, AuthEventBefore, AuthEventAfter } from './hook'
import { getToken, getUserId, getUserName, removeAll } from './cookies'
import { createAuthError } from './error'
import { fetchLoginOut, fetchUserInfo, fetchEhrProject } from './fetch'
import { stringify } from 'qs'

import once from 'lodash/once'

export interface AuthRoute {
  fullPath: string;
  path: string;
  params: object;
  query: object;
  regex: RegExp;
}

interface AuthHandleOption {
  path?: string;
  env?: string;
  after?: (e: AuthEventAfter) => void;
  before?: (e: AuthEventBefore) => void;
  onLogin?: (next: () => void, options?: AuthHandleOption & { token?: string }) => void;
  onLoginOut?: (next: () => void, options?: AuthHandleOption & { token?: string }) => void;
}

interface AuthHandleImp {
  route?: AuthRoute;
  regex?: RegExp;
  matcher?: MatchFunction;
  env?: string;
  started: boolean;
  path: string;
  projectId?: number | null;
  options?: AuthHandleOption;

  start: (options?: AuthHandleOption) => void;
  isAuthLogin: (url: string) => boolean;
  registerHook: typeof registerHook;
  setupListeners: () => void;
  updateRoute: (route: AuthRoute) => void;
  loginOut: (params?: object | string, state?: string) => void;
  login: (params?: object | boolean | string, state?: object | string) => void;
  transformPath: (params: object) => string;
  goAuthView: (params: object, query?: string) => void;
  getProjectIdWitchCache: () => number | null;
  getProjectId: (name: string, params?: object) => Promise<number | null>;
}

const AuthHandle: AuthHandleImp = {
  started: false,
  path: '/login',

  start(options = {}) {
    if (!supportsPushState) {
      throw createAuthError('', '', 'before', `<<< not support history.pushState.`)
    }

    const { path, env, after, before } = options

    this.options = options
    this.started = true
    this.path = path || this.path
    this.regex = pathToRegexp(this.path)
    this.matcher = match(this.path)
    this.env = env || (
      (/^(127.0.0.1)|(localhost)|(localdev)|(192.168)/.test(window.location.hostname))
        ? 'localdev'
        : 'production'
    )
    this.options.env = this.env
    this.projectId = this.getProjectIdWitchCache()

    this.registerHook({ after: (e) => {
      if (after) {
        return after(e)
      }
      if (this.isAuthLogin(e.data.from.path)) {
        // 跳转到根目录
        return (window.location.href = window.location.origin)
      }
      // 跳转到原有的地址上
      window.location.href = window.location.origin + e.data.from.fullPath
    }, before })
    this.setupListeners()
  },

  isAuthLogin(url) {
    return this.regex ? !!this.regex.exec(url) : false
  },

  registerHook,

  setupListeners() {
    const originPushState = history.pushState
    const self = this

    // 重写history.pushState, 监听路由变化, 接入统一登录
    history.pushState = (state: object = {}, title: string, url: string) => {
      // 监听路由是否跳转到登录界面
      if (self.isAuthLogin.call(self, url.split('?')[0])) {
        const { pathname, search } = window.location
        const matcher = (self.matcher as MatchFunction).bind(self)
        const urlSplit = url.split('?')
        const matchRetFrom = matcher(pathname)
        const matchRetTo = matcher(urlSplit[0])

        // route from
        const from: AuthRoute = {
          fullPath: pathname + search,
          path: pathname,
          query: param2Obj(pathname),
          params: matchRetFrom ? matchRetFrom.params : {},
          regex: self.regex as RegExp,
        }

        // route to login
        const to: AuthRoute = {
          fullPath: url,
          path: urlSplit[0],
          query: param2Obj(url),
          params: Object.assign(matchRetTo ? matchRetTo.params : {}, state),
          regex: self.regex as RegExp,
        }

        // 跳转前
        emit(createEventBefore({
          from, to,
        }))
        // 更新路由
        self.updateRoute.call(self, to)

        const token = getToken(this.env, to.query)

        // 根据token决定是否跳转到统一登录
        // 根据路径前缀是否有localdev判断环境
        if (!token) {
          return self.loginOut.call(self, to.params)
        }

        // hasToken 重定向到原有的地址
        originPushState.call(history, state, title, url)
        emit(createEventAfter({
          userid: getUserId(this.env, to.query),
          token,
          username: getUserName(this.env, to.query),
          to,
          from,
        }))
      }

      // 没有跳转到登录页面直接跳转
      return originPushState.call(history, state, title, url)
    }

    // 第一次加载的时候
    if (this.isAuthLogin(window.location.pathname)) {
      history.pushState({}, '', window.location.pathname + window.location.search)
    }
  },

  updateRoute(route) {
    if (this.route) {
      Object.assign(this.route, route)
    } else {
      this.route = Object.assign({}, route)
    }
  },

  // 登录
  login(params, state = {}) {
    assertStarted()
    // 不校验token直接跳转到统一登录
    if (params === true || typeof params === 'string') {
      const next = () => this.goAuthView(
        (typeof state === 'string' ? {} : state),
        typeof params === 'string' ? params : undefined
      )

      // 添加 onLogin 事件
      if (this.options && this.options.onLogin) {
        return this.options.onLogin(next, Object.assign({}, this.options, {
          token: getToken(this.env)
        }))
      }
      return next()
    }
    history.pushState(params, '', this.transformPath(params || {}) + (typeof state === 'string' ? '?' + state : ''))
  },

  // 退出登录
  loginOut(params = {}, state) {
    assertStarted()

    // 调用接口退出登录
    return fetchLoginOut(this.env as string).then(() => {
      const next = () => {
        // 退出登录后才能清除token
        removeAll(this.env)
        // 调整到登录页面
        if (typeof params === 'string') {
          this.goAuthView({}, params)
        } else {
          this.goAuthView(params, typeof state === 'string' ? state : '')
        }
      }

      if (this.options && this.options.onLoginOut) {
        return this.options.onLoginOut(next, Object.assign({}, this.options, {
          token: getToken(this.env)
        }))
      }
      return next()
    })
  },

  goAuthView(params = {}, query) {
    window.location.href =
      `http://${this.env !== 'production' ? this.env + '.' : ''}auth.98du.com/login` +
      `?url=${window.location.origin + this.transformPath(params)}${query ? '&' + query : ''}`
  },

  transformPath(params = {}) {
    const toPath = compile(this.path, { encode: encodeURIComponent })
    return toPath(params)
  },

  getProjectIdWitchCache() {
    if (window.ICESTARK && window.ICESTARK.store.store.curProject) {
      const { curProject } = window.ICESTARK.store.store
      return curProject.source.wnlProjectId
    }
    return null
  },

  // 获取项目ID
  getProjectId(name, params) {
    assertStarted()

    // @ice/stark-data 中保存的当前路由
    let projectId = this.getProjectIdWitchCache()

    if (projectId) {
      return Promise.resolve(projectId)
    }

    if (typeof name !== 'string') {
      return Promise.reject(new Error(`<<< getProjectId 需要name参数.`))
    }

    const env = AuthHandle.env as string
    const queryStr = params ? '\\?' + stringify(params) : ''

    // ehr接口获取
    return fetchEhrProject(env, { userId: getUserId(env) }).then(({ data }) => {
      const curRouteInfo = data.find(o => {
        const reg = new RegExp(`^//${getPreEnv(env).replace(/\./g, '\\.')}${name}\\.98du\\.com${queryStr}`)
        return reg.test(o.domain) || o.domain === name
      })
      if (!curRouteInfo) return null
      projectId = (this.projectId = curRouteInfo.wnlProjectId)
      return projectId
    })
  },
}

// 只允许执行一次
AuthHandle.start = once(AuthHandle.start.bind(AuthHandle))

// 断言是否执行了start
function assertStarted() {
  if (!AuthHandle.started) {
    if (!getToken(AuthHandle.env)) {
      throw createAuthError('', '', 'start', '<<< 无法获取Authorization, 请先执行start(). ')
    } else {
      console.warn(`<<< 请先执行start().`)
    }
  }
}

const _default = {
  version: PKG_VERSION,

  get token() {
    assertStarted()
    return getToken(AuthHandle.env) as string
  },
  get env() {
    assertStarted()
    return AuthHandle.env
  },
  get started() {
    assertStarted()
    return AuthHandle.started
  },
  get projectId() {
    return AuthHandle.projectId
  },

  support: {
    get pushState() {
      return supportsPushState
    }
  },

  // 请求钉钉的用户信息
  getUserInfo() {
    assertStarted()

    const env = AuthHandle.env as string
    return {
      token: getToken(env),
      userid: getUserId(env),
      username: getUserName(env),
    }
  },

  // 获取所有用户信息
  getUserInfoAll() {
    assertStarted()

    const env = AuthHandle.env as string
    return fetchUserInfo(env, { userId: this.getUserInfo().userid })
  },

  // 获取项目ID
  getProjectId: AuthHandle.getProjectId.bind(AuthHandle),

  // 跳转到登录界面
  login: AuthHandle.login.bind(AuthHandle),

  // 退出登录
  loginOut: AuthHandle.loginOut.bind(AuthHandle),

  start: AuthHandle.start.bind(AuthHandle),
}

export const start = _default.start

export const login = _default.login

export const loginOut = _default.loginOut

export default _default
