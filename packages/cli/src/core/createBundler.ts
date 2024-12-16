import { rspack } from '@rspack/core';
import type * as Rspack from '@rspack/core';
import chalk from 'chalk';

import { createVue3BuildConfigWithProd } from './config/vue3BuildConfig';
import { createReactBuildConfigWithProd } from './config/reactBuildConfig';
import { logger, formatStats } from '../utils';
import { CommonOptions, EAppType } from '../types';
export const createBundler = async (config: any, cliOptions: CommonOptions) => {
  let configWithProd;
  if (config.appType === EAppType.Vue3) {
    configWithProd = createVue3BuildConfigWithProd(config, cliOptions);
  }  else if (config.appType === EAppType.React) {
    configWithProd = createReactBuildConfigWithProd(config, cliOptions);
  }

  if (!configWithProd) {
    logger.error('暂不支持该类型项目');
    process.exit(1);
  }

  rspack(configWithProd, (error: any, stats: any) => {
    if (error || stats?.compilation?.errors?.length) {
      // 错误输出
      if (error) {
        logger.error(error.stack || error.message);
      } else {
        logger.log(stats?.toString({ colors: true, all: false, errors: true, warnings: true }));
      }
      process.exit(1);
    }

    const statusJson = (stats as Rspack.Stats)?.toJson({
      hash: false,
      modules: false,
      chunks: false,
    });
    const { total, content } = formatStats(statusJson);

    logger.log(stats.toString({ colors: true, all: false, errors: true, warnings: true }));
    logger.log(content);

    if (stats?.hasErrors()) {
      logger.error(' 打包失败');
    } else if (stats?.hasWarnings()) {
      logger.warn(
        '打包成功,但具有警告信息!',
        `共输出 ${chalk.yellow(total)} 个产物,耗时：${chalk.whiteBright((statusJson.time as number) / 1000)} s`,
      );
    } else {
      logger.success(
        '打包成功!',
        `共输出 ${chalk.yellow(total)} 个产物,耗时：${chalk.whiteBright((statusJson.time as number) / 1000)} s`,
      );
    }
  });
};
