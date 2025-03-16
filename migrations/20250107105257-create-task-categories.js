// Migración para crear la tabla "join" de ralación de Task y Categories
"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("TaskCategories", {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    //"taskId" y "categoryId" son las claves foráneas
    taskId: {
      type: Sequelize.INTEGER,
      references: {
        // "model" es un objeto que define el modelo al que hace referencia
        model: {
          tableName: "Tasks",
        }, // "tableName" es el nombre de la tabla en plural
        key: "id", // Definimos la columna con el identificador único de la clave foránea
      },
    },
    categoryId: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: "Categories",
        },
        key: "id",
      },
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("TaskCategories");
}
