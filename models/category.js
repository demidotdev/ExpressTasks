'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsToMany(models.Task, {
        through: "TaskCategories",
        as: "tasks",
        foreignKey: "taskId"
    });
    }
  }
  Category.init({
    title: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};