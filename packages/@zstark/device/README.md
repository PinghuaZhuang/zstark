# @zstark/device

[![Build Status](https://travis-ci.com/PinghuaZhuang/zstark.svg?branch=master)](https://travis-ci.com/PinghuaZhuang/zstark)  [![NPM](https://img.shields.io/npm/v/@zstark/device)](https://www.npmjs.com/package/@zstark/device)

获取浏览器以及设备的信息. 360浏览器识别的不是很准.



## 🚀 Quick Start

```bash
yarn add @zstark/device
```

```js
import { getDeviceInfo } from '@zstark/device'
```

```html
<script src="https://cdn.jsdelivr.net/npm/@zstark/device@1.0.0/lib/index.min.js"></script>
```

```js
device.getDeviceInfo()
/*
{
  "deviceType": "PC",
  "OS": "Windows",
  "OSVersion": "10.0",
  "language": "zh-CN",
  "orientation": "h",
  "browserInfo": {
    "info": "Chrome(版本: 91.0.4472.114, 内核: Blink)",
    "browser": "Chrome",
    "engine": "Blink",
    "browserVersion": "91.0.4472.114"
  }
}
*/
```



## 🎃 Methods

### getOrientationStatu

获取设备横竖屏状态.

```js
// v: 竖屏, h: 横屏
device.getOrientationStatu() // => "v"
```

### getOS

获取设备平台信息.

```js
device.getOS(/* userAgent?: string */) // => "Windows"
```

### getOSVersion

获取设备平台版本号.

```js
device.getOSVersion(/* userAgent?: string */) // => "10.0"
```

### getDeviceType

获取设备类型.

```js
device.getDeviceType(/* userAgent?: string */) // => "mobile"
```

### getLanguage

获取设备语言.

```js
device.getLanguage() // => "zh-CN"
```

### getBrowserInfo

获取设备信息. 包含上面所有信息. 

```js
device.getLanguage(/* userAgent?: string */) 
/*
{
  "deviceType": "PC",
  "OS": "Windows",
  "OSVersion": "10.0",
  "language": "zh-CN",
  "orientation": "h",
  "browserInfo": {
    "info": "Chrome(版本: 91.0.4472.114, 内核: Blink)",
    "browser": "Chrome",
    "engine": "Blink",
    "browserVersion": "91.0.4472.114"
  }
}
*/
```

