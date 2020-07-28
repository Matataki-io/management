'use strict';
const Service = require('egg').Service;


class MineTokenService extends Service {
  // fan票申请列表
  async list(pageSize, pageIndex, sort) {
    const { ctx } = this;
    try {

      let filterOrderBy = {
        'update_time': 'update_time DESC',
        'status': 'status = 2 DESC, status DESC',
      };

      let sortSql = filterOrderBy[sort] || 'update_time DESC'

      const sql = `
      SELECT * FROM minetokens_application ORDER BY ${sortSql} LIMIT :offset, :limit;
      SELECT COUNT(1) AS count FROM minetokens_application;
      `;
      const [ result ] = await ctx.model.query(sql, {
        raw: true,
        replacements: {
          offset: (pageIndex - 1) * pageSize,
          limit: pageSize
        }
      })
      return {
        count: result[1][0].count,
        list: result[0]
      };
    } catch (e) {
      console.log('MineTokenService list error', e)
      return {
        count: 0,
        list: []
      }
    }
  }
  // 修改状态
  async modify(uid, type) {
    const { ctx } = this;
    let status = ''
    if (type === 'agree') {
      status = 0
    } else if (type === 'reject') {
      status = 3
    } else {
      return { code: -1, message: '非法参数' }
    }

    try {
      const sql = 'UPDATE minetokens_application SET `status` = :status WHERE uid = :uid;';
      const [ result ] = await ctx.model.query(sql, {
        raw: true,
        replacements: {
          status: status,
          uid: uid
        }
      })

      console.log('modify result', result)

      if (result.affectedRows === 1) {
        return { code: 0 }
      }

      return { code: -1 }
    } catch (e) {
      console.log('MineTokenService list error', e)
      return { code: -1 }
    }
  }

  // fan票调研表单记录
  async surveyList(pageSize, pageIndex) {
    const { ctx } = this;
    try {
      const sql = `
      SELECT * FROM minetokens_survey ORDER BY update_time DESC LIMIT :offset, :limit;
      SELECT COUNT(1) AS count FROM minetokens_survey;
      `;
      const [ result ] = await ctx.model.query(sql, {
        raw: true,
        replacements: {
          offset: (pageIndex - 1) * pageSize,
          limit: pageSize
        }
      })

      return {
        count: result[1][0].count,
        list: result[0]
      };
    } catch (e) {
      console.log('MineTokenService surveyList error', e)
      return {
        count: 0,
        list: []
      }
    }

  }
  // 通过uid获取详情信息
  async surveyListId(uid) {
    const { ctx } = this;
    try {
      const sql = `
      SELECT * FROM minetokens_survey WHERE uid = :uid;
      `;
      const [ result ] = await ctx.model.query(sql, {
        raw: true,
        replacements: {
          uid: uid
        }
      })

      if (result) {
        return result[0]
      }
      return {}

    } catch (e) {
      console.log('MineTokenService surveyListId error', e)
      return {}
    }

  }

}

module.exports = MineTokenService;
