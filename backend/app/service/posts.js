'use strict';
const Service = require('egg').Service;

class PostsService extends Service {
  async list(offset, limit, searchParams = null) {
    const { ctx } = this;
    const result = {};
    const condition = { channel_id: 1 };
    if (ctx.helper.isNull(searchParams)) {
      result.count = await ctx.model.Posts.count({ where: condition });
      result.rows = await ctx.model.Posts.findAll({
        where: condition,
        offset,
        limit,
      });
    } else {
      result.count = await ctx.model.Posts.count({ where: { ...searchParams, ...condition } });
      result.rows = await ctx.model.Posts.findAll({
        where: { ...searchParams, ...condition },
        offset,
        limit,
      });
    }
    return result;
  }
}

module.exports = PostsService;
