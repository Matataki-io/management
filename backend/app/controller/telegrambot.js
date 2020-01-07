'use strict';

const Controller = require('egg').Controller;

class TelegramBotController extends Controller {
  /**
     * Post
     */
  async sendMessageMarkdown() {
    const { ctx } = this;
    const { chat_id, text } = ctx.request.body;
    const result = await this.service.telegrambot._sendMessage({ chat_id, text });
    ctx.body = result;
  }

  /**
   * Post
   */
  async sendMessageHtml() {
    const { ctx } = this;
    const { chat_id, html } = ctx.request.body;
    const result = await this.service.telegrambot._sendMessage({ chat_id, text: html, parse_mode: 'HTML' });
    ctx.body = result;
  }
}

module.exports = TelegramBotController;
