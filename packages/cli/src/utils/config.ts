/**
 * 配置项
 */
import fs from 'node:fs';
import { join } from 'node:path';
import { getNodeEnv } from './helpers';
import { logger } from './logger';
// 获取配置文件路径
const resolveConfigPath = (root: string) => {
  const CONFIG_FILES = ['quick.config.js'];

  for (const file of CONFIG_FILES) {
    const configFile = join(root, file);

    if (fs.existsSync(configFile)) {
      return configFile;
    }
  }

  return null;
};

// 加载配置文件
export async function loadConfig({ root }: { root: string }) {
  const configFilePath = resolveConfigPath(root);
  if (!configFilePath) {
    logger.error('该目录不存在 quick.config.js 配置文件');
    process.exit(1);
  }

  if (/\.(?:js|mjs|cjs)$/.test(configFilePath)) {
    let configExport;
    try {
      const exportModule = require(`${configFilePath}`);
      configExport = exportModule.default ? exportModule.default : exportModule;
    } catch (err) {
      console.error(err);
    }

    if (typeof configExport === 'function') {
      const command = process.argv[2];
      const params = {
        env: getNodeEnv(),
        command,
        envMode: getNodeEnv(),
      };

      const result = await configExport(params);

      if (result === undefined) {
        throw new Error('The config function must return a config object.');
      }

      return {
        content: result,
        filePath: configFilePath,
      };
    }
  } else {
    return null;
  }
}
