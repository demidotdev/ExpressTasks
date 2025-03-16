"use strict";
// Migración creada para agregar la columna "userId" a la tabla "tasks"
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Tasks", "userId", {
    type: Sequelize.INTEGER,
    references: {
      model: {
        tableName: "Users",
      }, // Nombre de la tabla en plural para que coincida con la base de datos
      key: "id", // Definimos la columna a la que hace referencia
    },
  });
}
export /* "sequelize", para la llave foránea, asume el nombre de la tabla del modelo que está en singular
  y no coincidiría con el nombre de la tabla en plural de la base de datos */
async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Tasks", "userId"); // Eliminamos la columna "userId" de la tabla "tasks"
}
