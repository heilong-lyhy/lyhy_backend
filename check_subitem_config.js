// 简单的配置检查脚本
const fs = require('fs');
const path = require('path');

// 读取文件并检查配置
function checkSubitemConfig() {
  const filePath = path.join(__dirname, 'app', 'model', 'subitem.js');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取文件失败:', err);
      return;
    }
    
    console.log('成功读取subitem.js文件');
    
    // 检查关键配置
    const hasFreezeTableName = data.includes('freezeTableName: true');
    const hasTableName = data.includes('tableName: tbn');
    const isCommentedFreeze = data.includes('// freezeTableName: true');
    const isCommentedTable = data.includes('// tableName: tbn');
    
    // 输出检查结果
    console.log('\n=== 配置检查结果 ===');
    console.log('freezeTableName设置为true:', hasFreezeTableName);
    console.log('tableName设置为tbn:', hasTableName);
    console.log('freezeTableName被注释:', isCommentedFreeze);
    console.log('tableName被注释:', isCommentedTable);
    
    // 综合判断
    const isCorrectlyConfigured = hasFreezeTableName && hasTableName && !isCommentedFreeze && !isCommentedTable;
    
    if (isCorrectlyConfigured) {
      console.log('\n✅ 配置正确！subitem模型的表名配置已修复。');
      console.log('这应该可以解决"Table \'planwebdatabase.subitems\' doesn\'t exist"错误。');
    } else {
      console.log('\n❌ 配置仍有问题！请检查subitem.js文件中的相关设置。');
      console.log('错误原因可能是：Sequelize默认会将表名复数化，所以subitem被变成了subitems');
      console.log('但数据库中实际表名可能是单数的subitem，导致找不到表的错误。');
    }
    
    // 显示附近的代码片段
    console.log('\n=== 配置代码片段 ===');
    const lines = data.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('freezeTableName') || lines[i].includes('tableName')) {
        console.log(`${i+1}: ${lines[i]}`);
      }
    }
  });
}

// 运行检查
console.log('开始检查subitem.js的表名配置...');
checkSubitemConfig();