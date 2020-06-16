'use strict';
const Service = require('egg').Service;
const moment = require('moment');

const ANNOUNCEMENT_TABLE = 'announcement';
const EVENT_TABLE = 'notify_event';
const EVENT_RECIPIENTS_TABLE = 'notify_event_recipients';
const POSTS_TABLE = 'posts';

class AnnouncementService extends Service {
  /** 获取公告列表 */
  async list(pageSize, pageIndex, filter) {
    const { ctx } = this;

    let filterSql = {
      all: '',
      informInstant: ' AND t2.inform_instant = 1',
      informNewUser: ' AND t2.inform_new_user = 1'
    }[filter];

    const sql = `
      SELECT
        t2.*,
        t1.id AS event_id, t1.create_time, t1.remark,
        t3.title AS post_title, t3.short_content, t3.cover
      FROM ${EVENT_TABLE} t1
      JOIN ${ANNOUNCEMENT_TABLE} t2 ON t1.object_id = t2.id
      LEFT JOIN ${POSTS_TABLE} t3 ON t3.id = t1.remark
      WHERE t1.object_type = 'announcement'${filterSql}
      ORDER BY t1.id DESC
      LIMIT :offset, :limit;

      SELECT
        count(1) as count
      FROM ${EVENT_TABLE} t1
      JOIN ${ANNOUNCEMENT_TABLE} t2 ON t1.object_id = t2.id
      WHERE t1.object_type = 'announcement'${filterSql};
    `;
    try {
      const result = await ctx.model.query(sql, {
        raw: true,
        replacements: {
          offset: (pageIndex - 1) * pageSize,
          limit: pageSize
        }
      });
      return {
        list: result[0][0],
        count: result[0][1][0].count
      }
    }
    catch(e) {
      this.logger.error('Announce service error:', e);
      return {
        list: [],
        count: 0
      }
    }
  }
  /** 
   * 发布公告 
   * @sender 发件人
   * @title 公告标题
   * @content 公告正文
   * @postId 引用文章的ID (传入0表示不引用
   * @informInstant 即时公告
   * @informNewUser 新用户公告
   * @expireTime 到期时间（用于新用户公告
   */
  async post(sender, title, content, postId, informInstant, informNewUser, expireTime = null) {
    const { ctx } = this;

    try {
      const announcementId = await setAnnouncement(ctx, sender, title, content, informInstant, informNewUser, expireTime);
      if(!announcementId) return false

      const sql = `
        INSERT INTO ${EVENT_TABLE} (user_id, action, object_id, object_type, remark, create_time)
        VALUES(:userId, :action, :objectId, :objectType, :remark, :createTime);
      `;

      // 创建一个公告事件
      const result = await ctx.model.query(sql, {
        raw: true,
        replacements: {
          userId: 0,
          action: 'annouce',
          objectId: announcementId,
          objectType: 'announcement',
          remark: postId,
          createTime: moment().utc().format('YYYY-MM-DD HH:mm:ss')
        }
      });
      return result[1] > 0
    }
    catch(e) {
      this.logger.error('Announce service error:', e);
      return false
    }
  }

  /** 删除公告 */
  async delete(eventId) {
    const { ctx } = this;

    try {
      const annouceId = await getAnnouceIdByeventId(ctx, eventId);
      if(!annouceId) return false;

      const sql = `
        START TRANSACTION;
          DELETE FROM ${EVENT_RECIPIENTS_TABLE} WHERE event_id = :eventId;
          DELETE FROM ${EVENT_TABLE} WHERE object_type = 'announcement' AND id = :eventId;
          DELETE FROM ${ANNOUNCEMENT_TABLE} WHERE id = :annouceId;
        COMMIT;
      `;
      const result = await ctx.model.query(sql, {
        raw: true,
        replacements: {
          eventId,
          annouceId
        }
      });
      return true
    }
    catch(e) {
      this.logger.error('Announce service error:', e);
      return false
    }
  }
}

/** 设定公告内容  */
async function setAnnouncement(ctx, sender, title, content, informInstant, informNewUser, expireTime = null) {
  const sql = `
    INSERT INTO ${ANNOUNCEMENT_TABLE} (sender, title, content, inform_instant, inform_new_user, expire_time)
    VALUES(:sender, :title, :content, :informInstant, :informNewUser, :expireTime);
  `;
  const result = await ctx.model.query(sql, {
    raw: true,
    replacements: {
      sender,
      title,
      content,
      informInstant,
      informNewUser,
      expireTime
    }
  });
  return result[0]
}

/** 根据事件id获取公告id */
async function getAnnouceIdByeventId(ctx, eventId) {
  const sql = `
    SELECT id, object_id FROM ${EVENT_TABLE}
    WHERE object_type = 'announcement' AND id = :eventId;
  `;
  const annouce = await ctx.model.query(sql, {
    raw: true,
    replacements: {
      eventId
    }
  });
  if(annouce && annouce[0] && annouce[0][0]) return annouce[0][0].object_id;
  else return 0;
}

module.exports = AnnouncementService;
