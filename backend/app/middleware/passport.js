'use strict';
const jwt = require('jsonwebtoken');

module.exports = options => {
// <<<<<<< HEAD
//     return async function authorize(ctx, next) {
//         const { authorization } = ctx.headers;
//         // 验证token
//         // 没有authorization token信息
//         if (authorization === undefined) {
//             ctx.throw(401, 'Access denied.');
//         }
//         // 解析request headers
//         const auths = authorization.split(' ');
//         // 认证协议错误
//         if (auths[0] !== 'Bearer' || auths.length !== 2) {
//             ctx.throw(401, 'The authorization is error.');
//         }
//         const token = auths[1];
//         try {
//             const jwtUser = jwt.verify(token, ctx.app.config.login.secretKey);
//             console.info(jwtUser);
//             ctx.user = jwtUser;
//         } catch (err) {
//             // jwt expired
//             ctx.throw(401, 'The token is error.');
//         }
//         await next();
// =======
  return async function authorize(ctx, next) {
    const { authorization } = ctx.headers;
    console.log('authorization', authorization);
    // 验证token
    // 没有authorization token信息
    if (authorization === undefined) {
      ctx.throw(401, 'Access denied.');
    }
    // 解析request headers
    const auths = authorization.split(' ');
    // 认证协议错误
    if (auths[0] !== 'Bearer' || auths.length !== 2) {
      ctx.throw(401, 'The authorization is error.');
    }
    const token = auths[1];
    try {
      console.info('token', token);
      const jwtUser = jwt.verify(token, ctx.app.config.login.secretKey);
      // Use Mttk testnet key for now
      // const jwtUser = jwt.verify(authorization, ctx.app.config.login.secretKey);
      console.log('jwtUser', jwtUser);
      ctx.user = jwtUser;
    //   ctx.user = await ctx.service.admin.get(jwtUser.username);
    } catch (err) {
      // jwt expired
      ctx.throw(401, 'The token is error.');
    }
    await next();
  };
}
;
