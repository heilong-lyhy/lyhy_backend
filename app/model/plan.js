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
      allowNull: true,
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
    // freezeTableName: true,
    timestamps: false,
    // tableName: tbn,
    // underscored: true,
  });

  // User.prototype.associate = function() {
  //   app.model.User.hasMany(app.model.Post, { as: 'posts' });
  // };
  return Plan;
};
