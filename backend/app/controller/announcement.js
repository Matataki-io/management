'use strict';

const Controller = require('egg').Controller;
/** 站内公告 */
class AnnouncementController extends Controller {
  /** 获取公告列表 */
  async index() {
    const { ctx } = this;
    const { pageSize = 10, pageIndex = 1, filter = 'all' } = ctx.query;
    const result = await ctx.service.announcement.list(parseInt(pageSize), parseInt(pageIndex), filter);
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
  /** 发布一条公告 */
  async post() {
    const { ctx } = this;
    const { title, content, postId = 0, informInstant = 1, informNewUser = 0, expireTime } = ctx.request.body;
    const result = await ctx.service.announcement.post(ctx.user.username, title, content, postId, informInstant, informNewUser, expireTime)
    if (result) ctx.body = ctx.msg.success;
    else ctx.body = ctx.msg.failure;
  }

  async targetedPost() {
    const { ctx } = this;
    const { receivingIds, title, content, postId = 0 } = ctx.request.body;
    const result = await ctx.service.announcement.targetedPost(ctx.user.username, receivingIds, title, content, postId, 'post');
    ctx.body = result ? ctx.msg.success : ctx.msg.failure;
  }

  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const result = await ctx.service.announcement.delete(id);
    if(result) ctx.body = ctx.msg.success;
    else ctx.body = ctx.msg.failure;
  }
}
module.exports = AnnouncementController;
