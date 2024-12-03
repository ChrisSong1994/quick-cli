import RspackChain from 'rspack-chain';
import chalk from 'chalk';
import {
  createVue3BuildConfigWithDev,
  createVue3BuildConfigWithProd,
} from './config/vue3BuildConfig';
import {
  createVue2BuildConfigWithDev,
  createVue2BuildConfigWithProd,
} from './config/vue2BuildConfig';
import {
  createReactBuildConfigWithDev,
  createReactBuildConfigWithProd,
} from './config/reactBuildConfig';
import { CommonOptions, EAppType } from '../types';
import { logger } from '../utils';

const stringify = RspackChain.toString as (
  config: unknown,
  options: { verbose?: boolean },
) => string;
export const inspectConfig = async (config: any, cliOptions: CommonOptions) => {
  let rspackConfig;
  if (config.appType === EAppType.Vue3) {
    if (cliOptions.mode === 'production') {
      rspackConfig = createVue3BuildConfigWithProd(config, cliOptions);
    } else {
      rspackConfig = createVue3BuildConfigWithDev(config, cliOptions);
    }
  }

  if (config.appType === EAppType.Vue2) {
    if (cliOptions.mode === 'production') {
      rspackConfig = createVue2BuildConfigWithProd(config, cliOptions);
    } else {
      rspackConfig = createVue2BuildConfigWithDev(config, cliOptions);
    }
  }

  if (config.appType === EAppType.React) {
    if (cliOptions.mode === 'production') {
      rspackConfig = createReactBuildConfigWithProd(config, cliOptions);
    } else {
      rspackConfig = createReactBuildConfigWithDev(config, cliOptions);
    }
  }

  if (!rspackConfig) {
    logger.error('暂不支持该类型项目');
    process.exit(1);
  }

  const result = stringify(rspackConfig, { verbose: true });
  logger.log(chalk.bgBlue('Rspack 配置信息：'), chalk.greenBright(result));
};
