'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('login', [
      {
        usuario: 'admin',
        senha: 'Rtx*67'
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('login', null, {});
  },
};
