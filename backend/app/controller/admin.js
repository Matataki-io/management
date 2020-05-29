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
    await this.service.admin.addUser(username, nickname, password);
    const msg = ctx.msg.success;
    ctx.body = msg;
  }

  async list() {
    const { ctx } = this;
    const admins = await this.service.admin.list();
    const msg = ctx.msg.success;
    ctx.body = msg;
    ctx.body.data = admins;
  }
}

module.exports = AdminController;
