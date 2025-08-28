'use strict';

class PlanlistConnector {
  constructor(ctx) {
    this.ctx = ctx;
    this.service = ctx.service.studyplan.planList;
  }

  async usergetPlanlist(params) {
    const planlist = await this.service.usergetPlanList(params);
    return planlist;
  }


  async userResetPlanlist(input) {
    const result = await this.service.userResetPlanlist(input);
    return result;
  }
}

module.exports = PlanlistConnector;
