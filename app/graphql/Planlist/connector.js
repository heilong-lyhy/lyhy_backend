'use strict';

class PlanlistConnector {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async usergetPlanlist(params) {
    try {
      // 使用正确的service路径
      const planlist = await this.ctx.service.studyplan.planList.usergetPlanList(params);
      return planlist;
    } catch (error) {
      console.error('PlanlistConnector error:', error);
      throw error;
    }
  }


  async userResetPlanlist(input) {
    try {
      const result = await this.ctx.service.studyplan.planList.userResetPlanlist(input);
      return result;
    } catch (error) {
      console.error('PlanlistConnector reset error:', error);
      throw error;
    }
  }
}

module.exports = PlanlistConnector;
