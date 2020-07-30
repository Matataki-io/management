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
    const { type, uid } = ctx.request.body;
    const result = await ctx.service.minetokenApplication.modify(uid, type);
    if (result.code === 0) {
      ctx.body = ctx.msg.success;

      // 告知用户
      if (type === 'agree') {
        ctx.service.announcement.targetedPost(
          ctx.user.username,
          [uid],
          'Fan票发行申请已通过',
          '恭喜您！您申请发行的Fan票已经通过审核，请前往Fan票页查看明细。</br><a href="https://www.yuque.com/matataki/matataki/oiqv9k">点击查看帮助文档</a>',
          result.tokenId,
          'token'
        );
      }
      else if (type === 'reject') {
        ctx.service.announcement.targetedPost(
          ctx.user.username,
          [uid],
          'Fan票发行申请失败',
          '很抱歉！您申请发行的Fan票未能通过审核，审核结果将会发送至您的邮箱，前往Fan票页可再次提交发行申请。</br><a href="https://www.yuque.com/matataki/matataki/oiqv9k">点击查看帮助文档</a>'
        );
      }
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
