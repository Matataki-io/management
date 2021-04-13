'use strict';
const Service = require('egg').Service;
const axios = require('axios');
const moment = require('moment');
const _ = require('lodash');
const { transformForOneArray } = require('../utils/index');

class MineTokenService extends Service {
  // fan票申请列表
  async list(pageSize, pageIndex, sort) {
    const { ctx } = this;
    try {

      const filterOrderBy = {
        update_time: 'm.update_time DESC',
        status: 'm.status = 2 DESC, m.status DESC',
      };

      const sortSql = filterOrderBy[sort] || 'update_time DESC';

      const sql = `
      SELECT m.*, u.account AS email FROM minetokens_application m 
      LEFT JOIN user_accounts u ON m.uid = u.uid AND u.platform = 'email'
      ORDER BY ${sortSql} LIMIT :offset, :limit;
      SELECT COUNT(1) AS count FROM minetokens_application;
      `;
      const [ result ] = await ctx.model.query(sql, {
        raw: true,
        replacements: {
          offset: (pageIndex - 1) * pageSize,
          limit: pageSize,
        },
      });

      const list = result[0];

      // 获取申请队列的token并添加新字段
      // 获取提交的申请
      const sqlApplicationToken = 'SELECT * FROM minetokens_application  WHERE `status` = 2;';
      const [ resultApplicationToken ] = await ctx.model.query(sqlApplicationToken);
      this.logger.info('resultApplicationToken', resultApplicationToken);

      if (_.isEmpty(resultApplicationToken)) {
        list.forEach(i => {
          i.queue = 0;
        });
      } else {
        // 根据提交的申请获取队列信息
        let sqlApplicationTokenQueue = '';
        resultApplicationToken.forEach(i => {
          sqlApplicationTokenQueue += `SELECT * FROM minetokens_application_queue WHERE application_id = ${i.id} AND uid = ${i.uid} AND token_id IS NULL;`;
        });
        const [ resultApplicationTokenQueue ] = await ctx.model.query(sqlApplicationTokenQueue);
        this.logger.info('resultApplicationTokenQueue', resultApplicationTokenQueue);

        const resultApplicationTokenQueueFlat = transformForOneArray(resultApplicationTokenQueue);
        this.logger.info('resultApplicationTokenQueueFlat', resultApplicationTokenQueueFlat);


        // 是否在队列里面 0 false 1 true
        const isInQueue = (item, resultApplicationTokenQueueFlat) => {
          const status = resultApplicationTokenQueueFlat.find(i => i.application_id === item.id && i.uid === item.uid);
          return status ? 1 : 0;
        };

        list.forEach(i => {
          i.queue = isInQueue(i, resultApplicationTokenQueueFlat);
        });
      }

      return {
        count: result[1][0].count,
        list,
      };
    } catch (e) {
      console.log('MineTokenService list error', e);
      return {
        count: 0,
        list: [],
      };
    }
  }
  // 修改状态
  async modify(uid, type, reason) {
    const { ctx } = this;
    let status = '';
    if (type === 'agree') {
      status = 0;
    } else if (type === 'reject') {
      status = 3;
    } else {
      return { code: -1, message: '非法参数' };
    }

    try {
      let tokenId;
      // 同意发布token
      if (type === 'agree') {
        // 查询数据
        const sql = 'SELECT * FROM minetokens_application WHERE uid = :uid;';
        const [ result ] = await ctx.model.query(sql, {
          raw: true,
          replacements: {
            uid,
          },
        });

        if (result) {
          const { name, logo, symbol, brief, tag } = result[0];

          // 修改发币权限
          const resultMintPermission = await ctx.service.user.setMintPermission(uid, true);
          this.logger.info('resultMintPermission', resultMintPermission);

          const data = {
            key: this.config.matatakiApiKey, // 服务端会验证
            uid,
            name,
            logo,
            symbol,
            brief,
            tags: tag.split(','),
            initialSupply: 1000 * (10 ** 4),
          };
          // 发布token
          const minetokenCreateResult = await axios.post(`${this.config.matatakiServer}/_minetoken/_create`, data);
          if (minetokenCreateResult.status === 200 && minetokenCreateResult.data.code === 0) {
            console.log('minetokenCreateResult', minetokenCreateResult.data);
            tokenId = minetokenCreateResult.data.data;
          } else {
            console.log(minetokenCreateResult.data);
            throw new Error(`error minetokenCreateResult: ${minetokenCreateResult.data.message}`);
          }
        } else {
          throw new Error('error result: ', result);
        }
      }

      let sql = 'UPDATE minetokens_application SET `status` = :status WHERE uid = :uid;';
      const options = {
        raw: true,
        replacements: {
          status,
          uid,
        },
      };

      // 拒绝理由
      if (type === 'reject') {
        sql = 'UPDATE minetokens_application SET `status` = :status, reason = :reason WHERE uid = :uid;';
        options.replacements.reason = reason;
      }

      const [ result ] = await ctx.model.query(sql, options);

      console.log('modify result', result);

      if (result.affectedRows === 1) {
        return { code: 0, data: { token_id: tokenId } };
      }

      return { code: -1 };
    } catch (e) {
      console.log('modify error', e);
      return {
        code: -1,
        message: e.toString(),
      };
    }
  }
  // 同意申请
  async agree({ uid }) {
    const { ctx } = this;
    try {
      // 查询有没有数据 并且 是在申请中
      const sql = 'SELECT * FROM minetokens_application WHERE uid = :uid AND `status` = 2;';
      const [ resultApplication ] = await ctx.model.query(sql, {
        raw: true,
        replacements: {
          uid,
        },
      });
      this.logger.info('resultApplication', resultApplication);
      if (_.isEmpty(resultApplication)) {
        throw new Error(`没有这条申请数据${uid}`);
      }

      // 插入队列
      const time = moment().utc().format('YYYY-MM-DD HH:mm:ss');
      const sqlPushQueue = 'INSERT INTO minetokens_application_queue(application_id, uid, status, create_time, update_time) VALUES(:application_id, :uid, :status, :create_time, :update_time);';
      const [ resultApplicationQueue ] = await ctx.model.query(sqlPushQueue, {
        raw: true,
        replacements: {
          application_id: resultApplication[0].id,
          uid,
          status: 0,
          create_time: time,
          update_time: time,
        },
      });
      console.log('resultApplicationQueue', resultApplicationQueue);

      return {
        code: 0,
      };
    } catch (e) {
      this.logger.error('error', e);
      return {
        code: -1,
        message: e.toString(),
      };
    }
  }
  // 开始处理申请队列任务
  async agreeCreate() {
    const { ctx } = this;
    try {
      // 取最早的一条数据 status = 0 and tokenid is null
      const sqlQueue = 'SELECT * FROM minetokens_application_queue WHERE token_id IS NULL AND status = 0 ORDER BY create_time ASC LIMIT 0, 1;';
      const [ resultQueue ] = await ctx.model.query(sqlQueue);
      this.logger.info('resultQueue', resultQueue);

      if (_.isEmpty(resultQueue)) {
        this.logger.info('没有需要处理的申请数据');
        return {
          code: -1,
          message: '没有需要处理的申请数据',
        };
      }

      // 开始创建
      const uid = resultQueue[0].uid;
      const type = 'agree';
      const reason = '';
      // console.log('uid', uid, type, reason);
      const resultAgree = await this.modify(uid, type, reason);
      // const resultAgree = { code: -1, data: { token_id: 1 } };

      let sqlUpdateQueue = '';
      let replacements = {};
      const time = moment().utc().format('YYYY-MM-DD HH:mm:ss');

      if (resultAgree.code === 0) {
        // 更新 token_id status
        sqlUpdateQueue = 'UPDATE minetokens_application_queue SET token_id = :token_id, status = :status, update_time = :update_time WHERE application_id = :application_id AND uid = :uid;';
        replacements = {
          token_id: resultAgree.data.token_id,
          status: 1,
          application_id: resultQueue[0].application_id,
          uid: resultQueue[0].uid,
          update_time: time,
        };
      } else {
        // 更新 status
        sqlUpdateQueue = 'UPDATE minetokens_application_queue SET status = :status, update_time = :update_time WHERE application_id = :application_id AND uid = :uid;';
        replacements = {
          status: 1,
          application_id: resultQueue[0].application_id,
          uid: resultQueue[0].uid,
          update_time: time,
        };

        const text = `创建Fan票异常提醒：创建失败 - uid:${uid}，请相关开发者尽快处理！`;
        await this.service.robot.pushToDingTalk({ text });
        this.logger.info(text);
      }

      // 更新数据
      const [ resultUpdateQueue ] = await ctx.model.query(sqlUpdateQueue, {
        raw: true,
        replacements,
      });

      this.logger.info('resultUpdateQueue', resultUpdateQueue);

      if (resultUpdateQueue.affectedRows === 1) {
        //
      } else {
        throw new Error('更新失败');
      }

      return {
        code: 0,
      };
    } catch (e) {
      this.logger.error('error', e);
      return {
        code: -1,
        message: e.toString(),
      };
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
          limit: pageSize,
        },
      });

      return {
        count: result[1][0].count,
        list: result[0],
      };
    } catch (e) {
      console.log('MineTokenService surveyList error', e);
      return {
        count: 0,
        list: [],
      };
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
          uid,
        },
      });

      if (result) {
        return result[0];
      }
      return {};

    } catch (e) {
      console.log('MineTokenService surveyListId error', e);
      return {};
    }

  }

}

module.exports = MineTokenService;
