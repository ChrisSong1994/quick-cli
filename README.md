# @chrissong/quick-cli

前端脚手架工具，基于 [rspack](https://github.com/web-infra-dev/rspack) 实现底层项目的构建能力和开发服务等；

- [ ] 项目创建：h5、npm包、web 端等等；
- [x] 支持针对C端 h5 项目和 web 端不同浏览器兼容性配置；
- [ ] 支持集成 github 项目模版，一键创建项目；
- [x] 项目本地构建，支持 react 和 vue3 ；
- [ ] 支持 ts 、eslint、prettier 等；
- [ ] 支持 svg 组件化引入
- [x] 支持 less、sass 等预处理器
- [x] 支持 css module
- [x] 支持环境变量参数
- [x] 支持 mock 配置

## 使用

```sh
## 全局安装
npm i -g @chrissong/quick-cli

## 创建项目
quick create vue-app
cd vue-app

## 本地开发
quick dev

## 打包构建
quick build

```

## 配置
命令行配置文件 `quick.config.js` 将会在项目根目录下创建，配置项如下：
