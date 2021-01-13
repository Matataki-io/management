'use strict';
const jwt = require('jsonwebtoken');

module.exports = {
    // jwt签名
    jwtSign(user, stakeExpireAt) {
        // 过期时间
        ;
        // 生成token
        const token = jwt.sign(user, this.config.login.secretKey, {
            expiresIn: Math.floor((stakeExpireAt - Date.now()) / 1000),
        });
        return {
            access_token: token,
            expires_in: Math.floor(stakeExpireAt / 1000),
            token_type: 'Bearer',
        };
    },
    isNull(v) {
        return v === '' || v === null || v === undefined || JSON.stringify(v) === '{}' || JSON.stringify(v) === '[]';
    },
    unixTimestamp() {
        return Math.round(new Date().getTime() / 1000);
    },
};
