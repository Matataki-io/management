'use strict';
const Service = require('egg').Service;
const axios = require('axios');

const getTelegramAPIEndpoint = token => `https://api.telegram.org/bot${token}`;

class TelegramBotService extends Service {
  constructor(ctx) {
    super(ctx);
    this.TELEGRAM_API_Endpoint = getTelegramAPIEndpoint(this.config.telegram.botToken);
  }


  async _sendMessage({
    chat_id, text, parse_mode = 'MarkdownV2', disable_notification = false,
    disable_web_page_preview = false, reply_to_message_id, reply_markup }) {
    try {
      const { data } = await axios.post(this.TELEGRAM_API_Endpoint + '/sendMessage', {
        chat_id, text, parse_mode, disable_notification,
        disable_web_page_preview, reply_to_message_id, reply_markup,
      });
      return data;
    } catch (error) {
      this.logger.error('sendMessage error: ', error);
      if (error.data) return error.data;
      return { ok: false, result: error };
    }
  }

  async getAllTelegramBindedUser() {
    const sql = `
    select * from users 
    join user_accounts as ua 
    where ua.uid = users.id and ua.platform = :platform`;
    try {
      const [ result ] = await this.ctx.model.query(sql, {
        raw: true,
        replacements: { platform: 'telegram' },
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TelegramBotService;
