# @zstark/describe-bridge

[![Build Status](https://travis-ci.com/PinghuaZhuang/zstark.svg?branch=master)](https://travis-ci.com/PinghuaZhuang/zstark)  [![NPM](https://img.shields.io/npm/v/@zstark/device)](https://www.npmjs.com/package/@zstark/describe-bridge)

获取浏览器以及设备的信息. 360浏览器识别的不是很准.



## 🚀 Quick Start

```bash
yarn add @zstark/describe-bridge
```

```js
import createDes() from '@zstark/describe-bridge'
```

```html
<script src="https://cdn.jsdelivr.net/npm/@zstark/describe-bridge@0.1.0/lib/index.min.js"></script>
```

```js
var des = createDes(window, test, console.log)
des.first(1).name(2).end()

// => {first: 1, name: 2}
```
