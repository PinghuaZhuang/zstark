import getUserAgent from './getUserAgent'
import supports from './supports'
import CreateBrowerVersionMap from './CreateBrowerVersionMap'

// 内核类型
const ENGINE_TYPES = ['WebKit', 'Trident', 'Gecko', 'Presto']

// 浏览器类型
const BROWSER_TYPES = [
  'Safari', 'Chrome', 'Edge', 'IE', 'Firefox', 'Firefox Focus', 'Chromium', 'Opera', 'Vivaldi',
  'Yandex', 'Arora', 'Lunascape', 'QupZilla', 'Coc Coc', 'Kindle', 'Iceweasel', 'Konqueror',
  'Iceape', 'SeaMonkey', 'Epiphany', '360', '360SE', '360EE', 'UC', 'QQBrowser', 'QQ', 'Baidu',
  'Maxthon', 'Sogou', 'LBBROWSER', '2345Explorer', 'TheWorld', 'XiaoMi', 'Quark', 'Qiyu', 'Wechat',
  'WechatWork', 'Taobao', 'Alipay', 'Weibo', 'Douban', 'Suning', 'iQiYi'
]

// 操作类型
const OS_TYPES = [
  'Windows', 'Linux', 'Mac OS', 'Android', 'Ubuntu', 'FreeBSD', 'Debian', 'iOS',
  'Windows Phone', 'BlackBerry', 'MeeGo', 'Symbian', 'Chrome OS', 'WebOS'
]

// 设备类型
const DEVICE_TYPES = ['Mobile', 'Tablet', 'iPad']

function each(types: string[], u?: string) {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const map = supports(u)
  let result = ''
  let i = 0
  for (; i < types.length; i++) {
    if (map[types[i]]) {
      // 越往后的级别越高
      result = types[i]
    }
  }
  return result
}

function mime(option: string, value: string) {
  const mimeTypes = window.navigator && window.navigator.mimeTypes
  for (const key in mimeTypes) {
    if (mimeTypes[key][option] === value) {
      return true
    }
  }
  return false
}

/**
 * 获取设备横竖屏状态
 */
export function getOrientationStatu() {
  let orientationStatus = ''
  const orientation = window.matchMedia('(orientation: portrait)')
  if (orientation.matches) {
    // 竖屏
    orientationStatus = 'v'
  } else {
    // 横屏
    orientationStatus = 'h'
  }
  return orientationStatus
}

/**
 * 设备平台信息
 */
export function getOS(userAgent?: string) {
  return each(OS_TYPES, userAgent)
}

/**
 * 设备平台版本号
 */
export function getOSVersion(userAgent?: string) {
  const u = userAgent || getUserAgent()
  const os = getOS(u)
  const osVersion = {
    'Windows': function() {
      const v = u.replace(/^.*Windows NT ([\d.]+);.*$/, '$1')
      const oldWindowsVersionMap = {
        '6.4': '10',
        '6.3': '8.1',
        '6.2': '8',
        '6.1': '7',
        '6.0': 'Vista',
        '5.2': 'XP',
        '5.1': 'XP',
        '5.0': '2000'
      }
      return oldWindowsVersionMap[v] || v
    },
    'Android': function() {
      return u.replace(/^.*Android ([\d.]+);.*$/, '$1')
    },
    'iOS': function() {
      return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.')
    },
    'Debian': function() {
      return u.replace(/^.*Debian\/([\d.]+).*$/, '$1')
    },
    'Windows Phone': function() {
      return u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, '$2')
    },
    'Mac OS': function() {
      return u.replace(/^.*Mac OS X ([\d_]+).*$/, '$1').replace(/_/g, '.')
    },
    'WebOS': function() {
      return u.replace(/^.*hpwOS\/([\d.]+);.*$/, '$1')
    }
  }

  let result = ''
  if (osVersion[os]) {
    result = osVersion[os]()
    if (result === u) {
      result = ''
    }
  }
  return result
}

/**
 * 获取设备类型
 */
export function getDeviceType(userAgent?: string) {
  return each(DEVICE_TYPES, userAgent) || 'PC'
}

/**
 * 获取联网类型
 */
export function getLanguage(): string {
  // @ts-ignore
  return navigator && navigator.browserLanguage || navigator.language
}

export function getBrowserInfo(userAgent?: string) {
  const u = userAgent || getUserAgent()
  const match = supports()

  let is360 = false
  if (window.chrome) {
    const chromeVersion = +u.replace(/^.*Chrome\/([\d]+).*$/, '$1')
    if (chromeVersion > 36 && window.showModalDialog) {
      is360 = true
    } else if (chromeVersion > 45) {
      is360 = mime('type', 'application/vnd.chromium.remoting-viewer')
    }
  }

  if (is360) {
    if (mime('type', 'application/gameplugin')) {
      match['360SE'] = true
    } else if (window.navigator && typeof window.navigator['connection']['saveData'] === 'undefined') {
      match['360SE'] = true
    } else {
      match['360EE'] = true
    }
  }

  if (match['IE'] || match['Edge']) {
    const navigatorTop = window.screenTop - window.screenY
    switch (navigatorTop) {
      case 71: // 无收藏栏,贴边
        break
      case 74: // 无收藏栏,非贴边
        break
      case 99: // 有收藏栏,贴边
        break
      case 102: // 有收藏栏,非贴边
        match['360EE'] = true
        break
      case 75: // 无收藏栏,贴边
        break
      case 105: // 有收藏栏,贴边
        break
      case 104: // 有收藏栏,非贴边
        match['360SE'] = true
        break
      default:
        break
    }
  }

  const browerVersionMap = CreateBrowerVersionMap(u)
  let browser = each(BROWSER_TYPES, u)
  let engine = each(ENGINE_TYPES, u)
  let version = ''
  let browserVersion = ''

  if (browerVersionMap[browser]) {
    browserVersion = browerVersionMap[browser]()
    if (browserVersion === u) {
      browserVersion = ''
    }
  }
  if (browser === 'Chrome' && u.match(/\S+Browser/)) {
    browser = (u.match(/\S+Browser/) as string[])[0]
    version = u.replace(/^.*Browser\/([\d.]+).*$/, '$1')
  }
  if (browser === 'Edge') {
    if (version > '75') {
      engine = 'Blink'
    } else {
      engine = 'EdgeHTML'
    }
  }
  if (browser === 'Chrome' && parseInt(browserVersion) > 27) {
    engine = 'Blink'
  } else if (match['Chrome'] && engine === 'WebKit' && parseInt(browerVersionMap['Chrome']()) > 27) {
    engine = 'Blink'
  } else if (browser === 'Opera' && parseInt(version) > 12) {
    engine = 'Blink'
  } else if (browser === 'Yandex') {
    engine = 'Blink'
  }

  return {
    info: browser + '(版本: ' + browserVersion + ', 内核: ' + engine + ')',
    browser,
    engine,
    browserVersion,
  }
}

export function getDeviceInfo() {
  return {
    deviceType: getDeviceType(),
    OS: getOS(),
    OSVersion: getOSVersion(),
    language: getLanguage(),
    orientation: getOrientationStatu(),
    browserInfo: getBrowserInfo(),
  }
}
