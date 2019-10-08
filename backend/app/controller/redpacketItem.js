'use strict';

const Controller = require('egg').Controller;

class RedPacketItemController extends Controller {
    async index() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const id = ctx.query.id;
        msg.data = await ctx.service.redPacket.itemList(id);
        ctx.body = msg;
    }
    async update() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const id = ctx.params.id;
        const data = ctx.request.body;
        msg.data = await ctx.service.redPacket.updateItem(data, id);
        ctx.body = msg;
    }
    async create() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const data = ctx.request.body;
        msg.data = await ctx.service.redPacket.createItem(data);
        ctx.body = msg;
    }
    async destroy() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const id = ctx.params.id;
        msg.data = await ctx.service.redPacket.deleteItem(id);
        ctx.body = msg;
    }
}

module.exports = RedPacketItemController;
