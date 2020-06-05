/* eslint-disable no-bitwise */
'use strict';
const Service = require('egg').Service;
const crypto = require('crypto');
const consts = require('./consts');

class LogService extends Service {
  async list(offset, limit) {
    const { ctx } = this;
    const result = {};

    result.count = await ctx.model.AdminAction.count();
    result.rows = await ctx.model.AdminAction.findAll({ order: [[ 'id', 'DESC' ]], offset, limit });
    return result;
  }

  async get(id) {
    const { ctx } = this;
    const log = await ctx.model.AdminAction.findOne({ where: { id } });
    return log;
  }


  async addLog(source, uid, data, type = 'info') {
    const { ctx } = this;
    if (typeof data === 'object') data = JSON.stringify(data);
    const log = await ctx.model.AdminAction.create({ uid, data, source, type, timestamp: new Date().getTime() });
    return log;
  }
}

module.exports = LogService;
