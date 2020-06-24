'use strict';
const Service = require('egg').Service;
const moment = require('moment');

// 表
const EVENT_TABLE = 'notify_event';
const EVENT_RECIPIENT_TABLE = 'notify_event_recipients';

/** 行为类型 */
const ACTION_TYPES = [
  'comment', // 评论
  'like', // 点赞
  'reply', // 回复
  'follow', //关注
  'annouce', // 宣布
  'transfer'
];

/** 对象类型 */
const OBJECT_TYPES = [
  'article', // 文章
  'user', // 用户
  'comment', // 评论
  'announcement', // 公告
  'tokenWallet', // Token钱包
  'cnyWallet', // CNY钱包
  'featuredArticles' // 精选文章
];

const isValidActionAndObject = (action, objectType) => ACTION_TYPES.includes(action) && OBJECT_TYPES.includes(objectType);

class notifyService extends Service {

  /*********/
  /** Set **/
  /*********/

  /** 
   * 创建一个事件 
   * @uid 产生这个事件的用户
   * @action 用户所做的行为
   * @objectId 对象的索引
   * @objectType 行为所作用对象的类型
   * @remark 【可选】补充信息
   * @return 事件在数据库中的索引
   */
  async createEvent(uid, action, objectId, objectType, remark = null) {
    if(!isValidActionAndObject(action, objectType)) return false;

    const result = await this.ctx.model.query(`
      INSERT INTO ${EVENT_TABLE} (user_id, action, object_id, object_type, remark, create_time)
      VALUES(:user_id, :action, :object_id, :object_type, :remark, :create_time);
    `, {
      raw: true,
      replacements: {
        user_id: uid,
        action,
        object_id: objectId,
        object_type: objectType,
        remark,
        create_time: moment().utc().format('YYYY-MM-DD HH:mm:ss')
      }
    })
    return result[0]
  }

  /** 
   * 设定事件的接收者 (一个事件多个接收者)
   * @eventId 事件在数据库中的索引
   * @uid 事件接收者
   */
  async setEventRecipient(eventId, uid) {
    if(!uid || uid.length < 1) return false
    try {

      const result = await this.ctx.model.query(`
        INSERT INTO ${EVENT_RECIPIENT_TABLE} (event_id, user_id)
        VALUES(:eventId, :uid);
      `, {
        raw: true,
        replacements: {
          eventId,
          uid
        }
      });
      return result[1]
    }
    catch(e) {
      this.logger.error(e);
      return false
    }
  }

  /** 
   * 发送一个事件 (整合了创建事件与设定接收者)
   * @senderId 产生这个事件的用户
   * @receivingId 事件接收者
   * @action 用户所做的行为
   * @objectId 对象的索引
   * @objectType 行为所作用对象的类型
   * @remark 【可选】补充信息
   * @noDuplication 【默认：true】避免重复。开启时，如果参数相同的事件已经存在，将不会创建新事件。
   */
  async sendEvent(senderId, receivingId,  action, objectId, objectType, remark, noDuplication = true) {
    // 参数相同的事件如果已经存在了，就不会在创建新的
    if(noDuplication) {
      let sql = `
        SELECT * FROM ${EVENT_TABLE}
        WHERE user_id = :senderId
          AND action = :action
          AND object_id = :objectId
          AND object_type = :objectType
      `;
      let replacements = {
        senderId,
        action,
        objectId,
        objectType
      }

      if (remark) {
        sql += 'AND remark = :remark';
        replacements.remark = remark;
      }
      const existing = await this.ctx.model.query(sql, { raw: true, replacements })
      console.log('existing', existing)
      if(existing[0].length > 0) return false
    }

    // 创建事件
    const eventId = await this.createEvent(senderId, action, objectId, objectType, remark);
    if(!eventId) return false;
    // 设定事件的接收者
    const result = await this.setEventRecipient(eventId, receivingId);
    return result > 0;
  }

}

module.exports = notifyService;
