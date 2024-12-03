// 成功
const responseSuccessFormat = (data) => {
  return {
    code: 0,
    data: data,
    message: null,
    success: true,
  };
};

// 失败,测试使用
const responseErrorFormat = (data) => {
  return {
    code: 500,
    data: data,
    message: 'server error',
    success: false,
  };
};

module.exports = {
  responseSuccessFormat,
  responseErrorFormat,
};
