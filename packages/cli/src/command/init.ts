/**
 * 创建构造实例：开发、构建
 */

import { loadConfig } from '../utils';
import { createDevServer, createBundler, inspectConfig } from '../core';
import { CommonOptions } from '../types';

export async function init({ cliOptions }: { cliOptions: CommonOptions }) {
  // 初始化 repack 实例对象
  const config: any = await loadConfig({ root: process.cwd() });

  return {
    createDevServer: () => {
      return createDevServer(config.content, cliOptions);
    },
    createBundler: () => {
      return createBundler(config.content, cliOptions);
    },
    inspectConfig: () => {
      return inspectConfig(config.content, cliOptions);
    },
  };
}
