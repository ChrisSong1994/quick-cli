import fs from 'node:fs';

import type { NodeEnv } from '../types';

export const getNodeEnv = () => process.env.NODE_ENV as NodeEnv;
export const isDev = (): boolean => getNodeEnv() === 'development';
export const isProd = (): boolean => getNodeEnv() === 'production';

export const isFileSync = (filePath: string): boolean | undefined => {
  try {
    return fs.statSync(filePath, { throwIfNoEntry: false })?.isFile();
  } catch (_) {
    return false;
  }
};

export const findExists = (files: string[]): string | false => {
  for (const file of files) {
    if (isFileSync(file)) {
      return file;
    }
  }
  return false;
};

/**
 * 捕获promise返回的结果
 * @param {Promise} promise 任务列表
 * @return {Promise} 返回一个promise实例
 */
export const errorCapture = (promise: Promise<any>): Promise<any> => {
  return promise
    .then((data: any) => {
      return [null, data];
    })
    .catch((err: any) => [err, null]);
};
