"use strict";
// Usando sintaxis CJS (ver diferencia con ESM acá https://nodejs.org/docs/latest/api/packages.html)
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

 class Task extends Model {
      static associate(models) {
        Task.belongsTo(models.User, { // 1 a 1
          as: "user", // "as" para uniformidad usando mayúsculas y minúsculas
          foreignKey: "userId",// Definimos al campo "userId" como clave foráneas
        });
        Task.belongsToMany(models.Category, {
          through: "TaskCategories", // Definimos la tabla intermedia (./taskcategories.js)
          as: "categories", // "as" para uniformidad usando mayúsculas y minúsculas
          foreignKey: "categoryId", // Definimos al campo "categoryId" como clave foráneas
        });
      };
    };
   Task.init(
     {
       description: DataTypes.TEXT,// Definimos el campo "description" como tipo texto
     },
     {
       sequelize,
       modelName: "Task",
     }
   );

const socket = require('../realtime/client');

  Task.afterCreate(function (task, options) {
  socket.emit('new_task', task);
  })
 
  return Task;
};