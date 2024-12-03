import path from 'path';
import fs from 'fs-extra';
import { program } from 'commander';

import { init } from './init';
import { createProject } from '../core';
import { logger, zip, checkUpdate } from '../utils';
import pkg from '../../package.json';

export async function loadCli() {
  // 检查版本
  //  await checkUpdate();

  // 命令注册
  program
    .name('quick')
    .usage('<command> [options]')
    .description('前端应用开发脚手架工具')
    .version(pkg.version);

  // 命令注册
  const createCommand = program.command('create <name>');
  const serveCommand = program.command('serve');
  const buildCommand = program.command('build');
  const inspectCommand = program.command('inspect');
  const compressCommand = program.command('zip');

  createCommand.description('新建项目').action(async (name) => {
    try {
      await createProject(name);
    } catch (err) {
      logger.error('创建应用失败！');
      logger.error(err);
      process.exit(1);
    }
  });

  // dev
  serveCommand
    .description('启动本地开发服务')
    .option('-o --open', '在浏览器打开')
    .option('-p --port <port>', '指定本地开发服务端口号')
    .option('-h --host <host>', '指定服务主机地址')
    .action(async (options) => {
      try {
        const instance = await init({ cliOptions: options });
        await instance?.createDevServer();
      } catch (err) {
        logger.error('开发服务启动失败');
        logger.error(err);
        process.exit(1);
      }
    });

  // build
  buildCommand
    .description('构建项目')
    .option('-a --analyze', '在浏览器打开')
    .action(async (options) => {
      try {
        const instance = await init({ cliOptions: options });
        await instance?.createBundler();
      } catch (err) {
        logger.error('开发服务启动失败');
        logger.error(err);
        process.exit(1);
      }
    });

  // inspect
  inspectCommand
    .description('检出项目 Rspack 配置')
    .option('-m --mode [mode]', '配置模式')
    .action(async (options) => {
      try {
        const instance = await init({ cliOptions: options });
        await instance?.inspectConfig();
      } catch (err) {
        logger.error('检出配置失败');
        logger.error(err);
        process.exit(1);
      }
    });

  // zip
  compressCommand
    .description('文件打包')
    .option('-t --target <target>', '压缩输出文件')
    .option('-s --source <source>', '压缩输入文件夹')
    .option('-f --force', '强制更新压缩文件')
    .action(async (options) => {
      try {
        const defaultZipName = 'dist';
        const source = path.join(process.cwd(), options.source || defaultZipName);
        let target = path.join(process.cwd(), options.target || `${defaultZipName}.zip`);
        if (!fs.existsSync(source)) {
          logger.error(`${source} 不存在！`);
          process.exit(1);
        }
        // 强制更新 zip 文件
        if (options.force && fs.existsSync(target)) {
          await fs.rm(target);
        }
        zip(target, source);
      } catch (err) {
        logger.error('文件打包失败！');
        logger.error(err);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}
