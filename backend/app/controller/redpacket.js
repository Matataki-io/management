'use strict';

const Controller = require('egg').Controller;

class RedPacketController extends Controller {
    async index() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const ret = await ctx.service.redPacket.redPacketList();
        ctx.body = {
            ...msg,
            data: ret
        };
    }

    async update() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const id = ctx.params.id;
        const data = ctx.request.body;
        const ret = await ctx.service.redPacket.updateRp(data, id);
        ctx.body = {
            ...msg,
            data: ret
        };
    }

    async create() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const data = ctx.request.body;
        const ret = await ctx.service.redPacket.createRp(data);
        ctx.body = {
            ...msg,
            data: ret
        };
    }
}

module.exports = RedPacketController;
