'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      File.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  File.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    size: DataTypes.INTEGER,
    type: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'File',
  });
  return File;
};
