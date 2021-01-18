'use strict';

const Controller = require('egg').Controller;
const { utils } = require('ethers');
const { Requirements } = require('../constants');
const uaParser = require('ua-parser-js');

class LoginController extends Controller {
  // async login() {
  //   const { ctx } = this;
  //   const { username, password } = ctx.request.body;
  //   const user = await this.service.admin.login(username, password);
  //   if (!user) {
  //     ctx.body = ctx.msg.loginFailed;
  //     return;
  //   }
  //   const msg = ctx.msg.success;
  //   msg.data = ctx.helper.jwtSign({ id: user.id, username, password });
  //   const ua = uaParser(ctx.get('user-agent'));
  //   await this.service.logging.addLog('login', user.id, {
  //     ip: ctx.ip,
  //     os: ua.os,
  //     browser: ua.browser
  //   })
  //   ctx.body = msg;
  // }

  async loginBySignature() {
    const { ctx } = this;
    const { data, signature } = ctx.request.body;
    // @todo: under test, need better review
    // get address from signature first
    try {
      if (Date.now() >= (data.timestamp * 1000)) throw new Error('Outdated Request');
      if (data.action !== 'login') throw new Error('Bad Request');
      const address = this.service.stake.getAddressFrom(data, signature);

      const { stakeBalance, stakeExpireAt } = await this.service.stake.getStakeStatus(address);
      const parsedMinimumStakeRequirement = utils.parseUnits(Requirements.MINIMUM_UNIT_FOR_LOGIN, 4);

      // 判断抵押的代币余额满不满足条件
      // 若不符合 stakeBalance >= parsedMinimumStakeRequirement 则报错
      if (parsedMinimumStakeRequirement.gt(stakeBalance)) {
        throw new Error(`Not Enough Stake for ${address} to Login. Minimum is ${Requirements.MINIMUM_UNIT_FOR_LOGIN} META`);
      }
      // 判断抵押的有效期
      if (Date.now() >= stakeExpireAt.getTime()) {
        throw new Error('Require restake');
      }
      console.info('loginBySignature::result', stakeBalance);
      const msg = ctx.msg.success;
      msg.data = { address, stakeBalance };
      ctx.body = msg;
      msg.data = ctx.helper.jwtSign({ address }, stakeExpireAt);
      // const ua = uaParser(ctx.get('user-agent'));
      // await this.service.logging.addLog('login', 0, {
      //   ip: ctx.ip,
      //   wallet: ctx.user.address,
      //   os: ua.os,
      //   browser: ua.browser,
      // });
    } catch (error) {
      ctx.body = {
        ...ctx.msg.loginFailed,
        data: { message: error.message },
      };
    }

  }
}

module.exports = LoginController;
