import { pathToRegexp } from 'path-to-regexp';
import multer from 'multer';
import bodyParser from 'body-parser';
import * as fs from 'fs';

const BODY_PARSED_METHODS = ['post', 'put', 'patch', 'delete'];
export function parseKey(key: string) {
  let method = 'get';
  let path = key;
  if (/\s+/.test(key)) {
    const splited = key.split(/\s+/);
    method = splited[0].toLowerCase();
    path = splited[1]; // eslint-disable-line
  }

  return {
    method,
    path,
  };
}

function createHandler(method: any, path: any, handler: any) {
  return function (req: Request, res: any, next: any) {
    if (BODY_PARSED_METHODS.includes(method)) {
      // @ts-ignore
      bodyParser.json({ limit: '5mb', strict: false })(req, res, () => {
        // @ts-ignore
        bodyParser.urlencoded({ limit: '5mb', extended: true })(req, res as any, () => {
          sendData();
        });
      });
    } else {
      sendData();
    }

    function sendData() {
      if (typeof handler === 'function') {
        // @ts-ignore
        multer().any()(req, res, () => {
          handler(req, res, next);
        });
      } else {
        res.json(handler);
      }
    }
  };
}

export const normalizeConfig = (config: any) => {
  return Object.keys(config).reduce((memo: any, key) => {
    const handler = config[key];
    // const type = typeof handler;

    const { method, path } = parseKey(key);
    const keys: any[] = [];
    // @ts-ignore
    const re = pathToRegexp(path, keys);
    memo.push({
      method,
      path,
      re,
      keys,
      handler: createHandler(method, path, handler),
    });
    return memo;
  }, []);
};

export function mockServer(app: any, mockApiDataPath: string) {
  if (!app) {
    throw new Error('devServer is not defined');
  }
  if (!fs.existsSync(mockApiDataPath)) {
    throw new Error('mock api path is not defined');
  }

  const mockApiData = require(mockApiDataPath);
  const mockData = normalizeConfig(mockApiData);
  for (const mock of mockData) {
    const { method, re, handler } = mock;
    app[method](re.regexp, handler);
  }
}
