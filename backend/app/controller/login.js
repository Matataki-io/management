'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {

  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    if (username === this.config.login.username && password === this.config.login.password) {
      const msg = ctx.msg.success;
      msg.data = ctx.helper.jwtSign({ username, password });
      ctx.body = msg;
    } else {
      ctx.body = ctx.msg.loginFailed;
    }
  }
}

module.exports = LoginController;
