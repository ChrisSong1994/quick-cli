import { rspack } from '@rspack/core';
import { join } from 'path';

import { DefaultStatsPrinterPlugin } from '../plugins/DefaultStatsPrinterPlugin';
import { QucikConfig, EPlatform } from '../../types';

const isDev = process.env.NODE_ENV === 'development';

// https://github.com/browserslist/browserslist#queries
// 支持浏览器版本
export const webBrowserslist = [
  'chrome >= 87',
  'edge >= 88',
  'firefox >= 78',
  'safari >= 14',
  'not dead',
];
export const h5Browserslist = [
  'Android >= 5',
  'iOS >= 9',
  'ChromeAndroid >= 50',
  'Safari >= 9',
  'not dead',
];

export const BrowserslistOption = {
  [EPlatform.browser]: webBrowserslist,
  [EPlatform.mobile]: h5Browserslist,
};

// 构建平台，区分移动端和浏览器端
export const platform = EPlatform.browser;

// 资源配置
export const source = {
  entry: {
    index: './src/index.ts',
  },
  extensions: ['.vue', '.js', '.jsx', '.ts', '.tsx', '.json'],
  alias: {
    '@': join(process.cwd(), 'src'),
  },
  define: {},
};

// 产物配置
export const output: QucikConfig['output'] = {
  path: join(process.cwd(), 'dist'),
  copy: [{ from: './package.json' }], // 默认拷贝 package.json
  sourceMap: isDev ? 'cheap-module-source-map' : 'hidden-source-map', // 默认  cheap-module-source-map
  filename: '[name].[hash:8].js',
  publicPath: 'auto',
  externals: {},
  sourceMapFilename: '__yg-source-maps__/[file].map',
};

// 开发服务器配置
export const server: QucikConfig['server'] = {
  hmr: true, // 默认支持 hmr
  mock: false, // 默认不开启 mock
  port: 4000,
  host: '127.0.0.1',
  open: false,
  watchFiles: [],
  static: {
    directory: join(process.cwd(), 'public'), // public 作为静态服务文件夹
  },
  headers: {
    'Access-Control-Allow-Origin': '*', // 支持本地微服务跨域请求
  },
  historyApiFallback: true, // 支持browser router
  proxy: [],
};

// 仅用于生产环境
export const optimization: QucikConfig['optimization'] = {
  minimize: true,
  minimizer: [
    new rspack.SwcJsMinimizerRspackPlugin(), // js 压缩
    new rspack.LightningCssMinimizerRspackPlugin(), // css 压缩
  ],
  // 默认分块配置
  splitChunks: {
    chunks: 'async',
    minChunks: 1,
    minSize: 20000,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    cacheGroups: {
      defaultVendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
        reuseExistingChunk: true,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  },
};

// module
export const module: QucikConfig['module'] = {
  rules: [
    {
      test: /\.less$/,
      loader: require.resolve('less-loader'),
      options: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
      type: 'css/auto',
    },
    {
      test: /\.s[ac]ss$/,
      loader: require.resolve('sass-loader'),
      type: 'css/auto',
    },
    // 图片
    {
      test: /\.(png|webp|jpe?g|gif)(\?.*)?$/i,
      type: 'asset',
      generator: {
        filename: 'assets/[hash][ext]',
      },
    },
    // 多媒体
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: 'assets/[hash][ext]',
      },
    },
    // 字体
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      type: 'asset',
      generator: {
        filename: 'assets/[hash][ext]',
      },
    },
  ],
};

export const plugins: QucikConfig['plugins'] = [
  new rspack.HtmlRspackPlugin({
    template: './index.html',
  }),
  new rspack.ProgressPlugin({}),
  new DefaultStatsPrinterPlugin(),
];

export const defaultConfig: QucikConfig = {
  root: process.cwd(),
  platform: platform,
  source: source,
  output: output,
  server: server,
  optimization: optimization,
  plugins: plugins,
  module: module,
  stats: 'errors-only',
};
