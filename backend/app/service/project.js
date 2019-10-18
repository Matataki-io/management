'use strict';
const Service = require('egg').Service;

class ProjectService extends Service {
  async list(offset, limit, searchParams) {
    const { ctx } = this;
    const result = {};
    if (ctx.helper.isNull(searchParams)) {
      result.count = await ctx.model.CandyProject.count();
      result.rows = await ctx.model.CandyProject.findAll({ offset, limit });
    } else {
      // 如果ProjectId存在就忽略其他条件
      if (!ctx.helper.isNull(searchParams.ProjectId)) {
        result.count = await ctx.model.CandyProject.count({ where: { ProjectId: searchParams.ProjectId } });
        result.rows = await ctx.model.CandyProject.findAll({ where: { ProjectId: searchParams.ProjectId }, offset, limit });
      } else {
        const and = [];
        const { StartDate, EndDate, BlockChainName } = searchParams;
        /* if (!ctx.helper.isNull(StartDate)) {
                            and.push({StartDate: {$gte: StartDate}})
                        }
                        if (!ctx.helper.isNull(EndDate)) {
                            and.push({EndDate: {$lte: EndDate}})
                        }*/
        if (!ctx.helper.isNull(BlockChainName)) {
          and.push({ BlockChainName });
        }
        result.count = await ctx.model.CandyProject.count({ where: { $and: and } });
        result.rows = await ctx.model.CandyProject.findAll({ where: { $and: and }, offset, limit });
      }
    }
    return result;
  }
  async getAll() {
    const { ctx } = this;
    const result = {};
    result.count = await ctx.model.CandyProject.count();
    result.rows = await ctx.model.CandyProject.findAll();
    return result;
  }

  async show(id) {
    const project = {};
    const projectObj = await this.ctx.model.CandyProject.find({ where: { ProjectId: id } });
    const socialMedia = await this.ctx.model.CandyProjectsocialmedia.findAll({ where: { ProjectId: id } });
    const projectMultiLang = await this.ctx.model.CandyProjectmultilanguage.findAll({ where: { ProjectId: id } });
    project.projectObj = projectObj;
    project.socialMedia = socialMedia;
    project.projectMultiLang = projectMultiLang;
    return project;
  }

  async create(projectObj, socialMedia, projectMultiLang) {
    const { ctx } = this;
    const result = {};
    result.projectObj = await ctx.model.CandyProject.create(projectObj);
    const ProjectId = result.projectObj.dataValues.ProjectId;
    result.socialMedia = [];
    const CreateDate = ctx.helper.unixTimestamp();
    for (const item of socialMedia) {
      if (item.checked) {
        const temp = await ctx.model.CandyProjectsocialmedia.create({ ProjectId, CreateDate, ...item });
        result.socialMedia.push(temp);
      }
    }
    result.projectMultiLang = [];
    for (const item of projectMultiLang) {
      const temp = await ctx.model.CandyProjectmultilanguage.create({ ProjectId, ...item });
      result.projectMultiLang.push(temp);
    }
    return result;
  }

  async update(id, { projectObj, socialMedia, projectMultiLang }) {
    const { ctx } = this;
    const result = {};
    if (!ctx.helper.isNull(projectObj)) {
      const { WithdrawTotalAmount, ...rest } = projectObj;
      result.projectObj = await this.ctx.model.CandyProject.update(rest, { where: { ProjectId: id } });
    }
    if (!ctx.helper.isNull(socialMedia)) {
      result.socialMedia = [];
      for (const item of socialMedia) {
        let temp = {};
        // Id为空就需要新创建，否则更新
        if (ctx.helper.isNull(item.Id)) {
          if (item.checked) {
            temp = await this.ctx.model.CandyProjectsocialmedia.create({ ProjectId: id, ...item });
          }
        } else {
          if (item.checked) {
            temp = await this.ctx.model.CandyProjectsocialmedia.update(item, { where: { Id: item.Id } });
          } else {
            temp = await this.ctx.model.CandyProjectsocialmedia.destroy({ where: { Id: item.Id } });
          }
        }
        result.socialMedia.push(temp);
      }
    }
    if (!ctx.helper.isNull(projectMultiLang)) {
      result.projectMultiLang = [];
      for (const item of projectMultiLang) {
        let temp = {};
        if (ctx.helper.isNull(item.Id)) {
          temp = await this.ctx.model.CandyProjectmultilanguage.create({ ProjectId: id, ...item });
        } else {
          temp = await this.ctx.model.CandyProjectmultilanguage.update(item, { where: { Id: item.Id } });
        }
        result.socialMedia.push(temp);
      }
    }
    return result;
  }

  async tokenLog(offset, limit, searchParams) {
    const { ctx } = this;
    const result = {};
    if (ctx.helper.isNull(searchParams)) {
      result.count = await ctx.model.CandyUsertokenlog.count({ where: { Action: 'out', Status: 3, Hash: '' } });
      result.rows = await ctx.model.CandyUsertokenlog.findAll({ offset, limit, where: { Action: 'out', Status: 3, Hash: '' } });
    } else {
      const sp = { ...searchParams, Action: 'out', Status: 3, Hash: '' };
      result.count = await ctx.model.CandyUsertokenlog.count({ where: sp });
      result.rows = await ctx.model.CandyUsertokenlog.findAll({ where: sp, offset, limit });
    }
    return result;
  }
}

module.exports = ProjectService;
