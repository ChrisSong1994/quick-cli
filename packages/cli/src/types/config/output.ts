import type { CopyRspackPluginOptions, Externals } from '@rspack/core';
import { Rspack, RspackConfig } from './rspack';

export type BuildTarget = 'web' | 'node' | 'web-worker';

export type Polyfill = 'usage' | 'entry' | 'off';

export type SourceMap = RspackConfig['devtool'];

export interface OutputConfig {
  path?: string;
  publicPath?: string; // 静态资源前缀
  filename?: NonNullable<Rspack.Configuration['output']>['filename'];
  externals?: Externals;
  polyfill?: Polyfill;
  copy?: CopyRspackPluginOptions | CopyRspackPluginOptions['patterns'];
  sourceMap?: SourceMap; // 是否生成 source map
  sourceMapFilename: string;
}
