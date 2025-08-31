const dayjs = require('dayjs');

// 测试日期格式化逻辑
async function testTimeFormat() {
  try {
    // 模拟plan数据
    const mockPlan = {
      planid: 1,
      plantitle: '测试计划',
      description: '测试计划描述',
      plancreatedAt: new Date('2023-01-01T00:00:00Z'),
      plandeadline: new Date('2023-12-31T23:59:59Z')
    };

    // 模拟subitem数据
    const mockSubitems = [
      {
        subid: 1,
        subtitle: '测试子任务1',
        description: '测试子任务1描述',
        completed: 1,
        created_at: new Date('2023-01-02T00:00:00Z'),
        updated_at: new Date('2023-01-03T00:00:00Z')
      },
      {
        subid: 2,
        subtitle: '测试子任务2',
        description: '测试子任务2描述',
        completed: 0,
        created_at: null,
        updated_at: null,
      },
    ];

    // 格式化日期和整合数据
    const formatDate = date => {
      try {
        // 返回dayjs对象而不是格式化字符串
        return dayjs(date);
      } catch (error) {
        console.error('日期格式化错误:', error);
        // 发生错误时返回一个新的dayjs对象
        return dayjs();
      }
    };

    // 模拟PlanList.js中的数据处理逻辑
    const result = {
      planid: mockPlan.planid || '',
      plantitle: mockPlan.plantitle || '',
      description: mockPlan.description || '',
      createdAt: formatDate(mockPlan.plancreatedAt),
      deadline: formatDate(mockPlan.plandeadline),
      subItems: mockSubitems.map(item => ({
        subid: item.subid || '',
        subtitle: item.subtitle || '',
        description: item.description || '',
        completed: item.completed === 1, // 转换为布尔值
        createdAt: item.created_at ? dayjs(item.created_at) : dayjs(),
        updatedAt: item.updated_at ? dayjs(item.updated_at) : dayjs(),
      })),
    };

    // 验证日期格式 - 注意dayjs对象不是通过instanceof检测的
    console.log('测试结果:');
    console.log('plan.createdAt 是否为dayjs对象:', result.createdAt.isValid() && typeof result.createdAt.format === 'function');
    console.log('plan.deadline 是否为dayjs对象:', result.deadline.isValid() && typeof result.deadline.format === 'function');
    result.subItems.forEach((item, index) => {
      console.log(`subItems[${index}].createdAt 是否为dayjs对象:`, item.createdAt.isValid() && typeof item.createdAt.format === 'function');
      console.log(`subItems[${index}].updatedAt 是否为dayjs对象:`, item.updatedAt.isValid() && typeof item.updatedAt.format === 'function');
    });

    // 输出格式化的日期字符串以验证dayjs对象是否可用
    console.log('\n格式化日期验证:');
    console.log('plan.createdAt 格式化:', result.createdAt.format('YYYY-MM-DD HH:mm:ss'));
    console.log('plan.deadline 格式化:', result.deadline.format('YYYY-MM-DD HH:mm:ss'));
    result.subItems.forEach((item, index) => {
      console.log(`subItems[${index}].createdAt 格式化:`, item.createdAt.format('YYYY-MM-DD HH:mm:ss'));
      console.log(`subItems[${index}].updatedAt 格式化:`, item.updatedAt.format('YYYY-MM-DD HH:mm:ss'));
    });

    console.log('\n测试成功完成!');
    return result;
  } catch (error) {
    console.error('测试失败:', error);
    throw error;
  }
}

// 执行测试
async function runTest() {
  try {
    await testTimeFormat();
  } catch (error) {
    console.error('测试执行失败:', error);
    process.exit(1);
  }
}

// 运行测试
runTest();