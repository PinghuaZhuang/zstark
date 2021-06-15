/**
 * 全屏( 绑定了 F11 键 )
 * @example 整个页面: requestFullScreen( document.documentElement );
 * @example 某个元素: requestFullScreen( document.querySelect( '' ) )
 * @param { Dom } element 需要全屏的对象
 */
export function requestFullScreen(element?: HTMLElement) {
  element = element || document.documentElement

  const requestMethod =
    // @ts-ignore
    element.requestFullScreen ||
    // @ts-ignore
    element.webkitRequestFullScreen ||
    // @ts-ignore
    element.mozRequestFullScreen ||
    // @ts-ignore
    element.msRequestFullScreen

  if (requestMethod) {
    requestMethod.call(element)
    // @ts-ignore
  } else if (typeof window.ActiveXObject !== 'undefined') {
    // @ts-ignore
    const wscript = new ActiveXObject('WScript.Shell')
    if (wscript !== null) {
      wscript.SendKeys('{F11}')
    }
  }
}

/**
 * 退出全屏( 绑定了 F11 键 )
 */
export function exitFullScreen() {
  // 判断各种浏览器，找到正确的方法
  const exitMethod =
    document.exitFullscreen || // W3C
    // @ts-ignore
    document.mozCancelFullScreen || // Chrome等
    // @ts-ignore
    document.webkitExitFullscreen || // FireFox
    // @ts-ignore
    document.webkitExitFullscreen // IE11
  if (exitMethod) {
    exitMethod.call(document)
    // @ts-ignore
  } else if (typeof window.ActiveXObject !== 'undefined') {
    // @ts-ignore
    const wscript = new ActiveXObject('WScript.Shell')
    if (wscript !== null) {
      wscript.SendKeys('{F11}')
    }
  }
}
