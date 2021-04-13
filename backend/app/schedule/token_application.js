'use strict';

const Subscription = require('egg').Subscription;

class TokenApplication extends Subscription {
  static get schedule() {
    return {
      interval: '3m',
      type: 'worker',
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    this.ctx.service.minetokenApplication.agreeCreate();
  }
}

module.exports = TokenApplication;
