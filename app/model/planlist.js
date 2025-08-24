'use strict';

module.exports = app => {
  const { STRING, DataTypes } = app.Sequelize;

  const tbn = 'Planlist';
  const Planlist = app.model.define(tbn, {
    username: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
    },
    mainplans: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'mainplans',
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
  return Planlist;
};
