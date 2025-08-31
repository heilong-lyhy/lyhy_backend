'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const tbn = 'userinfo'; // 修正表名
  const userinfo = app.model.define(tbn, {
    useruserid: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(2048),
      allowNull: false,
      field: 'username',
    },
    account: {
      type: STRING(2048),
      allowNull: false,
      field: 'account',
    },
    password: {
      type: STRING(2048),
      allowNull: false,
      field: 'password',
    },
    email: {
      type: STRING(2048),
      field: 'email',
    },
    usertype: {
      type: STRING(2048),
      field: 'usertype',
    },
    userslogan: {
      type: STRING(2048),
      field: 'userslogan',
    },
  }, {
    freezeTableName: true,
    timestamps: false,
    tableName: tbn,
    // underscored: true,
  });

  // User.prototype.associate = function() {
  //   app.model.User.hasMany(app.model.Post, { as: 'posts' });
  // };
  return userinfo;
};
