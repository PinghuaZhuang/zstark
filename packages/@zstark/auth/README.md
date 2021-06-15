# @zstart/auth

[![Build Status](https://travis-ci.org/PinghuaZhuang/zstark.svg?branch=master)](https://travis-ci.org/PinghuaZhuang/zstark) 

快速接入统一登录. 支持 cjs, umd, esm.



## 🚀 Quick Start

1. 安装依赖.

   ```bash
   yarn add @zstark/auth
   # 或者
   npm install @zstark/auth --save
   ```

2. 入口文件引入依赖.

   ```bash
   import zstarkAuth, { start, loginOut, login } from '@zstark/auth';
   ```

3. 启动.

   ```bash
   start();
   ```



## Example

```bash
npm run example
```

启动后访问 `http://localhost:8080/example/index.html`



## zstark

![image-20210422174751271](https://cdn.jsdelivr.net/gh/PinghuaZhuang/note@master/images/image-20210422174751271.70pefa8c3eo0.png)



## Methods

### start

启动.

+ path?: string; 自定义登录的路由. 默认值: '/login'. 要带上斜杠.
+ env?: string; 自定义环境变量. 默认内部自动判断是否是 'localdev' 和 'production'.
+ after?: Fucntion; 登录成功的钩子. 可以自定义登录后跳转. 默认调整到根目录.
  + 参数: e: { from: 调整前路由, to: 跳转到目标路由(登录), userid, username, token }
+ before?: Fucntion; 调整前.
  + 参数: e: { from: 调整前路由, to: 跳转到目标路由(登录) }
+ onLogin?: (next, options) => void; 执行 login 后跳转触发
+ onLoginOut?: (next, options) => void; 执行 loginOut 后触发

### login

登录.

+ params?: object | boolean | string; 为true的时候直接跳转到统一登录. 否则校验是否存在 `token`, params为路由参数(string的使用是query参数).
+ state?: object; 当params为true时, 替代params, 路由参数.

### loginOut

清除掉 `token` 后, 退出登录, 跳转到统一登录.

+ params?: object | string; 路由参数(string的使用是query参数).

### zstarkAuth.getUserInfo

获取用户基本信息.

### zstarkAuth.getUserInfoAll

`@return Promise<ApiResult<UserInfo>>`

获取用户详细信息

### zstarkAuth.getProjectId

`@return Promise<number|null>`

`@example zstarkAuth.getProjectId('operation', { k: 'wnl' }).then(projectId => console.log('projectId', projectId))`

获取项目ID, 项目ID需要后台在EHR菜单中配置. 默认为null.
