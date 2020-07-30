'use strict';

const Controller = require('egg').Controller;
class MineTokenApplicationController extends Controller {
  async list() {
    const { ctx } = this;
    const { pageSize = 10, pageIndex = 1, sort = 'update_time' } = ctx.query;
    const result = await ctx.service.minetokenApplication.list(parseInt(pageSize), parseInt(pageIndex), sort);
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
  async modify() {
    const { ctx } = this;
    const { type, uid, reason = '' } = ctx.request.body;
    const result = await ctx.service.minetokenApplication.modify(uid, type, reason);
    if (result.code === 0) {
      ctx.body = ctx.msg.success;
    } else {
      ctx.body = ctx.msg.failure;
      if (result.message) {
        ctx.body.message = result.message;
      }
    }
  }
  async surveyList() {
    const { ctx } = this;
    const { pageSize = 10, pageIndex = 1 } = ctx.query;
    const result = await ctx.service.minetokenApplication.surveyList(parseInt(pageSize), parseInt(pageIndex));
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
  async surveyListId() {
    const { ctx } = this;
    const { id } = ctx.params;
    const result = await ctx.service.minetokenApplication.surveyListId(id);
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
}
module.exports = MineTokenApplicationController;
