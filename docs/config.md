## 使用

 使用 ` @fett/quick-cli`的项目需要在根目录创建配置文件 `quick.config.js` ，其目前仅支持 `cjs` 语法，quick-cli 内置了基础配置，以及结合应用模版的目录结构，基本可以实现最小配置化原则（虽然失去了部分灵活性，但是对于团队内构建开发规范，”**约定大于配置**” 是很重要的）；

> quick config 不会像 vite、webpack或者rspack 这些工具开发所有的配置，那会让项目的配置非常繁琐且不统一，quick 会默认支持一部分配置，例如热更新、产物 hash、产物压缩和优化等；开发时仅需要配置 server 和部分输出配置即可；例如 ,如下是一个微应用的 quick config 配置；

```javascript
const pkg = require("./package.json");
const DEFAULT_OSS_DOMAIN = "webdev.yugu.net.cn";
const isDev = process.env.NODE_ENV === "development";
const OSS_DOMAIN = process.env.OSS_DOMAIN || DEFAULT_OSS_DOMAIN;

module.exports = () => {
  return {
    appType: "react",
    output: {
      // 默认拷贝到 dist
      publicPath: isDev
        ? "/"
        : `https://${OSS_DOMAIN}/${pkg.key}/${pkg.version}`,
    },
    // 开发配置
    server: {
      port: 4002,
      mock:true,
      host: "local.xxxx.com",
      proxy: [
        {
          context: ["/web_console_api"],
          target: "https://xxxx.xxxx.com",
          changeOrigin: true,
        },
      ],
    },
  };
};


```

### 目录约定

一个基于 quick 创建的项目目录约定如下：

```text
web-admin-template
├─ dist             # 构建产物产出目录


├─ mock             # mock 文件夹
│  ├─ data   
│  │  ├─ getAppList.json

│  ├─ index.js      # mock api 定义
│  └─ utils.js      # mock 辅助工具
├─ public           # 静态资源文件夹，

├─ src              # 项目资源文件夹，包含主要业务代码
     
│  ├─ api           # api 定义

│  ├─ assets        # 静态资源，包含：图片、图标、样式文件等

│  ├─ components    # 公共组件

│  ├─ constants     # 常量定义，包含业务常量、枚举、全局事件、环境变量等等



│  ├─ hooks         # hooks 文件夹


│  ├─ layout        # 项目布局文件夹

│  ├─ pages         # 页面文件夹
│  ├─ router        # 路由定义
│  ├─ store         # 全局状态管理

│  ├─ types         # 类型文件，涉及到全局的类型放在这里

│  └─ utils         # 工具文件夹，通用工具嘴好使用 
│  ├─ index.d.ts    # ts 全局类型声明   
│  ├─ index.ts      # 项目入口文件
├─ package.json     # 包配置  
├─ pnpm-lock.yaml   # 依赖版本锁文件，取决于使用的安装工具
├─ quick.config.js  # quick-cli 配置文件，定义本地服务和构建配置
├─ .gitignore       # gitignore 
├─ .npmrc           # npm 配置文件 
├─ README.md        # 项目文档
├─ index.html       # 项目静态 html 模版
└─ tsconfig.json    # ts 配置文件 
```

**注意⚠️**：项目目录规范有部分约定文件或目录如下

- **public**:  是quick-cli 默认的静态资源文件夹，默认作为本地静态服务根目录启动开发服务，执行`quick build` 构建后资源会复制到dist目录；

- **dist**: 是quick 的默认产物输出；

- **mock**：是 quick 默认 mock 服务文件夹，quick 会先找到 mock/index.js 添加 mock接口；

- **index.ts/index.tsx**: 分别是 vue项目和react 项目的默认入口文件；

- **package.json**: 微服务应用务必要配置 key 和 version字段；

### quick 命令

quick-cli 支持以下几种命令，覆盖应用本地开发的整个生命周期，如下：

- `create` : 执行 qucik create <project-name> 可以基于提示创建一个quick 模版项目

- `serve`  ：在根目录下执行 `quick serve` 命令开启本地开发服务；

- `build` ：在根目录下执行 `quick build` 进行项目的生产构建，可以添加 `--analyze` 查看构建产物依赖和大小分析；

- `zip` ：执行 `quick zip` 命令，默认会把该目录下的 `dist` 目录打包成压缩文件 `dist.zip` 用于在 `quick 应用发布平台` 上传产物发布；

    - 所有需要打 zip 包的项目可以使用 quick-cli 的 zip 命令，可以不走流水线构建， 使用方式：`quick zip -t  <project-name>.zip  -s dist` 增加 `-f` 可以强制更新同文件夹下的同名zip 包; ** @fett/quick-cli@0.0.8 支持   ** 

- `inspect` :  在根目录下执行 `quick inspect` 可以在控制台输出原始 `Rspack` 配置信息，用于进行`qucik` 配置文件调试，如下


# 配置项

## root

- 类型: `String` 

- 默认值： `process.cwd()` 

指定程序运行的目录，默认当前程序运行目录



## platform

- 类型: `browser | mobile`  

- 默认值： `browser` 

运行平台类型，默认浏览器环境，支持移动端环境构建，区别在于 浏览器内核支持版本不同，如下

```javascript
//  browser 支持浏览器版本
export const webBrowserslist = [
  'chrome >= 87',
  'edge >= 88',
  'firefox >= 78',
  'safari >= 14',
  'not dead',
];

// mobile 支持浏览器版本
export const h5Browserslist = [
  'Android >= 5',
  'iOS >= 9',
  'ChromeAndroid >= 50',
  'Safari >= 9',
  'not dead',
];
```



## appType

- 类型: `react | vue3`  

- 默认值： `react` 
支持 vue3 和 react 项目，默认为 react·

## source

资源文件解析等配置

### source.alias

- 类型: `Record<string, false | string | (string | false)[]>` 

- 默认值： `{"@": "./src"}` 

路径别名，例如：

```javascript
{
  "@": path.resolve(__dirname, './src'),
  "abc$": path.resolve(__dirname, './src/abc')
}
```

### source.extensions

- 类型: `String[]` 

- 默认值： `['.vue', '.js', '.jsx', '.ts', '.tsx', '.json']` 

按照顺序解析模块

### source.define

- 类型: `Record<string,any>` 

- 默认值： `{}`  

定义全局的

### source.entry

- 类型: `Record<string,any>` 

- 默认值： `{ "index":"./src/index.ts" }`  

用于设置 Rspack 构建的入口，默认为单页面入口，基于 appType 配置默认改变，如：

- Vue3: `{ "index":"./src/index.ts" }`

- React:`{ "index":"./src/index.tsx" }`



## output

产物输出配置，改变输出产物中的配置项

### output.path

- 类型: `String` 

- 默认值： `"./dist"` 

产物默认输出目录  

### output.publicPath

- 类型: `String` 

- 默认值： `"auto"`  

静态资源构建后的前缀名，默认是相对于当前文件夹的相对路径，可以增加cdn域名路径设置成绝对路径，**微服务应用发布必须要 cdn域名前缀；例如**

```javascript
{
 output: {
      // 默认拷贝到 dist
      publicPath: isDev
        ? "/"
        : `https://${OSS_DOMAIN}/${pkg.key}/${pkg.version}`,
    },
}

```

### output.filename

- 类型: `String` 

- 默认值：开发环境： `[name].js` 生产环境： `[name].[hash:8].js` 

输出文件名称,开发由于使用 `hmr` 不能动态改变输出文件名，生产环境构建需要考虑浏览器缓存需要增加 `文件hash 值` ；

### output.externals

- 类型： 参考 [__Rspack.externals__](https://rspack.dev/zh/config/externals)

- 默认值：`{}` 

外部依赖：该选项提供了「从输出的 bundle 中排除依赖」的方法, 可以把三方库使用 `script` 引用 `cdn链接`  而不用每次打包到产物中；

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
```

### output.sourceMap

- 类型： 参考 [__Rspack.devtool__](https://rspack.dev/zh/config/devtool)

- 默认值：开发环境：`cheap-module-source-map`   生产环境：`hidden-source-map`  

构建时控制 Source Map 的生成行为，用于开发调试；

注意：开发环境默认 `hidden-source-map` 模式，在 quick 发布平台可以上传 sourcemap 资源，线上调试的时候手动添加 sourceMap 链接即可；



### output.copy

- 类型：`Array<{from:string,to:string}>` 

- 默认值：`[{ from: './package.json' }]` 

构建产物完成后，执行文件拷贝的配置，默认拷贝到 `dist` 文件夹；



## server

本地开发服务配置项，开发环境默认热更新；

### server.mock

- 类型: `boolean` 

- 默认值：`false` 

是否开启 mock，开启后需要在根目录下创建`mock/index.js` 文件，`quick-cli` 会解析该文件，创建 mock 接口；（当前 `mock/index.js` 仅支持 cjs 模块），例如

![](https://tcs-devops.aliyuncs.com/storage/113b50f8723ea9f43dd52eef2f4c4afdbee4?Signature=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcHBJRCI6IjVlNzQ4MmQ2MjE1MjJiZDVjN2Y5YjMzNSIsIl9hcHBJZCI6IjVlNzQ4MmQ2MjE1MjJiZDVjN2Y5YjMzNSIsIl9vcmdhbml6YXRpb25JZCI6IiIsImV4cCI6MTczNDkxNDgwNywiaWF0IjoxNzM0MzEwMDA3LCJyZXNvdXJjZSI6Ii9zdG9yYWdlLzExM2I1MGY4NzIzZWE5ZjQzZGQ1MmVlZjJmNGM0YWZkYmVlNCJ9.ozQpMPB0k_21nwVBv7L66QtUKBFx-7Bo5fkTr_f_jmo&download=image.png "")

### server.port

- 类型：`number` 

- 默认值：`4000` 

本地服务端口号

### server.host

- 类型：`string` 

- 默认值：`127.0.0.1` 

本地服务主机名，注意，微服务应用开发，登录态使用cookie存储，本地开发需要设置同开发环境主域名相同域名，例如：

```text
host: "local.xxxx.com"
```

### server.open

- 类型: `boolean` 

- 默认值：`false` 

是否每次 `devServer` 运行默认打开浏览器；

### server.headers

- 类型: `Record<string,string>`  

- 默认值：{'Access-Control-Allow-Origin': '*', // 支持本地微服务跨域请求} 

本地服务请求 headers 设置

### server.proxy

- 类型: 参考 [__Rspack.devServer.proxy__](https://webpack.js.org/configuration/dev-server/#devserverproxy) 

- 默认值：`[]` 

开启本地开发服务时，同时使用  [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)  开启接口代理，提供本地开发调用开发环境接口服务或者生产环境接口服务等能力，例如：

```javascript
{
 proxy: [
        {
          context: ["/web_console_api"],
          target: "https://xxxx.xxxx.com",
          changeOrigin: true,
        }
      ]
}
```

## chainConfig（未完待续）

- 类型：`function` 

- 默认值：`()=>{}` 

可以通过`webpack-chain` 工具链式调用方法修改原始 `rspack` 配置；

