"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("session");
  },
};
