# @fett/quick-cli

前端脚手架工具，基于 [rspack](https://github.com/web-infra-dev/rspack) 实现底层项目的构建能力和开发服务等；

- [ ] 项目创建：h5、npm包、web 端等等；
- [x] 支持针对C端 h5 项目和 web 端不同浏览器兼容性配置；
- [ ] 支持集成 github 项目模版，一键创建项目；
- [x] 项目本地构建，支持 react 和 vue3 ；
- [ ] 支持 ts 、eslint、prettier 等；
- [x] 支持 svg 组件化引入
- [x] 支持 less、sass 等预处理器
- [x] 支持 css module
- [x] 支持环境变量参数
- [x] 支持 mock 配置

## 使用

**前置条件：需要 Node.js >= 18 的 lts版本**

```sh
## 全局安装
npm i -g @fett/quick-cli

## 创建项目
quick create vue-app
cd vue-app

## 本地开发
quick dev

## 打包构建
quick build

## 打成压缩包
qucik zip -t dist.zip -s dist -f

## 检出 rspack 配置
quick inspect
```
