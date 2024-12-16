import _ from 'lodash';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import os from 'os';
import inquirer from 'inquirer';
import gitclone from 'git-clone';

import { logger, spinner, errorCapture } from '../utils';

/**
 * 创建项目
 * */
export const createProject = async (appName: string) => {
  const targetDir = path.join(process.cwd(), appName);

  await createProjectDir(targetDir);
  const templateOption = await getTplParams();
  const pkgParams = await getPkgParams();

  await pullProject({
    templateOption: templateOption,
    context: pkgParams,
    target: targetDir,
  });

  logger.log('🚀 执行以下命令进入项目启动开发服务');
  logger.log(chalk.greenBright(`cd ${appName}`));
  logger.log(chalk.greenBright('npm install'));
  logger.log(chalk.greenBright('npm run dev'));
};

// 创建项目文件夹
export const createProjectDir = async (targetDir: string) => {
  if (fs.existsSync(targetDir)) {
    const { isOverWrite } = await inquirer.prompt([
      {
        name: 'isOverWrite',
        message: `当前文件夹已存在${chalk.cyan(targetDir)},是否覆盖?`,
        type: 'confirm',
        default: true,
      },
    ]);

    if (isOverWrite) {
      logger.log(`\n删除目录 ${chalk.cyan(targetDir)}...`);
      await fs.remove(targetDir);
    }
  } else {
    logger.log(`\n创建目录 ${chalk.cyan(targetDir)}...`);
    await fs.mkdirp(targetDir);
  }
};

// 选择应用模版
export type TTemplateOption = {
  name: string;
  value: string;
  repository: string;
};
export const getTplParams = async () => {
  const templatesData: Array<TTemplateOption> = [
    {
      name: 'vue3-admin',
      value: 'template-vue3-admin-ts',
      repository: '',
    },
  ];

  const template = await inquirer.prompt([
    {
      name: 'type',
      message: '请选择模版?',
      type: 'list',
      choices: templatesData,
    },
  ]);

  const templateOption = templatesData.find((t) => t.value === template.type) as TTemplateOption;

  return templateOption;
};

export interface IPkgParams {
  name: string;
  version: string;
  key: string;
  description: string;
}

// 获取输入参数
export const getPkgParams = async (): Promise<IPkgParams> => {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: '请输入项目名称?',
      default: 'my-project',
      filter: (v) => _.trim(v),
    },
    {
      type: 'input',
      name: 'version',
      message: '请输入版本号?',
      default: '0.0.1',
      filter: (v) => _.trim(v),
    },
    {
      type: 'input',
      name: 'key',
      message: '请输入 App Key?',
      filter: (v) => _.trim(v),
    },
    {
      type: 'input',
      name: 'description',
      message: '请输入描述？',
      filter: (v) => _.trim(v),
    },
  ]);

  return result;
};

// 拉取git代码
export const pullProject = async (params: {
  templateOption: TTemplateOption;
  context: object;
  target: string;
}) => {
  const { templateOption, context, target } = params;
  const { name, repository } = templateOption;
  const tmpdir = path.join(os.tmpdir(), `quick-app`);
  await fs.remove(tmpdir);

  spinner.start(`⌛ 克隆项目`);
  const [err, res] = await errorCapture(
    new Promise((resolve, reject) => {
      gitclone(repository, tmpdir, (err: any) => {
        spinner.stop();
        if (!err) {
          logger.success(`克隆模板 ${chalk.yellow(`${name}`)} 成功`);
          return resolve(tmpdir);
        } else {
          logger.error(`克隆模板 ${chalk.yellow(`${name}`)} 失败`);
          return reject(err);
        }
      });
    }),
  );
  if (err) {
    logger.error(`克隆模板 ${chalk.yellow(`${name}`)} 失败`);
    process.exit(1);
  }

  spinner.start(`⌛ 克隆代码\n`);
  const pkgPath = path.resolve(tmpdir, './package.json');
  let pkgJson = await fs.readJson(pkgPath);
  pkgJson = { ...pkgJson, ...context };
  await fs.writeJson(pkgPath, pkgJson, { spaces: 2 });

  await Promise.all(
    fs.readdirSync(tmpdir).map((file) => {
      logger.log(`${chalk.greenBright('Copy: ')} ${file}`);
      return fs.move(path.join(tmpdir, file), path.join(target, file), {
        overwrite: true,
      });
    }),
  );
  spinner.stop();
};
