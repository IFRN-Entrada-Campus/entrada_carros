'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const viewDefinition = `
      CREATE VIEW vwhistoricoaluno AS
      SELECT he.placa,
             he.dataHora,
             he.img,
             a.noAluno AS nome,
             a.matriculaAluno AS matricula
      FROM historicoentrada he
      JOIN carro c ON he.idCarroRel = c.idCarro
      JOIN aluno a ON c.matriculaRel = a.matriculaAluno;
    `;

    return queryInterface.sequelize.query(viewDefinition);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query('DROP VIEW IF EXISTS vw_historico_aluno;');
  },
};