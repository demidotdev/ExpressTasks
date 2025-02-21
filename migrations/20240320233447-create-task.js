'use strict';
/**
 * Las migraciones son una forma de realizar cambios en la estructura de la base de datos.
 * Se pueden crear, modificar y eliminar tablas, columnas, índices, etc.
 * Estos archivos son generados de forma automática por el CLI de Sequelize.
 * Recordar que para ejecutar las migraciones se debe ejecutar el comando "sequelize db:migrate"
 * y para eliminar las migraciones se debe ejecutar el comando "sequelize db:migrate:undo"
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) { // Método para crear la tabla
    await queryInterface.createTable('Tasks', { // Creamos la tabla "Tasks"
      id: { // Definimos la columna "id"
        allowNull: false, // No permitimos valores nulos
        autoIncrement: true, // Permitimos autoincremento
        primaryKey: true, // Definimos la columna como clave primaria
        type: Sequelize.INTEGER // Definimos el tipo de dato como entero
      },
      description: { // Definimos la columna "description"
        type: Sequelize.TEXT
      },
      createdAt: { // Definimos la columna "createdAt"
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: { // Definimos la columna "updatedAt"
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) { // Método para eliminar la tabla
    await queryInterface.dropTable('Tasks'); // Eliminamos la tabla "Tasks"
  }
};