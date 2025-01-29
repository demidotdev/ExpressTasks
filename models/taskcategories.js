'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskCategories extends Model {

    static associate(models) {
      // define association here
    }
  }
  TaskCategories.init({
    taskId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TaskCategories',
  });
  return TaskCategories;
};