/* eslint-disable no-bitwise */
'use strict';
const Service = require('egg').Service;
const consts = require('./consts');

class UserService extends Service {
  async list(offset, limit, searchParams = null) {
    const { ctx } = this;
    const result = {};

    // searchParams = {
    //   username: { [this.app.Sequelize.Op.like]: '%aaron%' },
    // };

    if (ctx.helper.isNull(searchParams)) {
      result.count = await ctx.model.Users.count();
      result.rows = await ctx.model.Users.findAll({ order: [[ 'id', 'DESC' ]], offset, limit });
    } else {
      for (const propName in searchParams) {
        if (searchParams[propName] === null || searchParams[propName] === '') {
          // 去掉value为空的字段
          delete searchParams[propName];
        } else if ([ 'username', 'nickname' ].indexOf(propName) >= 0) {
          // username、nickname 改为like
          searchParams[propName] = { [this.app.Sequelize.Op.like]: `%${searchParams[propName]}%` };
        } else if (propName === 'isMint') {
          delete searchParams[propName];
          searchParams.status = this.app.Sequelize.where(this.app.Sequelize.literal('status & 2'), 2);
        }
      }

      result.count = await ctx.model.Users.count({ where: searchParams });
      result.rows = await ctx.model.Users.findAll({
        where: searchParams,
        order: [[ 'id', 'DESC' ]],
        offset,
        limit,
      });
    }
    return result;
  }
  // 设置种子用户 001
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
  // 设置发币用户 010
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

  async update(id, updates) {
    const result = await this.ctx.model.Users.update(updates, { where: { id } });
    return result;
  }
}

module.exports = UserService;
