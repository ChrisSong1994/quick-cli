/**
 * 基础构建配置
 */
import { rspack } from '@rspack/core';
import _ from 'lodash';
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

import { mockServer } from '../../utils';
import { defaultConfig, BrowserslistOption } from './defaultConfig';
import { QucikConfig, EMode, CommonOptions, BundlerPluginInstance, EPlatform } from '../../types';

export const createBaseConfig: any = (customConfig: QucikConfig, cliOptions: CommonOptions) => {
  const { server, source } = defaultConfig;
  const isDev = process.env.NODE_ENV === 'development';
  const root = customConfig.root || defaultConfig.root;
  const entry = customConfig.source?.entry || source?.entry;
  const isMockOpen = customConfig.server?.mock && isDev;
  const platform = customConfig.platform || defaultConfig.platform;
  const browserslist = BrowserslistOption[platform as EPlatform];
  const output = _.merge(defaultConfig.output, customConfig.output);
  const hmr = (customConfig.server?.hmr || server?.hmr) && isDev;
  const alias = _.merge(defaultConfig.source?.alias, customConfig.source?.alias);
  const extensions = [
    ...(defaultConfig.source?.extensions || []),
    ...(customConfig.source?.extensions || []),
  ];
  const filename = hmr ? '[name].js' : output?.filename;
  const define = _.merge(customConfig.source?.define, customConfig.source?.define);
  const devtool = output?.sourceMap;

  const rspackConfig = {
    context: root,
    entry: entry,
    output: {
      clean: true,
      path: output?.path,
      filename: filename, // 使用hmr 不能使用 hash
      publicPath: output?.publicPath,
      sourceMapFilename: output?.sourceMapFilename,
    },
    externals: output?.externals,
    resolve: {
      extensions: extensions,
      alias: alias,
    },
    devtool: devtool,
    devServer: {
      hot: hmr,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      static: customConfig.server?.static || server?.static,
      port: customConfig.server?.port || server?.port,
      open: customConfig.server?.open || server?.open,
      host: customConfig.server?.host || server?.host,
      headers: customConfig.server?.headers || server?.headers,
      historyApiFallback: customConfig.server?.historyApiFallback || server?.historyApiFallback,
      proxy: customConfig.server?.proxy || server?.proxy,
      setupMiddlewares: (middlewares: any, devServer: any) => {
        // mock 配置
        if (isMockOpen) {
          // 固定 mock 路径
          mockServer(devServer?.app, path.join(root, 'mock/index.js'));
        }
        return middlewares;
      },
    },
    module: {
      ...defaultConfig.module,
      ...customConfig.module,
      rules: [
        ...(defaultConfig.module?.rules || []),
        {
          test: /\.(js|ts)$/,
          loader: 'builtin:swc-loader',
          options: {
            sourceMap: true,
            jsc: {
              parser: { syntax: 'typescript' },
            },
            env: { targets: browserslist },
          },
          type: 'javascript/auto',
        },
        ...(customConfig.module?.rules || []),
      ],
    },
    plugins: [
      ...(defaultConfig.plugins as BundlerPluginInstance[]),
      ...(customConfig.plugins as BundlerPluginInstance[]),
      new rspack.CopyRspackPlugin({
        patterns: output?.copy as any,
      }),
      new rspack.DefinePlugin({
        ...define,
      }),
    ],
    experiments: {
      css: true,
    },
    optimization: defaultConfig.optimization,
    stats: customConfig.stats || defaultConfig.stats,
  };

  if (cliOptions.analyze) {
    rspackConfig.plugins.push(
      // @ts-ignore
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: true, // 不自动打开浏览器
      }),
    );
  }

  return {
    rspackConfig,
    getDevConfig: () => {
      return createBaseConfigWithDev(rspackConfig);
    },
    getProdConfig: () => {
      return createBaseConfigWithProd(rspackConfig);
    },
  };
};

//  开发环境
export const createBaseConfigWithDev: any = (baseConfig: any) => {
  return {
    mode: EMode.development,
    context: baseConfig.context,
    entry: baseConfig.entry,
    resolve: baseConfig.resolve,
    devtool: baseConfig.devtool,
    output: baseConfig.output,
    devServer: baseConfig.devServer,
    module: baseConfig.module,
    plugins: baseConfig.plugins,
    experiments: baseConfig.experiments,
    stats: baseConfig.stats,
  };
};

export const createBaseConfigWithProd: any = (baseConfig: any) => {
  const rspackConfig = {
    mode: EMode.production,
    context: baseConfig.context,
    entry: baseConfig.entry,
    output: baseConfig.output,
    devtool: baseConfig.devtool,
    resolve: baseConfig.resolve,
    module: baseConfig.module,
    plugins: baseConfig.plugins,
    optimization: baseConfig.optimization,
    experiments: baseConfig.experiments,
    stats: baseConfig.stats,
  };

  return rspackConfig;
};
