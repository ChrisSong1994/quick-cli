/**
 * 初始化 node 环境
 */

import * as dotenv from 'dotenv';
export function initNodeEnv() {
  // load .env
  dotenv.config();

  if (!process.env.NODE_ENV) {
    const command = process.argv[2];
    process.env.NODE_ENV = ['build'].includes(command) ? 'production' : 'development';
  }
}
