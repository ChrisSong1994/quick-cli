import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Options as BaseProxyOptions, Filter as ProxyFilter } from 'http-proxy-middleware';
import type { DevServer } from '@rspack/core';

export type ProxyDetail = BaseProxyOptions & {
  bypass?: (
    req: IncomingMessage,
    res: ServerResponse,
    proxyOptions: ProxyOptions,
  ) => string | undefined | null | boolean;
  context?: ProxyFilter;
};

export type ProxyOptions =
  | Record<string, string>
  | Record<string, ProxyDetail>
  | ProxyDetail[]
  | ProxyDetail;

export interface ServerConfig {
  mock?: boolean; // 是否开启mock
  hmr?: boolean; // 是否开启 hmr
  watchFiles: DevServer['watchFiles']; // 监听未被应用的文件模块实现服务热更新
  port?: number; // 端口
  host?: string; // 监听地址
  historyApiFallback?: DevServer['historyApiFallback']; // 支持html fallback 模式 browser 路由
  open?: boolean; // 在浏览器打开
  proxy?: ProxyOptions; // 配置代理项
  headers?: Record<string, string>;
  static?: DevServer['static']; //用于配置是否从一些目录（默认为 'public'）启用静态服务器。
  allowedHosts?: DevServer['allowedHosts'];
}
