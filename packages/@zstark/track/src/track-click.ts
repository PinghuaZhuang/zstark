/**
 * @file 全局代理点击事件
 * @type track-click
 */
import { addEventListener/* , removeEventListener */, trackEmit } from './utils'

interface TrackClickParams {
  type: string;
  params: object;
}

const handleClick = function(e: MouseEvent) {
  const target = e.target
  if (target && target instanceof Element) {
    const trackParamsStr = target.getAttribute('track-click')

    if (trackParamsStr == null) {
      console.error(`<<< track-click attribute error. target:`, target)
      return
    }

    let trackParamsParse: TrackClickParams | string = ''

    try {
      // to TrackClickParams
      trackParamsParse = JSON.parse(trackParamsStr)
    } catch (error) { /* empty... */ }

    let trackType: string
    let trackParams: object

    if (typeof trackParamsParse === 'string') {
      trackType = trackParamsParse
      trackParams = {}
    } else {
      trackType = trackParamsParse.type
      trackParams = trackParamsParse.params
    }

    trackEmit(trackType, trackParams)
    // or custom event
  }
}

addEventListener('click', handleClick)
