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
      for: 'update',
      id: parseInt(id)
    }
    const { isSeed = null, isMint = null, isExchange = null, isRecommend = null } = ctx.request.body;
    let isSeedResult = null;
    let isMintResult = null;
    let isExchangeResult = null;
    let isRecommendResult = null;
    if (isSeed !== null) {
      isSeedResult = await ctx.service.user.setSeedPermission(id, isSeed);
      log.seedUpdate = true;
    }
    if (isMint !== null) {
      isMintResult = await ctx.service.user.setMintPermission(id, isMint);
      log.mintUpdate = true;
    }
    if (isExchange !== null) {
      isExchangeResult = await ctx.service.user.setExchangePermission(id, isExchange);
      log.isExchangeUpdate = true;
    }

    if (isRecommend !== null) {
      isRecommendResult = await ctx.service.user.update(id, { is_recommend: isRecommend ? 1 : 0 });
      log.isRecommendUpdate = true;
      if (isRecommendResult[0] && isRecommend)
        ctx.service.announcement.targetedPost(ctx.user.username, [parseInt(id)], '你已被瞬Matataki评为推荐作者', '');
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

  async search() {
    const { ctx } = this;
    const { pageSize = 10, pageIndex = 1, word = '' } = ctx.query;
    const result = await ctx.service.user.search(parseInt(pageSize), parseInt(pageIndex), word);
    ctx.body = {
      ...ctx.msg.success,
      data: result
    }
    
  }
}
module.exports = UserController;
