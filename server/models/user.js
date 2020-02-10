'use strict';
const { encryptPassword } = require('../helper/helper')

module.exports = (sequelize, DataTypes) => {
  const Sequelize = sequelize.Sequelize
  const Model = Sequelize.Model

  class User extends Model { }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (User, opt) => {
        User.password = encryptPassword(User.password)
      }
    }
    , sequelize
  });
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};