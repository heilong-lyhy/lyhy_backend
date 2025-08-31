// 测试subitem表名配置修复是否有效

// 加载Egg.js应用
const { Application } = require('egg');
const app = new Application();

async function testSubitemTable() {
  try {
    // 初始化应用
    await app.ready();
    console.log('Egg.js应用初始化成功');
    
    // 输出subitem模型配置信息
    console.log('\n=== Subitem模型配置信息 ===');
    console.log('表名配置:', app.model.Subitem.getTableName());
    console.log('原始表名:', app.model.Subitem.tableName);
    
    // 尝试简单查询，测试表是否存在
    console.log('\n=== 测试查询subitem表 ===');
    try {
      // 查询所有subitem记录
      const subitems = await app.model.Subitem.findAll({
        limit: 5, // 限制返回记录数
        attributes: ['subid', 'planid', 'subtitle'], // 只查询部分字段
      });
      
      console.log('查询成功，返回记录数:', subitems.length);
      if (subitems.length > 0) {
        console.log('部分记录示例:', subitems.slice(0, 2));
      }
      console.log('\n修复成功！subitem表名配置正确，不再出现复数化问题。');
    } catch (error) {
      console.error('查询失败:', error.message);
      if (error.original && error.original.sqlMessage) {
        console.error('SQL错误详情:', error.original.sqlMessage);
      }
      console.error('\n修复可能未成功，请检查subitem.js中的表名配置。');
    }
  } catch (error) {
    console.error('应用初始化失败:', error);
  } finally {
    // 关闭应用
    await app.close();
  }
}

// 运行测试
console.log('开始测试subitem表名配置...');
testSubitemTable().then(() => {
  console.log('\n测试完成');
});