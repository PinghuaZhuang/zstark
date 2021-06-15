import { addEventListener/* , removeEventListener */, trackEmit } from './utils'

interface TrackClickParams {
  type: string;
  params: object;
}

const handleClick = function(e: MouseEvent) {
  const target = e.target
  if (target && target instanceof Element) {
    let trackParamsStr: unknown = target.getAttribute('track-click')

    if (trackParamsStr == null) {
      console.error(`<<< track-click attribute error. target:`, target)
      return
    }

    try {
      // to TrackClickParams
      trackParamsStr = JSON.parse(trackParamsStr as string)
    } catch (error) { /* empty... */ }

    let trackType: string
    let trackParams: object

    // const trackType = typeof trackParams === 'string' ? trackParams : (trackParams as TrackClickParams).type
    if (typeof trackParamsStr === 'string') {
      trackType = trackParamsStr
      trackParams = {}
    } else {
      trackType = (trackParamsStr as TrackClickParams).type
      trackParams = (trackParamsStr as TrackClickParams).params
    }

    trackEmit(trackType, trackParams)
  }
}

addEventListener('click', handleClick)
