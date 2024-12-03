const { responseSuccessFormat } = require('./utils');

module.exports = {
  'GET /api/app/list': responseSuccessFormat(require('./data/getAppList.json')),
  'POST /api/user/info': responseSuccessFormat(require('./data/getUserInfo.json')),
};
