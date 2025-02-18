// El objetivo de este archivo es crear la tabla de ralación "muchos a muchos"
// de Task y Categories, conocida como tabla "join" o tabla intermedia
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
    taskId: DataTypes.INTEGER, // Definimos los campos de las relaciones
    categoryId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TaskCategories',
  });
  return TaskCategories;
};