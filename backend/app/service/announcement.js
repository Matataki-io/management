'use strict';
const Service = require('egg').Service;
const moment = require('moment');

const ANNOUNCEMENT_TABLE = 'announcement';
const EVENT_TABLE = 'notify_event';
const EVENT_RECIPIENTS_TABLE = 'notify_event_recipients';
const POSTS_TABLE = 'posts';

class AnnouncementService extends Service {
  /** 获取公告列表 */
  async list(pageSize, pageIndex) {
    const { ctx } = this;
    const sql = `
      SELECT
        t2.*,
        t1.id AS event_id, t1.create_time, t1.remark,
        t3.title AS post_title, t3.short_content, t3.cover
      FROM ${EVENT_TABLE} t1
      JOIN ${ANNOUNCEMENT_TABLE} t2 ON t1.object_id = t2.id
      LEFT JOIN ${POSTS_TABLE} t3 ON t3.id = t1.remark
      WHERE t1.object_type = 'announcement'
      ORDER BY t1.id DESC
      LIMIT :offset, :limit;

      SELECT
        count(1) as count
      FROM ${EVENT_TABLE} c1
      JOIN ${ANNOUNCEMENT_TABLE} c2 ON c1.object_id = c2.id
      WHERE c1.object_type = 'announcement';
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
   * @postId 【可选】引用文章的ID
   * 
   */
  async post(sender, title, content, postId) {
    const { ctx } = this;
    const announcementId = await setAnnouncement(ctx, sender, title, content);
    if(!announcementId) return false

    const sql = `
      INSERT INTO ${EVENT_TABLE} (user_id, action, object_id, object_type, remark, create_time)
      VALUES(:user_id, :action, :object_id, :object_type, :remark, :create_time);
    `;

    try {
      // 创建一个公告事件
      const result = await ctx.model.query(sql, {
        raw: true,
        replacements: {
          user_id: 0,
          action: 'annouce',
          object_id: announcementId,
          object_type: 'announcement',
          remark: postId,
          create_time: moment().utc().format('YYYY-MM-DD HH:mm:ss')
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
    const annouceId = await getAnnouceIdByeventId(ctx, eventId);
    if(!annouceId) return false;

    const sql = `
      START TRANSACTION;
        DELETE FROM ${EVENT_RECIPIENTS_TABLE} WHERE event_id = :eventId;
        DELETE FROM ${EVENT_TABLE} WHERE object_type = 'announcement' AND id = :eventId;
        DELETE FROM ${ANNOUNCEMENT_TABLE} WHERE id = :annouceId;
      COMMIT;
    `;
    try {
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
async function setAnnouncement(ctx, sender, title, content) {
  const sql = `
    INSERT INTO ${ANNOUNCEMENT_TABLE} (sender, title, content)
    VALUES(:sender, :title, :content);
  `;
  try {
    const result = await ctx.model.query(sql, {
      raw: true,
      replacements: {
        sender,
        title,
        content
      }
    });
    return result[0]
  }
  catch (e) {
    this.logger.error('Announce service error:', e);
    return false
  }
}

/** 根据事件id获取公告id */
async function getAnnouceIdByeventId(ctx, eventId) {
  const sql = `
    SELECT id, object_id FROM ${EVENT_TABLE}
    WHERE object_type = 'announcement' AND id = :eventId;
  `;
  try {
    const annouce = await ctx.model.query(sql, {
      raw: true,
      replacements: {
        eventId
      }
    });
    if(annouce && annouce[0] && annouce[0][0]) return annouce[0][0].object_id;
    else return 0;
  }
  catch (e) {
    this.logger.error('Announce service error:', e);
    return false
  }
}

module.exports = AnnouncementService;