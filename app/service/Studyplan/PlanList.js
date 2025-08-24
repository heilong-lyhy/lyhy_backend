'use strict';

const Service = require('egg').Service;

class PlanListService extends Service {
  async usergetPlanList(params) {
    const { ctx } = this;
    const { username } = params;
    const studyplanlist = await ctx.model.Planlist.findOne({
      where: { username },
    });


    const result = {
      mainplans: studyplanlist.mainplans,
      // ...studyplan.dataValues,
      // createdAt: formatDate(studyplan.created_at),
      // deadline: formatDate(studyplan.deadline),
      // subItems: studyplan.subItems.map(item => ({
      //   ...item.dataValues,
      //   createdAt: item.created_at.getTime(),
      //   updatedAt: item.updated_at.getTime(),
      // })),
    };
    return result;
  }
}

module.exports = PlanListService;
