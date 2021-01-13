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
}
module.exports = AnnouncementController;
