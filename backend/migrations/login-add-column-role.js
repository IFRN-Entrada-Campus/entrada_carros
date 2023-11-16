'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('login', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('login', 'role');
  }
};
