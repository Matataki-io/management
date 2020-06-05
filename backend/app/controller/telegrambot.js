'use strict';

const Controller = require('egg').Controller;
const htmlSanitizer = require('sanitize-html');

class telegramController extends Controller {
  /**
    * Post
     */
  async sendMessageMarkdown() {
    const { ctx } = this;
    const { chat_id, text } = ctx.request.body;
    const result = await this.service.telegram._sendMessage({ chat_id, text });
    ctx.body = { ...ctx.msg.success, result };
  }

  /**
   * Post
   */
  async sendMessageHtml() {
    const { ctx } = this;
    const { chat_id, html } = ctx.request.body;
    const result = await this.service.telegram._sendMessage({ chat_id, text: html, parse_mode: 'HTML' });
    ctx.body = { ...ctx.msg.success, result };
  }

  /**
    * Post
    */
  async boardcastMessageMarkdown() {
    const { ctx } = this;
    const { chat_ids, text, disable_notification = true } = ctx.request.body;
    const requests = chat_ids.map(chat_id => this.service.telegram._sendMessage({ chat_id, text, disable_notification }));
    const result = await Promise.all(requests);
    await this.service.logging.addLog('broadcast', ctx.user.id, {
      msgType: 'telegram',
      sentMessage: text
    })
    ctx.body = { ...ctx.msg.success, result };
  }

  /**
   * Post
   */
  async boardcastMessageHtml() {
    const { ctx } = this;
    let { chat_ids, html, disable_notification = true } = ctx.request.body;
    html = htmlSanitizer(html, {
      allowedTags: [ 'a', 'b', 'i', 'em', 'ins', 'strong', 'strike', 'del', 's', 'u', 'a', 'code', 'pre' ],
      allowedAttributes: {
        a: [ 'href' ],
      },
    });
    const requests = chat_ids.map(chat_id => this.service.telegram._sendMessage({ chat_id, text: html, disable_notification, parse_mode: 'HTML' }));
    const result = await Promise.all(requests);
    await this.service.logging.addLog('broadcast', ctx.user.id, {
      msgType: 'telegram',
      sentMessage: html
    })
    ctx.body = { ...ctx.msg.success, result };
  }

  async getAllTelegramBindedUser() {
    try {
      const result = await this.service.telegram.getAllTelegramBindedUser();
      this.ctx.body = { ...this.ctx.msg.success, result };
    } catch (error) {
      this.ctx.body = { error };
    }
  }
}

module.exports = telegramController;
