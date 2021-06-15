# eslint-plugin-zstark
js, ts eslint-plugin.

## 在项目中使用

在根目录下添加 .eslintrc.js
```js
module.exports = {
  extends: [require.resolve('@zstark/eslint-plugin-zstark')],
}
```

## script 命令
package.json中添加
```json
{
  "script": {
    "lint:fix": "eslint --fix --cache --ext .js,.jsx,.ts,.tsx,.vue ./src",
    "lint": "eslint --cache --ext .jsx,.js,.ts,.tsx,.vue packages",
  }
}
```

## vsCode IDE 中使用 eslint 格式化配置
```json
{
  "eslint.format.enable": true,
  "eslint.validate": ["html", "vue", "typescript", "tsx"],
}
```
