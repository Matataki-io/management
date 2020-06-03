'use strict';

const Controller = require('egg').Controller;
/** 站内公告 */
class AnnouncementController extends Controller {
  /** 获取公告列表 */
  async index() {
    const { ctx } = this;
    const { pageSize = 10, pageIndex = 1, ...searchParams } = ctx.query;
    const result = await ctx.service.announcement.list(parseInt(pageSize), parseInt(pageIndex));
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
  /** 发布一条公告 */
  async post() {
    const { ctx } = this;
    const { title, content, postId = 0 } = ctx.request.body;
    const result = await ctx.service.announcement.post(ctx.user.username, title, content, parseInt(postId))
    if(result) ctx.body = ctx.msg.success
    else ctx.body = ctx.msg.failure
  }
}
module.exports = AnnouncementController;
