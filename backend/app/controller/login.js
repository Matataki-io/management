'use strict';

const Controller = require('egg').Controller;
const uaParser = require('ua-parser-js')

class LoginController extends Controller {
  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    const user = await this.service.admin.login(username, password);
    if (!user) {
      ctx.body = ctx.msg.loginFailed;
      return;
    }
    const msg = ctx.msg.success;
    msg.data = ctx.helper.jwtSign({ id: user.id, username, password });
    const ua = uaParser(ctx.get('user-agent'));
    await this.service.logging.addLog('login', user.id, {
      ip: ctx.ip,
      os: ua.os,
      browser: ua.browser
    })
    ctx.body = msg;
  }
}

module.exports = LoginController;
