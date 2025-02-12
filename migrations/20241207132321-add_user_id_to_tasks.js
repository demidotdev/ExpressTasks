'use strict';
// Migración creada para agregar la columna "userId" a la tabla "tasks"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('tasks', 'userId', { // Añadimos la columna "userId" a la tabla "tasks"
      type: Sequelize.INTEGER,
        references: { // Definimos la clave foránea
            model: { // Definimos el modelo al que hace referencia
            tableName: 'Users'}, // Definimos la tabla a la que hace referencia
          key: 'id' // Definimos la columna a la que hace referencia
        },
  })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('tasks', 'userId'); // Eliminamos la columna "userId" de la tabla "tasks"
  }
};
