'use strict';

const Controller = require('egg').Controller;
const consts = require('../service/consts');

class UserController extends Controller {
  // 列表，GET
  async index() {
    const { ctx } = this;
    let { pageSize = 10, pageIndex = 1, ...searchParams } = ctx.query;
    pageSize = parseInt(pageSize);
    pageIndex = parseInt(pageIndex);
    const result = await ctx.service.user.list((pageIndex - 1) * pageSize, pageSize, searchParams);
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
  async create() { }
  // 更新 PUT
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const log = {
      from: 'user',
      id: parseInt(id)
    }
    const { isSeed = null, isMint = null, isExchange = null, isRecommend = null } = ctx.request.body;
    let isSeedResult = null;
    let isMintResult = null;
    let isExchangeResult = null;
    let isRecommendResult = null;
    if (isSeed !== null) {
      isSeedResult = await ctx.service.user.setSeedPermission(id, isSeed);
      log.isSeed = true;
    }
    if (isMint !== null) {
      isMintResult = await ctx.service.user.setMintPermission(id, isMint);
      log.isMintResult = true;
    }
    if (isExchange !== null) {
      isExchangeResult = await ctx.service.user.setExchangePermission(id, isExchange);
      log.isExchangeResult = true;
    }

    if (isRecommend !== null) {
      isRecommendResult = await ctx.service.user.update(id, { is_recommend: isRecommend ? 1 : 0 });
      log.isRecommendResult = true;
    }

    await this.service.logging.addLog('user', ctx.user.id, log)
    ctx.body = {
      ...ctx.msg.success,
      data: {
        isSeedResult,
        isMintResult,
        isExchangeResult,
        isRecommendResult,
      },
    };
  }
  // 删除 DELETE
  async destroy() { }
}
module.exports = UserController;
