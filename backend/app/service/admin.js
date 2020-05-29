/* eslint-disable no-bitwise */
'use strict';
const Service = require('egg').Service;
const crypto = require('crypto');
const consts = require('./consts');

class AdminService extends Service {
  async list(offset, limit) {
    const { ctx } = this;
    const result = {};

    result.count = await ctx.model.AdminUser.count();
    result.rows = await ctx.model.AdminUser.findAll({ order: [[ 'id', 'DESC' ]], offset, limit });
    return result;
  }

  async get(username) {
    const { ctx } = this;
    const admin = await ctx.model.AdminUser.findOne({ where: { username } });
    return admin;
  }

  // 设置种子用户 001
  async setWallet(id, wallet) {
    const { ctx } = this;
    const result = await this.update({ wallet });
    return result;
  }

  async update(id, updates) {
    if (updates.password && updates.password.length !== 64) { 
      updates.password = crypto.createHash('sha256').update(updates.password).digest('hex')
    }
    const result = await this.ctx.model.AdminUser.update(updates, { where: { id } });
    return result;
  }

  async login(username, password) {
    const { ctx } = this;
    const encodedPassword = crypto.createHash('sha256').update(password).digest('hex')
    const admin = await ctx.model.AdminUser.findOne({ where: { username, password: encodedPassword } });
    return admin;
  }

  async addUser(username, nickname, password) {
    const { ctx } = this;
    const encodedPassword = crypto.createHash('sha256').update(password).digest('hex')
    const admin = await ctx.model.AdminUser.create({ username, nickname, password: encodedPassword });
    return admin;
  }
}

module.exports = AdminService;
