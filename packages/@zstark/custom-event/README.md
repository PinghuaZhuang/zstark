# @zstark/custom-event

[![Build Status](https://travis-ci.org/PinghuaZhuang/zstark.svg?branch=master)](https://travis-ci.org/PinghuaZhuang/zstark) [![NPM](https://img.shields.io/npm/v/@zstark/custom-event)](https://www.npmjs.com/package/@zstark/custom-event)

自定义事件.



## 📰 Example

```typescript
import { EventAbs, SensorAbs } from '@zstark/custom-event'

interface TrackClickParams {
  type: string;
  params: object;
}

class TrackClickEvent extends EventAbs<TrackClickParams> {
  public static readonly type: string = 'track-click'
}

class TrackClick extends SensorAbs<TrackClickEvent> {
  public attach() {
    document.addEventListener('click', this.handleClick.bind(this))
  }
  public detach() {
    document.removeEventListener('click', this.handleClick.bind(this))
  }

  protected handleClick(e: Event) {
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

      this.trigger(this.containers[0], new TrackClickEvent({
        type: trackType,
        params: trackParams,
      }))
    }
  }
}

const instance = new TrackClick(document.body)
// 注册事件
instance.on(e => {
  // do something...
  console.log('e:', e.detail.type, e.detail.params)
})
// 添加事件
instance.attach()
```

