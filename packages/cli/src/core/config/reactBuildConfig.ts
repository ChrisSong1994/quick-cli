/**
 * react 构建配置
 */
import _ from 'lodash';

import { QucikConfig, CommonOptions } from '../../types';
import { createBaseConfig } from './createBaseConfig';
import { BrowserslistOption, platform } from './defaultConfig';
import RefreshPlugin from '@rspack/plugin-react-refresh';

const isDev = process.env.NODE_ENV === 'development';
const config: any = (customConfig: QucikConfig, cliOptions: CommonOptions) => {
  const browserslist = BrowserslistOption[customConfig.platform || platform];
  const reactConfig = {
    ...customConfig,
    source: {
      ...customConfig.source,
      entry: {
        index: './src/index.tsx', // 默认 index.tsx
        ...customConfig.source?.entry,
      },
    },
    module: {
      ...customConfig.module,
      parser: {
        'css/auto': {
          namedExports: true,
        },
      },
      rules: [
        ...(customConfig.module?.rules || []),
        {
          test: /\.(jsx?|tsx?)$/,
          use: [
            {
              loader: 'builtin:swc-loader',
              options: {
                jsc: {
                  parser: {
                    syntax: 'typescript',
                    tsx: true,
                  },
                  transform: {
                    react: {
                      runtime: 'automatic',
                      development: isDev,
                      refresh: isDev,
                    },
                  },
                },
                env: {
                  targets: browserslist,
                },
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          loader: require.resolve('rspack-svg-loader/react'),
          options: {
            svgoConfig: {},
          },
        },
      ],
    },
    plugins: [...(customConfig?.plugins || []), isDev ? new RefreshPlugin() : null].filter(Boolean),
  };

  return createBaseConfig(reactConfig, cliOptions);
};
export const createReactBuildConfigWithDev = (
  customConfig: QucikConfig,
  cliOptions: CommonOptions,
) => {
  return config(customConfig, cliOptions).getDevConfig();
};

export const createReactBuildConfigWithProd = (
  customConfig: QucikConfig,
  cliOptions: CommonOptions,
) => {
  return config(customConfig, cliOptions).getProdConfig();
};
