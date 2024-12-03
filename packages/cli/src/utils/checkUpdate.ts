import { exec } from 'child_process';
import { compare } from 'compare-versions';
import chalk from 'chalk';

import { logger, spinner } from '../utils';
import pkg from '../../package.json';
export const checkUpdate = () => {
  return new Promise((resolve) => {
    spinner.start('版本检查');
    exec(`npm view ${pkg.name} version`, (_error, stdout, _stderr) => {
      spinner.stop();
      if (stdout) {
        const lastesVersion = stdout.replace(/\r\n|\r|\n/g, '');
        const isNeedUpdate = compare(lastesVersion, pkg.version, '>');
        if (isNeedUpdate) {
          logger.log(
            chalk.yellowBright(
              `当前 @yu/quick-cli 版本是 ${pkg.version} 请升级 @yu/quick-cli 到最新版本 @${lastesVersion} `,
            ),
          );
        }

        return resolve(stdout);
      }
    });
  });
};
