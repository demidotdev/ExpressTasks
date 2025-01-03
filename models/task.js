"use strict";
// const { Model } = require("sequelize");
// Usando sintaxis CJS (ver diferencia con ESM acá https://nodejs.org/docs/latest/api/packages.html)
module.exports = (sequelize, DataTypes) => {
  // Recibe 1º El objeto conectado a la base de datos: "sequelize", 2º Una clase "DataTypes" que contiene
  // todos los diferentes tipos de datos disponibles para definir el modelo

  //Aprovechando la información recibida en los parámetros generámos un nuevo modelo
  const Task = sequelize.define(
    "Task",
    {
      description: DataTypes.TEXT,
    },
    {}
  );

  Task.associate = function (models) {
    // define association here
    Task.belongsTo(models.User, { 
      as: "user",
      foreignKey: "userId" 
    });
  }
  // class Task extends Model {
  //   /**
  //    * Helper method for defining associations.
  //    * This method is not a part of Sequelize lifecycle.
  //    * The `models/index` file will call this method automatically.
  //    */
  //   // static associate(models) {
  //   //   // define association here
  //   // }
  // }
  // task.init(
  //   {
  //     description: DataTypes.TEXT,
  //   },
  //   {
  //     sequelize,
  //     modelName: "task",
  //   }
  // );
  return Task;
};
