# @zstark/eslint-plugin-zstark

[![Build Status](https://travis-ci.com/PinghuaZhuang/zstark.svg?branch=master)](https://travis-ci.com/PinghuaZhuang/zstark)  [![NPM](https://img.shields.io/npm/v/@zstark/eslint-plugin-zstark)](https://www.npmjs.com/package/@zstark/eslint-plugin-zstark)


js, ts eslint-plugin.



## 🚀 Quick Start

1. 安装依赖.

   ```bash
   yarn add @zstark/eslint-plugin-zstark
   # 或者
   npm install @zstark/eslint-plugin-zstark --save
   ```


2. 在根目录下添加 .eslintrc.js

   ```js
   module.exports = {
     extends: [require.resolve('@zstark/eslint-plugin-zstark')],
   }
   ```



## 🔖 script 命令

package.json中添加
```json
{
  "script": {
    "lint:fix": "eslint --fix --cache --ext .js,.jsx,.ts,.tsx,.vue ./src",
    "lint": "eslint --cache --ext .jsx,.js,.ts,.tsx,.vue packages",
  }
}
```



## 🔖 vs-code IDE 中使用 eslint 格式化配置

```json
{
  "eslint.format.enable": true,
  "eslint.validate": ["typescript"],
}
```
