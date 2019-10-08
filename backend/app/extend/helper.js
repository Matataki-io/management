const jwt = require('jsonwebtoken')

module.exports = {
    // jwt签名
    jwtSign(user) {
        // 过期时间
        const expires = this.config.login.expires;
        // 生成token
        const token = jwt.sign(user, this.config.login.secretKey, {
            expiresIn: expires,
        });
        return {
            access_token: token,
            expires_in: Math.floor(Date.now() / 1000) + expires,
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
