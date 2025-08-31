// 简化版测试脚本，直接验证subitem模型的表名配置

// 直接加载subitem模型文件并分析其配置
const path = require('path');

// 模拟app对象
const mockApp = {
  Sequelize: {
    STRING: 'STRING',
    INTEGER: 'INTEGER',
    DATE: 'DATE'
  },
  model: {
    define: function(tableName, attributes, options) {
      // 保存定义信息
      this.definition = {
        tableName,
        attributes,
        options
      };
      // 返回一个模拟模型对象
      return {
        getTableName: function() {
          return options.tableName || tableName;
        }
      };
    }
  }
};

// 加载subitem模型文件
console.log('加载subitem模型文件...');
const subitemModelFactory = require('./app/model/subitem');
const Subitem = subitemModelFactory(mockApp);

// 分析模型配置
console.log('\n=== Subitem模型配置分析 ===');
console.log('表名配置:', Subitem.getTableName());
console.log('freezeTableName选项:', mockApp.model.definition.options.freezeTableName);
console.log('tableName选项:', mockApp.model.definition.options.tableName);
console.log('原始表名常量:', mockApp.model.definition.tableName);

// 验证修复是否正确
const isFixed = mockApp.model.definition.options.freezeTableName === true && 
                mockApp.model.definition.options.tableName === 'subitem';

console.log('\n=== 修复验证结果 ===');
if (isFixed) {
  console.log('✅ 修复成功！subitem模型的表名配置正确设置了freezeTableName和tableName。');
  console.log('这应该可以解决"Table \'planwebdatabase.subitems\' doesn\'t exist"错误。');
} else {
  console.log('❌ 修复未成功！subitem模型的表名配置仍有问题。');
  console.log('请检查app/model/subitem.js文件中的freezeTableName和tableName配置。');
}

console.log('\n=== 配置详情 ===');
console.log(JSON.stringify(mockApp.model.definition.options, null, 2));