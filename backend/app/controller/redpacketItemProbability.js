'use strict';

const Controller = require('egg').Controller;

class RedPacketItemProbabilityController extends Controller {
    async index() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const id = ctx.query.id;
        msg.data = await ctx.service.redPacket.probabilityList(id);
        ctx.body = msg;
    }
    async update() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const id = ctx.params.id;
        const data = ctx.request.body;
        msg.data = await ctx.service.redPacket.updateProbability(data, id);
        ctx.body = msg;
    }
    async create() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const data = ctx.request.body;
        msg.data = await ctx.service.redPacket.createProbability(data);
        ctx.body = msg;
    }
    async destroy() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        const id = ctx.params.id;
        msg.data = await ctx.service.redPacket.deleteProbability(id);
        ctx.body = msg;
    }
}

module.exports = RedPacketItemProbabilityController;
