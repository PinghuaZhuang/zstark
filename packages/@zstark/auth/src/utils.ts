export const inBrowser = typeof window !== 'undefined'

export const supportsPushState =
  inBrowser &&
  (function() {
    const ua = window.navigator.userAgent

    if (
      (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
      ua.indexOf('Mobile Safari') !== -1 &&
      ua.indexOf('Chrome') === -1 &&
      ua.indexOf('Windows Phone') === -1
    ) {
      return false
    }

    return window.history && typeof window.history.pushState === 'function'
  })()

export const { history } = window

export function param2Obj(url: string): Record<string, unknown> {
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

export function getPreEnv(env: string) {
  return (env !== 'production' && env.length) ? env + `.` : ''
}
