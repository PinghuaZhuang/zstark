const inUniapp = !!uni

let addEventListener = document.addEventListener
let removeEventListener = document.removeEventListener
let querySelector = document.querySelector

if (inUniapp) {
  // https://uniapp.dcloud.io/use-html5plus?id=uni-app-%e4%b8%ad%e7%9a%84%e4%ba%8b%e4%bb%b6%e7%9b%91%e5%90%ac
  addEventListener = plus.globalEvent.addEventListener
  removeEventListener = plus.globalEvent.removeEventListener

  querySelector = uni.createSelectorQuery
}

export { addEventListener, removeEventListener }

export { querySelector }

export const trackEmit = function(type: string, params?: object) {
  TRACK && TRACK[type](params)
}
