'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    // 所有用户列表, pageSize=10 pageIndex=1
    async index() {
        const { ctx } = this;
        let {pageSize, pageIndex, ...searchParams} = ctx.query;
        pageSize = parseInt(pageSize);
        pageIndex = parseInt(pageIndex);
        const offset = (pageIndex - 1) * pageSize;
        const msg = ctx.msg.success;
        msg.data = await ctx.service.user.list(offset, pageSize, searchParams);
        ctx.body = msg;
    }
    // 用户详情
    async show() {
        const { ctx } = this;
        const ontId = ctx.params.id;
        const msg = ctx.msg.success;
        msg.data = await ctx.service.user.show(ontId);
        ctx.body = msg;
    }

    async dashboard() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        msg.data = await ctx.service.user.dashboard();
        ctx.body = msg;
    }
}

module.exports = UserController;
