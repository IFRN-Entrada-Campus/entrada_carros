'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('aluno', [
      {
        noAluno: 'Aluno modelo 1',
        matriculaAluno: 12345678910,
      },
      {
        noAluno: 'Aluno modelo 2',
        matriculaAluno: 29876543210,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('aluno', null, {});
  },
};
