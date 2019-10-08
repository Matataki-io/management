'use strict';

const Controller = require('egg').Controller;

class RedPacketController extends Controller {
  // 红包日志列表
  async index() {
    const { ctx } = this;
    let {pageSize, pageIndex, ...searchParams} = ctx.query;
    pageSize = parseInt(pageSize);
    pageIndex = parseInt(pageIndex);
    const offset = (pageIndex - 1) * pageSize;
    const msg = ctx.msg.success;
    const ret = await ctx.service.redPacket.redpacketLog(offset, pageSize, searchParams);
    ctx.body = {
      ...msg,
      data: ret
    };
  }

  async create() {
    const { ctx } = this;
    const msg = ctx.msg.success;
    const { RedpacketId, Title, phoneList } = ctx.request.body;
    const ret = await ctx.service.redPacket.createRpLog(RedpacketId, Title, phoneList);
    ctx.body = {
      ...msg,
      data: ret
    };
  }
  async update() {
    const { ctx } = this;
    let msg;
    const { idArr, CreateDate } = ctx.request.body;
    const ret = await ctx.service.redPacket.updateUserRpStatus(idArr, CreateDate);
    if (ret === 0) {
      msg = ctx.msg.success;
    } else {
      msg = ctx.msg.updateFailed;
    }
    ctx.body = msg;
  }
}
module.exports = RedPacketController;