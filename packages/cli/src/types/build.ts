import { RspackConfig } from './config/rspack';
import { ServerConfig } from './config/server';
import { OutputConfig } from './config/output';
import { SourceConfig } from './config/source';

export enum EAppType {
  Vue3 = 'vue3',
  Vue2 = 'vue2',
  React = 'react',
}

export enum EMode {
  development = 'development',
  production = 'production',
}

export enum EPlatform {
  browser = 'browser',
  mobile = 'mobile',
}
export interface QucikConfig {
  root: string;
  appType?: EAppType;
  platform?: EPlatform;
  stats?: RspackConfig['stats'];
  mode?: EMode;
  output?: OutputConfig;
  server?: ServerConfig;
  source?: SourceConfig;
  optimization?: RspackConfig['optimization'];
  plugins?: RspackConfig['plugins'];
  module?: RspackConfig['module'];
}
