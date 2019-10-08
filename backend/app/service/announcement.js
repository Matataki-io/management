'use strict';
var sequelize = require('sequelize');

const Service = require('egg').Service;

class AnnouncementService extends Service {
    async create(baseInfo, contents) {
        const { ctx } = this;
        const result = {};

        let dbItem = await this.createBaseInfoAsync(baseInfo.StartDate, baseInfo.EndDate, baseInfo.IsActive, baseInfo.CountryCodes);

        result.baseInfo = dbItem;

        result.contents = [];
        for (let item of contents) {
            const temp = await this.createContentsAsync(item, dbItem.dataValues.Id);
            result.contents.push(temp);
        }

        return result;
    }

    async list(offset, limit, searchParams) {
        const { ctx } = this;

        let result = {};

        let and = [];
        let { StartDate, EndDate, CountryCode } = searchParams;

        if (!ctx.helper.isNull(CountryCode)) {
            CountryCode = '"' + CountryCode + '"';
        }

        let countSql = `
    SELECT
        count(1) as count
    FROM
        announcement a
        JOIN announcement_content c ON c.ParentId = a.id 
    WHERE
        c.\`Language\` = 'zh-Hans'
        `;

        let querySql = `
    SELECT
        a.*,c.Content
    FROM
        announcement a
        JOIN announcement_content c ON c.ParentId = a.id 
    WHERE
        c.\`Language\` = 'zh-Hans' 
        AND ( :local IS NULL  or JSON_CONTAINS (a.CountryCodes,:local)=1 ) LIMIT :offset, :limit `;

        const where = {};

        result.count = (await ctx.model.query(countSql, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { offset, limit },
        }))[0].count;

        result.rows = await ctx.model.query(querySql, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { offset, limit, local: CountryCode || null },
        });

        return result;
    }

    async show(id) {
        const { ctx } = this;

        const result = {};
        result.baseInfo = await ctx.model.Announcement.find({ where: { Id: id } });
        if (!result.baseInfo) {
            return null;
        }

        result.contents = await ctx.model.AnnouncementContent.findAll({ where: { ParentId: id } });

        return result;
    }

    async update(id, { baseInfo, contents }) {
        const { ctx } = this;
        const result = {};

        if (!ctx.helper.isNull(baseInfo)) {
            let model = await this.getBaseModelByProperties(baseInfo.StartDate, baseInfo.EndDate, baseInfo.IsActive, baseInfo.CountryCodes);
            result.baseInfo = await this.ctx.model.Announcement.update(model, { where: { Id: id } });
        }

        if (!ctx.helper.isNull(contents)) {
            result.contents = [];
            for (let item of contents) {
                let temp = {};
                var dbItem = this.getContentsModelByProperties(item, id);
                if (ctx.helper.isNull(item.Id)) {
                    temp = await this.ctx.model.AnnouncementContent.create(dbItem);
                } else {
                    temp = await this.ctx.model.AnnouncementContent.update(dbItem, { where: { Id: item.Id } });
                }
                result.contents.push(temp);
            }
        }
        return result;
    }

    async createBaseInfoAsync(startDate, endDate, isActive, countryCodes) {
        const { ctx } = this;

        let item = this.getBaseModelByProperties(startDate, endDate, isActive, countryCodes);

        return await ctx.model.Announcement.create(item);
    }

    getBaseModelByProperties(startDate, endDate, isActive, countryCodes) {
        let item = {
            Start: startDate,
            End: endDate,
            IsActive: isActive
        }

        if (countryCodes && countryCodes.length > 0) {
            item.CountryCodes = countryCodes;
        }
        else {
            item.CountryCodes = null;
        }

        return item;
    }

    async createContentsAsync(item, parentId) {
        const { ctx } = this;

        var item = this.getContentsModelByProperties(item, parentId);

        return await ctx.model.AnnouncementContent.create(item);
    }

    getContentsModelByProperties(item, parentId) {
        let r = {
            Language: item.Language,
            Content: item.Content,
            ParentId: parentId
        }

        return r;
    }
}

module.exports = AnnouncementService;
