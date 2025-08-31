'use strict';

module.exports = app => {
  const { STRING, INTEGER, DataTypes } = app.Sequelize;

  const tbn = 'planlist';
  const Planlist = app.model.define(tbn, {
    userid: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'userid',
    },
    username: {
      type: STRING,
      allowNull: false,
    },
    mainplans: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'mainplans',
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
  return Planlist;
};
