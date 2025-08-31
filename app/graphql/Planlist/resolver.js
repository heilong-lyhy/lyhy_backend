'use strict';


module.exports = {
  Query: {
    usergetPlanlist: async (_, { params }, ctx) => {
      try {
        // 直接调用service，绕过connector
        const result = await ctx.service.studyplan.planList.usergetPlanList(params);
        // 确保总是返回有效的PlanListResponse结构，避免前端null错误
        return result || { mainplans: [] };
      } catch (error) {
        console.error('Planlist resolver error:', error);
        // 出错时返回空的计划列表，而不是抛出错误导致前端获取null
        return { mainplans: [] };
      }
    },

  },

  Mutation: {
    userResetPlanlist: async (_, { input }, ctx) => {
      try {
        // 直接调用service，绕过connector
        const result = await ctx.service.studyplan.planList.userResetPlanlist(input);
        return result;
      } catch (error) {
        console.error('Planlist reset resolver error:', error);
        throw error;
      }
    },
  },

};
