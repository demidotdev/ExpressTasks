"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("session", {
    sid: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    sess: {
      type: Sequelize.JSON,
    },
    expires: {
      allowNull: false,
      type: "TIMESTAMP",
    },
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("session");
}
