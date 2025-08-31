// 文件分析脚本，直接读取subitem.js文件内容验证修复是否正确
const fs = require('fs');
const path = require('path');

// 读取subitem.js文件内容
function verifySubitemFix() {
  const filePath = path.join(__dirname, 'app', 'model', 'subitem.js');
  
  try {
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log('成功读取subitem.js文件');
    
    // 检查freezeTableName配置
    const freezeTableNameMatch = fileContent.match(/freezeTableName:\s*(true|false)/);
    const hasFreezeTableName = freezeTableNameMatch && freezeTableNameMatch[1] === 'true';
    
    // 检查tableName配置
    const tableNameMatch = fileContent.match(/tableName:\s*(["'])(.+?)\1/);
    const hasCorrectTableName = tableNameMatch && tableNameMatch[2] === 'subitem';
    
    // 检查是否有注释掉的配置
    const hasCommentedFreezeTableName = fileContent.match(/\/\/\s*freezeTableName/) !== null;
    const hasCommentedTableName = fileContent.match(/\/\/\s*tableName/) !== null;
    
    // 输出验证结果
    console.log('\n=== 表名配置验证结果 ===');
    console.log('freezeTableName设置为true:', hasFreezeTableName);
    console.log('tableName设置为"subitem":', hasCorrectTableName);
    console.log('freezeTableName是否被注释:', hasCommentedFreezeTableName);
    console.log('tableName是否被注释:', hasCommentedTableName);
    
    // 综合判断修复是否成功
    if (hasFreezeTableName && hasCorrectTableName && !hasCommentedFreezeTableName && !hasCommentedTableName) {
      console.log('\n✅ 修复成功！subitem模型的表名配置正确。');
      console.log('这应该可以解决"Table \'planwebdatabase.subitems\' doesn\'t exist"错误。');
    } else {
      console.log('\n❌ 修复未完全成功！请检查以下问题：');
      if (!hasFreezeTableName) console.log('- freezeTableName未设置为true');
      if (!hasCorrectTableName) console.log('- tableName未正确设置为"subitem"');
      if (hasCommentedFreezeTableName) console.log('- freezeTableName配置被注释');
      if (hasCommentedTableName) console.log('- tableName配置被注释');
    }
    
    // 显示相关配置的具体代码片段
    console.log('\n=== 相关配置代码片段 ===');
    const optionsBlock = fileContent.match(/},\s*{(.*?)\n\s*\});/s);
    if (optionsBlock) {
      console.log(optionsBlock[0]);
    }
  } catch (error) {
    console.error('读取文件失败:', error);
  }
}

// 运行验证
console.log('开始验证subitem.js文件的表名配置修复...');
verifySubitemFix();