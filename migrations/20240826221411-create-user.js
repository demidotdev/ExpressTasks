'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', { // Creamos la tabla "Users"
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: { // Definimos la columna "email"
        type: Sequelize.STRING,
        unique: true,// Definimos la columna como única, 1 user 1 email
        allowNull: false // No permitimos valores nulos
      },
      password_hash: { // Definimos la columna "password_hash" la cual contendrá la contraseña encriptada
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users'); // Eliminamos la tabla "Users"
  }
};