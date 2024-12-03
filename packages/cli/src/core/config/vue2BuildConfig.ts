/**
 * vue2 构建配置
 */

import { VueLoaderPlugin } from 'vue-loader15';
import _ from 'lodash';

import { QucikConfig, CommonOptions } from '../../types';
import { createBaseConfig } from './createBaseConfig';

const VUE_DEFAULT_DEFINE = {};
const config: any = (customConfig: QucikConfig, cliOptions: CommonOptions) => {
  const vue2Config = {
    ...customConfig,
    source: {
      ...customConfig.source,
      define: {
        ...VUE_DEFAULT_DEFINE,
        ...(customConfig.source?.define || {}),
      },
    },
    module: {
      ...customConfig.module,
      rules: [
        ...(customConfig.module?.rules || []),
        {
          test: /\.vue$/,
          use: {
            loader: require.resolve('vue-loader15'), 
            options: {
              experimentalInlineMatchResource: true,
              compilerOptions: { preserveWhitespace: false },
            },
          },
        },
        {
          test: /\.(jsx|tsx|js|ts)$/,
          exclude: /node_modules/,
          use: [
            require.resolve('thread-loader'),
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    require.resolve('@babel/preset-typescript'),
                    { isTSX: true, allExtensions: true },
                  ],
                  [require.resolve('@vue/babel-preset-jsx'), { compositionAPI: true }],
                ],
              },
            },
          ],
          type: 'javascript/auto',
        },
      ],
    },
    plugins: [new VueLoaderPlugin(), ...(customConfig?.plugins || [])],
  };

  return createBaseConfig(vue2Config, cliOptions);
};

export const createVue2BuildConfigWithDev = (
  customConfig: QucikConfig,
  cliOptions: CommonOptions,
) => {
  return config(customConfig, cliOptions).getDevConfig();
};

export const createVue2BuildConfigWithProd = (
  customConfig: QucikConfig,
  cliOptions: CommonOptions,
) => {
  return config(customConfig, cliOptions).getProdConfig();
};
