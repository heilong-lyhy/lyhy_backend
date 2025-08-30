'use strict';

/**
 * 模拟前端请求测试脚本
 * 用于测试 graphql_response_handler 中间件和 PlanListService 是否能正确处理请求
 */

// 模拟 ctx 对象
const mockCtx = {
  request: {
    url: '/graphql',
    method: 'POST',
    header: {
      'content-type': 'application/json',
      token: 'test_token', // 使用测试token
    },
    body: {
      query: 'query usergetPlanlist($params: PlanList) { usergetPlanlist(params: $params) }',
      operationName: 'usergetPlanlist',
      variables: {
        params: {
          username: '用户名值',
        },
      },
    },
  },
  body: null,
  user: null,
  logger: {
    error: console.error,
    info: console.info,
  },
};

// 模拟 Planlist 模型
const mockPlanlistModel = {
  findOne: async options => {
    console.log('查询数据库，用户名:', options.where.username);
    // 模拟数据库返回结果
    return {
      username: '用户名值',
      mainplans: '[1, 2, 3]', // 模拟存储的JSON字符串
    };
  },
};

// 模拟 ctx.model
mockCtx.model = {
  Planlist: mockPlanlistModel,
};

// 模拟 app.config
const mockApp = {
  config: {
    jwt: {
      jwtSecret: 'process.env.APP_JWT_SECRET',
    },
  },
};

mockCtx.app = mockApp;

// 导入并测试 PlanListService
const PlanListService = require('./app/service/Studyplan/PlanList');
const planListService = new PlanListService(mockCtx);

// 导入并测试 graphql_response_handler 中间件
const graphqlResponseHandler = require('./app/middleware/graphql_response_handler')();

// 模拟 next 函数
const mockNext = async () => {
  console.log('中间件 next 执行');
  // 模拟执行后的响应
  const result = await planListService.usergetPlanList(mockCtx.request.body.variables.params);
  mockCtx.body = {
    data: {
      usergetPlanlist: result,
    },
  };
};

// 执行测试
async function runTest() {
  console.log('===== 开始测试 =====');

  // 设置环境变量为开发环境
  process.env.NODE_ENV = 'development';

  try {
    // 执行中间件
    await graphqlResponseHandler(mockCtx, mockNext);

    console.log('\n测试结果:');
    console.log('验证后的用户信息:', mockCtx.user);
    console.log('最终响应:', JSON.stringify(mockCtx.body, null, 2));

    console.log('\n===== 测试完成 =====');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
runTest();
