'use strict';

module.exports = app => {
  const { STRING, INTEGER, JSON, ENUM, DATE } = app.Sequelize;

  const tbn = 'subitem';
  const Subitem = app.model.define(tbn, {
    subid: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    planid: {
      type: INTEGER,
      allowNull: true,
      field: 'planid',
    },
    subtitle: {
      type: STRING(2048),
      allowNull: false,
      field: 'subtitle',
    },
    description: {
      type: STRING(2048),
      allowNull: false,
      field: 'description',
    },
    completed: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'completed',
    },
    created_at: {
      type: DATE,
      allowNull: false,
      field: 'created_at',
    },
    updated_at: {
      type: DATE,
      allowNull: false,
      field: 'updated_at',
    },
    // createdAt: {
    //   type: DATE,
    //   field: 'createdAt',
    // },
    // updateAt: {
    //   type: DATE,
    //   field: 'updateAt',
    // },
  }, {
    // freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at', // 可自定义字段名
    updatedAt: 'updated_at'
    // tableName: tbn,
    // underscored: true,
  });

  // User.prototype.associate = function() {
  //   app.model.User.hasMany(app.model.Post, { as: 'posts' });
  // };
  return Subitem;
};
