'use strict';

const Controller = require('egg').Controller;

class LogController extends Controller {
  // 列表，GET
  async index() {
    const { ctx } = this;
    let { pageSize = 10, pageIndex = 1, ...searchParams } = ctx.query;
    pageSize = parseInt(pageSize);
    pageIndex = parseInt(pageIndex);
    const result = await this.service.logging.list((pageIndex - 1) * pageSize, pageSize);
    const msg = ctx.msg.success;
    ctx.body = msg;
    ctx.body.data = result;
  }
  // 详情
  async show() {}
}
module.exports = LogController;
