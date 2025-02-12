"use strict";
// Usando sintaxis CJS (ver diferencia con ESM acá https://nodejs.org/docs/latest/api/packages.html)
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

 class Task extends Model {
      static associate(models) {
        Task.belongsTo(models.User, { // 1 a 1
          as: "user", // alias para dar uniformidad a los nombres de las asociaciones
          foreignKey: "userId",
        });
        Task.belongsToMany(models.Category, {
          through: "TaskCategories",
          as: "categories",
          foreignKey: "categoryId",
        });
      };
    };
   Task.init(
     {
       description: DataTypes.TEXT,
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