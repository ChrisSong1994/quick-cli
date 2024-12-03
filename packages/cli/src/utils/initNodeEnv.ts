/**
 * 初始化 node 环境
*/
export function initNodeEnv() {
  if (!process.env.NODE_ENV) {
    const command = process.argv[2];
    process.env.NODE_ENV = ['build'].includes(command) ? 'production' : 'development';
  }
}
