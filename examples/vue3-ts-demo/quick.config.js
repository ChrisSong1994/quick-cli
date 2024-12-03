module.exports = function () {
  return {
    appType: 'vue3',
    mode: 'development', // production | development
    source: {
      entry: {
        index: './src/index.ts',
      },
      alias: {
        '@': './src',
      },
      define: {
        RUNTIME: 'PROD',
      },
    },
    output: {
      // 默认拷贝到 dist
      copy: [{ from: './package.json' }],
      sourceMap: 'cheap-source-map',
      filename: '[name].[hash:8].js',
      publicPath: 'auto',
    },
    // 开发配置
    dev: { hmr: true },
    server: {
      mock: true,
      static: {
        directory: 'public',
      },
      port: 4001,
      host: 'local.yusong.com.cn',
      open: true,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*', // 微服务跨域访问
      },
      proxy: [
        {
          context: ['/web_console_api'],
          target: 'https://cshd.yusong.com.cn',
          changeOrigin: true,
        },
      ],
    },
  };
};
