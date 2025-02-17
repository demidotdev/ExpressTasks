'use strict';
// Migración creada para agregar la columna "userId" a la tabla "tasks"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) { // "queryInterface" es un objeto que permite interactuar con la base de datos
    await queryInterface.addColumn('Tasks', 'userId', { // Añadimos la columna "userId" a la tabla "tasks"
      type: Sequelize.INTEGER,
        references: { // Definimos la clave foránea
            model: { // Definimos el modelo al que hace referencia
            tableName: 'Users'}, // Nombre de la tabla en plural para que coincida con la base de datos
            key: 'id' // Definimos la columna a la que hace referencia
        },
  })
  },
/* "sequelize", para la llave foránea, asume el nombre de la tabla del modelo que está en singular 
y no coincidiría con el nombre de la tabla en plural de la base de datos */

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'userId'); // Eliminamos la columna "userId" de la tabla "tasks"
  }
};
