'use strict';
const Service = require('egg').Service;

class RedPacketService extends Service {
    // 红包列表
    async redPacketList() {
        return this.ctx.model.Redpacket.findAll();
    }
    // 通过RedpacketItemId拿到红包列表
    async itemList(id) {
        return this.ctx.model.RedpacketItem.findAll({ where: { RedpacketId: id } });
    }
    // 概率列表
    async probabilityList(id) {
        return this.ctx.model.RedpacketItemProbability.findAll({ where: { RedpacketItemId: id } });
    }
    // 更新
    async updateRp(updates, id) {
        const data = {
            SentCount: updates.SentCount,
            MaxCount: updates.MaxCount,
            RedpacketName: updates.RedpacketName,
        }
        return this.ctx.model.Redpacket.update(data, { where: { RedpacketId: id } });
    }

    async createRp(creates) {
        return this.ctx.model.Redpacket.create({
            ...creates,
            Status: 1
        });
    }
    // 更新item
    async updateItem(updates, id) {
        return this.ctx.model.RedpacketItem.update(updates, { where: { RedpacketItemId: id } });
    }
    async createItem(creates) {
        return this.ctx.model.RedpacketItem.create(creates);
    }
    async deleteItem(id) {
        return this.ctx.model.RedpacketItem.destroy({ where: { RedpacketItemId: id } });
    }
    // 更新概率
    async updateProbability(updates, id) {
        const ModifyDate = this.ctx.helper.unixTimestamp();
        return this.ctx.model.RedpacketItemProbability.update({ ...updates, ModifyDate }, { where: { Id: id } })
    }
    // 创建红包概率
    async createProbability(creates) {
        const CreateDate = this.ctx.helper.unixTimestamp();
        return this.ctx.model.RedpacketItemProbability.create({ ...creates, CreateDate })
    }

    async deleteProbability(id) {
        return this.ctx.model.RedpacketItemProbability.destroy({ where: { Id: id } })
    }

    // 红包日志列表
    async redpacketLog(offset, limit, searchParams) {
        const {ctx} = this;
        let result = {};
        if (ctx.helper.isNull(searchParams)) {
            result.count = await ctx.model.RedpacketUserlog.count();
            result.rows = await ctx.model.RedpacketUserlog.findAll({ offset, limit });
        } else {
            result.count = await ctx.model.RedpacketUserlog.count({ where: searchParams });
            result.rows = await ctx.model.RedpacketUserlog.findAll({ where: searchParams, offset, limit });
        }
        return result;
    }
    // 批量添加红包
    async createRpLog(RedpacketId, Title, list) {
        const { ctx } = this;
        const t = await ctx.model.transaction();
        let notFind = [];
        let successCreate = [];
        const CreateDate = ctx.helper.unixTimestamp();
        try {
          for (let item of list) {
            let userRow = null;
            if (item.startsWith('did:ont:')) {
              userRow = await ctx.service.user.findByOntId(item);
            }
            if (item.startsWith('+')) {
              let itemArr = item.split('*');
              let nationCode = itemArr[0];
              let phone = itemArr[1];
              userRow = await ctx.service.user.findByPhone(nationCode, phone);
            }

            if (userRow === null) {
              notFind.push(item);
            } else {
              let ret = await ctx.model.RedpacketUserlog.create({
                ONTID: userRow.ONTID,
                RedpacketId,
                Title,
                Status: 0,
                CreateDate
              }, { transaction: t });
              ret.dataValues.phone = item;
              successCreate.push(ret);
            }
          }
          t.commit();
        } catch (e) {
          ctx.logger.error(e);
          t.rollback();
          notFind = [];
          successCreate = [];
        }
        return {
          notFind,
          successCreate
        }
    }
    async updateUserRpStatus(idArr, CreateDate) {
        const { ctx } = this;
        const t = await ctx.model.transaction();
        let ret = 0;
        try {
          for (let id of idArr) {
            await ctx.model.RedpacketUserlog.update({ Status: 1 }, {
              where: { Status: 0, CreateDate, Id: id},
              transaction: t
            });
          }
          t.commit();
          ret = 0;
        } catch (e) {
          ctx.logger.error(e);
          t.rollback();
          ret = -1;
        }
        return ret
    }
}

module.exports = RedPacketService;
