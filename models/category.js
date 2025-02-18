'use strict';
/**
 * Los modelos son una forma de interactuar con la base de datos.
 * Se pueden crear, modificar y eliminar registros de la base de datos.
 * Estos archivos son generados de forma automática por el CLI de Sequelize.
 */
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => { // Definimos el modelo "Category"
  class Category extends Model {
    static associate(models) { // Definimos las asociaciones
      Category.belongsToMany(models.Task, { // Definimos la relación "muchos a muchos"
        through: "TaskCategories", // Definimos la tabla intermedia (./taskcategories.js)
        as: "tasks",// Definimos el alias
        foreignKey: "taskId" // Definimos la clave foránea
    });
    }
  }
  Category.init({ // Definimos los campos del modelo
    title: DataTypes.STRING,
    color: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Category',// Definimos el nombre del modelo
  });
  return Category;
};