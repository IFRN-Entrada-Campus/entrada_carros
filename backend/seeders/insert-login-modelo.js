'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('login', [
      {
        usuario: 'admin1',
        senha: '$2b$10$B48AwOk4psGv6zGvzkcbUeRLtVFTIdlp.FChRWKzuI8EkLs4bWffq'
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('login', null, {});
  },
};
