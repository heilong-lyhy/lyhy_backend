'use strict';

const Service = require('egg').Service;

class PlanListService extends Service {
  async usergetPlanList(params) {
    const { ctx } = this;
    const { username } = params;
    const studyplanlist = await ctx.model.Planlist.findOne({
      where: { username },
    });


    // 解析 mainplans JSON 字符串为数组
    let mainplans = [];
    if (studyplanlist && studyplanlist.mainplans) {
      try {
        mainplans = JSON.parse(studyplanlist.mainplans);
      } catch (error) {
        ctx.logger.error('解析mainplans失败:', error);
        // 解析失败时返回空数组
        mainplans = [];
      }
    }

    const result = {
      mainplans,
    };
    return result;
  }

  async userResetPlanlist(input) {
    const { ctx } = this;
    const { username, mainplans } = input;

    try {
      // 将 mainplans 数组转换为 JSON 字符串
      const mainplansJson = JSON.stringify(mainplans || []);

      // 使用 upsert 方法更新或创建记录
      await ctx.model.Planlist.upsert({
        username,
        mainplans: mainplansJson,
      });

      return true;
    } catch (error) {
      ctx.logger.error('更新计划列表失败:', error);
      return false;
    }
  }
}

module.exports = PlanListService;
