import { rspack, DevServer } from '@rspack/core';
import { RspackDevServer } from '@rspack/dev-server';

import { createVue3BuildConfigWithDev } from './config/vue3BuildConfig';
import { createReactBuildConfigWithDev } from './config/reactBuildConfig';
import { CommonOptions, EAppType } from '../types';
import { logger } from '../utils';
export const createDevServer = async (config: any, cliOptions: CommonOptions) => {
  let configWithDev;
  if (config.appType === EAppType.Vue3) {
    configWithDev = createVue3BuildConfigWithDev(config, cliOptions);
  } else if (config.appType === EAppType.React) {
    configWithDev = createReactBuildConfigWithDev(config, cliOptions);
  }

  if (!configWithDev) {
    logger.error('暂不支持该类型项目');
    process.exit(1);
  }

  const compiler = rspack(configWithDev);
  const server = new RspackDevServer(
    {
      ...configWithDev.devServer,
      onListening: function (devServer: DevServer) {
        // 保留功能，未完待续..
      },
    },
    compiler,
  );

  await server.start();
};
