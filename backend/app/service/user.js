'use strict';
const Service = require('egg').Service;

class UserService extends Service {
    async list(offset, limit, searchParams = null) {
        const {ctx} = this;
        let result = {};
        if (ctx.helper.isNull(searchParams)) {
            result.count = await ctx.model.User.count();
            result.rows = await ctx.model.User.findAll({ offset, limit });
        } else {
            result.count = await ctx.model.User.count({ where: searchParams });
            result.rows = await ctx.model.User.findAll({ where: searchParams, offset, limit });
        }
        return result;
    }
    /*
    * return { userObj:{}, redPacket: [] }
    * */
    async show(ontId) {
        const user = {};
        user.userObj = await this.ctx.model.User.find({ where: { ONTID: ontId } });
        user.redPacket = await this.ctx.model.RedpacketUserlog.findAll({ where: { ONTID: ontId } });
        user.tokenList = await this.ctx.model.CandyUsertokenlog.findAll({ where: { ONTID: ontId } });
        return user;
    }

    async dashboard() {
        const {ctx} = this;
        const result = {};
        // 监控每天领取次数大于1次的用户
        const sql1 = `SELECT ONTID, FROM_UNIXTIME(CreateDate, '%Y-%m-%d') AS Date, COUNT(1) AS Count
                        FROM candy_usertokenlog 
                        WHERE Action='in'
                        GROUP BY ONTID, FROM_UNIXTIME(CreateDate, '%Y-%m-%d')
                        HAVING(Count > 1)
                        ORDER BY Count DESC;`;
        result.userGetTokenGt1List = await ctx.model.query(sql1, {
            raw: true,
            model: ctx.model.CandyUsertokenlog,
        });
        // 监控每天领取数量大于5000的用户
        const sql2 = `SELECT ONTID, FROM_UNIXTIME(CreateDate, '%Y-%m-%d') AS Date, ROUND(SUM(Amount)) AS Amount
                        FROM candy_usertokenlog 
                        WHERE Action='in'
                        GROUP BY ONTID, FROM_UNIXTIME(CreateDate, '%Y-%m-%d')
                        HAVING(Amount > 5000)
                        ORDER BY Amount DESC;`;
        result.userGetAmountGt5000List = await ctx.model.query(sql2, {
            raw: true,
            model: ctx.model.CandyUsertokenlog,
        });
        // 每日发放糖果量
        const sql3 = `SELECT d.ProjectId,p.TokenName, ROUND(Amount,2) AS Amount, FROM_UNIXTIME(d.CreateDate, '%Y-%m-%d') AS Date
                        FROM candy_userproject_daily d 
                        INNER JOIN candy_project p ON d.projectId=p.ProjectId 
                        ORDER BY d.ProjectId, d.CreateDate;`;
        result.daySentTokenAmountList = await ctx.model.query(sql3, {
            raw: true,
            model: ctx.model.CandyUserprojectDaily,
        });
        // 总共发放糖果量
        const sql4 = `SELECT d.ProjectId,p.TokenName, ROUND(SUM(Amount),2) AS TotalAmount 
                        FROM candy_userproject_daily d
                        INNER JOIN candy_project p ON d.projectId=p.ProjectId 
                        GROUP BY ProjectId ORDER BY ProjectId;`;
        result.allSentTokenAmountList = await ctx.model.query(sql4, {
            raw: true,
            model: ctx.model.CandyUserprojectDaily,
        });
        // 每日有效红包数量
        const sql5 = `SELECT l.RedpacketId,r.RedpacketName,FROM_UNIXTIME(l.ReadyDate, '%Y-%m-%d') AS Date,COUNT(1) AS Count
                        FROM redpacket_userlog l
                        INNER JOIN redpacket r ON r.RedpacketId=l.RedpacketId
                        WHERE l.\`Status\`>=1
                        GROUP BY RedpacketId, FROM_UNIXTIME(l.ReadyDate, '%Y-%m-%d');`;
        result.dayValidRpAmountList = await ctx.model.query(sql5, {
            raw: true,
            model: ctx.model.RedpacketUserlog,
        });
        // 总有效红包数量
        const sql6 = `SELECT COUNT(1) AS Count FROM redpacket_userlog WHERE \`Status\`>=1;`;
        result.allValidRpCount = await ctx.model.query(sql6, {
            raw: true,
            model: ctx.model.RedpacketUserlog,
        });
        // 每日注册量
        const sql7 = `SELECT FROM_UNIXTIME(CreateDate, '%Y-%m-%d') AS Date, COUNT(1) AS Count
                        FROM \`user\` 
                        GROUP BY FROM_UNIXTIME(CreateDate, '%Y-%m-%d');`;
        result.dayRegisterList = await ctx.model.query(sql7, {
            raw: true,
            model: ctx.model.User,
        });
        // 总注册量
        const sql8 = `SELECT COUNT(1) AS Count FROM \`user\`;`;
        result.allRegisterCount = await ctx.model.query(sql8, {
            raw: true,
            model: ctx.model.User,
        });
        // 每日认证数量
        const sql9 = `SELECT FROM_UNIXTIME(AuthDate, '%Y-%m-%d') AS Date, COUNT(1) AS Count
                        FROM \`user\` 
                        WHERE IsCertification=1
                        GROUP BY FROM_UNIXTIME(AuthDate, '%Y-%m-%d');`;
        result.dayCertLit = await ctx.model.query(sql9, {
            raw: true,
            model: ctx.model.User,
        });
        // 总认证数量
        const sql10 = `SELECT COUNT(1) AS Count FROM \`user\` WHERE IsCertification=1;`;
        result.allCertCount = await ctx.model.query(sql10, {
            raw: true,
            model: ctx.model.User,
        });
        return result;
    }

    async findByPhone(NationalCode, Mobile) {
        return this.ctx.model.User.find({ where: { NationalCode, Mobile } });
    }
    async findByOntId(ONTID) {
        return this.ctx.model.User.find({ where: { ONTID } });
    }
}

module.exports = UserService;
