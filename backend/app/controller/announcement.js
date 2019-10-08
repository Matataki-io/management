'use strict';

const Controller = require('egg').Controller;

class AnnouncementController extends Controller {
  async create() {
    const { ctx } = this;
    const { baseInfo, contents } = ctx.request.body;

    const msg = ctx.msg.success;
    msg.data = await ctx.service.announcement.create(baseInfo, contents);
    ctx.body = msg;
  }

  async index() {
    const { ctx } = this;
    const msg = ctx.msg.success;

    const pageSize = parseInt(ctx.query.pageSize);
    const pageIndex = parseInt(ctx.query.pageIndex);
    const offset = (pageIndex - 1) * pageSize;

    const searchParams = {
      CountryCode: ctx.query.CountryCode,
      StartDate: ctx.query.StartDate,
      EndDate: ctx.query.EndDate,
    };

    // for (let key in searchParams) {
    //     if (ctx.helper.isNull(searchParams[key])) {
    //         delete searchParams[key]
    //     }
    // }

    msg.data = await ctx.service.announcement.list(offset, pageSize, searchParams);

    ctx.body = msg;
  }

  // 项目详情
  async show() {
    const { ctx } = this;
    const id = ctx.params.id;
    const msg = ctx.msg.success;
    msg.data = await ctx.service.announcement.show(id);
    ctx.body = msg;
  }

  // 更新 body请求参数: {projectObj:{}, socialMedia:[], projectMultiLang:[]}
  async update() {
    const { ctx } = this;
    const id = ctx.params.id;
    const data = ctx.request.body;
    const msg = ctx.msg.success;
    msg.data = await ctx.service.announcement.update(id, data);
    ctx.body = msg;
  }

  async destroy() {
    const { ctx } = this;
    const id = ctx.params.id;

    const msg = ctx.msg.success;
    msg.data = await ctx.model.Announcement.destroy({
      where: {
        id,
      },
    });
    ctx.body = msg;
  }
}

module.exports = AnnouncementController;
