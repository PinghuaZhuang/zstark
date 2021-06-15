import Cookies from 'js-cookie'

const NAUTH_TOKEN = `nauth-token`

export type Env = 'production' | 'localdev' /* | string */

/**
 * 获取url的query参数
 */
export function param2Obj(url: string): object {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = decodeURIComponent(val)
    }
  })
  return obj
}

/**
 * 获取环境变量
 */
export function getEnv(): Env {
  return (
    (/^(127.0.0.1)|(192.168)|(localhost)|(localdev)/.test(window.location.hostname))
      ? 'localdev'
      : 'production'
  )
}

// 目前环境只有 localdev 和 production
// @nestark/auth 没有引用这里. 实现是一样的.
export function getKeyWithEnv(key: string, env: string = getEnv(), template = '{k}-{env}') {
  // 只有localdev有后缀
  return (env !== 'production' && env.length)
    ? (template
        .replace(/{k}/g, key)
        .replace(/{env}/g, env))
    : key
}

/**
 * 获取token
 */
export function getToken(env?: Env): string | undefined {
  return Cookies.get(getKeyWithEnv(NAUTH_TOKEN, env || getEnv()))
}

/**
 * 创建缓存对象
 * @param { Number } length 缓存长度
 */
 export function createCache<T>(length: string) {
  const keys: string[] = []
  let cacheLength = length || 50

  function cache(key: string | ((k: string, v: T) => any), value: T) {
      if (typeof key === 'function') {
        const cb = key
        // @ts-ignore
        return keys.map(k => cb(k.replace(/\s$/, ''), cache[k + ' '])) as any[]
      }

      if (keys.push(key + ' ') > cacheLength) {
          delete cache[keys.shift() as string]
      }
      return (value == null ? cache[key + ' '] : (cache[key + ' '] = value)) as string | T
  }
  return cache
}

/**
 * 获取 UUID
 */
 export function getUUID(): string {
  let d = new Date().getTime()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}
