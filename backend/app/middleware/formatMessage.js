'use strict'
const message = require('../../config/message')

module.exports = options => {
    return async function format(ctx, next) {
        ctx.msg = message();
        await next();
    }
}