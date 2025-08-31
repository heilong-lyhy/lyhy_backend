'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const tbn = 'subitem';
  const Subitem = app.model.define(tbn, {
    subid: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    planid: {
      type: INTEGER,
      allowNull: false,
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
    subdeadline: {
      type: DATE,
      allowNull: false,
      field: 'subdeadline',
    },
    updatedAt: {
      type: DATE,
      allowNull: false,
      field: 'updatedAt',
    },
    // subdeadline: {
    //   type: DATE,
    //   field: 'subdeadline',
    // },
    // updateAt: {
    //   type: DATE,
    //   field: 'updateAt',
    // },
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: tbn,
    // underscored: true,
  });

  // User.prototype.associate = function() {
  //   app.model.User.hasMany(app.model.Post, { as: 'posts' });
  // };
  return Subitem;
};
