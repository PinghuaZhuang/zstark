export const inBrowser: boolean = typeof window !== 'undefined'

export const supportsPushState: boolean =
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

export interface Surpport {
  inBrowser: boolean;
  pushState: boolean;
  browser?: Browser;
}

export interface Browser {
  version: {
    trident: boolean; // IE
    presto: boolean; // opera
    webKit: boolean; // chrome
    gecko: boolean; // firfox
    safari: boolean; // safari
    mobile: boolean; // 是否为移动终端
    ios: boolean; // ios 客户端
    android: boolean; // 安卓
    iPhone: boolean; // 苹果手机
    iPad: boolean; // ipad
  };
  language: string; // 浏览器语言
}

const surpport: Surpport = {
  inBrowser, // 是否在浏览器环境中
  pushState: supportsPushState, // 是否支持 history.pushState
}

if (inBrowser) {
  const { userAgent } = navigator

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
  }
}

export { surpport }
