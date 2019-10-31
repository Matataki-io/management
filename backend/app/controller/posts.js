'use strict';

const Controller = require('egg').Controller;
class PostsController extends Controller {
  // 列表，GET
  async index() {
    const { ctx } = this;
    let { pageSize = 10, pageIndex = 1, ...searchParams } = ctx.query;
    pageSize = parseInt(pageSize);
    pageIndex = parseInt(pageIndex);
    const result = await ctx.service.posts.list((pageIndex - 1) * pageSize, pageSize, searchParams);
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
  // 详情
  async show() {
    const { ctx } = this;
    const { id } = ctx.params;
    const result = await ctx.service.posts.show(id);
    ctx.body = {
      ...ctx.msg.success,
      data: result,
    };
  }
  // 创建，POST
  async create() { }
  // 更新 PUT
  // 修改时间排序，修改热门排序
  async update() {
    const { ctx } = this;
    // 文章id
    const { id } = ctx.params;
    // 时间排序和热门排序
    const { is_recommend, time_down, down, status } = ctx.request.body;
    let result0 = null;
    let result1 = null;
    let result2 = null;
    let result3 = null;
    if (is_recommend !== undefined) {
      result0 = await ctx.model.Posts.update({ is_recommend }, { where: { id: parseInt(id) } });
    }
    if (time_down !== undefined) {
      result1 = await ctx.model.Posts.update({ time_down }, { where: { id: parseInt(id) } });
    }
    if (down !== undefined) {
      result2 = await ctx.model.PostReadCount.update({ down }, { where: { post_id: parseInt(id) } });
    }
    if (status !== undefined) {
      result3 = await ctx.model.Posts.update({ status }, { where: { id: parseInt(id) } });
    }
    ctx.body = {
      ...ctx.msg.success,
      data: {
        result0,
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
  async ipfs() {
    const { ctx } = this;
    const { hash } = ctx.params;
    // 从ipfs获取内容
    const catchRequest = await this.service.ipfs.cat(hash);

    if (catchRequest) {
      ctx.body = ctx.msg.success;
      // 字符串转为json对象
      ctx.body.data = JSON.parse(catchRequest.toString());
      return;
    }

    ctx.body = ctx.msg.ipfsCatchFailed;
  }
}
module.exports = PostsController;
