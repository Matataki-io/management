/* eslint valid-jsdoc: "off" */

'use strict';

/** app info
 */
module.exports = () => {
  const config = {};
  config.onerror = {
    onerror: {
      all(err, ctx) {
        // 在此处定义针对所有响应类型的错误处理方法
        // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
        ctx.body = 'error';
        ctx.status = 500;
      },
      html(err, ctx) {
        // html hander
        ctx.body = '<h3>error</h3>';
        ctx.status = 500;
      },
      json(err, ctx) {
        // json hander
        ctx.body = { message: 'error' };
        ctx.status = 500;
      },
      jsonp(err) {
        // 一般来说，不需要特殊针对 jsonp 进行错误定义，jsonp 的错误处理会自动调用 json 错误处理，并包装成 jsonp 的响应格式
      },
    },
  };
  config.login = {
    username: 'admin',
    password: 'admin',
  };
  config.sequelize = {
    dialect: 'mysql',
    hostname: 'kyubeydb.mysql.database.azure.com', // 47.244.147.219
    host: 'kyubeydb.mysql.database.azure.com',
    port: 3306,
    database: 'ssp_test',
    username: 'ssp_test@kyubeydb',
    password: 'f0e8619dc0e4483da533472f32dadf55',
    pool: {
      max: 50, // 连接池最大连接数量
      min: 5, // 连接池最小连接数量
      idle: 10000, // 如果一个线程超过10秒钟没有被使用过就释放该线程
    },
    dialectOptions: {
      multipleStatements: true,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  };

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '47.52.2.146', // 47.52.2.146
      password: '9vIZfzIHJEID1dK2', // 9vIZfzIHJEID1dK2
      db: 0,
    },
  };
  config.matatakiServer = 'https://api.smartsignature.io';
  config.ipfs_service = {
    site: 'http://47.52.2.146:5001',
    host: '47.52.2.146',
    port: 5001,
    protocol: 'http',
  };
  return config;
};
