'use strict';

// Mock Egg.js 上下文
const mockCtx = {
  model: {
    Planlist: {
      findOne: async options => {
        console.log('Mock Planlist.findOne 执行，参数:', options.where);
        // 模拟数据库查询结果
        if (options.where.username === 'test_user') {
          return {
            userid: 1,
            username: 'test_user',
            mainplans: '[1, 2]',
          };
        }
        return null;
      },
    },
    Plan: {
      findAll: async options => {
        console.log('Mock Plan.findAll 执行，参数:', options.where);
        // 模拟数据库查询结果
        if (options.where.userid === 1 && (options.where.planid.includes(1) || options.where.planid.includes(2))) {
          return [
            {
              planid: 1,
              userid: 1,
              plantitle: '学习计划1',
              description: '这是第一个测试学习计划',
              plancreatedAt: new Date('2023-01-01T00:00:00Z'),
              plandeadline: new Date('2023-12-31T23:59:59Z'),
            },
            {
              planid: 2,
              userid: 1,
              plantitle: '学习计划2',
              description: '这是第二个测试学习计划',
              plancreatedAt: new Date('2023-02-01T00:00:00Z'),
              plandeadline: new Date('2023-11-30T23:59:59Z'),
            },
          ];
        }
        return [];
      },
    },
    Subitem: {
      findAll: async options => {
        console.log('Mock Subitem.findAll 执行，参数:', options.where);
        // 模拟数据库查询结果
        if (options.where.planid === 1) {
          return [
            {
              subid: 1,
              planid: 1,
              subtitle: '子任务1-1',
              description: '这是学习计划1的第一个子任务',
              completed: 0,
              created_at: new Date('2023-01-01T01:00:00Z'),
              updated_at: new Date('2023-01-01T01:00:00Z'),
            },
          ];
        } else if (options.where.planid === 2) {
          return [
            {
              subid: 2,
              planid: 2,
              subtitle: '子任务2-1',
              description: '这是学习计划2的第一个子任务',
              completed: 1,
              created_at: new Date('2023-02-01T01:00:00Z'),
              updated_at: new Date('2023-02-02T01:00:00Z'),
            },
            {
              subid: 3,
              planid: 2,
              subtitle: '子任务2-2',
              description: '这是学习计划2的第二个子任务',
              completed: 0,
              created_at: new Date('2023-02-02T01:00:00Z'),
              updated_at: new Date('2023-02-02T01:00:00Z'),
            },
          ];
        }
        return [];
      },
    },
  },
  logger: {
    error: console.error,
    info: console.info,
  },
  app: {
    config: {
      jwt: {
        jwtSecret: 'test_secret',
      },
    },
  },
};

// Mock 错误场景
const mockErrorCtx = {
  ...mockCtx,
  model: {
    ...mockCtx.model,
    Plan: {
      findAll: async () => {
        throw new Error('数据库查询失败');
      },
    },
  },
};

// Mock 无计划场景
const mockEmptyPlansCtx = {
  ...mockCtx,
  model: {
    ...mockCtx.model,
    Plan: {
      findAll: async () => {
        return [];
      },
    },
  },
};

// 加载修改后的 PlanListService
const dayjs = require('dayjs');
class PlanListService {
  constructor(ctx) {
    this.ctx = ctx;
  }

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
      const plans = await ctx.model.Plan.findAll({
        where: {
          userid,
          planid: planIds,
        },
      });

      if (!plans || plans.length === 0) {
        ctx.logger.error('未找到该用户的计划记录:', { userid, planIds });
        return { mainplans: [] };
      }

      // 4. 为每个plan并行查询对应的subitem内容
      const mainplans = await Promise.all(plans.map(async plan => {
        const subitems = await ctx.model.Subitem.findAll({
          where: { planid: plan.planid },
        });

        // 格式化日期和整合数据
        const formatDate = date => dayjs(date).format('YYYY-MM-DD HH:mm:ss');

        return {
          planid: plan.planid,
          plantitle: plan.plantitle,
          description: plan.description,
          createdAt: formatDate(plan.plancreatedAt),
          deadline: formatDate(plan.plandeadline),
          subItems: subitems.map(item => ({
            subid: item.subid,
            subtitle: item.subtitle,
            description: item.description,
            completed: item.completed === 1, // 转换为布尔值
            createdAt: item.created_at.getTime(),
            updatedAt: item.updated_at.getTime(),
          })),
        };
      }));

      return { mainplans };
    } catch (error) {
      ctx.logger.error('查询计划列表失败:', error);
      throw error;
    }
  }
}

// 运行测试
async function runTest() {
  try {
    // 设置环境变量
    process.env.NODE_ENV = 'development';
    
    console.log('===== 开始测试修改后的 PlanListService =====\n');
    
    // 测试场景1: 正常查询
    console.log('\n===== 测试场景1: 正常查询 =====');
    try {
      const planListService = new PlanListService(mockCtx);
      const params = { username: 'test_user' };
      console.log('执行查询，参数:', params);
      const result = await planListService.usergetPlanList(params);
      console.log('\n查询结果:');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('正常查询测试失败:', error);
    }

    // 测试场景2: 无计划记录
    console.log('\n===== 测试场景2: 无计划记录 =====');
    try {
      const planListService = new PlanListService(mockEmptyPlansCtx);
      const params = { username: 'test_user' };
      const result = await planListService.usergetPlanList(params);
      console.log('\n无计划记录查询结果:');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('无计划记录测试失败:', error);
    }

    // 测试场景3: 错误处理
    console.log('\n===== 测试场景3: 错误处理 =====');
    try {
      const planListService = new PlanListService(mockErrorCtx);
      const params = { username: 'test_user' };
      await planListService.usergetPlanList(params);
    } catch (error) {
      console.log('正确捕获到预期的错误:', error.message);
    }

    console.log('\n===== 所有测试完成 =====');
  } catch (error) {
    console.error('测试框架失败:', error);
  }
}

// 运行测试
runTest();