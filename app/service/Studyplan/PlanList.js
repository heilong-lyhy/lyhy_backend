'use strict';

const Service = require('egg').Service;
const dayjs = require('dayjs');

class PlanListService extends Service {
  async usergetPlanList(params) {
    const { ctx } = this;
    const { username } = params;

    try {
      // 1. 通过username在planlist中查询出userid
      const planlist = await ctx.model.Planlist.findOne({
        where: { username },
      });

      if (!planlist) {
        ctx.logger.error('未找到该用户的planlist记录:', username);
        return { mainplans: [] };
      }

      const userid = planlist.userid;

      // 2. 解析mainplans JSON字符串获取计划ID列表
      let planIds = [];
      if (planlist.mainplans) {
        try {
          planIds = JSON.parse(planlist.mainplans);
        } catch (error) {
          ctx.logger.error('解析mainplans失败:', error);
          planIds = [];
        }
      }

      if (planIds.length === 0) {
        return { mainplans: [] };
      }

      // 3. 通过userid和planIds去plan查询出所有plan的内容
      let plans = [];
      try {
        plans = await ctx.model.Plan.findAll({
          where: {
            userid,
            planid: planIds,
          },
          // 明确指定要查询的字段，避免Sequelize自动添加不存在的字段
          attributes: [ 'planid', 'userid', 'plantitle', 'description', 'plancreatedAt', 'plandeadline' ],
        });
      } catch (error) {
        ctx.logger.error('查询计划列表数据库错误:', error);
        // 数据库查询失败时返回空数组
        return { mainplans: [] };
      }

      if (!plans || plans.length === 0) {
        ctx.logger.error('未找到该用户的计划记录:', { userid, planIds });
        return { mainplans: [] };
      }

      // 4. 为每个plan并行查询对应的subitem内容
      let mainplans = [];
      try {
        mainplans = await Promise.all(plans.map(async plan => {
          let subitems = [];
          try {
            subitems = await ctx.model.Subitem.findAll({
              where: { planid: plan.planid },
              // 明确指定要查询的字段
              attributes: [ 'subid', 'planid', 'subtitle', 'description', 'completed', 'subdeadline', 'updatedAt' ],
            });
          } catch (error) {
            ctx.logger.error('查询子任务列表数据库错误:', error);
            subitems = [];
          }

          // 格式化日期和整合数据
          const formatDate = date => {
            try {
              // 返回格式化的日期字符串
              return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
            } catch (error) {
              ctx.logger.error('日期格式化错误:', error);
              // 发生错误时返回当前时间的格式化字符串
              return dayjs().format('YYYY-MM-DD HH:mm:ss');
            }
          };

          return {
            planid: plan.planid || '',
            plantitle: plan.plantitle || '',
            description: plan.description || '',
            createdAt: formatDate(plan.plancreatedAt),
            deadline: formatDate(plan.plandeadline),
            subItems: subitems.map(item => ({
              subid: item.subid || '',
              subtitle: item.subtitle || '',
              description: item.description || '',
              completed: item.completed === 1, // 转换为布尔值
              subdeadline: item.subdeadline ? dayjs(item.subdeadline).format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss'),
              updatedAt: item.updatedAt ? dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss') : dayjs().format('YYYY-MM-DD HH:mm:ss'),
            })),
          };
        }));
      } catch (error) {
        ctx.logger.error('处理计划数据错误:', error);
        mainplans = [];
      }

      return { mainplans };
    } catch (error) {
      ctx.logger.error('查询计划列表失败:', error);
      // 捕获所有其他错误，返回空的计划列表
      return { mainplans: [] };
    }
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
