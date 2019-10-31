'use strict';
const Service = require('egg').Service;

class PostsService extends Service {
  async list(offset, limit, searchParams = null) {
    const { ctx } = this;
    const result = {};
    let condition = { channel_id: 1 };
    if (!ctx.helper.isNull(searchParams)) condition = { ...searchParams, ...condition };
    const arr = [];
    let author = null;
    for (const [ key, value ] of Object.entries(condition)) {
      if (value !== '') {
        if (key === 'title') {
          arr.push(`t1.title like '%${value}%'`);
        } else if (key === 'author') {
          author = value;
        } else {
          arr.push(`t1.${key}=${value}`);
        }
      }
    }

    // 处理查询作者
    if (!ctx.helper.isNull(author)) {
      if (/^\d+$/.test(author)) {
        arr.push(`u.id=${author}`);
      } else {
        arr.push(`(u.username like '%${author}%' OR u.nickname like '%${author}%')`);
      }
    }
    const sql = `
    SELECT t1.*, t2.down 
    FROM posts as t1 
    LEFT JOIN post_read_count as t2 ON t1.id = t2.post_id 
    INNER JOIN users u ON t1.uid = u.id
    WHERE ${arr.join(' AND ')} 
    ORDER BY id DESC
    LIMIT :offset, :limit;
    `;
    result.rows = await ctx.model.query(sql, {
      raw: true,
      model: ctx.model.Posts,
      replacements: { offset, limit },
    });
    result.count = await ctx.model.Posts.count({ where: condition });
    /* if (ctx.helper.isNull(searchParams)) {
      result.count = await ctx.model.Posts.count({ where: condition });
      result.rows = await ctx.model.Posts.findAll({
        where: condition,
        offset,
        limit,
      });
    } else {
      result.count = await ctx.model.Posts.count({ where: { ...searchParams, ...condition } });
      result.rows = await ctx.model.Posts.findAll({
        where: { ...searchParams, ...condition },
        offset,
        limit,
      });
    } */
    return result;
  }
  async show(id) {
    const result = await this.list(0, 1, { id });
    return result.rows.length > 0 ? result.rows[0] : {};
  }
}

module.exports = PostsService;
