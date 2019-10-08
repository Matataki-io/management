'use strict';

const Controller = require('egg').Controller;
const path = require('path');
const fs = require('fs');

class ProjectController extends Controller {
    // 创建项目
    async create() {
        const { ctx } = this;
        const { projectObj, socialMedia, projectMultiLang } = ctx.request.body;
        const msg = ctx.msg.success;
        msg.data = await ctx.service.project.create(projectObj, socialMedia, projectMultiLang);
        ctx.body = msg;
    }
    // 所有项目列表, pageSize=10 pageIndex=1
    async index() {
        const { ctx } = this;
        const msg = ctx.msg.success;
        if (ctx.helper.isNull(ctx.query.pageSize)) {
            msg.data = await ctx.service.project.getAll();
        } else {
            const pageSize = parseInt(ctx.query.pageSize);
            const pageIndex = parseInt(ctx.query.pageIndex);
            const offset = (pageIndex - 1) * pageSize;
            let searchParams = {
                ProjectId: ctx.query.ProjectId,
                BlockChainName: ctx.query.BlockChainName,
                StartDate: ctx.query.StartDate,
                EndDate: ctx.query.EndDate
            };
            for (let key in searchParams) {
                if (ctx.helper.isNull(searchParams[key])) {
                    delete searchParams[key]
                }
            }
            msg.data = await ctx.service.project.list(offset, pageSize, searchParams);
        }
        ctx.body = msg;
    }
    // 项目详情
    async show() {
        const { ctx } = this;
        const id = ctx.params.id;
        const msg = ctx.msg.success;
        msg.data = await ctx.service.project.show(id);
        ctx.body = msg;
    }
    // 更新 body请求参数: {projectObj:{}, socialMedia:[], projectMultiLang:[]}
    async update() {
        const { ctx } = this;
        const id = ctx.params.id;
        const data = ctx.request.body;
        const msg = ctx.msg.success;
        msg.data = await ctx.service.project.update(id, data);
        ctx.body = msg;
    }
    async setStore() {
        const { ctx, app } = this;
        const { projectId, val } = ctx.request.body;
        for (let i = 0;i < val; i++) {
            await app.redis.lpush(`candy:seckill:stores:${projectId}`, 1);
        }
        let msg = ctx.msg.success;
        msg.data = await app.redis.llen(`candy:seckill:stores:${projectId}`);
        ctx.body = msg;
    }
    async getStore() {
        const { ctx, app } = this;
        let msg = ctx.msg.success;
        let storeKeys = await app.redis.keys('candy:seckill:stores*');
        let waitKeys = await app.redis.keys('candy:seckill:waits*');
        let orderKeys = await app.redis.keys('candy:seckill:orders*');
        const storeResult = [];
        for (let key of storeKeys) {
            storeResult.push({
                label: key,
                val: await app.redis.llen(key)
            })
        }
        const waitResult = [];
        for (let key of waitKeys) {
            waitResult.push({
                label: key,
                val: await app.redis.hlen(key)
            })
        }
        const orderResult = [];
        for (let key of orderKeys) {
            orderResult.push({
                label: key,
                val: await app.redis.llen(key)
            })
        }
        msg.data = {
            storeResult: storeResult,
            waitResult: waitResult,
            orderResult: orderResult
        };
        ctx.body = msg;
    }
    async delStore() {
        const { ctx, app } = this;
        const { candyKey } = ctx.request.body;
        await app.redis.del(candyKey);
        ctx.body = ctx.msg.success;
    }

    async tokenLog() {
        const { ctx } = this;
        let {pageSize, pageIndex, ...searchParams} = ctx.query;
        pageSize = parseInt(pageSize);
        pageIndex = parseInt(pageIndex);
        const offset = (pageIndex - 1) * pageSize;
        const msg = ctx.msg.success;
        msg.data = await ctx.service.project.tokenLog(offset, pageSize, searchParams);
        ctx.body = msg;
    }
    async exportWithdraw() {
        const { ctx } = this;
        const filePath = path.resolve(this.app.config.static.dir, 'withdraw.json');
        let result = {};
        let {...searchParams} = ctx.query;
        if (ctx.helper.isNull(searchParams)) {
            result = await ctx.model.CandyUsertokenlog.findAll({ where: {Action: 'out', Status: 3, Hash: ''}});
        } else {
            let sp = { ...searchParams, Action: 'out', Status: 3, Hash: '' };
            result = await ctx.model.CandyUsertokenlog.findAll({ where: sp });
        }
        let wd = [];
        for(let item of result) {
            let d = item.dataValues;
            wd.push({
                "BlockNumber": "",
                "Hash": "",
                "To": d.Address,
                "Amount": d.Amount
            })
        }
        fs.writeFileSync(filePath, JSON.stringify(wd));
        ctx.attachment('withdraw.json');
        ctx.set('Content-Type', 'application/octet-stream');
        ctx.body = fs.createReadStream(filePath);
    }
}

module.exports = ProjectController;
