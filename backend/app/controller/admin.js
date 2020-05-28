'use strict';

const Controller = require('egg').Controller;

class AdminController extends Controller {
  async addUser() {
    const { ctx } = this;
    const { username, nickname, password } = ctx.request.body;
    const checkUser = await this.service.admin.get(username)
    if (checkUser) {
        ctx.body = ctx.msg.regFailedUsername;
        return;
    }
    const user = await this.service.admin.addUser(username, nickname, password);
    const msg = ctx.msg.success;
    ctx.body = msg;
  }
}

module.exports = AdminController;
