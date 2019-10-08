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
        password: 'admin'
    }
    config.sequelize = {
        dialect: 'mysql',
        hostname: '127.0.0.1',
        host: '127.0.0.1',
        port: 3306,
        database: 'candybox',
        username: 'root',
        password: 'candyboxtest',
        dialectOptions: {
            multipleStatements: true,
        },
    };
    return config;
};