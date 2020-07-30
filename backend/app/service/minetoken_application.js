'use strict';
const Service = require('egg').Service;
const axios = require('axios');

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
  async modify(uid, type, reason) {
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
      // 同意发布token
      if (type === 'agree') {
        // 查询数据
        const sql = `SELECT * FROM minetokens_application WHERE uid = :uid;`;
        const [ result ] = await ctx.model.query(sql, {
          raw: true,
          replacements: {
            uid: uid
          }
        })

        if (result) {
          let { name, logo, symbol, tag } = result[0]

          // 修改发币权限
          await ctx.service.user.setMintPermission(uid, true);

          let data = {
            key: this.config.matatakiApiKey, // 服务端会验证
            uid: uid,
            name,
            logo,
            symbol,
            tags: tag.split(','),
            initialSupply: 1000 * (10 ** 4)
          }
          // 发布token
          const minetokenCreateResult = await axios.post(`${this.config.matatakiServer}/_minetoken/_create`, data)
          if (minetokenCreateResult.status === 200 && minetokenCreateResult.data.code === 0) {
            console.log('minetokenCreateResult', minetokenCreateResult.data)
          } else {
            throw new Error('error minetokenCreateResult: ', minetokenCreateResult.data)
          }
        } else {
          throw new Error('error result: ', result)
        }
      }

      let sql = 'UPDATE minetokens_application SET `status` = :status WHERE uid = :uid;';
      let options = {
        raw: true,
        replacements: {
          status: status,
          uid: uid
        }
      }
      
      // 拒绝理由
      if (type === 'reject') {
        sql = 'UPDATE minetokens_application SET `status` = :status, reason = :reason WHERE uid = :uid;';
        options.replacements.reason = reason
      }

      const [ result ] = await ctx.model.query(sql, options)

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
