import getUserAgent from './getUserAgent'

export default function supports(userAgent?: string) {
  const u = userAgent || getUserAgent()

  // 缓存结果
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  if (supports[u]) return supports[u] as typeof result

  const isChrome = u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1
  const isOpera = u.indexOf('Opera') > -1 || u.indexOf('OPR') > -1
  const isIPad = u.indexOf('iPad') > -1
  const result = {
    // 内核
    'Trident': u.indexOf('Trident') > -1 || u.indexOf('NET CLR') > -1,
    'Presto': u.indexOf('Presto') > -1,
    'WebKit': u.indexOf('AppleWebKit') > -1,
    'Gecko': u.indexOf('Gecko/') > -1,

    // 浏览器
    'Safari': u.indexOf('Safari') > -1 && !isChrome,
    'Chrome': isChrome,
    'IE': u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
    'Edge': /Edge?/.test(u),
    'Firefox': u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1,
    'Firefox Focus': u.indexOf('Focus') > -1,
    'Chromium': u.indexOf('Chromium') > -1,
    'Opera': isOpera,
    'Vivaldi': u.indexOf('Vivaldi') > -1,
    'Yandex': u.indexOf('YaBrowser') > -1,
    'Arora': u.indexOf('Arora') > -1,
    'Lunascape': u.indexOf('Lunascape') > -1,
    'QupZilla': u.indexOf('QupZilla') > -1,
    'Coc Coc': u.indexOf('coc_coc_browser') > -1,
    'Kindle': u.indexOf('Kindle') > -1 || u.indexOf('Silk/') > -1,
    'Iceweasel': u.indexOf('Iceweasel') > -1,
    'Konqueror': u.indexOf('Konqueror') > -1,
    'Iceape': u.indexOf('Iceape') > -1,
    'SeaMonkey': u.indexOf('SeaMonkey') > -1,
    'Epiphany': u.indexOf('Epiphany') > -1,
    '360': u.indexOf('QihooBrowser') > -1 || u.indexOf('QHBrowser') > -1,
    '360EE': u.indexOf('360EE') > -1,
    '360SE': u.indexOf('360SE') > -1,
    'UC': u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
    'QQBrowser': u.indexOf('QQBrowser') > -1,
    'QQ': u.indexOf('QQ/') > -1,
    'Baidu': u.indexOf('Baidu') > -1 || u.indexOf('BIDUBrowser') > -1 && !isOpera,
    'Maxthon': u.indexOf('Maxthon') > -1,
    'Sogou': u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1,
    'LBBROWSER': u.indexOf('LBBROWSER') > -1 || u.indexOf('LieBaoFast') > -1,
    '2345Explorer': u.indexOf('2345Explorer') > -1,
    'TheWorld': u.indexOf('TheWorld') > -1,
    'XiaoMi': u.indexOf('MiuiBrowser') > -1,
    'Quark': u.indexOf('Quark') > -1,
    'Qiyu': u.indexOf('Qiyu') > -1,
    'Wechat': u.indexOf('MicroMessenger') > -1,
    'WechatWork': u.indexOf('wxwork/') > -1,
    'Taobao': u.indexOf('AliApp(TB') > -1,
    'Alipay': u.indexOf('AliApp(AP') > -1,
    'Weibo': u.indexOf('Weibo') > -1,
    'Douban': u.indexOf('com.douban.frodo') > -1,
    'Suning': u.indexOf('SNEBUY-APP') > -1,
    'iQiYi': u.indexOf('IqiyiApp') > -1,

    // 系统或平台
    'Windows': u.indexOf('Windows') > -1,
    'Linux': u.indexOf('Linux') > -1 || u.indexOf('X11') > -1,
    'Mac OS': u.indexOf('Macintosh') > -1,
    'Android': u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
    'Ubuntu': u.indexOf('Ubuntu') > -1,
    'FreeBSD': u.indexOf('FreeBSD') > -1,
    'Debian': u.indexOf('Debian') > -1,
    'Windows Phone': u.indexOf('IEMobile') > -1 || u.indexOf('Windows Phone') > -1,
    'BlackBerry': u.indexOf('BlackBerry') > -1 || u.indexOf('RIM') > -1,
    'MeeGo': u.indexOf('MeeGo') > -1,
    'Symbian': u.indexOf('Symbian') > -1,
    'iOS': u.indexOf('like Mac OS X') > -1,
    'Chrome OS': u.indexOf('CrOS') > -1,
    'WebOS': u.indexOf('hpwOS') > -1,

    // 设备
    'Mobile': u.indexOf('Mobi') > -1 || u.indexOf('iPh') > -1 || u.indexOf('480') > -1 && !isIPad,
    'Tablet': u.indexOf('Tablet') > -1 || u.indexOf('Nexus 7') > -1,
    'iPad': isIPad,
  }

  supports[u] = result
  return result
}
