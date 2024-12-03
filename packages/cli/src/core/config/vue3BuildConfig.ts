/**
 * vue3 构建配置
 */
import { VueLoaderPlugin } from 'vue-loader17';
import _ from 'lodash';

import { QucikConfig, CommonOptions } from '../../types';
import { createBaseConfig } from './createBaseConfig';

const VUE_DEFAULT_DEFINE = {
  __VUE_OPTIONS_API__: true,
  __VUE_PROD_DEVTOOLS__: false,
};
const config: any = (customConfig: QucikConfig, cliOptions: CommonOptions) => {
  const vue3Config = {
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
          loader: require.resolve('vue-loader17'),
          options: {
            experimentalInlineMatchResource: true,
          },
        },
        {
          test: /\.tsx$/,
          exclude: /node_modules/,
          use: [
            require.resolve('thread-loader'),
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    require.resolve('@babel/preset-typescript'),
                    { allExtensions: true, isTSX: true },
                  ],
                ],
                plugins: [require.resolve('@vue/babel-plugin-jsx')],
              },
            },
          ],
          type: 'javascript/auto',
        },
        // {
        //   test: /\.svg$/,
        //   loader: require.resolve('rspack-svg-loader/vue'),
        //   options: {
        //     svgoConfig: {},
        //   },
        // },
      ],
    },
    plugins: [...(customConfig?.plugins || []), new VueLoaderPlugin()],
  };

  return createBaseConfig(vue3Config, cliOptions);
};

export const createVue3BuildConfigWithDev = (
  customConfig: QucikConfig,
  cliOptions: CommonOptions,
) => {
  return config(customConfig, cliOptions).getDevConfig();
};

export const createVue3BuildConfigWithProd = (
  customConfig: QucikConfig,
  cliOptions: CommonOptions,
) => {
  return config(customConfig, cliOptions).getProdConfig();
};
