/* eslint-disable no-bitwise */
'use strict';
const Service = require('egg').Service;
const consts = require('./consts');

class UserService extends Service {
  // 设置种子用户 010
  async setSeedPermission(id, permission = true) {
    const { ctx } = this;
    const user = await ctx.model.Users.find({ where: { id } });
    let status;
    if (permission) {
      status = user.status | parseInt('001', 2);
    } else {
      status = user.status & parseInt('110', 2);
    }
    const result = await ctx.model.Users.update({ status }, { where: { id } });
    return result;
  }
  // 设置发币用户 001
  async setMintPermission(id, permission = true) {
    const { ctx } = this;
    const user = await ctx.model.Users.find({ where: { id } });
    let status;
    if (permission) {
      status = user.status | parseInt('010', 2);
    } else {
      status = user.status & parseInt('101', 2);
    }
    const result = await ctx.model.Users.update({ status }, { where: { id } });
    return result;
  }
  // 设置交易权限 100
  async setExchangePermission(id, permission = true) {
    const { ctx } = this;
    const user = await ctx.model.Users.find({ where: { id } });
    let status;
    if (permission) {
      status = user.status | parseInt('100', 2);
    } else {
      status = user.status & parseInt('011', 2);
    }
    const result = await ctx.model.Users.update({ status }, { where: { id } });
    return result;
  }
}

module.exports = UserService;
