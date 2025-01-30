"use strict";
// Usando sintaxis CJS (ver diferencia con ESM acá https://nodejs.org/docs/latest/api/packages.html)
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {

 class Task extends Model {
      static associate(models) {
        Task.belongsTo(models.User, {
          as: "user",
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

/* Antigua sintaxis =>
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
       foreignKey: "userId",
     });
     Task.belongsToMany(models.Category, {
       through: "TaskCategories",
       as: "categories",
       foreignKey: "categoryId",
     });
   };
   */