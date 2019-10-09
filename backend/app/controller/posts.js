'use strict';

const Controller = require('egg').Controller;
class PostsController extends Controller {
  // 列表，GET
  async index() {
    const { ctx } = this;
    let { pagesize = 10, page = 1 } = ctx.query;
    pagesize = parseInt(pagesize);
    page = parseInt(page);
    const result = {};
    result.rows = await ctx.model.Posts.findAll({ offset: (page - 1) * pagesize, limit: pagesize });
    result.count = await ctx.model.Posts.count();
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
  // 详情
  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const result = await ctx.model.Posts.find({ where: { id } });
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
  // 创建，POST
  async create() {}
  // 更新 PUT
  // 修改时间排序，修改热门排序
  async update() {
    const { ctx } = this;
    // 文章id
    const { id } = ctx.params;
    // 时间排序和热门排序
    const { time_down, down, status } = ctx.request.body;
    let result1 = null;
    let result2 = null;
    let result3 = null;
    if (time_down) {
      result1 = await ctx.model.Posts.update({ time_down }, { where: { id: parseInt(id) } });
    }
    if (down) {
      result2 = await ctx.model.PostReadCount.update({ down }, { where: { post_id: parseInt(id) } });
    }
    if (status) {
      result3 = await ctx.model.PostReadCount.update({ status }, { where: { post_id: parseInt(id) } });
    }
    ctx.body = {
      ...ctx.msg.success,
      data: {
        result1,
        result2,
        result3,
      },
    };
  }
  // 删除 DELETE
  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    // status 状态，0有效，1隐藏
    const result = await ctx.model.Posts.update({ status: 1 }, { where: { id } });
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
}
module.exports = PostsController;
