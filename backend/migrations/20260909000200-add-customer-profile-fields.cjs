"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("customers", "citizen_registration_no", {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn("customers", "living_address", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("customers", "living_address");
    await queryInterface.removeColumn("customers", "citizen_registration_no");
  },
};
