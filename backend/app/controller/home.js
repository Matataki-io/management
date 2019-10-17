'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, egg, version=2.15.1, ' + (this.ctx.header['x-real-ip'] || this.ctx.ip);
  }
}

module.exports = HomeController;
