/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1552895551811_5889';

  // 请修改jwt密钥和失效时间
  config.login = {
    secretKey: 'HO88B58fgfsv1UafNOoYuyKZ9cjjDKOa', // jwt密钥
    expires: 60 * 60 * 24, // 超时时间24小时
  };
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    },
    domainWhiteList: '*',
  };
  config.cluster = {
    listen: {
      path: '',
      port: 7002,
      hostname: '0.0.0.0',
    },
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    credentials: true,
  };

  // add your middleware config here
  config.middleware = [ 'formatMessage' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
