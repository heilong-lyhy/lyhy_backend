'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const tbn = 'plan';
  const Plan = app.model.define(tbn, {
    planid: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: INTEGER,
      allowNull: false,
      field: 'userid',
    },
    plantitle: {
      type: STRING(2048),
      allowNull: false,
      field: 'plantitle',
    },
    description: {
      type: STRING(2048),
      allowNull: false,
      field: 'description',
    },
    plancreatedAt: {
      type: DATE,
      field: 'plancreatedAt',
    },
    plandeadline: {
      type: DATE,
      field: 'plandeadline',
    },
  }, {
    freezeTableName: true, // 启用表名冻结，防止Sequelize自动复数化表名
    timestamps: false, // 禁用自动生成的时间戳字段
    tableName: tbn, // 显式指定表名
    createdAt: false, // 明确禁用createdAt字段
    updatedAt: false, // 明确禁用updatedAt字段
    underscored: false, // 禁用下划线命名约定
  });

  // User.prototype.associate = function() {
  //   app.model.User.hasMany(app.model.Post, { as: 'posts' });
  // };
  return Plan;
};
