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
            mainplans: '[1, 2, 3]',
          };
        }
        return null;
      },
    },
    Plan: {
      findOne: async options => {
        console.log('Mock Plan.findOne 执行，参数:', options.where);
        // 模拟数据库查询结果
        if (options.where.userid === 1 && options.where.planid === 1) {
          return {
            planid: 1,
            userid: 1,
            plantitle: '学习计划测试',
            description: '这是一个测试学习计划',
            plancreatedAt: new Date('2023-01-01T00:00:00Z'),
            plandeadline: new Date('2023-12-31T23:59:59Z'),
          };
        }
        return null;
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
              subtitle: '子任务1',
              description: '这是第一个子任务',
              completed: 0,
              created_at: new Date('2023-01-01T01:00:00Z'),
              updated_at: new Date('2023-01-01T01:00:00Z'),
            },
            {
              subid: 2,
              planid: 1,
              subtitle: '子任务2',
              description: '这是第二个子任务',
              completed: 1,
              created_at: new Date('2023-01-02T01:00:00Z'),
              updated_at: new Date('2023-01-03T01:00:00Z'),
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

// 模拟 StudyplanService
class MockStudyplanService {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async usergetStudyplan(params) {
    const { ctx } = this;
    const { username, planid } = params;

    try {
      // 1. 通过username在planlist中查询出userid
      const planlist = await ctx.model.Planlist.findOne({
        where: { username },
      });

      if (!planlist) {
        ctx.logger.error('未找到该用户的planlist记录:', username);
        return null;
      }

      const userid = planlist.userid;

      // 2. 通过userid和planid去plan查询出plan的内容
      const plan = await ctx.model.Plan.findOne({
        where: { userid, planid: parseInt(planid) }, // 确保planid是数字
      });

      if (!plan) {
        ctx.logger.error('未找到该用户的plan记录:', { userid, planid });
        return null;
      }

      // 3. 通过planid去subitem中查询出subitem的内容
      const subitems = await ctx.model.Subitem.findAll({
        where: { planid: parseInt(planid) }, // 确保planid是数字
      });

      // 4. 格式化日期和整合数据
      const dayjs = require('dayjs');
      const formatDate = date => dayjs(date).format('YYYY-MM-DD HH:mm:ss');

      const result = {
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

      return result;
    } catch (error) {
      ctx.logger.error('查询学习计划失败:', error);
      throw error;
    }
  }
}

// 运行测试
async function runTest() {
  try {
    // 设置环境变量
    process.env.NODE_ENV = 'development';

    console.log('开始测试学习计划查询逻辑...');

    // 初始化服务
    const studyplanService = new MockStudyplanService(mockCtx);

    // 执行查询
    const params = {
      username: 'test_user',
      planid: '1',
    };

    console.log('执行查询，参数:', params);
    const result = await studyplanService.usergetStudyplan(params);

    // 验证结果
    console.log('\n查询结果:');
    console.log(JSON.stringify(result, null, 2));

    console.log('\n测试完成！');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
runTest();