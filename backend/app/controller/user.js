'use strict';

const Controller = require('egg').Controller;
const consts = require('../service/consts');

class UserController extends Controller {
  // 列表，GET
  async index() {
    const { ctx } = this;
    let { pagesize = 10, page = 1 } = ctx.query;
    pagesize = parseInt(pagesize);
    page = parseInt(page);
    const result = {};
    result.rows = await ctx.model.Users.findAll({ offset: (page - 1) * pagesize, limit: pagesize });
    result.count = await ctx.model.Users.count();
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
  // 详情
  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const result = await ctx.model.Users.find({ where: { id } });
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
  // 创建，POST
  async create() {}
  // 更新 PUT
  async update() {}
  // 删除 DELETE
  async destroy() {}
}
module.exports = UserController;
