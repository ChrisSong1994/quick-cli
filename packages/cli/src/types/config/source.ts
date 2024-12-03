import type { EntryDescription } from '@rspack/core';
import type { ConfigChain } from '../utils';

export type Alias = Record<string, string | false | (string | false)[]>;
export type Define = Record<string, any>;

export interface SourceConfig {
  alias?: ConfigChain<Alias>; // 别名
  extensions?: string[]; // 扩展名
  define?: Define; // 全局变量
  entry?: Record<string, string | string[] | EntryDescription>; // 入口文件
  style?: {
    less: boolean;
    sass: boolean;
  };
}
